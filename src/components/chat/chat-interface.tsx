'use client'

import { useChat } from '@ai-sdk/react'
import { useRef, useEffect, useCallback } from 'react'
import type { SousChefMessage } from '@/lib/ai/types'
import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import { ArrowUp, Square } from 'lucide-react'

export function ChatInterface() {
  const { messages, sendMessage, status, stop, error } = useChat<SousChefMessage>()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isStreaming = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = inputRef.current?.value.trim()
    if (!text || isStreaming) return

    sendMessage({ role: 'user', parts: [{ type: 'text', text }] })
    e.currentTarget.reset()
    if (inputRef.current) inputRef.current.style.height = 'auto'
    inputRef.current?.focus()
  }

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      sendMessage({ role: 'user', parts: [{ type: 'text', text: suggestion }] })
    },
    [sendMessage]
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl" aria-hidden="true">👨‍🍳</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold leading-tight">Le Sous-Chef</h1>
            <p className="truncate text-xs text-muted-foreground">Your passionate French culinary advisor</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl">
          <MessageList
            messages={messages}
            status={status}
            onSuggestion={handleSuggestion}
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
