import { Box, Grid, styled, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from 'src/models/product';
import { formatter } from 'src/utils';

const ImgWrapper = styled('img')(
  ({ theme }) => `
          width: 100%;
          object-fit: cover;
          border-radius: 10px;
    `
);

interface PriceTextProps {
  discount?: boolean;
}

const PriceText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'discount'
})<PriceTextProps>(
  ({ discount, theme }) => `
        font-weight: bold;
        color: ${discount ? '#ff4242' : 'inherit'};
        font-size: 16px;
    `
);

const BoxDiscount = styled(Box)(
  ({ theme }) => `
        background-color: #ffd9d9;
        padding: 2px;
        font-size: 10px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: ${theme.spacing(1)};
        color: #ff4242;
        font-weight: bold;
    `
);

interface IProductItemProps {
  product: Product;
  setPath: (path: string) => void;
  campaignId?: string;
}

const ProductItem: React.FC<IProductItemProps> = ({
  product,
  setPath,
  campaignId
}) => {
  const checkDiscount = product.salePrice < product.price;
  const caculateDiscount =
    ((product.price - product.salePrice) * 100) / product.price;

  return (
    <Grid
      item
      xs={6}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        if (campaignId) {
          setPath(`productDetail/${product?.id}?campaignId=${campaignId}`);
        } else {
          setPath(`productDetail/${product?.id}`);
        }
      }}
    >
      <ImgWrapper src={product.images[0]} />
      <Typography mb={1}>{product?.name}</Typography>
      <Box display="flex">
        <PriceText discount>{formatter.format(product?.salePrice)}</PriceText>
        {checkDiscount && (
          <BoxDiscount>-{Math.round(caculateDiscount)}%</BoxDiscount>
        )}
      </Box>
    </Grid>
  );
};

export default ProductItem;
