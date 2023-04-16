import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  MenuItem,
  TablePagination,
  TextField,
  Typography,
  FormControl,
  Select,
  InputLabel,
  InputAdornment,
  Link
} from '@mui/material';
import { Order, OrderStatus } from 'src/models/order';
import Label from 'src/components/Label';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { formatter, getLabelStatusOrder } from 'src/utils';
import useNotify from 'src/hooks/useNotify';
import { ColumnMyTable } from 'src/components/Table/type';
import { Edit, OpenInNew } from '@mui/icons-material';
import MyTable from 'src/components/Table';
import DialogDelete from 'src/components/DialogDelete';
import orderServices from 'src/services/orderServices';
import Text from 'src/components/Text';

interface ResultsProps {
  orders: Order[];
  getOrders: any;
  page: number;
  limit: number;
  query: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setQuery: (query: string) => void;
  totalPages: number;
  total: number;
  status: string;
  setStatus: (status: string) => void;
}

const Results: FC<ResultsProps> = ({
  orders,
  getOrders,
  page,
  setPage,
  limit,
  setLimit,
  query,
  setQuery,
  totalPages,
  total,
  status,
  setStatus
}) => {
  const location = useLocation();
  const [orderDelete, setOrderDelete] = useState<string>('');

  const { notify } = useNotify();

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleStatusChange = (e: any): void => {
    setStatus(e.target.value);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (id: string) => {
    setOpenConfirmDelete(true);
    setOrderDelete(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    try {
      const resDeleteOrder = await orderServices.deleteOrder(orderDelete);
      if (resDeleteOrder.status === 200) {
        notify('Xóa đơn hàng thành công', {
          variant: 'success'
        });
        getOrders(page, limit, status, query);
      }
    } catch (error) {
      notify('Xóa đơn hàng không thành công', {
        variant: 'error'
      });
    }
    closeConfirmDelete();
  };

  const cellDate = (row: any) => {
    return (
      <Typography>{new Date(row.createdAt).toLocaleString('vi')}</Typography>
    );
  };

  const cellCustomer = (row: any) => {
    return (
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            mr: 1
          }}
          src={
            'https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png'
          }
        />
        <Box>
          <Link variant="h5" component={RouterLink} to={`/management/users`}>
            {row.customerDetail.name}
          </Link>
        </Box>
      </Box>
    );
  };

  const cellStatus = (row: any) => {
    const { label, color } = getLabelStatusOrder(row.orderStatus);

    return (
      <Label color={color as any}>
        <b>{label}</b>
      </Label>
    );
  };

  const cellPrice = (row: any) => {
    return (
      <>
        <Typography
          sx={{
            textDecorationLine: row.totalSalePrice !== 0 ? 'line-through' : ''
          }}
        >
          {formatter.format(row.totalPrice)}
        </Typography>
        {row.totalSalePrice !== 0 && (
          <Typography>
            <Text color="error">{formatter.format(row.totalSalePrice)}</Text>
          </Typography>
        )}
      </>
    );
  };

  const cellAction = (row: any) => {
    return (
      <Typography noWrap>
        <Tooltip title={'Xem'} arrow>
          <IconButton
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/orders/` + row.id}
            color="primary"
          >
            <OpenInNew fontSize="small" />
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
      Header: 'Ngày đặt hàng',
      accessor: 'createdAt',
      Cell: cellDate
    },
    {
      Header: 'Khách hàng',
      accessor: '',
      Cell: cellCustomer
    },
    {
      Header: 'Tổng tiền',
      accessor: 'totalSalePrice',
      Cell: cellPrice
    },
    {
      Header: 'Trạng thái',
      accessor: 'orderStatus',
      Cell: cellStatus
    },
    {
      Header: 'Actions',
      Cell: cellAction,
      align: 'center'
    }
  ];

  return (
    <>
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid alignItems="center" container spacing={3}>
          {/* <Grid item xs={12} lg={7} md={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                m: 0
              }}
              onChange={handleQueryChange}
              placeholder={'Khách hàng...'}
              value={query}
              fullWidth
              variant="outlined"
            />
          </Grid> */}
          <Grid item xs={12} lg={5} md={6}>
            <FormControl fullWidth variant="outlined">
              <Select value={status} onChange={handleStatusChange} displayEmpty>
                <MenuItem value="">Tất cả</MenuItem>
                {Object.values(OrderStatus).map((statusOption) => (
                  <MenuItem key={statusOption} value={statusOption}>
                    {getLabelStatusOrder(statusOption).label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>
      <Card>
        <Box pl={2} display="flex" alignItems="center">
          <Box
            flex={1}
            p={2}
            display={{ xs: 'block', sm: 'flex' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography component="span" variant="subtitle1">
                {'Tổng đơn hàng'}:
              </Typography>{' '}
              <b>{total}</b> <b>{'đơn hàng'}</b>
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

        {orders.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {'Chúng tôi không tìm thấy bất kì đơn hàng nào'}
          </Typography>
        ) : (
          <MyTable
            columns={columns}
            data={orders}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            limit={limit}
            page={page}
            total={total}
          />
        )}
      </Card>

      <DialogDelete
        title="đơn hàng"
        openConfirmDelete={openConfirmDelete}
        closeConfirmDelete={closeConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

Results.propTypes = {
  orders: PropTypes.array.isRequired
};

Results.defaultProps = {
  orders: []
};

export default Results;
