import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigate } from 'react-router-dom';

function PageHeader() {
  const navigate = useNavigate();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Chiến dịch
          </Typography>
          <Typography variant="subtitle2">
            Các chiến dịch tiếp thị, quảng bá sản phẩm
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={() => navigate('/management/campaigns/create')}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Tạo mới chiến dịch
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
