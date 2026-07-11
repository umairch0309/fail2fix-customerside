"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { apiGet } from "@/lib/api-client";
import type { ChatMessage, Chat } from "@/types/chat";

const MESSAGES_PER_PAGE = 20;

export function useMyChat() {
  return useQuery({
    queryKey: queryKeys.chats.all,
    queryFn: async (): Promise<Chat | null> => apiGet<Chat | null>("/api/chat"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useChatMessages() {
  return useInfiniteQuery({
    queryKey: queryKeys.chats.myMessages,
    queryFn: async ({ pageParam }): Promise<ChatMessage[]> =>
      apiGet<ChatMessage[]>("/api/chat/messages", {
        limit: MESSAGES_PER_PAGE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < MESSAGES_PER_PAGE) {
        return undefined;
      }
      return allPages.flat().length;
    },
    staleTime: 30 * 1000,
  });
}
