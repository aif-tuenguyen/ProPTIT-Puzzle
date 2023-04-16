import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  useTheme,
  Card,
  TextField,
  Button,
  Typography,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  CircularProgress
} from '@mui/material';

import * as Yup from 'yup';

import { useParams } from 'react-router-dom';
import {
  ArrowBackTwoTone,
  Check,
  CloseTwoTone,
  Edit
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { Category } from 'src/models/category';
import categoryServices from 'src/services/categoryServices';
import { getContentByPage, getPageType, PageType } from 'src/utils';
import UploadFile from 'src/components/UploadFile';
import useNotify from 'src/hooks/useNotify';

function ManagementCategoryCreate() {
  const theme = useTheme();

  const location = useLocation();

  const navigate = useNavigate();

  const PAGE_TYPE = getPageType(location.pathname);

  const { categoryId } = useParams();

  const { notify } = useNotify();

  const [categoryDetail, setCategoryDetail] = useState<Category>(null);

  const getCategoryDetail = async (categoryId: string) => {
    const response = await categoryServices.getDetailCategory(categoryId);

    if (response.status === 200) {
      setCategoryDetail(response.data);
    }
  };

  const { values, handleSubmit, setFieldValue, isSubmitting, touched, errors } =
    useFormik<Category>({
      initialValues: {
        name: '',
        description: '',
        image: undefined
      },
      onSubmit: async (values) => {
        if (PAGE_TYPE === PageType.CREATE) {
          const response = await categoryServices.createCategory(values);

          if (response.status === 200) {
            notify('Tạo mới danh mục thành công', {
              variant: 'success'
            });
            navigate(`/${location.pathname.split('/')[1]}/categories`);
          }
        } else {
          const response = await categoryServices.updateCategory(
            categoryId,
            values
          );

          if (response.status === 200) {
            notify('Cập nhật thông tin danh mục thành công', {
              variant: 'success'
            });
            navigate(`/${location.pathname.split('/')[1]}/categories`);
          }
        }
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Tên danh mục không được để trống')
        // image: Yup.mixed().required('Image is required')
      })
    });

  useEffect(() => {
    if (categoryDetail) {
      setFieldValue('name', categoryDetail?.name);
      setFieldValue('description', categoryDetail?.description);
      setFieldValue('image', categoryDetail?.image);
    }
  }, [categoryDetail]);

  useEffect(() => {
    if (categoryId) {
      getCategoryDetail(categoryId);
    }
  }, [categoryId]);

  const onChangeFieldCategory = (e: any) => {
    const { name, value } = e.target;

    setFieldValue(name, value);
  };

  return (
    <>
      <Helmet>
        <title>
          {getContentByPage(PAGE_TYPE, {
            createText: 'Tạo mới danh mục',
            editText: 'Chỉnh sửa danh mục',
            detailText: 'Chi tiết danh mục'
          })}
        </title>
      </Helmet>
      <Box mb={3} display="flex">
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
                          createText: 'Tạo mới danh mục',
                          editText: 'Chỉnh sửa danh mục',
                          detailText: 'Chi tiết danh mục'
                        })}
                      </Typography>
                      <Typography variant="subtitle2">
                        {getContentByPage(PAGE_TYPE, {
                          createText:
                            'Điền các thông tin dưới đây để tạo mới danh mục',
                          editText:
                            'Chỉnh sửa các thông tin danh mục cần chỉnh sửa',
                          detailText:
                            'Xem chi tiết các thông tin danh mục dưới đây'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    sx={{
                      mt: { xs: 2, sm: 0 },
                      mr: 2
                    }}
                    component={RouterLink}
                    startIcon={<ArrowBackTwoTone />}
                    to={`/${location.pathname.split('/')[1]}/categories`}
                    variant="contained"
                    color="secondary"
                  >
                    {'Trở lại'}
                  </Button>
                  {PAGE_TYPE === PageType.DETAIL ? (
                    <Button
                      sx={{
                        mt: { xs: 2, sm: 0 }
                      }}
                      variant="contained"
                      startIcon={<Edit />}
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/${
                            location.pathname.split('/')[1]
                          }/categories/edit/${categoryId}`
                        )
                      }
                    >
                      Sửa
                    </Button>
                  ) : (
                    <Button
                      sx={{
                        mt: { xs: 2, sm: 0 }
                      }}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size="1rem" />
                        ) : (
                          <Check />
                        )
                      }
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder={'Điền tên của danh mục...'}
                    variant="outlined"
                    error={Boolean(touched.name && errors.name)}
                    required
                    helperText={touched.name && errors.name}
                    value={values?.name}
                    onChange={onChangeFieldCategory}
                    disabled={PAGE_TYPE === PageType.DETAIL}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    name="description"
                    placeholder={'Điền miêu tả của danh mục...'}
                    variant="outlined"
                    error={Boolean(touched.description && errors.description)}
                    required
                    helperText={touched.description && errors.description}
                    value={values?.description}
                    onChange={onChangeFieldCategory}
                    disabled={PAGE_TYPE === PageType.DETAIL}
                  />
                </Grid>
                <Grid item xs={12}>
                  <UploadFile
                    label="Hình ảnh của danh mục"
                    setData={(data: any) => {
                      setFieldValue('image', data);
                    }}
                    accept={{
                      'image/jpeg': [],
                      'image/png': []
                    }}
                    disabled={PAGE_TYPE === PageType.DETAIL}
                    errors={errors}
                    name="image"
                    isRequired
                  />
                  {values?.image && (
                    <Box mt={2}>
                      <ImageListItem>
                        <img
                          src={
                            typeof values?.image === 'string'
                              ? values?.image
                              : URL.createObjectURL(values?.image)
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
                              onClick={() => setFieldValue('image', undefined)}
                              disabled={PAGE_TYPE === PageType.DETAIL}
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
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ManagementCategoryCreate;
