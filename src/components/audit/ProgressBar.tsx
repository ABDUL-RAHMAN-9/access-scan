import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  label: string;
  className?: string;
}

export const ProgressBar = ({ progress, label, className }: ProgressBarProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div 
        className="progress-accessible"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div 
          className="progress-accessible-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
