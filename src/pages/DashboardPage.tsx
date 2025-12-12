import { Link } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Clock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const DashboardPage = () => {
  const { audits, setCurrentAudit } = useApp();

  const totalAudits = audits.length;
  const passedAudits = audits.filter(a => a.status === 'passed').length;
  const failedAudits = audits.filter(a => a.status === 'failed').length;
  const totalIssues = audits.reduce((sum, a) => sum + a.issues.filter(i => !i.isFixed).length, 0);

  const stats = [
    {
      label: 'Total Audits',
      value: totalAudits,
      icon: FileText,
      color: 'text-foreground',
      bg: 'bg-muted',
    },
    {
      label: 'Passed',
      value: passedAudits,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Failed',
      value: failedAudits,
      icon: XCircle,
      color: 'text-critical',
      bg: 'bg-critical/10',
    },
    {
      label: 'Open Issues',
      value: totalIssues,
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your accessibility audit status
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/audit">
              <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
              New Audit
            </Link>
          </Button>
        </header>

        {/* Stats Grid */}
        <section aria-label="Audit statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="glass-card rounded-xl p-5 hover-lift"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  stat.bg
                )}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} aria-hidden="true" />
                </div>
                <div>
                  <p className={cn("text-2xl font-bold", stat.color)}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Recent Audits */}
        <section aria-labelledby="recent-audits-heading">
          <h2 id="recent-audits-heading" className="text-xl font-semibold text-foreground mb-4">
            Recent Audits
          </h2>
          
          {audits.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No audits yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your first accessibility audit to see results here.
              </p>
              <Button asChild>
                <Link to="/audit">Start Audit</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {audits.slice(0, 10).map((audit) => {
                const criticalCount = audit.issues.filter(i => i.severity === 'critical' && !i.isFixed).length;
                const totalUnfixed = audit.issues.filter(i => !i.isFixed).length;
                
                return (
                  <Link
                    key={audit.id}
                    to="/results"
                    onClick={() => setCurrentAudit(audit)}
                    className="block glass-card rounded-xl p-4 hover:bg-accent/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        audit.status === 'passed' ? 'bg-success/10' : 'bg-critical/10'
                      )}>
                        {audit.status === 'passed' ? (
                          <CheckCircle className="w-5 h-5 text-success" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-5 h-5 text-critical" aria-hidden="true" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {audit.fileName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(audit.timestamp).toLocaleDateString()} at{' '}
                          {new Date(audit.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {criticalCount > 0 && (
                          <span className="flex items-center gap-1 text-critical">
                            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                            {criticalCount} critical
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {totalUnfixed} issues
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default DashboardPage;
