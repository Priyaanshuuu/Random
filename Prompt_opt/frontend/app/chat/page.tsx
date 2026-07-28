"use client";

import { useState } from "react";

import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/chat/Sidebar";
import { Navbar } from "@/components/chat/Navbar";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function ChatPage() {
  const {
    conversations,
    activeConversation,
    activeId,
    isSending,
    send,
    stop,
    retry,
    selectConversation,
    startNewChat,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNewChat={startNewChat}
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={activeConversation.title}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <ChatContainer
          key={activeId}
          messages={activeConversation.messages}
          isSending={isSending}
          onSend={send}
          onStop={stop}
          onRetry={retry}
        />
      </div>
    </div>
  );
}
