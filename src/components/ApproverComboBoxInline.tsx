import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Label } from '@fluentui/react/lib/Label';
import { IApprover } from '../types/models';

export interface IApproverComboBoxInlineProps {
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
    // Selected value shown as text in the input
    selectedValue: {
      flex: 1,
      fontSize: 14,
      lineHeight: '32px',
      color: theme.palette.neutralPrimary,
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    clearButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '50%',
      cursor: 'pointer',
      padding: 0,
      color: theme.palette.neutralSecondary,
      fontSize: 12,
      flexShrink: 0,
      ':hover': {
        backgroundColor: '#c8c6c4',
        color: theme.palette.neutralPrimary,
      },
    },
    // Dropdown
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
    optionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: theme.palette.neutralLighterAlt,
      },
    },
    optionRowHighlighted: {
      backgroundColor: theme.palette.neutralLighterAlt,
    },
    optionTextContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
      flex: 1,
    },
    optionName: {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.neutralPrimary,
      lineHeight: '20px',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    optionEmail: {
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

export const ApproverComboBoxInline: React.FC<IApproverComboBoxInlineProps> = ({
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
      setFilterText(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    },
    []
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
    if (!selectedApprover && filterText.length > 0) {
      setIsOpen(true);
    }
  }, [selectedApprover, filterText]);

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setFilterText('');
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onApproverSelected]
  );

  const handleClear = React.useCallback(() => {
    onApproverSelected(undefined);
    setFilterText('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [onApproverSelected]);

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
    if (!disabled && !selectedApprover) {
      inputRef.current?.focus();
    }
  }, [disabled, selectedApprover]);

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
              {/* After selection: show name as text with clear button */}
              {selectedApprover ? (
                <>
                  <span className={classNames.selectedValue}>
                    {selectedApprover.name}
                  </span>
                  <button
                    className={classNames.clearButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    title="Clear selection"
                    disabled={disabled}
                  >
                    <Icon iconName="Cancel" />
                  </button>
                </>
              ) : (
                <input
                  ref={inputRef}
                  className={classNames.input}
                  value={filterText}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a name or email"
                  disabled={disabled}
                />
              )}
            </div>

            {/* Dropdown — shows after typing */}
            {isOpen && !selectedApprover && filteredApprovers.length > 0 && filterText.length > 0 && (
              <div className={classNames.dropdown}>
                {filteredApprovers.map((approver, index) => (
                  <div
                    key={approver.key}
                    className={`${classNames.optionRow} ${
                      index === highlightedIndex ? classNames.optionRowHighlighted : ''
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(approver);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className={classNames.optionTextContainer}>
                      <span className={classNames.optionName}>{approver.name}</span>
                      <span className={classNames.optionEmail}>{approver.email}</span>
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
