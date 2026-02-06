import { tool } from 'ai'
import { z } from 'zod'

export const getRecipe = tool({
  description: 'Generate a complete structured recipe. Call this when the user asks for a recipe or what to cook with specific ingredients.',
  inputSchema: z.object({
    name: z.string(),
    cuisine: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    prepTimeMinutes: z.number(),
    cookTimeMinutes: z.number(),
    servings: z.number(),
    ingredients: z.array(z.object({
      item: z.string(),
      quantity: z.string(),
      unit: z.string(),
    })),
    steps: z.array(z.string()),
  }),
})

export const calculateNutrition = tool({
  description: 'Calculate nutritional values for a dish. Call this when the user asks about calories, macros or nutritional info.',
  inputSchema: z.object({
    dishName: z.string(),
    servingSize: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
    sugar: z.number(),
  }),
})

export const substituteIngredient = tool({
  description: 'Suggest ingredient alternatives with quality ratings. Call this when the user says an ingredient is missing or asks for a replacement.',
  inputSchema: z.object({
    original: z.string(),
    reason: z.string(),
    substitutes: z.array(z.object({
      name: z.string(),
      ratio: z.string(),
      notes: z.string(),
      quality: z.enum(['perfect', 'good', 'acceptable']),
    })),
  }),
})

export const tools = {
  getRecipe,
  calculateNutrition,
  substituteIngredient,
}
