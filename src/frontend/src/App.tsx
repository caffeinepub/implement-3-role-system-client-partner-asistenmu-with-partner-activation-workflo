import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import LandingPage from './pages/LandingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import AsistenmuDashboardPage from './pages/AsistenmuDashboardPage';
import RoleRouter from './routes/RoleRouter';
import AccessDeniedPage from './pages/AccessDeniedPage';

// Root layout component
function RootLayout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

// Create routes
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: RoleRouter,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const clientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/client',
  component: ClientDashboardPage,
});

const asistenmuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/asistenmu',
  component: AsistenmuDashboardPage,
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  adminRoute,
  clientRoute,
  asistenmuRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
