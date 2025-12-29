import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    let offset = (e) => {
        setIsOpen(false)
    }
    let { admin } = useSelector(state => state.auth);
    return (
        <div className="flex h-screen overflow-hidden min-h-[500px] font-[Poppins]" onClick={offset}>

            <Sidebar />

            <div className="flex-1 flex flex-col bg-red-100 overflow-hidden" >

                <nav className="p-4 flex justify-end gap-4 items-center bg-blue-200">
                    {/* Profile Dropdown */}
                    <p className='flex items-center gap-3 p-2 bg-[var(--blue)] hover:bg-blue-900 rounded cursor-pointer transition-all duration-300 text-amber-50 ' style={{ textTransform: "capitalize" }}>{admin?.name}</p>

                    <div className="flex justify-between gap-4 items-center min-w-fit">
                        <div
                            // onClick={(e) => {
                            //     e.stopPropagation();
                            //     setIsOpen(!isOpen);
                            // }}
                            className="group relative transition-all duration-700 flex items-center justify-center text-gray-500 bg-[var(--blue)] hover:bg-blue-900   rounded-full h-11 w-11"
                        >
                            <i className="fa-regular cursor-pointer fa-user text-xl text-white  "></i>
                            {/* {isOpen && (
                                    <div className="absolute top-[37px] right-[-16px] z-20 mt-6 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
                                        <div className="py-1">
                                            <NavLink className="block px-4 py-3 text-lg text-gray-700 hover:bg-[var(--blue)]">Profile</NavLink>
                                            <button
                                                onClick={() => dispatch(logout())}
                                                className="flex items-center gap-1 bg-amber-950 w-full text-left px-4 py-3 text-lg text-gray-100 hover:bg-[var(--blue)]"
                                            >
                                                <img src="/img/logout.svg" alt="" className="w-6 h-6" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )} */}
                        </div>
                    </div>
                </nav>

                <div className="main_content flex-1   overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
