import { Moon, Sun, Eye, Type, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const SettingsPage = () => {
  const {
    theme,
    toggleTheme,
    highContrast,
    toggleHighContrast,
    fontScale,
    setFontScale,
    screenReaderMode,
    toggleScreenReaderMode,
    audits,
  } = useApp();

  const exportAllReports = () => {
    const data = JSON.stringify(audits, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-accessibility-reports-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your accessibility preferences
          </p>
        </header>

        <div className="space-y-6">
          {/* Theme Settings */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Appearance
            </h2>
            
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  )}
                  <div>
                    <Label htmlFor="theme-toggle" className="text-foreground font-medium">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <Label htmlFor="contrast-toggle" className="text-foreground font-medium">
                      High Contrast Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                </div>
                <Switch
                  id="contrast-toggle"
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>
            </div>
          </section>

          {/* Font Settings */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Text Size
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Label htmlFor="font-scale" className="text-foreground font-medium">
                  Font Scale: {Math.round(fontScale * 100)}%
                </Label>
              </div>
              
              <Slider
                id="font-scale"
                min={0.8}
                max={1.5}
                step={0.1}
                value={[fontScale]}
                onValueChange={(value) => setFontScale(value[0])}
                aria-label="Adjust font scale"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>80%</span>
                <span>100%</span>
                <span>150%</span>
              </div>
            </div>
          </section>

          {/* Screen Reader Mode */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Assistive Technology
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <div>
                  <Label htmlFor="sr-toggle" className="text-foreground font-medium">
                    Screen Reader Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enhanced announcements for screen readers
                  </p>
                </div>
              </div>
              <Switch
                id="sr-toggle"
                checked={screenReaderMode}
                onCheckedChange={toggleScreenReaderMode}
                aria-label="Toggle screen reader mode"
              />
            </div>
          </section>

          {/* Export Data */}
          <section className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Data Export
            </h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              Export all your audit reports as a JSON file for backup or external analysis.
            </p>
            
            <Button
              onClick={exportAllReports}
              disabled={audits.length === 0}
            >
              Export All Reports ({audits.length})
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
