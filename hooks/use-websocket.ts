"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WS_URL } from "@/lib/constants";
import type {
  WSMessage,
  WSConnectionState,
  UseWebSocketOptions,
  UseChatOptions,
  ChatPayload,
  ConnectionPayload,
} from "@/types/websocket";

/**
 * WebSocket Hook
 *
 * Manages WebSocket connection lifecycle with React.
 * Handles auto-reconnect and message parsing.
 *
 * @example
 * ```tsx
 * const { isConnected, sendChat, subscribe } = useWebSocket({
 *   onMessage: (msg) => console.log(msg),
 * });
 * ```
 */
export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const [state, setState] = useState<WSConnectionState>("disconnected");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedTopicsRef = useRef<Set<string>>(new Set());

  /**
   * Send raw message
   */
  const send = useCallback((type: string, payload?: unknown, topic?: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }

    socketRef.current.send(
      JSON.stringify({
        type,
        topic,
        payload,
        timestamp: Date.now(),
      })
    );
    return true;
  }, []);

  /**
   * Subscribe to topic
   */
  const subscribe = useCallback(
    (topic: string) => {
      subscribedTopicsRef.current.add(topic);
      return send("subscribe", undefined, topic);
    },
    [send]
  );

  /**
   * Unsubscribe from topic
   */
  const unsubscribe = useCallback(
    (topic: string) => {
      subscribedTopicsRef.current.delete(topic);
      return send("unsubscribe", undefined, topic);
    },
    [send]
  );

  /**
   * Send chat message
   */
  const sendChat = useCallback(
    (topic: string, content: string) => {
      return send("chat", content, topic);
    },
    [send]
  );

  // Store callbacks in refs to avoid reconnecting when they change
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onMessage, onConnect, onDisconnect, onError]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    // Don't connect on server
    if (typeof window === "undefined") return;

    // Close existing
    if (socketRef.current) {
      socketRef.current.close();
    }

    setState("connecting");
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      setState("connected");
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      // Resubscribe to topics
      subscribedTopicsRef.current.forEach((topic) => {
        send("subscribe", undefined, topic);
      });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage;

        // Handle connection confirmation
        if (message.type === "connected") {
          const payload = message.payload as { connectionId: string };
          setConnectionId(payload.connectionId);
          onConnectRef.current?.(payload.connectionId);
        }

        // Forward message
        onMessageRef.current?.(message);
      } catch (error) {
        console.error("[WS] Parse error:", error);
      }
    };

    ws.onclose = () => {
      setState("disconnected");
      setConnectionId(null);
      onDisconnectRef.current?.();

      // Auto reconnect
      if (autoReconnect && !reconnectTimerRef.current) {
        reconnectTimerRef.current = setTimeout(() => {
          reconnectTimerRef.current = null;
          connect();
        }, reconnectInterval);
      }
    };

    ws.onerror = (error) => {
      setState("error");
      onErrorRef.current?.(error);
    };
  }, [autoReconnect, reconnectInterval, send]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setState("disconnected");
    setConnectionId(null);
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    state,
    connectionId,
    isConnected: state === "connected",
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
    sendChat,
  };
}

/**
 * Chat-specific hook for customers
 *
 * Backend auto-subscribes customers to their chat on connect
 * and sends previous messages. This hook just listens and sends.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isConnected, chatId } = useChat();
 * ```
 */
export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatPayload[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleMessage = useCallback((message: WSMessage) => {
    // Handle connected message - extract chatId and userId
    if (message.type === "connected") {
      const payload = message.payload as ConnectionPayload;
      if (payload.chatId) {
        setChatId(payload.chatId);
      }
      if (payload.userId) {
        setUserId(payload.userId);
      }
    }

    // Handle chat messages
    if (message.type === "chat" && message.topic?.startsWith("chat:")) {
      setMessages((prev) => [...prev, message.payload as ChatPayload]);
    }
  }, []);

  const handleConnect = useCallback((connectionId: string) => {
    options.onConnect?.(connectionId);
  }, [options]);

  const ws = useWebSocket({
    onMessage: handleMessage,
    onConnect: handleConnect,
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!chatId) {
        console.warn("[Chat] No chatId yet, cannot send message");
        return false;
      }
      return ws.sendChat(`chat:${chatId}`, content);
    },
    [ws, chatId]
  );

  return {
    messages,
    sendMessage,
    isConnected: ws.isConnected,
    connectionId: ws.connectionId,
    chatId,
    userId,
  };
}
