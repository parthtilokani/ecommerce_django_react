import { lazy } from 'react';
import { Navigate, useRoutes, Outlet } from 'react-router-dom';
// hooks
import useAuth from './hooks/useAuth';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';

const Categories = lazy(() => import('./pages/master/Categories'));
const SubCategories = lazy(() => import('./pages/master/SubCategories'));

// ----------------------------------------------------------------------

export default function Router() {
  // Check if the user is authenticated
  const { auth } = useAuth();

  // eslint-disable-next-line react/prop-types
  const PrivateRoute = ({ ...rest }) =>
    auth?.email ? <Outlet /> : <Navigate to="/login" state={{ from: rest.location }} replace />;

  const routes = useRoutes([
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <PrivateRoute />,
      children: [
        {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            { element: <Navigate to="/dashboard/app" />, index: true },
            { path: 'app', element: <DashboardAppPage /> },
            { path: 'user', element: <UserPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'blog', element: <BlogPage /> },
          ],
        },
        {
          path: '/master',
          element: <DashboardLayout />,
          children: [
            { element: <Navigate to="/master/categories" />, index: true },
            { path: 'categories', element: <Categories /> },
            { path: 'sub-categories', element: <SubCategories /> },
          ],
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
