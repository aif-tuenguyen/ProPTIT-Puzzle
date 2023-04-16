import { useState, ChangeEvent } from 'react';

import {
  TextField,
  Grid,
  CardHeader,
  Tab,
  Box,
  Tabs,
  Divider,
  InputAdornment,
  Card,
  styled,
  Select,
  MenuItem
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getLabelStatus, getPageType, PageType } from 'src/utils';
import { ProductStatus } from 'src/models/product';

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
  `
);

interface IAdditionalInfoProps {
  values: any;
  touched: any;
  errors: any;
  onChangeFieldProduct: any;
}

const AdditionalInfo: React.FC<IAdditionalInfoProps> = ({
  values,
  touched,
  errors,
  onChangeFieldProduct
}) => {
  const [currentTab, setCurrentTab] = useState<string>('general');

  const location = useLocation();

  const PAGE_TYPE = getPageType(location.pathname);

  const tabs = [
    { value: 'general', label: 'Chung' },
    { value: 'shipping', label: 'Vận chuyển' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <Card>
      <CardHeader title={'Thông tin khác'} />
      <Divider />
      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Divider />
      <Box p={3}>
        {currentTab === 'general' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="price"
                variant="outlined"
                type="number"
                label={'Giá gốc'}
                placeholder={'Điền giá gốc sản phẩm...'}
                error={Boolean(touched.price && errors.price)}
                required
                helperText={touched.price && errors.price}
                value={values?.price || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="salePrice"
                type="number"
                variant="outlined"
                label={'Giá bán'}
                placeholder={'Điền giá bán sản phẩm...'}
                error={Boolean(touched.salePrice && errors.salePrice)}
                required
                helperText={touched.salePrice && errors.salePrice}
                value={values?.salePrice || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="quantity"
                variant="outlined"
                type="number"
                label={'Số lượng sản phẩm'}
                placeholder={'Điền số lượng của sản phẩm...'}
                error={Boolean(touched.quantity && errors.quantity)}
                required
                helperText={touched.quantity && errors.quantity}
                value={values?.quantity || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Select
                error={Boolean(touched.status && errors.status)}
                fullWidth
                required
                id="select-post"
                value={values.status}
                name="status"
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              >
                <MenuItem value={ProductStatus.STOCK} key={ProductStatus.STOCK}>
                  {getLabelStatus(ProductStatus.STOCK).label}
                </MenuItem>
                <MenuItem
                  value={ProductStatus.INCOMMING}
                  key={ProductStatus.INCOMMING}
                >
                  {getLabelStatus(ProductStatus.INCOMMING).label}
                </MenuItem>
                <MenuItem
                  value={ProductStatus.SOLD_OUT}
                  key={ProductStatus.SOLD_OUT}
                >
                  {getLabelStatus(ProductStatus.SOLD_OUT).label}
                </MenuItem>
              </Select>
            </Grid>
          </Grid>
        )}
        {currentTab === 'shipping' && (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Gram</InputAdornment>
                  )
                }}
                fullWidth
                type="number"
                name="weight"
                variant="outlined"
                label={'Trọng lượng'}
                placeholder={'Điền trọng lượng sản phẩm ...'}
                error={Boolean(touched.weight && errors.weight)}
                required
                helperText={touched.weight && errors.weight}
                value={values?.weight || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">CM</InputAdornment>
                  )
                }}
                fullWidth
                name="height"
                type="number"
                variant="outlined"
                label={'Chiều cao'}
                placeholder={'Điền chiều cao của sản phẩm ...'}
                error={Boolean(touched.height && errors.height)}
                required
                helperText={touched.height && errors.height}
                value={values?.height || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">CM</InputAdornment>
                  )
                }}
                fullWidth
                name="length"
                type="number"
                variant="outlined"
                label={'Chiều dài'}
                placeholder={'Điền chiều dài của sản phẩm ...'}
                error={Boolean(touched.length && errors.length)}
                required
                helperText={touched.length && errors.length}
                value={values?.length || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">CM</InputAdornment>
                  )
                }}
                fullWidth
                name="width"
                type="number"
                variant="outlined"
                label={'Chiều rộng'}
                placeholder={'Điền chiều rộng của sản phẩm...'}
                error={Boolean(touched.width && errors.width)}
                required
                helperText={touched.width && errors.width}
                value={values?.width || ''}
                onChange={onChangeFieldProduct}
                disabled={PAGE_TYPE === PageType.DETAIL}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Card>
  );
};

export default AdditionalInfo;
