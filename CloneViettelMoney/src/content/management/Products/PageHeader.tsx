import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
  const location = useLocation();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {'Sản phẩm'}
        </Typography>
        <Typography variant="subtitle2">
          {'Quản lý các thông tin về sản phẩm'}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{
            mt: { xs: 2, sm: 0 }
          }}
          component={RouterLink}
          to={`/${location.pathname.split('/')[1]}/products/create`}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          {'Tạo mới sản phẩm'}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
