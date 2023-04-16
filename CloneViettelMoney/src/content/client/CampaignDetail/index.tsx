import { Box, Card, Divider, Grid, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Campaign } from 'src/models/campaign';
import { Product } from 'src/models/product';
import productServices from 'src/services/productServices';
import ProductItem from '../ProductItem';

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
      `
);

interface ICampaignDetailProps {
  campaignDetail: Campaign;
  setPath: (path: string) => void;
}

const CampaignDetail: React.FC<ICampaignDetailProps> = ({
  campaignDetail,
  setPath
}) => {
  const [listProductCampaign, setListProductCampaign] = useState<Product[]>([]);

  const getListProductCampaign = async () => {
    const response = await Promise.all(
      campaignDetail?.productIds?.map(async (productId) => {
        const resDetail = await productServices.getDetailProductClient(
          productId
        );

        if (resDetail.status === 200) {
          return resDetail.data;
        }
      })
    );

    setListProductCampaign(response);
  };

  useEffect(() => {
    getListProductCampaign();
  }, [campaignDetail]);

  return (
    <Box>
      {campaignDetail ? (
        <CardClient>
          <ImgWrapper src={campaignDetail?.image} />
          <Typography fontSize="large" fontWeight="bold" p={2}>
            {campaignDetail?.name}
          </Typography>
          <Divider />
          <Grid container sx={{ flexGrow: 1, padding: 1 }} spacing={1}>
            {listProductCampaign.map((product) => (
              <ProductItem
                product={product}
                setPath={setPath}
                key={product.id}
                campaignId={campaignDetail?.id}
              />
            ))}
          </Grid>
        </CardClient>
      ) : (
        <CardClient>
          <Box p={4}>
            <Typography align="center">Chiến dịch không tồn tại</Typography>
          </Box>
        </CardClient>
      )}
    </Box>
  );
};

export default CampaignDetail;
