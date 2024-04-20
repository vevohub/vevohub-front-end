import { Helmet } from 'react-helmet-async';
import ClassicForgotPasswordView from '../../../sections/auth/jwt/jwt-forgot-password-view';



// ----------------------------------------------------------------------

export default function ClassicForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Forgot Password</title>
      </Helmet>

      <ClassicForgotPasswordView />
    </>
  );
}
