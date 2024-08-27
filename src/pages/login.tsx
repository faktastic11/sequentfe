import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import GuidanceBackend from '@/services/guidanceBackend';
import { useAuth } from '@/context/auth-context';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Email is invalid"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

const Login: React.FC = () => {
    const { setIsAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
    
        // Validate form data using Zod
        const validationResult = loginSchema.safeParse({ email, password });
    
        if (!validationResult.success) {
          const errors = validationResult.error.flatten().fieldErrors;
          if (errors.email) toast.error(errors.email[0]);
          if (errors.password) toast.error(errors.password[0]);
          return;
        }
    
        try {
            await GuidanceBackend.login(email, password);
            setIsAuthenticated(true);
            toast.success('Login successful');
            navigate('/guidance');
        } catch (error:any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
                toast.error(errorMessage);
              } else {
                toast.error('Something went wrong. Please try again later.');
              }
        }
      };

  return (
    <div className="flex items-center justify-center mt-[90px]">
      <div className="bg-white px-8 py-6 rounded-md shadow-md border max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className='space-y-4 text-start'>
          <div className='space-y-1'>
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              className="block w-full"
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              className="block w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
        <p className="mt-5 text-center font-semibold text-primary">
            New here? <Link to="/signup" className="text-neutral-600 hover:underline">Signup</Link>
          </p>
      </div>
    </div>
  );
};

export default Login;
