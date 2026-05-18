// @ts-ignore
import { useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePermissionFetcher } from '../hooks/PermissionService';
import { useM8flowUriListForPermissions as useUriListForPermissions } from '../hooks/M8flowUriListForPermissions';
import { PermissionsToCheck } from '../interfaces';
import SpiffTooltip from './SpiffTooltip';

type OwnProps = {
  variant: string;
};

type ProcessInstanceTabConfig = {
  key: string;
  label: string;
  testId: string;
  title: string;
  route: string;
};

export default function ProcessInstanceListTabs({ variant }: OwnProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { targetUris } = useUriListForPermissions();
  const permissionRequestData: PermissionsToCheck = {
    [targetUris.processInstanceListPath]: ['GET'],
    [targetUris.processInstanceListForMePath]: ['POST'],
    [targetUris.m8flowTenantListPath]: ['GET'],
  };
  const { ability, permissionsLoaded } = usePermissionFetcher(
    permissionRequestData,
  );

  if (!permissionsLoaded) {
    return null;
  }

  const isSuperAdmin = ability.can('GET', targetUris.m8flowTenantListPath);
  const showForMe = !isSuperAdmin;
  const showAll =
    ability.can('GET', targetUris.processInstanceListPath) || isSuperAdmin;
  const showFindById =
    ability.can('POST', targetUris.processInstanceListForMePath) ||
    isSuperAdmin;

  useEffect(() => {
    if (isSuperAdmin && variant === 'for-me') {
      navigate('/process-instances/all', { replace: true });
    }
  }, [isSuperAdmin, navigate, variant]);

  const tabsToRender: ProcessInstanceTabConfig[] = [];
  if (showForMe) {
    tabsToRender.push({
      key: 'for-me',
      label: t('for_me'),
      testId: 'process-instance-list-for-me',
      title: t('tooltip_only_show_for_me'),
      route: '/process-instances/for-me',
    });
  }
  if (showAll) {
    tabsToRender.push({
      key: 'all',
      label: t('all'),
      testId: 'process-instance-list-all',
      title: t('tooltip_show_for_all'),
      route: '/process-instances/all',
    });
  }
  if (showFindById) {
    tabsToRender.push({
      key: 'find-by-id',
      label: t('find_by_id'),
      testId: 'process-instance-list-find-by-id',
      title: t('tooltip_search_by_id'),
      route: '/process-instances/find-by-id',
    });
  }

  const tabKeys = tabsToRender.map((tab) => tab.key);
  if (tabKeys.length === 0) {
    return null;
  }
  const selectedTab = tabKeys.includes(variant) ? variant : tabKeys[0];

  return (
    <Tabs value={selectedTab} aria-label={t('list_of_tabs')}>
      {tabsToRender.map((tabConfig) => (
        <SpiffTooltip key={tabConfig.key} title={tabConfig.title}>
          <Tab
            value={tabConfig.key}
            label={tabConfig.label}
            data-testid={tabConfig.testId}
            onClick={() => {
              navigate(tabConfig.route);
            }}
          />
        </SpiffTooltip>
      ))}
    </Tabs>
  );
}
