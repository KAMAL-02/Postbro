import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import RequestTabs from "./request-tabs";
import RequestInputs from "./request-inputs";

const Request = () => {

  return (
    <div className="h-full flex flex-col">
      <RequestInputs />
      <div className="flex-1 overflow-hidden">
        <RequestTabs />
      </div>
    </div>
  );
};

export default Request;
