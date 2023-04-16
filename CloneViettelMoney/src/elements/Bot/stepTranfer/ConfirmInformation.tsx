import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { Transaction } from 'src/models/transaction';
import transactionServices from 'src/services/transactionServices';

const StyledTextFieldBank = styled(TextField)(
  ({ theme }) => `
        .MuiInputBase-root {
          background-color: white;
        }
        margin-bottom: 10px;
      `
);

interface IConfirmInformationProps {
  dataTranfer: Transaction;
  setDataTranfer: any;
  setStep: any;
}

export const ConfirmInformation: React.FC<IConfirmInformationProps> = ({
  dataTranfer,
  setDataTranfer,
  setStep
}) => {
  const checkInfo = async () => {
    const res = await transactionServices.checkInfo(dataTranfer);
    if (res?.status === 200) {
      console.log(res?.data?.data?.ReceiverName);
    }
  };

  const checkContinue = (
    payment_type: 'account_number' | 'phone_number' | 'card_number'
  ) => {
    switch (payment_type) {
      case 'account_number':
        return (
          dataTranfer?.account_number &&
          dataTranfer?.bank_name &&
          dataTranfer?.receiver_name &&
          dataTranfer?.amount
        );
      case 'phone_number':
        return (
          dataTranfer?.phone_number &&
          dataTranfer?.receiver_name &&
          dataTranfer?.amount
        );
      case 'card_number':
        return (
          dataTranfer?.card_number &&
          dataTranfer?.bank_name &&
          dataTranfer?.receiver_name &&
          dataTranfer?.amount
        );
      default:
        return false;
    }
  };

  const getContentTransactionType = (
    payment_type: 'account_number' | 'phone_number' | 'card_number'
  ) => {
    switch (payment_type) {
      case 'account_number':
        return (
          <Card>
            <CardContent>
              <StyledTextFieldBank
                fullWidth
                label="Ngân hàng"
                variant="filled"
                value={dataTranfer?.bank_name}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, bank_name: e.target.value };
                  })
                }
                onBlur={() => {
                  if (dataTranfer?.account_number && dataTranfer?.bank_name) {
                    checkInfo();
                  }
                }}
              />
              <StyledTextFieldBank
                fullWidth
                label="Số tài khoản"
                variant="filled"
                value={dataTranfer?.account_number}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, account_number: e.target.value };
                  })
                }
                onBlur={() => {
                  if (dataTranfer?.account_number && dataTranfer?.bank_name) {
                    checkInfo();
                  }
                }}
              />
              {/* {dataTranfer?.account_number && ( */}
              <StyledTextFieldBank
                fullWidth
                label="Chủ tài khoản"
                variant="filled"
                value={dataTranfer?.receiver_name}
                disabled
              />
              {/* )} */}

              <StyledTextFieldBank
                fullWidth
                label="Số tiền(đ)"
                variant="filled"
                value={dataTranfer?.amount}
                type="number"
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, amount: Number(e.target.value) };
                  })
                }
              />
              <StyledTextFieldBank
                fullWidth
                label="Nội dung"
                variant="filled"
                value={dataTranfer?.content}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, content: e.target.value };
                  })
                }
              />
            </CardContent>
          </Card>
        );
      case 'phone_number':
        return (
          <Card>
            <CardContent>
              <StyledTextFieldBank
                fullWidth
                label="Số điện thoại"
                variant="filled"
                value={dataTranfer?.phone_number}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, phone_number: e.target.value };
                  })
                }
              />
              <StyledTextFieldBank
                fullWidth
                label="Tên người nhận"
                variant="filled"
                value={dataTranfer?.bank_name}
                disabled
              />
              <StyledTextFieldBank
                fullWidth
                label="Số tiền muốn chuyển"
                variant="filled"
                value={dataTranfer?.amount}
                type="number"
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, amount: Number(e.target.value) };
                  })
                }
              />
              <StyledTextFieldBank
                fullWidth
                label="Nội dung"
                variant="filled"
                value={dataTranfer?.content}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, content: e.target.value };
                  })
                }
              />
            </CardContent>
          </Card>
        );
      case 'card_number':
        return (
          <Card>
            <CardContent>
              <StyledTextFieldBank
                fullWidth
                label="Nhập số thẻ ngân hàng nhận"
                variant="filled"
                value={dataTranfer?.card_number}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, bank_name: e.target.value };
                  })
                }
              />
              {/* {dataTranfer?.card_number && ( */}
              <StyledTextFieldBank
                fullWidth
                label="Ngân hàng"
                variant="filled"
                value={dataTranfer?.bank_name}
                disabled
              />
              {/* )} */}
              {/* {dataTranfer?.card_number && ( */}
              <StyledTextFieldBank
                fullWidth
                label="Chủ tài khoản"
                variant="filled"
                value={dataTranfer?.receiver_name}
                disabled
              />
              {/* )} */}
              <StyledTextFieldBank
                fullWidth
                label="Số tiền(đ)"
                variant="filled"
                value={dataTranfer?.amount}
                type="number"
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, amount: Number(e.target.value) };
                  })
                }
              />
              <StyledTextFieldBank
                fullWidth
                label="Nội dung"
                variant="filled"
                value={dataTranfer?.content}
                onChange={(e) =>
                  setDataTranfer((old) => {
                    return { ...old, content: e.target.value };
                  })
                }
              />
            </CardContent>
          </Card>
        );
      default:
        return 'Trợ lý';
    }
  };

  return (
    <Box>
      <Typography textTransform="uppercase" mb={2}>
        Chuyển đến
      </Typography>
      {getContentTransactionType(
        dataTranfer?.payment_type as
          | 'account_number'
          | 'phone_number'
          | 'card_number'
      )}
      <Box mt={2}>
        <Button
          type="button"
          variant="contained"
          fullWidth
          disabled={!checkContinue(dataTranfer?.payment_type)}
          onClick={() => setStep((old) => old + 1)}
        >
          Tiếp tục
        </Button>
      </Box>
    </Box>
  );
};
