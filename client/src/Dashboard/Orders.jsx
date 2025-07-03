import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getAllOrders } from '../redux/actions/orderAction';
const initialData = [
    { _id: '1', name: 'Noel', email: 'noel@example.com', position: 'Customer Data Director', company: 'Howell - Rippin', country: 'Germany' },
    { _id: '2', name: 'Jonathan', email: 'jonathan@example.com', position: 'Senior Implementation Architect', company: 'Hauck Inc', country: 'Holy See' },
    { _id: '3', name: 'Harold', email: 'harold@example.com', position: 'Forward Creative Coordinator', company: 'Metz Inc', country: 'Iran' },
    { _id: '4', name: 'Cathy', email: 'cathy@example.com', position: 'Customer Data Director', company: 'Ebert, Schamberger and Johnston', country: 'Mexico' },
    { _id: '5', name: 'Kerry', email: 'kerry@example.com', position: 'Lead Applications Associate', company: 'Feeney, Langworth and Tremblay', country: 'Niger' },
    { _id: '6', name: 'Alice', email: 'alice@example.com', position: 'Software Engineer', company: 'Alpha Corp', country: 'India' },
    { _id: '7', name: 'Bob', email: 'bob@example.com', position: 'Product Manager', company: 'Beta LLC', country: 'USA' },
    { _id: '8', name: 'Charlie', email: 'charlie@example.com', position: 'UI Designer', company: 'Gamma Ltd', country: 'France' },
    { _id: '9', name: 'David', email: 'david@example.com', position: 'CTO', company: 'Delta Group', country: 'UK' },
    { _id: '10', name: 'Eva', email: 'eva@example.com', position: 'Data Analyst', company: 'Epsilon Pvt', country: 'Canada' },
];

const columns = ['name', 'email', 'position', 'company', 'country'];

const updatePositionAPI = async (_id, newPosition) => {
    try {
        const response = await fetch(`/api/employees/${_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ position: newPosition }),
        });
        return await response.json();
    } catch (err) {
        console.error('Update failed', err);
    }
};

export default function Orders() {
    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    let { allorders, loading, error } = useSelector(state => state.order)
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllOrders())
    }, [])
    const rowsPerPage = 5;

    const filteredData = useMemo(() => {
        return data.filter(row =>
            visibleColumns.some(column =>
                row[column].toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, data, visibleColumns]);

    const sortedData = useMemo(() => {
        if (!sortField) return filteredData;
        return [...filteredData].sort((a, b) => {
            const valA = a[sortField].toLowerCase();
            const valB = b[sortField].toLowerCase();
            return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
    }, [filteredData, sortField, sortOrder]);

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const toggleColumn = (col) => {
        setVisibleColumns((prev) =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    const handleDoubleClick = (index) => {
        setEditingRowIndex(index);
        setEditingValue(data[index].position);
    };

    const handleSave = async (index) => {
        const updated = [...data];
        const row = updated[index];
        row.position = editingValue;
        setData(updated);
        setEditingRowIndex(null);
        await updatePositionAPI(row._id, editingValue);
    };
    return (
        <div className=" mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Employee Table</h2>
            <div className="flex flex-wrap gap-4">
                {columns.map((col) => (
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

            <input
                type="text"
                placeholder="Search..."
                className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
            />

            <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full border border-gray-200 text-sm text-left bg-white rounded-lg">
                    <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
                        <tr>
                            {visibleColumns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    className="px-4 py-3 cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="capitalize">{col}</span>
                                        <span>{sortField === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row._id}
                                className="hover:bg-blue-50 transition-all duration-150"
                            >
                                {visibleColumns.map((col) => {
                                    const globalIndex = (currentPage - 1) * rowsPerPage + rowIndex;
                                    return (
                                        <td
                                            key={col}
                                            onDoubleClick={() => col === 'position' && handleDoubleClick(globalIndex)}
                                            className={`px-4 py-3 ${col === 'position' && editingRowIndex === globalIndex ? 'bg-yellow-100' : ''
                                                }`}
                                        >
                                            {col === 'position' && editingRowIndex === globalIndex ? (
                                                <input
                                                    type="text"
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    onBlur={() => handleSave(globalIndex)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSave(globalIndex)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
                                                    autoFocus
                                                />
                                            ) : (
                                                row[col]
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <p>
                    Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)} to{' '}
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
                            className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
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
    )
}
