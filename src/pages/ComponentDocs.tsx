import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Text } from '@fluentui/react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { Link } from 'react-router-dom';
import { APPROVERS, APPROVER_POLICY } from '../data/mockData';
import { ApproverComboBoxPersona } from '../components/ApproverComboBoxPersona';
import { IApprover } from '../types/models';

// ─── Helpers ─────────────────────────────────────────────────────────

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const displayLabel = `${APPROVER_POLICY.label} (${APPROVER_POLICY.roleDescription})`;

// ─── Code block with copy ────────────────────────────────────────────

const CodeBlock: React.FC<{ code: string; theme: ITheme }> = ({ code, theme }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div style={{ position: 'relative', marginTop: 12 }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute', top: 8, right: 8,
          padding: '4px 12px', fontSize: 12,
          border: `1px solid ${theme.palette.neutralTertiaryAlt}`,
          borderRadius: 4,
          backgroundColor: copied ? theme.palette.themeLighter : theme.palette.white,
          color: copied ? theme.palette.themePrimary : theme.palette.neutralPrimary,
          cursor: 'pointer', fontFamily: '"Segoe UI", sans-serif',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          border: `1px solid ${theme.palette.neutralLight}`,
          borderRadius: 4, padding: 16, overflow: 'auto',
          fontSize: 13, lineHeight: 1.5, margin: 0,
          fontFamily: '"Cascadia Code", "Fira Code", Consolas, monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── Static component styles (mirrors the real component) ────────────

const getStaticStyles = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: { position: 'relative' as const },
    labelRow: { display: 'flex', alignItems: 'flex-start', gap: 12 },
    stepBadge: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 24, borderRadius: 4,
      backgroundColor: theme.palette.themeLighter, color: theme.palette.themePrimary,
      ...theme.fonts.small, fontWeight: 600, flexShrink: 0, marginTop: 2,
    },
    fieldContainer: { flex: 1 },
    labelText: { display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 },
    label: { fontWeight: 600, fontSize: 14, color: theme.palette.neutralPrimary },
    requiredStar: { color: theme.semanticColors.errorText, fontWeight: 600 },
    inputWrapper: {
      display: 'flex', alignItems: 'center',
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2, padding: '0 8px', minHeight: 32,
      backgroundColor: theme.palette.white,
    },
    inputWrapperHovered: {
      display: 'flex', alignItems: 'center',
      border: `1px solid ${theme.palette.neutralPrimary}`,
      borderRadius: 2, padding: '0 8px', minHeight: 32,
      backgroundColor: theme.palette.white,
    },
    inputWrapperFocused: {
      display: 'flex', alignItems: 'center',
      border: `2px solid ${theme.palette.themePrimary}`,
      borderRadius: 2, padding: '0 7px', minHeight: 32,
      backgroundColor: theme.palette.white,
    },
    inputWrapperDisabled: {
      display: 'flex', alignItems: 'center',
      border: 'none',
      borderRadius: 2, padding: '0 8px', minHeight: 32,
      backgroundColor: theme.palette.neutralLighter,
    },
    inputWrapperError: {
      display: 'flex', alignItems: 'center',
      border: '1px solid #A80000',
      borderRadius: 2, padding: '0 8px', minHeight: 32,
      backgroundColor: theme.palette.white,
    },
    errorMessage: {
      fontSize: 12, fontWeight: 400, color: '#A80000', marginTop: 4,
      fontFamily: '"Segoe UI", sans-serif',
    },
    inputText: {
      flex: 1, fontSize: 14, lineHeight: '32px',
      color: theme.palette.neutralPrimary,
      fontFamily: '"Segoe UI", sans-serif',
    },
    placeholder: {
      flex: 1, fontSize: 14, lineHeight: '32px',
      color: theme.palette.neutralSecondary,
      fontFamily: '"Segoe UI", sans-serif',
    },
    chevron: { fontSize: 12, color: theme.palette.neutralSecondary, marginLeft: 4 },
    chevronHovered: { fontSize: 12, color: theme.palette.neutralPrimary, marginLeft: 4 },
    dropdown: {
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      maxHeight: 320, overflowY: 'auto' as const, marginTop: 2,
    },
    personaRow: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', minHeight: 44,
    },
    personaRowHovered: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', minHeight: 44,
      backgroundColor: theme.palette.neutralLighterAlt,
    },
    personaRowHighlighted: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', minHeight: 44,
      backgroundColor: '#f3f2f1',
    },
    personaRowSelected: {
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 12px', minHeight: 44,
      backgroundColor: theme.palette.neutralLighterAlt,
    },
    checkIcon: {
      fontSize: 12, color: theme.palette.neutralPrimary,
      flexShrink: 0, marginRight: 2,
    },
    avatar: {
      width: 32, height: 32, borderRadius: '50%',
      backgroundColor: 'rgb(79, 107, 237)', color: theme.palette.white,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, flexShrink: 0,
    },
    details: { display: 'flex', flexDirection: 'column' as const, minWidth: 0, flex: 1 },
    name: {
      fontSize: 14, fontWeight: 400, color: theme.palette.neutralPrimary,
      lineHeight: '20px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis',
    },
    email: {
      fontSize: 12, fontWeight: 400, color: theme.palette.neutralSecondary,
      lineHeight: '16px', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis',
    },
    noOptions: {
      padding: '6px 12px', fontSize: 14, color: theme.palette.neutralSecondary,
      minHeight: 32, display: 'flex', alignItems: 'center',
    },
  })
);

