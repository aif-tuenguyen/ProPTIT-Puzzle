import { Box } from '@mui/material';
import React, { useState } from 'react';
import { MenuBottom } from 'src/components/MenuBottom';
import { Bot } from 'src/elements/Bot';

interface ILayoutProps {
  showMenu?: boolean;
  showBot?: boolean;
  messageOfBot?: string;
  setMessageOfBot?: any;
  isIntent?: string;
}

export const Layout: React.FC<ILayoutProps> = ({
  showMenu = false,
  showBot = false,
  messageOfBot,
  setMessageOfBot,
  isIntent,
  children
}) => {
  const [showChatWithBot, setShowChatWithBot] = useState(false);

  return (
    <Box overflow={showChatWithBot ? 'hidden' : 'auto'}>
      {children}
      {showMenu && <MenuBottom />}
      {showBot && (
        <Bot
          messageOfBot={messageOfBot}
          setMessageOfBot={setMessageOfBot}
          showChatWithBot={showChatWithBot}
          setShowChatWithBot={setShowChatWithBot}
          isIntent={isIntent}
        />
      )}
    </Box>
  );
};
