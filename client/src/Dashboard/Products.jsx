import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { PlusIcon } from '../icons/index';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const itemsPerPage = 5;

    const getProducts = async () => {
        try {
            let { data } = await axios.get("https://universal-admin-panel.onrender.com/api/product/all");
            if (data.success) {
                setProducts(data.data);
                setFilteredProducts(data.data);
            } else {
                setProducts([]);
                console.log("error", data.message);
            }
        } catch (error) {
            console.log("Error Fetching Data", error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // 🌟 Filtering Logic
    useEffect(() => {
        let temp = [...products];
        if (search) {
            const keyword = search.toLowerCase();
            temp = temp.filter((item) =>
                `${item.name} ${item.category} ${item.price} ${item.size} ${item.stock}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }
        if (selectedCategory !== "All") {
            temp = temp.filter((item) => item.category === selectedCategory);
        }
        if (sortField) {
            temp.sort((a, b) => {
                const valA = a[sortField];
                const valB = b[sortField];
                return sortOrder === "asc"
                    ? valA.localeCompare?.(valB) ?? valA - valB
                    : valB.localeCompare?.(valA) ?? valB - valA;
            });
        }
        setFilteredProducts(temp);
        setCurrentPage(1);
    }, [search, sortField, sortOrder, selectedCategory, products]);

    const deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this ")) {
            try {
                let { data } = await axios.delete("https://universal-admin-panel.onrender.com/api/product/" + id, {
                    withCredentials: true,
                });
                if (data.success) {
                    alert("Product Deleted Successfully");
                    getProducts();
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const categories = ["All", ...new Set(products.map((item) => item.category))];
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedData = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="  mx-auto bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>

            {/* Top controls */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="w-1/5   min-w-fit flex  gap-4 justify-between items-center  ">
                    <NavLink to="/dashboard/product" className="bg-amber-400 text-white  min-w-fit hover:bg-amber-600 hover:text-blue-50 px-2 py-2.5 rounded-md shadow-lg duration-75 transition-all whitespace-nowrap flex ">  Add New Product</NavLink>
                    <select
                        className="p-2 w-25 bg-amber-400 text-white border-0 focus:outline-0 focus:border-0 focus:ring-0 hover:bg-amber-600 hover:text-blue-50 px-3 py-2.5 rounded-md shadow-lg transition-all duration-75"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                    <thead className="bg-blue-100 text-gray-700 text-xs uppercase">
                        <tr>
                            {["name", "price", "description", "category", "stock", "size", "dimensions", "Images"].map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 cursor-pointer select-none"
                                    onClick={() => handleSort(col)}
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="capitalize">{col}</span>
                                        {sortField === col ? (sortOrder === 'asc' ? '▲' : '▼') : '⇅'}
                                    </div>
                                </th>
                            ))}

                            <th className="px-6 py-3">Action </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((v, i) => (
                            <tr key={v._id} className="hover:bg-blue-50">
                                <td className="px-6 py-3 text-blue-900 font-medium">{v.name}</td>
                                <td className="px-6 py-3">₹{v.price}</td>
                                <td className="px-6 py-3">{v.description}</td>
                                <td className="px-6 py-3">{v.category}</td>
                                <td className="px-6 py-3">{v.stock}</td>
                                <td className="px-6 py-3">{v.size}</td>
                                <td className="px-6 py-3">
                                    {v.dimensions.width} x {v.dimensions.height}
                                </td>

                                <td className="px-6 py-3 flex justify-center flex-wrap items-center gap-3">
                                    {v.images.map((img, ind) => {
                                        return (<img key={ind} src={img.url} alt="d" className="w-5 h-5" />
                                        )
                                    })}
                                </td>
                                <td className="px-6 py-3 ">
                                    <button
                                        onClick={() => updateHandler(v._id, v)}
                                        className=" text-xs font-semibold   rounded-lg hover:scale-110"
                                    >
                                        <img src="/img/newedit.svg" alt="" />
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(v._id)}
                                        className=" text-xs font-semibold  ms-2  rounded-lg  hover:scale-110"
                                    >
                                        <img src="/img/delete-icon.svg" alt="" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-6 text-gray-500">
                                    No products found.
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
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
                    {filteredProducts.length} entries
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
