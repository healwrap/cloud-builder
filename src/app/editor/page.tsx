"use client";

import React, { useEffect } from "react";
import { Allotment } from "allotment";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import EditorHeader from "@/components/editor/header";
import ComponentPanel from "@/components/editor/component-panel";
import Canvas from "@/components/editor/canvas";
import Setting from "@/components/editor/setting";
import Loading from "@/components/ui/Loading";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useProjectData } from "@/hooks/useProject";
import useComponentStore from "@/stores/component";

export default function EditorPage() {
	const { isLoaded } = useUser();
	const searchParams = useSearchParams();
	const projectId = searchParams.get("projectId");

	const {
		project,
		loading: projectLoading,
		saveProject,
	} = useProjectData(projectId || undefined);
	const { setComponents, components, resetActiveStates } = useComponentStore();

	// 当项目数据加载完成时，更新组件存储
	useEffect(() => {
		if (project && project.components) {
			setComponents(project.components);
		}
	}, [project, setComponents]);

	// 当组件卸载时重置激活状态
	useEffect(() => {
		return () => {
			resetActiveStates();
		};
	}, [resetActiveStates]);

	if (!isLoaded || projectLoading) {
		return <Loading />;
	}

	return (
		<div className="min-h-screen h-screen flex flex-col bg-white">
			<EditorHeader
				projectName={project?.name}
				projectId={projectId}
				components={components}
				saveProject={saveProject}
			/>
			<DndProvider backend={HTML5Backend}>
				<Allotment>
					<Allotment.Pane minSize={270} preferredSize={"20%"}>
						<ComponentPanel />
					</Allotment.Pane>
					<Allotment.Pane minSize={400} preferredSize={"60%"}>
						<Canvas />
					</Allotment.Pane>
					<Allotment.Pane minSize={270} preferredSize={"20%"}>
						<Setting />
					</Allotment.Pane>
				</Allotment>
			</DndProvider>
		</div>
	);
}
