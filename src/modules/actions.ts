'use server';

import { streamText } from 'ai';
import { ollama } from 'ollama-ai-provider';

export async function submitAction(userAction: string, lore: string, lastGameTexts: string[]) {
  const result = await streamText({
    model: ollama('HammerAI/hermes-3-llama-3.1', { mirostatTau: 10 }),
    system: `# CONTEXT #
You are an AI Dungeon Master for a fantasy RPG.

# OBJECTIVES #
Provide a compelling and immersive experience for the player.

Use the following lore to inform your responses:
${lore}

This is the last lines of the game:
${lastGameTexts.join('\n')}

# STYLES #
You MUST keep your response under 50 words. You will be penalized if you exceed 50 words.
Respond with vivid, immersive descriptions.
Avoid repeating yourself, or repeating what was previously said.
Don't mention that you're an AI or that this is a game. The player actions start with a > symbol.
Do not take actions for the player but focus on making the other characters react to the player.`,
    prompt: userAction,
  });

  return result.textStream;
}
