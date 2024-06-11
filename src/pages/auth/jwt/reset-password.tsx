import {Helmet} from 'react-helmet-async';
import ResetPasswordView from "../../../sections/auth/jwt/jwt-reset-password-view";


// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Reset Forgot Password</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
