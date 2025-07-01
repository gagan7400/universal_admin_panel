import React from 'react'
import MonthlySalesChart from './MonthlySalesChart'
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, } from "../icons/index.js";
import RecentOrders from './RecentOrders.jsx';
import { NavLink } from 'react-router-dom';
export default function DashboardComp() {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                <NavLink to="/dashboard/users" className="rounded-2xl border border-gray-200 bg-white p-5 not-[]:md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12 bg-amber-300  transition-all duration-700  hover:bg-amber-200 hover:text-blue-400 rounded-xl  ">
                        <GroupIcon className="transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400    " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
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
                </NavLink>

                <NavLink to="/dashboard/orders" className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12  text-gray-500 bg-amber-300 hover:bg-amber-200  hover:text-blue-400 rounded-xl  ">
                        <BoxIconLine className=" 0  transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400 " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
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
                </NavLink>
                <NavLink to="/dashboard/products" className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12 text-gray-500 bg-amber-300 hover:bg-amber-200  hover:text-blue-400 rounded-xl  ">
                        <BoxIconLine className="transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400" />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
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
                </NavLink>
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
