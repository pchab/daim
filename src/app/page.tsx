'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { submitAction } from '@/modules/actions';
import { useDaimStore } from '@/stores/campaign.store';
import Lore from './Lore';
import { SendIcon } from '@/components/icons/SendIcon';
import { SparklesIcon } from '@/components/icons/SparklesIcon';
import { useShallow } from 'zustand/shallow';
import { enrichLore } from '@/modules/lore/lore.actions';

export default function DungeonMaster() {
  const {
    texts,
    lore,
    setTexts,
    tagRelevantLore,
    changeShouldUpdateLore,
  } = useDaimStore(useShallow((state) => ({
    texts: state.texts,
    lore: state.lore,
    tagRelevantLore: state.tagRelevantLore,
    setTexts: state.setTexts,
    changeShouldUpdateLore: state.changeShouldUpdateLore,
  })));
  const [userAction, setUserAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAction.trim() || isLoading) return;

    setIsLoading(true);
    const newGameText = [...texts, `> ${userAction}`];
    setTexts(newGameText);
    setUserAction('');


    const lastGameText = texts.slice(-1);
    const recentGameTexts = texts.slice(-3);
    let newText = '';

    try {
      await tagRelevantLore(`${lastGameText.join('\n')}. ${userAction}.`);
      const releventLore = lore.filter(({ relevant }) => relevant);
      const response = await submitAction(userAction, releventLore.map(({ content }) => content).join('\n'), recentGameTexts);
      for await (const line of response) {
        newText += line;
        setTexts([...newGameText, newText]);
      }
      changeShouldUpdateLore(true);
    } catch (error) {
      setTexts([...newGameText, 'Something went wrong with the AI. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='flex min-h-screen flex-col bg-gray-900 text-gray-100'>
      <div className='container mx-auto px-4 py-8 flex flex-col h-screen max-w-4xl'>
        <header className='mb-6 text-center'>
          <h1 className='text-4xl font-bold text-amber-500 mb-2'>AI Dungeon Master</h1>
          <p className='text-gray-400'>Embark on an AI-powered adventure in the world of Eldoria</p>
        </header>

        <div className='flex flex-col md:flex-row gap-4 flex-1 overflow-hidden'>
          {/* Desktop Lore Panel */}
          <Lore />

          {/* Game Display */}
          <div className='flex-1 flex flex-col bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden'>
            <ScrollArea className='flex-1 p-4'>
              <div className='space-y-4'>
                {texts.map((text, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg',
                      text.startsWith('>')
                        ? 'bg-gray-700/50 text-gray-300 italic'
                        : 'bg-gray-800/50 border border-gray-700 text-amber-100',
                    )}
                  >
                    {text.startsWith('>') ? (
                      text
                    ) : (
                      <div className='flex items-start'>
                        <SparklesIcon className='h-5 w-5 text-amber-500 mr-2 mt-1 flex-shrink-0' />
                        <div>{text}</div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className='p-3 bg-gray-800/50 rounded-lg border border-gray-700 animate-pulse'>
                    <div className='flex items-center space-x-2'>
                      <SparklesIcon className='h-5 w-5 text-amber-500' />
                      <span>The AI is crafting your adventure...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* User Input */}
            <div className='p-4 border-t border-gray-700 bg-gray-800/50'>
              <form onSubmit={handleSubmitAction} className='flex items-center space-x-2'>
                <Input
                  value={userAction}
                  onChange={(e) => setUserAction(e.target.value)}
                  placeholder='What do you do next?'
                  className='flex-1 bg-gray-700 border-gray-600 focus-visible:ring-amber-500'
                  disabled={isLoading}
                />
                <Button
                  type='submit'
                  disabled={isLoading || !userAction.trim()}
                  className='bg-amber-600 hover:bg-amber-700 text-white h-8 w-8'
                >
                  <SendIcon className='h-4 w-4' />
                  <span className='sr-only'>Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
