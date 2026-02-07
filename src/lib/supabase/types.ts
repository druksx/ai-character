export interface ConversationRow {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface MessageRow {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string // JSON.stringify(UIMessage.parts)
  created_at: string
}

export interface SavedRecipeRow {
  id: string
  conversation_id: string | null
  name: string
  cuisine: string
  difficulty: 'easy' | 'medium' | 'hard'
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  ingredients: unknown
  steps: unknown
  created_at: string
}
