import {
  Box,
  Card,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  styled,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Shop } from 'src/models/shop';
import ghnServicers from 'src/services/ghnServicers';
import { formatter } from 'src/utils';
import useNotify from 'src/hooks/useNotify';

const CardClient = styled(Card)(
  ({ theme }) => `
          margin-top: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        `
);

const ImgWrapper = styled('img')(
  ({ theme }) => `
            height: auto;
            width: 70px;
            object-fit: cover;
            border-radius: 10px;
            margin-right: 10px;
      `
);

const PaymentIcon = styled('img')(
  ({ theme }) => `
              height: auto;
              width: 24px;
              object-fit: cover;
              margin-right: 10px;
        `
);

const CartItem = styled(Box)(
  ({ theme }) => `
                padding: ${theme.spacing(1)};
                border: 1px solid #ccc;
                border-radius: 10px;
                margin-top: ${theme.spacing(1)};
            `
);

interface PriceTextProps {
  discount?: boolean;
}

const PriceText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'discount'
})<PriceTextProps>(
  ({ discount, theme }) => `
            font-weight: bold;
            color: ${discount ? '#ff4242' : 'inherit'};
        `
);

const OriginText = styled(Typography)(
  ({ theme }) => `
      text-decoration: line-through;
      font-size: 10px;
      margin-left: ${theme.spacing(1)};
      color: #747474;
          `
);

interface ICheckoutPageProps {
  totalPrice: number;
  totalSalePrice: number;
  checkoutItems: any;
  feeShipment: any;
  setFeeShipment: any;
  information: any;
  setInformation: any;
  serviceId: any;
  setServiceId: any;
  paymentMethod: any;
  setPaymentMethod: any;
  shopDetail: Shop;
}

interface IShipmentInfo {
  height: number;
  length: number;
  weight: number;
  width: number;
}

