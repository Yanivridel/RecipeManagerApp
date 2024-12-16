import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
// Functions
import { setUser } from '@/store/slices/userSlice';
import { checkLogin } from '@/services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading , setLoading ] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
        const { user } = await checkLogin({ email, password });
        dispatch(setUser(user));
        navigate('/');
        } catch (err) {
        console.log('Failed Logging in: ', err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="email" className="block">Email</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
                autoComplete='email'
            />
            </div>

            <div>
            <label htmlFor="password" className="block">Password</label>
            <div className="relative">
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
                autoComplete='current-password'
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
                >
                {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            </div>
            </div>

            <button type="submit" disabled={loading} 
            className={`w-full bg-blue-500 text-white py-2 rounded ${loading ? "bg-gray-500": ""}`}>
            {loading ? "Loading..." : "Login" }
            </button>
        </form>

        <div className="text-center mt-4">
            <p>
            Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
            </p>
        </div>
        </div>
    );
};

export default Login;

