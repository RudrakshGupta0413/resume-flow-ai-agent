"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, LogOut } from "lucide-react"
import Logo from "./ui/logo"
import ReactMarkdown from "react-markdown"

type Message = {
  role: "user" | "assistant"
  content: string
}

const Chat = () => {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ])

    toast({
      title: "TODO",
      description: "Implement AI agent",
    })

    setInput("")
  }

  return (
    <div className='flex h-screen bg-background'>
      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <div className='border-b border-border p-4'>
          <div className='flex items-center justify-between'>
            <Logo mode='dark' />
            <a
              href='/auth/logout'
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary h-10 w-10 text-secondary-foreground hover:bg-secondary/80'
            >
              <LogOut className='w-5 h-5' />
            </a>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className='flex-1 p-4'>
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end gap-4"
                    : "flex justify-start gap-4"
                }
              >
                <div className='flex space-y-2'>
                  <div
                    className={
                      message.role === "user"
                        ? "bg-primary px-6 py-2 rounded-[25px] w-fit text-white text-right"
                        : "px-6 py-2 rounded-[25px] w-fit text-left"
                    }
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='border-t border-border p-4'>
          <div className='max-w-3xl mx-auto'>
            <div className='relative'>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !!input.trim()) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder='Ask me anything about your resume...'
                className='pr-12 py-3 min-h-[48px]'
              />
              <Button
                onClick={handleSend}
                size='icon'
                className='absolute right-1 top-1'
                disabled={!input.trim()}
              >
                <Send className='w-4 h-4' />
              </Button>
            </div>
            <div className='text-xs text-muted-foreground mt-2 text-center'>
              AI can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
