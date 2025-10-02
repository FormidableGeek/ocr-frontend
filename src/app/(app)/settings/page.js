'use client';

import { useAuth } from '@/hooks/auth';
import Header from '@/app/(app)/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { user, logout } = useAuth({ middleware: 'auth' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile-information`,
        { name: formData.name, email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      setSuccess('Profile updated successfully.');


    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/password`,
        {
          current_password: formData.current_password,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      await logout();
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <>
      <Header title="Settings" text="Manage your account settings." />
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        {!loading && (
          <div className="max-w-lg mx-auto space-y-6">
            <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Profile Information</h3>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-blue-600 text-white text-sm sm:text-base font-bold hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
            </form>

            <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Change Password</h3>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                  minLength={8}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-blue-600 text-white text-sm sm:text-base font-bold hover:bg-blue-700 transition"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}