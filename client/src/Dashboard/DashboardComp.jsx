import React, { useEffect } from 'react'
import MonthlySalesChart from './MonthlySalesChart'
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, } from "../icons/index.js";
import RecentOrders from './RecentOrders.jsx';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { countOrders } from '../redux/actions/orderAction.js';
import { countUsers } from '../redux/actions/userAction.js';
import { countProducts } from '../redux/actions/productAction.js';
export default function DashboardComp() {
    let { ordercount } = useSelector(state => state.order);
    let { usercount } = useSelector(state => state.user);
    let { productcount } = useSelector(state => state.product);
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(countOrders())
        dispatch(countUsers())
        dispatch(countProducts())
    }, [])
    return (
        <div className='sm:p-6 p-3'>
            <div className="grid grid-cols-1 gap-4  lg:grid-cols-3 md:gap-6  ">
                <NavLink to="/dashboard/users" className="rounded-2xl border border-gray-200 bg-white p-5 not-[]:md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12 bg-yellow-500  transition-all duration-700  hover:bg-yellow-400 hover:text-blue-400 rounded-xl  ">
                        <GroupIcon className="transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400    " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
                                Customers
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                {usercount && usercount}
                            </h4>
                        </div>
                        <Badge color="success">
                            <ArrowUpIcon />
                            11.01%
                        </Badge>
                    </div>
                </NavLink>
                <NavLink to="/dashboard/orders" className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12  text-gray-500 bg-yellow-500 hover:bg-yellow-400  hover:text-blue-400 rounded-xl  ">
                        <BoxIconLine className=" 0  transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400 " />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
                                Orders
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                {ordercount && ordercount}
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon />
                            9.05%
                        </Badge>
                    </div>
                </NavLink>
                <NavLink to="/dashboard/products" className="rounded-2xl border border-gray-200 bg-white p-5     md:p-6">
                    <div className="group flex items-center justify-center w-12 h-12 text-gray-500 bg-yellow-500 hover:bg-yellow-400  hover:text-blue-400 rounded-xl  ">
                        <BoxIconLine className="transition-all duration-700 text-2xl text-gray-50 group-hover:text-blue-400" />
                    </div>
                    <div className="flex items-end justify-between mt-5">
                        <div>
                            <span className="text-sm text-gray-800  ">
                                Total Products
                            </span>
                            <h4 className="mt-2 font-bold text-gray-800 text-title-sm  ">
                                {productcount && productcount}
                            </h4>
                        </div>

                        <Badge color="error">
                            <ArrowDownIcon />
                            9.05%
                        </Badge>
                    </div>
                </NavLink>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className=' mt-4'>
                    <MonthlySalesChart />
                </div>
                <div className=' mt-4'>
                    <RecentOrders />
                </div>
            </div>
        </div>
    )
}
