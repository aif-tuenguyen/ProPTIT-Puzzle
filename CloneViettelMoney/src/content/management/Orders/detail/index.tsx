import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import InvoiceBody from './OrderBody';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus
} from 'src/models/order';
import orderServices from 'src/services/orderServices';
import { ArrowBackTwoTone, Edit } from '@mui/icons-material';
import ghnServicers from 'src/services/ghnServicers';
import {
  getLabelStatusOrder,
  getLabelStatusPayment,
  getLabelStatusShipment
} from 'src/utils';
import useNotify from 'src/hooks/useNotify';
import facebookServices from 'src/services/facebookServices';

function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState<Order>();
  const [isSave, setIsSave] = useState(false);
  const [isEditOrder, setIsEditOrder] = useState(false);
  const { orderId } = useParams();

  const { notify } = useNotify();

  const navigate = useNavigate();
  const location = useLocation();

  const cancelCreateOrder = () => {
    setIsEditOrder(false);
  };

  const getOrderDetail = async (id: string) => {
    try {
      const response = await orderServices.getDetailOrder(id);
      if (response.status === 200) {
        const order = response.data;
        setOrderDetail(order);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId);
    }
  }, [orderId]);

  const handleBack = (): void => {
    return navigate(`/${location.pathname.split('/')[1]}/orders`);
  };

  const [status, setStatus] = useState({
    orderStatus: OrderStatus.OPEN,
    paymentStatus: PaymentStatus.UNPAID,
    shipmentStatus: DeliveryStatus.UNFULFILLED
  });

  useEffect(() => {
    if (orderDetail) {
      setStatus((status) => {
        return {
          ...status,
          ...orderDetail
        };
      });
    }
  }, [orderDetail]);

  const handleStatusChange = (e: any): void => {
    const { name, value } = e.target;

    setStatus((status) => {
      return {
        ...status,
        [name]: value
      };
    });
  };

  const updateOrderStatus = async () => {
    setIsSave(true);
    const response = await orderServices.updateOrderStatus(
      orderDetail?.id,
      status
    );

    if (response.status === 200) {
      notify('Cập nhật trạng thái đơn hàng thành công', {
        variant: 'success'
      });
      cancelCreateOrder();

      await facebookServices.sendMessage({
        senderId: orderDetail?.customerDetail?.facebookUserId,
        message: `Trạng thái đơn hàng đã thay đổi, vui lòng xem chi tiết!`,
        orderId: orderDetail?.id
      });
    }
    setIsSave(false);
  };

  if (!orderDetail) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Chi tiết đơn hàng</title>
      </Helmet>
      <PageTitleWrapper>
        <Container maxWidth="lg">
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Tooltip arrow placement="top" title={'Trở lại'}>
                  <IconButton
                    onClick={handleBack}
                    color="primary"
                    sx={{
                      p: 2,
                      mr: 2
                    }}
                  >
                    <ArrowBackTwoTone />
                  </IconButton>
                </Tooltip>
                <Box>
                  <Typography variant="h3" component="h3" gutterBottom>
                    Chi tiết đơn hàng
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 },
                  ml: 2
                }}
                variant="contained"
                startIcon={<Edit />}
                color="primary"
                onClick={() => setIsEditOrder(true)}
              >
                Sửa
              </Button>
            </Grid>
          </Grid>
        </Container>
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <InvoiceBody order={orderDetail} status={status} />
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={isEditOrder}
        onClose={cancelCreateOrder}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Chỉnh sửa đơn hàng
          </Typography>
          <Typography variant="subtitle2">
            Chỉnh sửa các trạng thái của đơn hàng
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="orderStatus">Trạng thái đơn hàng</InputLabel>
                <Select
                  labelId="orderStatus"
                  value={status?.orderStatus}
                  onChange={handleStatusChange}
                  name="orderStatus"
                  label="Trạng thái đơn hàng"
                >
                  {Object.values(OrderStatus).map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {getLabelStatusOrder(statusOption).label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="payment">Trạng thái thanh toán</InputLabel>
                <Select
                  labelId="payment"
                  value={status?.paymentStatus}
                  name="paymentStatus"
                  onChange={handleStatusChange}
                  label="Trạng thái thanh toán"
                >
                  {Object.values(PaymentStatus).map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {getLabelStatusPayment(statusOption).label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="shipment">Trạng thái vận chuyển</InputLabel>
                <Select
                  labelId="shipment"
                  value={status?.shipmentStatus}
                  name="shipmentStatus"
                  onChange={handleStatusChange}
                  label="Trạng thái vận chuyển"
                >
                  {Object.values(DeliveryStatus).map((statusOption) => (
                    <MenuItem key={statusOption} value={statusOption}>
                      {getLabelStatusShipment(statusOption).label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3
          }}
        >
          <Button color="secondary" onClick={cancelCreateOrder}>
            Hủy
          </Button>
          <Button
            type="submit"
            startIcon={isSave ? <CircularProgress size="1rem" /> : null}
            variant="contained"
            onClick={updateOrderStatus}
            disabled={isSave}
          >
            Cập nhật trạng thái
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default OrderDetail;
