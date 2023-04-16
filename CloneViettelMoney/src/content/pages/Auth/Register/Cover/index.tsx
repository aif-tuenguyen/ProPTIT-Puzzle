import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Divider,
  Link,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  IconButton,
  Typography,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTRegister from '../RegisterJWT';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import Scrollbar from 'src/components/Scrollbar';
import Logo from 'src/components/LogoSign';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';

const icons = {
  Cart: '/static/images/logo/cart.svg',
  Facebook: '/static/images/logo/facebook.svg',
  Shop: '/static/images/logo/shop.svg',
  Paypal: '/static/images/logo/paypal.svg'
};

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
`
);

const MainContent = styled(Box)(
  ({ theme }) => `
    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 0 0 0 500px;
    }
    width: 100%;
    display: flex;
    align-items: center;
`
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 500px;
  background: ${theme.colors.gradients.blue3};
`
);

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(6)};
`
);

const CardImg = styled(Card)(
  ({ theme }) => `
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 11px solid ${theme.colors.alpha.trueWhite[10]};
    transition: ${theme.transitions.create(['border'])};
    width: ${theme.spacing(16)};
    height: ${theme.spacing(16)};
    margin-bottom: ${theme.spacing(3)};
`
);

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[50]};
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};
        border-radius: 100px;
        transition: ${theme.transitions.create(['background', 'color'])};

        &:hover {
          color: ${theme.colors.alpha.trueWhite[100]};
          background: ${theme.colors.alpha.trueWhite[10]};
        }
`
);

const LogoWrapper = styled(Box)(
  ({ theme }) => `
    position: fixed;
    left: ${theme.spacing(4)};
    top: ${theme.spacing(4)};
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
);

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      background: ${theme.colors.alpha.trueWhite[10]};
`
);

const ListItemTextWrapper = styled(ListItemText)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
);
const ListItemIconWrapper = styled(ListItemIcon)(
  ({ theme }) => `
      color: ${theme.colors.success.main};
      min-width: 32px;
`
);

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
      .swiper-pagination {
        .swiper-pagination-bullet {
          background: ${theme.colors.alpha.trueWhite[30]};
          opacity: 1;
          transform: scale(1);

          &.swiper-pagination-bullet-active {
            background: ${theme.colors.alpha.trueWhite[100]};
            width: 16px;
            border-radius: 6px;
          }
        }
      }
