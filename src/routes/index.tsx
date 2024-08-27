import { createBrowserRouter } from 'react-router-dom';
import authRoutes from '@/routes/auth-routes';
import protectedRoutes from '@/routes/protected-routes';

const routes = [
  ...authRoutes,
  ...protectedRoutes,
];

const browserRouter = createBrowserRouter(routes);

export default browserRouter;
