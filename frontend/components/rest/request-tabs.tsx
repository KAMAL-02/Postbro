import { useRequestStore } from "@/utils/store/requestStore";
import KeyValueInput from "./key-value";
import BodyInput from "./body-input";

interface RequestTabsProps {
  tabId: string;
}

const RequestTabs: React.FC<RequestTabsProps> = ({tabId}) => {
  // const [activeTab, setActiveTab] = useState<"parameters" | "body" | "headers">(
  //   "body"
  // );

  // const [params, setParams] = useState([{ key: "", value: "" }]);
  // const [body, setBody] = useState("");
  // const [headers, setHeaders] = useState([{ key: "", value: "" }]);

  // const { activeTab, setActiveTab, params, setParams, body, setBody, headers, setHeaders } = useRequestStore();
  const { requests, setActiveTab } = useRequestStore();

  const requestData = requests[tabId] || {
    activeTab: "body",
  }

  const { activeTab } = requestData;

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-3 border-b border-gray-600">
        {["parameters", "body", "headers"].map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 cursor-pointer transition-colors duration-200 text-xs ml-2 ${
              activeTab === tab
                ? "border-b-2 border-orange-500 text-orange-400 hover:text-orange-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() =>
              setActiveTab(tabId, tab as "parameters" | "body" | "headers")
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2 rounded-md flex-1 overflow-auto">
        {activeTab === "parameters" && <KeyValueInput type="parameters" tabId={tabId} />}
        {activeTab === "body" && <BodyInput tabId={tabId}/>}
        {activeTab === "headers" && <KeyValueInput type="headers" tabId={tabId}/>}
      </div>
    </div>
  );
};

export default RequestTabs;
