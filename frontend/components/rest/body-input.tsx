"use client";

import { useRequestStore } from "@/utils/store/requestStore";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { jsonParseLinter } from "@codemirror/lang-json";
import { indentOnInput } from "@codemirror/language";
import { linter } from "@codemirror/lint";
import BodyTypeDropdown from "./body-type";

interface BodyInputProps {
  tabId: string;
}

const BodyInput = ({ tabId }: BodyInputProps) => {
  const { requests, setBody, setHasTyped } = useRequestStore();
  const requestData = requests[tabId] || { body: "" };
  const { body, hasTyped, contentType } = requestData;

  const handleChange = (value: string) => {
    if (!hasTyped) setHasTyped(tabId, true);
    setBody(tabId, value);
  };

  return (
    <div className="h-full overflow-auto flex flex-col gap-2">
      {/* Dropdown added here */}
      <div className="w-fit">
        <BodyTypeDropdown tabId={tabId} />
      </div>

      <CodeMirror
        value={body}
        extensions={[
          ...(contentType?.includes("application/json") ? [json()] : []),
          EditorView.lineWrapping,
          indentOnInput(),
          ...(hasTyped && contentType?.includes("application/json")
            ? [linter(jsonParseLinter())]
            : []),
        ]}
        onChange={handleChange}
        theme={dracula}
        className="cm-editor overflow-auto"
        height="100%"
        style={{ maxHeight: "100%" }}
      />
    </div>
  );
};

export default BodyInput;
