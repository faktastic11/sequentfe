import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuidanceBackend from '../services/guidanceBackend';
import { useNavigate } from 'react-router';

type Props = {};

const Signup: React.FC<Props> = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const navigate = useNavigate();

    const validate = () => {
        let valid = true;
        let errors: { name?: string; email?: string; password?: string } = {};

        if (!name) {
            errors.name = 'Name is required';
            valid = false;
        }

        if (!email) {
            errors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            errors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                await GuidanceBackend.signup(name, email, password);
                toast.success('Signup successful');
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } catch (error) {
                console.error('Signup failed', error);
                toast.error('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center mt-[60px]">
            <div className="bg-white px-8 py-6 rounded-md shadow-md border w-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-start">
                        <label htmlFor="name" className="block text-gray-700">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`mt-1 bg-[#fff] text-black block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="mb-4 text-start">
                        <label htmlFor="email" className="block text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`mt-1 bg-[#fff] text-black block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="mb-6 text-start">
                        <label htmlFor="password" className="block text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 bg-[#fff] text-black block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#800080]  text-white py-2 rounded-md hover:bg-[#b19cd9] focus:outline-none focus:ring-2 focus:ring-[#b19cd9] focus:ring-opacity-50"
                    >
                        Signup
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Signup;
