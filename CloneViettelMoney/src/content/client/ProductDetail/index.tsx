import { Box, Card, styled, Typography } from '@mui/material';
import React from 'react';
import { Product } from 'src/models/product';
import { formatter } from 'src/utils';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const CardClient = styled(Card)(
  ({ theme }) => `
      margin-top: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(1)};
    `
);

const ImgProductDetail = styled('img')(
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
        font-size: 18px;
    `
);

const OriginText = styled(Typography)(
  ({ theme }) => `
      text-decoration: line-through;
      font-size: 12px;
      margin-left: ${theme.spacing(1)};
      color: #747474;
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

interface IProductDetailProps {
  productDetail: Product;
}

const ProductDetail: React.FC<IProductDetailProps> = ({ productDetail }) => {
  const checkDiscount =
    productDetail && productDetail?.salePrice < productDetail?.price;
  const caculateDiscount =
    productDetail &&
    ((productDetail.price - productDetail?.salePrice) * 100) /
      productDetail.price;

  return (
    <CardClient>
      <Swiper
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {productDetail?.images?.map((image, index) => (
          <SwiperSlide key={index}>
            <ImgProductDetail src={image} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Box p={2}>
        <Typography>{productDetail?.name}</Typography>
        <Box display="flex" alignItems="center" my={2}>
          <PriceText discount>
            {formatter.format(productDetail?.salePrice)}
          </PriceText>
          {checkDiscount && (
            <OriginText>{formatter.format(productDetail?.price)}</OriginText>
          )}

          {checkDiscount && (
            <BoxDiscount>-{Math.round(caculateDiscount)}%</BoxDiscount>
          )}
        </Box>
        <Box>
          <Typography fontWeight="bold">Mo ta san pham</Typography>
          <Box
            dangerouslySetInnerHTML={{
              __html: productDetail?.description
            }}
          ></Box>
        </Box>
      </Box>
    </CardClient>
  );
};

export default ProductDetail;
