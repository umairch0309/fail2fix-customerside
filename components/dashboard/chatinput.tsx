"use client";

import React, { useState, useRef, useCallback } from "react";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

interface ChatinputProps {
  onSend?: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const Chatinput: React.FC<ChatinputProps> = ({
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Write a message...",
}) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const handleTypingStart = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping?.(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping?.(false);
    }, 2000);
  }, [onTyping]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    // Clear typing timeout and notify stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    onTyping?.(false);

    onSend?.(message.trim());
    setMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-xl p-2 flex items-center gap-2">
      <Input
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="border-none shadow-none h-10 placeholder:text-[#81868C] placeholder:font-medium placeholder:text-sm flex-1"
        placeholder={placeholder}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="h-9 w-9 bg-[#FD6900] hover:bg-[#E55F00] rounded-lg shrink-0 disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Chatinput;
