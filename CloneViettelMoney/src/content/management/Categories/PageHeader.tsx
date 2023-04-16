import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function PageHeader() {
  const location = useLocation();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Danh mục
        </Typography>
        <Typography variant="subtitle2">
          Quản lý các danh mục của cửa hàng
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{
            mt: { xs: 2, sm: 0 }
          }}
          component={RouterLink}
          to={`/${location.pathname.split('/')[1]}/categories/create`}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Thêm danh mục mới
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
