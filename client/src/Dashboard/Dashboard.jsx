import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    let dispatch = useDispatch();
    let offset = (e) => {
        setIsOpen(false)
    }
    return (
        <div className="flex h-screen overflow-hidden min-h-[500px] font-[Poppins]" onClick={offset}>
            <div style={{ background: 'var(--blue)' }} className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[74px]' : 'w-[260px]'}`}  >
                <div className={`h-full p-4 py-6 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-[74px] ' : 'w-[260px] '}`}>
                    <div>
                        <div className="flex items-center justify-center">
                            <div className="w-full flex items-center gap-3 cursor-pointer" >
                                <img className='w-10' src="/img/universal-logo-unscreen.gif" alt="" />
                                <span className={`text-lg text-amber-50 transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                    URAC
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4 mt-10">
                            {[
                                { path: "/dashboard", icon: '/img/dashboard.svg', text: 'Dashboard', exact: true },
                                { path: "/dashboard/users", icon: '/img/users.svg', text: 'Users' },
                                { path: "/dashboard/product", icon: '/img/product.svg', text: 'NewProduct' },
                                { path: "/dashboard/products", icon: '/img/product.svg', text: 'Products' },
                                { path: "/dashboard/orders", icon: '/img/order.svg', text: 'Orders' },
                            ].map((item, index) => (
                                <NavLink
                                    to={item.path}
                                    key={index}
                                    end={item.exact}
                                    style={{ background: "f5f5f5" }}
                                    className={({ isActive }) =>
                                        `flex items-center  ${isCollapsed ? ' gap-0' : " gap-3"} p-2 text-amber-50 rounded hover:bg-amber-900    cursor-pointer transition-all duration-300
                                         ${isActive ? 'bg-amber-900 ' : 'text-amber-50  '}`
                                    }
                                >
                                    <img src={item.icon} alt="" className="w-6 h-6" loading="lazy" />
                                    <span className={`text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 ' : 'opacity-100 w-auto'}`}>
                                        {item.text}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4 mt-10">
                        <div onClick={() => { dispatch(logout()) }} className={`flex items-center  gap-3 p-2 rounded cursor-pointer transition-all duration-300 text-amber-50  `} >
                            <img src="/img/logout.svg" alt="" className="w-6 h-6" loading="lazy" />
                            <span className={`text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 ' : 'opacity-100 w-auto'}`}>
                                Logout
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* iconify */}
            <div className="flex-1 flex flex-col bg-red-100" style={{ width: "70%" }}>
                <nav className="p-4 flex justify-between gap-4 items-center bg-amber-50">
                    <div className="border border-gray-300 rounded-lg px-3 py-3 flex justify-center items-center" onClick={(e) => {
                        e.stopPropagation();
                        setIsCollapsed(!isCollapsed)
                    }}>
                        <i className="fa-solid fa-bars text-2xl" ></i>
                    </div>
                    <div className='flex justify-between gap-4 items-center'>
                        <div className="flex items-center gap-2 2xsm:gap-3">
                            <div className="relative me-4">
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(!isOpen)

                                }} className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border   border-gray-300 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 ">
                                    <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 hidden">
                                        <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping">
                                        </span>
                                    </span>
                                    <div className="relative inline-block text-left">
                                        <img className="w-5" src="/img/user (1).svg" alt="" />
                                        {isOpen && (
                                            <div className="absolute right-[-20px] z-20 mt-6 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                <div className="py-1">
                                                    <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100">  Profile  </NavLink>
                                                    <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" >  Support  </NavLink>
                                                    <button className="mb-[-4px] flex items-center gap-1  bg-amber-950 w-full text-left px-4 py-3 text-lg border-t-1 border-gray-300 text-gray-100 hover:bg-gray-800 " onClick={() => { dispatch(logout()) }} > <img src="/img/logout.svg" alt="" className="w-6 h-6" loading="lazy" /> <span>Logout</span> </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="main_content p-6 overflow-auto no-scrollbar ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
