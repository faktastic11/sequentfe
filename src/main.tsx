/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from './components/ErrorPage'
import GuidanceHome from './components/GuidanceHome.tsx'
import './index.scss'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Router
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

const browserRouter = createBrowserRouter([
  // right now lets route both home and guidance to the same component
  {
    path: '/',
    // redirect home to /guidance
    loader: () => redirect('/guidance'),
  },
  {
    path: '/guidance',
    element: <GuidanceHome />,
    errorElement: <ErrorPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={browserRouter} />
    </QueryClientProvider>
  </React.StrictMode>,
)
