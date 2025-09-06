import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const modes = [
  { id: 'focus', name: 'Focus', description: 'Deep concentration' },
  { id: 'odyssey', name: 'Odyssey', description: 'Epic journey' },
  { id: 'relax', name: 'Relax', description: 'Calm your mind' }
];

interface ModeSelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {modes.map((mode) => (
        <motion.div key={mode.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            className={`
              px-6 py-3 rounded-full transition-all duration-300
              ${selectedMode === mode.id 
                ? 'bg-surface-2 text-foreground border border-surface-3 shadow-glow' 
                : 'bg-surface-1/30 text-muted-foreground hover:bg-surface-2/50 hover:text-foreground border border-surface-2/30'
              }
              backdrop-blur-sm font-medium text-sm
            `}
            onClick={() => onModeChange(mode.id)}
          >
            {mode.name}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};