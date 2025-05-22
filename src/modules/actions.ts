'use server';

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

export async function submitAction(userAction: string, lore: string, lastGameTexts: string[]) {
  const result = await streamText({
    model: ollama('HammerAI/hermes-3-llama-3.1'),
    system: `You are an AI Dungeon Master for a fantasy RPG. Use the following lore to inform your responses:
${lore}

Respond with vivid, immersive descriptions. Always keep responses under 50 words.
Avoid repeating yourself, or repeating what was previsouly said.
Don't mention that you're an AI or that this is a game. The player actions start with a > symbol.
Do not take actions for the player but focus on making the other characters react to the player.

This is the last lines of the game:
${lastGameTexts.join('\n')}`,
    prompt: userAction,
  });

  return result.textStream;
}
