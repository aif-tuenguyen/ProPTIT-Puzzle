import { Box, styled, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatItem } from 'src/elements/ChatItem';
import { Layout } from 'src/layouts';

const StyledTextField = styled(TextField)(
  ({ theme }) => `
    .MuiInputBase-root {
      background-color: white;
    }
  `
);

export const ChatPage = () => {
  const theme = useTheme();

  const listChat = [
    {
      user_id: '0929345164',
      name: 'Trần Văn Thắng'
    },
    {
      user_id: '0929345165',
      name: 'Nguyễn Văn Học'
    }
  ];

  return (
    <Layout showMenu>
      <Box bgcolor={theme.colors.primary.light} p={2}>
        <Typography fontSize="20px" fontWeight="bold" color="white" mb={1}>
          Chat
        </Typography>
        <StyledTextField placeholder="Tìm kiếm (Tên, SĐT, ...)" fullWidth />
      </Box>
      {listChat?.map((item) => (
        <ChatItem {...item} key={item?.user_id} />
      ))}
    </Layout>
  );
};
