import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Overview = Loader(lazy(() => import('src/content/overview')));
const About = Loader(lazy(() => import('src/content/about')));

// Dashboards

const Crypto = Loader(lazy(() => import('src/content/dashboards/Crypto')));

const Dapp = Loader(lazy(() => import('src/content/dashboards/Dapp')));

// Applications

const Messenger = Loader(
  lazy(() => import('src/content/applications/Messenger'))
);
const Transactions = Loader(
  lazy(() => import('src/content/applications/Transactions'))
);
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);
const UserSettings = Loader(
  lazy(() => import('src/content/applications/Users/settings'))
);

const CollectionPoints = Loader(
  lazy(() => import('src/content/applications/CollectionPoints/collectionpoints'))
);
const CollectPoint = Loader(
  lazy(() => import('src/content/applications/CollectionPoints/collectpoint'))
);
const CollectPointDetails = Loader(
  lazy(() => import('src/content/applications/CollectionPoints/collectpoint-details'))
);
const CollectPointSettings = Loader(
  lazy(() => import('src/content/applications/CollectionPoints/settings'))
);

const Products = Loader(
  lazy(() => import('src/content/applications/Products/products'))
);
const Product = Loader(
  lazy(() => import('src/content/applications/Products/product'))
);
const ProductDetails = Loader(
  lazy(() => import('src/content/applications/Products/product-details'))
);
const ProductRegister = Loader(
  lazy(() => import('src/content/applications/Products/product-register'))
);
const ProductSettings = Loader(
  lazy(() => import('src/content/applications/Products/settings'))
);

// Components

const Buttons = Loader(
  lazy(() => import('src/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/content/pages/Components/Forms')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Overview />
      },
      {
        path: '/about',
        element: <About />
      },  
      {
        path: 'dapp',
        element: <Navigate to="/" replace />
      },
      {
        path: '/dapp/products',
        element: <Products />
      },
      {
        path: '/dapp/product',
        element: <Product />
      },
      {
        path: '/dapp/product-details',
        element: <ProductDetails />
      },
      {
        path: '/dapp/product-details/:tokenId',
        element: <ProductDetails />
      },
      {
        path: '/dapp/product-register',
        element: <ProductRegister />
      },
      {
        path: '/dapp/product-register/:tokenId',
        element: <ProductRegister />
      },
      {
        path: '/dapp/product/:tokenId',
        element: <Product />
      },
      {
        path: '/dapp/product-settings',
        element: <ProductSettings />
      },
      {
        path: '/dapp/product-settings/edit/:tokenId',
        element: <ProductSettings />
      },
      {
        path: '/dapp/collectionpoints',
        element: <CollectionPoints />
      },
      {
        path: '/dapp/collectpoint-settings',
        element: <CollectPointSettings />
      },
      {
        path: '/dapp/collectpoint-details',
        element: <CollectPointDetails />
      },
      {
        path: '/dapp/collectpoint-details/:tokenId',
        element: <CollectPointDetails />
      },
      {
        path: '/dapp/collectpoint/:tokenId',
        element: <CollectPoint />
      },
      {
        path: '/dapp/collectpoint-settings/edit/:tokenId',
        element: <CollectPointSettings />
      },
      {
        path: '/dapp/profile',
        element: <UserProfile />
      },
      {
        path: '/content/tabs',
        element: <Tabs />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        // element: <Navigate to="dapp" replace />
      },
      {
        path: 'crypto',
        element: <Crypto />
      },
      {
        path: 'dapp',
        element: <Dapp />
      },
      {
        path: 'messenger',
        element: <Messenger />
      }
    ]
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="transactions" replace />
      },
      {
        path: 'transactions',
        element: <Transactions />
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          },
          {
            path: 'settings',
            element: <UserSettings />
          }
        ]
      }
    ]
  },
  {
    path: '/components',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="buttons" replace />
      },
      {
        path: 'buttons',
        element: <Buttons />
      },
      {
        path: 'modals',
        element: <Modals />
      },
      {
        path: 'accordions',
        element: <Accordions />
      },
      {
        path: 'tabs',
        element: <Tabs />
      },
      {
        path: 'badges',
        element: <Badges />
      },
      {
        path: 'tooltips',
        element: <Tooltips />
      },
      {
        path: 'avatars',
        element: <Avatars />
      },
      {
        path: 'cards',
        element: <Cards />
      },
      {
        path: 'forms',
        element: <Forms />
      }
    ]
  }
];

export default routes;
