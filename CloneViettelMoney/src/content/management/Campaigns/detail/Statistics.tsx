import { Comment, ThumbUp } from '@mui/icons-material';
import { Box, Card, Grid, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import Text from 'src/components/Text';
import { Campaign } from 'src/models/campaign';
import facebookServices from 'src/services/facebookServices';
import orderServices from 'src/services/orderServices';
import { formatter } from 'src/utils';

const DotInfo = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.info.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const DotPending = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.warning.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

interface IStatisticsProps {
  data: Campaign;
}

const Statistics: React.FC<IStatisticsProps> = ({ data }) => {
  const [detailPost, setDetailPost] = useState<any>();

  const [gross, setGross] = useState(0);

  const getDetailPost = async (postId: string) => {
    const response = await facebookServices.getDetailPost(postId);
    if (response.status === 200) {
      setDetailPost(response.data);
    }
  };

  const getGrossSaleCampaign = async (campaignId: string) => {
    const response = await orderServices.getGrossSaleCampaign(campaignId);
    if (response.status === 200) {
      setGross(response.data);
    }
  };

  useEffect(() => {
    if (data?.id) {
      getGrossSaleCampaign(data?.id);
    }
  }, [data?.id]);

  useEffect(() => {
    if (data?.postId) {
      getDetailPost(data?.postId);
    }
  }, [data?.postId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            height: '100%',
            px: 3,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2
              }}
            >
              <DotInfo />
              Doanh thu đạt được
            </Typography>
            <Typography variant="h3">{formatter.format(gross)}</Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            height: '100%',
            px: 3,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ThumbUp sx={{ mr: 1 }} color="primary" />
          <Typography variant="h3">
            {detailPost?.reactions?.data.length}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            height: '100%',
            px: 3,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Comment sx={{ mr: 1 }} />
          <Typography variant="h3">
            {detailPost?.comments?.data.length}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            height: '100%',
            px: 3,
            py: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2
              }}
            >
              <DotPending />
              {'Số sản phẩm'}
            </Typography>
            <Typography variant="h3">{data?.productIds?.length}</Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Statistics;
