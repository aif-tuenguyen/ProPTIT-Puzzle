import React from 'react';
import { Box, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation, useNavigate } from 'react-router-dom';

const BoxMenu = styled(Box)(
  ({ theme }) => `
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  `
);

interface IBoxMenuItemProps {
  active?: boolean;
}

const BoxMenuItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active'
})<IBoxMenuItemProps>(
  ({ theme, active = false }) => `
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: bold;
        color: ${active ? theme.colors.primary.main : 'inherit'}
    `
);

export const MenuBottom = () => {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <BoxMenu
      display="flex"
      padding={2}
      position="fixed"
      left={0}
      bottom={0}
      height="80px"
      width="100%"
      borderRadius="10px 10px 0px 0px"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="white"
      zIndex={20}
    >
      <BoxMenuItem
        active={location?.pathname === '/1/0929345164'}
        onClick={() => navigate('/1/0929345164')}
      >
        <HomeIcon />
        Trang chủ
      </BoxMenuItem>
      <BoxMenuItem
        active={location?.pathname === '/uudai'}
        onClick={() => navigate('/uudai')}
      >
        <VerifiedIcon />
        Ưu đãi
      </BoxMenuItem>
      <BoxMenuItem
        active={location?.pathname === '/1/0929345164/chat'}
        onClick={() => navigate('/1/0929345164/chat')}
      >
        <ChatIcon />
        Nhắn tin
      </BoxMenuItem>
      <BoxMenuItem
        active={location?.pathname === '/personal'}
        onClick={() => navigate('/personal')}
      >
        <AccountCircleIcon />
        Cá nhân
      </BoxMenuItem>
    </BoxMenu>
  );
};
