import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="flex h-screen overflow-hidden min-h-[500px]">
            <div style={{ background: 'var(--blue)' }} className={`   transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[212px]'}`}  >
                <div className={`h-full p-4 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
                    <div>
                        <div className="flex items-center justify-center">
                            <div className="w-full flex items-center gap-3 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
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
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-300
     ${isActive ? 'bg-amber-400 text-blue-950' : 'text-amber-50 hover:bg-amber-400 hover:text-blue-950'}`
                                    }
                                >
                                    <img src={item.icon} alt="" className="w-6 h-6" loading="lazy" />
                                    <span className={`text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                        {item.text}
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex  flex-col bg-red-100 ">
                <nav className="p-4   flex justify-end gap-4 items-center">
                    <div className=' flex justify-between gap-4 items-center'>
                        <img src="/img/notification.svg" alt="Notification" />
                        <img src="/img/search.svg" alt="Search" />
                        <button className="flex items-center gap-1 p-2 border bg-white rounded">
                            Admin <img src="/img/dropdown.svg" alt="Dropdown" />
                        </button></div>
                </nav>
                <div className="main_content  p-6 overflow-auto no-scrollbar ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
