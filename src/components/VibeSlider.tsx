import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface VibeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const VibeSlider = ({ value, onChange }: VibeSliderProps) => {
  return (
    <motion.div 
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Minimal</span>
          <span>Dense</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="text-center">
          <span className="text-xs text-muted-foreground">Vibe Intensity</span>
        </div>
      </div>
    </motion.div>
  );
};