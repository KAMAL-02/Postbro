import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash, Plus } from "lucide-react";
import { useRequestStore } from "@/utils/store/requestStore";

interface KeyValueListProps {
  type: "parameters" | "headers";
}

const KeyValueInput = ({ type }: KeyValueListProps) => {
  const { params, setParams, headers, setHeaders } = useRequestStore();

  const data = type === "parameters" ? params : headers;
  const setData = type === "parameters" ? setParams : setHeaders;

  const handleInputChange = (index: number, field: "key" | "value", value: string) => {
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
  }
  return (
    <div className="h-full flex flex-col ">
      <div className="flex items-center justify-between mb-1">
        {
          type === "parameters" ? (
            <p className="text-gray-300 text-sm">Query Parameters</p>
          ) : (
            <p className="text-gray-300 text-sm">Headers List</p>
          )
        }
      </div>
      <div className="flex-1 overflow-y-auto mt-1">
        {data.map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <Input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) => handleInputChange(index, "key", e.target.value)}
              className="border border-gray-600 bg-[#121212] text-white p-2 rounded-sm"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            />
            <Input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleInputChange(index, "value", e.target.value)}
              className="border border-gray-600 bg-[#121212] text-white p-2 rounded-sm"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            />
            <Trash
              className="text-red-500 cursor-pointer hover:text-red-600 pb-1"
              onClick={() => removeRow(index)}
              size={40}
            />
          </div>
        ))}
        <Button onClick={addRow} className="cursor-pointer" size="sm">
          <Plus className="text-orange-400" />
        </Button>
      </div>
    </div>
  );
};

export default KeyValueInput;
