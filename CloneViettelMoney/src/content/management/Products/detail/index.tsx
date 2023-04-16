import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  useTheme,
  styled,
  Card,
  TextField,
  Divider,
  CardHeader,
  Button,
  Typography,
  Drawer,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';

import AdditionalInfo from './AdditionalInfo';
import { useParams } from 'react-router-dom';
import { Product, ProductStatus } from 'src/models/product';
import productServices from 'src/services/productServices';
import ReactQuill from 'react-quill';
import {
  ArrowBackTwoTone,
  Check,
  CloseTwoTone,
  Edit
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { Category } from 'src/models/category';
import categoryServices from 'src/services/categoryServices';
import AddNewCategory from './AddNewCategory';
import { productSchema } from './validation';
import UploadFile from 'src/components/UploadFile';
import { getContentByPage, getPageType, PageType } from 'src/utils';
import useNotify from 'src/hooks/useNotify';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-snow .ql-picker {
      color: ${theme.colors.alpha.black[100]};
    }

    .ql-snow .ql-stroke {
      stroke: ${theme.colors.alpha.black[100]};
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

interface CategoryBoxProps {
  active?: boolean;
  disabled?: boolean;
}

const CategoryBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled' && prop !== 'active'
})<CategoryBoxProps>(
  ({ theme, active, disabled }) => `
  display: flex;
  align-items: center;
  margin-right: ${theme.spacing(2)};
  border-radius: 10px;
  border: ${
    active
      ? `2px solid ${theme.colors.primary.main}`
      : `2px solid ${theme.colors.secondary.lighter}`
  };
  padding: ${theme.spacing(2)};
  width: fit-content;
  ${!disabled && 'cursor: pointer;'}
  margin-bottim: ${theme.spacing(2)};
  ${
    !disabled &&
    `&:hover {
      border: 2px solid ${theme.colors.primary.main};
    }`
  }
  
`
);

