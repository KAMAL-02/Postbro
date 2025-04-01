"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { useRequestStore } from "@/utils/store/requestStore";
import axios from "axios";

const RequestInputs = () => {

  const { params, body, headers, method, url, setMethod, setUrl } = useRequestStore();

    const options = [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "DELETE", value: "DELETE" },
      ];
    
    const handleSendRequest = async() =>{
      console.log("Method is", method)
      console.log("URL is", url)
      console.log("Params is", params)
      console.log("Body is", body)
      console.log("Headers is", headers)

      const requestConfig: any = {
        method,
        url,
        timeout: 5000,
      };

      if (params && params.length > 0) {
        // Filter out params that do not have both key and value
        requestConfig.params = params.reduce((acc: any, param: { key: string; value: string }) => {
          if (param.key && param.value) {  // Only add if both key and value exist
            acc[param.key] = param.value;
          }
          return acc;
        }, {});
      }
      
      if (headers && headers.length > 0) {
        // Filter out headers that do not have both key and value
        requestConfig.headers = headers.reduce((acc: any, header: { key: string; value: string }) => {
          if (header.key && header.value) {  // Only add if both key and value exist
            acc[header.key] = header.value;
          }
          return acc;
        }, {});
      }

      if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        requestConfig.data = body;
      }

      console.log("Request Config is", requestConfig)

      try {
        const response = await axios.post("http://localhost:5000/api/request", requestConfig)
      } catch (error) {
        console.error("Error in API request:", error);
      }
    }

  return (
      <div className="flex w-full items-center gap-3 p-3 rounded-lg shadow-md">
        <Dropdown
          options={options}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`w-28 border border-gray-600 bg-[#282828] p-2 rounded-md text-xs font-medium ${
            method === "GET"
              ? "text-green-400"
              : method === "POST"
              ? "text-yellow-400"
              : method === "PUT"
              ? "text-blue-400"
              : method === "DELETE"
              ? "text-red-400"
              : "text-white"
          }`}
          panelClassName="bg-[#282828] text-white border border-gray-600 p-3 text-xs"
          itemTemplate={(option) => {
            const colorMap: Record<string, string> = {
              GET: "text-green-400",
              POST: "text-yellow-400",
              PUT: "text-blue-400",
              DELETE: "text-red-400",
            };

            return (
              <div
                className={`py-2 px-2 font-medium ${colorMap[option.value]}`}
              >
                {option.label}
              </div>
            );
          }}
        />

        <Input
          type="text"
          placeholder="Enter a URL or paste a CURL command"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          className="flex-1 border border-gray-600 bg-[#282828] text-white p-2 rounded-md"
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        />

        <Button
          type="submit"
          className="bg-[#df894c] hover:bg-orange-400 text-black font-semibold py-2 px-4 rounded-md cursor-pointer"
          onClick={handleSendRequest}
        >
          Send
        </Button>
      </div>
  )
}

export default RequestInputs
