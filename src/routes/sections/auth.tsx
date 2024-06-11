import {lazy, Suspense} from 'react';
import {Outlet} from 'react-router-dom';

import {GuestGuard} from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

import {SplashScreen} from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const ClassicForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));
const ResetPasswordPage = lazy(() => import('src/pages/auth/jwt/reset-password'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <Suspense fallback={<SplashScreen/>}>
      <Outlet/>
    </Suspense>
  ),
  children: [
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AuthClassicLayout>
            <JwtLoginPage/>
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'register',
      element: (
        <GuestGuard>
          <AuthClassicLayout title="Manage the job more effectively with Minimal">
            <JwtRegisterPage/>
          </AuthClassicLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <AuthClassicLayout>
          <ClassicForgotPasswordPage/>
        </AuthClassicLayout>
      ),
    },
    {
      path: 'reset-password/:token',
      element: (
        <AuthClassicLayout>
          <ResetPasswordPage/>
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
