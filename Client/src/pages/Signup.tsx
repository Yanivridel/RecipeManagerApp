"use client"

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';
import { createUser } from '@/services/api';


const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading , setLoading ] = useState(false);

    const { toast } = useToast()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                title: "Password Mismatch",
                description: "The passwords you entered do not match. Please try again.",
            });
            return;
        }
        setLoading(true);
        try {
            const data = await createUser({ email, username, password});
            console.log(data);
            toast({
                title: "Sign-Up Successful",
                description: "Your account has been created successfully.",
            });
            navigate('/login');
        } catch(err) {
            console.log("Failed signing up: " + err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
    <div className="max-w-md mx-auto p-4">
        <h2 className="text-xl font-bold text-center">Sign Up</h2>
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
            <label htmlFor="username" className="block">Username</label>
            <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
            autoComplete='off'
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
                autoComplete="new-password"
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

        <div>
            <label htmlFor="confirmPassword" className="block">Confirm Password</label>
            <div className="relative">
            <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
                autoComplete='off'
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
            >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            </div>
        </div>

        <button type="submit" disabled={loading} 
            className={`w-full bg-blue-500 text-white py-2 rounded ${loading ? "bg-gray-500": ""}`}>
            {loading ? "Loading..." : "Sign Up" }
            </button>
        </form>

        <div className="text-center mt-4">
        <p>
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
        </div>
    </div>
    );
};

export default SignUp;
