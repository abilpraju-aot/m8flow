import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MdDelete } from 'react-icons/md';
import PaginationForTable from '../components/PaginationForTable';
import HttpService from '../services/HttpService';
import { getPageInfoFromSearchParams } from '../helpers';
import { useM8flowUriListForPermissions as useUriListForPermissions } from '../hooks/M8flowUriListForPermissions';
import { PermissionsToCheck } from '../interfaces';
import { usePermissionFetcher } from '../hooks/PermissionService';

export default function SecretList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [secrets, setSecrets] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const { t } = useTranslation();

  const { targetUris } = useUriListForPermissions();
  const permissionRequestData: PermissionsToCheck = {
    [targetUris.secretListPath]: ['GET', 'POST', 'DELETE'],
    [targetUris.m8flowTenantListPath]: ['GET'],
  };
  const { ability, permissionsLoaded } = usePermissionFetcher(
    permissionRequestData,
  );

  const isSuperAdmin = ability.can('GET', targetUris.m8flowTenantListPath);
  const canAddSecret = ability.can('POST', targetUris.secretListPath);
  const canDeleteSecret = ability.can('DELETE', targetUris.secretListPath);

  useEffect(() => {
    const setSecretsFromResult = (result: any) => {
      setSecrets(result.results || []);
      setPagination(result.pagination || null);
    };

    if (!permissionsLoaded) {
      return;
    }

    if (!ability.can('GET', targetUris.secretListPath)) {
      navigate('/', { replace: true });
      return;
    }

    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    HttpService.makeCallToBackend({
      path: `/secrets?per_page=${perPage}&page=${page}`,
      successCallback: setSecretsFromResult,
    });
  }, [
    searchParams,
    permissionsLoaded,
    ability,
    navigate,
    targetUris.secretListPath,
  ]);

  const reloadSecrets = (_result: any) => {
    window.location.reload();
  };

  const handleDeleteSecret = (key: string) => {
    HttpService.makeCallToBackend({
      path: `/secrets/${key}`,
      successCallback: reloadSecrets,
      httpMethod: 'DELETE',
    });
  };

  const showDeleteActions = canDeleteSecret && !isSuperAdmin;
  const showAddSecretButton = canAddSecret && !isSuperAdmin;

  const buildTable = () => {
    const rows = secrets.map((row: any) => {
      return (
        <TableRow key={row.key}>
          <TableCell>
            <Link to={`/configuration/secrets/${row.key}`}>{row.id}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/configuration/secrets/${row.key}`}>{row.key}</Link>
          </TableCell>
          <TableCell>{row.username}</TableCell>
          {showDeleteActions && (
            <TableCell aria-label="Delete">
              <IconButton
                size="small"
                aria-label={t('delete')}
                data-testid={`secret-list-delete-${row.key}`}
                onClick={() => handleDeleteSecret(row.key)}
              >
                <MdDelete />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      );
    });
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('id')}</TableCell>
              <TableCell>{t('secret_key')}</TableCell>
              <TableCell>{t('creator')}</TableCell>
              {showDeleteActions && <TableCell>{t('delete')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const secretsDisplayArea = () => {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    if (secrets.length > 0) {
      return (
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
        />
      );
    }
    return <p>{t('no_secrets_to_display')}</p>;
  };

  if (!permissionsLoaded || !pagination) {
    return null;
  }

  return (
    <div>
      <Typography variant="h1">{t('secrets')}</Typography>
      {secretsDisplayArea()}
      {showAddSecretButton && (
        <Button
          component={Link}
          variant="contained"
          to="/configuration/secrets/new"
          data-testid="secret-list-add-button"
        >
          {t('add_a_secret')}
        </Button>
      )}
    </div>
  );
}
