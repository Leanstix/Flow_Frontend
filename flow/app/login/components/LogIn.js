"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { login } from '../../lib/api'; // Ensure this path is correct

export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter(); // Initialize router here but only use it after mount

  // Ensure the component only mounts on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user_id, email: userEmail } = await login(email, password);
      console.log('Login successful!', { token, user_id, userEmail });

      // Redirect to dashboard if login is successful and mounted
      if (mounted) {
        router.push('/dashboard'); // Use router.push from next/navigation
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  if (!mounted) return null; // Prevents server-side rendering issues

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Log In
        </h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="email" className="block text-base mb-2">Username</label>
            <input
              type="email"
              id="email"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="ml-1">Remember Me</label>
            </div>
            <div>
              <a href="#" className="text-purple-800 font-semibold">Forgot Password?</a>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              <i className="fa-solid fa-right-to-bracket"></i> Login
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
}
