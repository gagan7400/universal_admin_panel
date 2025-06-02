import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="flex h-screen overflow-hidden">

            <div className={` bg-amber-500  transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[212px]'}`}  >
                <div className="h-full p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-center">
                            <div className="w-50 flex flex-nowrap justify-start items-center gap-3" onClick={() => { setIsCollapsed(!isCollapsed) }}>
                                <img className='w-10' src="/img/universal-logo-unscreen.gif" alt="" />
                                {!isCollapsed && <span className='text-lg text-amber-50'>URAC</span>}
                            </div>

                        </div>
                        <div className="space-y-4 mt-10">
                            {[
                                { path: "/dashboard", icon: '🏠', text: 'Dashboard' },
                                { path: "/dashboard/users", icon: '👥', text: 'Users' },
                                { path: "/dashboard/products", icon: '📝', text: 'Products' },
                                { path: "/dashboard/orders", icon: '⚙️', text: 'Orders' },
                            ].map((item, index) => (
                                <NavLink to={item.path}
                                    key={index}
                                    className="flex items-center gap-3 p-2 text-amber-50 transition-all  duration-500   hover:bg-amber-500 hover:text-blue-950 rounded cursor-pointer"
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {!isCollapsed && <span className="text-lg " >{item.text}</span>}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex  flex-col bg-red-100">
                <nav className="p-4 bg-amber-500 flex justify-end gap-4 items-center">
                    {/*<div className=' flex justify-center items-center'>
                     {isCollapsed && <div className="flex justify-center items-center  ">
                            <video className="size-10" autoPlay loop muted playsInline alt="Logo" >
                                <source src="/img/universal_logo.mp4" />
                            </video>
                        </div>} 
                    </div>*/}
                    <div className=' flex justify-between gap-4 items-center'>
                        <img src="/img/notification.svg" alt="Notification" />
                        <img src="/img/search.svg" alt="Search" />
                        <button className="flex items-center gap-1 p-2 border bg-white rounded">
                            Admin <img src="/img/dropdown.svg" alt="Dropdown" />
                        </button></div>
                </nav>
                <div className="main_content p-6 overflow-auto no-scrollbar">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
