'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useRef, useEffect, useCallback, useMemo } from 'react'
import type { SousChefMessage } from '@/lib/ai/types'
import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import { ArrowUp, Square, Menu, PanelLeft, Bookmark } from 'lucide-react'
import Link from 'next/link'

interface ChatInterfaceProps {
  conversationId: string | null
  initialMessages: SousChefMessage[] | null
  onConversationCreated: (id: string) => void
  onOpenSidebar: () => void
  onOpenMobileSidebar: () => void
  onSaveRecipe: (recipe: Record<string, unknown>) => void
  onTitleGenerated?: (id: string, title: string) => void
}

export function ChatInterface({
  conversationId: initialConversationId,
  initialMessages,
  onConversationCreated,
  onOpenSidebar,
  onOpenMobileSidebar,
  onSaveRecipe,
  onTitleGenerated,
}: ChatInterfaceProps) {
  const conversationIdRef = useRef<string | null>(initialConversationId)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        body: () => ({ conversationId: conversationIdRef.current }),
      }),
    [],
  )

  const { messages, sendMessage, status, stop, error } =
    useChat<SousChefMessage>({
      transport,
      messages: initialMessages ?? undefined,
    })

  const isStreaming = status === 'streaming' || status === 'submitted'
  const prevStatusRef = useRef(status)
  const titleGeneratedRef = useRef(!!initialMessages)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Generate AI title after the first assistant response
  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if ((prev === 'streaming' || prev === 'submitted') && status === 'ready') {
      if (!titleGeneratedRef.current && conversationIdRef.current) {
        titleGeneratedRef.current = true
        const userMsg = messages.find((m) => m.role === 'user')
        const text = userMsg?.parts
          .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
          .map((p) => p.text)
          .join(' ')
        if (text) {
          const id = conversationIdRef.current
          fetch(`/api/conversations/${id}/title`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
          })
            .then((res) => res.json())
            .then(({ title }) => {
              if (title) onTitleGenerated?.(id, title)
            })
            .catch(() => {})
        }
      }
    }
  }, [status, messages, onTitleGenerated])

  async function ensureConversation(text: string): Promise<void> {
    if (conversationIdRef.current) return
    const title = text.length > 30 ? text.slice(0, 28) + '...' : text
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const conversation = await res.json()
    conversationIdRef.current = conversation.id
    onConversationCreated(conversation.id)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const text = inputRef.current?.value.trim()
    if (!text || isStreaming) return

    await ensureConversation(text)
    sendMessage({ role: 'user', parts: [{ type: 'text', text }] })
    form.reset()
    if (inputRef.current) inputRef.current.style.height = 'auto'
    inputRef.current?.focus()
  }

  const handleSuggestion = useCallback(
    async (suggestion: string) => {
      await ensureConversation(suggestion)
      sendMessage({ role: 'user', parts: [{ type: 'text', text: suggestion }] })
    },
    [sendMessage, onConversationCreated],
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          {/* Desktop: toggle floating sidebar */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSidebar}
            className="hidden shrink-0 text-muted-foreground hover:text-foreground md:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-5" />
          </Button>
          {/* Mobile: open sheet sidebar */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobileSidebar}
            className="shrink-0 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl" aria-hidden="true">👨‍🍳</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold leading-tight">Le Sous-Chef</h1>
            <p className="truncate text-xs text-muted-foreground">Your passionate French culinary advisor</p>
          </div>
          <Link
            href="/recipes"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            aria-label="Saved recipes"
          >
            <Bookmark className="size-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl">
          <MessageList
            messages={messages}
            status={status}
            onSuggestion={handleSuggestion}
            onSaveRecipe={onSaveRecipe}
          />
          <div ref={bottomRef} />
        </div>
      </main>

      {error && (
        <div className="border-t border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive" role="alert">
          <div className="mx-auto max-w-2xl">{error.message}</div>
        </div>
      )}

      <div className="border-t bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2 px-3 py-2 sm:px-4 sm:py-3"
        >
          <div className="flex flex-1 items-end rounded-2xl border bg-muted/50 p-1.5 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <textarea
              ref={inputRef}
              name="message"
              placeholder="Ask about a recipe, nutrition, or ingredient substitution..."
              rows={1}
              className="min-w-0 flex-1 resize-none bg-transparent px-3 py-1.5 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none"
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              aria-label="Message"
            />
            {isStreaming ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={stop}
                className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="Stop generating"
              >
                <Square className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon-sm"
                className="shrink-0 rounded-xl"
                aria-label="Send message"
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
