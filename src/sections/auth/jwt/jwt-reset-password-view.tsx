import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Typography, Button, Card, Stack, IconButton, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import LoadingButton from "@mui/lab/LoadingButton";

const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string().required('New Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.post(`http://localhost:8080/validate-reset-token?token=${token}`);
        setValidToken(true);
      } catch (error) {
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data:any) => {
    try {
      await axios.post(`http://localhost:8080/reset-password?token=${token}`, {
        newPassword: data.newPassword,
      });
      enqueueSnackbar('Password reset successfully', { variant: 'success' });
      navigate('/auth/jwt/login');
    } catch (error) {
      enqueueSnackbar('Failed to reset password', { variant: 'error' });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!validToken) {
    return (
      <div>
        <Typography variant="h6" color="error">
          Invalid or expired token
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/auth/jwt/forgot-password')}>
          Request a new reset link
        </Button>
      </div>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="newPassword"
          label="New Password"
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Iconify icon="solar:eye-bold" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Iconify icon="solar:eye-bold" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
