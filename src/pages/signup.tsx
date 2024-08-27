import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuidanceBackend from '@/services/guidanceBackend';
import { Label } from '@/components/ui/label';

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const validationResult = signUpSchema.safeParse({ name, email, password });

        if (!validationResult.success) {
            const formErrors = validationResult.error.flatten().fieldErrors;
            setErrors({
                name: formErrors.name?.[0],
                email: formErrors.email?.[0],
                password: formErrors.password?.[0],
            });
            return;
        }else{
            setErrors({})
        }

        try {
            await GuidanceBackend.signup(name, email, password);
            toast.success('Signup successful');
            navigate('/');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
                toast.error(errorMessage);
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center mt-[60px]">
            <div className="bg-white px-8 py-6 rounded-md shadow-md border w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Signup</h2>
                <form onSubmit={handleSubmit} className='space-y-4 text-start'>
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            className="block w-full"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            className="block w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            className="block w-full"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Signup
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
