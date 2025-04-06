import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import RequestTabs from "./request-tabs";
import RequestInputs from "./request-inputs";

interface RequestProps {
  tabId: any;
}

const Request: React.FC<RequestProps> = ({tabId}) => {

  return (
    <div className="h-full flex flex-col">
      <RequestInputs tabId={tabId} />
      <div className="flex-1 overflow-hidden">
        <RequestTabs tabId={tabId}/>
      </div>
    </div>
  );
};

export default Request;
