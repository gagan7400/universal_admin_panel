import React, { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';

const Sidebar = () => {
    const dispatch = useDispatch();
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);

    // 🖱️ Mouse event listeners for drag
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            let newWidth = e.clientX;

            // Set limits
            if (newWidth < 74) newWidth = 74;
            if (newWidth > 260) newWidth = 260;

            setSidebarWidth(newWidth);
            setIsCollapsed(newWidth <= 100);
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // ✅ Click to toggle
    const handleToggle = () => {
        if (isCollapsed) {
            setSidebarWidth(260);
            setIsCollapsed(false);
        } else {
            setSidebarWidth(75);
            setIsCollapsed(true);
        }
    };

    return (
        <div style={{ width: `${sidebarWidth}px`, background: 'var(--blue)', zIndex: "10" }} className="relative   transition-all duration-300 ease-in-out" >
            <div style={{ width: `${sidebarWidth}px`, background: 'var(--blue)' }} className="h-full p-4 py-6 flex flex-col justify-between transition-all duration-300">
                {/* Logo and Nav */}
                <div>
                    <div className="flex items-center justify-center">
                        <NavLink to="/dashboard" className="w-full flex items-center gap-3 cursor-pointer">
                            <img className="w-10" src="/img/universal-logo-unscreen.gif" alt="Logo" />
                            <span className={`text-lg text-amber-50 transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                                URAC
                            </span>
                        </NavLink>
                    </div>

                    <div className="space-y-4 mt-10">
                        {[
                            { path: "/dashboard", icon: '/img/dashboard.svg', text: 'Dashboard', exact: true },
                            { path: "/dashboard/users", icon: '/img/users.svg', text: 'Users' },
                            // { path: "/dashboard/product", icon: '/img/newproduct.svg', text: 'Add New Product' },
                            { path: "/dashboard/products", icon: '/img/product.svg', text: 'Products' },
                            { path: "/dashboard/orders", icon: '/img/order.svg', text: 'Orders' },
                            { path: "/dashboard/sub-admins", icon: '/img/subadmin.svg', text: 'Sub Admin' },
                        ].map((item, index) => (
                            <NavLink
                                to={item.path}
                                key={index}
                                end={item.exact}
                                className={({ isActive }) =>
                                    `flex items-center ${isCollapsed ? 'gap-0' : 'gap-3'} p-2 text-amber-50 rounded hover:bg-amber-900 cursor-pointer transition-all duration-300 ${isActive ? 'bg-amber-900' : ''}`
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

                {/* Logout */}
                <div className="space-y-4 mt-10">
                    <div onClick={() => dispatch(logout())} className="flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-300 text-amber-50">
                        <img src="/img/logout.svg" alt="" className="w-6 h-6" loading="lazy" />
                        <span className={`text-lg transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                            Logout
                        </span>
                    </div>
                </div>
            </div>

            {/* Slide Button (Click + Drag) */}
            <div
                onMouseDown={() => { isDragging.current = true }}
                onClick={handleToggle}
                title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
                style={{ zIndex: "-1" }}
                className="absolute top-9 -right-6 transform -translate-y-1/2 w-12 h-12 flex  justify-center bg-amber-300 text-amber-50  rotate-45 rounded-t-sm shadow"
            >
                {/* Icon can be image or emoji */}
                <span className='ms-7 text-2xl rotate-[-45deg]'>{isCollapsed ? '>' : '<'}</span>
            </div>
        </div>
    );
};

export default Sidebar;