// ─── Static building blocks ──────────────────────────────────────────

const StaticLabel: React.FC<{ s: ReturnType<typeof getStaticStyles>; required?: boolean }> = ({ s, required = true }) => (
  <div className={s.labelText}>
    <span className={s.label}>{displayLabel}</span>
    {required && <span className={s.requiredStar}>*</span>}
  </div>
);

const PersonaRow: React.FC<{
  s: ReturnType<typeof getStaticStyles>;
  name: string; email: string;
  variant?: 'default' | 'hovered' | 'highlighted' | 'selected';
}> = ({ s, name, email, variant = 'default' }) => {
  const rowClass = variant === 'hovered' ? s.personaRowHovered
    : variant === 'highlighted' ? s.personaRowHighlighted
    : variant === 'selected' ? s.personaRowSelected
    : s.personaRow;
  return (
    <div className={rowClass}>
      {variant === 'selected' && <Icon iconName="CheckMark" className={s.checkIcon} />}
      <div className={s.avatar}>{getInitials(name)}</div>
      <div className={s.details}>
        <span className={s.name}>{name}</span>
        <span className={s.email}>{email}</span>
      </div>
    </div>
  );
};

// ─── Static state renders ────────────────────────────────────────────

const StaticDefault: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapper}>
          <span className={s.placeholder}>Search by approver name or email</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
      </div>
    </div>
  </div>
);

