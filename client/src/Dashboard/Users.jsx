import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { getAllUsers } from "../redux/actions/userAction";
export default function Users() {
    // const [users, setusers] = useState([]);
    const [filteredusers, setFilteredusers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const itemsPerPage = 5;
    let dispatch = useDispatch();
    let { loading, error, users } = useSelector(state => state.user);

    // const getusers = async () => {
    //     try {
    //         let { data } = await axios.get("http://localhost:4000/api/user/getallusers", {
    //             withCredentials: true
    //         });
    //         if (data.success) {
    //             setusers(data.data);
    //             setFilteredusers(data.data);
    //         } else {
    //             setusers([]);
    //         }
    //     } catch (error) {
    //         console.log("Error Fetching Data", error);
    //     }
    // };

    useEffect(() => {
        dispatch(getAllUsers())
    }, []);
    useEffect(() => {
        setFilteredusers(users);
    }, [users])

    useEffect(() => {
        let temp = [...users];

        // 🌟 Search filter: checks firstName, lastName, email, phone
        if (search) {
            const keyword = search.toLowerCase();
            temp = temp.filter((item) =>
                `${item.firstName} ${item.lastName} ${item.email} ${item.phone}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }

        // 🏷️ Optional category filter
        if (selectedCategory && selectedCategory !== "All") {
            if (selectedCategory == "Active Users") {
                temp = temp.filter((item) => item.isActive.toString() === "true");
            } else if (selectedCategory == "DeActivate Users") {
                temp = temp.filter((item) => item.isActive.toString() === "false");
            } else if (selectedCategory == "Verified Users") {
                temp = temp.filter((item) => item.isVerified.toString() === "true");
            } else if (selectedCategory == "UnVerified Users") {
                temp = temp.filter((item) => item.isVerified.toString() === "false");
            }
        }

        // 🔃 Sorting logic
        if (sortField) {
            temp.sort((a, b) => {
                const valA = a[sortField] ?? "";
                const valB = b[sortField] ?? "";
                return sortOrder === "asc"
                    ? valA.localeCompare?.(valB) ?? valA - valB
                    : valB.localeCompare?.(valA) ?? valB - valA;
            });
        }

        setFilteredusers(temp);
        setCurrentPage(1);
    }, [search, sortField, sortOrder, selectedCategory, users]);

    const columns = [
        { label: "Sno", key: null },
        { label: "Image", key: null },
        { label: "Name", key: "firstName" },
        { label: "Email", key: "email" },
        { label: "Phone Number", key: "phone" },
        { label: "Active", key: "isActive" },
        { label: "Verified", key: "isVerified" },
    ];

    const handleSort = (key) => {
        if (!key) return; // Skip sorting for Sno, Image
        if (sortField === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(key);
            setSortOrder("asc");
        }
    };

    const categories = [
        { category: "All", value: "All" },
        { category: "Active Users", value: "true" },
        { category: "DeActivate Users", value: "false" },
        { category: "Verified Users", value: "true" },
        { category: "UnVerified Users", value: "false" },
    ];
    const totalPages = Math.ceil(filteredusers.length / itemsPerPage);
    const paginatedData = filteredusers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="  mx-auto bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users Dashboard</h2>

            {/* Top controls */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="p-2 w-2/12  min-w-fit border rounded-lg shadow-sm bg-gray-100 text-gray-700"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat.category}>
                            {cat.category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                    <thead className="bg-blue-100 text-gray-700 text-xs uppercase">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 cursor-pointer select-none"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm capitalize">{col.label}</span>
                                        {col.key && (
                                            sortField === col.key ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((v, i) => (
                            <tr key={v._id} className="hover:bg-blue-50">
                                <td className="px-6 py-3">{i + 1}</td>
                                <td className="px-6 py-3"> {v.image && v.image?.filename ? <img className="size-8 rounded-2xl" src={v.image.url} alt="d" /> : <img src="/img/user.svg" />}</td>
                                <td className="px-6 py-3  text-blue-900 font-medium">{v.firstName} {v.lastName}</td>
                                <td className="px-6 py-3">{v.email}</td>
                                <td className="px-6 py-3">{v.phone}</td>
                                <td className="px-6 py-3">{v.isActive.toString()}</td>
                                <td className="px-6 py-3">{v.isVerified.toString()}</td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                <p>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredusers.length)} of{" "}
                    {filteredusers.length} entries
                </p>
                <div className="flex space-x-1">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

