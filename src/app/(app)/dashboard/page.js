"use client"

import { useAuth } from '@/hooks/auth'
import Header from '@/app/(app)/Header'
import RecentActivity from '@/components/RecentActivity'
import Search from '@/components/Search'
import DashboardCard from '@/components/DashboardCard'



const Dashboard = () => {
  const {user} = useAuth({middleware:'auth'})

    return (
        <>


          <Header title="Dashboard" 
                  text={`Welcome back, ${user.name}! Here's an overview of your library's activity.`} />
                
           <Search></Search>

            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">System Overview</h2>
            <div className='grid lg:grid-cols-6  sm:grid-cols-1'> 
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
              <DashboardCard title="Total Books" count="1,250"/>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quick Actions</h2>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Add New Book</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#ededed] text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Issue Book</span>
                </button>
              </div>
            </div>
            <RecentActivity></RecentActivity>
        













        </>
    )
}

export default Dashboard