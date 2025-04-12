"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { useRequestStore } from "@/utils/store/requestStore";
import { useResponseStore } from "@/utils/store/responseStore";
import { useTabStore } from "@/utils/store/tabStore";
import { useAuthStore } from "@/utils/store/authStore";
import { useEffect } from "react";
import { fetchHistory } from "@/utils/history";
import { useHistoryStore } from "@/utils/store/historyStore";
import axios from "axios";

interface RequestInputsProps {
  tabId: string;
}

const RequestInputs: React.FC<RequestInputsProps> = ({tabId}) => {


  const requestData = useRequestStore((state) => state.requests[tabId]);
  const setMethod = useRequestStore((state) => state.setMethod);
  const setUrl = useRequestStore((state) => state.setUrl);
  const setLoading = useRequestStore((state) => state.setLoading);
  const initRequest = useRequestStore((state) => state.initRequest);
  const { setResponse, setStatus, setStatusText, setHeaders, setTimeTaken, setSize } = useResponseStore();
  const { updateTabMethod, tabs, activeTabId } = useTabStore();
  const { isLoggedIn } = useAuthStore();
  const { setHistory } = useHistoryStore();

  useEffect(() => {
    if (tabId && !requestData) {
      initRequest(tabId);
    }
  }, [tabId, requestData, initRequest]);
  
  // guard against missing requestData
  if (!requestData) return null;
  
  const { method, url, params, headers, body, loading } = requestData;
  
  const title = tabs.find((tab) => tab.id === tabId)?.title || "Untitled";

  const options = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
  ];

  const getResponseSize = (data: any) => {
    const str = typeof data === "string" ? data : JSON.stringify(data);
    return new Blob([str]).size; // returns size in bytes
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleMethodChange = (value: string) => {
    setMethod(tabId, value);
    updateTabMethod(tabId, value);
    console.log("body is", body);
  };
  
  const handleUrlChange = (value: string) => {
    setUrl(tabId, value);
  };

  const handleSendRequest = async () => {
    setLoading(tabId, true);
    setResponse(tabId, null);

    const payload: any = {
      metadata: {
        title,
      },
      requestConfig: {
        method,
        url,
        timeout: 10000,
      },
    };

    const axiosConfig: any = {
      ...(isLoggedIn && { withCredentials: true }),
    }
  
    if (params && params.length > 0) {
      payload.requestConfig.params = params.reduce(
        (acc: any, param: { key: string; value: string }) => {
          if (param.key && param.value) {
            acc[param.key] = param.value;
          }
          return acc;
        },
        {}
      );
    }
  
    if (headers && headers.length > 0) {
      payload.requestConfig.headers = headers.reduce(
        (acc: any, header: { key: string; value: string }) => {
          if (header.key && header.value) {
            acc[header.key] = header.value;
          }
          return acc;
        },
        {}
      );
    }

    let parsedBody = body;

    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.warn("Body is not valid JSON string");
    }

    if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      payload.requestConfig.body = parsedBody;
    }

    console.log("Payload is", payload);
    console.log("Axios config is", axiosConfig);
    
    const startTime = performance.now();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/request",
        payload,
        axiosConfig
      );

      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime); // Calculate time taken in milliseconds
      console.log("Response is", res);
      setStatus(tabId, res.status);
      setStatusText(tabId, res.statusText);
      setTimeTaken(tabId, timeTaken);

      const size = getResponseSize(res.data);
      const formattedSize = formatBytes(size);
      setSize(tabId, formattedSize);

      if (res.status === 200) {
        setResponse(tabId, res.data);
        const parsed = await fetchHistory(); // Fetch history after a successful request
        setHistory(parsed);
      } else {
        console.log("response status not 200:", res);
        setResponse(tabId, res.data);
        setStatusText(tabId, res.statusText);
        setStatus(tabId, res.status);
        const parsed = await fetchHistory(); // Fetch history even if the request fails
        setHistory(parsed);
      }
    } catch (error: any) {
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTime);
      setTimeTaken(tabId, timeTaken);

      const size = getResponseSize(error.response?.data || {});
      const formattedSize = formatBytes(size);
      setSize(tabId, formattedSize);
      console.error("Error in API request:", error);
      setResponse(tabId, error.response.data.data);
      setStatusText(tabId, error.response.statusText);
      setStatus(tabId, error.response.status);
      const parsed = await fetchHistory(); // Fetch history even if the request fails
      setHistory(parsed);
    } finally {
      setLoading(tabId, false);
    }
  };

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <Dropdown
        options={options}
        value={method}
        onChange={(e) => handleMethodChange(e.target.value)}
        className={`w-24 h-8 border border-zinc-800 bg-[#121212] p-2 rounded-xs text-xs font-medium ${
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
            <div className={`py-2 px-2 font-medium ${colorMap[option.value]}`}>
              {option.label}
            </div>
          );
        }}
      />

      <Input
        type="text"
        placeholder="Enter URL"
        onChange={(e) => handleUrlChange(e.target.value)}
        value={url}
        className="flex-1 border border-zinc-800 bg-[#121212] rounded-xs text-white p-2 h-8"
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
  );
};

export default RequestInputs;
