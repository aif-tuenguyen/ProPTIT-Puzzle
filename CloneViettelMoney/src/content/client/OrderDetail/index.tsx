import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React from 'react';
import Label from 'src/components/Label';
import { PaymentMethod, PaymentStatus } from 'src/models/order';
import {
  formatter,
  getLabelStatusOrder,
  getLabelStatusPayment,
  getLabelStatusShipment
} from 'src/utils';

const CardClient = styled(Card)(
  ({ theme }) => `
      margin-top: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(1)};
      padding: ${theme.spacing(2)}
    `
);

const BoxWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    background: ${theme.colors.alpha.black[5]};
  `
);

const TableWrapper = styled(Box)(
  ({ theme }) => `
    border: 1px solid ${theme.colors.alpha.black[10]};
    overflow-x: auto;
    margin-bottom: ${theme.spacing(2)};
    margin-left: ${theme.spacing(3)};
  `
);

interface IOrderDetailProps {
  orderDetail: any;
  setOrderDone: any;
  setTotalSalePrice: any;
  setFeeShipment: any;
  setPath: any;
  getShopDetail: any;
}

const OrderDetail: React.FC<IOrderDetailProps> = ({
  orderDetail,
  setOrderDone,
  setFeeShipment,
  setTotalSalePrice,
  setPath,
  getShopDetail
}) => {
  return (
    <CardClient>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3" gutterBottom>
            Đơn hàng
          </Typography>
          <Typography variant="h6" color="text.secondary">
            #{orderDetail?.id}
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{
          my: 2
        }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {'Trạng thái đơn hàng'}:
          </Typography>
          <Label
            color={getLabelStatusOrder(orderDetail?.orderStatus).color as any}
          >
            {getLabelStatusOrder(orderDetail?.orderStatus).label}
          </Label>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {'Trạng thái thanh toán'}:
          </Typography>
          <Label
            color={
              getLabelStatusPayment(orderDetail?.paymentStatus).color as any
            }
          >
            {getLabelStatusPayment(orderDetail?.paymentStatus).label}
          </Label>
          {orderDetail?.paymentMethod !== PaymentMethod.CASH &&
            orderDetail?.paymentStatus === PaymentStatus.UNPAID && (
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => {
                  getShopDetail(orderDetail?.shopId);
                  setPath('payment');
                  setOrderDone(orderDetail);
                  setFeeShipment(orderDetail?.shipmentPrice);
                  setTotalSalePrice(orderDetail?.totalSalePrice);
                }}
              >
                Hoàn thành thanh toán
              </Button>
            )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {'Trạng thái vận chuyển'}:
          </Typography>
          <Label
            color={
              getLabelStatusShipment(orderDetail?.shipmentStatus).color as any
            }
          >
            {getLabelStatusShipment(orderDetail?.shipmentStatus).label}
          </Label>
        </Grid>
      </Grid>
      <Divider
        sx={{
          my: 2
        }}
      />
      <Grid container spacing={3}>
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
                {new Date(orderDetail?.createdAt).toLocaleString('vi')}
              </Typography>
            </Grid>
          </Grid>
          <BoxWrapper textAlign="right" mt={1} p={3}>
            <Typography component="span" variant="h4" fontWeight="normal">
              {'Chi phí vận chuyển'}:{' '}
            </Typography>
            <Typography component="span" variant="h4">
              {formatter.format(orderDetail?.shipmentPrice)}
            </Typography>
          </BoxWrapper>
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
                {orderDetail?.products.map((item: any) => (
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
            </Table>
          </TableContainer>
        </TableWrapper>
      </Grid>
      <Box alignContent="flex-end">
        <Typography
          gutterBottom
          variant="caption"
          color="text.secondary"
          fontWeight="bold"
        >
          {'Total'}:
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {formatter.format(orderDetail?.paymentTotal)}
        </Typography>
      </Box>
    </CardClient>
  );
};

export default OrderDetail;
