'use client';

import { useDaimStore } from '@/stores/campaign.store';
import { useShallow } from 'zustand/shallow';

export default function Lore() {
  const { lore } = useDaimStore(useShallow((state) => ({
    texts: state.texts,
    lore: state.lore,
    setLore: state.setLore,
  })));

  return <div className="w-1/3 bg-gray-800/50 rounded-lg border border-gray-700 overflow-scroll">
    <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center">
      <h2 className="font-semibold">Game Lore</h2>
    </div>

    <h3 className="p-3 text-gray-400">Places</h3>
    {lore.filter(({ type }) => type === 'location').map((place, index) => (
      <div key={index} className='p-4'>{place.content}</div>
    ))}
    <h3 className="p-3 text-gray-400">Characters</h3>
    {lore.filter(({ type }) => type === 'character').map((character, index) => (
      <div key={index} className='p-4'>{character.content}</div>
    ))}
  </div>;
}