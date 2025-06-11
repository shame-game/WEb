import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Hotel, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import { loginSchema } from '../../utils/validationSchemas';
import styles from './Login.module.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: 'admin',
      password: 'admin123',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.login({
        username: data.username,
        password: data.password
      });

      // Assuming the API returns { token, user }
      const { token, user } = response;
      
      // Store login info
      login(token, user);
      
      // Redirect to intended page or dashboard
      navigate(from, { replace: true });
        } catch (err) {
      console.error('Login error:', err);
      setError(
        err.message || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setValue('username', 'vamnaone');
    setValue('password', 'huy123');
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Hotel size={32} />
          </div>          <h1 className={styles.title}>Quản lý khách sạn</h1>
          <p className={styles.subtitle}>Hệ thống quản lý khách sạn toàn diện</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên đăng nhập</label>
            <input
              {...register('username')}
              type="text"
              placeholder="Nhập tên đăng nhập"
              className={`${styles.input} ${errors.username ? styles.error : ''}`}
              disabled={loading}
            />
            {errors.username && (
              <span className={styles.errorMessage}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Nhập mật khẩu"
              className={`${styles.input} ${errors.password ? styles.error : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
          </div>

          <label className={styles.rememberMe}>
            <input
              {...register('rememberMe')}
              type="checkbox"
              className={styles.checkbox}
              disabled={loading}
            />
            Ghi nhớ đăng nhập
          </label>          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <Loader2 size={20} className={styles.loading} />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Đăng nhập
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
