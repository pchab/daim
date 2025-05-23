'use client';

import { enrichLore } from '@/modules/lore/lore.actions';
import { useDaimStore } from '@/stores/campaign.store';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

export default function Lore() {
  const {
    texts,
    lore,
    setLore,
    shouldUpdateLore,
    changeShouldUpdateLore,
  } = useDaimStore(useShallow((state) => ({
    texts: state.texts,
    lore: state.lore,
    setLore: state.setLore,
    shouldUpdateLore: state.shouldUpdateLore,
    changeShouldUpdateLore: state.changeShouldUpdateLore,
  })));

  useEffect(() => {
    if (!shouldUpdateLore) return;
    const lastGameTexts = texts.slice(-3);
    enrichLore(
      lore.map(({ embedding, relevant, ...lorefact }) => lorefact),
      lastGameTexts,
    ).then((newLore) => {
      if (newLore) {
        setLore(newLore);
      }
      changeShouldUpdateLore(false);
    });
  }, [shouldUpdateLore]);

  return <div className="w-1/3 bg-gray-800/50 rounded-lg border border-gray-700 overflow-scroll">
    <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
      <h2 className="font-semibold">Game Lore</h2>
      {shouldUpdateLore && <p>Updating...</p>}
    </div>

    <h3 className="p-3 text-gray-400">Locations</h3>
    {lore.filter(({ type }) => type === 'location').map((location, index) => (
      <div key={index} className='p-4'>{location.relevant && '*'}{location.name}: <p>{location.content}</p></div>
    ))}
    <h3 className="p-3 text-gray-400">Characters</h3>
    {lore.filter(({ type }) => type === 'character').map((character, index) => (
      <div key={index} className='p-4'>{character.relevant && '*'}{character.name}: <p>{character.content}</p></div>
    ))}
  </div>;
}