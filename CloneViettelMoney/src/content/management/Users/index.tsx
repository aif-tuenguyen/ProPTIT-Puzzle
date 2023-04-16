import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';

import { Grid } from '@mui/material';
import type { TypeUser, User } from 'src/models/user';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import Results from './Results';
import shopServices from 'src/services/shopServices';
import { Customer } from 'src/models/customer';

function ManagementUsers() {
  const [users, setUsers] = useState<User[] | Customer[]>([]);

  const [typeUser, setTypeUser] = useState<TypeUser>('users');

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const getUsers = async (page: number, limit: number, query: string) => {
    try {
      const response = await shopServices.getUserShops(typeUser, {
        page,
        limit,
        query
      });
      if (response.status === 200) {
        if (typeUser === 'customers') {
          setUsers(response.data.data);
          setTotalPages(response.data.totalPages);
          setTotal(response.data.total);
        } else {
          setUsers(response.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers(page, limit, query);
  }, [typeUser, page, limit, query]);

  return (
    <>
      <Helmet>
        <title>Users - Management</title>
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
            users={users}
            typeUser={typeUser}
            setTypeUser={setTypeUser}
            getUsers={getUsers}
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

export default ManagementUsers;
