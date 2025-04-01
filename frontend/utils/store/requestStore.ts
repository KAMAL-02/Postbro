import { create } from 'zustand';

/* 
! setHeaders: (headers: { key: string; value: string }[]) => void;

Takes a parameter named headers
headers is an array of objects where each object has:
key (a string)
value (a string)

Returns nothing (void means the function has no return value)
*/

interface requestState {
    method: string;
    setMethod: (method: string) => void;

    url: string;
    setUrl: (url: string) => void;

    activeTab: "parameters" | "body" | "headers";
    setActiveTab: (tab: "parameters" | "body" | "headers") => void;

    params: { key: string; value: string }[];
    setParams: (params: { key: string; value: string }[]) => void;

    headers: { key: string; value: string }[];
    setHeaders: (headers: { key: string; value: string }[]) => void;

    body: string;
    setBody: (body: string) => void;
}

export const useRequestStore = create<requestState>((set) => ({
    method: "GET",
    setMethod: (method) => set({ method }),

    url: "",
    setUrl: (url) => set({ url }),
    
    activeTab: "body",
    setActiveTab: (tab) => set({ activeTab: tab }),
  
    params: [{ key: "", value: "" }],
    setParams: (params) => set({ params }),
  
    body: "",
    setBody: (body) => set({ body }),
  
    headers: [{ key: "", value: "" }],
    setHeaders: (headers) => set({ headers }),
}));
  