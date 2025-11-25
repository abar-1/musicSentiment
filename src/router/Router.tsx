import { createBrowserRouter, Navigate } from 'react-router';
import App from '../App';
import Login from '../components/AuthPages/Login';
import Signup from '../components/AuthPages/SignUp';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'login', element: <Login />},
            {path: 'signup', element: <Signup />}
        ]
    }
])