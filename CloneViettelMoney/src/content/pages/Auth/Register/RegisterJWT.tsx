import { Formik } from 'formik';
import { Button, TextField, CircularProgress } from '@mui/material';
import useRefMounted from 'src/hooks/useRefMounted';
import { validationRegisterSchema } from './validation';
import authServices from 'src/services/authServices';
import { useNavigate } from 'react-router-dom';
import useNotify from 'src/hooks/useNotify';

function RegisterJWT() {
  const isMountedRef = useRefMounted();

  const navigate = useNavigate();

  const { notify } = useNotify();

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        phone: '',
        password: '',
        submit: null
      }}
      validationSchema={validationRegisterSchema}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await authServices.register(values);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            notify('Đăng kí tài khoản thành công', { variant: 'success' });
            navigate('/account/login');
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
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
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            margin="normal"
            helperText={touched.name && errors.name}
            label={'Họ và tên'}
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            margin="normal"
            helperText={touched.phone && errors.phone}
            label={'Số điện thoại'}
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.phone}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
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
            Đăng kí tài khoản
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default RegisterJWT;
