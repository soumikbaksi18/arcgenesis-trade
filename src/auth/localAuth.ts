/**
 * Local Authentication System
 * 
 * This is a POC authentication system using localStorage.
 * Designed to be easily replaced with a backend auth system later.
 */

const AUTH_KEY = 'arcgenesis_user';
const WEEX_CONNECTION_KEY = 'weex_connected';

export interface User {
  id: string;
  email: string;
  loggedInAt: number;
}

/**
 * Login user by storing their data in localStorage
 */
export const login = (): User => {
  const user: User = {
    id: 'demo-user',
    email: 'demo@arcgenesis.ai',
    loggedInAt: Date.now(),
  };
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
};

/**
 * Logout user by clearing auth data from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
  // Optionally clear WEEX connection on logout
  localStorage.removeItem(WEEX_CONNECTION_KEY);
};

/**
 * Get currently logged in user
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(AUTH_KEY);
  
  if (!userJson) {
    return null;
  }
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Connect WEEX exchange
 */
export const connectWeex = (): void => {
  localStorage.setItem(WEEX_CONNECTION_KEY, 'true');
};

/**
 * Disconnect WEEX exchange
 */
export const disconnectWeex = (): void => {
  localStorage.removeItem(WEEX_CONNECTION_KEY);
};

/**
 * Check if WEEX is connected
 */
export const isWeexConnected = (): boolean => {
  return localStorage.getItem(WEEX_CONNECTION_KEY) === 'true';
};

