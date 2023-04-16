import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import HelpOutlineTwoToneIcon from '@mui/icons-material/HelpOutlineTwoTone';
import { useEffect, useState } from 'react';
import customerServices from 'src/services/customerServices';

function Customers() {
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);

  const getNumberOfCustomers = async () => {
    const response = await customerServices.getCustomers({});
    if (response.status === 200) {
      setNumberOfCustomers(response.data.data.length);
    }
  };

  useEffect(() => {
    getNumberOfCustomers();
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
            title={'Đây là số khách hàng đã tham gia mua hàng'}
          >
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={'Khách hàng'}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{numberOfCustomers}</Typography>
      </CardContent>
    </Card>
  );
}

export default Customers;
