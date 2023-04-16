import { Box, Card, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import Label from 'src/components/Label';
import {
  getLabelStatusOrder,
  getLabelStatusPayment,
  getLabelStatusShipment
} from 'src/utils';

const ImgWrapper = styled('img')(
  ({ theme }) => `
            width: 100%;
            object-fit: cover;
            border-radius: 10px;
      `
);

const CardClient = styled(Card)(
  ({ theme }) => `
        margin-top: ${theme.spacing(1)};
        margin-bottom: ${theme.spacing(1)};
        padding: ${theme.spacing(1)}
      `
);

interface IOrderItemProps {
  orderDetail: any;
  setPath: any;
}

const OrderItem: React.FC<IOrderItemProps> = ({ orderDetail, setPath }) => {
  return (
    <CardClient>
      {orderDetail?.products?.map((product, index) => {
        return (
          <Grid
            container
            spacing={1}
            key={index}
            onClick={() => setPath(`orderDetail/${orderDetail?.id}`)}
          >
            <Grid item xs={3}>
              <ImgWrapper src={product?.product?.images[0]} />
            </Grid>
            <Grid item xs={9}>
              <Box>
                <Typography mb={1}>{product?.product?.name}</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography fontWeight="bold">
                    {product?.product?.salePrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}
                  </Typography>
                  <Typography fontWeight="bold">
                    Qty: {product.quantity}
                  </Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Typography>
                    Tổng cộng:{' '}
                    <strong>
                      {(
                        product?.product?.salePrice * product.quantity
                      ).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </strong>
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {'Trạng thái đơn hàng'}:
                  </Typography>
                  <Label
                    color={
                      getLabelStatusOrder(orderDetail?.orderStatus).color as any
                    }
                  >
                    {getLabelStatusOrder(orderDetail?.orderStatus).label}
                  </Label>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    {'Trạng thái thanh toán'}:
                  </Typography>
                  <Label
                    color={
                      getLabelStatusPayment(orderDetail?.paymentStatus)
                        .color as any
                    }
                  >
                    {getLabelStatusPayment(orderDetail?.paymentStatus).label}
                  </Label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </CardClient>
  );
};

export default OrderItem;
