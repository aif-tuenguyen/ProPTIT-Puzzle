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
import { formatter } from 'src/utils';
import { useEffect, useState } from 'react';
import orderServices from 'src/services/orderServices';

const ArrowUpwardWrapper = styled(ArrowUpwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.success.main};
`
);
function GrossSales() {
  const [gross, setGross] = useState(0);

  const getGross = async () => {
    const response = await orderServices.getGrossSale();
    if (response.status === 200) {
      setGross(response.data);
    }
  };

  useEffect(() => {
    getGross();
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
            title={'Đây là doanh thu bạn kiếm được'}
          >
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={'Tổng doanh thu'}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{formatter.format(gross)}</Typography>
      </CardContent>
    </Card>
  );
}

export default GrossSales;
