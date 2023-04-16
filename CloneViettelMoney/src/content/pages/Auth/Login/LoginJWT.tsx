import * as Yup from 'yup';
import type { FC } from 'react';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Button, TextField, Link, CircularProgress } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import useNotify from 'src/hooks/useNotify';

const LoginJWT: FC = () => {
  const { login } = useAuth() as any;
  const isMountedRef = useRefMounted();

  const { notify } = useNotify();

  return (
    <Formik
      initialValues={{
        email: 'thangquyvanthao2000@gmail.com',
        password: 'Thang123',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email không đúng định dạng')
          .max(255)
          .required('Email không được bỏ trống'),
        password: Yup.string().max(255).required('Mật khẩu không được để trống')
      })}
      onSubmit={async (
        values,
        { setErrors, setStatus, setSubmitting }
      ): Promise<void> => {
        try {
          await login(values.email, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          notify(err.response.data.message || 'Error', { variant: 'error' });

          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.email && errors.email}
            label={'Email'}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={'Mật khẩu'}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <Box
            alignItems="center"
            display={{ xs: 'block', md: 'flex' }}
            justifyContent="flex-end"
          >
            <Link component={RouterLink} to="/account/recover-password">
              <b>Quên mật khẩu?</b>
            </Link>
          </Box>

          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            Đăng nhập
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
