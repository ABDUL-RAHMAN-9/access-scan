import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Code, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Keyboard,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const features = [
  {
    icon: Code,
    title: 'Code Analysis',
    description: 'Upload HTML, JSX, or component code for instant accessibility scanning',
  },
  {
    icon: Shield,
    title: 'WCAG 2.1 AA',
    description: 'Full compliance checking against Web Content Accessibility Guidelines',
  },
  {
    icon: Zap,
    title: 'Instant Reports',
    description: 'Get detailed reports with actionable fixes in seconds',
  },
  {
    icon: Users,
    title: 'Team Ready',
    description: 'CI/CD integration for automated accessibility testing',
  },
];

const checkItems = [
  'Alt text validation',
  'ARIA roles & labels',
  'Keyboard navigation',
  'Color contrast',
  'Heading structure',
  'Form accessibility',
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-safe-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium mb-8">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              WCAG 2.1 AA Compliant Tool
            </div>
            
            <h1 
              id="hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Make Your Web Apps
              <span className="block gradient-text mt-2">Accessible to Everyone</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The next-generation accessibility audit tool that scans your code, 
              detects WCAG violations, and provides actionable fixes—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/audit">
                  Start Free Audit
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <h2 
            id="features-heading"
            className="text-3xl font-bold text-center text-foreground mb-12"
          >
            Everything You Need for Accessibility
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="glass-card rounded-2xl p-6 hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="py-20" aria-labelledby="checks-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                id="checks-heading"
                className="text-3xl font-bold text-foreground mb-6"
              >
                Comprehensive Accessibility Checks
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our scanning engine analyzes your code against all major WCAG 2.1 AA 
                success criteria, catching issues before they reach production.
              </p>
              
              <ul className="space-y-3" role="list">
                {checkItems.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card rounded-2xl p-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <Eye className="w-8 h-8 text-primary mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">Visual</p>
                </div>
                <div className="p-4">
                  <Keyboard className="w-8 h-8 text-primary mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">Keyboard</p>
                </div>
                <div className="p-4">
                  <Monitor className="w-8 h-8 text-primary mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">Screen Reader</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text">11+</p>
                  <p className="text-muted-foreground">Rule Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/20 to-info/10" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 
            id="cta-heading"
            className="text-3xl font-bold text-foreground mb-6"
          >
            Ready to Make Your App Accessible?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join teams worldwide who use AccessAudit to ensure their web applications 
            are usable by everyone.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/audit">
              Start Your First Audit
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
