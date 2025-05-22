'use server';

import { generateObject } from 'ai';
import { ollama } from 'ollama-ai-provider';
import { loreSchema } from './lore.model';

export async function enrichLore(currentLore: string, lastGameTexts: string[]) {
  try {
    const prompt = `You are an assistant for a dungeon master. Your goal is to help him maintain a consistent world.

This is the last lines of the game containing the most recent events:
${lastGameTexts.join('\n')}

Please identify all the important locations and characters mentioned in the game.
Limit your response to the objects of type 'location' and 'character'.
Only answer with the locations and characters. The content should be in the following format:
<Name of the location or character>: <Short description of the location or character>
Do not remove information from the world state, but update them if they are mentioned in the game.

This is the current state of the world that you will need to update:
${currentLore}
    `;

    console.log('Prompt', prompt);
    const { object } = await generateObject({
      model: ollama('HammerAI/hermes-3-llama-3.1'),
      output: 'array',
      schema: loreSchema,
      prompt,
    });

    console.log('Updated lore', object);
    return object;
  } catch (error) {
    console.error('Could not update lore');
  }
}
