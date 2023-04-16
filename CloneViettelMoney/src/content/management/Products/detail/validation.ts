import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  name: Yup.string().required('Tên sản phẩm không được để trống'),
  sku: Yup.string().required('SKU không được để trống'),
  salePrice: Yup.number().required('Giá bán không được để trống'),
  price: Yup.number().required('Giá gốc không được để trống'),
  width: Yup.number().required('Chiều rộng không được để trống'),
  length: Yup.number().required('Chiều dài không được để trống'),
  weight: Yup.number().required('Cân nặng không được để trống'),
  height: Yup.number().required('Chiều cao không được để trống'),
  images: Yup.array().min(1).required('Hình ảnh sản phẩm không được để trống')
});
