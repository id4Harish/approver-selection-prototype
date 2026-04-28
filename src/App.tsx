import * as React from 'react';
import { mergeStyleSets } from '@fluentui/merge-styles';
import { memoizeFunction } from '@fluentui/utilities';
import { useTheme, ITheme } from '@fluentui/react';
import { PrimaryButton, IconButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';
import { Stack } from '@fluentui/react/lib/Stack';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Link as FluentLink } from '@fluentui/react/lib/Link';
import { Icon } from '@fluentui/react/lib/Icon';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Persona, PersonaSize } from '@fluentui/react/lib/Persona';
import { SubmitProposalPanel } from './components/SubmitProposalPanel';
import { IApprover } from './types/models';
import { Routes, Route } from 'react-router-dom';
import { ComponentDocs } from './pages/ComponentDocs';

const getClassNames = memoizeFunction((theme: ITheme) =>
  mergeStyleSets({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: theme.semanticColors.bodyBackground,
    },
    /* ===== Nav Header (top dark bar) ===== */
    navHeader: {
      display: 'flex',
      alignItems: 'center',
      height: 48,
      backgroundColor: '#333333',
      flexShrink: 0,
    },
    navHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      width: 180,
      height: 48,
      flexShrink: 0,
    },
    waffleButton: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      cursor: 'pointer',
      flexShrink: 0,
    },
    productName: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      marginLeft: 4,
    },
    navHeaderCenter: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      padding: '0 16px',
    },
    navSearchBox: {
      maxWidth: 375,
      width: '100%',
    },
    navHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      height: 48,
      flexShrink: 0,
    },
    navHeaderButton: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      cursor: 'pointer',
      position: 'relative',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    },
    notificationBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 16,
      height: 16,
      borderRadius: '50%',
      backgroundColor: '#e81123',
      color: '#ffffff',
      fontSize: 10,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    personaButton: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    },
    copilotButton: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0078d4',
      color: '#ffffff',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#106ebe',
      },
    },
    /* ===== Body row (sidenav + content) ===== */
    bodyRow: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
    },
    /* ===== Side Nav (icon rail) ===== */
    sideNav: {
      width: 48,
      backgroundColor: '#f3f2f1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 0,
      flexShrink: 0,
      borderRight: `1px solid ${theme.palette.neutralLight}`,
      position: 'relative',
    },
    navIcon: {
      color: '#323130',
      fontSize: 16,
      width: 48,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#e1dfdd',
      },
    },
    navIconActive: {
      color: '#323130',
      fontSize: 16,
      width: 48,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: '#ffffff',
      position: 'relative',
    },
    navIndicator: {
      position: 'absolute',
      left: 0,
      top: 8,
      width: 4,
      height: 24,
      backgroundColor: '#2266e3',
      borderRadius: '0 2px 2px 0',
    },
    navSpacer: {
      flex: 1,
    },
    navBottomSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 8,
    },
    navPersona: {
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    navPersonaAvatar: {
      width: 28,
      height: 28,
      borderRadius: 4,
      backgroundColor: '#0078d4',
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    /* ===== Main Content ===== */
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    /* ===== Proposal Header ===== */
    proposalHeader: {
      display: 'flex',
      alignItems: 'center',
      height: 42,
      padding: '0 16px',
      backgroundColor: '#ffffff',
      borderBottom: `1px solid #edebe9`,
    },
    proposalHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      flex: 1,
    },
    quotesButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 12px',
      height: 42,
      cursor: 'pointer',
      color: '#323130',
      ':hover': {
        backgroundColor: '#f3f2f1',
      },
    },
    quotesIcon: {
      fontSize: 16,
      color: '#323130',
    },
    quotesText: {
      fontSize: 14,
      color: '#323130',
    },
    headerDivider: {
      width: 1,
      height: 42,
      backgroundColor: '#edebe9',
      flexShrink: 0,
    },
    customerName: {
      padding: '0 12px',
      fontSize: 14,
      color: '#323130',
    },
    headerBullet: {
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: '#605e5c',
      flexShrink: 0,
    },
    proposalName: {
      padding: '0 12px',
      fontSize: 14,
      color: '#323130',
    },
    draftBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 12px',
      backgroundColor: '#fff4ce',
      borderRadius: 2,
      marginLeft: 12,
    },
    draftBadgeIcon: {
      fontSize: 14,
      color: '#605e5c',
    },
    draftBadgeText: {
      fontSize: 14,
      color: '#323130',
    },
    proposalHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    editingStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 8px',
    },
    editingIcon: {
      fontSize: 14,
      color: '#797775',
    },
    editingText: {
      fontSize: 14,
      color: '#605e5c',
    },
    /* ===== Command Bar ===== */
    commandBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      height: 44,
      backgroundColor: theme.palette.white,
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      gap: 4,
    },
    commandBarRight: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    /* ===== Body Area ===== */
    bodyArea: {
      flex: 1,
      display: 'flex',
      overflow: 'auto',
      backgroundColor: theme.palette.white,
    },
    /* ===== Product Finder Sidebar ===== */
    productFinder: {
      width: 254,
      backgroundColor: '#f2f2f2',
      borderRight: `1px solid ${theme.palette.neutralLight}`,
      overflow: 'auto',
      flexShrink: 0,
      padding: '16px 20px',
    },
    finderTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#323130',
      marginBottom: 16,
    },
    finderAction: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 0',
      cursor: 'pointer',
      borderBottom: `1px solid #d2d0ce`,
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.04)',
      },
    },
    finderActionIcon: {
      fontSize: 16,
      color: '#106ebe',
    },
    finderActionText: {
      fontSize: 14,
      color: '#323130',
    },
    finderSearchRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      padding: '8px 0',
      borderBottom: `1px solid #d2d0ce`,
    },
    finderSearchButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      flex: 1,
    },
    finderSearchIcon: {
      fontSize: 16,
      color: '#0078d4',
    },
    finderSearchText: {
      fontSize: 14,
      color: '#323130',
    },
    finderSearchDivider: {
      width: 1,
      height: 16,
      backgroundColor: '#c8c6c4',
      margin: '0 8px',
    },
    finderSectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 8,
    },
    finderSectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 14,
      fontWeight: 600,
      color: '#323130',
    },
    finderSectionActions: {
      display: 'flex',
      gap: 0,
    },
    finderItem: {
      padding: '6px 8px',
      fontSize: 14,
      color: '#323130',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.04)',
      },
    },
    /* ===== Content Area ===== */
    contentArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      overflow: 'auto',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 24px',
      gap: 16,
    },
    productGrid: {
      flex: 1,
      padding: '0 24px',
      overflow: 'auto',
    },
    /* ===== Right Side Info Panel ===== */
    sidePanel: {
      width: 320,
      borderLeft: `1px solid ${theme.palette.neutralLight}`,
      padding: 24,
      overflow: 'auto',
      flexShrink: 0,
      backgroundColor: theme.palette.white,
    },
    sidePanelTitle: {
      ...theme.fonts.large,
      fontWeight: 600,
      color: theme.semanticColors.bodyText,
      marginBottom: 4,
    },
    sidePanelAddress: {
      ...theme.fonts.small,
      color: theme.semanticColors.bodySubtext,
      lineHeight: '1.5',
      marginBottom: 4,
    },
    sidePanelSection: {
      marginTop: 20,
    },
    sidePanelSectionTitle: {
      ...theme.fonts.medium,
      fontWeight: 600,
      color: theme.semanticColors.bodyText,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 8,
    },
    creditRow: {
      display: 'flex',
      justifyContent: 'space-between',
      ...theme.fonts.small,
      color: theme.semanticColors.bodyText,
      marginBottom: 4,
    },
    approvalsSection: {
      marginTop: 20,
    },
    approvalTag: {
      ...theme.fonts.small,
      color: theme.semanticColors.bodyText,
      marginBottom: 2,
    },
    totalBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'baseline',
      padding: '12px 24px',
      borderTop: `1px solid ${theme.palette.neutralLight}`,
      gap: 8,
    },
    totalLabel: {
      ...theme.fonts.medium,
      color: theme.semanticColors.bodySubtext,
    },
    totalAmount: {
      ...theme.fonts.large,
      fontWeight: 600,
      color: theme.semanticColors.bodyText,
    },
    priceRefresh: {
      ...theme.fonts.tiny,
      color: theme.semanticColors.bodySubtext,
    },
    successBanner: {
      margin: '0 24px',
      marginTop: 8,
    },
  })
);

