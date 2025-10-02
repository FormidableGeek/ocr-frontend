'use client';

import { useAuth } from '@/hooks/auth';
import Nav from '@/app/(app)/Nav';
import Loading from '@/app/(app)/Loading';
import { useState } from 'react';

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' });
  const [isNavOpen, setIsNavOpen] = useState(false); // State for mobile nav toggle

  if (!user) {
    return <Loading />;
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-neutral-50 overflow-x-hidden"
      style={{ fontFamily: 'Inter' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Mobile Nav Toggle */}
        <button
          className="lg:hidden p-4 focus:outline-none"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isNavOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
        <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6 lg:px-8 py-5">
          {/* Navigation: Hidden on mobile when closed */}
          <div className={`${isNavOpen ? 'block' : 'hidden'} lg:block lg:w-64`}>
            <Nav />
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;