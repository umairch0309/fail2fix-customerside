"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import Chatbox from "@/components/dashboard/chatbox";
import Chatinput from "@/components/dashboard/chatinput";
import QuoteRequestCard from "@/components/dashboard/quote-request-card";
import QuoteDetailsSheet from "@/components/dashboard/quote-details-sheet";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useChatMessages } from "@/hooks/use-chat";
import { queryKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

/**
 * Format timestamp to readable time
 */
const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get minute key for grouping (sender + minute)
 */
const getMinuteKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
};

/**
 * Check if message should show time
 * Shows time only on the last message of a group (same sender + same minute)
 */
const shouldShowTime = (
  messages: { senderId: string; timestamp: number }[],
  index: number
): boolean => {
  const current = messages[index];
  const next = messages[index + 1];

  // Last message always shows time
  if (!next) return true;

  // Different sender = show time
  if (current.senderId !== next.senderId) return true;

  // Different minute = show time
  if (getMinuteKey(current.timestamp) !== getMinuteKey(next.timestamp)) return true;

  return false;
};

/**
 * Check if message is grouped with the previous one
 */
const isGroupedWithPrevious = (
  messages: { senderId: string; timestamp: number }[],
  index: number
): boolean => {
  const current = messages[index];
  const prev = messages[index - 1];

  if (!prev) return false;

  // Same sender and same minute = grouped
  return (
    current.senderId === prev.senderId &&
    getMinuteKey(current.timestamp) === getMinuteKey(prev.timestamp)
  );
};

