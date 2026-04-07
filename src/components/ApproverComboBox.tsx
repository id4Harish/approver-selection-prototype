import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Callout, DirectionalHint } from '@fluentui/react/lib/Callout';
import { TextField } from '@fluentui/react/lib/TextField';
import { Icon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { Label } from '@fluentui/react/lib/Label';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { Announced } from '@fluentui/react/lib/Announced';
import { IApprover } from '../types/models';

export interface IApproverComboBoxProps {
  label: string;
  roleDescription: string;
  required?: boolean;
  stepNumber: number;
  approvers: IApprover[];
  currentUser?: IApprover;
  selectedApprover?: IApprover;
  onApproverSelected: (approver: IApprover | undefined) => void;
  disabled?: boolean;
  errorMessage?: string;
}

const getClassNames = memoizeFunction((theme: ITheme, isOpen: boolean, hasError: boolean, isDisabled: boolean) =>
  mergeStyleSets({
    root: {
      position: 'relative',
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      border: `1px solid ${hasError ? theme.semanticColors.errorText : isOpen ? theme.palette.themePrimary : theme.semanticColors.inputBorder}`,
      borderRadius: 2,
      backgroundColor: isDisabled ? theme.semanticColors.disabledBackground : theme.semanticColors.inputBackground,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      ':hover': !isDisabled && !isOpen ? {
        borderColor: theme.semanticColors.inputBorderHovered,
      } : {},
    },
    inputWrapperFocused: {
      borderColor: theme.palette.themePrimary,
      borderWidth: 2,
    },
    chevron: {
      padding: '0 8px',
      color: isDisabled ? theme.semanticColors.disabledText : theme.semanticColors.bodyText,
      fontSize: 12,
    },
    callout: {
      maxHeight: 350,
      overflowY: 'auto',
      boxShadow: theme.effects.elevation8,
    },
    menuItem: [
      {
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ':hover': {
          backgroundColor: theme.semanticColors.menuItemBackgroundHovered,
        },
        ':focus-visible': {
          outline: `2px solid ${theme.palette.themePrimary}`,
          outlineOffset: -2,
        },
      },
    ],
    menuItemSelf: {
      padding: '8px 12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      ':hover': {
        backgroundColor: theme.semanticColors.menuItemBackgroundHovered,
      },
      ':focus-visible': {
        outline: `2px solid ${theme.palette.themePrimary}`,
        outlineOffset: -2,
      },
    },
    menuItemName: {
      ...theme.fonts.medium,
      fontWeight: 600,
      color: theme.semanticColors.bodyText,
    },
    menuItemNameSelf: {
      ...theme.fonts.medium,
      fontWeight: 600,
      color: theme.palette.themePrimary,
    },
    menuItemEmail: {
      ...theme.fonts.small,
      color: theme.semanticColors.bodySubtext,
    },
    separator: {
      height: 1,
      backgroundColor: theme.palette.neutralLight,
      margin: 0,
    },
    errorText: {
      ...theme.fonts.small,
      color: theme.semanticColors.errorText,
      marginTop: 4,
    },
  })
);

