/**
 * Login Page Component
 * EXACT replica of resources/views/auth/login.blade.php
 * Per LOGIN_PAGE_DESIGN_SPEC.md
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setServerError('');
      
      // Mock authentication (as per CURSOR_CONTEXT.md)
      const success = await login(data.email, data.password);
      
      if (success) {
        // Get user from store to determine redirect
        const user = useAuthStore.getState().user;
        
        // Redirect based on role
        if (user?.role_id === 1) {
          navigate('/admin/dashboard');
        } else if (user?.role_id === 5) {
          navigate('/cs/dashboard');
        } else if (user?.role_id === 2) {
          navigate('/department/dashboard');
        } else {
          navigate('/admin/dashboard'); // Default
        }
      } else {
        setServerError('These credentials do not match our records.');
      }
    } catch (error) {
      setServerError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Login-specific styles (exact from old CMDMS CSS) */}
      <style>{`
        .loginMain {
          width: 100%;
          height: 100vh;
          min-height: 600px;
          background: url("/admin_assets/images/dashboard/icons/loginbg.png") no-repeat;
          background-position: center;
          background-size: cover;
        }

        .logindiv {
          width: 100%;
          height: 500px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px !important;
        }

        .logindiv .logo {
          width: 100%;
          text-align: center;
          padding: 30px;
        }

        .logindiv .logo img {
          width: 300px;
        }

        .logindiv form {
          width: 80%;
          margin: 0 auto;
        }

        .logindiv .input-group {
          border-radius: 10px !important;
          overflow: hidden !important;
          border: thin solid #787878 !important;
        }

        .logindiv .input-group .input-group-text {
          background: transparent !important;
          border: 0 !important;
        }

        .logindiv .input-group .input-group-text i {
          color: #787878 !important;
        }

        .logindiv .input-group input {
          border: 0 !important;
        }

        .logindiv button {
          background-color: #247b2d !important;
          width: 100% !important;
          color: #fff !important;
          border-radius: 10px;
        }

        .logindiv button:hover {
          background-color: #1d6324 !important;
        }

        .logindiv button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="loginMain">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
            <div className="logindiv">
              <div className="logo">
                <img 
                  src="/admin_assets/images/dashboard/icons/cm-dm.png" 
                  alt="CMDMS Logo" 
                />
              </div>

              <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
                {/* Server Error Message */}
                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    <strong>{serverError}</strong>
                  </div>
                )}

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend bg-transparent">
                      <span className="input-group-text">
                        <i className="ti-user text-primary"></i>
                      </span>
                    </div>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      {...register('email')}
                      autoFocus
                      autoComplete="email"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{errors.email.message}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend bg-transparent">
                      <span className="input-group-text">
                        <i className="ti-lock text-primary"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      {...register('password')}
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <span className="invalid-feedback" role="alert">
                        <strong>{errors.password.message}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Empty spacing div (exact from Blade) */}
                <div className="my-2 d-flex justify-content-between align-items-center">
                  {/* Empty - no remember me or forgot password in old CMDMS */}
                </div>

                {/* Submit Button */}
                <div className="my-3">
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

