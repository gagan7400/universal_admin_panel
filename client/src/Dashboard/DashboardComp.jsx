import React from 'react'
import MonthlySalesChart from './MonthlySalesChart'
import Badge from "../ui/badge/Badge";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BoxIconLine,
    GroupIcon,
} from "../icons/index.js";
import RecentOrders from './RecentOrders.jsx';
export default function DashboardComp() {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 not-[]:md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12 bg-amber-300  transition-all duration-700  hover:bg-amber-200 hover:text-blue-400 rounded-xl  ">
                        <GroupIcon className="transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400    " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500  ">
                                Customers
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                3,782
                            </h4>
                        </div>
                        <Badge color="success">
                            <ArrowUpIcon />
                            11.01%
                        </Badge>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl  ">
                        <BoxIconLine className="text-gray-800 size-6  " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500  ">
                                Orders
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                5,359
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon />
                            9.05%
                        </Badge>
                    </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl  ">
                        <BoxIconLine className="text-gray-800 size-6  " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-500  ">
                                Total Products
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                1,000
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon />
                            9.05%
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className='w-1/2 mt-4'>
                    <MonthlySalesChart />
                </div>
                <div className='w-1/2 mt-4'>
                    <RecentOrders />
                </div></div>
        </>
    )
}
