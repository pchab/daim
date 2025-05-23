'use server';

import { generateObject } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { loreSchema, type LoreFact } from './lore.model';

export async function enrichLore(currentLore: LoreFact[], lastGameTexts: string[]) {
  try {
    const prompt = `
# CONTEXT #
You are an assistant for a dungeon master. Your goal is to help him maintain a consistent world.
Given the most recent events of the game, you must update a JSON document containing all known locations and characters with their descriptions.

# INFORMATION #
This is the last lines of the game containing the most recent events:
${lastGameTexts.join('\n')}

This is the current state of the world that you will need to update:
${JSON.stringify(currentLore, null, 2)}

# TASK #
You MUST identify information about all new important locations and characters mentioned.
You MUST update the content of object in the current state if new information is provided.
You can change the name of the object if a more accurate name is provided.
The content is a short description for all objects, and is REQUIRED. Keep the description short, concise and under 25 words.
DO NOT remove objects from the current state even if they are not mentioned.
You MUST avoid duplicates, if the object already exists in the current state, update it.

# RESPONSE #
The response format MUST be similar to the current state of the world.
The response format MUST be one array of elements following this schema:
{
  name: ###Name of the location or character###,
  content: ###Short description of the location or character###,
  type: 'location' | 'character'
}
    `;

    const { object } = await generateObject({
      model: ollama('HammerAI/hermes-3-llama-3.1', { mirostatTau: 1 }),
      output: 'array',
      schema: loreSchema,
      prompt,
    });
    return object;
  } catch (error) {
    console.error('Could not update lore', error);
  }
}
