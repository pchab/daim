"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Scroll, Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitAction } from '@/modules/actions'

export default function DungeonMaster() {
  const [gameText, setGameText] = useState<string[]>([
    "Welcome, brave adventurer, to the mystical land of Eldoria. You find yourself standing at the edge of a dense forest. The air is thick with the scent of pine and something... magical. A narrow path winds its way into the trees, and you can hear the faint sound of rushing water in the distance. What do you do?",
  ])
  const [userAction, setUserAction] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loreOpen, setLoreOpen] = useState(false)
  const [lore, setLore] = useState(`# World of Eldoria

## Regions
- The Whispering Woods: A dense forest with ancient magic
- The Crystalline Mountains: Home to dwarves and precious gems
- The Sunken City: An underwater ruin filled with treasures and dangers

## Characters
- The Oracle of Mist: A mysterious seer who speaks in riddles
- King Thorne: The ruler of the human kingdom, rumored to be corrupted
- The Emerald Dragon: An ancient being who guards the realm

## Current Quest
You are searching for the lost Amulet of Ages, said to grant its wearer control over time itself.`)

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAction.trim() || isLoading) return

    setIsLoading(true)
    const newGameText = [...gameText, `> ${userAction}`]
    setGameText(newGameText)
    setUserAction("")

    try {
      const response = await submitAction(userAction, lore);
      let newText = "";
      for await (const line of response) {
        newText += line;
        setGameText([...newGameText, newText]);
      }
    } catch (error) {
      setGameText([...newGameText, "Something went wrong with the AI. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  const updateLore = (newLore: string) => {
    setLore(newLore)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 flex flex-col h-screen max-w-4xl">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">AI Dungeon Master</h1>
          <p className="text-gray-400">Embark on an AI-powered adventure in the world of Eldoria</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
          {/* Lore Panel (Collapsible on mobile, sidebar on desktop) */}
          <div className="md:hidden w-full mb-4">
            <Collapsible open={loreOpen} onOpenChange={setLoreOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between border-amber-700/50 bg-gray-800/50"
                >
                  <div className="flex items-center">
                    <Scroll className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Game Lore</span>
                  </div>
                  {loreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <LoreEditor lore={lore} updateLore={updateLore} />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Lore Panel */}
          <div className="hidden md:block w-1/3 bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center">
              <Scroll className="mr-2 h-4 w-4 text-amber-500" />
              <h2 className="font-semibold">Game Lore</h2>
            </div>
            <LoreEditor lore={lore} updateLore={updateLore} />
          </div>

          {/* Game Display */}
          <div className="flex-1 flex flex-col bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {gameText.map((text, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg",
                      text.startsWith(">")
                        ? "bg-gray-700/50 text-gray-300 italic"
                        : "bg-gray-800/50 border border-gray-700 text-amber-100",
                    )}
                  >
                    {text.startsWith(">") ? (
                      text
                    ) : (
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-amber-500 mr-2 mt-1 flex-shrink-0" />
                        <div>{text}</div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      <span>The AI is crafting your adventure...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* User Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <form onSubmit={handleSubmitAction} className="flex items-center space-x-2">
                <Input
                  value={userAction}
                  onChange={(e) => setUserAction(e.target.value)}
                  placeholder="What do you do next?"
                  className="flex-1 bg-gray-700 border-gray-600 focus-visible:ring-amber-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !userAction.trim()}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

interface LoreEditorProps {
  lore: string
  updateLore: (newLore: string) => void
}

function LoreEditor({ lore, updateLore }: LoreEditorProps) {
  return (
    <Textarea
      value={lore}
      onChange={(e) => updateLore(e.target.value)}
      className="w-full h-full min-h-[300px] p-3 bg-gray-800/30 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-gray-200"
      placeholder="Edit your game lore here..."
    />
  )
}
