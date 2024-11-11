// components/SignUp.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../../lib/api';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    universityId: '',
    password: '',
    confirmPassword: '',
  });

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumeric, setHasNumeric] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const validatePassword = (password) => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumeric(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prevData) => ({ ...prevData, password }));
    validatePassword(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUp({
        email: formData.username,
        university_id: formData.universityId,
        password: formData.password,
      });
      setSuccess('Registration successful! Please check your email to activate your account.');
      
      // Redirect to activation message page
      setTimeout(() => {
        router.push('/activation-message');
      }, 3000);
    } catch (error) {
      console.error("Full Axios Error:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
      } else {
        console.error("Error in Request Setup:", error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">Sign Up</h1>
        <hr className="mt-3" />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="username" className="block text-base mb-2">Email</label>
            <input
              type="email"
              id="username"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter Email..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="universityId" className="block text-base mb-2">University ID</label>
            <input
              type="text"
              id="universityId"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter University ID..."
              value={formData.universityId}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mt-3">
            <label htmlFor="confirmPassword" className="block text-base mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Criteria Indicators */}
          <div className="space-y-1 text-sm text-gray-600">
            <div className={hasMinLength ? "text-green-500" : "text-gray-600"}>
              {hasMinLength ? "✓" : "✗"} Minimum 8 characters
            </div>
            <div className={hasUpperCase ? "text-green-500" : "text-gray-600"}>
              {hasUpperCase ? "✓" : "✗"} At least one uppercase letter
            </div>
            <div className={hasLowerCase ? "text-green-500" : "text-gray-600"}>
              {hasLowerCase ? "✓" : "✗"} At least one lowercase letter
            </div>
            <div className={hasNumeric ? "text-green-500" : "text-gray-600"}>
              {hasNumeric ? "✓" : "✗"} At least one number
            </div>
            <div className={hasSpecialChar ? "text-green-500" : "text-gray-600"}>
              {hasSpecialChar ? "✓" : "✗"} At least one special character
            </div>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
