/**
 * User Settings Page
 * For users to edit their own profile (Name, Email, Password)
 * EXACT replica of admin/users/edit.blade.php but simplified for self-editing
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../../store/authStore';

// Validation schema
const settingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function UserSettings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage('');
      setErrorMessage('');

      // Update user in store (mock - replace with API call when backend is ready)
      if (user) {
        updateUser({
          name: data.name,
          email: data.email,
          // Password update would be handled separately by backend
        });

        // TODO: Implement API call when backend is ready
        // await updateUserProfile({ ...data, id: user.id });
        
        setSuccessMessage('Profile updated successfully!');
        
        // Clear password field after successful update
        reset({
          name: data.name,
          email: data.email,
          password: '',
        });
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body text-center py-5">
            <p>Please log in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title">
                <strong>Settings</strong>
              </p>
              <p className="card-description">
                Update your profile information
              </p>

              {/* Success Message */}
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>{successMessage}</strong>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setSuccessMessage('')}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>{errorMessage}</strong>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setErrorMessage('')}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              )}

              <form className="forms-sample" onSubmit={handleSubmit(onSubmit)}>
                {/* Row 1: Name and Email */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          {...register('name')}
                          required
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            <strong>{errors.name.message}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Email Address</label>
                      <div className="col-sm-9">
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          {...register('email')}
                          required
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            <strong>{errors.email.message}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Password */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Password</label>
                      <div className="col-sm-9">
                        <input
                          type="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          {...register('password')}
                          placeholder="Leave blank to keep current password"
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            <strong>{errors.password.message}</strong>
                          </div>
                        )}
                        <small className="form-text text-muted">
                          Leave blank if you don't want to change your password
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
