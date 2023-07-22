import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <StyledRoot>
      <MemoizedHeader onOpenNav={() => setOpen(true)} />
      <MemoizedNav openNav={open} onCloseNav={() => setOpen(false)} />
      <MainSection />
    </StyledRoot>
  );
}

const MainSection = () => (
  <Main>
    <Suspense fallback={'Loading...'}>
      <Outlet />
    </Suspense>
  </Main>
);

const MemoizedHeader = React.memo(Header);
const MemoizedNav = React.memo(Nav);
