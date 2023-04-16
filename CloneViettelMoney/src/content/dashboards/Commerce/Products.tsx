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
import ArrowDownwardTwoTone from '@mui/icons-material/ArrowDownwardTwoTone';
import { useEffect, useState } from 'react';
import productServices from 'src/services/productServices';

const ArrowDownwardWrapper = styled(ArrowDownwardTwoTone)(
  ({ theme }) => `
      color:  ${theme.palette.error.main};
`
);

function Products() {
  const [numberOfProducts, setNumberOfProducts] = useState(0);

  const getNumberOfProducts = async () => {
    const response = await productServices.getListProducts({});
    if (response.status === 200) {
      setNumberOfProducts(response.data.data.length);
    }
  };

  useEffect(() => {
    getNumberOfProducts();
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
            title={'Đây là số sản phẩm của cửa hàng của bạn'}
          >
            <IconButton size="small" color="secondary">
              <HelpOutlineTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        title={'Sản phẩm'}
      />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">{numberOfProducts}</Typography>
      </CardContent>
    </Card>
  );
}

export default Products;
