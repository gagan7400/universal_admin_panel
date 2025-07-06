import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubadminManager = () => {
    const [subadmins, setSubadmins] = useState([]);
    const [show, setShow] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role:"subadmin",
        permissions: "order",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // const fetchSubadmins = async () => {
    //     try {
    //         const { data } = await axios.get("http://localhost:4000/api/admin/subadmins", {
    //             withCredentials: true,
    //         });
    //         setSubadmins(data.data);
    //     } catch (err) {
    //         toast.error(err.response?.data?.message || "Failed to fetch subadmins");
    //     }
    // };

    // useEffect(() => {
    //     fetchSubadmins();
    // }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const { data } = await axios.put(
                    `http://localhost:4000/api/admin/subadmin/${editId}`,
                    formData,
                    { withCredentials: true }
                );
                toast.success(data.message);
            } else {
                const { data } = await axios.post(
                    "http://localhost:4000/api/admin/subadmin/new",
                    formData,
                    { withCredentials: true }
                );
                toast.success(data.message);
            }
            setFormData({ name: "", email: "", password: "", role: "subadmin" });
            setIsEditMode(false);
            setEditId(null);
            fetchSubadmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving subadmin");
        }
    };

    const handleEdit = (subadmin) => {
        setFormData({
            name: subadmin.name,
            email: subadmin.email,
            password: "",
            role: subadmin.role,
        });
        setIsEditMode(true);
        setEditId(subadmin._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subadmin?")) return;
        try {
            const { data } = await axios.delete(
                `http://localhost:4000/api/admin/subadmin/${id}`,
                { withCredentials: true }
            );
            toast.success(data.message);
            fetchSubadmins();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className=" mx-auto p-8 bg-white shadow-2xl rounded-2xl">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Subadmin Manager</h2>

            {/* Subadmin Form */}
            {show ?
                <>
                    <form onSubmit={handleSubmit} className="space-y-6 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="subadmin">Subadmin</option>
                                    <option value="moderator">Moderator</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            {isEditMode ? "Update Subadmin" : "Add Subadmin"}
                        </button>
                    </form>
                </>
                :
                <>
                    {/* Subadmin Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm text-left rounded-lg overflow-hidden">
                            <thead className="bg-blue-100 text-gray-800 font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subadmins.map((subadmin, index) => (
                                    <tr key={subadmin._id} className="hover:bg-blue-50 transition">
                                        <td className="px-4 py-2">{subadmin.name}</td>
                                        <td className="px-4 py-2">{subadmin.email}</td>
                                        <td className="px-4 py-2 capitalize">{subadmin.role}</td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleEdit(subadmin)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subadmin._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {subadmins.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            No subadmins found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }


        </div>
    );
};

export default SubadminManager;
