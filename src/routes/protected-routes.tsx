import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import CompanyMainlayout from '@/layout/main-layout';
import UserInfo from '@/pages/user-info';
import GuidanceHome from '@/pages/home-page';
import ErrorPage from '@/pages/error';
import {useAuth} from '@/context/auth-context';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const protectedRoutes: RouteObject[] = [
  {
    path: '/guidance',
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <CompanyMainlayout>
            <GuidanceHome />
          </CompanyMainlayout>
        ),
      },
    ],
  },
  {
    path: '/user-info',
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <CompanyMainlayout>
            <UserInfo />
          </CompanyMainlayout>
        ),
      },
    ],
  },
];

export default protectedRoutes;
