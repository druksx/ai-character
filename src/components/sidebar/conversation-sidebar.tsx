'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MessageSquare, Trash2, PanelLeftClose } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ConversationRow } from '@/lib/supabase/types'

interface ConversationSidebarProps {
  conversations: ConversationRow[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onClose?: () => void
  isLoading: boolean
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
  isLoading,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-3 py-3">
        <Button
          onClick={onNew}
          variant="outline"
          size="sm"
          className="flex-1 justify-start gap-2 rounded-lg border-primary/15 bg-primary/5 text-sm font-medium hover:bg-primary/10"
        >
          <Plus className="size-4" />
          New chat
        </Button>
        {onClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      <div className="mx-3 mb-2">
        <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Recent
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 px-2 pb-3">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(conv.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(conv.id)
                }
              }}
              className={cn(
                'group relative flex w-full items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer',
                'hover:bg-primary/5',
                activeId === conv.id
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'text-muted-foreground',
              )}
            >
              <MessageSquare className="size-3.5 shrink-0 opacity-40" />
              <span className="truncate">
                {conv.title.length > 28 ? conv.title.slice(0, 26) + '...' : conv.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conv.id)
                }}
                className="absolute right-1 shrink-0 rounded-md p-1 opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
                aria-label="Delete conversation"
              >
                <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
          {conversations.length === 0 && !isLoading && (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              No conversations yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
