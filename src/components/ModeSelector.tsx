import { useState } from 'react';
import { Button } from '@/components/ui/button';

const modes = [
  { id: 'focus', name: 'Focus', description: 'Deep concentration' },
  { id: 'relax', name: 'Relax', description: 'Calm your mind' },
  { id: 'sleep', name: 'Sleep', description: 'Rest peacefully' },
  { id: 'move', name: 'Move', description: 'Active energy' },
  { id: 'study', name: 'Study', description: 'Learning flow' }
];

interface ModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-3">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={selectedMode === mode.id ? "default" : "ghost"}
          className={`
            w-full justify-start text-left transition-all duration-300 ease-out
            ${selectedMode === mode.id 
              ? 'bg-surface-2 text-foreground border border-surface-3 shadow-glow' 
              : 'bg-surface-1/50 text-muted-foreground hover:bg-surface-2/70 hover:text-foreground'
            }
            backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]
          `}
          onClick={() => onModeChange(mode.id)}
        >
          <div>
            <div className="font-medium">{mode.name}</div>
            <div className="text-xs opacity-70">{mode.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};