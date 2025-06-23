import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    let dispatch = useDispatch();
    return (
        <div style={{ background: 'var(--blue)' }} className={`    transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-[250px]'}`}  >
            <div className={`h-full p-4 flex flex-col  justify-between transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[250px]'}`}>
                <div>
                    <div className="flex items-center justify-center">
                        <div className="w-full flex items-center gap-3 cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                            <img className='w-10' src="/img/universal-logo-unscreen.gif" alt="" />
                            <span className={`text-lg text-amber-50 transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                URAC
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4 mt-10 ">
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
                                    `flex items-center  ${isCollapsed ? ' gap-0' : " gap-3"} p-2 rounded cursor-pointer transition-all duration-300
     ${isActive ? 'bg-amber-400 text-blue-950' : 'text-amber-50 hover:bg-amber-400 hover:text-blue-950'}`
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
                    <div onClick={() => { dispatch(logout()) }} className={`flex items-center  gap-3 p-2 rounded cursor-pointer transition-all duration-300 text-amber-50 hover:bg-amber-400 hover:text-blue-950`} >
                        <img src="/img/logout.svg" alt="" className="w-6 h-6" loading="lazy" />
                        <span className={`text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 ' : 'opacity-100 w-auto'}`}>
                            Logout
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
