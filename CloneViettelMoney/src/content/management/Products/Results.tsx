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
import { Product } from 'src/models/product';
import Label from 'src/components/Label';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Text from 'src/components/Text';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { ColumnMyTable } from 'src/components/Table/type';
import MyTable from 'src/components/Table';
import DialogDelete from 'src/components/DialogDelete';
import productServices from 'src/services/productServices';
import useNotify from 'src/hooks/useNotify';
import { EditOutlined } from '@mui/icons-material';
import { formatter, getLabelStatus } from 'src/utils';

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`
);
interface ResultsProps {
  products: Product[];
  getProducts: any;
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
  products,
  getProducts,
  page,
  setPage,
  limit,
  setLimit,
  query,
  setQuery,
  totalPages,
  total
}) => {
  const [deleteItem, setDeleteItem] = useState<string>('');
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
    setDeleteItem(id);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setDeleteItem('');
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    const resDeleteProduct = await productServices.deleteProduct(deleteItem);
    if (resDeleteProduct.status === 200) {
      notify('Xóa sản phẩm thành công', {
        variant: 'success'
      });
      closeConfirmDelete();
      getProducts(page, limit, query);
    }
  };

  const cellProductName = (row: any) => {
    return (
      <Box display="flex" alignItems="center">
        <ImgWrapper src={row.images[0]} />
        <Box
          pl={1}
          sx={{
            width: 250
          }}
        >
          <Link
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/products/detail/` + row.id}
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

  const cellPrice = (row: any) => {
    return (
      <>
        <Typography
          sx={{
            textDecorationLine: row.salePrice !== 0 ? 'line-through' : ''
          }}
        >
          {formatter.format(row.price)}
        </Typography>
        {row.salePrice !== 0 && (
          <Typography>
            <Text color="error">{formatter.format(row.salePrice)}</Text>
          </Typography>
        )}
      </>
    );
  };

  const cellStock = (row: any) => {
    const { label, color } = getLabelStatus(row.status);

    return (
      <Label color={color as any}>
        <b>{label}</b>
      </Label>
    );
  };

  const cellAction = (row: any) => {
    return (
      <Typography noWrap>
        <Tooltip title={'Sửa'} arrow>
          <IconButton
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/products/edit/` + row.id}
            color="primary"
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Xóa'} arrow>
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
      Header: 'Tên sản phẩm',
      accessor: 'name',
      Cell: cellProductName
    },
    {
      Header: 'Giá',
      accessor: 'price',
      Cell: cellPrice
    },
    {
      Header: 'Trạng thái',
      accessor: '',
      Cell: cellStock
    },
    {
      Header: 'Actions',
      Cell: cellAction
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
                placeholder={'Tìm theo tên sản phẩm...'}
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

        {products.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {'Chúng tôi không tìm thấy bất kì sản phẩm nào'}
          </Typography>
        ) : (
          <MyTable
            columns={columns}
            data={products}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            limit={limit}
            page={page}
            total={total}
          />
        )}
      </Card>
      <DialogDelete
        title="sản phẩm"
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

Results.propTypes = {
  products: PropTypes.array.isRequired
};

Results.defaultProps = {
  products: []
};

export default Results;
