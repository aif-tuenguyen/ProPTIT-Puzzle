import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { PinInput } from 'react-input-pin-code';
import { useParams, useSearchParams } from 'react-router-dom';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import { Transaction } from 'src/models/transaction';
import transactionServices from 'src/services/transactionServices';
import CheckIcon from '@mui/icons-material/Check';
import useNotify from 'src/hooks/useNotify';
import MicRecorder from 'mic-recorder-to-mp3';

const SourceView = styled('img')(
  ({ theme }) => `
            border-radius: 100%;
            width: 60px;
          `
);

interface IChooseMoneySourceProps {
  dataTranfer: Transaction;
  setShowChatWithBot: (showChatWithBot: boolean) => void;
  setStep: any;
}

const Mp3Recorder = new MicRecorder({ bitRate: 16, sampleRate: 16000 });

const ItemInfomation = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography fontSize="12px">{label}</Typography>
      <Typography fontWeight="bold">{value}</Typography>
    </Box>
  );
};

export const ChooseMoneySource: React.FC<IChooseMoneySourceProps> = ({
  dataTranfer,
  setShowChatWithBot,
  setStep
}) => {
  const theme = useTheme();

  console.log(dataTranfer);

  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const [pin, setPin] = React.useState(['', '', '', '', '', '']);

  const getDeviceByUser = (id: string) => {
    switch (id) {
      case '0929345164':
        return '1';
      case '0929345165':
        return '2';
      default:
        return '0';
    }
  };

  const [transactionId, setTransactionId] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState('');

  const { user, devide } = useParams();

  const idFrom = user;
  const idTo = idFrom === '0929345164' ? '0929345165' : '0929345164';

  const checkIsCorrectDevide = getDeviceByUser(user) === devide;

  const [openDrawer, setOpenDrawer] = useState(false);

  const [showChooseSource, setShowChooseSource] = useState(false);

  const [showConfirmOtp, setShowConfirmOtp] = useState(false);

  const [showConfirmVoiceBio, setShowConfirmVoiceBio] = useState(false);

  const [listSource, setListSource] = useState([]);

  const startRecord = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true });

      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecord = () => {
    console.log('stop');

    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        // const file = new File(buffer, 'confirm-voice.mp3', {
        //   type: blob.type,
        //   lastModified: Date.now()
        // });
        setIsRecording(false);
        setConfirmStatus('confirming');
        confirmVoiceBio(blob);
      })
      .catch((e) => console.log(e));
  };

  const getBalance = async () => {
    const res = await transactionServices.getBalance({
      sender_id: idFrom,
      driver_id: idTo
    });
    console.log(res?.data?.data);

    if (res?.status === 200) {
      const list = [
        {
          type: 'viettel_pay',
          amount: res?.data?.data?.viettel_pay,
          choose: true,
          key: 0
        },
        {
          type: 'money',
          amount: res?.data?.data?.money,
          choose: false,
          key: 1
        }
      ];

      setListSource(list);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const getContentTranferInfo = (
    payment_type: 'account_number' | 'phone_number' | 'card_number'
  ) => {
    switch (payment_type) {
      case 'account_number':
        return (
          <Box>
            <ItemInfomation
              label="Số tài khoản"
              value={dataTranfer?.account_number}
            />
            <ItemInfomation
              label="Chủ tài khoản nhận"
              value={dataTranfer?.receiver_name}
            />
            <ItemInfomation
              label="Ngân hàng nhận"
              value={dataTranfer?.bank_name}
            />
            <ItemInfomation label="Nội dung" value={dataTranfer?.content} />
          </Box>
        );
      case 'phone_number':
        return (
          <Box>
            <ItemInfomation
              label="Tên người nhận"
              value={dataTranfer?.receiver_name}
            />
            <ItemInfomation
              label="Số điện thoại nhận"
              value={dataTranfer?.phone_number}
            />
            <ItemInfomation label="Nội dung" value={dataTranfer?.content} />
          </Box>
        );
      case 'card_number':
        return (
          <Box>
            <ItemInfomation
              label="Số thẻ ngân hàng"
              value={dataTranfer?.card_number}
            />
            <ItemInfomation
              label="Chủ tài khoản nhận"
              value={dataTranfer?.receiver_name}
            />
            <ItemInfomation
              label="Ngân hàng nhận"
              value={dataTranfer?.bank_name}
            />
            <ItemInfomation label="Nội dung" value={dataTranfer?.content} />
          </Box>
        );
      default:
        return null;
    }
  };

  const sourceChoose = listSource?.find((item) => item.choose);

  const { notify } = useNotify();

  const confirmTransaction = () => {
    if (dataTranfer?.amount >= sourceChoose?.amount) {
      notify('Số dư không đủ', {
        variant: 'error'
      });
      return;
    }
    setOpenDrawer(true);
  };

  console.log(transactionId);

  const createTransaction = async () => {
    const cloneDataTranfer = { ...dataTranfer };

    cloneDataTranfer.payment_source = sourceChoose?.key;

    const res = await transactionServices.createTransaction(cloneDataTranfer);
    if (res?.data?.status === 1) {
      setTransactionId(res?.data?.transaction_id);
    }
  };

  const confirmOtp = async (otp: string) => {
    const res = await transactionServices.otpAuth({
      transaction_id: transactionId,
      otp
    });
    if (res?.data?.status === 1) {
      notify('Giao dịch thành công', {
        variant: 'success'
      });
      setShowChatWithBot(false);
      setStep(1);
    }
  };

  const confirmVoiceBio = async (voice: any) => {
    console.log(voice);

    const formData = new FormData();

    formData.set('transaction_id', transactionId);
    formData.set('file', voice);
    formData.set('sender_id', user);

    const res = await transactionServices.voiceBio(formData);

    if (res?.data?.status === 1) {
      notify('Giao dịch thành công', {
        variant: 'success'
      });
      setConfirmStatus('true');
      setShowChatWithBot(false);
      setStep(1);
    } else {
      notify('Xác thực thất bại', {
        variant: 'error'
      });
      setConfirmStatus('false');
    }
  };

  let countPIN = 0;

  return (
    <Box>
      <Box>
        <Typography fontWeight="bold" mb={2}>
          Từ tài khoản
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <SourceView
              src={
                sourceChoose?.type === 'viettel_pay'
                  ? 'https://play-lh.googleusercontent.com/3YPlh6BmUr5K5vD0-LWfFJDweg3VJ5XhHrnQYf6-0AiI6Azegt8NmwpXPOqQqXd6fA'
                  : 'https://www.kindpng.com/picc/m/207-2078444_icon-phone-communication-mobile-button-icon-in-thoi.png'
              }
            />
            <Box ml={2}>
              <Typography fontWeight="bold" fontSize="18px">
                {sourceChoose?.type === 'viettel_pay'
                  ? 'ViettelPay'
                  : 'Tiền di động'}
              </Typography>
              <Typography color={theme.colors.primary.main} fontWeight="bold">
                {sourceChoose?.amount?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => {
              setShowChooseSource(true);
            }}
          >
            Thay đổi
          </Button>
        </Box>
      </Box>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <Box>
        <Typography fontWeight="bold" mb={2}>
          Thông tin giao dịch
        </Typography>
        {getContentTranferInfo(dataTranfer?.payment_type)}
      </Box>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <Box>
        <Typography fontWeight="bold" mb={2}>
          Số tiền giao dịch
        </Typography>
        <Box>
          <ItemInfomation
            label="Số tiền"
            value={Number(dataTranfer?.amount)?.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          />
        </Box>
      </Box>
      <Box mt={2}>
        <Button
          type="button"
          variant="contained"
          fullWidth
          onClick={confirmTransaction}
        >
          Xác nhận
        </Button>
      </Box>
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setCode(['', '', '', '', '', '']);
        }}
      >
        <Box p={2}>
          <Typography textAlign="center" mb={2}>
            Vui lòng nhập mật khẩu Viettel Money
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <PinInput
              values={code}
              type="number"
              onChange={(value, index, values) => setCode(values)}
              onComplete={(value) => {
                if (
                  value[0] === '1' &&
                  value[1] === '2' &&
                  value[2] === '3' &&
                  value[3] === '4' &&
                  value[4] === '5' &&
                  value[5] === '6'
                ) {
                  setOpenDrawer(() => {
                    createTransaction();
                    if (checkIsCorrectDevide) {
                      setShowConfirmVoiceBio(true);
                    } else {
                      setShowConfirmOtp(true);
                    }
                    return false;
                  });
                } else {
                  notify('Sai mật khẩu', {
                    variant: 'error'
                  });
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="bottom"
        open={showConfirmOtp}
        onClose={() => setShowConfirmOtp(false)}
      >
        <Box p={2}>
          <Typography textAlign="center" mb={2}>
            Kiểm tra tin nhắn và xác nhận mã PIN
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <PinInput
              values={pin}
              type="number"
              onChange={(value, index, values) => setPin(values)}
              onComplete={(value) => {
                if (
                  value[0] === '1' &&
                  value[1] === '2' &&
                  value[2] === '3' &&
                  value[3] === '4' &&
                  value[4] === '5' &&
                  value[5] === '6'
                ) {
                  setShowConfirmOtp(() => {
                    confirmOtp('123456');
                    return false;
                  });
                } else {
                  notify('Sai mã PIN', {
                    variant: 'error'
                  });
                  countPIN++;
                  if (countPIN === 3) {
                    console.log('Sai qua nhieu');
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="bottom"
        open={showConfirmVoiceBio}
        onClose={() => {
          setShowConfirmVoiceBio(false);
          setIsRecording(false);
          setConfirmStatus('');
        }}
      >
        <Box p={2}>
          <Typography textAlign="center" mb={2} fontSize="20px">
            Để xác thực bằng Voice Bio, vui lòng đọc thật chính xác câu sau:
          </Typography>
          <Typography
            textAlign="center"
            mb={2}
            fontSize="20px"
            fontWeight="bold"
          >
            "Mã xác thực của tôi là 123456"
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {confirmStatus === '' && (
              <Box
                onClick={isRecording ? stopRecord : startRecord}
                width="80px"
                bgcolor="red"
                height="80px"
                borderRadius="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="white"
              >
                {isRecording ? (
                  <StopIcon sx={{ fontSize: 30 }} />
                ) : (
                  <KeyboardVoiceIcon sx={{ fontSize: 30 }} />
                )}
              </Box>
            )}
            {confirmStatus === 'confirming' && (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            )}
            {confirmStatus === 'true' && (
              <Box
                width="80px"
                bgcolor="green"
                height="80px"
                borderRadius="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="white"
              >
                <CheckIcon sx={{ fontSize: 30 }} />
              </Box>
            )}
            {confirmStatus === 'false' && (
              <Box
                width="80px"
                bgcolor="red"
                height="80px"
                borderRadius="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="white"
              >
                <CloseIcon sx={{ fontSize: 30 }} />
              </Box>
            )}

            {confirmStatus === 'false' && (
              <Box display="flex" mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsRecording(false);
                    setConfirmStatus('');
                  }}
                >
                  Thử lại
                </Button>
                <Button color="secondary" onClick={() => setOpenDrawer(true)}>
                  Xác thực bằng OTP
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor="bottom"
        open={showChooseSource}
        onClose={() => setShowChooseSource(false)}
      >
        <Box p={2}>
          <Typography textAlign="center" mb={2}>
            Vui lòng chọn nguồn tiền
          </Typography>
          <Box>
            {listSource?.map((source, index) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  key={index}
                  onClick={() => {
                    setListSource((old) => {
                      const cloneOld = [...old];
                      cloneOld?.map((item) => (item.choose = false));
                      cloneOld[index].choose = true;
                      return cloneOld;
                    });
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <SourceView
                      src={
                        source?.type === 'viettel_pay'
                          ? 'https://play-lh.googleusercontent.com/3YPlh6BmUr5K5vD0-LWfFJDweg3VJ5XhHrnQYf6-0AiI6Azegt8NmwpXPOqQqXd6fA'
                          : 'https://www.kindpng.com/picc/m/207-2078444_icon-phone-communication-mobile-button-icon-in-thoi.png'
                      }
                    />
                    <Box ml={2}>
                      <Typography fontWeight="bold">
                        {source?.type === 'viettel_pay'
                          ? 'ViettelPay'
                          : 'Tiền di động'}
                      </Typography>
                    </Box>
                  </Box>
                  {source?.choose && <CheckIcon />}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
