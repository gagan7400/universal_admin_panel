import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from '../redux/actions/orderAction';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

const Orders = () => {
    const dispatch = useDispatch();
    const { allorders, loading, error } = useSelector(state => state.order);

    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(['orderId', 'userId', 'status', 'totalPrice', 'paidAt']);
    const [statusFilter, setStatusFilter] = useState('');
    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            let { data } = await axios.put(`http://localhost:4000/api/order/admin/order/${orderId}/`, { orderStatus: newStatus }, { withCredentials: true });
            dispatch(getAllOrders()); // Refresh after update
            toast.success(data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (err) {
            toast.error(err?.response?.data?.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const formattedData = useMemo(() => {
        if (!allorders) return [];
        return allorders.map(order => ({
            orderId: order._id,
            userId: order.user,
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            paidAt: new Date(order.paidAt).toLocaleDateString(),
        }));
    }, [allorders]);

    const rowsPerPage = 5;

    const filteredData = useMemo(() => {
        let result = formattedData;

        // Filter by search
        if (search.trim()) {
            result = result.filter(row =>
                visibleColumns.some(column =>
                    row[column]?.toString().toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        // Filter by status
        if (statusFilter) {
            result = result.filter(row => row.status === statusFilter);
        }

        return result;
    }, [search, formattedData, visibleColumns, statusFilter]);


    const sortedData = useMemo(() => {
        if (!sortField) return filteredData;
        return [...filteredData].sort((a, b) => {
            const valA = a[sortField]?.toString().toLowerCase() || '';
            const valB = b[sortField]?.toString().toLowerCase() || '';
            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
    }, [filteredData, sortField, sortOrder]);

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const toggleColumn = (col) => {
        setVisibleColumns(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    const statusOptions = ["Processing", "Shipped", "Delivered", "Completed", "Cancelled"];


    return (
        <div className="mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <div className="flex flex-wrap gap-4">
                {['orderId', 'userId', 'status', 'totalPrice', 'paidAt'].map(col => (
                    <label key={col} className="text-sm text-gray-700 flex items-center space-x-1">
                        <input
                            type="checkbox"
                            checked={visibleColumns.includes(col)}
                            onChange={() => toggleColumn(col)}
                            className="accent-blue-600 rounded focus:ring-2"
                        />
                        <span>{col}</span>
                    </label>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <select
                    className="p-2 w-35 bg-amber-400 text-white border-0 focus:outline-0 focus:border-0 focus:ring-0 hover:bg-amber-600 hover:text-blue-50 px-3 py-2.5 rounded-md shadow-lg transition-all duration-75"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>


            <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full border border-gray-200 text-sm text-left bg-white rounded-lg">
                    <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
                        <tr>
                            {visibleColumns.map(col => (
                                <th key={col} onClick={() => handleSort(col)} className="px-4 py-3 cursor-pointer">
                                    <div className="flex justify-left gap-2 items-center">
                                        <span className="capitalize">{col}</span>
                                        <span>{sortField === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((row, index) => (
                            <tr
                                disabled={['Delivered', 'Completed'].includes(row.status)}
                                key={row.orderId}
                                className={`transition-all duration-150 ${['Delivered', 'Completed'].includes(row.status)
                                    ? 'bg-green-50 text-green-700 font-semibold'
                                    : 'hover:bg-blue-50'
                                    }`}
                            >
                                {visibleColumns.map(col => (
                                    <td key={col} className="px-4 py-3">
                                        {col === 'status' ? (
                                            <select
                                                disabled={['Delivered', 'Completed'].includes(row.status)}
                                                value={row.status}
                                                onChange={(e) => handleStatusUpdate(row.orderId, e.target.value)}
                                                className={`border rounded px-2 pe-5  py-1 text-sm ${['Delivered', 'Completed'].includes(row.status)
                                                    ? 'bg-green-100 border-green-400 text-green-800 cursor-not-allowed'
                                                    : 'bg-white border-gray-300'
                                                    }`}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            row[col]
                                        )}
                                    </td>

                                ))}
                            </tr>
                        )).reverse()}

                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>
                    Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
                    {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} results
                </p>
                <div className="space-x-1">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Orders;

