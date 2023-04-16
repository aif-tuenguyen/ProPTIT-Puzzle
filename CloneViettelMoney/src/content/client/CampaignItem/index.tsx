import { Box, Grid, styled, Typography } from '@mui/material';
import { Campaign } from 'src/models/campaign';

const ImgWrapper = styled('img')(
  ({ theme }) => `
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
      `
);

interface ICampaignItemProps {
  campaign: Campaign;
  setPath: (path: string) => void;
}

const CampaignItem: React.FC<ICampaignItemProps> = ({ campaign, setPath }) => {
  return (
    <Grid
      item
      xs={12}
      sx={{ cursor: 'pointer' }}
      onClick={() => {
        setPath(`campaignDetail/${campaign?.id}`);
      }}
    >
      <ImgWrapper src={campaign.image} />
      <Typography mb={1}>{campaign?.name}</Typography>
    </Grid>
  );
};

export default CampaignItem;
