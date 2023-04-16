import { RouteObject } from 'react-router';
import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

import { EndowPage } from 'src/content/uudai';
import { ChatPage } from 'src/content/chat';
import { PersonalPage } from 'src/content/personal';
import { DetailChat } from 'src/content/chat/detail';
import HomePage from 'src/content/home';

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

const router: RouteObject[] = [
  {
    path: 'status',
    children: [
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
  },
  {
    path: ':devide/:user',
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'uudai',
        element: <EndowPage />
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            element: <ChatPage />
          },
          {
            path: ':roomId/detail',
            element: <DetailChat />
          }
        ]
      },
      {
        path: 'personal',
        element: <PersonalPage />
      }
    ]
  }
];

export default router;
