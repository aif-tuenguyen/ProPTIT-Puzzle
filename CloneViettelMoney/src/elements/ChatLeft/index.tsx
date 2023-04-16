import { Avatar, Box } from '@mui/material';
import React from 'react';
import { Message } from 'src/components/Message';
import { IMessage } from 'src/models/chat';

interface IChatLeftProps {
  message: IMessage;
}

export const ChatLeft: React.FC<IChatLeftProps> = ({ message }) => {
  return (
    <Box display="flex" my={2}>
      <Box mr={1}>
        <Avatar>{message?.userIdFrom?.toString()?.slice(-3)}</Avatar>
      </Box>
      <Message typeMessage="left" message={message} />
    </Box>
  );
};
