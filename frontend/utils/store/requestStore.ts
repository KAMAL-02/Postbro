import { create } from 'zustand';

/* 
! setHeaders: (headers: { key: string; value: string }[]) => void;

Takes a parameter named headers
headers is an array of objects where each object has:
key (a string)
value (a string)

Returns nothing (void means the function has no return value)
*/

interface RequestData {
    method: string;
    url: string;
    activeTab: "parameters" | "body" | "headers";
    params: { key: string; value: string }[];
    headers: { key: string; value: string }[];
    body: any;
    loading: boolean;
}
// interface requestState {
//     method: string;
//     setMethod: (method: string) => void;

//     url: string;
//     setUrl: (url: string) => void;

//     activeTab: "parameters" | "body" | "headers";
//     setActiveTab: (tab: "parameters" | "body" | "headers") => void;

//     params: { key: string; value: string }[];
//     setParams: (params: { key: string; value: string }[]) => void;

//     headers: { key: string; value: string }[];
//     setHeaders: (headers: { key: string; value: string }[]) => void;

//     body: any;
//     setBody: (body: string) => void;

//     loading: boolean;
//     setLoading: (loading: boolean) => void;
// }

interface RequestState {
    requests: Record<string, RequestData>;
    
    // Methods to update request data for a specific tab
    setMethod: (tabId: string, method: string) => void;
    setUrl: (tabId: string, url: string) => void;
    setActiveTab: (tabId: string, tab: "parameters" | "body" | "headers") => void;
    setParams: (tabId: string, params: { key: string; value: string }[]) => void;
    setHeaders: (tabId: string, headers: { key: string; value: string }[]) => void;
    setBody: (tabId: string, body: string) => void;
    setLoading: (tabId: string, loading: boolean) => void;
    
    // Initialize a new request for a tab
    initRequest: (tabId: string) => void;
  }

  const defaultRequestData: RequestData = {
    method: "GET",
    url: "",
    activeTab: "body",
    params: [{ key: "", value: "" }],
    headers: [{ key: "", value: "" }],
    body: "",
    loading: false,
  };
// export const useRequestStore = create<RequestState>((set) => ({
//     method: "GET",
//     setMethod: (method) => set({ method }),

//     url: "",
//     setUrl: (url) => set({ url }),
    
//     activeTab: "body",
//     setActiveTab: (tab) => set({ activeTab: tab }),
  
//     params: [{ key: "", value: "" }],
//     setParams: (params) => set({ params }),
  
//     body: "",
//     setBody: (body) => set({ body }),
  
//     headers: [{ key: "", value: "" }],
//     setHeaders: (headers) => set({ headers }),

//     loading: false,
//     setLoading: (loading) => set({ loading }),
// }));
  
export const useRequestStore = create<RequestState>((set) => ({
    requests: {},
    
    initRequest: (tabId) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: { ...defaultRequestData }
      }
    })),
    
    setMethod: (tabId, method) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          method
        }
      }
    })),
    
    setUrl: (tabId, url) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          url
        }
      }
    })),
    
    setActiveTab: (tabId, activeTab) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          activeTab
        }
      }
    })),
    
    setParams: (tabId, params) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          params
        }
      }
    })),
    
    setHeaders: (tabId, headers) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          headers
        }
      }
    })),
    
    setBody: (tabId, body) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          body
        }
      }
    })),
    
    setLoading: (tabId, loading) => set((state) => ({
      requests: {
        ...state.requests,
        [tabId]: {
          ...state.requests[tabId] || defaultRequestData,
          loading
        }
      }
    })),
  }));