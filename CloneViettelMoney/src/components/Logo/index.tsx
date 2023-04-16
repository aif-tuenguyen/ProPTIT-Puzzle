import { Box, styled } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoImgWrapper = styled('img')(
  ({ theme }) => `
  `
);

const LogoTextWrapper = styled(Box)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
`
);

const LogoText = styled(Box)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(15)};
        font-weight: ${theme.typography.fontWeightBold};
`
);

interface ILogoProps {
  isTitle?: boolean;
  to?: string;
}

const Logo: React.FC<ILogoProps> = ({ isTitle, to }) => {
  return (
    <LogoWrapper to={to}>
      <LogoImgWrapper
        width={50}
        alt="Social Ecommerce"
        src="/static/images/logo/logo.png"
      />
      {isTitle && (
        <Box
          component="span"
          sx={{
            display: { xs: 'none', sm: 'inline-block' }
          }}
        >
          <LogoTextWrapper>
            <LogoText>Social Ecommerce</LogoText>
          </LogoTextWrapper>
        </Box>
      )}
    </LogoWrapper>
  );
};

Logo.defaultProps = {
  isTitle: false,
  to: '/'
};

export default Logo;
