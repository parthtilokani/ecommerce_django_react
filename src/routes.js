import { lazy } from 'react';
import { Navigate, Outlet, Routes, Route } from 'react-router-dom';
// hooks
import useAuth from './hooks/useAuth';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
// import BlogPage from './pages/BlogPage';
// import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
// import ProductsPage from './pages/ProductsPage';
// import DashboardAppPage from './pages/DashboardAppPage';

const InputFields = lazy(() => import('./pages/master/InputFields'));
const Categories = lazy(() => import('./pages/master/Categories'));
const SubCategories = lazy(() => import('./pages/master/SubCategories'));

// const Countries = lazy(() => import('./pages/master/Countries'));
// const States = lazy(() => import('./pages/master/States'));
// const Cities = lazy(() => import('./pages/master/Cities'));

const AdsPlans = lazy(() => import('./pages/master/AdPlans'));

const Users = lazy(() => import('./pages/Users'));
const PlanOrders = lazy(() => import('./pages/PlanOrders'));

// ----------------------------------------------------------------------

export default function Router() {
  // Check if the user is authenticated
  const { auth } = useAuth();

  // eslint-disable-next-line react/prop-types
  const PrivateRoute = ({ ...rest }) =>
    auth?.email ? <Outlet /> : <Navigate to="/login" state={{ from: rest.location }} replace />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/master" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/master" element={<Navigate to="/master/categories" />} />
          <Route path="/master/categories" element={<Categories />} />
          <Route path="/master/inputfields" element={<InputFields />} />
          <Route path="/master/sub-categories" element={<SubCategories />} />

          {/* <Route path="/master/countries" element={<Countries />} />
          <Route path="/master/states" element={<States />} />
          <Route path="/master/cities" element={<Cities />} /> */}

          <Route path="/master/ads-plans" element={<AdsPlans />} />

          <Route path="/users" element={<Users />} />
          <Route path="/plan_orders" element={<PlanOrders />} />
        </Route>
      </Route>
      <Route element={<SimpleLayout />}>
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>
    </Routes>
  );
}
