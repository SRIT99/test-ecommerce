import React, { createContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Auth reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload, isAuthenticated: false };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, error: null };
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('doko_token');
            if (token) {
                try {
                    const user = await authService.getProfile();
                    dispatch({ type: 'SET_USER', payload: user });
                } catch (error) {
                    authService.logout();
                    console.error('Failed to fetch user profile', error);
                }
            }
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const data = await authService.login(credentials);
            const user = await authService.getProfile();
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            return data;
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: message });
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;