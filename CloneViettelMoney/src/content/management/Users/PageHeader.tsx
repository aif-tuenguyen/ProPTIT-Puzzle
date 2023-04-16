import { Grid, Typography } from '@mui/material';

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {'Quản lý người dùng'}
        </Typography>
        <Typography variant="subtitle2">
          {'Danh sách chủ cửa hàng của cửa hàng và khách hàng'}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
