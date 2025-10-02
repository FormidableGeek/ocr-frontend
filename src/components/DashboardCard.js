export default function DashboardCard({title,count}){
    return (
         <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#dbdbdb]">
                <p className="text-[#141414] text-base font-medium leading-normal">{title}</p>
                <p className="text-[#141414] tracking-light text-2xl font-bold leading-tight">{count}</p>
              </div>
        </div>
    );
}