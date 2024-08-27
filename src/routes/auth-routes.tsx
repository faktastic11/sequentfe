import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import Login from '@/pages/login';
import Signup from '@/pages/signup';
import ErrorPage from '@/pages/error';
import { useAuth } from '@/context/auth-context';

const PublicRouteCheck: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/guidance" replace />;
  }

  return <Outlet />;
};

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicRouteCheck />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
];

export default publicRoutes;
