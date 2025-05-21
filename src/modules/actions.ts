"use server";

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

export async function submitAction(userAction: string, lore: string) {
  const result = await streamText({
    model: ollama('HammerAI/hermes-3-llama-3.1'),
    system: `You are an AI Dungeon Master for a fantasy RPG. Use the following lore to inform your responses:
      ${lore}

      Respond with vivid, immersive descriptions. Keep responses under 200 words.
      Don't mention that you're an AI or that this is a game.`,
    prompt: userAction,
  });

  return result.textStream;
}
