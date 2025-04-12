"use client";

import { useRequestStore } from "@/utils/store/requestStore";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { EditorView } from "@codemirror/view";
import { jsonParseLinter } from "@codemirror/lang-json";
import { indentOnInput } from "@codemirror/language";
import { linter, lintGutter } from "@codemirror/lint";
import BodyTypeDropdown from "./body-type";

interface BodyInputProps {
  tabId: string;
}

const BodyInput = ({ tabId }: BodyInputProps) => {
  const { requests, setBody } = useRequestStore();
  const requestData = requests[tabId] || { body: "" };
  const { body } = requestData;

  const [hasTyped, setHasTyped] = useState(false);

  const handleChange = (value: string) => {
    if (!hasTyped) setHasTyped(true);
    setBody(tabId, value);
  };

  return (
    <div className="h-full overflow-auto flex flex-col gap-2">
      {/* Dropdown added here */}
      <div className="w-fit">
        <BodyTypeDropdown />
      </div>

      <CodeMirror
        value={body}
        extensions={[
          json(),
          EditorView.lineWrapping,
          indentOnInput(),
          lintGutter(),
          ...(hasTyped ? [linter(jsonParseLinter())] : []),
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
