import axios from "axios";
import { useHistoryStore } from "@/utils/store/historyStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchHistory = async () => {

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
      request: item.request,
    }));

    // setRequestHistory(parsed);
    return parsed;
  } catch (error) {
    console.error("Error fetching history:", error);
  }
};
