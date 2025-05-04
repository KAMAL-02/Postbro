"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuthStore } from "@/utils/store/authStore";
import { NotAuthorized } from "../not-authorized";
import Request from "./request";
import Response from "./response";

import React from "react";

export const Realtime = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <NotAuthorized />;
  }

  return (
    <div className="h-screen">
      <div className="h-full flex-1">
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel className="w-full" defaultSize={50} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto max-w-full">
                  <Request />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle className=" bg-gray-600 hover:bg-orange-500" />
            <ResizablePanel className="" minSize={30}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                 <Response />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
    </div>
  );
};
