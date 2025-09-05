import { useState } from 'react';
import { ModeSelector } from '@/components/ModeSelector';
import { PlaybackControls } from '@/components/PlaybackControls';
import { GenerativeVisual } from '@/components/GenerativeVisual';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
  };

  const handleTimerToggle = () => {
    setTimerActive(!timerActive);
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Background Visual Layer */}
      <div className="absolute inset-0">
        <GenerativeVisual mode={selectedMode} isPlaying={isPlaying} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-light text-center text-foreground mb-2">
              Ambient
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Personalized soundscapes for focus and calm
            </p>
          </div>
        </header>

        {/* Central Mode Selection */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Choose Your Mode
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedMode === 'focus' && 'Deep concentration and flow state'}
                {selectedMode === 'relax' && 'Calm your mind and reduce stress'}
                {selectedMode === 'sleep' && 'Peaceful rest and recovery'}
                {selectedMode === 'move' && 'Active energy and motivation'}
                {selectedMode === 'study' && 'Learning focus and retention'}
              </p>
            </div>
            
            <ModeSelector 
              selectedMode={selectedMode} 
              onModeChange={setSelectedMode} 
            />
          </div>
        </div>

        {/* Playback Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onTimerToggle={handleTimerToggle}
          timerActive={timerActive}
        />
      </div>
    </div>
  );
};

export default Index;
