import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import GrossSales from './GrossSales';
import Customers from './Customers';
import Orders from './Orders';
import VisitorsOverview from './VisitorsOverview';
import SalesByCategory from './SalesByCategory';
import Products from './Products';
import TopCampaign from './TopCampaign';

function DashboardCommerce() {
  return (
    <>
      <Helmet>
        <title>Social Commerce Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item lg={3} sm={6} xs={12}>
              <GrossSales />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Customers />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Orders />
            </Grid>
            <Grid item lg={3} sm={6} xs={12}>
              <Products />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={6} lg={7} xs={12}>
          <VisitorsOverview />
        </Grid>
        <Grid item md={6} lg={5} xs={12}>
          <TopCampaign />
        </Grid>
        <Grid item xs={12}>
          <SalesByCategory />
        </Grid>
      </Grid>
    </>
  );
}

export default DashboardCommerce;
