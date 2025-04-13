// import { create } from "zustand";

// interface responseState{
//     response: any;
//     setResponse: (response: any) => void;

//     status: number;
//     setStatus: (status: number) => void;

//     statusText: string;
//     setStatusText: (statusText: string) => void;

//     headers: any;
//     setHeaders: (headers: any) => void;

//     timeTaken: number;
//     setTimeTaken: (timeTaken: number) => void;

//     size: string;
//     setSize: (size: string) => void;
// }

// export const useResponseStore = create<responseState>((set) => ({
//     response: null,
//     setResponse: (response: any) => {
//         console.log("Response set to:", response);
//         set({ response })
//     },

//     status: 0,
//     setStatus: (status: number) => set({ status }),

//     statusText: "",
//     setStatusText: (statusText: string) => set({ statusText }),

//     headers: {},
//     setHeaders: (headers: any) => set({ headers }),

//     timeTaken: 0,
//     setTimeTaken: (timeTaken: number) => set({ timeTaken }),

//     size: "",
//     setSize: (size: string) => set({ size }),
// }))


import { create } from "zustand";

interface ResponseData {
  response: any;
  status: number;
  statusText: string;
  headers: any;
  timeTaken: number;
  size: string;
}

interface ResponseState {
  responses: Record<string, ResponseData>;
  
  // Methods to update response data for a specific tab
  setResponse: (tabId: string, response: any) => void;
  setStatus: (tabId: string, status: number) => void;
  setStatusText: (tabId: string, statusText: string) => void;
  setResponseHeaders: (tabId: string, headers: any) => void;
  setTimeTaken: (tabId: string, timeTaken: number) => void;
  setSize: (tabId: string, size: string) => void;
  
  // Initialize a new response for a tab
  initResponse: (tabId: string) => void;
  initHistoryResponse: (tabId: string, history: any) => void;
}

const defaultResponseData: ResponseData = {
  response: null,
  status: 0,
  statusText: "",
  headers: {},
  timeTaken: 0,
  size: "",
};

export const useResponseStore = create<ResponseState>((set) => ({
  responses: {},
  
  initResponse: (tabId) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: { ...defaultResponseData }
    }
  })),

  initHistoryResponse: (tabId, history ) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: {
        ...defaultResponseData,
        response: history.request.response.body,
        status: history.request.response.status,
        statusText: history.request.response.statusText,
        timeTaken: history.request.response.timeTaken,
        size: history.request.response.size,
        headers: history.request.response.headers,
      }
    }
  })),
  
  setResponse: (tabId, response) => set((state) => {
    console.log(`Response set for tab ${tabId}:`, response);
    return {
      responses: {
        ...state.responses,
        [tabId]: {
          ...state.responses[tabId] || defaultResponseData,
          response
        }
      }
    };
  }),
  
  setStatus: (tabId, status) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: {
        ...state.responses[tabId] || defaultResponseData,
        status
      }
    }
  })),
  
  setStatusText: (tabId, statusText) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: {
        ...state.responses[tabId] || defaultResponseData,
        statusText
      }
    }
  })),
  
  setResponseHeaders: (tabId, headers) => {
    const plainHeaders = Object.fromEntries(
      Object.entries(headers).filter(([_, val]) => typeof val !== "function")
    );
    set((state) => ({
      responses: {
        ...state.responses,
        [tabId]: {
          ...state.responses[tabId],
          headers: plainHeaders,
        },
      },
    }));
  },
  
  
  setTimeTaken: (tabId, timeTaken) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: {
        ...state.responses[tabId] || defaultResponseData,
        timeTaken
      }
    }
  })),
  
  setSize: (tabId, size) => set((state) => ({
    responses: {
      ...state.responses,
      [tabId]: {
        ...state.responses[tabId] || defaultResponseData,
        size
      }
    }
  })),
}));