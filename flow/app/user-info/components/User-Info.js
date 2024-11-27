'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '../../lib/api'; // Ensure correct path for api.js import

const UserProfileUpdate = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    user_name: '', // Added user_name
    first_name: '',
    last_name: '',
    gender: '',
    phone_number: '',
    department: '',
    year_of_study: '',
    bio: '',
    profile_picture: null,
    interests: [],
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setProfileData({ ...profileData, [name]: files[0] }); // Ensure it's only the first file
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleInterestsChange = (e) => {
    setProfileData({ ...profileData, interests: e.target.value.split(',').map(Number) }); // Ensure correct array of integers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === 'interests') {
        value.forEach((interest) => formData.append('interests', interest)); // Ensure interests are appended properly
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      // Making a PUT request using updateUserProfile from api.js
      await updateUserProfile(formData);
      router.push('/profile'); // Redirect to profile page after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white m-6">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold"><i className="fa-solid fa-user"></i> User Info</h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          {/* User Name Field */}
          <div className="mt-3">
            <label className="block text-base mb-2">User name</label>
            <input
              type="text"
              name="user_name"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter user name"
              value={profileData.user_name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">First name</label>
            <input
              type="text"
              name="first_name"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter first name"
              value={profileData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Last name</label>
            <input
              type="text"
              name="last_name"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter last name"
              value={profileData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 mt-3">
            <div className="col-span-1">
              <label className="block text-base mb-2">Gender</label>
              <select
                name="gender"
                className="mr-3 rounded-lg border"
                value={profileData.gender}
                onChange={handleChange}
              >
                <option disabled>Select your gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-base mb-2">Phone number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="+2348099999999"
                className="border mr-3 rounded-lg"
                value={profileData.phone_number}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Department</label>
            <input
              type="text"
              name="department"
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter department"
              value={profileData.department}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Year of study</label>
            <select
              name="year_of_study"
              className="mr-3 rounded-lg border"
              value={profileData.year_of_study}
              onChange={handleChange}
            >
              <option disabled>Select year of study</option>
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Bio</label>
            <textarea
              name="bio"
              className="border rounded-lg w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter a brief description of yourself"
              value={profileData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Profile picture</label>
            <input
              type="file"
              name="profile_picture"
              className="border rounded-lg w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Interests (comma-separated)</label>
            <input
              type="text"
              className="border rounded-lg w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter interests as numbers, e.g., 1,2,3"
              onChange={handleInterestsChange}
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-purple-800 bg-purple-800 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-purple-800 font-semibold"
            >
              <i className="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;Update my information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileUpdate;
