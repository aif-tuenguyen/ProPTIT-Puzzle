import {
  Box,
  Typography,
  alpha,
  Avatar,
  styled,
  useTheme,
  Grid,
  CardContent,
  Card
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useNotify from 'src/hooks/useNotify';
import { Layout } from 'src/layouts';
import transactionServices from 'src/services/transactionServices';

const BoxComposed = styled(Box)(
  () => `
    position: relative;
  `
);

const BoxComposedContent = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 7;

    .MuiTypography-root {
        color: ${theme.palette.primary.contrastText};

        & + .MuiTypography-root {
            color: ${alpha(theme.palette.primary.contrastText, 0.7)};
        }
    }
    
  `
);

const BoxComposedImage = styled(Box)(
  () => `
    position: absolute;
    left: 0;
    top: 0;
    z-index: 5;
    filter: grayscale(80%);
    background-size: cover;
    height: 100%;
    width: 100%;
    border-radius: inherit;
  `
);

const BoxComposedBg = styled(Box)(
  () => `
    position: absolute;
    left: 0;
    top: 0;
    z-index: 6;
    height: 100%;
    width: 100%;
    border-radius: inherit;
  `
);

const LabelError = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    background: ${theme.palette.error.main};
    color: ${theme.palette.error.contrastText};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(10)};
    font-weight: bold;
    line-height: 23px;
    height: 22px;
    padding: ${theme.spacing(0, 2)};
    border-radius: ${theme.general.borderRadiusSm};
  `
);

const SourceView = styled('img')(
  ({ theme }) => `
  border-radius: 100%;
            width: 40px;
          `
);

function HomePage() {
  const theme = useTheme();

  const [balanceViettelPay, setBalanceViettelPay] = useState(0);
  const [balanceMoney, setBalanceMoney] = useState(0);

  const [listHistory, setListHistory] = useState([]);

  const { user } = useParams();

  const getBalance = async (user_id: string) => {
    const res = await transactionServices.getBalance({
      sender_id: user_id,
      driver_id: ''
    });

    setBalanceViettelPay(res?.data?.data?.viettel_pay);
    setBalanceMoney(res?.data?.data?.money);
  };

  const getListHistory = async (user_id: string) => {
    const res = await transactionServices.getHistory(user_id);

    if (res?.data?.status === 1) {
      setListHistory(res?.data?.data);
    }
  };

  useEffect(() => {
    getBalance(user);
    getListHistory(user);
  }, [user]);

  const getTitleTransactionType = (
    payment_type: 'account_number' | 'phone_number' | 'card_number',
    sender_id: string
  ) => {
    switch (payment_type) {
      case 'account_number':
        return sender_id === user
          ? 'Chuyển tiền đến số tài khoản'
          : 'Nhận tiền từ số tài khoản';
      case 'phone_number':
        return 'Chuyển tiền đến số điện thoại';
      case 'card_number':
        return 'Chuyển tiền đến số thẻ';
      default:
        return 'Trợ lý';
    }
  };

  return (
    <Layout showMenu>
      <Box p={2} pb={4} bgcolor={theme.colors.primary.main} color="white">
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar>{user?.slice(-3)}</Avatar>
            <Typography ml={2}>{user}</Typography>
          </Box>
        </Box>
        <Box>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <SourceView src="https://play-lh.googleusercontent.com/3YPlh6BmUr5K5vD0-LWfFJDweg3VJ5XhHrnQYf6-0AiI6Azegt8NmwpXPOqQqXd6fA" />
                  <Typography fontWeight="bold" ml={2}>
                    ViettelPay
                  </Typography>
                </Box>
                <Typography fontWeight="bold" fontSize="20px">
                  {balanceViettelPay.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <SourceView src="https://www.kindpng.com/picc/m/207-2078444_icon-phone-communication-mobile-button-icon-in-thoi.png" />
                  <Typography fontWeight="bold" ml={2}>
                    Tiền di động
                  </Typography>
                </Box>
                <Typography fontWeight="bold" fontSize="20px">
                  {balanceMoney.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Box borderRadius="20px 20px 0px 0px" bgcolor="white" mt="-20px">
        <Typography fontWeight="bold" fontSize="18px" textAlign="center" p={4}>
          Lịch sử giao dịch
        </Typography>
        <Box>
          {listHistory?.map((history, index) => {
            return (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor={index % 2 === 0 ? 'seashell' : 'white'}
                p={2}
                key={index}
              >
                <Box>
                  <Typography fontWeight="bold">
                    {getTitleTransactionType(
                      history?.PaymentType,
                      history?.SenderUserID
                    )}
                  </Typography>
                  <Typography fontSize="12px">
                    {new Date(history?.CreateAt).toLocaleString('vi')}
                  </Typography>
                  <Typography fontSize="12px">{history?.Content}</Typography>
                </Box>
                <Box>
                  <Typography
                    fontWeight="bold"
                    fontSize="16px"
                    color={theme.colors.primary.main}
                  >
                    {`${
                      history?.SenderUserID === user ? '-' : '+'
                    } ${history?.Amount?.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })}`}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Layout>
  );
}
export default HomePage;
