import React, {useState, useCallback} from 'react';
import {useQuery, useQueryClient} from 'react-query';

import {alpha} from '@mui/material/styles';
import {
  Tab,
  Card,
  Tabs,
  Table,
  Button,
  Tooltip,
  Container,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';
import {RouterLink} from 'src/routes/components';

import {useBoolean} from 'src/hooks/use-boolean';

import {fetchRoles, fetchCandidates, USER_STATUS_OPTIONS, transformApiDataToUserItems} from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {useSnackbar} from 'src/components/snackbar';
import {ConfirmDialog} from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import {IUserItem, IUserTableFilters, IUserTableFilterValue} from 'src/types/user';

import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status', width: 180 },
  { id: 'fee', label: 'Fee', width: 100 },
  { id: 'gdpr', label: 'GDPR', width: 100 },
  { id: 'trello', label: 'Trello', width: 100 },
  { id: 'linkedin', label: 'LinkedIn', width: 100 },
  { id: 'actions', label: 'Actions', width: 100 }
];

const defaultFilters: IUserTableFilters = {
  name: '',
  role: [],
  status: 'all',
};

const normalizeText = (text: string): string => text
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase())
  .replace(/\s\w/g, (char) => char.toUpperCase());

const normalizeData = (data: (string | null)[]): string[] => {
  const normalizedSet = new Set<string>();
  data.forEach(item => {
    if (item) {
      normalizedSet.add(normalizeText(item));
    }
  });
  return Array.from(normalizedSet);
};

export default function ProfileListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const queryClient = useQueryClient();

  const [roles, setRoles] = useState<string[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15); // Set default size to 15
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);

  // Fetch roles
  useQuery('roles', fetchRoles, {
    onSuccess: (data) => {
      const normalizedData = normalizeData(data);
      setRoles(normalizedData);
      setFilteredRoles(normalizedData); // Initialize filtered roles with all roles
    },
  });

  // Fetch candidates with filters, including search and pagination
  const { data: apiData, isLoading, isFetching } = useQuery(
    ['candidates', page, size, filters],
    () => fetchCandidates(page, size, filters.role, filters.name),
    {
      staleTime: 4 * 60 * 1000,
      cacheTime: 4 * 60 * 1000,
      onSuccess: (data) => {
        console.log('Filtered data fetched successfully:', data);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      },
    }
  );

  const tableData = apiData ? transformApiDataToUserItems(apiData.content) : [];

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const updatedData = tableData.filter((row) => row.id !== id);
      enqueueSnackbar('Delete success!');
      queryClient.setQueryData(['candidates', page, size], (oldData: any) => ({
        ...oldData,
        content: oldData.content.filter((row: IUserItem) => row.id !== id),
      }));
      table.onUpdatePageDeleteRow(updatedData.length);
    },
    [enqueueSnackbar, page, size, queryClient, tableData, table],
  );

  const handleDeleteRows = useCallback(() => {
    const updatedData = tableData.filter((row) => !table.selected.includes(row.id));
    enqueueSnackbar('Delete success!');
    queryClient.setQueryData(['candidates', page, size], (oldData: any) => ({
      ...oldData,
      content: oldData.content.filter((row: IUserItem) => !table.selected.includes(row.id)),
    }));
    table.onUpdatePageDeleteRows({
      totalRowsInPage: updatedData.length,
      totalRowsFiltered: updatedData.length,
    });
  }, [enqueueSnackbar, page, size, queryClient, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.profiles.edit(id));
    },
    [router],
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when page size changes
  };

  const denseHeight = table.dense ? 56 : 56 + 20;

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Profiles"
        links={[
          { name: 'Profiles', href: paths.dashboard.root },
          { name: 'Account', href: paths.dashboard.group.account },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.profiles.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Profile
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{ px: 2.5, boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}` }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={tab.value === 'all' || tab.value === filters.status ? 'filled' : 'soft'}
                  color={tab.value === 'active' ? 'success' : tab.value === 'pending' ? 'warning' : tab.value === 'banned' ? 'error' : 'default'}
                >
                  {tableData.filter((user) => user.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <UserTableToolbar filters={filters} onFilters={handleFilters} roleOptions={roles} />

        <UserTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={tableData.length}
          sx={{ p: 2.5, pt: 0 }}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id),
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id),
                  )
                }
              />
              <TableBody>
                {tableData.map((row) => (
                  <UserTableRow
                    key={row.id} // Ensure each UserTableRow has a unique key
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)} />
                <TableNoData notFound={!tableData.length && !isLoading && !isFetching} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalElements}
          page={page}
          dense={table.dense}
          rowsPerPage={size}
          onPageChange={handleChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]} // Allow user to select up to 50 rows per page
        />
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Container>
  );
}
