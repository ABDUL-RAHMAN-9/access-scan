import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { FileUpload } from '@/components/audit/FileUpload';
import { CodeEditor } from '@/components/audit/CodeEditor';
import { RuleSelector } from '@/components/audit/RuleSelector';
import { ProgressBar } from '@/components/audit/ProgressBar';
import { useApp, AuditResult } from '@/contexts/AppContext';
import { runAccessibilityScan, getAvailableRules } from '@/lib/accessibilityScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AuditPage = () => {
  const navigate = useNavigate();
  const { addAudit, announceToScreenReader } = useApp();
  
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('untitled.html');
  const [selectedRules, setSelectedRules] = useState<string[]>(
    getAvailableRules().map(r => r.id)
  );
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileContent = useCallback((content: string, name: string) => {
    setCode(content);
    if (name) setFileName(name);
    setError('');
  }, []);

  const runAudit = async () => {
    if (!code.trim()) {
      setError('Please provide code to scan');
      return;
    }

    if (selectedRules.length === 0) {
      setError('Please select at least one scanning rule');
      return;
    }

    setError('');
    setIsScanning(true);
    setProgress(0);
    announceToScreenReader('Accessibility scan started');

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const issues = runAccessibilityScan(code, selectedRules);
    
    clearInterval(progressInterval);
    setProgress(100);

    const passedChecks = selectedRules.length * 3 - issues.length; // Simulated passed checks

    const audit: AuditResult = {
      id: Math.random().toString(36).substr(2, 9),
      fileName,
      timestamp: new Date(),
      issues,
      passed: Math.max(0, passedChecks),
      status: issues.filter(i => i.severity === 'critical').length === 0 ? 'passed' : 'failed',
    };

    addAudit(audit);
    
    announceToScreenReader(
      `Scan complete. Found ${issues.length} issues. ${issues.filter(i => i.severity === 'critical').length} critical.`
    );

    setTimeout(() => {
      navigate('/results');
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Accessibility Audit</h1>
          <p className="text-muted-foreground mt-1">
            Upload or paste your code to scan for accessibility issues
          </p>
        </header>

        <div className="space-y-8">
          {/* Code Input */}
          <section className="glass-card rounded-2xl p-6">
            <Tabs defaultValue="paste" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="paste">Paste Code</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              
              <TabsContent value="paste" className="mt-0">
                <CodeEditor
                  label="Paste your HTML, JSX, or component code"
                  placeholder={`<!-- Paste your code here -->\n<div>\n  <img src="hero.jpg">\n  <button></button>\n  <input type="text">\n</div>`}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  error={error}
                />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0">
                <FileUpload onFileContent={handleFileContent} />
                {code && (
                  <div className="mt-4">
                    <CodeEditor
                      label="Uploaded code (editable)"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>

          {/* Rule Selection */}
          <section className="glass-card rounded-2xl p-6">
            <RuleSelector
              selectedRules={selectedRules}
              onRulesChange={setSelectedRules}
            />
          </section>

          {/* Scan Progress */}
          {isScanning && (
            <section className="glass-card rounded-2xl p-6 animate-safe-fade-in">
              <ProgressBar 
                progress={progress} 
                label="Scanning for accessibility issues..."
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Analyzing code against {selectedRules.length} rule categories
              </p>
            </section>
          )}

          {/* Run Button */}
          <div className="flex justify-center">
            <Button
              variant="hero"
              size="xl"
              onClick={runAudit}
              disabled={isScanning || !code.trim()}
              className="min-w-[200px]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Scanning...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                  Run Audit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditPage;
