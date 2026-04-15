import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Label } from '@fluentui/react/lib/Label';
import { IApprover } from '../types/models';

export interface IApproverComboBoxPersonaProps {
  label: string;
  roleDescription: string;
  required?: boolean;
  stepNumber: number;
  approvers: IApprover[];
  currentUser?: IApprover;
  selectedApprover?: IApprover;
  onApproverSelected: (approver: IApprover | undefined) => void;
  disabled?: boolean;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      position: 'relative' as const,
    },
    labelRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    },
    stepBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: 4,
      backgroundColor: theme.palette.themeLighter,
      color: theme.palette.themePrimary,
      ...theme.fonts.small,
      fontWeight: 600,
      flexShrink: 0,
      marginTop: 2,
    },
    fieldContainer: {
      flex: 1,
    },
    labelText: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 2,
      marginBottom: 4,
    },
    requiredStar: {
      color: theme.semanticColors.errorText,
      fontWeight: 600,
    },
    // Combo input with chevron — matches Figma's input with dropdown arrow
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2,
      padding: '0 8px',
      minHeight: 32,
      backgroundColor: theme.palette.white,
      cursor: 'text',
      ':focus-within': {
        borderColor: theme.palette.themePrimary,
      },
    },
    inputWrapperDisabled: {
      backgroundColor: theme.palette.neutralLighter,
      borderColor: theme.palette.neutralLighter,
      cursor: 'default',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      lineHeight: '32px',
      color: theme.palette.neutralPrimary,
      backgroundColor: 'transparent',
      minWidth: 0,
      '::placeholder': {
        color: theme.palette.neutralSecondary,
      },
    },
    chevron: {
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      flexShrink: 0,
      marginLeft: 4,
    },
    // Persona dropdown list
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      maxHeight: 320,
      overflowY: 'auto' as const,
      marginTop: 2,
    },
    // Persona row — avatar + name + email (44px height matching Figma)
    personaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 12px',
      cursor: 'pointer',
      minHeight: 44,
      ':hover': {
        backgroundColor: theme.palette.neutralLighterAlt,
      },
    },
    personaRowHighlighted: {
      backgroundColor: '#f3f2f1',
    },
    personaAvatar: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: 'rgb(79, 107, 237)',
      color: theme.palette.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600,
      flexShrink: 0,
    },
    personaDetails: {
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
      flex: 1,
    },
    personaName: {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.neutralPrimary,
      lineHeight: '20px',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    personaEmail: {
      fontSize: 12,
      fontWeight: 400,
      color: theme.palette.neutralSecondary,
      lineHeight: '16px',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
);

export const ApproverComboBoxPersona: React.FC<IApproverComboBoxPersonaProps> = ({
  label,
  roleDescription,
  required = false,
  stepNumber,
  approvers,
  selectedApprover,
  onApproverSelected,
  disabled = false,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [filterText, setFilterText] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const displayLabel = `${label} (${roleDescription})`;

  // Filter approvers based on typed text
  const filteredApprovers = React.useMemo(() => {
    if (!filterText) return approvers;
    const lower = filterText.toLowerCase();
    return approvers.filter((a) => {
      const nameParts = a.name.toLowerCase().split(/\s+/);
      return (
        nameParts.some((part) => part.startsWith(lower)) ||
        a.email.toLowerCase().startsWith(lower)
      );
    });
  }, [approvers, filterText]);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterText(value);
      setIsOpen(true);
      // Auto-highlight first result when typing
      setHighlightedIndex(value.length > 0 ? 0 : -1);
      // Clear selection when user starts editing
      if (selectedApprover) {
        onApproverSelected(undefined);
      }
    },
    [selectedApprover, onApproverSelected]
  );

  const handleInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    []
  );

  const handleInputFocus = React.useCallback(() => {
    // Always open dropdown on focus - shows all suggestions
    setIsOpen(true);
    // If there's a selected approver, select all text so user can easily retype
    if (selectedApprover && inputRef.current) {
      inputRef.current.select();
    }
  }, [selectedApprover]);

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setFilterText(approver.name);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onApproverSelected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredApprovers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredApprovers.length - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredApprovers[highlightedIndex]);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [filteredApprovers, highlightedIndex, handleSelect]
  );

  const handleWrapperClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleChevronClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        setIsOpen((prev) => !prev);
        inputRef.current?.focus();
      }
    },
    [disabled]
  );

  return (
    <div className={classNames.root} ref={wrapperRef}>
      <div className={classNames.labelRow}>
        <div className={classNames.stepBadge}>{stepNumber}</div>
        <div className={classNames.fieldContainer}>
          <div className={classNames.labelText}>
            <Label styles={{ root: { fontWeight: 600, padding: 0 } }}>
              {displayLabel}
            </Label>
            {required && <span className={classNames.requiredStar}>*</span>}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className={`${classNames.inputWrapper} ${disabled ? classNames.inputWrapperDisabled : ''}`}
              onClick={handleWrapperClick}
            >
              <input
                ref={inputRef}
                className={classNames.input}
                value={selectedApprover ? filterText || selectedApprover.name : filterText}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                placeholder="Search by approver name or email"
                disabled={disabled}
              />
              <Icon
                iconName="ChevronDown"
                className={classNames.chevron}
                onClick={handleChevronClick}
                style={{ cursor: disabled ? 'default' : 'pointer' }}
              />
            </div>

            {/* Persona dropdown — no header, opens on focus */}
            {isOpen && !disabled && filteredApprovers.length > 0 && (
              <div className={classNames.dropdown}>
                {filteredApprovers.map((approver, index) => (
                  <div
                    key={approver.key}
                    className={`${classNames.personaRow} ${
                      index === highlightedIndex ? classNames.personaRowHighlighted : ''
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(approver);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className={classNames.personaAvatar}>
                      {getInitials(approver.name)}
                    </div>
                    <div className={classNames.personaDetails}>
                      <span className={classNames.personaName}>{approver.name}</span>
                      <span className={classNames.personaEmail}>{approver.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