interface IProductLineItem {
  key: string;
  name: string;
  details: string;
  quantity: number;
  listPrice: string;
  listPriceUnit: string;
  estMonthly: string;
  estMonthlyUnit: string;
  discount: string;
  subtotal: string;
}

const PRODUCT_ITEMS: IProductLineItem[] = [
  {
    key: '1',
    name: 'Microsoft E5',
    details: 'Microsoft 365 E3 (no Teams), 20 months term, Yearly, Starts at order acceptance',
    quantity: 100,
    listPrice: '240.00',
    listPriceUnit: 'USD user/year',
    estMonthly: '24',
    estMonthlyUnit: 'USD user/month',
    discount: '5%',
    subtotal: '480,000.00 USD',
  },
  {
    key: '2',
    name: 'Microsoft 365 E3',
    details: 'Microsoft 365 E3, 12 months term, Monthly, Starts at order acceptance',
    quantity: 50,
    listPrice: '36.00',
    listPriceUnit: 'USD user/month',
    estMonthly: '36',
    estMonthlyUnit: 'USD user/month',
    discount: '3%',
    subtotal: '20,952.00 USD',
  },
  {
    key: '3',
    name: 'Azure Plan',
    details: 'Azure Plan, Pay as you go',
    quantity: 1,
    listPrice: '-',
    listPriceUnit: '',
    estMonthly: '-',
    estMonthlyUnit: '',
    discount: '-',
    subtotal: '49,752.04 USD',
  },
];

