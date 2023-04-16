import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import { ConfirmInformation } from './stepTranfer/ConfirmInformation';
import { ChooseMoneySource } from './stepTranfer/ChooseMoneySource';
import { Transaction } from 'src/models/transaction';
import botServices from 'src/services/botServices';
import { useParams, useSearchParams } from 'react-router-dom';

const BotView = styled('img')(
  ({ theme }) => `
          border-radius: 100%;
          width: 60px;
          box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
          
        `
);

const SourceView = styled('img')(
  ({ theme }) => `
            width: 60px;
          `
);

const StyledTextField = styled(TextField)(
  ({ theme }) => `
      .MuiInputBase-root {
        background-color: white;
        height: 45px;
      }
    `
);

interface IBotProps {
  messageOfBot: string;
  setMessageOfBot: any;
  showChatWithBot: boolean;
  isIntent: string;
  setShowChatWithBot: (showChatWithBot: boolean) => void;
}

export const Bot: React.FC<IBotProps> = ({
  messageOfBot,
  setMessageOfBot,
  showChatWithBot,
  isIntent,
  setShowChatWithBot
}) => {
  const theme = useTheme();

  const [step, setStep] = useState(1);

  const { user, roomId } = useParams();

  const idFrom = user;
  const idTo = idFrom === '0929345164' ? '0929345165' : '0929345164';

  const [dataTranfer, setDataTranfer] = useState<Transaction>();

  const getFormTransfer = async (
    roomId: string,
    idFrom: string,
    idTo: string
  ) => {
    const res = await botServices.updateForm({
      room_id: roomId,
      user_id_source: idFrom,
      user_id_destination: idTo
    });

    if (res?.status === 200) {
      const cloneData = {
        ...res?.data,
        amount: Number(res?.data?.transfer_amount) || null
      };
      delete cloneData?.transfer_amount;
      delete cloneData?.suggestion;
      setDataTranfer(cloneData);
    }
  };

  console.log(isIntent);

  useEffect(() => {
    if (isIntent === idFrom) {
      getFormTransfer(roomId, idFrom, idTo);
    }
  }, [isIntent, idFrom, roomId]);

  const getTitleTransactionType = (
    payment_type: 'account_number' | 'phone_number' | 'card_number'
  ) => {
    switch (payment_type) {
      case 'account_number':
        return 'Chuyển tiền đến số tài khoản';
      case 'phone_number':
        return 'Chuyển tiền đến số điện thoại';
      case 'card_number':
        return 'Chuyển tiền đến số thẻ';
      default:
        return 'Trợ lý';
    }
  };

  const getContentByStep = () => {
    switch (step) {
      case 1:
        return (
          <ConfirmInformation
            dataTranfer={dataTranfer}
            setDataTranfer={setDataTranfer}
            setStep={setStep}
          />
        );
      case 2:
        return (
          <ChooseMoneySource
            dataTranfer={dataTranfer}
            setShowChatWithBot={setShowChatWithBot}
            setStep={setStep}
          />
        );

      default:
        return null;
    }
  };

  const getChoosePaymentType = () => {
    return (
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          onClick={() =>
            setDataTranfer((old) => {
              return {
                ...old,
                payment_type: 'account_number'
              };
            })
          }
        >
          <SourceView src="https://icones.pro/wp-content/uploads/2021/10/symbole-bancaire-rouge.png" />
          <Typography fontWeight="bold" textAlign="center">
            Chuyển đến số tài khoản
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          onClick={() =>
            setDataTranfer((old) => {
              return {
                ...old,
                payment_type: 'phone_number'
              };
            })
          }
        >
          <SourceView src="https://icones.pro/wp-content/uploads/2021/04/icone-de-telephone-portable-rouge.png" />
          <Typography fontWeight="bold" textAlign="center">
            Chuyển đến số điện thoại
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          onClick={() =>
            setDataTranfer((old) => {
              return {
                ...old,
                payment_type: 'card_number'
              };
            })
          }
        >
          <SourceView src="https://cdn-icons-png.flaticon.com/512/893/893081.png" />
          <Typography fontWeight="bold" textAlign="center">
            Chuyển đến số thẻ
          </Typography>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    if (messageOfBot) {
      setTimeout(() => {
        setMessageOfBot('');
      }, 5000);
    }
  }, [messageOfBot]);

  return (
    <>
      <Box
        position="fixed"
        top={showChatWithBot ? '0px' : '100px'}
        right={showChatWithBot ? 0 : 2}
        zIndex={10}
        width={showChatWithBot ? '100%' : 'fit-content'}
        onClick={() => setShowChatWithBot(!showChatWithBot)}
        bgcolor={showChatWithBot ? 'rgb(0,0,0,0.3)' : 'inherit'}
        display={showChatWithBot ? 'inherit' : 'flex'}
      >
        {messageOfBot && (
          <Box
            p={1}
            bgcolor="white"
            width="fit-content"
            borderRadius="10px 10px 0px 10px"
            maxWidth="80%"
            boxShadow="box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;"
            {...(messageOfBot && { style: { border: '1px solid red' } })}
          >
            {messageOfBot}
          </Box>
        )}

        <BotView
          alt=""
          src="/static/images/bot/bot.svg"
          {...(messageOfBot && { style: { border: '1px solid red' } })}
        />

        {showChatWithBot && (
          <Box
            height="calc(100vh - 60px)"
            bgcolor="white"
            width="100%"
            onClick={(e) => {
              e.stopPropagation();
            }}
            borderRadius="10px 10px 0px 0px"
            display="flex"
            flexDirection="column"
          >
            <Box
              display="flex"
              height="30px"
              width="100%"
              bgcolor={theme.colors.secondary.lighter}
              color="black"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              gap={1}
            >
              <Typography fontWeight="bold">
                {getTitleTransactionType(dataTranfer?.payment_type)}
              </Typography>
            </Box>
            <Box flex={1} p={2} overflow="scroll">
              {dataTranfer?.payment_type
                ? getContentByStep()
                : getChoosePaymentType()}
              {}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
