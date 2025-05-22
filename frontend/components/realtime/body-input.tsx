"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRealtimeStore } from "@/utils/store/realtimeStore";

const BodyInput = () => {
  const { message, setMessage, sendMessage, status } = useRealtimeStore();

  const isSendDisabled = status !== "connected" || message.trim() === "";

  const handleSend = () => {
    if (isSendDisabled) return;
    sendMessage();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-2">
        <Button
          onClick={handleSend}
          disabled={isSendDisabled}
          className={`transition duration-200 ease-in-out flex gap-2 items-center
        ${
          isSendDisabled
            ? "bg-[#121212] text-blue-600 cursor-not-allowed"
            : "bg-[#121212] hover:bg-[#121212] text-blue-500 hover:text-blue-400"
        }`}
        >
          <SendHorizontal className="w-4 h-4" />
          Send
        </Button>
      </div>
      <div className="h-full overflow-auto flex flex-col px-2">
        <CodeMirror
          value={message}
          onChange={(value) => setMessage(value)}
          theme={dracula}
          extensions={[EditorView.lineWrapping]}
          className="cm-editor overflow-auto"
          height="100%"
          style={{ maxHeight: "100%" }}
        />
      </div>
    </div>
  );
};

export default BodyInput;
