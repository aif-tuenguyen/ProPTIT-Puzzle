import { Grid, Typography } from '@mui/material';

function PageHeader() {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Quản lý đơn hàng
          </Typography>
          <Typography variant="subtitle2">
            Quản lý các đơn hàng của cửa hàng
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
