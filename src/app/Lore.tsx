import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { Embedding } from '@/modules/lore/lore.embeddings';
import { useDaimStore } from '@/modules/lore/lore.store';

export default function Lore() {
  const { lore, setLore } = useDaimStore();


  return <div className="hidden md:block w-1/3 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
    <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center">
      <ScrollArea className="mr-2 h-4 w-4 text-amber-500" />
      <h2 className="font-semibold">Game Lore</h2>
    </div>

    <h3 className="p-3 text-gray-400">Places</h3>
    {lore.filter(({ type }) => type === 'place').map((place, index) => (
      <Textarea
        value={place.content}
        onChange={(e) => setLore(e.target.value, 'place', place.embedding)}
        className="w-full h-full min-h-[300px] p-3 bg-gray-800/30 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-gray-200"
        placeholder="Edit your game lore here..."
      />
    ))}
    <h3 className="p-3 text-gray-400">Characters</h3>
    {lore.filter(({ type }) => type === 'character').map((character, index) => (
      <Textarea
        value={character.content}
        onChange={(e) => setLore(e.target.value, 'character', character.embedding)}
        className="w-full h-full min-h-[300px] p-3 bg-gray-800/30 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-gray-200"
        placeholder="Edit your game lore here..."
      />
    ))}
  </div>;
}