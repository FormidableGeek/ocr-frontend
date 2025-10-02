'use client';

import { useAuth } from '@/hooks/auth';
import Header from '@/app/(app)/Header';
import { useState } from 'react';
import axios from 'axios';

const BookUpload = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Fetch CSRF token
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // Make the POST request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/book/inventory`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );

      setResult(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'Failed to extract book information.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!result || result.verified) return;

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/book/${result.bookid}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      setResult({ ...result, verified: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve book.');
    }
  };

  const handleDelete = async () => {
    console.log('Delete button clicked'); // Debug log
    if (!result || result.verified) return;

    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${result.bookid}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );
        console.log('Delete response:', response.data); // Debug log
        setResult(null); // Clear the result state after deletion
      } catch (err) {
        console.log('Delete error:', err); // Debug log
        setError(err.response?.data?.error || 'Failed to delete book.');
      }
    }
  };

  return (
    <>
      <Header title="Add New Book" text="Upload an image to extract book details." />
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto lg:flex lg:items-center lg:gap-4 lg:mt-3">
          <div className="mb-4">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Select Book Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full sm:w-auto min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-black text-neutral-50 text-sm sm:text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Upload'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {result && (
          <div className="mt-6 max-w-lg mx-auto bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Book Information</h3>
            <p className="text-sm sm:text-base">
              <strong>Title:</strong> {result.bookname}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Author:</strong> {result.bookauthor}
            </p>
            <p className="text-sm sm:text-base">
              <strong>ISBN:</strong> {result.isbn}
            </p>
            <p className="text-sm sm:text-base">
              <strong>ISSN:</strong> {result.issn}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Book ID:</strong> {result.bookid}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Status:</strong> {result.verified ? 'Verified' : 'Pending Approval'}
            </p>
            {!result.verified && (
              <button
                onClick={handleApprove}
                className="flex min-w-[120px] mt-3 cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-green-600 text-white text-sm sm:text-base font-bold hover:bg-green-700 transition"
              >
                Approve
              </button>
            )}
            {!result.verified && (
              <button
                onClick={() => handleDelete()}
                className="flex min-w-[80px] mt-3 cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BookUpload;