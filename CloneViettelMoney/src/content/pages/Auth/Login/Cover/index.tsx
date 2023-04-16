import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  Tooltip,
  Typography,
  Container,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTLogin from '../LoginJWT';

import Logo from 'src/components/Logo';
import Scrollbar from 'src/components/Scrollbar';

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
    padding: 0 0 0 440px;
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
    background: ${theme.colors.alpha.white[100]};
    width: 440px;
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
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['border'])};
    position: absolute;

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(33)};
`
);

function LoginCover() {
  const { method } = useAuth() as any;

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
      </Helmet>
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Scrollbar>
            <SidebarContent>
              <Logo />
              <Box mt={6}>
                <TypographyH1
                  variant="h1"
                  sx={{
                    mb: 7
                  }}
                >
                  {'Chào mừng đến với Social Ecommerce'}
                </TypographyH1>
                <Box
                  sx={{
                    position: 'relative',
                    width: 300,
                    height: 120
                  }}
                >
                  <Tooltip arrow placement="top" title="Cart">
                    <CardImg
                      sx={{
                        width: 80,
                        height: 80,
                        left: -20,
                        top: -40
                      }}
                    >
                      <img width={40} alt="Cart" src={icons['Cart']} />
                    </CardImg>
                  </Tooltip>
                  <Tooltip arrow placement="top" title="Facebook">
                    <CardImg
                      sx={{
                        width: 90,
                        height: 90,
                        left: 70
                      }}
                    >
                      <img width={50} alt="Facebook" src={icons['Facebook']} />
                    </CardImg>
                  </Tooltip>
                  <Tooltip arrow placement="top" title="Shop">
                    <CardImg
                      sx={{
                        width: 110,
                        height: 110,
                        top: -30,
                        left: 170
                      }}
                    >
                      <img width={80} alt="Shop" src={icons['Shop']} />
                    </CardImg>
                  </Tooltip>
                  <Tooltip arrow placement="top" title="Paypal">
                    <CardImg
                      sx={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        right: -55
                      }}
                    >
                      <img width={50} alt="Paypal" src={icons['Paypal']} />
                    </CardImg>
                  </Tooltip>
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    my: 3
                  }}
                >
                  Hệ thống hỗ trợ các hoạt động TMĐT cho người dùng trên mạng xã
                  hội Facebook và giúp chủ cửa hàng, doanh nghiệp nhỏ quản lý
                  việc bán hàng trên mạng xã hội Facebook
                </Typography>
              </Box>
            </SidebarContent>
          </Scrollbar>
        </SidebarWrapper>
        <MainContent>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            maxWidth="sm"
          >
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
                  Đăng nhập
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  Điền các thông tin dưới đây để đăng nhập
                </Typography>
              </Box>
              {method === 'JWT' && <JWTLogin />}
              <Box my={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  Bạn đã có tài khoản chưa?
                </Typography>{' '}
                <Box display={{ xs: 'block', md: 'inline-block' }}>
                  <Link component={RouterLink} to="/account/register">
                    <b>Đăng kí tại đây</b>
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

export default LoginCover;
