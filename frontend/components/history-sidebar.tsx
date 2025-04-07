"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Search, ChevronDown } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import axios from "axios";
import { getDateLabel } from "@/utils/getDate";

type RequestItem = {
  id: string;
  method: string;
  url: string;
  timestamp: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function HistorySidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [requestHistory, setRequestHistory] = useState<RequestItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 200);
  const [openGroups, setOpenGroups] = useState<{ [label: string]: boolean }>(
    {}
  );

  const getMethodColorClass = (method: string) => {
    switch (method) {
      case "GET":
        return "text-green-400";
      case "POST":
        return "text-yellow-400";
      case "DELETE":
        return "text-red-400";
      case "PUT":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/history`, {
          withCredentials: true,
        });
        const data = res.data;
        console.log("History data:", data);
        const parsed = data.map((item: any) => ({
          id: item.id,
          method: item.request?.method || "GET",
          url: item.request?.url || "",
          timestamp: item.timestamp,
        }));

        setRequestHistory(parsed);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const groupedHistory: { [key: string]: RequestItem[] } = {};

  const filteredSearchHistory = requestHistory.filter(
    (req) =>
      req.url.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      req.method.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  filteredSearchHistory.forEach((item) => {
    console.log("item", item);
    const label = getDateLabel(item.timestamp);
    if (!groupedHistory[label]) {
      groupedHistory[label] = [];
    }
    groupedHistory[label].push(item);
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="flex h-full">
      <div className="relative flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#121212] text-gray-300 cursor-pointer absolute top-2 left-0 transform -translate-x-full rounded-l-md p-1 hover:bg-[#282828]"
        >
          {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div
          className={`transition-all duration-300 border-l border-zinc-800 bg-[#121212] text-white ${
            isOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-1 text-sm w-full bg-[#121212] border-0 border-b border-zinc-800 text-white rounded-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-1 overflow-y-auto flex-grow mb-5">
              {Object.entries(groupedHistory).map(([label, items]) => {
                const isOpen = openGroups[label] ?? true;

                return (
                  <div key={label}>
                    <div
                      className="flex items-center justify-between gap-1 cursor-pointer"
                      onClick={() => toggleGroup(label)}
                    >
                      <button className="text-zinc-400 mb-1 cursor-pointer hover:text-white transition-all duration-200">
                        {isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <h4 className="text-xs text-zinc-500 font-semibold mt-1 mb-2 flex-1">
                        {label}
                      </h4>
                    </div>

                    {isOpen &&
                      items.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-start p-1 gap-2 rounded hover:bg-zinc-800 transition-all cursor-pointer"
                        >
                          <span
                            className={`text-[11px] font-medium ${getMethodColorClass(
                              req.method
                            )}`}
                          >
                            {req.method}
                          </span>
                          <span className="text-[13px] text-zinc-300 truncate">
                            {req.url}
                          </span>
                        </div>
                      ))}
                  </div>
                );
              })}
              {Object.keys(groupedHistory).length === 0 && (
                <p className="text-sm text-zinc-400">No history found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
