import { FC, ChangeEvent, MouseEvent, SyntheticEvent, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
  Divider
} from '@mui/material';
import type { TypeUser, User } from 'src/models/user';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import useNotify from 'src/hooks/useNotify';
import { Customer } from 'src/models/customer';
import DialogDelete from 'src/components/DialogDelete';
import { ColumnMyTable } from 'src/components/Table/type';
import MyTable from 'src/components/Table';

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);

interface ResultsProps {
  users: User[] | Customer[];
  typeUser: TypeUser;
  setTypeUser: (type: TypeUser) => void;
  getUsers: any;
  page: number;
  limit: number;
  query: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setQuery: (query: string) => void;
  totalPages: number;
  total: number;
}

const Results: FC<ResultsProps> = ({
  users,
  typeUser,
  setTypeUser,
  getUsers,
  page,
  limit,
  query,
  setQuery,
  setPage,
  setLimit,
  total,
  totalPages
}) => {
  const tabs = [
    {
      value: 'users',
      label: 'Chủ cửa hàng'
    },
    {
      value: 'customers',
      label: 'Khách hàng'
    }
  ];

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: TypeUser) => {
    setTypeUser(tabsValue);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const columnsUser: ColumnMyTable[] = [
    {
      Header: 'Tên',
      accessor: 'name'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Số điện thoại',
      accessor: 'phone'
    }
  ];

  const columnsCustomer: ColumnMyTable[] = [
    {
      Header: 'Tên',
      accessor: 'name'
    },
    {
      Header: 'Số điện thoại',
      accessor: 'phone'
    },
    {
      Header: 'Xã',
      accessor: 'wardName'
    },
    {
      Header: 'Quận/Huyện',
      accessor: 'districtName'
    },
    {
      Header: 'Tỉnh/Thành phố',
      accessor: 'provinceName'
    }
  ];

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        pb={3}
      >
        <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={typeUser}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </TabsWrapper>
      </Box>
      <Card>
        <Box p={2}>
          {typeUser === 'customers' && (
            <TextField
              sx={{
                m: 0
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder={'Search by name, email or username...'}
              value={query}
              size="small"
              fullWidth
              margin="normal"
              variant="outlined"
            />
          )}
        </Box>

        <Divider />

        {users.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {"We couldn't find any users matching your search criteria"}
            </Typography>
          </>
        ) : (
          <MyTable
            columns={typeUser === 'users' ? columnsUser : columnsCustomer}
            data={users}
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            limit={limit}
            page={typeUser === 'customers' ? page : -1}
            total={total}
          />
        )}
      </Card>
    </>
  );
};

Results.propTypes = {
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
