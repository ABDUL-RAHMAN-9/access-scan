import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const editorId = id || 'code-editor';
    const errorId = `${editorId}-error`;

    return (
      <div className="space-y-2">
        <label 
          htmlFor={editorId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={editorId}
          className={cn(
            "w-full min-h-[300px] p-4 font-mono text-sm rounded-xl",
            "bg-muted/50 border border-border",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            "placeholder:text-muted-foreground",
            "resize-y transition-colors",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';
