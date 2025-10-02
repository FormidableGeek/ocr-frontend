'use client';

import React from 'react'; // Added React import
import { useAuth } from '@/hooks/auth';
import Header from '@/app/(app)/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecentActivity() {
  const { user } = useAuth({ middleware: 'auth' });
  const [recentBooks, setRecentBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/recent`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );
        setRecentBooks(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch recent books.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentBooks();
    }
  }, [user]);

  return (
    <>
      <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Recent Activity
      </h2>
      <div className="grid grid-cols-[40px_1fr] gap-x-2 px-4">
        {loading && (
          <p className="text-center text-gray-500 col-span-2">Loading...</p>
        )}
        {error && (
          <p className="text-red-500 text-center col-span-2">{error}</p>
        )}
        {!loading && !error && recentBooks.length === 0 && (
          <p className="text-center text-gray-500 col-span-2">No recent books found.</p>
        )}
        {!loading &&
          !error &&
          recentBooks.map((book, index) => (
            <React.Fragment key={book.id}>
              <div className="flex flex-col items-center gap-1 pt-3">
                <div className="text-[#141414]" data-icon="BookOpen" data-size="24px" data-weight="regular">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M224,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h64a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"
                    ></path>
                  </svg>
                </div>
                {index < recentBooks.length - 1 && (
                  <div className="w-[1.5px] bg-[#dbdbdb] h-2 grow"></div>
                )}
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#141414] text-base font-medium leading-normal">
                  Book '{book.title}' added to inventory
                </p>
                <p className="text-neutral-500 text-base font-normal leading-normal">
                  {new Date(book.created_at).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </React.Fragment>
          ))}
      </div>
    </>
  );
}