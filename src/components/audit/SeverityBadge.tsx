import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react';

type Severity = 'critical' | 'major' | 'minor' | 'enhancement';

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  className?: string;
}

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: AlertCircle,
    className: 'badge-critical',
  },
  major: {
    label: 'Major',
    icon: AlertTriangle,
    className: 'badge-warning',
  },
  minor: {
    label: 'Minor',
    icon: Info,
    className: 'badge-info',
  },
  enhancement: {
    label: 'Enhancement',
    icon: Lightbulb,
    className: 'badge-success',
  },
};

export const SeverityBadge = ({ severity, showIcon = true, className }: SeverityBadgeProps) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
      role="status"
      aria-label={`Severity: ${config.label}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
      {config.label}
    </span>
  );
};
