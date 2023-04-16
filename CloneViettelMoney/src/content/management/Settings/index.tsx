import { CloseTwoTone } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import UploadFile from 'src/components/UploadFile';
import useNotify from 'src/hooks/useNotify';
import { Shop } from 'src/models/shop';
import ghnServicers from 'src/services/ghnServicers';
import shopServices from 'src/services/shopServices';
import * as Yup from 'yup';

const ManagementSettings: React.FC = () => {
  const shopId = localStorage.getItem('shopId');

  const [shopDetail, setShopDetail] = useState<Shop>(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const { notify } = useNotify();

  const getShopDetail = async (shopId: string) => {
    const response = await shopServices.getDetailShop(shopId);

    if (response.status === 200) {
      setShopDetail(response.data);
    }
  };

  const getProvinces = async () => {
    const response = await ghnServicers.getProvince();
    if (response.status === 200) {
      setProvinces(response.data.data);
    }
  };

  const getDistricts = async (provinceId: number) => {
    const response = await ghnServicers.getDistrict(provinceId);
    if (response.status === 200) {
      setDistricts(response.data.data);
    }
  };

  const { values, handleSubmit, setFieldValue, isSubmitting, touched, errors } =
    useFormik<Shop>({
      initialValues: {
        shopName: '',
        shopImage: undefined,
        provinceId: undefined,
        provinceName: '',
        districtId: undefined,
        districtName: '',
        paypalClientId: '',
        description: ''
      },
      onSubmit: async (values) => {
        console.log(values);
      },
      validationSchema: Yup.object().shape({
        shopName: Yup.string().required('Name is required'),
        provinceId: Yup.number().required('Province is required'),
        districtId: Yup.number().required('District is required'),
        paypalClientId: Yup.string().required('Paypal Client Id is required'),
        image: Yup.mixed().required('Image is required')
      })
    });

  useEffect(() => {
    if (shopDetail) {
      setFieldValue('shopName', shopDetail?.shopName);
      setFieldValue('shopImage', shopDetail?.shopImage);
      setFieldValue('description', shopDetail?.description);
      setFieldValue('provinceId', shopDetail?.provinceId);
      setFieldValue('provinceName', shopDetail?.provinceName);
      setFieldValue('paypalClientId', shopDetail?.paypalClientId);
      setFieldValue('districtId', shopDetail?.districtId);
      setFieldValue('districtName', shopDetail?.districtName);
    }
  }, [shopDetail]);

  useEffect(() => {
    getProvinces();

    if (values?.provinceId) {
      getDistricts(values.provinceId);
    }
  }, [values?.provinceId]);

  useEffect(() => {
    if (shopId) {
      getShopDetail(shopId);
    }
  }, [shopId]);

  const onChangeFieldShop = (e: any) => {
    const { name, value } = e.target;

    setFieldValue(name, value);
  };

  const saveInfomation = async () => {
    const information = { ...shopDetail, ...values };

    const response = await shopServices.updateShop(shopId, information);

    if (response.status === 200) {
      notify('Update infomation shop successfully', {
        variant: 'success'
      });
    }
  };

  const savePayment = async () => {
    const payment = { ...shopDetail, ...values };

    const response = await shopServices.updateShop(shopId, payment);

    if (response.status === 200) {
      notify('Cập nhật thanh toán shop thành công', {
        variant: 'success'
      });
    }
  };

  const saveAddress = async () => {
    const address = { ...shopDetail, ...values };

    address.provinceId = Number(values.provinceId);
    address.districtId = Number(values.districtId);

    const response = await shopServices.updateShop(shopId, address);

    if (response.status === 200) {
      notify('Cập nhật địa chỉ shop thành công', {
        variant: 'success'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Cài đặt cửa hàng</title>
      </Helmet>
      <Box p={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Thông tin cửa hàng"
                action={
                  <Button variant="contained" onClick={saveInfomation}>
                    Lưu thông tin cửa hàng
                  </Button>
                }
              />
              <Divider />
              <Box p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="shopName"
                      placeholder={'Nhập tên cửa hàng...'}
                      variant="outlined"
                      error={Boolean(touched.shopName && errors.shopName)}
                      required
                      helperText={touched.shopName && errors.shopName}
                      value={values?.shopName}
                      onChange={onChangeFieldShop}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      name="description"
                      placeholder={'Nhập miêu tả cửa hàng...'}
                      variant="outlined"
                      error={Boolean(touched.description && errors.description)}
                      required
                      helperText={touched.description && errors.description}
                      value={values?.description}
                      onChange={onChangeFieldShop}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadFile
                      label="Ảnh cửa hàng"
                      setData={(data: any) => {
                        setFieldValue('shopImage', data);
                      }}
                      accept={{
                        'image/jpeg': [],
                        'image/png': []
                      }}
                      errors={errors}
                      name="shopImage"
                      isRequired
                    />
                    {values?.shopImage && (
                      <Box mt={2}>
                        <ImageListItem sx={{ width: '100%' }}>
                          <img
                            src={
                              typeof values?.shopImage === 'string'
                                ? values?.shopImage
                                : URL.createObjectURL(values?.shopImage)
                            }
                            loading="lazy"
                          />
                          <ImageListItemBar
                            sx={{
                              background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                            }}
                            position="top"
                            actionIcon={
                              <IconButton
                                sx={{ color: 'white' }}
                                onClick={() =>
                                  setFieldValue('image', undefined)
                                }
                              >
                                <CloseTwoTone />
                              </IconButton>
                            }
                            actionPosition="right"
                          />
                        </ImageListItem>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Địa chỉ ví Paypal"
                action={
                  <Button variant="contained" onClick={savePayment}>
                    Lưu địa chỉ ví
                  </Button>
                }
              />
              <Divider />
              <Box p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="paypalClientId"
                      placeholder={'Nhập địa chỉ ví Paypal...'}
                      variant="outlined"
                      error={Boolean(
                        touched.paypalClientId && errors.paypalClientId
                      )}
                      required
                      helperText={
                        touched.paypalClientId && errors.paypalClientId
                      }
                      value={values?.paypalClientId}
                      onChange={onChangeFieldShop}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Địa chỉ cửa hàng"
                action={
                  <Button variant="contained" onClick={saveAddress}>
                    Lưu địa chỉ cửa hàng
                  </Button>
                }
              />
              <Divider />
              <Box p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label-province">
                        Tỉnh/Thành phố
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label-province"
                        id="demo-simple-select"
                        name="provinceId"
                        value={values?.provinceId ? values?.provinceId : 0}
                        label="Tỉnh/Thành phố"
                        onChange={(e) => {
                          const item = provinces?.find(
                            (province) =>
                              province?.ProvinceID === e.target.value
                          );

                          if (item) {
                            setFieldValue('provinceId', item.ProvinceID);
                            setFieldValue('provinceName', item.ProvinceName);
                          }
                        }}
                      >
                        {provinces?.map((province) => (
                          <MenuItem
                            value={province.ProvinceID}
                            key={province.ProvinceID}
                          >
                            {province.ProvinceName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label-district">
                        Quận/Huyện
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label-district"
                        id="demo-simple-select-district"
                        name="districtId"
                        value={values?.districtId ? values?.districtId : 0}
                        label="Quận/Huyện"
                        onChange={(e) => {
                          const item = districts?.find(
                            (district) =>
                              district?.DistrictID === e.target.value
                          );

                          if (item) {
                            setFieldValue('districtId', item.DistrictID);
                            setFieldValue('districtName', item.DistrictName);
                          }
                        }}
                      >
                        {districts?.map((district) => (
                          <MenuItem
                            value={district.DistrictID}
                            key={district.DistrictID}
                          >
                            {district.DistrictName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ManagementSettings;
