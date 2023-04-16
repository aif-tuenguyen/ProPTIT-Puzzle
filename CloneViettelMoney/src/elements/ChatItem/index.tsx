import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IChatItemProps {
  user_id: string;
  name: string;
}

export const ChatItem: React.FC<IChatItemProps> = ({ user_id, name }) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => navigate(`/1/${user_id}/chat/1/detail`)}
    >
      <Box m={2}>
        <Avatar>{user_id?.slice(-3)}</Avatar>
      </Box>
      <Box>
        <Typography fontWeight="bold">{name}</Typography>
      </Box>
    </Box>
  );
};
