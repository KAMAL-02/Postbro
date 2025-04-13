// "use client";

// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import Request from "./request";
// import Response from "./response";
// import TabsBar from "./tabs-bar";
// import { useTabStore } from "@/utils/store/tabStore";
// import { FadeLoader } from "react-spinners";
// import { useEffect } from "react";
// import { HistorySidebar } from "../history-sidebar";


// const Rest = () => {
//   const { activeTabId, tabs, addTab, loadingFromHistory } = useTabStore();

//   useEffect(() => {
//     if (tabs.length === 0) {
//       addTab();
//     }
//   }, [tabs.length, addTab]);

//   if (!activeTabId || tabs.length === 0) {
//     return (
//       <div className="h-screen w-screen flex items-center justify-center">
//         <FadeLoader
//           color="#df894c"
//           height={12}
//           width={4}
//           margin={1}
//           radius={0}
//           speedMultiplier={3}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen max-h-screen flex flex-row">
//       <div className="flex flex-col h-full flex-grow min-w-0">
//         <TabsBar />
//         <div className="h-full flex-1">
//           <ResizablePanelGroup direction="vertical" className="h-full">
//             <ResizablePanel className="w-full" defaultSize={50} minSize={30}>
//               <div className="flex flex-col h-full">
//                 <div className="flex-1 overflow-auto max-w-full">
//                   <Request tabId={activeTabId} />
//                 </div>
//               </div>
//             </ResizablePanel>
//             <ResizableHandle className=" bg-gray-600 hover:bg-orange-500" />
//             <ResizablePanel className="" minSize={30}>
//               <div className="flex flex-col h-full">
//                 <div className="flex-1 overflow-auto">
//                   <Response tabId={activeTabId} />
//                 </div>
//               </div>
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </div>
//       </div>
//       <div className=" shrink-0">
//         <HistorySidebar />
//       </div>
//     </div>
//   );
// };

// export default Rest;

"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Request from "./request";
import Response from "./response";
import TabsBar from "./tabs-bar";
import { useTabStore } from "@/utils/store/tabStore";
import { FadeLoader } from "react-spinners";
import { useEffect } from "react";
import { HistorySidebar } from "../history-sidebar";

const Rest = () => {
  const { activeTabId, tabs, addTab, loadingFromHistory } = useTabStore();

  useEffect(() => {
    if (tabs.length === 0) {
      addTab();
    }
  }, [tabs.length, addTab]);

  if (!activeTabId || tabs.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <FadeLoader
          color="#df894c"
          height={12}
          width={4}
          margin={1}
          radius={0}
          speedMultiplier={3}
        />
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-row relative">
      {/* Left side with tabs and main panel */}
      <div className="flex flex-col h-full flex-grow min-w-0 relative">
        <TabsBar />

        {/* Loader overlay */}
        {loadingFromHistory && (
          <div className="absolute z-50 inset-0 bg-black/40 flex items-center justify-center">
            <FadeLoader
              color="#df894c"
              height={12}
              width={4}
              margin={1}
              radius={0}
              speedMultiplier={3}
            />
          </div>
        )}

        {/* Request/Response Panels */}
        <div className="h-full flex-1">
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel className="w-full" defaultSize={50} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto max-w-full">
                  <Request tabId={activeTabId} />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle className=" bg-gray-600 hover:bg-orange-500" />
            <ResizablePanel className="" minSize={30}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-auto">
                  <Response tabId={activeTabId} />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Sidebar */}
      <div className="shrink-0">
        <HistorySidebar />
      </div>
    </div>
  );
};

export default Rest;

