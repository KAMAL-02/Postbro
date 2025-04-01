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
      <div className="h-full">
        <ResizablePanelGroup direction="vertical" className="">
          <ResizablePanel className="w-full">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Request />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Response />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  };
  
  export default Rest;
  