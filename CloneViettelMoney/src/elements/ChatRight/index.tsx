import { Avatar, Box } from '@mui/material';
import React from 'react';
import { Message } from 'src/components/Message';
import { IMessage } from 'src/models/chat';

interface IChatRightProps {
  message: IMessage;
}

export const ChatRight: React.FC<IChatRightProps> = ({ message }) => {
  return (
    <Box display="flex" my={2} justifyContent="flex-end">
      <Message typeMessage="right" message={message} />
    </Box>
  );
};
