import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useHistoryStore } from "@/utils/store/historyStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DeleteHistory = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { setHistory } = useHistoryStore();

  const handleDeleteHistory = async () => {
    try {
      await axios.delete(`${BASE_URL}/history`, {
        withCredentials: true,
      });
      toast.success("History deleted successfully");
      setHistory([]); // Clear the history in the store
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete history");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-2 rounded cursor-pointer">
              <Trash2
                className="text-white hover:text-red-500 transition-colors"
                size={14}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-[#df894c] text-sm">
            <p>Delete History</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1e1e1e] border border-[#333] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your history?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#2a2a2a] text-white border border-[#444] hover:bg-[#2a2a2a] hover:text-white cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteHistory}
            className="bg-[#df894c] text-black hover:bg-[#e79d68] font-semibold cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteHistory;
