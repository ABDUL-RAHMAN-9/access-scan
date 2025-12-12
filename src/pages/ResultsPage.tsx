import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SummaryStats } from '@/components/audit/SummaryStats';
import { IssueCard } from '@/components/audit/IssueCard';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResultsPage = () => {
  const { currentAudit, markIssueFixed, announceToScreenReader } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filteredIssues = useMemo(() => {
    if (!currentAudit) return [];
    if (activeTab === 'all') return currentAudit.issues;
    return currentAudit.issues.filter(issue => issue.severity === activeTab);
  }, [currentAudit, activeTab]);

  const handleMarkFixed = (issueId: string) => {
    if (currentAudit) {
      markIssueFixed(currentAudit.id, issueId);
      announceToScreenReader('Issue marked as fixed');
    }
  };

  const exportReport = (format: 'json' | 'pdf') => {
    if (!currentAudit) return;

    if (format === 'json') {
      const data = JSON.stringify(currentAudit, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accessibility-report-${currentAudit.fileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      announceToScreenReader('Report exported as JSON');
    } else {
      // For PDF, we'd normally use a library, but for now we'll create a basic text report
      const report = `
ACCESSIBILITY AUDIT REPORT
===========================
File: ${currentAudit.fileName}
Date: ${new Date(currentAudit.timestamp).toLocaleString()}
Status: ${currentAudit.status.toUpperCase()}

SUMMARY
-------
Total Issues: ${currentAudit.issues.length}
Critical: ${currentAudit.issues.filter(i => i.severity === 'critical').length}
Major: ${currentAudit.issues.filter(i => i.severity === 'major').length}
Minor: ${currentAudit.issues.filter(i => i.severity === 'minor').length}
Passed Checks: ${currentAudit.passed}

ISSUES
------
${currentAudit.issues.map(issue => `
[${issue.severity.toUpperCase()}] ${issue.type}
Line ${issue.lineNumber}: ${issue.message}
Recommendation: ${issue.recommendation}
WCAG: ${issue.wcagCriteria}
`).join('\n')}
      `;
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `accessibility-report-${currentAudit.fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      announceToScreenReader('Report exported as text file');
    }
  };

  if (!currentAudit) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            No Audit Selected
          </h1>
          <p className="text-muted-foreground mb-8">
            Run an audit first or select one from the dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/audit">Run New Audit</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const severityCounts = {
    critical: currentAudit.issues.filter(i => i.severity === 'critical').length,
    major: currentAudit.issues.filter(i => i.severity === 'major').length,
    minor: currentAudit.issues.filter(i => i.severity === 'minor').length,
    enhancement: currentAudit.issues.filter(i => i.severity === 'enhancement').length,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard" aria-label="Back to dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentAudit.fileName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Scanned {new Date(currentAudit.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportReport('json')}
            >
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Export JSON
            </Button>
            <Button 
              variant="outline"
              onClick={() => exportReport('pdf')}
            >
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Export Report
            </Button>
          </div>
        </header>

        {/* Summary Stats */}
        <section className="mb-8" aria-label="Audit summary">
          <SummaryStats issues={currentAudit.issues} passed={currentAudit.passed} />
        </section>

        {/* Issues List */}
        <section aria-labelledby="issues-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="issues-heading" className="text-xl font-semibold text-foreground">
              Issues Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>{filteredIssues.length} issues</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({currentAudit.issues.length})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-critical">
                Critical ({severityCounts.critical})
              </TabsTrigger>
              <TabsTrigger value="major">
                Major ({severityCounts.major})
              </TabsTrigger>
              <TabsTrigger value="minor">
                Minor ({severityCounts.minor})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredIssues.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">
                    No issues found in this category.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onMarkFixed={handleMarkFixed}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  );
};

export default ResultsPage;