const CheckoutPage: React.FC<ICheckoutPageProps> = ({
  totalPrice,
  totalSalePrice,
  checkoutItems,
  feeShipment,
  setFeeShipment,
  information,
  setInformation,
  serviceId,
  setServiceId,
  paymentMethod,
  setPaymentMethod,
  shopDetail
}) => {
  const [shipmentInfo, setShipmentInfo] = useState<IShipmentInfo>({
    height: 0,
    length: 0,
    weight: 0,
    width: 0
  });

  const { notify } = useNotify();

  console.log(checkoutItems);

  useEffect(() => {
    let info: IShipmentInfo = {
      height: 0,
      length: 0,
      weight: 0,
      width: 0
    };
    checkoutItems?.forEach((item) => {
      info.height = Math.round(
        Math.max(item?.product?.height || 0, info.height)
      );
      info.length = Math.round(
        Math.max(item?.product?.length || 0, info.length)
      );
      info.weight += item?.product?.weight;
      info.weight = Math.round(info.weight);
      info.width = Math.round(Math.max(item?.product?.width || 0, info.width));
    });

    setShipmentInfo(info);
  }, [checkoutItems]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shipmentServices, setShipmentServices] = useState([]);

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

  const getWards = async (districtId: number) => {
    const response = await ghnServicers.getWard(districtId);
    if (response.status === 200) {
      setWards(response.data.data);
    }
  };

  const getShipmentServices = async (data: {
    from_district: number;
    to_district: number;
  }) => {
    const response = await ghnServicers.getServices(data);

    if (response.status === 200) {
      setShipmentServices(response.data.data);
    }
  };

  const getFeeShipment = async (data: {
    service_id: number;
    insurance_value: number;
    coupon: string | null;
    from_district_id: number;
    to_district_id: number;
    to_ward_code: string;
    height: number;
    length: number;
    weight: number;
    width: number;
  }) => {
    const response = await ghnServicers.getFeeShipment(data);

    if (response.status === 200) {
      setFeeShipment(response.data.data.total);
    }
  };

  const [step, setStep] = useState(1);

  const handleChangeService = (event: any) => {
    setServiceId(Number(event.target.value));
  };

  const handleChangePaymentMethod = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
  };

  const handleChangeInformation = (event: any) => {
    setInformation((old) => {
      return {
        ...old,
        [event.target.name]: event.target.value
      };
    });
  };

  useEffect(() => {
    if (serviceId) {
      getFeeShipment({
        service_id: serviceId,
        from_district_id: shopDetail?.districtId,
        to_district_id: information?.districtId,
        insurance_value: totalSalePrice,
        to_ward_code: information?.wardCode,
        height: shipmentInfo.height,
        length: shipmentInfo.length,
        weight: shipmentInfo.weight,
        width: shipmentInfo.width,
        coupon: null
      });
    }
  }, [serviceId, shipmentInfo, information]);

  useEffect(() => {
    getProvinces();

    if (information?.provinceId) {
      getDistricts(information.provinceId);
    }

    if (information?.districtId) {
      getWards(information.districtId);
      getShipmentServices({
        from_district: shopDetail?.districtId,
        to_district: information?.districtId
      });
    }

    const passInformation =
      information.name &&
      information.phone &&
      information.districtId &&
      information.detailAddress &&
      information.provinceId &&
      information.wardCode;

    if (passInformation) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [information]);

  return (
    <Box>
      <CardClient>
        <CardHeader title="Thông tin mua hàng" />
        <Divider />
        <Box p={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="name"
                variant="outlined"
                label={'Họ và tên'}
                placeholder={'Họ và tên...'}
                required
                value={information?.name}
                onChange={handleChangeInformation}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                variant="outlined"
                label={'Số điện thoại'}
                placeholder={'Số điện thoại...'}
                required
                value={information?.phone}
                onChange={handleChangeInformation}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label-province">
                  Tỉnh/Thành phố
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label-province"
                  id="demo-simple-select"
                  name="provinceId"
                  value={information?.provinceId}
                  label="Tỉnh/Thành phố"
                  onChange={(e) => {
                    const item = provinces?.find(
                      (province) => province?.ProvinceID === e.target.value
                    );

                    if (item) {
                      setInformation((old) => {
                        return {
                          ...old,
                          provinceId: item.ProvinceID,
                          provinceName: item.ProvinceName
                        };
                      });
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label-district">
                  Quận/Huyện
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label-district"
                  id="demo-simple-select-district"
                  name="districtId"
                  value={information?.districtId}
                  label="Quận/Huyện"
                  onChange={(e) => {
                    const item = districts?.find(
                      (district) => district?.DistrictID === e.target.value
                    );

                    if (item) {
                      setInformation((old) => {
                        return {
                          ...old,
                          districtId: item.DistrictID,
                          districtName: item.DistrictName
                        };
                      });
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label-ward">Xã</InputLabel>
                <Select
                  labelId="demo-simple-select-label-ward"
                  id="demo-simple-select-ward"
                  name="wardCode"
                  value={information?.wardCode}
                  label="Xã"
                  onChange={(e) => {
                    const item = wards?.find(
                      (ward) => ward?.WardCode === e.target.value
                    );

                    if (item) {
                      setInformation((old) => {
                        return {
                          ...old,
                          wardCode: item.WardCode,
                          wardName: item.WardName
                        };
                      });
                    }
                  }}
                >
                  {wards?.map((ward) => (
                    <MenuItem value={ward.WardCode} key={ward.WardCode}>
                      {ward.WardName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="detailAddress"
                variant="outlined"
                label={'Chi tiết địa chỉ'}
                placeholder={'Chi tiết địa chỉ...'}
                required
                value={information?.detailAddress}
                onChange={handleChangeInformation}
              />
            </Grid>
          </Grid>
        </Box>
      </CardClient>
      {step > 1 && (
        <>
          <CardClient>
            <CardHeader title="Chọn hình thức giao hàng" />
            <Divider />
            <Box p={2}>
              <RadioGroup
                name="serviceId"
                value={serviceId}
                onChange={handleChangeService}
              >
                {shipmentServices?.map((service) => (
                  <FormControlLabel
                    value={service?.service_id}
                    control={<Radio />}
                    label={service?.short_name}
                    key={service?.service_id}
                  />
                ))}
              </RadioGroup>
              <CartItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography fontWeight="bold">Phí vận chuyển</Typography>
                  <Typography fontWeight="bold">
                    {formatter.format(feeShipment)}
                  </Typography>
                </Box>
                <Divider />
                {checkoutItems?.map((item, index) => (
                  <Box display="flex" mt={1} key={index}>
                    <ImgWrapper src={item?.product?.images[0]} />
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <Typography>{item?.product?.name}</Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>SL: x{item?.quantity}</Typography>
                        <Typography>
                          {formatter.format(
                            item?.product?.salePrice * item?.quantity
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CartItem>
            </Box>
          </CardClient>
          <CardClient>
            <CardHeader title="Chọn phương thức thanh toán" />
            <Divider />
            <Box p={2}>
              <RadioGroup
                name="paymentMethod"
                value={paymentMethod}
                onChange={handleChangePaymentMethod}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <PaymentIcon src="https://cdn.iconscout.com/icon/free/png-256/cash-2650121-2196619.png" />
                      <Typography>Tiền mặt</Typography>
                    </Box>
                  }
                />
                {shopDetail?.paypalClientId && (
                  <>
                    <FormControlLabel
                      value="credit_card"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <PaymentIcon src="https://cdn-icons-png.flaticon.com/512/2695/2695971.png" />
                          <Typography>Thẻ tín dụng</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="paypal"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <PaymentIcon src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" />
                          <Typography>Paypal</Typography>
                        </Box>
                      }
                    />
                  </>
                )}
              </RadioGroup>
            </Box>
          </CardClient>
          <CardClient>
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>Tạm tính</Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <PriceText>{formatter.format(totalSalePrice)}</PriceText>
                  <OriginText>{formatter.format(totalPrice)}</OriginText>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>Phí vận chuyển</Typography>
                <Box>
                  <PriceText>{formatter.format(feeShipment)}</PriceText>
                </Box>
              </Box>
              <Divider />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
              >
                <Typography fontWeight="bold">Tổng tiền</Typography>
                <Box>
                  <PriceText>
                    {formatter.format(totalSalePrice + feeShipment)}
                  </PriceText>
                </Box>
              </Box>
            </Box>
          </CardClient>
        </>
      )}
    </Box>
  );
};

export default CheckoutPage;
