"use client";

import { useTabStore } from "@/utils/store/tabStore";
import { useRequestStore } from "@/utils/store/requestStore";
import { useResponseStore } from "@/utils/store/responseStore";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";
import TabTitleEdit from "../dialog/tab-title";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TabsBar = () => {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab, updateTabTitle } = useTabStore();
  const { initRequest, requests } = useRequestStore();
  const { initResponse, responses } = useResponseStore();

  useEffect(() => {
    if (activeTabId) {
      const tabExists = tabs.some((tab) => tab.id === activeTabId);
      const alreadyInitialized =
        requests[activeTabId] && responses[activeTabId];

      if (tabExists && !alreadyInitialized) {
        initRequest(activeTabId);
        initResponse(activeTabId);
      }
    }
  }, [activeTabId, tabs, initRequest, initResponse, requests, responses]);

  return (
    <div className="flex items-center ml-1 bg-[#121212] text-white overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-2 py-2 cursor-pointer ${
            tab.id === activeTabId ? "border-b-1 border-gray-600" : ""
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span
            className={`mr-2 text-xs font-medium ${
              tab.method === "GET"
                ? "text-green-400"
                : tab.method === "POST"
                ? "text-yellow-400"
                : tab.method === "PUT"
                ? "text-blue-400"
                : tab.method === "DELETE"
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {tab.method}
          </span>
          <TabTitleEdit tabId={tab.id} currentTitle={tab.title} onSave={(id, newTitle) => updateTabTitle(id, newTitle)}
            trigger={
              <span className="max-w-xs text-sm truncate">{tab.title}</span>
            }
            />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="ml-3 p-1 text-gray-300 cursor-pointer rounded hover:bg-[#282828]"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
              >
                <X size={13} />
              </button>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                className="text-[#df894c] text-sm"
              >
                Close
              </TooltipContent>
          </Tooltip>
        </div>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
        <button
        className="px-1 py-1 ml-2 rounded hover:bg-[#282828] text-gray-300 cursor-pointer"
        onClick={addTab}
      >
        <Plus size={16} />
      </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="text-[#df894c] text-sm"
        >New</TooltipContent>

      </Tooltip>
    </div>
  );
};

export default TabsBar;
