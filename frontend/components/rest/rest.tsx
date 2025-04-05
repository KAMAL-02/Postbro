"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Request from "./request";
import Response from "./response";

const Rest = () => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="vertical" className="h-full">
        <ResizablePanel className="w-full" defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto max-w-full">
              <Request />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="w-full max-w-full overflow-x-auto" minSize={30}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <Response />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Rest;
