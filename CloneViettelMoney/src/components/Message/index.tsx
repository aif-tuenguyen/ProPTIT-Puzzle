import React from 'react';
import { Box, Typography } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { IMessage } from 'src/models/chat';

interface IMessageProps {
  typeMessage: 'left' | 'right';
  message: IMessage;
}

export const Message: React.FC<IMessageProps> = ({ typeMessage, message }) => {
  const getMessageByType = (message) => {
    switch (message?.message?.type) {
      case 'text':
        return (
          <Typography style={{ wordWrap: 'break-word' }}>
            {message?.message?.value}
          </Typography>
        );
      case 'audio':
        return (
          <Box>
            <AudioPlayer
              style={{
                width: '340px'
              }}
              src={message.payload}
              layout="horizontal"
              showSkipControls={false}
              showJumpControls={false}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      p={1}
      bgcolor="#ccc"
      width="fit-content"
      borderRadius={`${
        typeMessage === 'left' ? '0px 10px 10px 10px' : '10px 10px 0px 10px'
      } `}
      maxWidth="80%"
    >
      {getMessageByType(message)}
    </Box>
  );
};
