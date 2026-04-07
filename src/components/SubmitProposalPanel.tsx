import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';
import { ApproverComboBox } from './ApproverComboBox';
import { IApprover } from '../types/models';
import { APPROVERS, CURRENT_USER, APPROVER_POLICY } from '../data/mockData';

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
    },
    description: {
      ...theme.fonts.medium,
      color: theme.semanticColors.bodyText,
      marginBottom: 24,
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
  const [selectedApprover, setSelectedApprover] = React.useState<IApprover | undefined>();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = React.useCallback(() => {
    setSubmitted(true);
    if (selectedApprover) {
      onSubmit(selectedApprover);
    }
  }, [selectedApprover, onSubmit]);

  const handleDismiss = React.useCallback(() => {
    setSelectedApprover(undefined);
    setSubmitted(false);
    onDismiss();
  }, [onDismiss]);

  const errorMessage = submitted && !selectedApprover
    ? 'An approver is required to submit the proposal.'
    : undefined;

  const onRenderFooterContent = React.useCallback(() => (
    <div className={classNames.footer}>
      <DefaultButton text="Back" onClick={onBack} />
      <Text className={classNames.stepIndicator}>Step 2 of 2</Text>
      <PrimaryButton
        text="Submit"
        onClick={handleSubmit}
        disabled={submitted && !selectedApprover}
      />
    </div>
  ), [classNames, onBack, handleSubmit, submitted, selectedApprover]);

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
        content: { padding: '0 24px', flex: 1 },
        header: { paddingLeft: 24 },
        footerInner: { padding: '0 24px 16px' },
        commands: { marginTop: 0 },
      }}
    >
      <div className={classNames.panelContent}>
        <Text className={classNames.description} block>
          Select or type an approver's name (including your own) for the policies that are not automatically selected.
        </Text>

        <ApproverComboBox
          label={APPROVER_POLICY.label}
          roleDescription={APPROVER_POLICY.roleDescription}
          required={APPROVER_POLICY.required}
          stepNumber={APPROVER_POLICY.id}
          approvers={APPROVERS}
          currentUser={CURRENT_USER}
          selectedApprover={selectedApprover}
          onApproverSelected={setSelectedApprover}
          errorMessage={errorMessage}
        />
      </div>
    </Panel>
  );
};