export default function ChatsPage() {
  const setHeader = useDashboardStore((state) => state.setHeader);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  // Sheet state
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const sessionUserId = session?.user?.id ?? null;

  const handleViewDetails = useCallback((requestId: string) => {
    setSelectedRequestId(requestId);
    setIsSheetOpen(true);
  }, []);

  // Fetch messages from REST API with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages();

  // WebSocket store - real-time messages, presence, and typing
  const realtimeMessages = useWebSocketStore((state) => state.messages);
  const sendMessage = useWebSocketStore((state) => state.sendMessage);
  const isConnected = useWebSocketStore((state) => state.state === "connected");
  const wsUserId = useWebSocketStore((state) => state.userId);
  const markAsRead = useWebSocketStore((state) => state.markAsRead);
  const clearMessages = useWebSocketStore((state) => state.clearMessages);
  const isOtherPartyOnline = useWebSocketStore((state) => state.isOtherPartyOnline);
  const isOtherPartyTyping = useWebSocketStore((state) => state.isOtherPartyTyping);
  const sendTyping = useWebSocketStore((state) => state.sendTyping);

  // Prefer auth session id so bubble side stays correct even if WS auth was wrong
  const myUserId = sessionUserId || wsUserId;

  // Flatten pages (reverse order: older pages first) and merge with real-time messages
  const messages = useMemo(() => {
    // Flatten all pages - pages are in order [newest, older, oldest...]
    // Reverse to get chronological order [oldest, older, newest...]
    const allApiMessages = data?.pages ? [...data.pages].reverse().flat() : [];

    // Map API messages to include _type and _quoteRequest for rendering
    const apiFormatted = allApiMessages.map((msg) => ({
      senderId: msg.senderId,
      content: msg.content,
      timestamp: new Date(msg.createdAt).getTime(),
      senderRole: msg.senderRole as string | null | undefined,
      _type: msg.messageType as "chat" | "quote_request" | undefined,
      _quoteRequest: msg.messageType === "quote_request" && msg.metadata
        ? msg.metadata as typeof realtimeMessages[0]["_quoteRequest"]
        : undefined,
    }));

    // Filter out real-time messages that might already be in API response
    const latestApiTimestamp = apiFormatted.length > 0
      ? Math.max(...apiFormatted.map((m) => m.timestamp))
      : 0;

    const newRealtimeMessages = realtimeMessages.filter(
      (msg) => msg.timestamp > latestApiTimestamp
    );

    return [...apiFormatted, ...newRealtimeMessages];
  }, [data?.pages, realtimeMessages]);

  // Handle scroll to load more messages
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingNextPage || !hasNextPage) return;

    // Load more when scrolled near top (within 100px)
    if (container.scrollTop < 100) {
      const prevScrollHeight = container.scrollHeight;

      fetchNextPage().then(() => {
        // Maintain scroll position after loading older messages
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
          }
        });
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    // Hide dashboard header
    setHeader({
      title: "",
      description: "",
      showBreadcrumbs: false,
      showButton: false,
    });

    // Mark messages as read when entering chat page
    markAsRead();

    // Always refetch so WS messages aren't lost behind a stale React Query cache
    void queryClient.invalidateQueries({ queryKey: queryKeys.chats.myMessages });

    // Clear real-time buffer when leaving (history comes from API next visit)
    return () => {
      clearMessages();
    };
  }, [setHeader, markAsRead, clearMessages, queryClient]);

  // Scroll to bottom on initial load only
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0 && !isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    }
  }, [messages, isLoading]);

  // Scroll to bottom when new real-time messages arrive
  useEffect(() => {
    if (!isInitialLoad.current && realtimeMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [realtimeMessages]);

  const handleSend = (content: string) => {
    sendMessage(content);
    // Stop typing indicator when message sent
    sendTyping(false);
  };

  // Handle typing indicator
  const handleTyping = useCallback((isTyping: boolean) => {
    sendTyping(isTyping);
  }, [sendTyping]);

  // Online/typing status indicator
  const OnlineStatus = () => {
    if (isOtherPartyTyping) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#FD6900]">
          <div className="flex gap-0.5">
            <span className="w-1.5 h-1.5 bg-[#FD6900] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-[#FD6900] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-[#FD6900] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span>typing...</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-[#81868C]">
        <div className={`w-2 h-2 rounded-full ${isOtherPartyOnline ? "bg-green-500" : "bg-gray-400"}`} />
        <span>{isOtherPartyOnline ? "Online" : "Offline"}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-[#EAEAEA]">
      {/* Chat Header */}
      <div className="bg-[#FAFAFA] border-b border-[#EAEAEA] p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className="text-white font-semibold text-sm"
            style={{ background: "linear-gradient(180deg, #FD6900 0%, #FF9F5A 100%)" }}
          >
            F
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-base">Fail2Fix</h2>
          <OnlineStatus />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-[#F5F5F5] px-4 md:px-6 py-4 flex flex-col flex-1 overflow-y-auto"
      >
        <div className="flex flex-col gap-4 flex-1">
          {/* Loading indicator for older messages */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#81868C]" />
              <span className="ml-2 text-xs text-[#81868C]">Loading older messages...</span>
            </div>
          )}

          {/* Show "load more" hint if there are more messages */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="text-center text-xs text-[#81868C] py-2">
              Scroll up to load older messages
            </div>
          )}

          <div className="w-full flex justify-center">
            <div className="text-[0.8rem] font-medium text-[#81868C]">
              {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="py-2 flex flex-col">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#81868C]" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                Failed to load messages
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-[#81868C] py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => {
                const showTime = shouldShowTime(messages, index);
                const isGrouped = isGroupedWithPrevious(messages, index);

                // Render quote request card
                if (msg._type === "quote_request" && msg._quoteRequest) {
                  return (
                    <div
                      key={`${msg.timestamp}-${index}`}
                      className="mt-3 first:mt-0"
                    >
                      <QuoteRequestCard
                        quoteRequest={msg._quoteRequest}
                        time={formatTime(msg.timestamp)}
                        showTime={showTime}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  );
                }

                // Render regular chat message
                return (
                  <div
                    key={`${msg.timestamp}-${index}`}
                    className={isGrouped ? "mt-1" : "mt-3 first:mt-0"}
                  >
                    <Chatbox
                      message={msg.content}
                      time={formatTime(msg.timestamp)}
                      isOwn={
                        "senderRole" in msg && msg.senderRole
                          ? msg.senderRole === "customer"
                          : !!myUserId && msg.senderId === myUserId
                      }
                      showTime={showTime}
                      isGrouped={isGrouped}
                    />
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-[#F5F5F5] p-4 border-t border-[#EAEAEA] space-y-2">
        {!isConnected && (
          <p className="text-center text-xs text-[#813500] bg-[#FFF8F3] border border-[#FFE4D2] rounded-lg px-3 py-2">
            Reconnecting to chat… Messages can&apos;t be sent until you&apos;re back online.
          </p>
        )}
        <Chatinput onSend={handleSend} onTyping={handleTyping} disabled={!isConnected} />
      </div>

      {/* Quote Details Sheet */}
      <QuoteDetailsSheet
        requestId={selectedRequestId}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
