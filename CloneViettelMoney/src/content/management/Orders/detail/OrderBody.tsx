import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TableContainer,
  styled
} from '@mui/material';
import {
  formatter,
  getLabelStatusOrder,
  getLabelStatusPayment,
  getLabelStatusShipment
} from 'src/utils';
import shopServices from 'src/services/shopServices';
import { Shop } from 'src/models/shop';
import ghnServicers from 'src/services/ghnServicers';
import Label from 'src/components/Label';

const BoxWrapper = styled(Box)(
  ({ theme }) => `
  border-radius: ${theme.general.borderRadius};
  background: ${theme.colors.alpha.black[5]};
`
);

const TableWrapper = styled(Box)(
  ({ theme }) => `
  border: 1px solid ${theme.colors.alpha.black[10]};
  border-bottom: 0;
  margin: ${theme.spacing(4)} 0;
`
);

const ImgWrapper = styled('img')(
  ({ theme }) => `
    width: 52px;
    object-fit: cover;
    border-radius: 10px;
    `
);

interface InvoiceBodyProps {
  order: any;
  status: any;
}

const InvoiceBody: FC<InvoiceBodyProps> = ({ order, status }) => {
  const shopId = localStorage.getItem('shopId');

  const [shopDetail, setShopDetail] = useState<Shop>();

  const getShopDetail = async (shopId: string) => {
    try {
      const response = await shopServices.getDetailShopClient(shopId);
      if (response.status === 200) {
        const shopDetail = response.data;
        setShopDetail(shopDetail);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (shopId) {
      getShopDetail(shopId);
    }
  }, [shopId]);

  return (
    <Container maxWidth="lg">
      <Card
        sx={{
          p: 3,
          mb: 3
        }}
      >
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h1" gutterBottom>
              Đơn hàng
            </Typography>
            <Typography variant="h3" color="text.secondary">
              #{order?.id}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <ImgWrapper src={shopDetail?.shopImage} />
            <Typography
              sx={{
                py: 2
              }}
              variant="h4"
            >
              {shopDetail?.shopName}
            </Typography>
            <Typography variant="h5" gutterBottom fontWeight="normal">
              {shopDetail?.districtName}
            </Typography>
            <Typography variant="h5" fontWeight="normal">
              {shopDetail?.provinceName}
            </Typography>
          </Box>
        </Box>
        <Divider
          sx={{
            my: 4
          }}
        />
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" gutterBottom>
              {'Trạng thái đơn hàng'}:
            </Typography>
            <Label
              color={getLabelStatusOrder(status?.orderStatus).color as any}
            >
              {getLabelStatusOrder(status?.orderStatus).label}
            </Label>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" gutterBottom>
              {'Trạng thái thanh toán'}:
            </Typography>
            <Label
              color={getLabelStatusPayment(status?.paymentStatus).color as any}
            >
              {getLabelStatusPayment(status?.paymentStatus).label}
            </Label>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle2" gutterBottom>
              {'Trạng thái vận chuyển'}:
            </Typography>
            <Label
              color={
                getLabelStatusShipment(status?.shipmentStatus).color as any
              }
            >
              {getLabelStatusShipment(status?.shipmentStatus).label}
            </Label>
          </Grid>
        </Grid>
        <Divider
          sx={{
            my: 4
          }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              {'Người mua'}:
            </Typography>
            <Typography
              sx={{
                pb: 2
              }}
              variant="h5"
            >
              {order?.customerDetail.name}
            </Typography>
            <Typography variant="h5" fontWeight="normal">
              {order?.customerDetail?.detailAddress +
                ', ' +
                order?.customerDetail?.wardName}
            </Typography>
            <Typography variant="h5" gutterBottom fontWeight="normal">
              {order?.customerDetail?.districtName}
            </Typography>
            <Typography variant="h5" fontWeight="normal">
              {order?.customerDetail?.provinceName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={4}
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
            >
              <Grid item>
                <Typography variant="subtitle2" gutterBottom>
                  {'Ngày đặt hàng'}:
                </Typography>
                <Typography
                  sx={{
                    pb: 2
                  }}
                  variant="h5"
                >
                  {new Date(order?.createdAt).toLocaleString('vi')}
                </Typography>
              </Grid>
            </Grid>
            <BoxWrapper textAlign="right" mt={1} p={3}>
              <Typography component="span" variant="h4" fontWeight="normal">
                {'Chi phí vận chuyển'}:{' '}
              </Typography>
              <Typography component="span" variant="h4">
                {formatter.format(order?.shipmentPrice)}
              </Typography>
            </BoxWrapper>
          </Grid>
        </Grid>

        <TableWrapper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{'Item'}</TableCell>
                  <TableCell>{'Qty'}</TableCell>
                  <TableCell>{'Price'}</TableCell>
                  <TableCell>{'Total'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order?.products.map((item: any) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <Typography noWrap>{item.product.name}</Typography>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {formatter.format(item.product.salePrice)}
                    </TableCell>
                    <TableCell>
                      {formatter.format(item.product.salePrice * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={0} />
                  <TableCell colSpan={4} align="right">
                    <Typography
                      gutterBottom
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {'Total'}:
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {formatter.format(order?.paymentTotal)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </TableWrapper>
      </Card>
    </Container>
  );
};

export default InvoiceBody;