const COLUMNS: IColumn[] = [
  { key: 'name', name: 'Product details', fieldName: 'name', minWidth: 200, maxWidth: 300, isResizable: true },
  { key: 'quantity', name: 'Quantity', fieldName: 'quantity', minWidth: 60, maxWidth: 80, isResizable: true },
  { key: 'listPrice', name: 'List price', fieldName: 'listPrice', minWidth: 80, maxWidth: 100, isResizable: true },
  { key: 'estMonthly', name: 'Est. monthly list price', fieldName: 'estMonthly', minWidth: 100, maxWidth: 130, isResizable: true },
  { key: 'discount', name: 'Discount', fieldName: 'discount', minWidth: 60, maxWidth: 80, isResizable: true },
  { key: 'subtotal', name: 'Subtotal', fieldName: 'subtotal', minWidth: 100, maxWidth: 140, isResizable: true },
];

const SIDE_NAV_ICONS = [
  'GlobalNavButton', 'Home', 'EditNote', 'ViewAll', 'People', 'Phone',
  'PageList', 'CloudImportExport', 'AnalyticsReport',
];

const PRODUCT_FINDER_FAVORITES = ['Microsoft 365 E3', 'Microsoft 365 E5', 'General Block Blob'];
const AZURE_ESSENTIALS = ['Azure Commitment Discount', 'Azure plan', 'Azure credits', 'Microsoft Azure Support', 'SCP Commitment Discount'];
const PER_USER_ESSENTIALS = ['Windows 365 Business', 'Windows 365 Business with Windows Hybrid Benefit', 'Windows 365 Enterprise', 'Professional Direct Support for Microsoft 365'];

