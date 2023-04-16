import { FC, useState, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Divider,
  Tooltip,
  IconButton,
  Link,
  InputAdornment,
  TablePagination,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import type { Product } from 'src/models/product';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ColumnMyTable } from 'src/components/Table/type';
import MyTable from 'src/components/Table';
import DialogDelete from 'src/components/DialogDelete';
import useNotify from 'src/hooks/useNotify';
import { Edit } from '@mui/icons-material';
import categoryServices from 'src/services/categoryServices';

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`
);
interface ResultsProps {
  data: Product[];
  getCategories: any;
  page: number;
  limit: number;
  query: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setQuery: (query: string) => void;
  totalPages: number;
  total: number;
}

const Results: FC<ResultsProps> = ({
  data,
  getCategories,
  page,
  setPage,
  limit,
  setLimit,
  query,
  setQuery,
  totalPages,
  total
}) => {
  const [categoryDelete, setCategoryDelete] = useState<string>('');
  const theme = useTheme();
  const location = useLocation();

  const { notify } = useNotify();

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (id: string) => {
    setOpenConfirmDelete(true);
    setCategoryDelete(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setOpenConfirmDelete(false);

    const response = await categoryServices.deleteCategory(categoryDelete);
    if (response.status === 200) {
      notify('You successfully deleted category', {
        variant: 'success'
      });

      getCategories(page, limit, query);
    }
  };

  const cellCategoryName = (row: any) => {
    return (
      <Box display="flex" alignItems="center">
        <ImgWrapper src={row.image} />
        <Box
          pl={1}
          sx={{
            width: 250
          }}
        >
          <Link
            component={RouterLink}
            to={
              `/${location.pathname.split('/')[1]}/categories/detail/` + row.id
            }
            variant="h5"
          >
            {row.name}
          </Link>
          <Typography variant="subtitle2" noWrap>
            {row.description}
          </Typography>
        </Box>
      </Box>
    );
  };

  const cellAction = (row: any) => {
    return (
      <Typography noWrap>
        <Tooltip title={'Edit'} arrow>
          <IconButton
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/categories/edit/` + row.id}
            color="primary"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Delete'} arrow>
          <IconButton
            onClick={() => handleConfirmDelete(row.id)}
            color="primary"
          >
            <DeleteTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    );
  };

  const columns: ColumnMyTable[] = [
    {
      Header: 'Tên danh mục',
      accessor: 'name',
      Cell: cellCategoryName
    },
    {
      Header: 'Actions',
      Cell: cellAction,
      align: 'center'
    }
  ];

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          <Box
            flex={1}
            p={2}
            display={{ xs: 'block', md: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                mb: { xs: 2, md: 0 }
              }}
            >
              <TextField
                size="small"
                fullWidth={mobile}
                onChange={handleQueryChange}
                value={query}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                placeholder={'Tìm kiếm theo tên danh mục...'}
              />
            </Box>
            <TablePagination
              component="div"
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[10, 20, 30, 40, 50]}
            />
          </Box>
        </Box>
        <Divider />

        {data.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {'Chúng tôi không tìm thấy bất kì danh mục nào'}
          </Typography>
        ) : (
          <MyTable
            columns={columns}
            data={data}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            limit={limit}
            page={page}
            total={total}
          />
        )}
      </Card>
      <DialogDelete
        title="danh mục"
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

Results.propTypes = {
  data: PropTypes.array.isRequired
};

Results.defaultProps = {
  data: []
};

export default Results;
