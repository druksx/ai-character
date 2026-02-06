'use client'

import type { SousChefMessage } from '@/lib/ai/types'
import { MessagePart } from './message-parts'
import { cn } from '@/lib/utils'

export function MessageList({ messages }: { messages: SousChefMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p>Ask the Sous-Chef anything about cooking!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex flex-col gap-2',
            message.role === 'user' ? 'items-end' : 'items-start'
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">
            {message.role === 'user' ? 'You' : 'Le Sous-Chef'}
          </span>
          <div
            className={cn(
              'max-w-[85%] rounded-2xl px-4 py-2.5',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {message.parts.map((part, i) => (
              <MessagePart key={i} part={part} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
