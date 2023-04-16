import {
  Button,
  Card,
  List,
  CardContent,
  CardHeader,
  ListItemAvatar,
  Link,
  Divider,
  ListItem,
  ListItemText,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Text from 'src/components/Text';
import campaignServices from 'src/services/campaignServices';

const AvatarCampaign = styled('img')(
  ({ theme }) => `
    width: 40px;
    height: 40px;
    border-radius: 100%;
    object-fit: cover;
`
);

function TopCampaign() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);

  const getCampaigns = async () => {
    const response = await campaignServices.getListCampaignsWithGross();
    if (response.status === 200) {
      setCampaigns(response.data);
    }
  };

  useEffect(() => {
    getCampaigns();
  }, []);

  return (
    <Card>
      <CardHeader
        action={
          <Button
            size="small"
            onClick={() => navigate('/management/campaigns')}
          >
            {'Xem các chiến dịch'}
          </Button>
        }
        title={'Top các chiến dịch'}
      />
      <Divider />
      <CardContent>
        <List disablePadding>
          {campaigns?.map((campaign, index) => (
            <>
              <ListItem disableGutters key={campaign?.id}>
                <ListItemAvatar>
                  <AvatarCampaign src={campaign?.image} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Text color="black">{campaign?.name}</Text>}
                  primaryTypographyProps={{
                    variant: 'body1',
                    color: 'textPrimary',
                    gutterBottom: true,
                    noWrap: true
                  }}
                />
              </ListItem>
              {index !== campaigns.length - 1 && (
                <Divider
                  sx={{
                    my: 1.5
                  }}
                />
              )}
            </>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default TopCampaign;