const StaticFocused: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperFocused}>
          <span className={s.placeholder}>Search by approver name or email</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
        <div className={s.dropdown}>
          {APPROVERS.map((a) => (
            <PersonaRow key={a.key} s={s} name={a.name} email={a.email} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StaticFiltering: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => {
  const filtered = APPROVERS.filter((a) => a.name.toLowerCase().startsWith('jo'));
  return (
    <div className={s.root}>
      <div className={s.labelRow}>
        <div className={s.stepBadge}>1</div>
        <div className={s.fieldContainer}>
          <StaticLabel s={s} />
          <div className={s.inputWrapperFocused}>
            <span className={s.inputText}>Jo</span>
            <Icon iconName="ChevronDown" className={s.chevron} />
          </div>
          <div className={s.dropdown}>
            {filtered.map((a, i) => (
              <PersonaRow key={a.key} s={s} name={a.name} email={a.email}
                variant={i === 0 ? 'highlighted' : 'default'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticNoResults: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperFocused}>
          <span className={s.inputText}>xyz</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
        <div className={s.dropdown}>
          <div className={s.noOptions}>No approvers match your search.</div>
        </div>
      </div>
    </div>
  </div>
);

const StaticHovered: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperHovered}>
          <span className={s.placeholder}>Search by approver name or email</span>
          <Icon iconName="ChevronDown" className={s.chevronHovered} />
        </div>
        <div className={s.dropdown}>
          <PersonaRow s={s} name={APPROVERS[0].name} email={APPROVERS[0].email} />
          <PersonaRow s={s} name={APPROVERS[1].name} email={APPROVERS[1].email} variant="hovered" />
          <PersonaRow s={s} name={APPROVERS[2].name} email={APPROVERS[2].email} />
        </div>
      </div>
    </div>
  </div>
);

const StaticHighlighted: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperFocused}>
          <span className={s.placeholder}>Search by approver name or email</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
        <div className={s.dropdown}>
          <PersonaRow s={s} name={APPROVERS[0].name} email={APPROVERS[0].email} />
          <PersonaRow s={s} name={APPROVERS[1].name} email={APPROVERS[1].email} />
          <PersonaRow s={s} name={APPROVERS[2].name} email={APPROVERS[2].email} variant="highlighted" />
        </div>
      </div>
    </div>
  </div>
);

const StaticSelected: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => {
  const a = APPROVERS[1];
  return (
    <div className={s.root}>
      <div className={s.labelRow}>
        <div className={s.stepBadge}>1</div>
        <div className={s.fieldContainer}>
          <StaticLabel s={s} />
          <div className={s.inputWrapper}>
            <span className={s.inputText}>{a.name} ({a.email})</span>
            <Icon iconName="ChevronDown" className={s.chevron} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticSelectedDropdown: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => {
  const a = APPROVERS[1];
  return (
    <div className={s.root}>
      <div className={s.labelRow}>
        <div className={s.stepBadge}>1</div>
        <div className={s.fieldContainer}>
          <StaticLabel s={s} />
          <div className={s.inputWrapperFocused}>
            <span className={s.inputText}>{a.name} ({a.email})</span>
            <Icon iconName="ChevronDown" className={s.chevron} />
          </div>
          <div className={s.dropdown}>
            <PersonaRow s={s} name={a.name} email={a.email} variant="selected" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticClearing: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperFocused}>
          <span className={s.inputText}>Jonah</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
        <div className={s.dropdown}>
          <PersonaRow s={s} name={APPROVERS[1].name} email={APPROVERS[1].email} variant="selected" />
        </div>
      </div>
    </div>
  </div>
);

const StaticDisabled: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => (
  <div className={s.root}>
    <div className={s.labelRow}>
      <div className={s.stepBadge}>1</div>
      <div className={s.fieldContainer}>
        <StaticLabel s={s} />
        <div className={s.inputWrapperDisabled}>
          <span className={s.placeholder}>Search by approver name or email</span>
          <Icon iconName="ChevronDown" className={s.chevron} />
        </div>
      </div>
    </div>
  </div>
);

const StaticDisabledSelected: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => {
  const a = APPROVERS[1];
  return (
    <div className={s.root}>
      <div className={s.labelRow}>
        <div className={s.stepBadge}>1</div>
        <div className={s.fieldContainer}>
          <StaticLabel s={s} />
          <div className={s.inputWrapperDisabled}>
            <span className={s.inputText} style={{ color: '#a19f9d' }}>{a.name} ({a.email})</span>
            <Icon iconName="ChevronDown" className={s.chevron} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticError: React.FC<{ s: ReturnType<typeof getStaticStyles> }> = ({ s }) => {
  const a = APPROVERS[1];
  return (
    <div className={s.root}>
      <div className={s.labelRow}>
        <div className={s.stepBadge}>1</div>
        <div className={s.fieldContainer}>
          <StaticLabel s={s} />
          <div className={s.inputWrapperError}>
            <span className={s.inputText}>{a.name} ({a.email})</span>
            <Icon iconName="ChevronDown" className={s.chevron} />
          </div>
          <div className={s.errorMessage}>Error message</div>
        </div>
      </div>
    </div>
  );
};


// ─── State definitions ───────────────────────────────────────────────

interface StateExample {
  id: string;
  title: string;
  description: string;
  code: string;
  render: (s: ReturnType<typeof getStaticStyles>) => React.ReactElement;
}

const STATES: StateExample[] = [
  {
    id: 'default',
    title: 'Empty / Default',
    description: 'No selection. Placeholder text visible. Dropdown is closed. Border is 1px neutral.',
    code: `<ApproverComboBoxPersona
  label="FieldSales approver"
  roleDescription="BD-Regional Director/GM"
  required={true}
  stepNumber={1}
  approvers={APPROVERS}
  selectedApprover={undefined}
  onApproverSelected={setSelectedApprover}
/>`,
    render: (s) => <StaticDefault s={s} />,
  },
  {
    id: 'focused',
    title: 'Focused (Dropdown Open)',
    description: 'Input is focused with a 2px blue border. Dropdown opens showing all available approvers.',
    code: `// Click or tab into the input
// Border: 2px solid themePrimary
// Dropdown: shows all approvers`,
    render: (s) => <StaticFocused s={s} />,
  },
  {
    id: 'filtering',
    title: 'Typing / Filtering',
    description: 'User types "Jo" — dropdown filters to matching approvers. First result is auto-highlighted with gray background. Selection is cleared when text changes.',
    code: `// User types "Jo"
// Filters by: name parts (startsWith) or email prefix
// First match auto-highlighted
// Previous selection cleared on text change`,
    render: (s) => <StaticFiltering s={s} />,
  },
  {
    id: 'no-results',
    title: 'No Results',
    description: 'Query "xyz" matches no approvers. Dropdown shows "No approvers match your search." as a regular row — not italic, matching Fluent v9 style.',
    code: `// User types "xyz" — no matches
// Message: "No approvers match your search."
// Style: normal weight, neutral secondary, same row padding`,
    render: (s) => <StaticNoResults s={s} />,
  },
  {
    id: 'hovered',
    title: 'Option Hovered',
    description: 'Mouse hovers over a dropdown row. The hovered row gets a light gray background (neutralLighterAlt). Cursor shows as pointer.',
    code: `// Mouse hover on "Jonah Klein" row
// Background: neutralLighterAlt
// Cursor: pointer`,
    render: (s) => <StaticHovered s={s} />,
  },
  {
    id: 'highlighted',
    title: 'Option Highlighted (Keyboard)',
    description: 'Arrow keys move the highlight through the list. Highlighted row gets a gray background (#f3f2f1). Enter selects, Escape closes. List wraps around.',
    code: `// ArrowDown/ArrowUp: move highlight (wraps around)
// Enter: select highlighted option
// Escape: close dropdown
// Highlighted background: #f3f2f1`,
    render: (s) => <StaticHighlighted s={s} />,
  },
  {
    id: 'selected',
    title: 'Selected',
    description: 'After selection, input shows "Name (email)" format. Dropdown is closed. Query state is set to the display text.',
    code: `// Input: "Jonah Klein (jonahk@microsoft.com)"
// Dropdown: closed
// query = "Jonah Klein (jonahk@microsoft.com)"`,
    render: (s) => <StaticSelected s={s} />,
  },
  {
    id: 'selected-dropdown',
    title: 'Selected + Dropdown Open',
    description: 'Chevron clicked while selected. Dropdown shows only the selected item with a black checkmark on the left side (before avatar). Other items are filtered out by the query text.',
    code: `// Chevron clicked in selected state:
// Dropdown: shows ONLY the selected item
// Checkmark: black, 12px, LEFT of avatar
// Clicking the item re-selects (no toggle deselect)`,
    render: (s) => <StaticSelectedDropdown s={s} />,
  },
  {
    id: 'clearing',
    title: 'Clearing Selection',
    description: 'User clicks into input and backspaces part of the text. Once text differs from the selected display value, selection is cleared. Dropdown re-filters based on remaining text. No toggle deselect — v9 behavior.',
    code: `// Clearing flow:
// 1. Click into input (cursor in display text)
// 2. Backspace to edit: "Jonah Klein (jon..." → "Jonah"
// 3. Text !== display value → selection cleared
// 4. Dropdown re-filters based on "Jonah"
// 5. Full clear → placeholder reappears, all options show`,
    render: (s) => <StaticClearing s={s} />,
  },
  {
    id: 'disabled',
    title: 'Disabled (Empty)',
    description: 'Component is disabled. Background is neutralLighter, border blends with background, cursor is default. No click, focus, or keyboard interaction possible.',
    code: `<ApproverComboBoxPersona
  label="FieldSales approver"
  roleDescription="BD-Regional Director/GM"
  required={true}
  stepNumber={1}
  approvers={APPROVERS}
  selectedApprover={undefined}
  onApproverSelected={setSelectedApprover}
  disabled={true}
/>`,
    render: (s) => <StaticDisabled s={s} />,
  },
  {
    id: 'disabled-selected',
    title: 'Disabled (With Selection)',
    description: 'Disabled with a pre-selected value. Input shows selection text in muted color but is not interactive.',
    code: `<ApproverComboBoxPersona
  label="FieldSales approver"
  roleDescription="BD-Regional Director/GM"
  stepNumber={1}
  approvers={APPROVERS}
  selectedApprover={jonahKlein}
  onApproverSelected={setSelectedApprover}
  disabled={true}
/>`,
    render: (s) => <StaticDisabledSelected s={s} />,
  },
  {
    id: 'error',
    title: 'Error',
    description: 'Error state with red border (#A80000) and error message below the input. Used for validation errors like missing required approver or invalid selection.',
    code: `<ApproverComboBoxPersona
  label="FieldSales approver"
  roleDescription="BD-Regional Director/GM"
  required={true}
  stepNumber={1}
  approvers={APPROVERS}
  selectedApprover={jonahKlein}
  onApproverSelected={setSelectedApprover}
  error={true}
  errorMessage="Error message"
/>`,
    render: (s) => <StaticError s={s} />,
  },
];

// ─── Page styles ─────────────────────────────────────────────────────

const getPageStyles = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    page: {
      display: 'flex', minHeight: '100vh',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    sidebar: {
      width: 260, flexShrink: 0,
      borderRight: `1px solid ${theme.palette.neutralLight}`,
      backgroundColor: '#faf9f8', padding: '24px 0',
      position: 'sticky' as const, top: 0, height: '100vh',
      overflowY: 'auto' as const,
    },
    sidebarTitle: {
      padding: '0 20px 16px', fontSize: 14, fontWeight: 600,
      color: theme.palette.neutralPrimary,
      borderBottom: `1px solid ${theme.palette.neutralLight}`, marginBottom: 8,
    },
    backLink: {
      display: 'block', padding: '8px 20px', fontSize: 13,
      color: theme.palette.themePrimary, textDecoration: 'none', marginBottom: 8,
    },
    navItem: {
      display: 'block', padding: '6px 20px', fontSize: 13,
      color: theme.palette.neutralSecondary, textDecoration: 'none', cursor: 'pointer',
    },
    content: { flex: 1, padding: '32px 48px', maxWidth: 900 },
    pageTitle: { fontSize: 28, fontWeight: 600, color: theme.palette.neutralPrimary, marginBottom: 4 },
    pageSubtitle: { fontSize: 14, color: theme.palette.neutralSecondary, marginBottom: 32 },
    stateSection: {
      marginBottom: 48, paddingBottom: 32,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
    },
    stateTitle: { fontSize: 20, fontWeight: 600, color: theme.palette.neutralPrimary, marginBottom: 8 },
    stateDescription: {
      fontSize: 14, color: theme.palette.neutralSecondary, lineHeight: '22px', marginBottom: 20,
    },
    exampleContainer: {
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 8, padding: 24,
      backgroundColor: theme.palette.white, maxWidth: 500,
    },
    codeLabel: {
      fontSize: 12, fontWeight: 600, color: theme.palette.neutralSecondary,
      textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginTop: 16,
    },
    playgroundSection: {
      marginBottom: 48, paddingBottom: 32,
      borderBottom: `2px solid ${theme.palette.themePrimary}`,
    },
    playgroundTitle: {
      fontSize: 20, fontWeight: 600, color: theme.palette.neutralPrimary, marginBottom: 4,
    },
    playgroundSubtitle: {
      fontSize: 14, color: theme.palette.neutralSecondary, lineHeight: '22px', marginBottom: 20,
    },
    playgroundContainer: {
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 8, padding: 24,
      backgroundColor: theme.palette.white, maxWidth: 500,
    },
    playgroundControls: {
      display: 'flex', gap: 24, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' as const,
    },
    playgroundStatus: {
      marginTop: 12, fontSize: 13, color: theme.palette.neutralSecondary, lineHeight: '20px',
    },
    statusLabel: {
      fontWeight: 600, color: theme.palette.neutralPrimary, marginRight: 4,
    },
  })
);

// ─── Main page ───────────────────────────────────────────────────────

export const ComponentDocs: React.FC = () => {
  const theme = useTheme();
  const page = getPageStyles(theme);
  const s = getStaticStyles(theme);
  const [selectedApprover, setSelectedApprover] = React.useState<IApprover | undefined>();
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const handleNavClick = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className={page.page}>
      <nav className={page.sidebar}>
        <div className={page.sidebarTitle}>ApproverComboBoxPersona</div>
        <Link to="/" className={page.backLink}>&larr; Back to App</Link>
        <a className={page.navItem} style={{ fontWeight: 600 }} onClick={() => handleNavClick('playground')}>
          Interactive Prototype
        </a>
        {STATES.map((state) => (
          <a key={state.id} className={page.navItem} onClick={() => handleNavClick(state.id)}>
            {state.title}
          </a>
        ))}
      </nav>

      <main className={page.content}>
        <Text className={page.pageTitle} block>ApproverComboBoxPersona</Text>
        <Text className={page.pageSubtitle} block>
          Approver selection combobox aligned with Fluent UI v9 Combobox behavior. Built on Fluent UI v8.
        </Text>

        {/* Interactive Prototype */}
        <section id="playground" className={page.playgroundSection}>
          <Text className={page.playgroundTitle} block>Interactive Prototype</Text>
          <Text className={page.playgroundSubtitle} block>
            Try the live component — type to filter, select with click or keyboard, clear with backspace, toggle disabled state.
          </Text>
          <div className={page.playgroundContainer}>
            <ApproverComboBoxPersona
              label={APPROVER_POLICY.label}
              roleDescription={APPROVER_POLICY.roleDescription}
              required
              stepNumber={1}
              approvers={APPROVERS}
              selectedApprover={selectedApprover}
              onApproverSelected={setSelectedApprover}
              disabled={isDisabled}
              error={isError}
              errorMessage={isError ? 'Error message' : undefined}
            />
          </div>
          <div className={page.playgroundControls}>
            <Toggle
              label="Disabled"
              checked={isDisabled}
              onChange={(_, checked) => setIsDisabled(!!checked)}
              inlineLabel
            />
            <Toggle
              label="Error"
              checked={isError}
              onChange={(_, checked) => setIsError(!!checked)}
              inlineLabel
            />
          </div>
        </section>

        {/* Static State Examples */}
        {STATES.map((state) => (
          <section key={state.id} id={state.id} className={page.stateSection}>
            <Text className={page.stateTitle} block>{state.title}</Text>
            <Text className={page.stateDescription} block>{state.description}</Text>
            <div className={page.exampleContainer}>{state.render(s)}</div>
            <Text className={page.codeLabel} block>Code</Text>
            <CodeBlock code={state.code} theme={theme} />
          </section>
        ))}
      </main>
    </div>
  );
};
