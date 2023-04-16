import {
  ArrowBackIos,
  CampaignOutlined,
  CategoryOutlined,
  ExpandLess,
  Home,
  HomeOutlined,
  Receipt,
  ReceiptOutlined,
  Search,
  ShoppingCartOutlined
} from '@mui/icons-material';
import CampaignIcon from '@mui/icons-material/Campaign';
import CategoryIcon from '@mui/icons-material/Category';
import {
  Badge,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Drawer,
  Grid,
  InputAdornment,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Logo from 'src/components/Logo';
import { Product } from 'src/models/product';
import { Template } from 'src/models/template';
import productServices from 'src/services/productServices';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductItem from './ProductItem';
import CartPage from './CartPage';
import { formatter } from 'src/utils';
import CheckoutPage from './CheckoutPage';
import { useSearchParams } from 'react-router-dom';
import categoryServices from 'src/services/categoryServices';
import { Category } from 'src/models/category';
import OrderItem from './OrderItem';
import {
  Information,
  Order,
  OrderStatus,
  OrderWithSender,
  PaymentMethod
} from 'src/models/order';
import { Campaign } from 'src/models/campaign';
import campaignServices from 'src/services/campaignServices';
import ProductDetail from './ProductDetail';
import CampaignItem from './CampaignItem';
import CampaignDetail from './CampaignDetail';
import useNotify from 'src/hooks/useNotify';
import { Shop } from 'src/models/shop';
import shopServices from 'src/services/shopServices';
import { Customer } from 'src/models/customer';
import customerServices from 'src/services/customerServices';
import orderServices from 'src/services/orderServices';
import PaymentPage from './PaymentPage';
import OrderDetail from './OrderDetail';

const HeaderBox = styled(Box)(
  ({ theme }) => `
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 10;
    `
);

const OrderBox = styled(Box)(
  ({ theme }) => `
        height: 105px;
        position: sticky;
        top: 0;
        z-index: 10;
    `
);

interface StyledTextFieldProps {
  height?: string;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'height'
})<StyledTextFieldProps>(
  ({ height, theme }) => `
  .MuiInputBase-root {
    background-color: white;
    height: ${height ? height : 'auto'};
  }
`
);

const CategoryListBox = styled(Box)(
  ({ theme }) => `
          display: flex;
          align-items: flex-start;
          gap: ${theme.spacing(3)};
          padding: ${theme.spacing(2)};
          overflow-x: auto;

          &::-webkit-scrollbar {
            display: none;
        }
      `
);

const TabsOrderBox = styled(Tabs)(
  ({ theme }) => `
    overflow-x: auto;

    .MuiTabs-scroller {
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  `
);

