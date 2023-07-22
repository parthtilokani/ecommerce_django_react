import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon, SubMenuList, SubMenuItem } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const [navItemOpen, setNavItemOpen] = useState('');

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem
            key={item.title}
            index={item.title}
            item={item}
            navItemOpen={navItemOpen}
            setNavItemOpen={setNavItemOpen}
          />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  index: PropTypes.string,
  item: PropTypes.object,
  navItemOpen: PropTypes.string,
  setNavItemOpen: PropTypes.func,
};

function NavItem({ index, item, navItemOpen, setNavItemOpen }) {
  const { title, path, icon, info, subItems } = item;

  const hasSubItems = subItems && subItems.length > 0;

  const toggleSubMenu = () => {
    setNavItemOpen((prev) => (prev === index ? '' : index));
  };

  if (hasSubItems) {
    return (
      <>
        <StyledNavItem
          onClick={toggleSubMenu}
          sx={{
            '&.active': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
            bgcolor: navItemOpen === index ? 'rgba(0,0,0,0.02)' : '',
            color: navItemOpen === index ? 'text.primary' : '',
            postion: 'relative',
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          <ListItemText disableTypography primary={title} />
          <div style={{ position: 'absolute', right: '20px' }}>
            {navItemOpen === index ? <>&#x25B2;</> : <>&#x25BC;</>}
          </div>
          {info && info}
        </StyledNavItem>
        {navItemOpen === index && (
          <SubMenuList>
            {subItems.map((subItem) => (
              <SubMenuItem
                key={subItem.title}
                component={RouterLink}
                to={subItem.path}
                sx={{
                  '&.active': {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightBold',
                  },
                  bgcolor: 'rgba(0,0,0,0.02)',
                }}
              >
                <StyledNavItemIcon>{subItem.icon && subItem.icon}</StyledNavItemIcon>
                <ListItemText disableTypography primary={subItem.title} />
                {subItem.info && subItem.info}
              </SubMenuItem>
            ))}
          </SubMenuList>
        )}
      </>
    );
  }

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </StyledNavItem>
  );
}
