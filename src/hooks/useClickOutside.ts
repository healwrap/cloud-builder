import { useEffect, useRef } from "react";

type ClickOutsideHandler = (event: MouseEvent | TouchEvent) => void;

function useClickOutside<T extends HTMLElement = HTMLDivElement>(
	handler: ClickOutsideHandler,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	excludeRefs: React.RefObject<any>[] = []
): React.RefObject<T | null> {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;

			// 如果点击的是目标元素内部，则不处理
			if (ref.current && ref.current.contains(target)) {
				return;
			}

			// 检查是否点击在排除的元素内
			const isExcluded = excludeRefs.some(
				(excludeRef) =>
					excludeRef.current && excludeRef.current.contains(target)
			);

			if (isExcluded) {
				return;
			}

			handler(event);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [handler, excludeRefs]);

	return ref;
}

export default useClickOutside;
