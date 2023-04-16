import {
  Avatar,
  Box,
  styled,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import { ChatLeft } from 'src/elements/ChatLeft';
import { ChatRight } from 'src/elements/ChatRight';
import io from 'socket.io-client';
import { IMessage } from 'src/models/chat';
import _map from 'lodash/map';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from 'src/layouts';
import MicRecorder from 'mic-recorder-to-mp3';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

const StyledTextField = styled(TextField)(
  ({ theme }) => `
      .MuiInputBase-root {
        background-color: white;
        height: 45px;
      }
    `
);

const BoxVoice = styled(Box)(
  ({ theme }) => `
    padding: 0;
    `
);

const Mp3Recorder = new MicRecorder({ bitRate: 16, sampleRate: 16000 });

export const DetailChat = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  const { user } = useParams();

  const idFrom = user;
  const idTo = idFrom === '0929345164' ? '0929345165' : '0929345164';

  const [textMessage, setTextMessage] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isSubmiting, setIsSubmitting] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const [messageOfBot, setMessageOfBot] = useState('');
  const [isIntent, setIsIntent] = useState('');

  useEffect(() => {
    setSocket(io('http://localhost:6969'));
    const listMessage = localStorage.getItem('messages');
    setMessages(JSON.parse(listMessage) || []);
  }, []);

  useEffect(() => {
    socket?.on(`newMessage${idFrom}`, (response) => {
      newMessage(response);
    }); //lắng nghe event 'newMessage' và gọi hàm newMessage khi có event
  }, [socket]);

  const newMessage = (m) => {
    if (m?.userIdFrom !== 'BOT') {
      setMessages((old) => {
        const listMessage = [...old, m];

        localStorage.setItem('messages', JSON.stringify(listMessage));

        return listMessage;
      });
    } else {
      setMessageOfBot(m?.message?.value);
      setIsIntent(m?.userIdTo);
    }
  };

  const sendMessage = () => {
    const data: IMessage = {
      userIdFrom: idFrom,
      userIdTo: idTo,
      message: {
        type: 'text',
        value: textMessage
      }
    };

    socket.emit('newMessage', data);
    setTextMessage('');

    setMessages((old) => {
      const listMessage = [...old, data];

      localStorage.setItem('messages', JSON.stringify(listMessage));

      return listMessage;
    });
  };

  const startRecord = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true });

      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          setIsSubmitting(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecord = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const cancelRecord = () => {
    setIsSubmitting(false);
  };

  return (
    <Layout
      showBot
      messageOfBot={messageOfBot}
      setMessageOfBot={setMessageOfBot}
      isIntent={isIntent}
    >
      <Box paddingTop="80px" paddingBottom="60px">
        <Box
          display="flex"
          height="80px"
          position="fixed"
          top={0}
          left={0}
          width="100%"
          bgcolor={theme.colors.primary.light}
          color="white"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          zIndex={10}
        >
          <Box mr={2} onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </Box>
          <Box flex={1} display="flex" alignItems="center">
            <Avatar>{idFrom.toString().slice(-3)}</Avatar>
            <Typography ml={2} fontWeight="bold">
              {idFrom === '0929345165' ? 'Trần Văn Thắng' : 'Nguyễn Văn Học'}
            </Typography>
          </Box>
          <MoreHorizIcon />
        </Box>

        <Box p={2}>
          {messages?.map((message, index) => {
            return message?.userIdFrom !== idFrom ? (
              <ChatLeft message={message} key={index} />
            ) : (
              <ChatRight message={message} key={index} />
            );
          })}
        </Box>
        <Box
          display="flex"
          height="60px"
          position="fixed"
          bottom={0}
          left={0}
          width="100%"
          bgcolor={theme.colors.primary.light}
          color="white"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          gap={1}
          zIndex={10}
        >
          <Box>
            <MenuIcon />
          </Box>
          <Box onClick={startRecord}>
            <KeyboardVoiceIcon />
          </Box>
          <Box flex={1} display="flex" alignItems="center">
            <StyledTextField
              placeholder="Nhập tin nhắn"
              fullWidth
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
          </Box>
          <Box onClick={sendMessage}>
            <SendIcon />
          </Box>
        </Box>
        {isSubmiting && (
          <Box
            display="flex"
            height="60px"
            position="fixed"
            bottom={0}
            left={0}
            width="100%"
            bgcolor={theme.colors.primary.light}
            color="white"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            gap={1}
            zIndex={10}
          >
            <Box onClick={() => (isRecording ? stopRecord() : cancelRecord())}>
              {isRecording ? <StopCircleIcon /> : <CancelIcon />}
            </Box>
            <Box flex={1}>
              {isRecording ? (
                <Typography>Đang ghi âm...</Typography>
              ) : (
                <audio src={blobURL} controls />
              )}
            </Box>
            <Box onClick={sendMessage}>
              <SendIcon />
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
};
