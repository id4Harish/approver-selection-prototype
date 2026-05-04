import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
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
  error?: boolean;
  errorMessage?: string;
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
      width: 20,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    stepCircle: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: '1px solid #605e5c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 600,
      color: '#605e5c',
      backgroundColor: theme.palette.white,
      lineHeight: 1,
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      boxSizing: 'border-box' as const,
    },
    fieldContainer: {
      flex: 1,
    },
    labelText: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      paddingTop: 5,
      paddingBottom: 5,
      height: 30,
      boxSizing: 'border-box' as const,
    },
    requiredStar: {
      color: theme.semanticColors.errorText,
      fontWeight: 600,
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2,
      padding: '0 8px',
      height: 32,
      boxSizing: 'border-box' as const,
      backgroundColor: theme.palette.white,
      cursor: 'text',
      ':hover': {
        borderColor: theme.palette.neutralPrimary,
      },
    },
    inputWrapperFocused: {
      border: `2px solid ${theme.palette.themePrimary}`,
      borderRadius: 2,
      padding: '0 7px',
    },
    inputWrapperDisabled: {
      backgroundColor: theme.palette.neutralLighter,
      border: 'none',
      cursor: 'default',
      ':hover': {
        borderColor: 'transparent',
      },
    },
    inputWrapperError: {
      border: `1px solid #A80000`,
      ':hover': {
        borderColor: '#A80000',
      },
    },
    errorMessage: {
      fontSize: 12,
      fontWeight: 400,
      color: '#A80000',
      marginTop: 4,
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      lineHeight: '20px',
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
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      maxHeight: 320,
      overflowY: 'auto' as const,
      marginTop: 2,
    },
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
    personaRowSelected: {
      backgroundColor: theme.palette.neutralLighterAlt,
    },
    checkIcon: {
      fontSize: 12,
      color: theme.palette.neutralPrimary,
      flexShrink: 0,
      marginRight: 2,
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
    noOptions: {
      padding: '6px 12px',
      fontSize: 14,
      color: theme.palette.neutralSecondary,
      minHeight: 32,
      display: 'flex',
      alignItems: 'center',
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
  error = false,
  errorMessage,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const displayLabel = roleDescription ? `${label} (${roleDescription})` : label;

  // Helper to get the display text for an approver
  const getDisplayText = React.useCallback(
    (approver: IApprover) => `${approver.name} (${approver.email})`,
    []
  );

  // v9-style filtering: query is always used to filter.
  // When selected, query = "Name(email)" which only matches that one approver.
  // When empty, all approvers show. When typing, filters normally.
  const filteredApprovers = React.useMemo(() => {
    if (!query) return approvers;
    const lower = query.toLowerCase();
    return approvers.filter((a) => {
      const nameParts = a.name.toLowerCase().split(/\s+/);
      return (
        nameParts.some((part) => part.startsWith(lower)) ||
        a.name.toLowerCase().startsWith(lower) ||
        a.email.toLowerCase().startsWith(lower) ||
        getDisplayText(a).toLowerCase() === lower
      );
    });
  }, [approvers, query, getDisplayText]);

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

  // v9-style onChange: update query, clear selection when user modifies text
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setIsOpen(true);
      setHighlightedIndex(value.length > 0 ? 0 : -1);
      // Clear selection when user changes the text away from the selected display
      if (selectedApprover && value !== getDisplayText(selectedApprover)) {
        onApproverSelected(undefined);
      }
    },
    [selectedApprover, onApproverSelected, getDisplayText]
  );

  const handleInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    },
    []
  );

  // v9-style: just open dropdown on focus, no auto-select of text
  const handleInputFocus = React.useCallback(() => {
    setIsOpen(true);
    setIsFocused(true);
  }, []);

  // Open dropdown on click (handles case where input already has focus)
  const handleInputClick = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  // v9-style onOptionSelect: always select (no toggle). User clears via backspace.
  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setQuery(getDisplayText(approver));
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onApproverSelected, getDisplayText]
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
        {stepNumber > 0 && (
          <div className={classNames.stepBadge}>
            <div className={classNames.stepCircle}>{stepNumber}</div>
          </div>
        )}
        <div className={classNames.fieldContainer}>
          <div className={classNames.labelText}>
            <span style={{ fontWeight: 600, fontSize: 14, lineHeight: '20px', color: 'inherit' }}>
              {displayLabel}
            </span>
            {required && <span className={classNames.requiredStar}>*</span>}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className={`${classNames.inputWrapper} ${disabled ? classNames.inputWrapperDisabled : ''} ${isFocused && !disabled ? classNames.inputWrapperFocused : ''} ${error && !disabled ? classNames.inputWrapperError : ''}`}
              onClick={handleWrapperClick}
            >
              <input
                ref={inputRef}
                className={classNames.input}
                value={query}
                onChange={handleInputChange}
                onClick={handleInputClick}
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

            {isOpen && !disabled && (
              <div className={classNames.dropdown}>
                {filteredApprovers.length > 0 ? (
                  filteredApprovers.map((approver, index) => {
                    const isSelected = selectedApprover?.key === approver.key;
                    return (
                      <div
                        key={approver.key}
                        className={`${classNames.personaRow} ${
                          index === highlightedIndex ? classNames.personaRowHighlighted : ''
                        } ${isSelected ? classNames.personaRowSelected : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(approver);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {isSelected && (
                          <Icon iconName="CheckMark" className={classNames.checkIcon} />
                        )}
                        <div className={classNames.personaAvatar}>
                          {getInitials(approver.name)}
                        </div>
                        <div className={classNames.personaDetails}>
                          <span className={classNames.personaName}>{approver.name}</span>
                          <span className={classNames.personaEmail}>{approver.email}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={classNames.noOptions}>
                    No approvers match your search.
                  </div>
                )}
              </div>
            )}
          </div>
          {error && errorMessage && (
            <div className={classNames.errorMessage}>{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};
