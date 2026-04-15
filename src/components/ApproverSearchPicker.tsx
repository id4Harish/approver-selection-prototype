import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Label } from '@fluentui/react/lib/Label';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { IApprover } from '../types/models';

export interface IApproverSearchPickerProps {
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
    // Persona dropdown
    dropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: 2,
      boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.13), 0 0.6px 1.8px rgba(0,0,0,0.11)',
      maxHeight: 320,
      overflowY: 'auto' as const,
      marginTop: 2,
      padding: '4px 0',
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

export const ApproverSearchPicker: React.FC<IApproverSearchPickerProps> = ({
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
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const displayLabel = `${label} (${roleDescription})`;

  const filteredApprovers = React.useMemo(() => {
    if (!filterText) return [];
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

  const handleSearchChange = React.useCallback(
    (_?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
      const val = newValue || '';
      setFilterText(val);
      // If user edits the text, clear current selection
      if (selectedApprover && val !== selectedApprover.name) {
        onApproverSelected(undefined);
      }
      setIsOpen(val.length > 0 && !(selectedApprover && val === selectedApprover.name));
      setHighlightedIndex(val.length > 0 ? 0 : -1);
    },
    [selectedApprover, onApproverSelected]
  );

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setFilterText(approver.name);
      setHighlightedIndex(-1);
      setIsOpen(false);
    },
    [onApproverSelected]
  );

  const handleSearchClear = React.useCallback(() => {
    onApproverSelected(undefined);
    setFilterText('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onApproverSelected]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredApprovers.length > 0) {
          setIsOpen(true);
          setHighlightedIndex((prev) =>
            prev < filteredApprovers.length - 1 ? prev + 1 : 0
          );
        }
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

  // Full rectangle border styles for SearchBox (not underline)
  const searchBoxStyles = React.useMemo(() => ({
    root: {
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2,
      height: 32,
      ':after': {
        border: 'none',
      },
      ':hover': {
        borderColor: theme.palette.neutralPrimary,
      },
    },
    iconContainer: {
      color: theme.palette.themePrimary,
    },
    field: {
      fontSize: 14,
    },
  }), [theme]);

  const searchBoxFocusStyles = React.useMemo(() => ({
    root: {
      border: `1px solid ${theme.palette.themePrimary}`,
      borderRadius: 2,
      height: 32,
      ':after': {
        border: 'none',
      },
    },
    iconContainer: {
      color: theme.palette.themePrimary,
    },
    field: {
      fontSize: 14,
    },
  }), [theme]);

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
              <SearchBox
                placeholder="Type a name or email"
                value={filterText}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                disableAnimation
                styles={isOpen ? searchBoxFocusStyles : searchBoxStyles}
              />

            {/* Persona dropdown — shows when typing */}
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
