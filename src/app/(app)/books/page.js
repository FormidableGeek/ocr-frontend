'use client';

import { useAuth } from '@/hooks/auth';
import Header from '@/app/(app)/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Books = () => {
  const { user } = useAuth({ middleware: 'auth' });
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
        setBooks(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooks();
    }
  }, [user]);

  const handleEdit = (id) => {
    router.push(`/books/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete book.');
      }
    }
  };

  return (
    <>
      <Header title="Books" text="View and manage all books in your library." />
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {books.length === 0 && !loading && (
          <p className="text-center text-gray-500">No books found.</p>
        )}
        {books.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    #
                  </th> 
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    ISBN
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    ISSN
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>

                {books.map((book,count) => (
                  <tr key={book.id} className="border-b">
                    <td className="px-4 py-3 text-sm sm:text-base">{count + 1}</td>
                    <td className="px-4 py-3 text-sm sm:text-base">{book.title}</td>
                    <td className="px-4 py-3 text-sm sm:text-base">{book.author}</td>
                    <td className="px-4 py-3 text-sm sm:text-base">{book.isbn}</td>
                    <td className="px-4 py-3 text-sm sm:text-base">{book.issn}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(book.id)}
                        className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-blue-600 text-white text-sm sm:text-base font-bold hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-lg h-10 px-3 bg-red-600 text-white text-sm sm:text-base font-bold hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Books;