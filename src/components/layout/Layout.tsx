import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      
      <footer className="border-t border-border py-8 mt-auto" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} AccessAudit. Built for WCAG 2.1 AA compliance.
          </p>
          <p className="mt-2">
            Making the web accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};
