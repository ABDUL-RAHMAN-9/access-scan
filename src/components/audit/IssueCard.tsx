import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Check, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from './SeverityBadge';
import { Issue } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  issue: Issue;
  onMarkFixed: (issueId: string) => void;
}

export const IssueCard = ({ issue, onMarkFixed }: IssueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-200",
        issue.isFixed && "opacity-60"
      )}
      aria-label={`${issue.type} - ${issue.severity} severity`}
    >
      {/* Header */}
      <button
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-accent/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`issue-${issue.id}-details`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <SeverityBadge severity={issue.severity} />
            <span className="text-xs text-muted-foreground">
              Line {issue.lineNumber}
            </span>
            {issue.isFixed && (
              <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                <Check className="w-3 h-3" />
                Fixed
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">{issue.type}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {issue.message}
          </p>
        </div>
        <span className="text-muted-foreground p-1" aria-hidden="true">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          id={`issue-${issue.id}-details`}
          className="px-4 pb-4 space-y-4 animate-safe-fade-in"
        >
          {/* Code Snippet */}
          <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" aria-hidden="true" />
              Problematic Code
            </h4>
            <pre className="code-block text-xs overflow-x-auto">
              <code>{issue.codeSnippet}</code>
            </pre>
          </div>

          {/* Recommendation */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Recommendation
            </h4>
            <p className="text-sm text-muted-foreground">
              {issue.recommendation}
            </p>
          </div>

          {/* Fix Example */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Example Fix
            </h4>
            <pre className="code-block text-xs overflow-x-auto bg-success/5 border-success/20">
              <code>{issue.fixExample}</code>
            </pre>
          </div>

          {/* WCAG Reference */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">WCAG Criteria</p>
              <p className="text-sm font-medium">{issue.wcagCriteria}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={issue.wcagLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Learn more about ${issue.wcagCriteria} (opens in new tab)`}
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-1" aria-hidden="true" />
                </a>
              </Button>
              {!issue.isFixed && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkFixed(issue.id);
                  }}
                >
                  <Check className="w-4 h-4 mr-1" aria-hidden="true" />
                  Mark Fixed
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
