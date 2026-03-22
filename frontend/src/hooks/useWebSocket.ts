import { useState, useRef, useCallback, useEffect } from 'react';

export function useWebSocket(url: string, cb: (message: string) => void) {
  const lastMessage= useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const isConnect = useRef(false);
  const connect = useCallback(
    (name: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      const ws = new WebSocket(url + `?name=${name}`);
      wsRef.current = ws;

      ws.onclose = () => {
        wsRef.current = null;
      };

      ws.onmessage = (event) => {
        cb(event.data);
      };

      ws.onerror = (error) => {
        console.error(' WebSocket error:', error);
      };

      isConnect.current = true;
    },
    [url],
  );

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    isConnect.current = false;
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } 
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { lastMessage, connect, disconnect, send, isConnect, wsRef };
}
