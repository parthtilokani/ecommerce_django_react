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
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info, subItems } = item;

  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;

  const toggleSubMenu = () => {
    setIsOpen((prevOpen) => !prevOpen);
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
            bgcolor: isOpen ? 'rgba(0,0,0,0.02)' : '',
            color: isOpen ? 'text.primary' : '',
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          <ListItemText disableTypography primary={title} />
          {info && info}
        </StyledNavItem>
        {isOpen && (
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
