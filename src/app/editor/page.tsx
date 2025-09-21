"use client";

import React from "react";
import { Allotment } from "allotment";
import { useUser } from "@clerk/nextjs";
import EditorHeader from "@/components/editor/header";
import Material from "@/components/editor/material";
import Canvas from "@/components/editor/canvas";
import Setting from "@/components/editor/setting";
import Loading from "@/components/ui/Loading";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function EditorPage() {
	const { isLoaded } = useUser();

	if (!isLoaded) {
		return <Loading />;
	}

	return (
		<div className="min-h-screen h-screen flex flex-col bg-white">
			<EditorHeader />
			<DndProvider backend={HTML5Backend}>
				<Allotment>
					<Allotment.Pane minSize={200} preferredSize={"20%"}>
						<Material />
					</Allotment.Pane>
					<Allotment.Pane minSize={400} preferredSize={"60%"}>
						<Canvas />
					</Allotment.Pane>
					<Allotment.Pane minSize={200} preferredSize={"20%"}>
						<Setting />
					</Allotment.Pane>
				</Allotment>
			</DndProvider>
		</div>
	);
}
