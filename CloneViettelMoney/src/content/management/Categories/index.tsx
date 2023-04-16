import { useState, useEffect, useCallback } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import type { Product } from 'src/models/product';

import PageHeader from './PageHeader';
import Results from './Results';
import categoryServices from 'src/services/categoryServices';

function ManagementCategories() {
  const isMountedRef = useRefMounted();
  const [categories, setCategories] = useState<Product[]>([]);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const getCategories = useCallback(
    async (page: number, limit: number, query: string) => {
      try {
        const response = await categoryServices.getListCategories({
          page,
          limit,
          query
        });
        if (isMountedRef.current) {
          setCategories(response.data.data);
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
    getCategories(page, limit, query);
  }, [limit, page, query]);

  return (
    <>
      <Helmet>
        <title>Quản lý danh mục</title>
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
            data={categories}
            getCategories={getCategories}
            page={page - 1}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setQuery={setQuery}
            query={query}
            totalPages={totalPages}
            total={total}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ManagementCategories;
