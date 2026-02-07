'use client'

import type { SousChefMessage } from '@/lib/ai/types'
import { Message, MessageContent } from '@/components/ai-elements/message'
import { Suggestion } from '@/components/ai-elements/suggestion'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { MessagePart } from './message-parts'

const starterSuggestions = [
  "What's a classic French onion soup recipe?",
  "How can I substitute eggs in baking?",
  "What's the nutrition in a Caesar salad?",
  "Give me a simple pasta carbonara recipe",
]

export function MessageList({
  messages,
  status,
  onSuggestion,
  onSaveRecipe,
}: {
  messages: SousChefMessage[]
  status: string
  onSuggestion: (suggestion: string) => void
  onSaveRecipe?: (recipe: Record<string, unknown>) => void
}) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl" aria-hidden="true">👨‍🍳</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Bonjour!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What are we cooking today?
            </p>
          </div>
        </div>
        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {starterSuggestions.map((s) => (
            <Suggestion key={s} suggestion={s} onClick={onSuggestion} />
          ))}
        </div>
      </div>
    )
  }

  const isWaiting =
    status === 'submitted' &&
    messages[messages.length - 1].role === 'user'

  return (
    <div className="flex flex-col gap-6 px-3 py-4 sm:px-4 sm:py-6">
      {messages.map((message) => (
        <Message key={message.id} from={message.role}>
          <MessageContent>
            {message.role === 'user' ? (
              message.parts
                .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
                .map((p, i) => (
                  <p key={i} className="whitespace-pre-wrap">{p.text}</p>
                ))
            ) : (
              message.parts.map((part, i) => (
                <MessagePart key={i} part={part} onSaveRecipe={onSaveRecipe} />
              ))
            )}
          </MessageContent>
        </Message>
      ))}

      {isWaiting && (
        <Message from="assistant">
          <MessageContent>
            <Shimmer duration={1.5}>Le Sous-Chef is thinking...</Shimmer>
          </MessageContent>
        </Message>
      )}
    </div>
  )
}
