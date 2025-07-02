import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';
import Sidebar from './Sidebar';

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    let dispatch = useDispatch();
    let offset = (e) => {
        setIsOpen(false)
    }

    return (
        <div className="flex h-screen overflow-hidden min-h-[500px] font-[Poppins]" onClick={offset}>
            {/* Sidebar fixed at 260px */}
            <Sidebar />


            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-red-100 overflow-hidden">

                {/* Top Navbar */}
                <nav className="p-4 flex justify-end gap-4 items-center bg-amber-50">
                    {/* Profile Dropdown */}
                    <div className="flex justify-between gap-4 items-center">
                        <div className="relative me-4">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                                className="group relative transition-all duration-700 flex items-center justify-center text-gray-500 bg-amber-300 hover:bg-amber-200 hover:text-blue-400 rounded-full h-11 w-11"
                            >
                                <i className="fa-regular fa-user text-xl text-white group-hover:text-blue-400"></i>
                                {isOpen && (
                                    <div className="absolute top-[37px] right-[-16px] z-20 mt-6 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
                                        <div className="py-1">
                                            <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100">Profile</NavLink>
                                            <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100">Support</NavLink>
                                            <button
                                                onClick={() => dispatch(logout())}
                                                className="flex items-center gap-1 bg-amber-950 w-full text-left px-4 py-3 text-lg text-gray-100 hover:bg-gray-800"
                                            >
                                                <img src="/img/logout.svg" alt="" className="w-6 h-6" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Body */}
                <div className="main_content flex-1 p-6 overflow-x-auto overflow-y-auto">
                    <div className="min-w-[1200px]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>

        // <div className="flex h-screen overflow-hidden min-h-[500px] font-[Poppins]" onClick={offset}>
        //     <Sidebar />
        //     <div className="flex-1 flex flex-col bg-red-100" style={{
        //         width: "70%",
        //         minWidth: "fit-content",
        //         overflow: "auto"
        //     }}>
        //         <nav className="p-4 flex justify-end gap-4 items-center bg-amber-50">
        //             <div className='flex justify-between gap-4 items-center'>
        //                 <div className="flex items-center gap-2 2xsm:gap-3">
        //                     <div className="relative me-4">
        //                         <div onClick={(e) => {
        //                             e.stopPropagation()
        //                             setIsOpen(!isOpen)
        //                         }} className="group relative transition-all duration-700 flex items-center justify-center text-gray-500 bg-amber-300 hover:bg-amber-200  hover:text-blue-400 rounded-full dropdown-toggle  h-11 w-11  ">
        //                             <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 hidden">
        //                                 <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping">
        //                                 </span>
        //                             </span>
        //                             <div className="relative inline-block  text-left">
        //                                 <i class="fa-regular transition-all duration-700 fa-user text-xl text-gray-50 group-hover:text-blue-400"></i>
        //                                 {isOpen && (
        //                                     <div className="absolute right-[-20px] z-20 mt-6 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        //                                         <div className="py-1">
        //                                             <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100">  Profile  </NavLink>
        //                                             <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" >  Support  </NavLink>
        //                                             <button className="mb-[-4px] flex items-center gap-1  bg-amber-950 w-full text-left px-4 py-3 text-lg border-t-1 border-gray-300 text-gray-100 hover:bg-gray-800 " onClick={() => { dispatch(logout()) }} > <img src="/img/logout.svg" alt="" className="w-6 h-6" loading="lazy" /> <span>Logout</span> </button>
        //                                         </div>
        //                                     </div>
        //                                 )}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </nav>
        //         <div className="main_content p-6 overflow-auto  " style={{ width:"100vw" }} >
        //             <Outlet />
        //         </div>
        //     </div>
        // </div>
    )
}
