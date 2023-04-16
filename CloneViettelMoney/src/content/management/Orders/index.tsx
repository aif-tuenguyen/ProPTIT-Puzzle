import { useState, useEffect, useCallback } from 'react';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';

import Results from './Results';
import { Order } from 'src/models/order';
import orderServices from 'src/services/orderServices';

function ManagementOrders() {
  const isMountedRef = useRefMounted();
  const [orders, setOrders] = useState<Order[]>([]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const getOrders = useCallback(
    async (page: number, limit: number, status: string, query: string) => {
      try {
        const response = await orderServices.getListOrders({
          page,
          limit,
          status,
          query
        });
        if (isMountedRef.current) {
          setOrders(response.data.data);
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
    getOrders(page, limit, status, query);
  }, [page, limit, status, query]);

  return (
    <>
      <Helmet>
        <title>Quản lý đơn hàng</title>
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
            orders={orders}
            getOrders={getOrders}
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

export default ManagementOrders;
