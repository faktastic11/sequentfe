// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorPage from './components/ErrorPage';
import './index.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/SignUp';
import UserInfo from './components/UserInfo';
import CompanyMainlayout from './layout/CompanyMainlayout';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/guidance',
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <CompanyMainlayout />,
      },
    ],
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/user-info',
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <UserInfo />,
      },
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={browserRouter} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
