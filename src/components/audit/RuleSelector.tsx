import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAvailableRules } from '@/lib/accessibilityScanner';

interface RuleSelectorProps {
  selectedRules: string[];
  onRulesChange: (rules: string[]) => void;
}

export const RuleSelector = ({ selectedRules, onRulesChange }: RuleSelectorProps) => {
  const rules = getAvailableRules();

  const handleToggle = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      onRulesChange(selectedRules.filter(id => id !== ruleId));
    } else {
      onRulesChange([...selectedRules, ruleId]);
    }
  };

  const selectAll = () => {
    onRulesChange(rules.map(r => r.id));
  };

  const deselectAll = () => {
    onRulesChange([]);
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-foreground mb-3">
        Select Scanning Rules
      </legend>
      
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={selectAll}
          className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Select All
        </button>
        <button
          type="button"
          onClick={deselectAll}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Deselect All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              id={`rule-${rule.id}`}
              checked={selectedRules.includes(rule.id)}
              onCheckedChange={() => handleToggle(rule.id)}
              aria-describedby={`rule-${rule.id}-label`}
            />
            <Label
              htmlFor={`rule-${rule.id}`}
              id={`rule-${rule.id}-label`}
              className="text-sm cursor-pointer flex-1"
            >
              {rule.name}
            </Label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
