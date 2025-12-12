import { AlertCircle, AlertTriangle, CheckCircle, Clock, FileWarning } from 'lucide-react';
import { Issue } from '@/contexts/AppContext';
import { calculateEstimatedFixTime } from '@/lib/accessibilityScanner';
import { cn } from '@/lib/utils';

interface SummaryStatsProps {
  issues: Issue[];
  passed: number;
}

export const SummaryStats = ({ issues, passed }: SummaryStatsProps) => {
  const critical = issues.filter(i => i.severity === 'critical' && !i.isFixed).length;
  const major = issues.filter(i => i.severity === 'major' && !i.isFixed).length;
  const minor = issues.filter(i => i.severity === 'minor' && !i.isFixed).length;
  const fixed = issues.filter(i => i.isFixed).length;
  const total = issues.length - fixed;
  const estimatedTime = calculateEstimatedFixTime(issues);

  const stats = [
    {
      label: 'Total Issues',
      value: total,
      icon: FileWarning,
      color: 'text-foreground',
      bg: 'bg-muted',
    },
    {
      label: 'Critical',
      value: critical,
      icon: AlertCircle,
      color: 'text-critical',
      bg: 'bg-critical/10',
    },
    {
      label: 'Major',
      value: major,
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Passed',
      value: passed,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Est. Fix Time',
      value: estimatedTime,
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" role="region" aria-label="Audit summary statistics">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className={cn(
            "glass-card rounded-xl p-4 text-center",
            "hover-lift"
          )}
        >
          <div className={cn(
            "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
            stat.bg
          )}>
            <stat.icon className={cn("w-6 h-6", stat.color)} aria-hidden="true" />
          </div>
          <p className={cn("text-2xl font-bold", stat.color)}>
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {stat.label}
          </p>
        </article>
      ))}
    </div>
  );
};
