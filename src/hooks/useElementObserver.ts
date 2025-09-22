import { useEffect, useRef, useCallback } from "react";

/**
 * 监听元素的位置和大小变化的hook
 * @param element 需要监听的HTML元素
 * @param callback 元素大小或位置变化时的回调函数
 * @param deps 依赖数组，当依赖变化时重新设置观察器
 * @returns 无
 */
export default function useElementObserver(
	element: HTMLElement | null,
	callback: () => void,
	deps: React.DependencyList = []
) {
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const elementMutationObserverRef = useRef<MutationObserver | null>(null);
	const parentMutationObserverRef = useRef<MutationObserver | null>(null);
	const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
	const scrollListenersRef = useRef<
		{ element: HTMLElement; listener: EventListener }[]
	>([]);
	const forceUpdateRef = useRef<number>(0);

	// 创建清理观察器的函数
	const cleanup = useCallback(() => {
		// 清理ResizeObserver
		if (resizeObserverRef.current) {
			resizeObserverRef.current.disconnect();
			resizeObserverRef.current = null;
		}

		// 清理元素MutationObserver
		if (elementMutationObserverRef.current) {
			elementMutationObserverRef.current.disconnect();
			elementMutationObserverRef.current = null;
		}

		// 清理父元素MutationObserver
		if (parentMutationObserverRef.current) {
			parentMutationObserverRef.current.disconnect();
			parentMutationObserverRef.current = null;
		}

		// 清理IntersectionObserver
		if (intersectionObserverRef.current) {
			intersectionObserverRef.current.disconnect();
			intersectionObserverRef.current = null;
		}

		// 清理滚动事件监听器
		scrollListenersRef.current.forEach(({ element, listener }) => {
			element.removeEventListener("scroll", listener);
		});
		scrollListenersRef.current = [];

		// 清理window事件监听器
		window.removeEventListener("scroll", callback);
		window.removeEventListener("resize", callback);
	}, [callback]);

	// 当deps变化时，通过更新forceUpdateRef来触发useEffect重新运行
	useEffect(() => {
		forceUpdateRef.current += 1;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps]);

	useEffect(() => {
		// 如果没有元素或回调函数，则不执行任何操作
		if (!element || !callback) {
			return cleanup;
		}

		// 清除之前的所有观察器和事件监听器
		cleanup();

		// 创建ResizeObserver监听元素大小变化
		resizeObserverRef.current = new ResizeObserver(() => {
			callback();
		});

		// 创建MutationObserver监听元素属性变化（可能影响位置）
		elementMutationObserverRef.current = new MutationObserver(() => {
			callback();
		});

		// 开始观察元素
		resizeObserverRef.current.observe(element);
		elementMutationObserverRef.current.observe(element, {
			attributes: true,
			attributeFilter: ["style", "class"], // 过滤只监听样式和类变化
			childList: false,
			subtree: false,
		});

		// 监听父元素树的变化（可能影响位置）
		if (element.parentElement) {
			parentMutationObserverRef.current = new MutationObserver(() => {
				callback();
			});

			// 观察从父元素到body的所有祖先元素
			let parent: HTMLElement | null = element.parentElement;
			while (parent && parent !== document.body) {
				parentMutationObserverRef.current.observe(parent, {
					attributes: true,
					attributeFilter: ["style", "class"],
					childList: true, // 监听子元素变化
					subtree: false,
				});

				// 添加滚动事件监听
				const scrollListener = () => callback();
				parent.addEventListener("scroll", scrollListener, { passive: true });
				scrollListenersRef.current.push({
					element: parent,
					listener: scrollListener,
				});

				parent = parent.parentElement;
			}

			// 监听window的滚动和调整大小事件
			window.addEventListener("scroll", callback, { passive: true });
			window.addEventListener("resize", callback, { passive: true });
		}

		// 使用IntersectionObserver监测元素位置在视口中的变化
		intersectionObserverRef.current = new IntersectionObserver(
			() => {
				callback();
			},
			{
				threshold: [0, 0.5, 1.0], // 监测多个阈值点
				root: null, // 相对于视口
			}
		);
		intersectionObserverRef.current.observe(element);

		// 清理函数
		return cleanup;
		// 依赖关系中包含forceUpdateRef.current以确保deps变化时重新执行
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [element, callback, cleanup, forceUpdateRef.current]);
}
