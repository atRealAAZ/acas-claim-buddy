import { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Pause, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MEDITATION_SCRIPTS = [
  {
    title: "Calming Breath",
    duration: "2 min",
    text: `Let's begin with a calming breath exercise. Find a comfortable position and close your eyes if you feel comfortable doing so. 
    
Take a deep breath in through your nose for four counts. One, two, three, four. 
Hold that breath gently for four counts. One, two, three, four.
Now slowly exhale through your mouth for six counts. One, two, three, four, five, six.

Let's repeat this together.
Breathe in. One, two, three, four.
Hold. One, two, three, four.
Breathe out slowly. One, two, three, four, five, six.

You're doing wonderfully. Remember, this tribunal process is just one chapter in your life. You have the strength to navigate it.

One more time. Breathe in deeply. One, two, three, four.
Hold with ease. One, two, three, four.
Release all tension as you exhale. One, two, three, four, five, six.

When you're ready, gently open your eyes. You are calm, focused, and capable.`
  },
  {
    title: "Stress Relief",
    duration: "3 min",
    text: `Welcome to this stress relief meditation. Take a moment to notice how you're feeling right now. There's no judgment here, just awareness.

Begin by taking a slow, deep breath. Feel your chest expand. Now release it slowly, letting go of any tension.

Imagine a warm, golden light at the top of your head. With each breath, feel this light slowly moving down through your body.

It flows through your forehead, relaxing any worry lines. Through your eyes, releasing strain. Down through your jaw, let it unclench.

The warm light continues down your neck and shoulders. Feel the tension melting away. Down through your arms to your fingertips.

This healing light moves through your chest, calming your heartbeat. Through your stomach, releasing any knots of anxiety.

Down through your hips, your legs, all the way to your toes. Your entire body is now bathed in this peaceful, golden light.

Take one more deep breath. You are safe. You are supported. You have everything you need to handle what comes next.

Slowly bring your awareness back to the room. Wiggle your fingers and toes. When you're ready, open your eyes.`
  },
  {
    title: "Confidence Boost",
    duration: "2 min",
    text: `This meditation is designed to boost your confidence as you prepare for your tribunal case.

Close your eyes and take three deep breaths with me.
Breathe in strength. Breathe out doubt.
Breathe in courage. Breathe out fear.
Breathe in clarity. Breathe out confusion.

Now, picture yourself handling your case with calm confidence. See yourself speaking clearly and being heard. Your words matter. Your experience matters. Your truth matters.

Repeat after me in your mind:
I am prepared.
I am capable.
I deserve to be treated fairly.
I will speak my truth with confidence.

Feel these words settle into your heart. You have already shown incredible strength by standing up for yourself. That takes real courage.

Take one final deep breath. Carry this confidence with you today and every day. You've got this.

When you're ready, open your eyes and face your day with renewed strength.`
  }
];

export function MeditationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedScript, setSelectedScript] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(MEDITATION_SCRIPTS[selectedScript].text);
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    
    // Try to find a calm-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Daniel') ||
      v.name.includes('Google UK English Female')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 rounded-xl border border-border bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:via-purple-500/20 hover:to-fuchsia-500/20 transition-all duration-300 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Take a Moment to Breathe</h3>
            <p className="text-sm text-muted-foreground">Guided meditation to help you stay calm</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="p-5 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="font-semibold text-foreground">Guided Meditation</h3>
        </div>
        <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {MEDITATION_SCRIPTS.map((script, index) => (
          <button
            key={index}
            onClick={() => {
              if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
              }
              setSelectedScript(index);
            }}
            className={cn(
              "p-2 rounded-lg text-sm font-medium transition-all",
              selectedScript === index
                ? "bg-violet-500 text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <div>{script.title}</div>
            <div className="text-xs opacity-75">{script.duration}</div>
          </button>
        ))}
      </div>

      <div className="bg-background/50 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {MEDITATION_SCRIPTS[selectedScript].text.slice(0, 200)}...
        </p>
      </div>

      <Button
        onClick={handlePlay}
        className={cn(
          "w-full",
          isPlaying 
            ? "bg-violet-600 hover:bg-violet-700" 
            : "bg-violet-500 hover:bg-violet-600"
        )}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause Meditation
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Start Meditation
          </>
        )}
      </Button>

      {isPlaying && (
        <div className="mt-3 flex items-center justify-center gap-1">
          <Volume2 className="w-4 h-4 text-violet-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Playing audio...</span>
        </div>
      )}
    </div>
  );
}
