import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Label } from '@fluentui/react/lib/Label';
import { IApprover } from '../types/models';

export interface IApproverDropdownProps {
  label: string;
  roleDescription: string;
  required?: boolean;
  stepNumber: number;
  approvers: IApprover[];
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
    // Dropdown trigger button
    dropdownTrigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2,
      padding: '0 8px',
      minHeight: 32,
      backgroundColor: theme.palette.white,
      cursor: 'pointer',
      width: '100%',
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 14,
      color: theme.palette.neutralPrimary,
      outline: 'none',
      ':hover': {
        borderColor: theme.palette.neutralDark,
      },
    },
    dropdownTriggerOpen: {
      borderColor: theme.palette.themePrimary,
    },
    dropdownTriggerDisabled: {
      backgroundColor: theme.palette.neutralLighter,
      borderColor: theme.palette.neutralLighter,
      cursor: 'default',
      color: theme.palette.neutralTertiary,
    },
    placeholderText: {
      color: theme.palette.neutralSecondary,
    },
    chevron: {
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      flexShrink: 0,
    },
    // Flyout panel
    flyout: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: theme.palette.white,
      border: `1px solid ${theme.palette.neutralLight}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      marginTop: 2,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    // Search input inside flyout
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '8px 8px 0 8px',
      border: `1px solid ${theme.palette.neutralSecondary}`,
      borderRadius: 2,
      padding: '0 8px',
      minHeight: 32,
      backgroundColor: theme.palette.white,
      ':focus-within': {
        borderColor: theme.palette.themePrimary,
      },
    },
    searchIcon: {
      fontSize: 14,
      color: theme.palette.themePrimary,
      flexShrink: 0,
    },
    searchInput: {
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
    suggestionsHeader: {
      padding: '8px 12px 4px 12px',
      fontSize: 12,
      fontWeight: 600,
      color: theme.palette.neutralSecondary,
    },
    // Results list
    resultsList: {
      maxHeight: 260,
      overflowY: 'auto' as const,
      paddingBottom: 4,
    },
    optionRow: {
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '8px 12px',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: theme.palette.neutralLighterAlt,
      },
    },
    optionRowHighlighted: {
      backgroundColor: theme.palette.neutralLighterAlt,
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

export const ApproverDropdown: React.FC<IApproverDropdownProps> = ({
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const displayLabel = `${label} (${roleDescription})`;

  // Filter approvers based on search text (match from starting letters)
  const filteredApprovers = React.useMemo(() => {
    if (!searchText) return approvers;
    const lower = searchText.toLowerCase();
    return approvers.filter((a) => {
      const nameParts = a.name.toLowerCase().split(/\s+/);
      return (
        nameParts.some((part) => part.startsWith(lower)) ||
        a.email.toLowerCase().startsWith(lower)
      );
    });
  }, [approvers, searchText]);

  // Close on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchText('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus search input when flyout opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleTriggerClick = React.useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      setSearchText('');
      setHighlightedIndex(-1);
    }
  }, [disabled]);

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setIsOpen(false);
      setSearchText('');
      setHighlightedIndex(-1);
    },
    [onApproverSelected]
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
      setHighlightedIndex(-1);
    },
    []
  );

  const handleSearchKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
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
        setSearchText('');
        setHighlightedIndex(-1);
      }
    },
    [filteredApprovers, highlightedIndex, handleSelect]
  );

  const triggerClassName = [
    classNames.dropdownTrigger,
    isOpen ? classNames.dropdownTriggerOpen : '',
    disabled ? classNames.dropdownTriggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

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
            {/* Dropdown trigger */}
            <button
              className={triggerClassName}
              onClick={handleTriggerClick}
              disabled={disabled}
              type="button"
            >
              <span className={selectedApprover ? undefined : classNames.placeholderText}>
                {selectedApprover ? selectedApprover.name : 'Select'}
              </span>
              <Icon iconName="ChevronDown" className={classNames.chevron} />
            </button>

            {/* Flyout with search + results */}
            {isOpen && (
              <div className={classNames.flyout}>
                <div className={classNames.searchContainer}>
                  <Icon iconName="Search" className={classNames.searchIcon} />
                  <input
                    ref={searchInputRef}
                    className={classNames.searchInput}
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Type a name or email"
                  />
                </div>

                {/* Suggestions header — only when not searching */}
                {searchText.length === 0 && (
                  <div className={classNames.suggestionsHeader}>Suggestions</div>
                )}

                <div className={classNames.resultsList}>
                  {filteredApprovers.map((approver, index) => (
                    <div
                      key={approver.key}
                      className={`${classNames.optionRow} ${
                        index === highlightedIndex
                          ? classNames.optionRowHighlighted
                          : ''
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(approver);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className={classNames.optionName}>
                        {approver.name}
                      </span>
                      <span className={classNames.optionEmail}>
                        {approver.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
