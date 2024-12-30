import axios from 'axios';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

const API_URL = 'http://chrisgen.local:3000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    
    if (response.data.token) {
      setCookie('token', response.data.token);
      setCookie('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const logout = () => {
  deleteCookie('token');
  deleteCookie('user');
  window.location.href = '/login';
};

export const getAuthHeaders = () => {
  const token = getCookie('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const deleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/profile`, getAuthHeaders());
      return true;
    } catch (error) {
      throw error.response?.data || { error: 'Delete failed' };
    }
  };
  
  export const updateUser = async (userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/profile`, 
        userData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Update failed' };
    }
  };