import { createServerClient } from './server'
import type { ConversationRow, MessageRow, SavedRecipeRow } from './types'

export async function createConversation(title: string = 'New Conversation'): Promise<ConversationRow> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('conversations')
    .insert({ title })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function listConversations(): Promise<ConversationRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data ?? []
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('conversations')
    .update({ title })
    .eq('id', id)
  if (error) throw error
}

export async function deleteConversation(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error: msgError } = await supabase.from('messages').delete().eq('conversation_id', id)
  if (msgError) throw msgError
  const { error: recipeError } = await supabase.from('saved_recipes').delete().eq('conversation_id', id)
  if (recipeError) throw recipeError
  const { error } = await supabase.from('conversations').delete().eq('id', id)
  if (error) throw error
}

export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  parts: unknown[],
): Promise<MessageRow> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content: JSON.stringify(parts),
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getMessages(conversationId: string): Promise<MessageRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function saveRecipe(
  conversationId: string | null,
  recipe: {
    name: string
    cuisine: string
    difficulty: string
    prepTimeMinutes: number
    cookTimeMinutes: number
    servings: number
    ingredients: unknown
    steps: unknown
  },
): Promise<string> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('saved_recipes')
    .insert({
      conversation_id: conversationId,
      name: recipe.name,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prep_time_minutes: recipe.prepTimeMinutes,
      cook_time_minutes: recipe.cookTimeMinutes,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function listSavedRecipes(): Promise<SavedRecipeRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('saved_recipes')
    .select()
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPopularCategories(
  limit = 5,
): Promise<{ cuisine: string; recipe_count: number }[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase.rpc('get_popular_categories', {
    limit_count: limit,
  })
  if (error) throw error
  return data ?? []
}
