// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  {
    title: 'master',
    icon: icon('ic_user'),
    subItems: [
      {
        title: 'input-fields',
        path: '/master/inputfields',
        icon: icon('ic_user'),
      },
      {
        title: 'categories',
        path: '/master/categories',
        icon: icon('ic_user'),
      },
      {
        title: 'sub-categories',
        path: '/master/sub-categories',
        icon: icon('ic_user'),
      },
      // {
      //   title: 'countries',
      //   path: '/master/countries',
      //   icon: icon('ic_user'),
      // },
      // {
      //   title: 'states',
      //   path: '/master/states',
      //   icon: icon('ic_user'),
      // },
      // {
      //   title: 'districts',
      //   path: '/master/cities',
      //   icon: icon('ic_user'),
      // },
      {
        title: 'ads-plans',
        path: '/master/ads-plans',
        icon: icon('ic_user'),
      },
    ],
  },
  // {
  //   title: 'users',
  //   path: '/users',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'plan orders',
    path: '/plan_orders',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
];

export default navConfig;
