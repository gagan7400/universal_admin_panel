import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../redux/actions/authActions';

export default function SubAdmins() {
    let dispatch = useDispatch();
    let { usererror, userloading, users } = useSelector(state => state.auth)
    useEffect(() => {
        dispatch(getAllUsers())
    }, []);
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[100%]">
            {userloading ?
                <h2> laoding...</h2>
                :
                <>
                    <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                        <div>
                            <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5" type="button">
                                <svg className="w-3 h-3 text-gray-500   me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                                </svg>
                                Last 30 days
                                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            <div id="dropdownRadio" className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm  " data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style={{ position: "absolute", inset: "auto auto 0px 0px", margin: "0px", transform: "translate3d(522.5px, 3847.5px, 0px)" }}>
                                <ul className="p-3 space-y-1 text-sm text-gray-700  " aria-labelledby="dropdownRadioButton">
                                    <li>
                                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100  ">
                                            <input id="filter-radio-example-1" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500   focus:ring-2  " />
                                            <label htmlFor="filter-radio-example-1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">Last day</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500  " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500   " placeholder="Search for items" />
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500  ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50   ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    S.No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    FirstName
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    LastName
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    PhoneNumber
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!usererror && users?.map((user, index) => (
                                <tr key={index} className="bg-white border-b   border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {index + 1}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {user.firstName}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.phone}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></>}
        </div>
    )
}
