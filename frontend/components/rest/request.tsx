import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import RequestTabs from "./request-tabs";
import RequestInputs from "./request-inputs";

const Request = () => {

  return (
    <div>
      {/* Request Inputs */}
      <RequestInputs />
      {/* <div className="flex w-full items-center gap-3 p-3 rounded-lg shadow-md">
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
          className="flex-1 border border-gray-600 bg-[#282828] text-white p-2 rounded-md"
        />

        <Button
          type="submit"
          className="bg-[#df894c] hover:bg-orange-400 text-black font-semibold py-2 px-4 rounded-md cursor-pointer"
        >
          Send
        </Button>
      </div> */}
      {/* Request parameters/body/headers */}
      <RequestTabs />
      {/* Request Body */}
    </div>
  );
};

export default Request;
