"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoveDownLeft, MoveUpRight } from "lucide-react";
import { useRealtimeStore } from "@/utils/store/realtimeStore";
import { getStatusColor } from "@/utils/getStatusColor";

const Response = () => {
  const { messages, status, loading, error } = useRealtimeStore();

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-10" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          Connect to a WebSocket to start receiving data.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-4 mb-10">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {message.direction === "sent" ? (
                  <MoveUpRight className="w-4 h-4 text-blue-500" />
                ) : (
                  <MoveDownLeft className="w-4 h-4 text-green-500" />
                )}
                <div className="text-md break-words whitespace-pre-wrap text-gray-300" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                  {(() => {
                    try {
                      const json = JSON.parse(message.data);
                      return <>{JSON.stringify(json, null, 2)}</>;
                    } catch {
                      return <>{message.data}</>;
                    }
                  })()}
                </div>
              </div>
              <span className="whitespace-nowrap">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-sm text-muted-foreground">
          {status === "connecting" ? "Connecting..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-300">Response</h2>
        <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
          <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">{renderMessages()}</div>
    </div>
  );
};

export default Response;
