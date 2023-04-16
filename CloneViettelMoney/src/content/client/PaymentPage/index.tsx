import { Box, Card, styled } from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import useNotify from 'src/hooks/useNotify';
import { PaymentStatus } from 'src/models/order';
import orderServices from 'src/services/orderServices';

interface IPaymentPageProps {
  paypalClientId: string;
  total: number;
  order?: any;
  setPath: any;
  setMenu: any;
}

const CardClient = styled(Card)(
  ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1)};
  `
);

const PaymentPage: React.FC<IPaymentPageProps> = ({
  paypalClientId,
  total,
  order,
  setPath,
  setMenu
}) => {
  const { notify } = useNotify();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: `${order?.id}`,
            amount: {
              currency_code: 'USD',
              value: Math.round(total / 23075)
            }
          }
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const updatePaymentStatus = async (paymentStatus: PaymentStatus) => {
    const response = await orderServices.updateOrderStatusClient(order?.id, {
      paymentStatus
    });

    if (response.status === 200) {
      notify('Thanh toán thành công', {
        variant: 'success'
      });

      setPath('orders');
      setMenu('orders');
    }
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      console.log(details);
      updatePaymentStatus(PaymentStatus.PAID);
    });
  };

  const onError = (error: any) => {
    notify(error, {
      variant: 'error'
    });
  };
  return (
    <PayPalScriptProvider options={{ 'client-id': paypalClientId }}>
      <Box>
        <CardClient>
          <Box p={2}>
            <PayPalButtons
              style={{
                layout: 'vertical'
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </Box>
        </CardClient>
      </Box>
    </PayPalScriptProvider>
  );
};

export default PaymentPage;
