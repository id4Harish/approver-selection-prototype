import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';
import { ApproverComboBoxPersona } from './ApproverComboBoxPersona';
import { IApprover } from '../types/models';
import { APPROVERS, APPROVER_POLICY } from '../data/mockData';

export interface ISubmitProposalPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSubmit: (selectedApprover: IApprover) => void;
  onBack: () => void;
}

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    panelContent: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingBottom: 24,
    },
    description: {
      ...theme.fonts.medium,
      color: theme.semanticColors.bodyText,
      marginBottom: 24,
    },
    variantSeparator: {
      marginTop: 32,
      marginBottom: 16,
      paddingTop: 16,
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      ...theme.fonts.mediumPlus,
      fontWeight: 600,
      color: theme.palette.neutralSecondary,
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      marginTop: 'auto',
    },
    stepIndicator: {
      ...theme.fonts.medium,
      color: theme.semanticColors.bodySubtext,
    },
  })
);

export const SubmitProposalPanel: React.FC<ISubmitProposalPanelProps> = ({
  isOpen,
  onDismiss,
  onSubmit,
  onBack,
}) => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [selectedApproverPersona, setSelectedApproverPersona] = React.useState<IApprover | undefined>();

  const handleSubmit = React.useCallback(() => {
    if (selectedApproverPersona) {
      onSubmit(selectedApproverPersona);
    }
  }, [selectedApproverPersona, onSubmit]);

  const handleDismiss = React.useCallback(() => {
    setSelectedApproverPersona(undefined);
    onDismiss();
  }, [onDismiss]);

  const onRenderFooterContent = React.useCallback(() => (
    <div className={classNames.footer}>
      <DefaultButton text="Back" onClick={onBack} />
      <Text className={classNames.stepIndicator}>Step 2 of 2</Text>
      <PrimaryButton
        text="Submit"
        onClick={handleSubmit}
        disabled={!selectedApproverPersona}
      />
    </div>
  ), [classNames, onBack, handleSubmit, selectedApproverPersona]);

  return (
    <Panel
      isOpen={isOpen}
      type={PanelType.medium}
      onDismiss={handleDismiss}
      headerText="Submit proposal"
      isFooterAtBottom
      onRenderFooterContent={onRenderFooterContent}
      styles={{
        main: { padding: 0 },
        content: { padding: '0 24px', flex: 1, overflowY: 'auto' },
        header: { paddingLeft: 24 },
        footerInner: { padding: '0 24px 16px' },
        commands: { marginTop: 0 },
      }}
    >
      <div className={classNames.panelContent}>
        <Text className={classNames.description} block>
          Start typing to search for an approver, for policies that aren't automatically selected.
        </Text>

        {/* Variant 6: Persona suggestions with contextual menu */}
        <ApproverComboBoxPersona
          label={APPROVER_POLICY.label}
          roleDescription={APPROVER_POLICY.roleDescription}
          required={APPROVER_POLICY.required}
          stepNumber={1}
          approvers={APPROVERS}
          selectedApprover={selectedApproverPersona}
          onApproverSelected={setSelectedApproverPersona}
          disabled={false}
        />

        {/* Variant 7: Inline value with clear button
        <div className={classNames.variantSeparator}>New variant</div>

        <ApproverComboBoxInline
          label={APPROVER_POLICY.label}
          roleDescription={APPROVER_POLICY.roleDescription}
          required={APPROVER_POLICY.required}
          stepNumber={1}
          approvers={APPROVERS}
          selectedApprover={selectedApproverInline}
          onApproverSelected={setSelectedApproverInline}
          disabled={false}
        />
        */}

        {/* Variant 8: SearchBox people picker
        <div className={classNames.variantSeparator}>People picker variant</div>

        <ApproverSearchPicker
          label={APPROVER_POLICY.label}
          roleDescription={APPROVER_POLICY.roleDescription}
          required={APPROVER_POLICY.required}
          stepNumber={1}
          approvers={APPROVERS}
          currentUser={CURRENT_USER}
          selectedApprover={selectedApproverSearch}
          onApproverSelected={setSelectedApproverSearch}
          disabled={false}
        />
        */}
      </div>
    </Panel>
  );
};
