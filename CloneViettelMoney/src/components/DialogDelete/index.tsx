import { Close } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Slide,
  styled,
  Typography
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement, Ref } from 'react';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface IDialogDeleteProps {
  title: string;
  openConfirmDelete: boolean;
  closeConfirmDelete: any;
  handleDeleteCompleted: () => void;
}

const DialogDelete: React.FC<IDialogDeleteProps> = ({
  title,
  openConfirmDelete,
  closeConfirmDelete,
  handleDeleteCompleted
}) => {
  return (
    <DialogWrapper
      open={openConfirmDelete}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      onClose={closeConfirmDelete}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={5}
      >
        <AvatarError>
          <Close />
        </AvatarError>

        <Typography
          align="center"
          sx={{
            pt: 4,
            px: 6
          }}
          variant="h3"
        >
          {`Bạn có thực sự muốn xóa ${title} này`}?
        </Typography>

        <Typography
          align="center"
          sx={{
            pt: 2,
            pb: 4,
            px: 6
          }}
          fontWeight="normal"
          color="text.secondary"
          variant="h4"
        >
          {'Bạn sẽ không thể khôi phục sau khi xóa'}
        </Typography>

        <Box>
          <Button
            variant="text"
            size="large"
            sx={{
              mx: 1
            }}
            onClick={closeConfirmDelete}
          >
            {'Hủy'}
          </Button>
          <ButtonError
            onClick={handleDeleteCompleted}
            size="large"
            sx={{
              mx: 1,
              px: 3
            }}
            variant="contained"
          >
            {'Xóa'}
          </ButtonError>
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default DialogDelete;
