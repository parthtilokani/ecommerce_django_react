// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const SubMenuList = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(0),
}));

export const SubMenuItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.caption,
  paddingLeft: theme.spacing(1),
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 14,
    left: 24,
    width: 4,
    height: 4,
    borderRadius: '50%',
    bgcolor: theme.palette.text.secondary,
  },
}));
