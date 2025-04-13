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
    hasTyped: boolean;
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
    setHasTyped: (tabId: string, hasTyped: boolean) => void;
    
    // Initialize a new request for a tab
    initRequest: (tabId: string) => void;
    initHistoryRequest: (tabId: string, history: any) => void;
  }

  const defaultRequestData: RequestData = {
    method: "GET",
    url: "",
    activeTab: "body",
    params: [{ key: "", value: "" }],
    headers: [{ key: "content-type", value: "application/json" }],
    body: "",
    loading: false,
    hasTyped: false,
  };

export const useRequestStore = create<RequestState>((set) => ({
    requests: {},
    
    initRequest: (tabId) => set((state) => {
      return {
        requests: {
          ...state.requests,
          [tabId]: { ...defaultRequestData,
            params: [{ key: "", value: "" }],
            headers: [{ key: "", value: "" }],
           }
        }
      };
    }),

    initHistoryRequest: (tabId, history) => set((state) => {
      const stringifiedBody = JSON.stringify(history.request.body, null, 2);
      return {
        requests: {
          ...state.requests,
          [tabId]: {
            ...state.requests[tabId] || defaultRequestData,
            method: history.request.method,
            url: history.request.url,
            title: history.request.title,
            body: stringifiedBody,
            // headers: history.request.headers.map((header: any) => ({
            //   key: header.key,
            //   value: header.value,
            // })),
          }
        }
      };
    }),
    
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
    
    setBody: (tabId, body) =>
      set((state) => {
        console.log("setBody", body);
        return {
          requests: {
            ...state.requests,
            [tabId]: {
              ...(state.requests[tabId] || defaultRequestData),
              body,
            },
          },
        };
      }),

      setHasTyped: (tabId, value) => set((state) => ({
        requests: {
          ...state.requests,
          [tabId]: {
            ...state.requests[tabId],
            hasTyped: value,
          },
        },
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