const MenuBottom = styled(Box)(
  ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacing(2)};
      position: fixed;
      background-color: white;
      bottom: 0;
      left: 0;
      height: 60px;
      width: 100%;
      `
);

interface ImgWrapperProps {
  height?: string;
}

const ImgWrapper = styled('img')<ImgWrapperProps>(
  ({ height, theme }) => `
        height: ${height ? height : theme.spacing(18)};
        width: 100%;
        object-fit: cover;
        border-radius: 10px;
  `
);

const CategoryItemImg = styled('img')(
  ({ theme }) => `
          height: 40px;
          width: 40px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 8px;
    `
);

const CardClient = styled(Card)(
  ({ theme }) => `
      margin-top: ${theme.spacing(1)};
      margin-bottom: ${theme.spacing(1)};
    `
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const getValueOrderStatus = (index: number) => {
  switch (index) {
    case 0:
      return '';
    case 1:
      return 'open';
    case 2:
      return 'confirmed';
    case 3:
      return 'completed';
    default:
      return 'cancelled';
  }
};

const CLientPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shopId = searchParams.get('shopId');

  const facebookUserId = searchParams.get('facebookUserId');

  const campaignIdParams = searchParams.get('campaignId');

  const menuParams = searchParams.get('menu');

  const orderIdParams = searchParams.get('orderId');

  const [path, setPath] = useState('home');

  const [menu, setMenu] = useState('home');

  const [tabOrder, setTabOrder] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabOrder(newValue);
  };

  const cartStorage = localStorage.getItem('cart');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customerDetail, setCustomerDetail] = useState<Customer>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDone, setOrderDone] = useState<any>();

  useEffect(() => {
    if (menuParams) {
      setPath('orders');
      setMenu('orders');
    } else if (campaignIdParams) {
      setPath(`campaignDetail/${campaignIdParams}`);
      setMenu('campaigns');
    } else if (orderIdParams) {
      setPath(`orderDetail/${orderIdParams}`);
    }
  }, [campaignIdParams, menuParams, orderIdParams]);

  const { notify } = useNotify();

  const getProducts = async () => {
    try {
      const response = await productServices.getListProductsClient(shopId);
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getOrders = async (
    shopId: string,
    facebookUserId: string,
    status?: any
  ) => {
    try {
      const response = await orderServices.getListOrdersClient({
        shopId,
        facebookUserId,
        status
      });
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomerDetail = async (facebookUserId: string) => {
    try {
      const response = await customerServices.getCustomerByFacebookUserId(
        facebookUserId
      );
      if (response.status === 200) {
        setCustomerDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (facebookUserId) {
      getCustomerDetail(facebookUserId);
    }
  }, [facebookUserId]);

  useEffect(() => {
    if (facebookUserId && shopId) {
      getOrders(shopId, facebookUserId, getValueOrderStatus(tabOrder));
    }
  }, [facebookUserId, shopId, tabOrder, path]);

  const getCategories = async () => {
    try {
      const response = await categoryServices.getListCategoriesClient(shopId);
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCampaigns = async () => {
    try {
      const response = await campaignServices.getListCampaignsClient(shopId);
      if (response.status === 200) {
        setCampaigns(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCategories();
    getCampaigns();
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  const [isShowCartDetail, setShowCartDetail] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (path !== 'cart' && path !== 'checkout') {
      setSelectedItems([]);
    }
  }, [path]);

  const [cart, setCart] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalSalePrice, setTotalSalePrice] = useState(0);
  const [feeShipment, setFeeShipment] = useState(0);
  const [information, setInformation] = useState<Information>({
    name: '',
    detailAddress: '',
    phone: '',
    districtId: undefined,
    districtName: '',
    provinceId: undefined,
    provinceName: '',
    wardCode: '',
    wardName: ''
  });
  const [serviceId, setServiceId] = useState<number>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const [productDetail, setProductDetail] = useState<Product>();
  const [campaignDetail, setCampaignDetail] = useState<Campaign>();
  const [shopDetail, setShopDetail] = useState<Shop>();
  const [orderDetail, setOrderDetail] = useState<any>();

  const [checkoutItems, setCheckoutItems] = useState([]);

  const productId =
    path.includes('productDetail') && path.includes('campaignId')
      ? path.substring(path.indexOf('/') + 1, path.indexOf('?'))
      : path.includes('productDetail') && !path.includes('campaignId')
      ? path.substring(path.indexOf('/') + 1)
      : '';

  const campaignProductId =
    path.includes('productDetail') && path.includes('campaignId')
      ? path.substring(path.indexOf('=') + 1)
      : '';

  const campaignId = path.includes('campaignDetail')
    ? path.substring(path.indexOf('/') + 1)
    : '';

  const orderId = path.includes('orderDetail')
    ? path.substring(path.indexOf('/') + 1)
    : '';

  const getProductDetail = async (productId: string) => {
    try {
      const response = await productServices.getDetailProductClient(productId);
      if (response.status === 200) {
        setProductDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getOrderDetail = async (orderId: string) => {
    try {
      const response = await orderServices.getDetailOrderClient(orderId);
      if (response.status === 200) {
        setOrderDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCampaignDetail = async (campaignId: string) => {
    try {
      const response = await campaignServices.getDetailCampaignClient(
        campaignId
      );
      if (response.status === 200) {
        setCampaignDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getShopDetail = async (shopId: string) => {
    try {
      const response = await shopServices.getDetailShopClient(shopId);
      if (response.status === 200) {
        setShopDetail(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (shopId) {
      getShopDetail(shopId);
    }
  }, [shopId]);

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId);
    }
  }, [orderId, path]);

  useEffect(() => {
    if (customerDetail) {
      setInformation({
        name: customerDetail.name,
        detailAddress: customerDetail.detailAddress,
        districtId: customerDetail.districtId,
        phone: customerDetail.phone,
        provinceId: customerDetail.provinceId,
        wardCode: customerDetail.wardCode,
        provinceName: customerDetail.provinceName,
        wardName: customerDetail.wardName,
        districtName: customerDetail.districtName
      });
    }
  }, [customerDetail]);

  useEffect(() => {
    if (campaignId) {
      getCampaignDetail(campaignId);
    }
  }, [campaignId, path]);

  useEffect(() => {
    if (productId) {
      getProductDetail(productId);
    }
  }, [productId, path]);

  const addToCart = () => {
    const index = cart?.findIndex((c) => c.product.id === productDetail?.id);

    if (index !== -1) {
      setCart((cart) => {
        const newCart = [...cart];

        newCart[index].quantity += 1;

        if (
          path.includes('productDetail') &&
          path.includes('campaignId') &&
          campaignProductId
        ) {
          newCart[index].campaignId = campaignProductId;
        }

        localStorage.setItem(
          'cart',
          JSON.stringify(
            newCart.map((item) => {
              return {
                productId: item.product.id,
                quantity: item.quantity,
                ...(item.campaignId && {
                  campaignId: campaignProductId
                })
              };
            })
          )
        );

        return newCart;
      });
    } else {
      setCart((cart) => {
        const newCart = [...cart];

        const item = {
          product: productDetail,
          quantity: 1,
          ...(path.includes('productDetail') &&
            path.includes('campaignId') &&
            campaignProductId && {
              campaignId: campaignProductId
            })
        };

        newCart.push(item);

        localStorage.setItem(
          'cart',
          JSON.stringify(
            newCart.map((item) => {
              return {
                productId: item.product.id,
                quantity: item.quantity,
                ...(item.campaignId && {
                  campaignId: campaignProductId
                })
              };
            })
          )
        );

        return newCart;
      });
    }

    notify('Thêm vào giỏ hàng thành công', {
      variant: 'success'
    });
  };

  const handleOrder = async () => {
    const dataPlaceOrder: OrderWithSender = {
      paymentMethod,
      paymentTotal: totalSalePrice + feeShipment,
      shipmentPrice: feeShipment,
      fromDistrictId: shopDetail.districtId,
      toDistrictId: information.districtId,
      serviceId,
      products: checkoutItems,
      sender: {
        facebookUserId,
        ...information
      },
      shopId,
      totalPrice,
      totalSalePrice
    };

    const response = await orderServices.placeOrder(dataPlaceOrder);

    if (response.status === 200) {
      const newCart = cart.filter((c) => {
        const index = checkoutItems.findIndex(
          (cItem) => cItem.product.id !== c.product.id
        );
        return index !== -1;
      });

      setCart(newCart);

      localStorage.setItem(
        'cart',
        JSON.stringify(
          newCart.map((item) => {
            return {
              productId: item.product.id,
              quantity: item.quantity
            };
          })
        )
      );

      setOrderDone(response.data);

      if (paymentMethod === 'paypal' || paymentMethod === 'credit_card') {
        setPath('payment');
      } else {
        notify('Đặt hàng thành công!', {
          variant: 'success'
        });
        getOrders(shopId, facebookUserId, getValueOrderStatus(tabOrder));
        setPath('orders');
        setMenu('orders');
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'Highlight',
        padding: 1
      }}
      flexGrow={1}
    >
      {path === 'orders' ? (
        <OrderBox
          sx={{
            backgroundColor: 'Highlight'
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <ArrowBackIos
              fontSize="medium"
              sx={{ marginX: 2 }}
              onClick={() => {
                setMenu('home');
                setPath('home');
              }}
            />
            <Typography sx={{ whiteSpace: 'nowrap', mr: 2 }} fontWeight="bold">
              My orders
            </Typography>
            <StyledTextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ marginY: 1 }}
              placeholder="What are you looking for today?"
              fullWidth
              height="40px"
            />
          </Box>
          <TabsOrderBox
            value={tabOrder}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Tất cả" {...a11yProps(0)} />
            <Tab label="Chờ xác nhận" {...a11yProps(1)} />
            <Tab label="Đã xác nhận" {...a11yProps(2)} />
            <Tab label="Hoàn thành" {...a11yProps(3)} />
            <Tab label="Đã hủy" {...a11yProps(4)} />
          </TabsOrderBox>
        </OrderBox>
      ) : (
        <HeaderBox
          sx={{
            backgroundColor: 'Highlight'
          }}
        >
          {path === 'home' ? (
            <Logo />
          ) : (
            <ArrowBackIos
              fontSize="medium"
              sx={{ marginX: 2 }}
              onClick={() => {
                setMenu('home');
                setPath('home');
              }}
            />
          )}

          {path === 'home' ? (
            <Typography fontWeight="bold">{shopDetail?.shopName}</Typography>
          ) : path === 'cart' ? (
            <Typography fontWeight="bold" sx={{ flex: 1 }}>
              Cart
            </Typography>
          ) : path === 'checkout' ? (
            <Typography fontWeight="bold" sx={{ flex: 1 }}>
              Checkout
            </Typography>
          ) : path.includes('productDetail') ? (
            <></>
          ) : path.includes('orderDetail') ? (
            <Typography fontWeight="bold" sx={{ flex: 1 }}>
              {orderDetail?.id}
            </Typography>
          ) : (
            <StyledTextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              sx={{ marginY: 1 }}
              placeholder="What are you looking for today?"
              fullWidth
              height={path === 'home' ? '' : '40px'}
            />
          )}
          {path !== 'orders' &&
            path !== 'cart' &&
            path !== 'checkout' &&
            !path.includes('orderDetail') && (
              <Badge
                badgeContent={
                  (cartStorage && JSON.parse(cartStorage)?.length) || 0
                }
                color="error"
                sx={{ marginX: 2 }}
              >
                <ShoppingCartOutlined
                  fontSize="medium"
                  onClick={() => setPath('cart')}
                />
              </Badge>
            )}
        </HeaderBox>
      )}

      {path === 'home' && (
        <StyledTextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ marginY: 1 }}
          placeholder="What are you looking for today?"
          fullWidth
        />
      )}
      {path === 'home' && (
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {campaigns?.map((campaign) => (
            <SwiperSlide
              key={campaign.id}
              onClick={() => {
                setPath(`campaignDetail/${campaign.id}`);
              }}
            >
              <ImgWrapper src={campaign.image} alt={campaign.name} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {path === 'home' && !!categories?.length && (
        <CardClient>
          <CategoryListBox>
            {categories?.map((item) => (
              <Box
                key={item.id}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <CategoryItemImg src={item.image} alt={item.name} />
                <Typography align="center">{item.name}</Typography>
              </Box>
            ))}
          </CategoryListBox>
        </CardClient>
      )}
      {path === 'orders' ? (
        <Box>
          <TabPanel value={tabOrder} index={0}>
            {!!orders?.length ? (
              orders?.map((order, index) => (
                <OrderItem orderDetail={order} key={index} setPath={setPath} />
              ))
            ) : (
              <Box
                py={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography variant="h4">Danh sách đang trống</Typography>
                <Typography>
                  Mời bạn khám phá các sản phẩm và ưu đãi đang diễn ra
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setMenu('products');
                    setPath('products');
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={tabOrder} index={1}>
            {!!orders?.length ? (
              orders?.map((order, index) => (
                <OrderItem orderDetail={order} key={index} setPath={setPath} />
              ))
            ) : (
              <Box
                py={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography variant="h4">Danh sách đang trống</Typography>
                <Typography>
                  Mời bạn khám phá các sản phẩm và ưu đãi đang diễn ra
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setMenu('products');
                    setPath('products');
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={tabOrder} index={2}>
            {!!orders?.length ? (
              orders?.map((order, index) => (
                <OrderItem orderDetail={order} key={index} setPath={setPath} />
              ))
            ) : (
              <Box
                py={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography variant="h4">Danh sách đang trống</Typography>
                <Typography>
                  Mời bạn khám phá các sản phẩm và ưu đãi đang diễn ra
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setMenu('products');
                    setPath('products');
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={tabOrder} index={3}>
            {!!orders?.length ? (
              orders?.map((order, index) => (
                <OrderItem orderDetail={order} key={index} setPath={setPath} />
              ))
            ) : (
              <Box
                py={10}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Typography variant="h4">Danh sách đang trống</Typography>
                <Typography>
                  Mời bạn khám phá các sản phẩm và ưu đãi đang diễn ra
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    setMenu('products');
                    setPath('products');
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            )}
          </TabPanel>
        </Box>
      ) : path === 'cart' ? (
        <CartPage
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          cart={cart}
          setCart={setCart}
          setTotalPrice={setTotalPrice}
          setTotalSalePrice={setTotalSalePrice}
        />
      ) : path === 'checkout' ? (
        <CheckoutPage
          totalPrice={totalPrice}
          totalSalePrice={totalSalePrice}
          checkoutItems={checkoutItems}
          feeShipment={feeShipment}
          setFeeShipment={setFeeShipment}
          information={information}
          setInformation={setInformation}
          serviceId={serviceId}
          setServiceId={setServiceId}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          shopDetail={shopDetail}
        />
      ) : path.includes('productDetail') ? (
        <ProductDetail productDetail={productDetail} />
      ) : path === 'campaigns' ? (
        <CardClient>
          <CardHeader title="Danh sách campaigns" />
          <Divider />
          <Grid container sx={{ flexGrow: 1, padding: 1 }} spacing={1}>
            {campaigns?.map((campaign) => (
              <CampaignItem
                campaign={campaign}
                setPath={setPath}
                key={campaign.id}
              />
            ))}
          </Grid>
        </CardClient>
      ) : path.includes('campaignDetail') ? (
        <CampaignDetail campaignDetail={campaignDetail} setPath={setPath} />
      ) : path === 'payment' ? (
        <PaymentPage
          paypalClientId={shopDetail?.paypalClientId}
          total={totalSalePrice + feeShipment}
          order={orderDone}
          setPath={setPath}
          setMenu={setMenu}
        />
      ) : path.includes('orderDetail') ? (
        <OrderDetail
          setPath={setPath}
          orderDetail={orderDetail}
          setOrderDone={setOrderDone}
          setTotalSalePrice={setTotalSalePrice}
          setFeeShipment={setFeeShipment}
          getShopDetail={getShopDetail}
        />
      ) : (
        <CardClient>
          {path === 'home' && (
            <>
              <CardHeader title="Gợi ý hôm nay" />
              <Divider />
            </>
          )}
          <Grid container sx={{ flexGrow: 1, padding: 1 }} spacing={1}>
            {products?.map((product) => (
              <ProductItem
                product={product}
                setPath={setPath}
                key={product.id}
              />
            ))}
          </Grid>
        </CardClient>
      )}

      <Box height="60px"></Box>

      <MenuBottom>
        <Drawer
          anchor="bottom"
          open={isShowCartDetail}
          onClose={() => setShowCartDetail(false)}
        >
          cai nay show chi tiet
        </Drawer>
        {path === 'cart' ? (
          <>
            <Box>
              <Typography>Tổng cộng</Typography>
              {!!selectedItems.length ? (
                <Typography
                  color="rgb(255, 66, 78)"
                  fontSize="medium"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                >
                  {formatter.format(totalSalePrice)}
                  <ExpandLess onClick={() => setShowCartDetail(true)} />
                </Typography>
              ) : (
                <Typography color="rgb(255, 66, 78)">
                  Vui lòng chọn sản phẩm
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              disabled={!selectedItems.length}
              onClick={() => {
                setPath('checkout');

                const itemsCheckout = cart.filter((item) =>
                  selectedItems.includes(item.product.id)
                );

                setCheckoutItems(itemsCheckout);
              }}
            >
              Checkout({selectedItems.length})
            </Button>
          </>
        ) : path === 'checkout' ? (
          <>
            <Box>
              <Typography>Tổng tien</Typography>
              <Typography
                color="rgb(255, 66, 78)"
                fontSize="medium"
                fontWeight="bold"
                display="flex"
                alignItems="center"
              >
                {formatter.format(totalSalePrice + feeShipment)}
                <ExpandLess onClick={() => setShowCartDetail(true)} />
              </Typography>
            </Box>
            <Button variant="contained" color="error" onClick={handleOrder}>
              Order
            </Button>
          </>
        ) : path.includes('productDetail') ? (
          <>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={addToCart}
            >
              Add to cart
            </Button>
          </>
        ) : (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              onClick={() => {
                setMenu('home');
                setPath('home');
              }}
            >
              {menu === 'home' ? <Home color="primary" /> : <HomeOutlined />}
              <Typography
                fontSize="12px"
                color={menu === 'home' ? '#5569ff' : 'inherit'}
              >
                Home
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              onClick={() => {
                setMenu('products');
                setPath('products');
              }}
            >
              {menu === 'products' ? (
                <CategoryIcon color="info" />
              ) : (
                <CategoryOutlined />
              )}
              <Typography
                fontSize="12px"
                color={menu === 'products' ? '#5569ff' : 'inherit'}
              >
                Products
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              onClick={() => {
                setMenu('campaigns');
                setPath('campaigns');
              }}
            >
              {menu === 'campaigns' ? (
                <CampaignIcon color="info" />
              ) : (
                <CampaignOutlined />
              )}
              <Typography
                fontSize="12px"
                color={menu === 'campaigns' ? '#5569ff' : 'inherit'}
              >
                Campaigns
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              onClick={() => {
                setMenu('orders');
                setPath('orders');
              }}
            >
              {menu === 'orders' ? (
                <Receipt color="info" />
              ) : (
                <ReceiptOutlined />
              )}
              <Typography
                fontSize="12px"
                color={menu === 'orders' ? '#5569ff' : 'inherit'}
              >
                Orders
              </Typography>
            </Box>
          </>
        )}
      </MenuBottom>
    </Box>
  );
};

export default CLientPage;
