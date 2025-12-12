import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileContent: (content: string, fileName: string) => void;
}

export const FileUpload = ({ onFileContent }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileName(file.name);
      onFileContent(content, file.name);
    };
    reader.readAsText(file);
  }, [onFileContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearFile = () => {
    setFileName(null);
    onFileContent('', '');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Upload Code File
      </label>
      
      {fileName ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
          <File className="w-5 h-5 text-success" aria-hidden="true" />
          <span className="flex-1 text-sm font-medium truncate">{fileName}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            aria-label={`Remove file ${fileName}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".html,.htm,.jsx,.tsx,.js,.ts"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload code file"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                Drop your file here or click to browse
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports HTML, JSX, TSX, JS, TS files
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