const AppContent: React.FC = () => {
  const theme = useTheme();
  const classNames = getClassNames(theme);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [submittedApprover, setSubmittedApprover] = React.useState<IApprover | undefined>();

  const onRenderItemColumn = React.useCallback(
    (item: IProductLineItem, _index?: number, column?: IColumn) => {
      switch (column?.key) {
        case 'name':
          return (
            <Stack tokens={{ childrenGap: 4 }}>
              <Text styles={{ root: { fontWeight: 600 } }}>{item.name}</Text>
              <FluentLink styles={{ root: { fontSize: 12 } }}>{item.details}</FluentLink>
            </Stack>
          );
        case 'listPrice':
          return (
            <Stack>
              <Text>{item.listPrice}</Text>
              <Text variant="tiny" styles={{ root: { color: theme.semanticColors.bodySubtext } }}>
                {item.listPriceUnit}
              </Text>
            </Stack>
          );
        case 'estMonthly':
          return (
            <Stack>
              <Text>{item.estMonthly}</Text>
              <Text variant="tiny" styles={{ root: { color: theme.semanticColors.bodySubtext } }}>
                {item.estMonthlyUnit}
              </Text>
            </Stack>
          );
        default:
          return <Text>{String(item[column?.fieldName as keyof IProductLineItem] ?? '')}</Text>;
      }
    },
    [theme]
  );

  return (
    <div className={classNames.root}>
      {/* ===== Nav Header (dark top bar) ===== */}
      <div className={classNames.navHeader}>
        <div className={classNames.navHeaderLeft}>
          <div className={classNames.waffleButton}>
            <Icon iconName="WaffleOffice365" styles={{ root: { fontSize: 16 } }} />
          </div>
          <span className={classNames.productName}>Proposal Center</span>
        </div>

        <div className={classNames.navHeaderCenter}>
          <SearchBox
            placeholder="Search"
            underlined
            className={classNames.navSearchBox}
            styles={{
              root: {
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: 'none',
                borderRadius: 2,
                maxWidth: 375,
              },
              field: { color: '#ffffff', '::placeholder': { color: 'rgba(255,255,255,0.7)' } },
              icon: { color: '#ffffff' },
            }}
          />
        </div>

        <div className={classNames.navHeaderRight}>
          <div className={classNames.navHeaderButton}>
            <Icon iconName="Ringer" styles={{ root: { fontSize: 16 } }} />
            <div className={classNames.notificationBadge}>8</div>
          </div>
          <div className={classNames.navHeaderButton}>
            <Icon iconName="Settings" styles={{ root: { fontSize: 16 } }} />
          </div>
          <div className={classNames.navHeaderButton}>
            <Icon iconName="Help" styles={{ root: { fontSize: 16 } }} />
          </div>
          <div className={classNames.navHeaderButton}>
            <Icon iconName="Feedback" styles={{ root: { fontSize: 16 } }} />
          </div>
          <div className={classNames.personaButton}>
            <Persona size={PersonaSize.size28} hidePersonaDetails />
          </div>
        </div>
      </div>

      {/* ===== Body Row (SideNav + Main) ===== */}
      <div className={classNames.bodyRow}>
        {/* ===== Side Navigation (icon rail) ===== */}
        <div className={classNames.sideNav}>
          {SIDE_NAV_ICONS.map((iconName, index) => (
            <div
              key={iconName}
              className={index === 8 ? classNames.navIconActive : classNames.navIcon}
            >
              {index === 8 && <div className={classNames.navIndicator} />}
              <Icon iconName={iconName} />
            </div>
          ))}
          <div className={classNames.navSpacer} />
          <div className={classNames.navBottomSection}>
            <div className={classNames.navPersona}>
              <div className={classNames.navPersonaAvatar}>S</div>
            </div>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className={classNames.mainContent}>
          {/* ===== Proposal Header ===== */}
          <div className={classNames.proposalHeader}>
            <div className={classNames.proposalHeaderLeft}>
              <div className={classNames.quotesButton}>
                <Icon iconName="Back" className={classNames.quotesIcon} />
                <span className={classNames.quotesText}>Quotes</span>
              </div>
              <div className={classNames.headerDivider} />
              <span className={classNames.customerName}>Hidden Spaces Inc</span>
              <div className={classNames.headerBullet} />
              <span className={classNames.proposalName}>Subscription Price Updates</span>
              <div className={classNames.draftBadge}>
                <Icon iconName="Page" className={classNames.draftBadgeIcon} />
                <span className={classNames.draftBadgeText}>Draft</span>
              </div>
            </div>
            <div className={classNames.proposalHeaderRight}>
              <div className={classNames.editingStatus}>
                <Icon iconName="Edit" className={classNames.editingIcon} />
                <span className={classNames.editingText}>Editing</span>
              </div>
            </div>
          </div>

          {/* ===== Command Bar ===== */}
          <div className={classNames.commandBar}>
            <CommandBarButton iconProps={{ iconName: 'Settings' }} text="Properties" ariaLabel="Properties" />
            <CommandBarButton iconProps={{ iconName: 'BulletedList' }} text="Proposal steps" ariaLabel="Proposal steps" />
            <CommandBarButton iconProps={{ iconName: 'Share' }} text="Share" ariaLabel="Share" menuIconProps={{ iconName: 'ChevronDown' }} />
            <PrimaryButton
              text="Submit for approval"
              iconProps={{ iconName: 'Send' }}
              onClick={() => setIsPanelOpen(true)}
              styles={{
                root: { borderRadius: 4, height: 32 },
                label: { fontWeight: 600 },
              }}
            />
          </div>

          {/* Success Banner */}
          {submittedApprover && (
            <div className={classNames.successBanner}>
              <MessageBar
                messageBarType={MessageBarType.success}
                onDismiss={() => setSubmittedApprover(undefined)}
              >
                Proposal submitted for approval to <strong>{submittedApprover.name}</strong> ({submittedApprover.email})
              </MessageBar>
            </div>
          )}

          {/* ===== Body Area ===== */}
          <div className={classNames.bodyArea}>
            {/* ===== Product Finder Sidebar ===== */}
            <div className={classNames.productFinder}>
              <div className={classNames.finderTitle}>Product finder</div>

              {/* Actions */}
              <div className={classNames.finderAction}>
                <Icon iconName="SubscriptionAdd" className={classNames.finderActionIcon} />
                <span className={classNames.finderActionText}>Subscription management</span>
              </div>
              <div className={classNames.finderAction}>
                <Icon iconName="PromotedDatabase" className={classNames.finderActionIcon} />
                <span className={classNames.finderActionText}>Promotions</span>
              </div>
              <div className={classNames.finderSearchRow}>
                <div className={classNames.finderSearchButton}>
                  <Icon iconName="Search" className={classNames.finderSearchIcon} />
                  <span className={classNames.finderSearchText}>Product search</span>
                </div>
                <div className={classNames.finderSearchDivider} />
                <IconButton
                  iconProps={{ iconName: 'ProductCatalog' }}
                  ariaLabel="Product catalog"
                  styles={{ root: { color: '#0078d4', width: 32, height: 32 }, icon: { fontSize: 16 } }}
                />
              </div>

              {/* Favorites */}
              <div className={classNames.finderSectionHeader}>
                <span className={classNames.finderSectionTitle}>Favorites</span>
                <div className={classNames.finderSectionActions}>
                  <IconButton iconProps={{ iconName: 'MoreHorizontal' }} ariaLabel="More" styles={{ root: { width: 32, height: 32 }, icon: { fontSize: 14 } }} />
                  <IconButton iconProps={{ iconName: 'ChevronDown' }} ariaLabel="Collapse" styles={{ root: { width: 32, height: 32 }, icon: { fontSize: 14 } }} />
                </div>
              </div>
              {PRODUCT_FINDER_FAVORITES.map((item) => (
                <div key={item} className={classNames.finderItem}>{item}</div>
              ))}

              {/* Azure essentials */}
              <div className={classNames.finderSectionHeader}>
                <span className={classNames.finderSectionTitle}>
                  <Icon iconName="AzureLogo" styles={{ root: { fontSize: 16 } }} />
                  Azure essentials
                </span>
                <IconButton iconProps={{ iconName: 'ChevronDown' }} ariaLabel="Collapse" styles={{ root: { width: 32, height: 32 }, icon: { fontSize: 14 } }} />
              </div>
              {AZURE_ESSENTIALS.map((item) => (
                <div key={item} className={classNames.finderItem}>{item}</div>
              ))}

              {/* Per user essentials */}
              <div className={classNames.finderSectionHeader}>
                <span className={classNames.finderSectionTitle}>
                  <Icon iconName="Contact" styles={{ root: { fontSize: 16 } }} />
                  Per user essentials
                </span>
                <IconButton iconProps={{ iconName: 'ChevronDown' }} ariaLabel="Collapse" styles={{ root: { width: 32, height: 32 }, icon: { fontSize: 14 } }} />
              </div>
              {PER_USER_ESSENTIALS.map((item) => (
                <div key={item} className={classNames.finderItem}>{item}</div>
              ))}
            </div>

            {/* ===== Main Content Area ===== */}
            <div className={classNames.contentArea}>
              {/* Tabs */}
              <Pivot styles={{ root: { paddingLeft: 24 } }}>
                <PivotItem headerText="Products" />
                <PivotItem headerText="Agreement" />
              </Pivot>

              {/* Product Toolbar */}
              <div className={classNames.toolbar}>
                <CommandBarButton iconProps={{ iconName: 'Delete' }} text="Delete" ariaLabel="Delete" />
                <CommandBarButton iconProps={{ iconName: 'Download' }} text="Download shared meters" ariaLabel="Download shared meters" />
                <Stack.Item grow={1}><span /></Stack.Item>
                <CommandBarButton iconProps={{ iconName: 'ExcelDocument' }} text="View full price breakdown" ariaLabel="View full price breakdown" />
              </div>

              {/* Products Table */}
              <div className={classNames.productGrid}>
                <DetailsList
                  items={PRODUCT_ITEMS}
                  columns={COLUMNS}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.justified}
                  onRenderItemColumn={onRenderItemColumn}
                  styles={{
                    root: { overflow: 'visible' },
                  }}
                />
              </div>

              {/* Totals */}
              <div className={classNames.totalBar}>
                <Stack horizontalAlign="end" tokens={{ childrenGap: 4 }}>
                  <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="baseline">
                    <Text className={classNames.totalLabel}>Total (USD):</Text>
                    <Text className={classNames.totalAmount}>550,704.04</Text>
                  </Stack>
                  <Text className={classNames.priceRefresh}>Price refreshed 5 hours ago</Text>
                </Stack>
              </div>
            </div>

            {/* ===== Right Side Info Panel ===== */}
            <div className={classNames.sidePanel}>
              <Text className={classNames.sidePanelTitle} block>Hidden Spaces Inc</Text>
              <div className={classNames.sidePanelAddress}>
                555 Northwest Ave<br />
                Big City, WA, 98055<br />
                United States
              </div>
              <FluentLink>View customer</FluentLink>

              <div className={classNames.sidePanelSection}>
                <div className={classNames.sidePanelSectionTitle}>
                  Credit line and deal value
                  <Icon iconName="Info" styles={{ root: { fontSize: 12, color: theme.semanticColors.bodySubtext } }} />
                </div>
                <div className={classNames.creditRow}>
                  <span>Customer credit line:</span>
                  <span>75,000 USD</span>
                </div>
                <div className={classNames.creditRow}>
                  <span>Estimated deal value:</span>
                  <span>3,000,000 USD</span>
                </div>
                <FluentLink>View deal totality</FluentLink>
              </div>

              <div className={classNames.approvalsSection}>
                <div className={classNames.sidePanelSectionTitle}>Approvals</div>
                <div className={classNames.approvalTag}>Finance (Level 2)</div>
                <div className={classNames.approvalTag}>FieldSales (Blue)</div>
                <FluentLink styles={{ root: { marginTop: 4, display: 'block' } }}>View approval details</FluentLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Proposal Panel */}
      <SubmitProposalPanel
        isOpen={isPanelOpen}
        onDismiss={() => setIsPanelOpen(false)}
        onSubmit={(approver) => {
          setSubmittedApprover(approver);
          setIsPanelOpen(false);
        }}
        onBack={() => setIsPanelOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/docs" element={<ComponentDocs />} />
    </Routes>
  );
};

export default App;