`
);

function RegisterCover() {
  const { method } = useAuth() as any;

  return (
    <>
      <Helmet>
        <title>Đăng kí tài khoản</title>
      </Helmet>
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: 'none', md: 'inline-block' }
          }}
        >
          <Scrollbar>
            <SidebarContent>
              <Box mb={2} display="flex" justifyContent="center">
                <SwipeIndicator className="MuiSwipe-root MuiSwipe-left">
                  <ChevronLeftTwoToneIcon fontSize="large" />
                </SwipeIndicator>
                <SwipeIndicator className="MuiSwipe-root MuiSwipe-right">
                  <ChevronRightTwoToneIcon fontSize="large" />
                </SwipeIndicator>
              </Box>
              <TypographyPrimary
                align="center"
                variant="h3"
                sx={{
                  mb: 4,
                  px: 8
                }}
              >
                Chào mừng đến với Social Ecommerce
              </TypographyPrimary>
              <SwiperWrapper>
                <Swiper
                  spaceBetween={30}
                  slidesPerView={1}
                  loop
                  navigation={{
                    nextEl: '.MuiSwipe-right',
                    prevEl: '.MuiSwipe-left'
                  }}
                  // @ts-ignore
                  modules={[Navigation, Pagination]}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true
                  }}
                >
                  <SwiperSlide>
                    <Box textAlign="center">
                      <CardImg>
                        <img height={80} alt="Cart" src={icons['Cart']} />
                      </CardImg>
                      <TypographyPrimary
                        align="center"
                        variant="h3"
                        sx={{
                          mb: 2
                        }}
                      >
                        Giỏ hàng
                      </TypographyPrimary>
                      <TypographySecondary
                        align="center"
                        variant="subtitle2"
                        sx={{
                          mb: 5
                        }}
                      >
                        Hệ thống hỗ trợ mua sắm như các trang Thương mại điện tử
                      </TypographySecondary>
                    </Box>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box textAlign="center">
                      <CardImg>
                        <img
                          height={80}
                          alt="Facebook"
                          src={icons['Facebook']}
                        />
                      </CardImg>
                      <TypographyPrimary
                        align="center"
                        variant="h3"
                        sx={{
                          mb: 2
                        }}
                      >
                        Facebook
                      </TypographyPrimary>
                      <TypographySecondary
                        align="center"
                        variant="subtitle2"
                        sx={{
                          mb: 5
                        }}
                      >
                        Hệ thống hỗ trợ người dùng mua hàng trực tiếp trên mạng
                        xã hội Facebook
                      </TypographySecondary>
                    </Box>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box textAlign="center">
                      <CardImg>
                        <img height={80} alt="Shop" src={icons['Shop']} />
                      </CardImg>
                      <TypographyPrimary
                        align="center"
                        variant="h3"
                        sx={{
                          mb: 2
                        }}
                      >
                        Shop
                      </TypographyPrimary>
                      <TypographySecondary
                        align="center"
                        variant="subtitle2"
                        sx={{
                          mb: 5
                        }}
                      >
                        Hệ thống giúp các chủ cửa hàng, doanh nghiệp nhỏ quản lý
                        việc bán hàng trên mạng xã hội Facebook
                      </TypographySecondary>
                    </Box>
                  </SwiperSlide>
                  <SwiperSlide>
                    <Box textAlign="center">
                      <CardImg>
                        <img height={80} alt="Paypal" src={icons['Paypal']} />
                      </CardImg>
                      <TypographyPrimary
                        align="center"
                        variant="h3"
                        sx={{
                          mb: 2
                        }}
                      >
                        Paypal
                      </TypographyPrimary>
                      <TypographySecondary
                        align="center"
                        variant="subtitle2"
                        sx={{
                          mb: 5
                        }}
                      >
                        Hệ thống hỗ trợ các cửa hàng thanh toán qua ví Paypal
                      </TypographySecondary>
                    </Box>
                  </SwiperSlide>
                </Swiper>
              </SwiperWrapper>

              <DividerWrapper
                sx={{
                  mt: 3,
                  mb: 4
                }}
              />
              <Box>
                <TypographyPrimary
                  variant="h3"
                  sx={{
                    mb: 3
                  }}
                >
                  Đăng kí ngay thôi nào
                </TypographyPrimary>

                <List
                  dense
                  sx={{
                    mb: 3
                  }}
                >
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={'Giao diện dễ nhìn, sáng sủa'}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={'Thao tác đơn giản, dễ hiểu'}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: 'h6' }}
                      primary={'Nhiều tính năng hay nổi trội'}
                    />
                  </ListItem>
                </List>
              </Box>
            </SidebarContent>
          </Scrollbar>
        </SidebarWrapper>
        <MainContent>
          <LogoWrapper
            sx={{
              display: { xs: 'none', sm: 'inline-block' }
            }}
          >
            <Logo />
          </LogoWrapper>
          <Container maxWidth="sm">
            <Card
              sx={{
                p: 4,
                my: 4
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  Đăng kí
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  Điền các thông tin dưới đây để đăng kí tài khoản
                </Typography>
              </Box>
              {method === 'JWT' && <JWTRegister />}
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  Bạn đã có tài khoản?
                </Typography>{' '}
                <Box display={{ xs: 'block', md: 'inline-block' }}>
                  <Link component={RouterLink} to="/account/login">
                    <b>Đăng nhập tại đây</b>
                  </Link>
                </Box>
              </Box>
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  );
}

export default RegisterCover;
