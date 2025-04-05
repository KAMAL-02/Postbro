"use client";

import { useResponseStore } from "@/utils/store/responseStore";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";

const ResponseSection = () => {
  const { response } = useResponseStore();
  const [formattedResponse, setFormattedResponse] = useState("");

  useEffect(() => {
    console.log("response updated to:", response);

    // If response is an object, format as JSON; otherwise, use response as is
    if (typeof response === "object" && response !== null) {
      setFormattedResponse(JSON.stringify(response, null, 2));
    } else {
      setFormattedResponse(String(response));
    }
  }, [response]);

  return (
    <div className="flex flex-col p-4 rounded bg-[#121212] max-w-8xl h-full min-h-0">
      <h2 className="text-lg font-semibold text-white mb-2">Response</h2>
      <div className="flex-1 overflow-auto max-w-full mb-5">
        {response ? (
          <CodeMirror
            value={formattedResponse}
            height="100%"
            style={{maxHeight: '100%'}}
            extensions={[json(), EditorView.lineWrapping]}
            theme={dracula}
            className="cm-editor h-screen overflow-auto"
            readOnly
          />
        ) : (
          <p className="text-gray-500">No response yet</p>
        )}
      </div>
    </div>
  );
};

export default ResponseSection;
