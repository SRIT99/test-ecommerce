// contexts/AuthContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Auth reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                isAuthenticated: true,
                error: null
            };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload, isAuthenticated: false };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: null,
                loading: false
            };
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
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    // Set user from localStorage
                    const user = JSON.parse(userData);
                    dispatch({ type: 'SET_USER', payload: user });
                } catch (error) {
                    console.error('Failed to parse user data from localStorage', error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                }
            }
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            dispatch({ type: 'LOGIN_START' });
            console.log('🔐 AuthContext: Starting login process for:', credentials.email);

            const response = await authService.login(credentials);

            console.log('✅ AuthContext: Login response received:', response);

            if (response && response.token && response.user) {
                // Store token and user data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Dispatch success
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: response.user }
                });

                console.log('✅ AuthContext: Login successful, user data stored');
                return response; // Return the response
            } else {
                console.error('❌ AuthContext: Invalid response format:', response);
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('❌ AuthContext: Login failed:', error);
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.response?.data?.error || 'Login failed'
            });
            throw error; // Re-throw to be caught by component
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        user: state.user,
        role: state.user?.role || state.user?.userType,
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

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;