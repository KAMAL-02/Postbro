import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash, Plus } from "lucide-react";
import { useRequestStore } from "@/utils/store/requestStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeyValueListProps {
  type: "parameters" | "headers";
  tabId: string;
}

const KeyValueInput = ({ type, tabId }: KeyValueListProps) => {
  // const { params, setParams, headers, setHeaders } = useRequestStore();

  const { requests, setParams, setHeaders } = useRequestStore();
  const requestData = requests[tabId] || {
    params: [{ key: "", value: "" }],
    headers: [{ key: "", value: "" }],
  };

  const data = type === "parameters" ? requestData.params : requestData.headers;

  // const setData = type === "parameters" ? setParams : setHeaders;

  const setData =
    type === "parameters"
      ? (params: any) => setParams(tabId, params)
      : (headers: any) => setHeaders(tabId, headers);

  const handleInputChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, { key: "", value: "" }]);
  };

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };
  return (
    <div className="h-full flex flex-col ">
      <div className="flex items-center justify-between mb-1">
        {type === "parameters" ? (
          <p className="text-gray-300 text-xs">Query Parameters</p>
        ) : (
          <p className="text-gray-300 text-xs">Headers List</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto mt-1">
        {data.map((item, index) => {
          const isFirstHeader = type === "headers" && index === 0;

          return (
            <div key={index} className="flex space-x-2 mb-2 items-center">
              <Input
                type="text"
                placeholder="Key"
                value={item.key}
                onChange={(e) =>
                  handleInputChange(index, "key", e.target.value)
                }
                className="border-1 border-zinc-700 bg-[#121212] text-white p-2 rounded-xs h-8"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                disabled={isFirstHeader}
              />
              <Input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) =>
                  handleInputChange(index, "value", e.target.value)
                }
                className="border-1 border-zinc-700 bg-[#121212] text-white p-2 rounded-xs h-8"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                disabled={isFirstHeader}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Trash
                    className={`pb-1 ${
                      isFirstHeader
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-red-500 cursor-pointer hover:text-red-600"
                    }`}
                    onClick={() => {
                      if (!isFirstHeader) removeRow(index);
                    }}
                    size={33}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="text-[#df894c] text-sm"
                >
                  {isFirstHeader ? "Cannot remove default header" : "Remove"}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}

        <Button onClick={addRow} className="cursor-pointer" size="sm">
          <Plus className="text-orange-400" />
        </Button>
      </div>
    </div>
  );
};

export default KeyValueInput;
