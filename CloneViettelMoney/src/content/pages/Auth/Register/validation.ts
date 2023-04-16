import * as Yup from 'yup';
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationRegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ')
    .max(255)
    .required('Địa chỉ email không được để trống'),
  name: Yup.string().max(255).required('Họ và tên không được để trống'),
  phone: Yup.string()
    .trim()
    .matches(phoneRegExp, 'Số điện thoại không đúng')
    .required('Số điện thoại không được để trống'),
  password: Yup.string()
    .min(8)
    .max(255)
    .required('Mật khẩu không được để trống')
});
