'use client';

import { useAuth } from '@/hooks/auth';
import Header from '@/app/(app)/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

const EditBook = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const [formData, setFormData] = useState({
    bookname: '',
    bookauthor: '',
    isbn: '',
    issn: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBook();
    }
  }, [user, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        }
      );
      router.push('/books');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update book.');
    }
  };

  return (
    <>
      <Header title="Edit Book" text="Update the details of the selected book." />
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {!loading && (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">

            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Book Title
              </label>

              <Image src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/book_covers/${formData.cover_image_url}`} alt={formData.title} className="w-full h-auto rounded-lg" />
            </div>

            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Book Title
              </label>
              <input
                type="text"
                name="bookname"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                name="bookauthor"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                ISSN
              </label>
              <input
                type="text"
                name="issn"
                value={formData.issn}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-blue-600 text-white text-sm sm:text-base font-bold hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.push('/books')}
                className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-gray-300 text-gray-800 text-sm sm:text-base font-bold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditBook;