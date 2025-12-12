import { Issue } from '@/contexts/AppContext';

interface ScanRule {
  id: string;
  name: string;
  check: (code: string) => Issue[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const scanRules: ScanRule[] = [
  {
    id: 'alt-text',
    name: 'Alt Text Issues',
    check: (code) => {
      const issues: Issue[] = [];
      const imgRegex = /<img[^>]*>/gi;
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const matches = line.match(imgRegex);
        if (matches) {
          matches.forEach(match => {
            if (!match.includes('alt=') || match.includes('alt=""') || match.includes("alt=''")) {
              issues.push({
                id: generateId(),
                type: 'Missing Alt Text',
                severity: 'critical',
                message: 'Image is missing alt attribute or has empty alt text',
                lineNumber: index + 1,
                codeSnippet: match,
                recommendation: 'Add descriptive alt text that conveys the purpose of the image',
                fixExample: match.replace('<img', '<img alt="Descriptive text here"'),
                wcagCriteria: '1.1.1 Non-text Content (Level A)',
                wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
                isFixed: false,
              });
            }
          });
        }
      });
      return issues;
    }
  },
  {
    id: 'aria-roles',
    name: 'ARIA Roles',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      const invalidRoles = ['role="button"', 'role="link"'];
      lines.forEach((line, index) => {
        invalidRoles.forEach(role => {
          if (line.includes(role) && !line.includes('<button') && !line.includes('<a ')) {
            if (line.includes('<div') || line.includes('<span')) {
              issues.push({
                id: generateId(),
                type: 'Incorrect ARIA Role Usage',
                severity: 'major',
                message: `Using ${role} on a non-semantic element. Use the native element instead.`,
                lineNumber: index + 1,
                codeSnippet: line.trim(),
                recommendation: 'Use native HTML elements (<button>, <a>) instead of ARIA roles when possible',
                fixExample: role.includes('button') ? '<button>Click me</button>' : '<a href="#">Link text</a>',
                wcagCriteria: '4.1.2 Name, Role, Value (Level A)',
                wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
                isFixed: false,
              });
            }
          }
        });
      });
      return issues;
    }
  },
  {
    id: 'heading-structure',
    name: 'Heading Structure',
    check: (code) => {
      const issues: Issue[] = [];
      const headingRegex = /<h([1-6])[^>]*>/gi;
      const lines = code.split('\n');
      let lastHeadingLevel = 0;
      
      lines.forEach((line, index) => {
        const match = headingRegex.exec(line);
        if (match) {
          const currentLevel = parseInt(match[1]);
          if (lastHeadingLevel > 0 && currentLevel > lastHeadingLevel + 1) {
            issues.push({
              id: generateId(),
              type: 'Skipped Heading Level',
              severity: 'major',
              message: `Heading level skipped from h${lastHeadingLevel} to h${currentLevel}`,
              lineNumber: index + 1,
              codeSnippet: line.trim(),
              recommendation: 'Ensure heading levels follow a logical order without skipping levels',
              fixExample: `<h${lastHeadingLevel + 1}>Your heading text</h${lastHeadingLevel + 1}>`,
              wcagCriteria: '1.3.1 Info and Relationships (Level A)',
              wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
              isFixed: false,
            });
          }
          lastHeadingLevel = currentLevel;
        }
      });
      return issues;
    }
  },
  {
    id: 'form-labels',
    name: 'Form Labels',
    check: (code) => {
      const issues: Issue[] = [];
      const inputRegex = /<input[^>]*>/gi;
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const matches = line.match(inputRegex);
        if (matches) {
          matches.forEach(match => {
            const hasId = match.includes('id=');
            const hasAriaLabel = match.includes('aria-label=') || match.includes('aria-labelledby=');
            const isHidden = match.includes('type="hidden"');
            const isSubmit = match.includes('type="submit"');
            
            if (!hasAriaLabel && !isHidden && !isSubmit) {
              issues.push({
                id: generateId(),
                type: 'Missing Form Label',
                severity: 'critical',
                message: 'Form input is missing an associated label',
                lineNumber: index + 1,
                codeSnippet: match,
                recommendation: 'Add a <label> element with a "for" attribute matching the input\'s id, or use aria-label',
                fixExample: '<label for="inputId">Label text</label>\n<input id="inputId" type="text" />',
                wcagCriteria: '1.3.1 Info and Relationships (Level A)',
                wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
                isFixed: false,
              });
            }
          });
        }
      });
      return issues;
    }
  },
  {
    id: 'keyboard-traps',
    name: 'Keyboard Traps',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('tabindex="-1"') && (line.includes('onclick') || line.includes('onClick'))) {
          issues.push({
            id: generateId(),
            type: 'Potential Keyboard Trap',
            severity: 'critical',
            message: 'Interactive element with tabindex="-1" may not be keyboard accessible',
            lineNumber: index + 1,
            codeSnippet: line.trim(),
            recommendation: 'Remove tabindex="-1" or ensure keyboard access through other means',
            fixExample: '<button onClick={handleClick}>Accessible button</button>',
            wcagCriteria: '2.1.2 No Keyboard Trap (Level A)',
            wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html',
            isFixed: false,
          });
        }
      });
      return issues;
    }
  },
  {
    id: 'color-contrast',
    name: 'Color Contrast',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      const lowContrastPatterns = [
        /color:\s*#[a-fA-F0-9]{3,6}.*background.*#[a-fA-F0-9]{3,6}/,
        /text-gray-300|text-gray-400/,
        /text-\[#[a-fA-F0-9]{6}\]/
      ];
      
      lines.forEach((line, index) => {
        if (line.includes('text-gray-400') || line.includes('text-gray-300')) {
          issues.push({
            id: generateId(),
            type: 'Potential Low Contrast',
            severity: 'warning' as 'major',
            message: 'Light gray text may have insufficient contrast',
            lineNumber: index + 1,
            codeSnippet: line.trim(),
            recommendation: 'Ensure text has a contrast ratio of at least 4.5:1 for normal text',
            fixExample: 'Use text-gray-600 or darker for better contrast',
            wcagCriteria: '1.4.3 Contrast (Minimum) (Level AA)',
            wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
            isFixed: false,
          });
        }
      });
      return issues;
    }
  },
  {
    id: 'landmarks',
    name: 'Landmark Regions',
    check: (code) => {
      const issues: Issue[] = [];
      
      if (!code.includes('<main') && !code.includes('role="main"')) {
        issues.push({
          id: generateId(),
          type: 'Missing Main Landmark',
          severity: 'major',
          message: 'Page is missing a main landmark region',
          lineNumber: 1,
          codeSnippet: 'Document structure',
          recommendation: 'Add a <main> element to wrap the primary content',
          fixExample: '<main>\n  {/* Main content here */}\n</main>',
          wcagCriteria: '1.3.1 Info and Relationships (Level A)',
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
          isFixed: false,
        });
      }
      
      if (!code.includes('<nav') && !code.includes('role="navigation"')) {
        issues.push({
          id: generateId(),
          type: 'Missing Navigation Landmark',
          severity: 'minor',
          message: 'Consider adding navigation landmarks for better screen reader navigation',
          lineNumber: 1,
          codeSnippet: 'Document structure',
          recommendation: 'Wrap navigation links in a <nav> element',
          fixExample: '<nav aria-label="Main navigation">\n  {/* Navigation links */}\n</nav>',
          wcagCriteria: '1.3.1 Info and Relationships (Level A)',
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
          isFixed: false,
        });
      }
      
      return issues;
    }
  },
  {
    id: 'empty-buttons',
    name: 'Empty Buttons',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('<button') && line.includes('</button>')) {
          const buttonContent = line.match(/<button[^>]*>(.*?)<\/button>/);
          if (buttonContent && buttonContent[1].trim() === '') {
            issues.push({
              id: generateId(),
              type: 'Empty Button',
              severity: 'critical',
              message: 'Button has no accessible name',
              lineNumber: index + 1,
              codeSnippet: line.trim(),
              recommendation: 'Add text content or aria-label to the button',
              fixExample: '<button aria-label="Close dialog">×</button>',
              wcagCriteria: '4.1.2 Name, Role, Value (Level A)',
              wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
              isFixed: false,
            });
          }
        }
      });
      return issues;
    }
  },
  {
    id: 'lang-attribute',
    name: 'Language Attribute',
    check: (code) => {
      const issues: Issue[] = [];
      
      if (code.includes('<html') && !code.includes('lang=')) {
        issues.push({
          id: generateId(),
          type: 'Missing Language Attribute',
          severity: 'major',
          message: 'HTML element is missing the lang attribute',
          lineNumber: 1,
          codeSnippet: '<html>',
          recommendation: 'Add a lang attribute to the html element',
          fixExample: '<html lang="en">',
          wcagCriteria: '3.1.1 Language of Page (Level A)',
          wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html',
          isFixed: false,
        });
      }
      
      return issues;
    }
  },
  {
    id: 'motion-warnings',
    name: 'Motion/Animation Warnings',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        if (line.includes('animation') && !line.includes('prefers-reduced-motion')) {
          if (line.includes('infinite') || line.includes('spin') || line.includes('bounce')) {
            issues.push({
              id: generateId(),
              type: 'Uncontrolled Animation',
              severity: 'enhancement' as 'minor',
              message: 'Animation may cause issues for users with vestibular disorders',
              lineNumber: index + 1,
              codeSnippet: line.trim(),
              recommendation: 'Wrap animations in a prefers-reduced-motion media query',
              fixExample: '@media (prefers-reduced-motion: no-preference) {\n  .animate { animation: spin 1s infinite; }\n}',
              wcagCriteria: '2.3.3 Animation from Interactions (Level AAA)',
              wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html',
              isFixed: false,
            });
          }
        }
      });
      return issues;
    }
  },
  {
    id: 'tab-index',
    name: 'Tab Index Issues',
    check: (code) => {
      const issues: Issue[] = [];
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const tabIndexMatch = line.match(/tabindex=["']?(\d+)["']?/i);
        if (tabIndexMatch && parseInt(tabIndexMatch[1]) > 0) {
          issues.push({
            id: generateId(),
            type: 'Positive Tab Index',
            severity: 'major',
            message: `Positive tabindex (${tabIndexMatch[1]}) disrupts natural tab order`,
            lineNumber: index + 1,
            codeSnippet: line.trim(),
            recommendation: 'Use tabindex="0" or remove tabindex and rely on DOM order',
            fixExample: '<button tabindex="0">Properly ordered button</button>',
            wcagCriteria: '2.4.3 Focus Order (Level A)',
            wcagLink: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html',
            isFixed: false,
          });
        }
      });
      return issues;
    }
  }
];

export const getAvailableRules = () => scanRules.map(rule => ({ id: rule.id, name: rule.name }));

export const runAccessibilityScan = (code: string, selectedRules: string[]): Issue[] => {
  const issues: Issue[] = [];
  
  scanRules.forEach(rule => {
    if (selectedRules.includes(rule.id)) {
      const ruleIssues = rule.check(code);
      issues.push(...ruleIssues);
    }
  });
  
  return issues;
};

export const calculateEstimatedFixTime = (issues: Issue[]): string => {
  let totalMinutes = 0;
  
  issues.forEach(issue => {
    if (issue.isFixed) return;
    switch (issue.severity) {
      case 'critical':
        totalMinutes += 15;
        break;
      case 'major':
        totalMinutes += 10;
        break;
      case 'minor':
        totalMinutes += 5;
        break;
      case 'enhancement':
        totalMinutes += 3;
        break;
    }
  });
  
  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};
