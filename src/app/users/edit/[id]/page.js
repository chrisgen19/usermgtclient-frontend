'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { getAuthHeaders } from '@/lib/auth';
import axios from 'axios';

export default function EditUser() {
  const router = useRouter();
  const params = useParams(); // Retrieve route parameters
  const userId = params.id; // Extract the 'id' parameter

  const [user, setUser] = useState({ username: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://chrisgen.local:3000/api/users/${userId}`, // Using the ID from the URL
          getAuthHeaders()
        );
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]); // Dependency on userId

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://chrisgen.local:3000/api/users/${userId}`, // Using the ID from the URL
        user,
        getAuthHeaders()
      );
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(
          `http://chrisgen.local:3000/api/users/${userId}`,
          getAuthHeaders()
        );
        router.push('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Delete failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Edit User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Editing user: {user.username}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={user.username}
                onChange={(e) =>
                  setUser({ ...user, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
