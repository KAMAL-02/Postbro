import { create } from 'zustand';

export type WebSocketMessageDirection = 'sent' | 'received';

const BASE_URL = process.env.NEXT_PUBLIC_REALTIME_API_URL

export interface WebSocketMessage {
  id: string;
  data: string;
  direction: WebSocketMessageDirection;
  timestamp: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface RealtimeStore {

    url: string;
    setUrl: (url: string) => void;
    
    status: ConnectionStatus;
    setStatus: (status: ConnectionStatus) => void;
    
    loading: boolean;
    setLoading: (loading: boolean) => void;
    
    message: string;
    setMessage: (message: string) => void;
    
    messages: WebSocketMessage[];
    addMessage: (message: WebSocketMessage) => void;
    clearMessages: () => void;
    
    socket: WebSocket | null;
    
    error: string | null;
    setError: (error: string | null) => void;
    
    connect: () => void;
    disconnect: () => void;
    
    sendMessage: (message?: string) => void;
    
    headers: Record<string, string>;
    setHeaders: (headers: Record<string, string>) => void;
    addHeader: (key: string, value: string) => void;
    removeHeader: (key: string) => void;
}

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
    url: '',
    setUrl: (url) => set({ url }),
    
    status: 'disconnected',
    setStatus: (status) => set({ status }),
    
    loading: false,
    setLoading: (loading) => set({ loading }),
    
    message: '',
    setMessage: (message) => set({ message }),
    
    messages: [],
    addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
    })),
    clearMessages: () => set({ messages: [] }),
    
    socket: null,
    
    error: null,
    setError: (error) => set({ error }),
    
    headers: {},
    setHeaders: (headers) => set({ headers }),
    addHeader: (key, value) => set((state) => ({ 
        headers: { ...state.headers, [key]: value } 
    })),
    removeHeader: (key) => set((state) => {
        const newHeaders = { ...state.headers };
        delete newHeaders[key];
        return { headers: newHeaders };
    }),
    
    connect: () => {
        const state = get();
        const { url, headers } = state;
        
        if (!url.trim()) {
            set({ error: 'URL cannot be empty' });
            return;
        }
        
        if (state.socket) {
            state.socket.close();
        }
        
        set({ 
            loading: true, 
            status: 'connecting',
            error: null,
            messages: [] 
        });
        
        try {
            const proxyUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${BASE_URL}/websocket`;
            console.log('Connecting to WebSocket server at:', proxyUrl);
            const socket = new WebSocket(proxyUrl);
            
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    type: 'connect',
                    url: state.url,
                    headers: state.headers,
                    userId: localStorage.getItem('userId')
                }));
                
                set({ socket, loading: false });
            };
            
            socket.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                                            
                    switch (response.type) {
                        case 'status':
                            if (response.status === 'connected') {
                                set({ status: 'connected' });
                            } else if (response.status === 'disconnected') {
                                set({ 
                                    status: 'disconnected',
                                    socket: null
                                });
                            }
                            break;
                            
                        case 'message':
                            const newMessage: WebSocketMessage = {
                                id: crypto.randomUUID(),
                                data: response.data,
                                direction: response.direction,
                                timestamp: response.timestamp
                            };
                            get().addMessage(newMessage);
                            break;
                            
                        case 'error':
                            set({ 
                                error: response.message,
                                status: 'error' 
                            });
                            break;
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                    set({ error: 'Failed to parse WebSocket message' });
                }
            };
            
            socket.onerror = () => {
                set({ 
                    error: 'WebSocket connection error',
                    status: 'error',
                    loading: false
                });
            };
            
            socket.onclose = () => {
                set({ 
                    status: 'disconnected',
                    socket: null,
                    loading: false
                });
            };
            
        } catch (err) {
            set({ 
                error: `Failed to connect: ${(err as Error).message}`,
                status: 'error',
                loading: false 
            });
        }
    },
    
    disconnect: () => {
        const { socket } = get();
        
        if (socket) {
            try {
                socket.send(JSON.stringify({
                    type: 'disconnect'
                }));
            } catch (err) {
                console.error('Error sending disconnect command:', err);
            }
            
            // Close the connection
            socket.close();
            set({ 
                socket: null,
                status: 'disconnected'
            });
        }
    },
    
    sendMessage: (message) => {
        const state = get();
        const { socket } = state;
        const messageToSend = message || state.message;
        
        if (!socket || state.status !== 'connected') {
            set({ error: 'Not connected to WebSocket server' });
            return;
        }
        
        if (!messageToSend.trim()) {
            set({ error: 'Message cannot be empty' });
            return;
        }
        
        try {
            // Send the message through the proxy
            socket.send(JSON.stringify({
                type: 'send',
                message: messageToSend
            }));
            
            // Clear the message input after sending
            if (!message) {
                set({ message: '' });
            }
        } catch (err) {
            set({ error: `Failed to send message: ${(err as Error).message}` });
        }
    }
}));