export const ApproverComboBox: React.FC<IApproverComboBoxProps> = ({
  label,
  roleDescription,
  required = false,
  stepNumber,
  approvers,
  currentUser,
  selectedApprover,
  onApproverSelected,
  disabled = false,
  errorMessage,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const inputRef = React.useRef<HTMLDivElement>(null);
  const calloutId = React.useId();
  const classNames = getClassNames(theme, isOpen, !!errorMessage, disabled);

  const filteredApprovers = React.useMemo(() => {
    if (!searchText.trim()) return approvers;
    const lower = searchText.toLowerCase();
    return approvers.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        a.email.toLowerCase().includes(lower)
    );
  }, [approvers, searchText]);

  const handleToggle = React.useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setSearchText('');
  }, [disabled]);

  const handleSelect = React.useCallback(
    (approver: IApprover) => {
      onApproverSelected(approver);
      setIsOpen(false);
      setSearchText('');
    },
    [onApproverSelected]
  );

  const handleKeyDown = React.useCallback(
    (ev: React.KeyboardEvent) => {
      if (ev.key === 'Escape') {
        setIsOpen(false);
      } else if (ev.key === 'Enter' || ev.key === ' ') {
        if (!isOpen) {
          ev.preventDefault();
          setIsOpen(true);
          setSearchText('');
        }
      }
    },
    [isOpen]
  );

  const displayLabel = `${label} (${roleDescription})`;

  return (
    <div className={classNames.root}>
      <div className={classNames.labelRow}>
        <div className={classNames.stepBadge}>{stepNumber}</div>
        <div className={classNames.fieldContainer}>
          <div className={classNames.labelText}>
            <Label styles={{ root: { fontWeight: 600, padding: 0 } }}>
              {displayLabel}
            </Label>
            {required && <span className={classNames.requiredStar}>*</span>}
          </div>

          <div
            ref={inputRef}
            className={classNames.inputWrapper}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={calloutId}
            aria-haspopup="listbox"
            aria-label={displayLabel}
            aria-required={required}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
          >
            <TextField
              value={isOpen ? searchText : selectedApprover?.name || ''}
              placeholder="Select or enter approver name"
              onChange={(_, val) => setSearchText(val || '')}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen && !disabled) {
                  setIsOpen(true);
                  setSearchText('');
                }
              }}
              disabled={disabled}
              borderless
              styles={{
                root: { flex: 1 },
                fieldGroup: { border: 'none', backgroundColor: 'transparent' },
                field: {
                  cursor: disabled ? 'not-allowed' : 'text',
                  color: selectedApprover && !isOpen
                    ? theme.semanticColors.bodyText
                    : theme.semanticColors.inputPlaceholderText,
                },
              }}
              readOnly={!isOpen}
              aria-hidden="true"
              tabIndex={-1}
            />
            <Icon
              iconName="ChevronDown"
              className={classNames.chevron}
              aria-hidden="true"
            />
          </div>

          {errorMessage && (
            <Text className={classNames.errorText} role="alert">
              {errorMessage}
            </Text>
          )}

          {isOpen && (
            <Callout
              target={inputRef.current}
              isBeakVisible={false}
              directionalHint={DirectionalHint.bottomLeftEdge}
              onDismiss={() => setIsOpen(false)}
              calloutWidth={inputRef.current?.clientWidth}
              styles={{
                root: classNames.callout,
              }}
              role="dialog"
            >
              <FocusZone direction={FocusZoneDirection.vertical}>
                <div role="listbox" id={calloutId} aria-label="Approver suggestions">
                  {currentUser && (
                    <>
                      <div
                        className={classNames.menuItemSelf}
                        role="option"
                        aria-selected={selectedApprover?.key === currentUser.key}
                        tabIndex={0}
                        onClick={() => handleSelect(currentUser)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelect(currentUser);
                          }
                        }}
                      >
                        <Persona
                          text={currentUser.name}
                          size={PersonaSize.size32}
                          hidePersonaDetails
                        />
                        <div>
                          <div className={classNames.menuItemNameSelf}>Select myself</div>
                          <div className={classNames.menuItemEmail}>{currentUser.email}</div>
                        </div>
                      </div>
                      <div className={classNames.separator} />
                    </>
                  )}

                  {filteredApprovers
                    .filter((a) => a.key !== currentUser?.key)
                    .map((approver) => (
                      <div
                        key={approver.key}
                        className={classNames.menuItem}
                        role="option"
                        aria-selected={selectedApprover?.key === approver.key}
                        tabIndex={0}
                        onClick={() => handleSelect(approver)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelect(approver);
                          }
                        }}
                      >
                        <span className={classNames.menuItemName}>{approver.name}</span>
                        <span className={classNames.menuItemEmail}>{approver.email}</span>
                      </div>
                    ))}

                  {filteredApprovers.filter((a) => a.key !== currentUser?.key).length === 0 && (
                    <div style={{ padding: '12px', textAlign: 'center' }}>
                      <Text variant="small" styles={{ root: { color: theme.semanticColors.bodySubtext } }}>
                        No matching approvers found.
                      </Text>
                    </div>
                  )}
                </div>
              </FocusZone>
            </Callout>
          )}

          <Announced message={
            isOpen
              ? `${filteredApprovers.length} approvers available`
              : selectedApprover
                ? `${selectedApprover.name} selected`
                : ''
          } />
        </div>
      </div>
    </div>
  );
};
