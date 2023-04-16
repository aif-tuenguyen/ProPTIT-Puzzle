import {
  CheckTwoTone,
  CloseTwoTone,
  CloudUploadTwoTone
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  styled,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import useNotify from 'src/hooks/useNotify';
import uploadServices from 'src/services/uploadServices';

interface BoxUploadWrapperProps {
  error?: boolean;
}

const BoxUploadWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'error'
})<BoxUploadWrapperProps>(
  ({ theme, error }) => `
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(2)};
      background: ${theme.colors.alpha.black[5]};
      border: 1px ${
        error
          ? `solid ${theme.colors.error.main}`
          : `dashed ${theme.colors.alpha.black[30]}`
      };
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: ${theme.transitions.create(['border', 'background'])};
  
      &:hover {
        background: ${theme.colors.alpha.white[50]};
        border-color: ${theme.colors.primary.main};
        border-style: dashed;
      }
  `
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      background: transparent;
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.success.light};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.error.light};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

interface IUploadFileProps {
  label?: string;
  setData: (data: any) => void;
  multiple?: boolean;
  accept?: Accept;
  disabled?: boolean;
  errors?: any;
  name?: string;
  isRequired?: boolean;
}

const UploadFile: React.FC<IUploadFileProps> = ({
  label,
  setData,
  multiple,
  accept,
  disabled,
  errors,
  name,
  isRequired
}) => {
  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept,
    disabled
  });

  const { notify } = useNotify();

  const uploadFile = async () => {
    if (acceptedFiles.length > 0) {
      if (multiple) {
        const response = await Promise.all(
          acceptedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const resUpload = await uploadServices.uploadImage(formData);
            if (resUpload.status === 200) {
              return resUpload.data.url;
            }
          })
        );
        const checkSuccess = response.every((item) => item);
        if (checkSuccess) {
          notify('Upload succesfully', {
            variant: 'success'
          });
          setData(response);
        }
      } else {
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        const response = await uploadServices.uploadImage(formData);
        if (response.status === 200) {
          notify('Upload succesfully', {
            variant: 'success'
          });
          setData(response.data.url);
        }
      }
    }
  };

  useEffect(() => {
    uploadFile();
  }, [acceptedFiles]);
  return (
    <FormControl fullWidth required={isRequired}>
      <FormLabel>{label}</FormLabel>
      {/* {label && (
        <Typography >{label}</Typography>
      )} */}
      <BoxUploadWrapper
        {...getRootProps()}
        error={isRequired && errors?.[name]}
      >
        <input {...getInputProps()} />
        {isDragAccept && (
          <>
            <AvatarSuccess variant="rounded">
              <CheckTwoTone />
            </AvatarSuccess>
            <Typography
              sx={{
                mt: 2
              }}
            >
              {'Drop the files to start uploading'}
            </Typography>
          </>
        )}
        {isDragReject && (
          <>
            <AvatarDanger variant="rounded">
              <CloseTwoTone />
            </AvatarDanger>
            <Typography
              sx={{
                mt: 2
              }}
            >
              {'You cannot upload these file types'}
            </Typography>
          </>
        )}
        {!isDragActive && (
          <>
            <AvatarWrapper variant="rounded">
              <CloudUploadTwoTone />
            </AvatarWrapper>
            <Typography
              sx={{
                mt: 2
              }}
            >
              {'Drag & drop files here'}
            </Typography>
          </>
        )}
      </BoxUploadWrapper>
      {isRequired && errors?.[name] && (
        <FormHelperText error>{errors?.[name]}</FormHelperText>
      )}
    </FormControl>
  );
};

export default UploadFile;
