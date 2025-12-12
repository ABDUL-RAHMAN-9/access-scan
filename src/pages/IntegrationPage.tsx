import { Copy, Check, Github, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const githubActionsYaml = `name: Accessibility Check

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  accessibility-audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run accessibility audit
        run: npm run accessibility:audit
        
      - name: Check for critical issues
        run: |
          CRITICAL_COUNT=$(cat audit-results.json | jq '.criticalCount')
          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "❌ Found $CRITICAL_COUNT critical accessibility issues"
            exit 1
          fi
          echo "✅ No critical accessibility issues found"
          
      - name: Upload audit report
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: audit-results.json`;

const configTemplate = `// accessibility.config.js
module.exports = {
  // Rules to enforce
  rules: {
    'alt-text': 'error',
    'aria-roles': 'error',
    'heading-structure': 'warn',
    'form-labels': 'error',
    'color-contrast': 'warn',
    'keyboard-traps': 'error',
    'empty-buttons': 'error',
    'lang-attribute': 'error',
  },
  
  // Files to scan
  include: [
    'src/**/*.tsx',
    'src/**/*.jsx',
    'src/**/*.html',
  ],
  
  // Files to ignore
  exclude: [
    'node_modules',
    'dist',
    '**/*.test.tsx',
  ],
  
  // Fail CI if critical issues exceed threshold
  thresholds: {
    critical: 0,
    major: 5,
  },
  
  // Output format
  output: {
    format: 'json',
    file: 'audit-results.json',
  },
};`;

const IntegrationPage = () => {
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const copyToClipboard = async (text: string, type: 'yaml' | 'config') => {
    await navigator.clipboard.writeText(text);
    if (type === 'yaml') {
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 2000);
    } else {
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">CI/CD Integration</h1>
          <p className="text-muted-foreground mt-1">
            Automate accessibility checks in your development pipeline
          </p>
        </header>

        <div className="space-y-8">
          {/* Pipeline Status Widget */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pipeline Status
            </h2>
            <div className="flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-xl">
              <div className="w-3 h-3 rounded-full bg-success animate-pulse-gentle" />
              <div>
                <p className="font-medium text-foreground">All checks passing</p>
                <p className="text-sm text-muted-foreground">
                  No critical accessibility issues detected
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-success">0</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-warning">2</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-foreground">47</p>
                <p className="text-sm text-muted-foreground">Checks Run</p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Add Config File</h3>
                  <p className="text-sm text-muted-foreground">
                    Add the accessibility config to your project root
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Set Up GitHub Action</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy the workflow file to your .github/workflows directory
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Automatic Checks</h3>
                  <p className="text-sm text-muted-foreground">
                    Every PR will be checked, failing if critical issues are found
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GitHub Actions YAML */}
          <section className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Github className="w-5 h-5" aria-hidden="true" />
                GitHub Actions Workflow
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(githubActionsYaml, 'yaml')}
                >
                  {copiedYaml ? (
                    <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  {copiedYaml ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(githubActionsYaml, 'accessibility.yml')}
                >
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="code-block overflow-x-auto max-h-[400px]">
              <code>{githubActionsYaml}</code>
            </pre>
          </section>

          {/* Config File */}
          <section className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Configuration File
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(configTemplate, 'config')}
                >
                  {copiedConfig ? (
                    <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                  )}
                  {copiedConfig ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(configTemplate, 'accessibility.config.js')}
                >
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="code-block overflow-x-auto max-h-[400px]">
              <code>{configTemplate}</code>
            </pre>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default IntegrationPage;
