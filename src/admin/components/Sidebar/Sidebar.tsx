import { FC } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FeedIcon from '@mui/icons-material/Feed';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import QuizIcon from '@mui/icons-material/Quiz';
import CategoryIcon from '@mui/icons-material/Category';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';

import { SIDEBAR_WIDTH, SIDEBAR_ITEMS } from '../../constants';

import './styles.scss';

export const Sidebar: FC<any> = ({
  mobileOpen,
  handleDrawerToggle,
  onChangeItemSidebar,
  selectedItem,
}) => {
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar className="sidebar-toolbar">
        <img
          className="sidebar-logo"
          alt="Лого"
          src="/logo-admin.svg"
          onClick={() => navigate('/')}
        />
      </Toolbar>
      <Divider />
      <List>
        {SIDEBAR_ITEMS.map(({ name, text }, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => onChangeItemSidebar(name)}
          >
            <ListItemButton selected={selectedItem === name}>
              <ListItemIcon>
                {index === 0 && <FeedIcon />}
                {index === 1 && <BrandingWatermarkIcon />}
                {index === 2 && <QuizIcon />}
                {index === 3 && <CategoryIcon />}
                {index === 4 && <ChatBubbleOutlineIcon />}
                {index === 5 && <FilterVintageIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: SIDEBAR_WIDTH }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
