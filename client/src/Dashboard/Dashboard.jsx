import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="flex h-screen overflow-hidden">

            <div className={`bg-violet-800  transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[212px]'}`}  >
                <div className="h-full p-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            {!isCollapsed && <div className="flex justify-center items-center  mb-6">
                                <video className="size-13" autoPlay loop muted playsInline alt="Logo" >
                                    <source src="/img/universal_logo.mp4" />
                                </video>
                            </div>}
                            {!isCollapsed && (
                                <button onClick={toggleSidebar} className="text-black focus:outline-none rounded-4xl size-13 transition-all duration-500  mb-6" > <img src="/img/close-icon.svg" alt="" /> </button>
                            )}
                            {isCollapsed && (<button onClick={toggleSidebar} className="text-white mb-6 size-13    mx-auto rounded-4xl transition-all duration-500 flex justify-center items-center    " > <img src="/img/menu-icon.svg" alt="" /> </button>)}
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
                <nav className="p-4 bg-amber-500 flex justify-between gap-4 items-center">
                    <div className=' flex justify-center items-center'>
                        {isCollapsed && <div className="flex justify-center items-center  ">
                            <video className="size-10" autoPlay loop muted playsInline alt="Logo" >
                                <source src="/img/universal_logo.mp4" />
                            </video>
                        </div>}
                    </div>
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
