"use client";

import { useResponseStore } from "@/utils/store/responseStore";
import { useRequestStore } from "@/utils/store/requestStore";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { Copy, Check, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeLoader } from "react-spinners";
import ResponseHeaders from "./response-headers";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResponseSectionProps {
  tabId: any;
}

const ResponseSection = ({ tabId }: ResponseSectionProps) => {
  // const { response, status, statusText, timeTaken, size } = useResponseStore();
  // const { loading } = useRequestStore();

  const { responses } = useResponseStore();
  const { requests } = useRequestStore();

  const responseData = responses[tabId] || {
    response: null,
    status: 0,
    statusText: "",
    headers: {},
    timeTaken: 0,
    size: "",
  };

  const requestData = requests[tabId] || {
    loading: false,
  };

  const { response, status, statusText, timeTaken, size, headers } =
    responseData;
  const { loading } = requestData;

  const [formattedResponse, setFormattedResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"body" | "headers">("body");

  const isSuccess = status >= 200 && status < 300;

  const handleCopy = async () => {
    console.log(" is", headers);
    try {
      if(activeTab === "headers") {
        await navigator.clipboard.writeText(JSON.stringify(headers, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
        return;
      }
      await navigator.clipboard.writeText(formattedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {

    if(activeTab === "headers") {
      const blob = new Blob([JSON.stringify(headers, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "headers.json"; //TODO: make this dynamic based on the response type
      a.click();

      URL.revokeObjectURL(url);
      return;
    }
    const blob = new Blob([formattedResponse], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "response.json"; //TODO: make this dynamic based on the response type
    a.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (typeof response === "object" && response !== null) {
      setFormattedResponse(JSON.stringify(response, null, 2));
    } else {
      setFormattedResponse(String(response));
    }
  }, [response]);

  return (
    <div className="flex flex-col p-2 rounded bg-[#121212] h-full min-h-0">
      <div className="flex flex-wrap justify-start items-center gap-4 mb-2">
        {response && (
          <>
            <p className="text-xs text-gray-300">
              Status:{" "}
              <span className={isSuccess ? "text-green-400" : "text-red-400"}>
                {status} . {statusText}
              </span>
            </p>
            {timeTaken && (
              <p className="text-xs text-gray-300">
                Time Taken:{" "}
                <span className="text-blue-400">{timeTaken} ms</span>
              </p>
            )}
            {size && (
              <p className="text-xs text-gray-300">
                Size: <span className="text-blue-400">{size}</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      { response ? (
        <div className="flex border-b items-center justify-between border-zinc-800 mb-2">
        <div>
          <button
            onClick={() => setActiveTab("body")}
            className={`px-4 py-2 text-xs cursor-pointer ${
              activeTab === "body"
                ? "border-b-2 border-orange-500 text-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Response
          </button>
          <button
            onClick={() => setActiveTab("headers")}
            className={`px-4 py-2 text-xs cursor-pointer ${
              activeTab === "headers"
                ? "border-b-2 border-orange-500 text-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Headers
          </button>
        </div>
        <div className="">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopy}
                size="sm"
                className="text-gray-300 cursor-pointer hover:text-white bg-transparent hover:bg-transparent"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="text-[#df894c] text-sm"
            >
              Copy
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDownload}
                size="sm"
                className="text-gray-300 cursor-pointer hover:text-white bg-transparent hover:bg-transparent"
              >
                <ArrowDownToLine className="w-4 h-4 mr-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="text-[#df894c] text-sm"
            >
              Download
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      ) : (
        <p className="text-sm font-semibold text-gray-300 border-b border-zinc-800 pb-2">Response Body</p>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-auto max-w-full mb-5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FadeLoader
              color="#df894c"
              height={10}
              width={5}
              margin={0}
              radius={0}
            />
          </div>
        ) : (
          <>
            {activeTab === "body" && response && (
              <>
                <CodeMirror
                  value={formattedResponse}
                  height="100%"
                  style={{ maxHeight: "100%" }}
                  extensions={[json(), EditorView.lineWrapping]}
                  theme={dracula}
                  className="cm-editor h-screen overflow-auto"
                  readOnly
                />
              </>
            )}

            {activeTab === "headers" && <ResponseHeaders headers={headers} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseSection;
