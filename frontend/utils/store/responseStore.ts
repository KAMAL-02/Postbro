import { create } from "zustand";

interface responseState{
    response: any;
    setResponse: (response: any) => void;

    status: number;
    setStatus: (status: number) => void;

    statusText: string;
    setStatusText: (statusText: string) => void;

    headers: any;
    setHeaders: (headers: any) => void;

    timeTaken: number;
    setTimeTaken: (timeTaken: number) => void;

    size: string;
    setSize: (size: string) => void;
}

export const useResponseStore = create<responseState>((set) => ({
    response: null,
    setResponse: (response: any) => {
        console.log("Response set to:", response);
        set({ response })
    },

    status: 0,
    setStatus: (status: number) => set({ status }),

    statusText: "",
    setStatusText: (statusText: string) => set({ statusText }),

    headers: {},
    setHeaders: (headers: any) => set({ headers }),

    timeTaken: 0,
    setTimeTaken: (timeTaken: number) => set({ timeTaken }),

    size: "",
    setSize: (size: string) => set({ size }),
}))