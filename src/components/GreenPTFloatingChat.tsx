import { useState } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FormData {
  fullName: string;
  email: string;
  employerName: string;
  employerAddress: string;
  employmentEndDate: string;
  claimType: string;
  acasCertificateNumber: string;
  desiredOutcome: string;
}

interface GreenPTFloatingChatProps {
  formData: FormData;
}

export function GreenPTFloatingChat({ formData }: GreenPTFloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getSystemContext = () => {
    const parts = [];
    parts.push("You are a helpful legal assistant specializing in UK employment tribunal cases.");
    parts.push("You help users understand the ACAS early conciliation and ET1 claim process.");
    
    if (formData.fullName) parts.push(`The user's name is ${formData.fullName}.`);
    if (formData.email) parts.push(`Their email is ${formData.email}.`);
    if (formData.employerName) parts.push(`Their employer is ${formData.employerName}.`);
    if (formData.employerAddress) parts.push(`The employer's address is ${formData.employerAddress}.`);
    if (formData.employmentEndDate) parts.push(`Their employment ended on ${formData.employmentEndDate}.`);
    if (formData.claimType) parts.push(`They are making a claim for: ${formData.claimType}.`);
    if (formData.acasCertificateNumber) parts.push(`Their ACAS certificate number is ${formData.acasCertificateNumber}.`);
    if (formData.desiredOutcome) parts.push(`Their desired outcome is: ${formData.desiredOutcome}.`);
    
    parts.push("Be supportive, informative, and guide them through their employment tribunal journey.");
    
    return parts.join(' ');
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const messagesWithContext = [
        { role: 'system', content: getSystemContext() },
        ...newMessages
      ];

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/greenpt-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: messagesWithContext }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen 
            ? "bg-muted text-muted-foreground hover:bg-muted/80" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-card rounded-xl border border-border shadow-2xl overflow-hidden transition-all duration-300",
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/50">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Legal Assistant
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Ask me anything about your employment tribunal case
          </p>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hi! I'm here to help with your case.</p>
                <p className="text-xs mt-1">Ask me about ACAS, ET1 forms, or deadlines.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 h-9 text-sm"
            />
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()} className="h-9 w-9 p-0">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
