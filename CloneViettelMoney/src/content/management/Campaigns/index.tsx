import { useState, useEffect, useCallback } from 'react';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';

import Results from './Results';
import campaignServices from 'src/services/campaignServices';
import { Campaign } from 'src/models/campaign';

function ManagementCampaigns() {
  const isMountedRef = useRefMounted();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const getCampaigns = useCallback(
    async (page: number, limit: number, status: string, query: string) => {
      try {
        const response = await campaignServices.getListCampaigns({
          page,
          limit,
          status,
          query
        });
        if (isMountedRef.current) {
          setCampaigns(response.data.data);
          setTotalPages(response.data.totalPages);
          setTotal(response.data.total);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [isMountedRef]
  );

  useEffect(() => {
    getCampaigns(page, limit, status, query);
  }, [limit, page, status, query]);

  return (
    <>
      <Helmet>
        <title>Quản lý chiến dịch</title>
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
          <Results
            campaigns={campaigns}
            getCampaigns={getCampaigns}
            page={page - 1}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setQuery={setQuery}
            query={query}
            totalPages={totalPages}
            total={total}
            status={status}
            setStatus={setStatus}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementCampaigns;
