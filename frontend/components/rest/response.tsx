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
import { Hourglass } from "react-loader-spinner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ResponseSection = () => {
  const { response, status, statusText, timeTaken, size } = useResponseStore();
  const { loading } = useRequestStore();

  const [formattedResponse, setFormattedResponse] = useState("");
  const [copied, setCopied] = useState(false);

  const isSuccess = status >= 200 && status < 300;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedResponse], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "response.json"; //TODO: make this dynamic based on the response type
    a.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    console.log("response updated to:", response);

    if (typeof response === "object" && response !== null) {
      setFormattedResponse(JSON.stringify(response, null, 2));
    } else {
      setFormattedResponse(String(response));
    }
  }, [response]);

  return (
    <div className="flex flex-col p-3 rounded bg-[#121212] h-full min-h-0">
      <div className="flex justify-start items-center gap-3">
        {response && (
          <div className="flex justify-start items-center mb-2 gap-5 flex-wrap">
            <p className="text-xs text-gray-300">
              Status:{" "}
              <span className={isSuccess ? "text-green-400" : "text-red-400"}>
                {status} {" . "}
              </span>
              <span className={isSuccess ? "text-green-400" : "text-red-400"}>
                {statusText}
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
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-2 border-b-1 border-gray-700 pb-2">
        <p className="text-sm font-semibold text-gray-300">Response Body</p>
        {response && (
          <div className="flex items-center justify-end">
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
        )}
      </div>
      <div className="flex-1 overflow-auto max-w-full mb-5">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Hourglass
              visible={true}
              height="30"
              width="30"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={['#ffa94d', '#2b2b2b']}
            />
          </div>
        ) : (
          response && (
            <CodeMirror
              value={formattedResponse}
              height="100%"
              style={{ maxHeight: "100%" }}
              extensions={[json(), EditorView.lineWrapping]}
              theme={dracula}
              className="cm-editor h-screen overflow-auto"
              readOnly
            />
          )
        )}
      </div>
    </div>
  );
};

export default ResponseSection;
