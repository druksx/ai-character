'use client'

import { useState, useCallback, useRef } from 'react'
import { useConversations } from '@/hooks/use-conversations'
import { ConversationSidebar } from '@/components/sidebar/conversation-sidebar'
import { ChatInterface } from './chat-interface'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { SousChefMessage } from '@/lib/ai/types'
import type { MessageRow } from '@/lib/supabase/types'

export function ChatLayout() {
  const { conversations, isLoading, create, remove, refresh, updateTitle } = useConversations()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [loadedMessages, setLoadedMessages] = useState<SousChefMessage[] | null>(null)
  // chatKey only changes on explicit user actions (select, new, delete) — NOT on lazy creation
  const chatKeyRef = useRef(0)
  const [chatKey, setChatKey] = useState(0)

  const handleSelect = useCallback(async (id: string) => {
    setActiveId(id)
    setSidebarOpen(false)
    setMobileSheetOpen(false)
    const res = await fetch(`/api/conversations/${id}`)
    const dbMessages: MessageRow[] = await res.json()
    const uiMessages: SousChefMessage[] = dbMessages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: JSON.parse(m.content),
    }))
    setLoadedMessages(uiMessages)
    chatKeyRef.current += 1
    setChatKey(chatKeyRef.current)
  }, [])

  const handleNew = useCallback(() => {
    setActiveId(null)
    setLoadedMessages(null)
    setSidebarOpen(false)
    setMobileSheetOpen(false)
    chatKeyRef.current += 1
    setChatKey(chatKeyRef.current)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      await remove(id)
      if (activeId === id) {
        setActiveId(null)
        setLoadedMessages(null)
        chatKeyRef.current += 1
        setChatKey(chatKeyRef.current)
      }
    },
    [activeId, remove],
  )

  const handleConversationCreated = useCallback(
    (id: string) => {
      // Only update activeId for sidebar highlighting — do NOT change chatKey
      // Changing key would unmount ChatInterface mid-stream, killing the response
      setActiveId(id)
      refresh()
    },
    [refresh],
  )

  const handleSaveRecipe = useCallback(
    async (recipe: Record<string, unknown>) => {
      await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, recipe }),
      })
    },
    [activeId],
  )

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const sidebarProps = {
    conversations,
    activeId,
    onSelect: handleSelect,
    onNew: handleNew,
    onDelete: handleDelete,
    isLoading,
  }

  return (
    <div className="relative flex h-dvh">
      {/* Desktop floating sidebar */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 z-30 hidden w-72 p-2 transition-transform duration-300 ease-in-out md:block',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <ConversationSidebar
            {...sidebarProps}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop backdrop (click to close) */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-20 hidden bg-black/5 md:block"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile sidebar via Sheet */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="left"
          className="w-72 border-r-0 bg-card p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          <ConversationSidebar
            {...sidebarProps}
            onClose={() => setMobileSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main chat area — always takes full width */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatInterface
          key={chatKey}
          conversationId={activeId}
          initialMessages={loadedMessages}
          onConversationCreated={handleConversationCreated}
          onOpenSidebar={handleToggleSidebar}
          onOpenMobileSidebar={() => setMobileSheetOpen(true)}
          onSaveRecipe={handleSaveRecipe}
          onTitleGenerated={updateTitle}
        />
      </div>
    </div>
  )
}
