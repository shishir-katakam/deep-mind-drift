import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onTimerToggle: () => void;
  timerActive: boolean;
}

export const PlaybackControls = ({ 
  isPlaying, 
  onTogglePlay, 
  onTimerToggle, 
  timerActive 
}: PlaybackControlsProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-surface-1/80 backdrop-blur-md border border-surface-3/50 rounded-2xl p-4 shadow-elegant">
        <div className="flex items-center gap-6">
          <Button
            variant="default"
            size="icon"
            onClick={onTogglePlay}
            className="w-14 h-14 rounded-full bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onTimerToggle}
            className={`transition-all duration-200 hover:scale-110 ${
              timerActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Timer className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};