"use client";
import { useTabStore } from "@/utils/store/tabStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface tabTitleEditProps {
  tabId: string;
  currentTitle: string;
  trigger: React.ReactNode;
  onSave: (tabId: string, tabTitle: string) => void;
}

const TabTitleEdit = ({
  tabId,
  currentTitle,
  trigger,
  onSave,
}: tabTitleEditProps) => {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);

  const handleSave = () => {
    if (newTitle.trim()) {
      onSave(tabId, newTitle);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#1e1e1e] border border-[#333] text-white">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-white">Edit Tab Title</DialogTitle>
        </DialogHeader>
        <Input
          value={newTitle}
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          onChange={(e) => setNewTitle(e.target.value)}
          className="mt-2 bg-[#2a2a2a] text-white border border-[#444] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <DialogFooter className="mt-4">
          <Button
            onClick={handleSave}
            className="text-sm bg-[#df894c] text-black cursor-pointer shadow-none hover:bg-[#df894c] hover:text-black focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabTitleEdit;
