import { useRequestStore } from "@/utils/store/requestStore";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";

const BodyInput = () => {

  const { body, setBody } = useRequestStore();

  return (
    <div>
      <CodeMirror
        value={body}
        height="200px"
        extensions={[json()]}
        onChange={setBody}
        theme={dracula}
        className="cm-editor border border-gray-600"
      />
    </div>
  );
};

export default BodyInput;
