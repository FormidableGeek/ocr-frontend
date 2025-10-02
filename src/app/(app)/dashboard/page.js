'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/(app)/Header';
import Search from '@/components/Search';
import { useAuth } from '@/hooks/auth';
import DashboardCard from '@/components/DashboardCard';

import RecentActivity from '@/components/RecentActivity';
import axios from 'axios';

export default function Dashboard() {
  const { user } = useAuth({ middleware: 'auth' });
  const [dashboardStats, setDashboardStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    recentActivities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/stats`, // Hypothetical endpoint
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Accept': 'application/json',
            },
            withCredentials: true,
          }
        );
        setDashboardStats(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <Header title="Dashboard" text="Overview of your library activities." />
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"> 
          <DashboardCard title="Total Books" count={dashboardStats.totalBooks} />
          <DashboardCard title="Total Series" count={dashboardStats.totalSeries} />
          <DashboardCard title="Total Non-series" count={dashboardStats.totalNonSeries} />
          <DashboardCard title="Members" count={dashboardStats.totalMembers} />

        </div>

        <Search />
                  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-[#141414] text-base font-medium mb-2">Recent Activities</h3>
            <p className="text-[#141414] text-2xl font-bold">{dashboardStats.recentActivities}</p>
          </div>
        <RecentActivity />
      </div>
    </>
  );
}