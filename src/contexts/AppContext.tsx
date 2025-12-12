import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Issue {
  id: string;
  type: string;
  severity: 'critical' | 'major' | 'minor' | 'enhancement';
  message: string;
  lineNumber: number;
  codeSnippet: string;
  recommendation: string;
  fixExample: string;
  wcagCriteria: string;
  wcagLink: string;
  isFixed: boolean;
}

export interface AuditResult {
  id: string;
  fileName: string;
  timestamp: Date;
  issues: Issue[];
  passed: number;
  status: 'passed' | 'failed';
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  screenReaderMode: boolean;
  toggleScreenReaderMode: () => void;
  audits: AuditResult[];
  addAudit: (audit: AuditResult) => void;
  currentAudit: AuditResult | null;
  setCurrentAudit: (audit: AuditResult | null) => void;
  markIssueFixed: (auditId: string, issueId: string) => void;
  announceToScreenReader: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    setHighContrast(savedHighContrast);

    const savedFontScale = localStorage.getItem('fontScale');
    if (savedFontScale) setFontScale(parseFloat(savedFontScale));

    const savedScreenReaderMode = localStorage.getItem('screenReaderMode') === 'true';
    setScreenReaderMode(savedScreenReaderMode);

    const savedAudits = localStorage.getItem('audits');
    if (savedAudits) setAudits(JSON.parse(savedAudits));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    localStorage.setItem('fontScale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('screenReaderMode', String(screenReaderMode));
  }, [screenReaderMode]);

  useEffect(() => {
    localStorage.setItem('audits', JSON.stringify(audits));
  }, [audits]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleScreenReaderMode = () => setScreenReaderMode(prev => !prev);

  const addAudit = (audit: AuditResult) => {
    setAudits(prev => [audit, ...prev]);
    setCurrentAudit(audit);
  };

  const markIssueFixed = (auditId: string, issueId: string) => {
    setAudits(prev => prev.map(audit => {
      if (audit.id === auditId) {
        const updatedIssues = audit.issues.map(issue =>
          issue.id === issueId ? { ...issue, isFixed: true } : issue
        );
        return { ...audit, issues: updatedIssues };
      }
      return audit;
    }));

    if (currentAudit?.id === auditId) {
      setCurrentAudit(prev => {
        if (!prev) return null;
        const updatedIssues = prev.issues.map(issue =>
          issue.id === issueId ? { ...issue, isFixed: true } : issue
        );
        return { ...prev, issues: updatedIssues };
      });
    }
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      highContrast,
      toggleHighContrast,
      fontScale,
      setFontScale,
      screenReaderMode,
      toggleScreenReaderMode,
      audits,
      addAudit,
      currentAudit,
      setCurrentAudit,
      markIssueFixed,
      announceToScreenReader,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
