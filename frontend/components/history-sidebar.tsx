"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { Input } from "./ui/input";
import axios from "axios";
import DeleteHistory from "./rest/delete-history";
import { getDateLabel } from "@/utils/getDate";
import { useHistoryStore } from "@/utils/store/historyStore";
import { useTabStore } from "@/utils/store/tabStore";
import { useAuthStore } from "@/utils/store/authStore";
import { toast } from "sonner";
import { fetchHistory } from "@/utils/history";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RequestItem = {
  id: string;
  method: string;
  url: string;
  timestamp: string;
  request: any;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function HistorySidebar() {
  const [isOpen, setIsOpen] = useState(true);
  // const [requestHistory, setRequestHistory] = useState<RequestItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 200);
  const [openGroups, setOpenGroups] = useState<{ [label: string]: boolean }>(
    {}
  );

  const { history, setHistory, removeFromHistory } = useHistoryStore();
  const { addTabFromHistory } = useTabStore();
  const { isLoggedIn } = useAuthStore();

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
    const fetchHistoryHere = async () => {
      const parsed = await fetchHistory();
      setHistory(parsed);
    };

    fetchHistoryHere();
  }, [isLoggedIn]);

  const groupedHistory: { [key: string]: RequestItem[] } = {};

  const filteredSearchHistory = (history ?? []).filter(
    (req) =>
      req.url.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      req.method.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  filteredSearchHistory.forEach((item) => {
    const label = getDateLabel(item.timestamp);
    if (!groupedHistory[label]) {
      groupedHistory[label] = [];
    }
    groupedHistory[label].push(item);
  });

  const toggleGroup = (label: string) => {
    // console.log("request history", requestHistory);
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/history/${id}`, {
        withCredentials: true,
      });
      // setHistory((prev) => prev.filter((item) => item.id !== id));
      removeFromHistory(id);

      toast.success("Deleted", {
        position: "bottom-center",
        style: {
          minWidth: "200px",
        },
      });
    } catch (error) {
      console.error("Failed to delete history:", error);
      toast.error("Failed to delete");
    }
  };

  const handleHistoryClick = (historyId: string) => {
    console.log("history", historyId)
    const historyItem = history.find((item) => item.id === historyId);
    console.log("historyItem", historyItem)
    if (historyItem) {
      addTabFromHistory(historyItem);
    }else{
      toast.error("History item not found", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="flex h-full">
      <div className="relative flex">
        <Tooltip>
          <TooltipTrigger asChild>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#121212] text-gray-300 cursor-pointer absolute top-2 left-0 transform -translate-x-full rounded-l-md p-1 hover:bg-[#282828]"
        >
          {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-[#df894c] text-sm">
            <p>{isOpen ? "Close sidebar" : "Open sidebar"}</p>
          </TooltipContent>
        </Tooltip>

        <div
          className={`transition-all duration-300 border-l border-zinc-800 bg-[#121212] text-white ${
            isOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-8 pr-2 py-1 text-sm w-full bg-[#121212] border-0 border-b border-zinc-800 text-white rounded-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <DeleteHistory />
            </div>
            <div className="space-y-1 overflow-y-auto flex-grow mb-5">
              {!isLoggedIn ? (
                <p className="text-sm text-zinc-400 text-center mt-10">
                  Login to see history
                </p>
              ) : (
                <>
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
                          items.map((history) => (
                            <div
                              key={history.id}
                              className="group flex items-center justify-between p-1 gap-2 rounded hover:bg-zinc-800 transition-all"
                            >
                              <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => handleHistoryClick(history.id)}>
                                <span
                                  className={`text-[11px] font-medium ${getMethodColorClass(
                                    history.method
                                  )}`}
                                >
                                  {history.method}
                                </span>
                                <span className="text-[13px] text-zinc-300 truncate max-w-[150px]">
                                  {history.url}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteHistory(history.id)}
                                className="text-red-500 transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                  {Object.keys(groupedHistory).length === 0 && (
                    <p className="ext-sm text-zinc-400 text-center mt-10">No history found</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
