import { FC, ChangeEvent, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Link,
  TablePagination,
  TextField,
  Typography,
  styled,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { ColumnMyTable } from 'src/components/Table/type';
import { Link as RouterLink } from 'react-router-dom';
import MyTable from 'src/components/Table';
import DialogDelete from 'src/components/DialogDelete';
import { EditOutlined } from '@mui/icons-material';
import useNotify from 'src/hooks/useNotify';
import campaignServices from 'src/services/campaignServices';
import Label from 'src/components/Label';

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(3)};
      height: auto;
`
);
interface ResultsProps {
  campaigns: any[];
  getCampaigns: any;
  page: number;
  limit: number;
  query: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setQuery: (query: string) => void;
  status: string;
  setStatus: (status: string) => void;
  totalPages: number;
  total: number;
}

const Results: FC<ResultsProps> = ({
  campaigns,
  getCampaigns,
  page,
  setPage,
  limit,
  setLimit,
  query,
  setQuery,
  status,
  setStatus,
  totalPages,
  total
}) => {
  const [campaignDelete, setCampaignDelete] = useState<string>('');

  const { notify } = useNotify();

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleStatusChange = (e: any): void => {
    setStatus(e.target.value);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (id: string) => {
    setOpenConfirmDelete(true);
    setCampaignDelete(id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    setOpenConfirmDelete(false);

    const response = await campaignServices.deleteCampaign(campaignDelete);
    if (response.status === 200) {
      notify('Xóa chiến dịch thành công', {
        variant: 'success'
      });

      getCampaigns();
    }
  };

  const cellName = (row: any) => {
    return (
      <Box display="flex" alignItems="center">
        <ImgWrapper src={row.image} />
        <Box pl={1}>
          <Link
            component={RouterLink}
            to={
              `/${location.pathname.split('/')[1]}/campaigns/detail/` + row.id
            }
            variant="h5"
          >
            {row.name}
          </Link>
        </Box>
      </Box>
    );
  };

  const cellPostId = (row: any) => {
    return (
      <span>
        <Link href={`https://www.facebook.com/${row.postId}`} target="_blank">
          {row.postId}
        </Link>
      </span>
    );
  };

  const cellNumberOfProducts = (row: any) => {
    return <Typography noWrap>{row?.productIds?.length}</Typography>;
  };

  const cellStatus = (row: any) => {
    return (
      <Label color={row.status === 'ON' ? 'success' : 'secondary'}>
        <b>{row.status}</b>
      </Label>
    );
  };

  const cellAction = (row: any) => {
    return (
      <Typography noWrap>
        <Tooltip title={'Sửa'} arrow>
          <IconButton
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/campaigns/edit/` + row.id}
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
      Header: 'Tên chiến dịch',
      accessor: 'name',
      Cell: cellName
    },
    {
      Header: 'Post ID',
      accessor: 'postId',
      Cell: cellPostId
    },
    {
      Header: 'Số sản phẩm',
      accessor: '',
      Cell: cellNumberOfProducts,
      align: 'center'
    },
    {
      Header: 'Trạng thái',
      accessor: 'status',
      Cell: cellStatus,
      align: 'center'
    },
    {
      Header: 'Actions',
      Cell: cellAction
    }
  ];

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              sx={{
                m: 0
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder={'Tìm kiếm tên chiến dịch...'}
              value={query}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <Select value={status} onChange={handleStatusChange} displayEmpty>
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem key="ON" value="ON">
                  ON
                </MenuItem>
                <MenuItem key="OFF" value="OFF">
                  OFF
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              {'Đang hiển thị'}:
            </Typography>{' '}
            <b>{campaigns.length}</b> <b>{'chiến dịch'}</b>
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
        <Divider />

        {campaigns.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {'Chúng tôi không tìm thấy bất kì chiến dịch nào'}
            </Typography>
          </>
        ) : (
          <MyTable
            columns={columns}
            data={campaigns}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            limit={limit}
            page={page}
            total={total}
          />
        )}
      </Card>

      <DialogDelete
        title="chiến dịch"
        closeConfirmDelete={closeConfirmDelete}
        openConfirmDelete={openConfirmDelete}
        handleDeleteCompleted={handleDeleteCompleted}
      />
    </>
  );
};

Results.defaultProps = {
  campaigns: []
};

export default Results;
