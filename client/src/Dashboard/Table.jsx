import React, { useState, useMemo } from 'react';

const initialData = [
    { name: 'Noel', email: 'noel@example.com', position: 'Customer Data Director', company: 'Howell - Rippin', country: 'Germany' },
    { name: 'Jonathan', email: 'jonathan@example.com', position: 'Senior Implementation Architect', company: 'Hauck Inc', country: 'Holy See' },
    { name: 'Harold', email: 'harold@example.com', position: 'Forward Creative Coordinator', company: 'Metz Inc', country: 'Iran' },
    { name: 'Cathy', email: 'cathy@example.com', position: 'Customer Data Director', company: 'Ebert, Schamberger and Johnston', country: 'Mexico' },
    { name: 'Kerry', email: 'kerry@example.com', position: 'Lead Applications Associate', company: 'Feeney, Langworth and Tremblay', country: 'Niger' },
    { name: 'Alice', email: 'alice@example.com', position: 'Software Engineer', company: 'Alpha Corp', country: 'India' },
    { name: 'Bob', email: 'bob@example.com', position: 'Product Manager', company: 'Beta LLC', country: 'USA' },
    { name: 'Charlie', email: 'charlie@example.com', position: 'UI Designer', company: 'Gamma Ltd', country: 'France' },
    { name: 'David', email: 'david@example.com', position: 'CTO', company: 'Delta Group', country: 'UK' },
    { name: 'Eva', email: 'eva@example.com', position: 'Data Analyst', company: 'Epsilon Pvt', country: 'Canada' },
];

const columns = ['name', 'email', 'position', 'company', 'country'];

export default function TableWithFeatures() {
    const [data, setData] = useState(initialData);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');

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

    const handleSave = (index) => {
        const updated = [...data];
        updated[index].position = editingValue;
        setData(updated);
        setEditingRowIndex(null);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Card Table</h2>

                <div className="flex flex-wrap gap-3 mb-4">
                    {columns.map((col) => (
                        <label key={col} className="text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(col)}
                                onChange={() => toggleColumn(col)}
                                className="mr-1"
                            />
                            {col}
                        </label>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Search..."
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <table className="min-w-full table-auto border border-gray-300 text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            {visibleColumns.map((col) => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    className="p-3 cursor-pointer select-none"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="capitalize">{col}</span>
                                        <span>{sortField === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-t">
                                {visibleColumns.map((col) => (
                                    <td
                                        key={col}
                                        className="p-3"
                                        onDoubleClick={() => col === 'position' && handleDoubleClick((currentPage - 1) * rowsPerPage + rowIndex)}
                                    >
                                        {col === 'position' && editingRowIndex === (currentPage - 1) * rowsPerPage + rowIndex ? (
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={() => handleSave((currentPage - 1) * rowsPerPage + rowIndex)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSave((currentPage - 1) * rowsPerPage + rowIndex)}
                                                className="border p-1 rounded w-full"
                                                autoFocus
                                            />
                                        ) : (
                                            row[col]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} results
                    </p>
                    <div className="space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
