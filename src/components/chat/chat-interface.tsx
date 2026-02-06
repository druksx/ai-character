'use client'

import { useChat } from '@ai-sdk/react'
import { useRef, useEffect } from 'react'
import type { SousChefMessage } from '@/lib/ai/types'
import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

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
    const form = e.currentTarget
    const text = inputRef.current?.value.trim()
    if (!text || isStreaming) return

    sendMessage({ role: 'user', parts: [{ type: 'text', text }] })
    form.reset()
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <span className="text-2xl" aria-hidden="true">👨‍🍳</span>
        <div>
          <h1 className="text-base font-semibold">Le Sous-Chef</h1>
          <p className="text-xs text-muted-foreground">Your passionate French culinary advisor</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl">
          <MessageList messages={messages} />
          <div ref={bottomRef} />
        </div>
      </main>

      {error && (
        <div className="border-t border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive" role="alert">
          <div className="mx-auto max-w-2xl">{error.message}</div>
        </div>
      )}

      <div className="sticky bottom-0 border-t bg-background">
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl gap-2 px-3 py-3 sm:px-4 sm:py-4">
          <textarea
            ref={inputRef}
            name="message"
            placeholder="Ask about a recipe, nutrition, or ingredient substitution..."
            rows={1}
            className="min-w-0 flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={handleKeyDown}
            aria-label="Message"
          />
          {isStreaming ? (
            <Button type="button" variant="outline" onClick={stop} aria-label="Stop generating">
              Stop
            </Button>
          ) : (
            <Button type="submit" aria-label="Send message">
              <Send className="size-4" aria-hidden="true" />
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
