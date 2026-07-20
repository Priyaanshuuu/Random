"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { Navbar } from "@/components/chat/Navbar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import {
  CONVERSATIONS,
  type ChatMessage,
  type Conversation,
} from "@/lib/dummy-data";

export default function ChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(CONVERSATIONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const messages = activeConversation?.messages ?? [];

  const updateActiveMessages = (next: ChatMessage[]) => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: next } : c)),
    );
  };

  const handleNewChat = () => {
    const id = `local-conv-${conversations.length + 1}`;
    const fresh: Conversation = {
      id,
      title: "New chat",
      updatedAt: "Now",
      messages: [],
    };
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(id);
    setSidebarOpen(false);
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={activeConversation?.title ?? "New chat"}
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <ChatContainer
          key={activeId ?? "empty"}
          messages={messages}
          onMessagesChange={updateActiveMessages}
        />
      </div>
    </div>
  );
}