function ManagementProductCreate() {
  const theme = useTheme();

  const location = useLocation();

  const navigate = useNavigate();

  const PAGE_TYPE = getPageType(location.pathname);

  const { productId } = useParams();

  const { notify } = useNotify();

  const [productDetail, setProductDetail] = useState<Product>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [openCreateCategory, setOpenCreateCategory] = useState(false);

  const getProductDetail = async (productId: string) => {
    const response = await productServices.getDetailProduct(productId);

    if (response.status === 200) {
      setProductDetail(response.data);
    }
  };

  const getCategories = async () => {
    const response = await categoryServices.getListCategories();

    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const { values, handleSubmit, setFieldValue, isSubmitting, touched, errors } =
    useFormik<Product>({
      initialValues: {
        name: '',
        sku: '',
        description: '',
        images: undefined,
        price: undefined,
        salePrice: undefined,
        width: undefined,
        length: undefined,
        weight: undefined,
        height: undefined,
        quantity: undefined,
        status: ProductStatus.STOCK
      },
      onSubmit: async (values) => {
        try {
          if (PAGE_TYPE === PageType.CREATE) {
            const resCreateProduct = await productServices.createProduct(
              values
            );
            if (resCreateProduct.status === 200) {
              notify('Create product successfully', {
                variant: 'success'
              });
              navigate(`/${location.pathname.split('/')[1]}/products`);
            }
          } else {
            const resUpdateProduct = await productServices.updateProduct(
              productId,
              values
            );
            if (resUpdateProduct.status === 200) {
              notify('Update product successfully', {
                variant: 'success'
              });
              navigate(`/${location.pathname.split('/')[1]}/products`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      validationSchema: productSchema
    });

  useEffect(() => {
    if (productDetail) {
      setFieldValue('name', productDetail?.name);
      setFieldValue('sku', productDetail?.sku);
      setFieldValue('description', productDetail?.description);
      setFieldValue('price', productDetail?.price);
      setFieldValue('images', productDetail?.images);
      setFieldValue('salePrice', productDetail?.salePrice);
      setFieldValue('width', productDetail?.width);
      setFieldValue('length', productDetail?.length);
      setFieldValue('weight', productDetail?.weight);
      setFieldValue('height', productDetail?.height);
      setFieldValue('status', productDetail?.status);
      setFieldValue('quantity', productDetail?.quantity);
    }
  }, [productDetail]);

  useEffect(() => {
    if (productId) {
      getProductDetail(productId);
    }
    getCategories();
  }, [productId]);

  const onChangeFieldProduct = (e: any) => {
    const { name, value, type } = e.target;
    setFieldValue(name, type === 'number' ? Number(value) : value);
  };

  const getCategoryAdded = (category: Category) => {
    getCategories();
    setFieldValue('categoryId', category.id);
  };

  return (
    <>
      <Helmet>
        <title>
          {getContentByPage(PAGE_TYPE, {
            createText: 'Thêm mới sản phẩm',
            detailText: 'Chi tiết sản phẩm',
            editText: 'Chỉnh sửa sản phẩm'
          })}
        </title>
      </Helmet>
      <Box mb={3} display="flex">
        <MainContentWrapper>
          <Grid
            sx={{
              px: 4
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="h3" component="h3" gutterBottom>
                          {getContentByPage(PAGE_TYPE, {
                            createText: 'Thêm mới sản phẩm',
                            detailText: 'Chi tiết sản phẩm',
                            editText: 'Chỉnh sửa sản phẩm'
                          })}
                        </Typography>
                        <Typography variant="subtitle2">
                          {getContentByPage(PAGE_TYPE, {
                            createText:
                              'Điền các thông tin phía dưới để tạo mới sản phẩm',
                            detailText:
                              'Phía dưới là chi tiết các thông tin của sản phẩm',
                            editText:
                              'Điều chỉnh các thông tin cần chỉnh sửa ở phía dưới'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button
                      sx={{
                        mt: { xs: 2, sm: 0 }
                      }}
                      component={RouterLink}
                      startIcon={<ArrowBackTwoTone />}
                      to={`/${location.pathname.split('/')[1]}/products`}
                      variant="contained"
                      color="secondary"
                    >
                      Trở lại
                    </Button>
                    {PAGE_TYPE === PageType.DETAIL ? (
                      <Button
                        sx={{
                          mt: { xs: 2, sm: 0 },
                          ml: 2
                        }}
                        variant="contained"
                        startIcon={<Edit />}
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/${
                              location.pathname.split('/')[1]
                            }/products/edit/${[productId]}`
                          )
                        }
                      >
                        Sửa
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          mt: { xs: 2, sm: 0 },
                          ml: 2
                        }}
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress size="1rem" />
                          ) : (
                            <Check />
                          )
                        }
                        disabled={isSubmitting}
                        variant="contained"
                        onClick={() => handleSubmit()}
                      >
                        Lưu
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label={'Name'}
                      placeholder={'Điền tên sản phẩm...'}
                      variant="outlined"
                      error={Boolean(touched.name && errors.name)}
                      required
                      helperText={touched.name && errors.name}
                      value={values?.name}
                      onChange={onChangeFieldProduct}
                      disabled={PAGE_TYPE === PageType.DETAIL}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="sku"
                      variant="outlined"
                      label={'SKU'}
                      placeholder={'Điền SKU...'}
                      error={Boolean(touched.sku && errors.sku)}
                      required
                      helperText={touched.sku && errors.sku}
                      value={values?.sku}
                      onChange={onChangeFieldProduct}
                      disabled={
                        PAGE_TYPE === PageType.DETAIL ||
                        PAGE_TYPE === PageType.EDIT
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <EditorWrapper>
                      <ReactQuill
                        value={values?.description}
                        onChange={(value) => {
                          setFieldValue('description', value);
                        }}
                        readOnly={PAGE_TYPE === PageType.DETAIL}
                        placeholder="Điền miêu tả của sản phẩm"
                      />
                    </EditorWrapper>
                  </Grid>
                  <Grid item xs={12}>
                    <UploadFile
                      label="Hình ảnh của sản phẩm"
                      setData={(data: any) => {
                        setFieldValue('images', data);
                      }}
                      accept={{
                        'image/jpeg': [],
                        'image/png': []
                      }}
                      multiple
                      disabled={PAGE_TYPE === PageType.DETAIL}
                      errors={errors}
                      name="images"
                      isRequired
                    />

                    {!!values?.images && (
                      <ImageList cols={3}>
                        {values?.images?.map((item, index) => (
                          <ImageListItem key={index}>
                            <img
                              src={
                                typeof item === 'string'
                                  ? item
                                  : URL.createObjectURL(item)
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
                                    setFieldValue(
                                      'images',
                                      values?.images.filter((i) => i !== item)
                                    )
                                  }
                                  disabled={PAGE_TYPE === PageType.DETAIL}
                                >
                                  <CloseTwoTone />
                                </IconButton>
                              }
                              actionPosition="right"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setOpenCreateCategory(true)}
                      disabled={PAGE_TYPE === PageType.DETAIL}
                    >
                      {'Thêm mới danh mục'}
                    </Button>
                  }
                  title={'Các danh mục'}
                />
                <Divider />
                <Box p={2} display="flex" gap={3} flexWrap="wrap">
                  {categories?.map((category) => {
                    return (
                      <CategoryBox
                        key={category.id}
                        active={category.id === values.categoryId}
                        onClick={() => {
                          if (PAGE_TYPE !== PageType.DETAIL) {
                            if (values.categoryId === category.id) {
                              setFieldValue('categoryId', '');
                            } else {
                              setFieldValue('categoryId', category.id);
                            }
                          }
                        }}
                        disabled={PAGE_TYPE === PageType.DETAIL}
                      >
                        <Box
                          sx={{
                            width: '50px',
                            height: '50px',
                            marginRight: 2
                          }}
                        >
                          <img
                            src={category.image}
                            loading="lazy"
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                        <Box
                          pl={1}
                          sx={{
                            width: 150
                          }}
                        >
                          <Typography variant="h5">{category.name}</Typography>
                          <Typography variant="subtitle2" noWrap>
                            {category.description}
                          </Typography>
                        </Box>
                      </CategoryBox>
                    );
                  })}
                </Box>
                <Drawer
                  anchor="right"
                  open={openCreateCategory}
                  onClose={() => setOpenCreateCategory(false)}
                >
                  <AddNewCategory
                    getCategoryAdded={getCategoryAdded}
                    onClose={() => setOpenCreateCategory(false)}
                  />
                </Drawer>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <AdditionalInfo
                values={values}
                touched={touched}
                errors={errors}
                onChangeFieldProduct={onChangeFieldProduct}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

export default ManagementProductCreate;
