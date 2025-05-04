import { ConnectionStatus } from "@/utils/store/realtimeStore";

export const getStatusColor = (status: ConnectionStatus): string => {
  switch (status) {
    case "connected":
      return "text-green-500";
    case "connecting":
      return "text-yellow-500";
    case "disconnected":
      return "text-gray-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
