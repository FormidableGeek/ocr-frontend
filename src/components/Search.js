'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import axios from 'axios';

export default function Search() {
  const { user } = useAuth({ middleware: 'auth' });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to perform search.');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, user]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div
            className="text-neutral-500 flex border-none bg-[#ededed] items-center justify-center pl-4 rounded-l-lg border-r-0"
            data-icon="MagnifyingGlass"
            data-size="24px"
            data-weight="regular"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path
                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
              ></path>
            </svg>
          </div>
          <input
            placeholder="Search for books, members, or transactions"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-full placeholder:text-neutral-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </label>
      {loading && <p className="text-center text-gray-500 mt-2">Searching...</p>}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <h3 className="text-[#141414] text-base font-medium mb-2">Search Results</h3>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.id} className="text-[#141414] text-sm">
                {result.type === 'book' && (
                  <span>
                    Book: {result.title} by {result.author}
                  </span>
                )}
                {result.type === 'member' && (
                  <span>
                    Member: {result.name} ({result.email})
                  </span>
                )}
                {/* Add transaction case if implemented */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}