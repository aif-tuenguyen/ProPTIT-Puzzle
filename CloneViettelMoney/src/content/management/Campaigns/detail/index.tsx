import { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import {
  styled,
  Grid,
  Divider,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button,
  useTheme,
  Card,
  MenuItem,
  Select,
  FormHelperText,
  CardHeader,
  Link,
  TablePagination,
  InputAdornment,
  useMediaQuery,
  Avatar,
  CardMedia,
  CardContent,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Switch
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import {
  formatter,
  getContentByPage,
  getLabelStatus,
  getPageType,
  PageType
} from 'src/utils';
import { Campaign } from 'src/models/campaign';
import campaignServices from 'src/services/campaignServices';
import {
  ArrowBackTwoTone,
  Check,
  CloseTwoTone,
  Edit,
  SearchTwoTone
} from '@mui/icons-material';
import { ColumnMyTable } from 'src/components/Table/type';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { Product } from 'src/models/product';
import productServices from 'src/services/productServices';
import useNotify from 'src/hooks/useNotify';
import MyTable from 'src/components/Table';
import facebookServices from 'src/services/facebookServices';
import { red } from '@mui/material/colors';
import UploadFile from 'src/components/UploadFile';
import Footer from 'src/components/Footer';
import Statistics from './Statistics';

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`
);

const ImgContent = styled('img')(
  ({ theme }) => `
      width: 100%;
      height: 140px;
      object-fit: cover;
`
);

function ManagementCampaignDetail() {
  const theme = useTheme();

  const { campaignId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const PAGE_TYPE = getPageType(location.pathname);

  const [campaignDetail, setCampaignDetail] = useState<Campaign>(null);

  const getCampaignDetail = async (campaignId: string) => {
    const response = await campaignServices.getDetailCampaign(campaignId);

    if (response.status === 200) {
      setCampaignDetail(response.data);
    }
  };

  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const getProducts = async (page: number, limit: number, query: string) => {
    try {
      const response = await productServices.getListProducts({
        page,
        limit,
        query,
        status: 'stock'
      });
      if (response.status === 200) {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProducts(page, limit, query);
  }, [limit, page, query]);

  const { values, handleSubmit, setFieldValue, isSubmitting, touched, errors } =
    useFormik<Campaign>({
      initialValues: {
        name: '',
        image: undefined,
        status: 'ON',
        postId: '',
        productIds: []
      },
      onSubmit: async (values) => {
        try {
          if (PAGE_TYPE === PageType.EDIT) {
            const response = await campaignServices.updateCampaign(
              campaignId,
              values
            );
            if (response.status === 200) {
              notify('Update campaign successfully', {
                variant: 'success'
              });
              navigate(`/${location.pathname.split('/')[1]}/campaigns`);
            }
          } else {
            const response = await campaignServices.createCampaign(values);
            if (response.status === 200) {
              notify('Create campaign successfully', {
                variant: 'success'
              });
              navigate(`/${location.pathname.split('/')[1]}/campaigns`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        postId: Yup.string().required('Post ID is required'),
        image: Yup.mixed().required('Image is required'),
        productIds: Yup.array(Yup.string())
          .min(1, 'Please choose a product')
          .required('Product is required')
      })
    });

  useEffect(() => {
    if (campaignDetail) {
      setFieldValue('name', campaignDetail?.name);
      setFieldValue('image', campaignDetail?.image);
      setFieldValue('postId', campaignDetail?.postId);
      setFieldValue('status', campaignDetail?.status);
      setFieldValue('productIds', campaignDetail?.productIds);
    }
  }, [campaignDetail]);

  useEffect(() => {
    if (campaignId) {
      getCampaignDetail(campaignId);
    }
  }, [campaignId]);

  const { notify } = useNotify();

  const [posts, setPosts] = useState([]);

  const [openCreateNewPost, setOpenCreateNewPost] = useState(false);
  const [contentAddNewPost, setContentAddNewPost] = useState('');
  const [imageAddNewPost, setImageAddNewPost] = useState('');

  const [isPosting, setIsPosting] = useState(false);

  const cancelPosting = () => {
    setOpenCreateNewPost(false);
    setContentAddNewPost('');
    setImageAddNewPost('');
    setIsPosting(false);
  };

  const ref = useRef(null);
  const onEmojiClick = (emojiObject, event) => {
    const cursor = ref.current.selectionStart;

    const text =
      contentAddNewPost.slice(0, cursor) +
      emojiObject.emoji +
      contentAddNewPost.slice(cursor);
    setContentAddNewPost(text);
  };

  const postNewFeed = async () => {
    setIsPosting(true);
    const response = await facebookServices.postNewFeed({
      imageUrl: imageAddNewPost,
      caption: contentAddNewPost
    });
    if (response.status === 200) {
      setFieldValue('postId', response.data);

      setPosts((old) => {
        return [
          {
            id: response.data,
            from: posts[0]?.from,
            message: contentAddNewPost,
            full_picture: imageAddNewPost,
            created_time: new Date()
          },
          ...old
        ];
      });

      notify('Đăng bài viết mới thành công', {
        variant: 'success'
      });

      cancelPosting();
    }
    setIsPosting(false);
  };

  const getListPostsOfPage = async () => {
    const response = await facebookServices.getPostsPage();
    if (response.status === 200) {
      const listPosts = response.data?.filter((post) => post.message);
      setPosts(listPosts);
    }
  };

  useEffect(() => {
    getListPostsOfPage();
  }, []);

  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllProducts = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setFieldValue(
      'productIds',
      event.target.checked ? products.map((product) => product.id) : []
    );
  };

  const handleSelectOneProduct = (
    event: ChangeEvent<HTMLInputElement>,
    productId: string
  ): void => {
    if (!values.productIds.includes(productId)) {
      setFieldValue('productIds', [...values.productIds, productId]);
    } else {
      setFieldValue(
        'productIds',
        values.productIds.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage + 1);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const selectedSomeProducts =
    values.productIds.length > 0 && values.productIds.length < products.length;
  const selectedAllProducts = values.productIds.length === products.length;

  const cellProductName = (row: any) => {
    return (
      <Box display="flex" alignItems="center">
        <ImgWrapper src={row.images[0]} />
        <Box
          pl={1}
          sx={{
            width: 250
          }}
        >
          <Link
            component={RouterLink}
            to={`/${location.pathname.split('/')[1]}/products/detail/` + row.id}
            variant="h5"
            target="_blank"
          >
            {row.name}
          </Link>
          <Typography variant="subtitle2" noWrap>
            {row.description}
          </Typography>
        </Box>
      </Box>
    );
  };

  const cellPrice = (row: any) => {
    return (
      <>
        <Typography
          sx={{
            textDecorationLine: row.salePrice !== 0 ? 'line-through' : ''
          }}
        >
          {formatter.format(row.price)}
        </Typography>
        {row.salePrice !== 0 && (
          <Typography>
            <Text color="error">{formatter.format(row.salePrice)}</Text>
          </Typography>
        )}
      </>
    );
  };

  const cellStock = (row: any) => {
    const { label, color } = getLabelStatus(row.status);

    return (
      <Label color={color as any}>
        <b>{label}</b>
      </Label>
    );
  };

  const columns: ColumnMyTable[] = [
    {
      Header: 'Tên sản phẩm',
      accessor: 'name',
      Cell: cellProductName
    },
    {
      Header: 'Giá',
      accessor: 'price',
      Cell: cellPrice
    },
    {
      Header: 'Trạng thái',
      accessor: 'status',
      Cell: cellStock,
      align: 'center'
    }
  ];

  const previewPost = (postId: string) => {
    const postDetail = posts.find((post) => post.id === postId);

    if (postDetail) {
      return (
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {postDetail.from.name[0]}
              </Avatar>
            }
            title={postDetail.from.name}
            subheader={new Date(postDetail.created_time).toLocaleString('vi')}
          />
          <CardContent>
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {postDetail.message}
            </Typography>
          </CardContent>
          {postDetail?.full_picture && (
            <CardMedia
              component="img"
              image={postDetail.full_picture}
              alt={postDetail.message}
            />
          )}
        </Card>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {getContentByPage(PAGE_TYPE, {
            createText: 'Tạo mới chiến dịch',
            editText: 'Chỉnh sửa chiến dịch',
            detailText: 'Chi tiết chiến dịch'
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
            <Box mt={3}>
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
                          createText: 'Tạo mới chiến dịch',
                          editText: 'Chỉnh sửa chiến dịch',
                          detailText: 'Chi tiết chiến dịch'
                        })}
                      </Typography>
                      <Typography variant="subtitle2">
                        {getContentByPage(PAGE_TYPE, {
                          createText:
                            'Hoàn thành các thông tin phía dưới để tạo mới chiến dịch',
                          editText:
                            'Chỉnh sửa thông tin cần chỉnh sửa phía dưới',
                          detailText: 'Xem thông tin chiến dịch ở phía dưới'
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
                    to={`/${location.pathname.split('/')[1]}/campaigns`}
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
                          }/campaigns/edit/${[campaignId]}`
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
          {PAGE_TYPE !== PageType.CREATE && (
            <Grid item xs={12}>
              <Statistics data={campaignDetail} />
            </Grid>
          )}

          <Grid item xs={12}>
            <Card
              sx={{ border: errors?.productIds ? '1px solid #FF1943' : '' }}
            >
              <CardHeader
                title={'Sản phẩm của chiến dịch'}
                subheader={
                  errors?.productIds && (
                    <Typography color="#FF1943">
                      {errors?.productIds}
                    </Typography>
                  )
                }
              />
              <Divider />
              <Grid p={2} container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Box
                      flex={1}
                      p={2}
                      display={{ xs: 'block', md: 'flex' }}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          mb: { xs: 2, md: 0 }
                        }}
                      >
                        <TextField
                          size="small"
                          fullWidth={mobile}
                          onChange={handleQueryChange}
                          value={query}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchTwoTone />
                              </InputAdornment>
                            )
                          }}
                          placeholder={'Tìm kiếm tên sản phẩm...'}
                        />
                      </Box>
                      <TablePagination
                        component="div"
                        count={total}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                      />
                    </Box>
                  </Box>
                  <Divider />
                  {products.length === 0 ? (
                    <Typography
                      sx={{
                        py: 10
                      }}
                      variant="h3"
                      fontWeight="normal"
                      color="text.secondary"
                      align="center"
                    >
                      {'Chúng tôi không tìm thấy bất kì sản phẩm nào'}
                    </Typography>
                  ) : (
                    <MyTable
                      columns={columns}
                      data={products}
                      handleLimitChange={handleLimitChange}
                      handlePageChange={handlePageChange}
                      limit={limit}
                      page={page}
                      handleSelectAllData={handleSelectAllProducts}
                      handleSelectOneData={handleSelectOneProduct}
                      selectedAllData={selectedAllProducts}
                      selectedItems={values.productIds}
                      selectedSomeData={selectedSomeProducts}
                      total={total}
                      disabled={PAGE_TYPE === PageType.DETAIL}
                    />
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title={'Thông tin của chiến dịch'} />
                <Divider />
                <Grid
                  container
                  spacing={3}
                  sx={{
                    p: 2
                  }}
                >
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      required
                      autoFocus
                      helperText={touched.name && errors.name}
                      label={'Tên chiến dịch'}
                      name="name"
                      onChange={(event) => {
                        setFieldValue('name', event.target.value);
                      }}
                      type="text"
                      value={values.name}
                      variant="outlined"
                      disabled={PAGE_TYPE === PageType.DETAIL}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadFile
                      label="Hình ảnh chiến dịch"
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
                                onClick={() =>
                                  setFieldValue('image', undefined)
                                }
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

          <Grid item xs={6}>
            <Grid item xs={12} mb={2}>
              <Card>
                <CardHeader title={'Trạng thái của chiến dịch'} />
                <Divider />
                <Box p={2}>
                  <Switch
                    size="medium"
                    checked={values.status === 'ON'}
                    onChange={(e: any) => {
                      setFieldValue('status', e.target.checked ? 'ON' : 'OFF');
                    }}
                    disabled={PAGE_TYPE === PageType.DETAIL}
                  />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} mb={2}>
              <Card>
                <CardHeader
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={
                        PAGE_TYPE === PageType.DETAIL ||
                        PAGE_TYPE === PageType.EDIT
                      }
                      onClick={() => setOpenCreateNewPost(true)}
                    >
                      {'Thêm bài viết mới'}
                    </Button>
                  }
                  title={'Bài viết cho chiến dịch'}
                />
                <Divider />
                <Grid p={2} container spacing={3}>
                  <Grid item xs={12}>
                    <Select
                      error={Boolean(touched.postId && errors.postId)}
                      fullWidth
                      required
                      autoFocus
                      id="select-post"
                      value={values.postId}
                      name="postId"
                      onChange={(event) => {
                        setFieldValue('postId', event.target.value);
                      }}
                      disabled={
                        PAGE_TYPE === PageType.DETAIL ||
                        PAGE_TYPE === PageType.EDIT
                      }
                    >
                      {posts?.map((post) => (
                        <MenuItem value={post.id} key={post.id}>
                          {post.message}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error>
                      {touched.postId && errors.postId}
                    </FormHelperText>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            {values.postId && (
              <Grid item xs={12}>
                {previewPost(values.postId)}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openCreateNewPost}
        onClose={cancelPosting}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Thêm bài viết mới
          </Typography>
          <Typography variant="subtitle2">
            Điền các thông tin dưới đây để tạo bài viết mới
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Grid container>
            <Grid item flex={1}>
              <Box mr={2}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  label={'Nội dung bài viết'}
                  type="text"
                  variant="outlined"
                  multiline
                  onChange={(e: any) => setContentAddNewPost(e.target.value)}
                  value={contentAddNewPost}
                  rows={10}
                  sx={{ mb: 2 }}
                  inputRef={ref}
                />
                {imageAddNewPost ? (
                  <Box>
                    <ImageListItem sx={{ width: '100%' }}>
                      <ImgContent src={imageAddNewPost} loading="lazy" />
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
                            onClick={() => setImageAddNewPost('')}
                          >
                            <CloseTwoTone />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  </Box>
                ) : (
                  <UploadFile
                    setData={(data: any) => {
                      setImageAddNewPost(data);
                    }}
                    accept={{
                      'image/jpeg': [],
                      'image/png': []
                    }}
                    name="image"
                    isRequired
                  />
                )}
              </Box>
            </Grid>
            <Grid item width="350px">
              <EmojiPicker onEmojiClick={onEmojiClick} height="391px" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3
          }}
        >
          <Button color="secondary" onClick={cancelPosting}>
            Hủy
          </Button>
          <Button
            type="submit"
            startIcon={isPosting ? <CircularProgress size="1rem" /> : null}
            variant="contained"
            onClick={postNewFeed}
            disabled={isPosting}
          >
            Thêm bài viết mới
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManagementCampaignDetail;
