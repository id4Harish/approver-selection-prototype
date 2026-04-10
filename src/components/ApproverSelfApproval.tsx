import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Label } from '@fluentui/react/lib/Label';
import { IApprover } from '../types/models';

export interface IApproverSelfApprovalProps {
  label: string;
  roleDescription: string;
  required?: boolean;
  stepNumber: number;
  approvers: IApprover[];
  currentUser: IApprover;
  selectedApprover?: IApprover;
  onApproverSelected: (approver: IApprover | undefined) => void;
  disabled?: boolean;
  /** Whether the current user is eligible for self-approval */
  selfApprovalEnabled: boolean;
  /** Show error state on the pill */
  error?: boolean;
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
    // Input field container
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
    // People Pill
    peoplePill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#f3f2f1',
      borderRadius: 16,
      padding: '2px 8px 2px 2px',
      marginRight: 4,
      maxWidth: '100%',
      flexShrink: 0,
      cursor: 'default',
      ':hover': {
        backgroundColor: '#edebe9',
      },
      ':active': {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
      },
    },
    peoplePillError: {
      backgroundColor: '#f3f2f1',
      ':hover': {
        backgroundColor: '#edebe9',
      },
    },
    pillAvatar: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: 'rgb(79, 107, 237)',
      color: theme.palette.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 600,
      flexShrink: 0,
    },
    pillErrorIcon: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      backgroundColor: '#a4262c',
      color: theme.palette.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0,
    },
    pillName: {
      fontSize: 14,
      color: theme.palette.neutralPrimary,
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    pillNameError: {
      color: '#a4262c',
      textDecoration: 'underline',
      textDecorationStyle: 'dashed' as const,
      textUnderlineOffset: 3,
    },
    pillDismiss: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '50%',
      cursor: 'pointer',
      padding: 0,
      color: theme.palette.neutralSecondary,
      fontSize: 10,
      flexShrink: 0,
      ':hover': {
        backgroundColor: '#c8c6c4',
        color: theme.palette.neutralPrimary,
      },
      ':active': {
        backgroundColor: '#106ebe',
        color: theme.palette.white,
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
      maxHeight: 360,
      overflowY: 'auto' as const,
      marginTop: 2,
    },
    // Self row (pinned at top)
    selfRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      cursor: 'pointer',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      ':hover': {
        backgroundColor: theme.palette.neutralLighterAlt,
      },
    },
    selfRowDisabled: {
      cursor: 'default',
      ':hover': {
        backgroundColor: 'transparent',
      },
    },
    selfAvatar: {
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
    selfAvatarDisabled: {
      backgroundColor: 'rgb(161, 159, 157)',
    },
    selfTextContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      minWidth: 0,
      flex: 1,
    },
    selfName: {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.neutralPrimary,
      lineHeight: '20px',
    },
    selfNameDisabled: {
      color: 'rgb(161, 159, 157)',
    },
    selfMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: theme.palette.neutralSecondary,
      lineHeight: '16px',
    },
    selfMetaDisabled: {
      color: 'rgb(161, 159, 157)',
    },
    selfBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    },
    selfBadgeDot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: theme.palette.neutralSecondary,
      flexShrink: 0,
    },
    selfBadgeDotDisabled: {
      backgroundColor: 'rgb(161, 159, 157)',
    },
    // Regular option row
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
    optionAvatar: {
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

export const ApproverSelfApproval: React.FC<IApproverSelfApprovalProps> = ({
  label,
  roleDescription,
  required = false,
  stepNumber,
  approvers,
  currentUser,
  selectedApprover,
  onApproverSelected,
  disabled = false,
  selfApprovalEnabled,
  error = false,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [filterText, setFilterText] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const displayLabel = `${label} (${roleDescription})`;

  // Other approvers (exclude current user)
  const otherApprovers = React.useMemo(
    () => approvers.filter((a) => a.key !== currentUser.key),
    [approvers, currentUser]
  );

  // Filtered other approvers (match from starting letters of name parts or email)
  const filteredApprovers = React.useMemo(() => {
    if (!filterText) return otherApprovers;
    const lower = filterText.toLowerCase();
    return otherApprovers.filter((a) => {
      const nameParts = a.name.toLowerCase().split(/\s+/);
      return (
        nameParts.some((part) => part.startsWith(lower)) ||
        a.email.toLowerCase().startsWith(lower)
      );
    });
  }, [otherApprovers, filterText]);

  // Self is "eligible" visually when there's no filter text OR the filter matches the current user
  const selfMatchesFilter = React.useMemo(() => {
    if (!filterText) return true;
    const lower = filterText.toLowerCase();
    const nameParts = currentUser.name.toLowerCase().split(/\s+/);
    return (
      nameParts.some((part) => part.startsWith(lower)) ||
      currentUser.email.toLowerCase().startsWith(lower) ||
      'you'.startsWith(lower)
    );
  }, [currentUser, filterText]);

  // Close on outside click
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

  const handleInputFocus = React.useCallback(() => {
    if (!selectedApprover) {
      setIsOpen(true);
    }
  }, [selectedApprover]);

  const handleInputBlur = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    []
  );

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setFilterText('');
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onApproverSelected]
  );

  const handleSelfSelect = React.useCallback(() => {
    if (selfApprovalEnabled) {
      handleSelect({ ...currentUser, isSelf: true });
    }
  }, [selfApprovalEnabled, currentUser, handleSelect]);

  const handleDismiss = React.useCallback(() => {
    onApproverSelected(undefined);
    setFilterText('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [onApproverSelected]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // index -1 = self row, 0+ = filteredApprovers
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredApprovers.length - 1 ? prev + 1 : -1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > -1 ? prev - 1 : filteredApprovers.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex === -1 && selfApprovalEnabled) {
          handleSelfSelect();
        } else if (highlightedIndex >= 0) {
          handleSelect(filteredApprovers[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [filteredApprovers, highlightedIndex, handleSelect, handleSelfSelect, selfApprovalEnabled]
  );

  const handleWrapperClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // Determine pill display text
  const pillText = selectedApprover?.isSelf
    ? 'You (Self Approval)'
    : selectedApprover?.name || '';

  // Determine self badge text based on eligibility only (not filter text)
  const selfBadgeText = selfApprovalEnabled ? 'Self Approval' : 'Not Eligible';

  const isSelfClickable = selfApprovalEnabled;

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
              className={classNames.inputWrapper}
              onClick={handleWrapperClick}
            >
              {/* Selected approver as People Pill */}
              {selectedApprover && (
                <div className={`${classNames.peoplePill} ${error ? classNames.peoplePillError : ''}`}>
                  {error ? (
                    <div className={classNames.pillErrorIcon}>
                      <Icon iconName="Warning" />
                    </div>
                  ) : (
                    <div className={classNames.pillAvatar}>
                      {getInitials(selectedApprover.name)}
                    </div>
                  )}
                  <span className={`${classNames.pillName} ${error ? classNames.pillNameError : ''}`}>
                    {error ? 'invalid' : pillText}
                  </span>
                  <button
                    className={classNames.pillDismiss}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    title="Remove"
                    disabled={disabled}
                  >
                    <Icon iconName="Cancel" />
                  </button>
                </div>
              )}

              {/* Text input */}
              {!selectedApprover && (
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

            {/* Dropdown */}
            {isOpen && !selectedApprover && (
              <div className={classNames.dropdown}>
                {/* Pinned "You" row at top */}
                <div
                  className={`${classNames.selfRow} ${!isSelfClickable ? classNames.selfRowDisabled : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (isSelfClickable) handleSelfSelect();
                  }}
                >
                  <div className={`${classNames.selfAvatar} ${!isSelfClickable ? classNames.selfAvatarDisabled : ''}`}>
                    {getInitials(currentUser.name)}
                  </div>
                  <div className={classNames.selfTextContainer}>
                    <span className={`${classNames.selfName} ${!isSelfClickable ? classNames.selfNameDisabled : ''}`}>You</span>
                    <span className={`${classNames.selfMeta} ${!isSelfClickable ? classNames.selfMetaDisabled : ''}`}>
                      {currentUser.email}
                      <span className={classNames.selfBadge}>
                        <span className={`${classNames.selfBadgeDot} ${!isSelfClickable ? classNames.selfBadgeDotDisabled : ''}`} />
                        {selfBadgeText}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Other approvers */}
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
                    <div className={classNames.optionAvatar}>
                      {getInitials(approver.name)}
                    </div>
                    <div className={classNames.optionTextContainer}>
                      <span className={classNames.optionName}>
                        {approver.name}
                      </span>
                      <span className={classNames.optionEmail}>
                        {approver.email}
                      </span>
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
