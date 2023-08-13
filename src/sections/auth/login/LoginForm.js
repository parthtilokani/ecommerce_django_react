import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { axiosOpen } from '../../../utils/axios';
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth?.accessToken) {
      navigate('/');
    }
  }, [auth]);

  // eslint-disable-next-line consistent-return
  const handleClick = () => {
    if (!email.trim()) return toast.error('Email is required');
    if (!password.trim()) return toast.error('Password is required');
    setLoading(true);
    axiosOpen
      .post('/user/token', { email, password })
      // eslint-disable-next-line consistent-return
      .then((res) => {
        if (!res?.data?.is_admin) return toast.error('Unauthorized');
        setAuth({
          accessToken: res?.data?.access,
          refreshToken: res?.data?.refresh,
          email,
        });
        localStorage.setItem(
          'auth',
          JSON.stringify({
            accessToken: res?.data?.access,
            refreshToken: res?.data?.refresh,
            email,
          })
        );
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (!err?.response) return toast.error('No internet connection!');
        const { email, password, detail, message } = err?.response?.data;
        if (message) return toast.error(message);
        if (!email && !password && !detail) return toast.error('Something went wrong! Retry');
        if (email && email?.length > 0) toast.error(email[0]);
        if (password && password?.length > 0) toast.error(password[0]);
        if (detail) toast.error(detail);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
        style={{ marginTop: 20 }}
        loading={loading}
      >
        Login
      </LoadingButton>
    </>
  );
}
