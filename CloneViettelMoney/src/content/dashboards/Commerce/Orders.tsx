import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone';
import Label from 'src/components/Label';
import ArrowUpwardTwoTone from '@mui/icons-material/ArrowUpwardTwoTone';
import { useEffect, useState } from 'react';
import orderServices from 'src/services/orderServices';

const ArrowUpwardWrapper = styled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
);
function Orders() {
  const [numberOfOrders, setNumberOfOrders] = useState(0);

  const getNumberOfOrders = async () => {
    const response = await orderServices.getListOrders({});
    if (response.status === 200) {
      setNumberOfOrders(response.data.data.length);
    }
  };

  useEffect(() => {
    getNumberOfOrders();
  }, []);

  return (
    <Card
      sx={{
        px: 1,
        pt: 1
      }}
    >
      <CardHeader
        sx={{
          pb: 0
        }}
        titleTypographyProps={{
          variant: 'subtitle2',
          fontWeight: 'bold',
          color: 'textSecondary'
        }}
        action={
          <Tooltip
            placement="top"
            arrow
            title={'Đây là số đơn hàng mà cửa hàng được nhận'}
          >
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={'Đơn hàng'}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{numberOfOrders}</Typography>
        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Label color="success">+10%</Label>
          <ArrowUpwardWrapper
            sx={{
              ml: 0.5,
              mr: -0.2
            }}
            fontSize="small"
          />
        </Box> */}
      </CardContent>
    </Card>
  );
}

export default Orders;
