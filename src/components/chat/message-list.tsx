'use client'

import type { SousChefMessage } from '@/lib/ai/types'
import { MessagePart } from './message-parts'
import { cn } from '@/lib/utils'

export function MessageList({ messages }: { messages: SousChefMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center text-muted-foreground">
        <p>Ask the Sous-Chef anything about cooking!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex flex-col gap-1.5',
            message.role === 'user' ? 'items-end' : 'items-start'
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">
            {message.role === 'user' ? 'You' : 'Le Sous-Chef'}
          </span>
          <div
            className={cn(
              'rounded-2xl px-4 py-2.5',
              message.role === 'user'
                ? 'max-w-[85%] bg-primary text-primary-foreground'
                : 'max-w-full bg-muted sm:max-w-[85%]'
            )}
          >
            <div className="space-y-3">
              {message.parts.map((part, i) => (
                <MessagePart key={i} part={part} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
