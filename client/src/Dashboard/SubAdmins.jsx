import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubadminManager = () => {
    const [subadmins, setSubadmins] = useState([]);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        permissions: []
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchSubadmins = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/api/admin/subadmins", {
                withCredentials: true,
            });
            setSubadmins(data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch subadmins");
        }
    };

    useEffect(() => {
        fetchSubadmins();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                permissions: [...prev?.permissions, value]
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                permissions: prev?.permissions?.filter((perm) => perm !== value)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
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
            setFormData({ name: "", email: "", password: "", permissions: [] });
            setIsEditMode(false);
            setEditId(null);
            fetchSubadmins();
            setShow(false)
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleEdit = (subadmin) => {
        setFormData({
            name: subadmin.name,
            email: subadmin.email,
            password: "",
            permissions: subadmin.permissions || []
        });
        setIsEditMode(true);
        setEditId(subadmin._id);
        setShow(true)
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
        <div className=" mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-gray-800">Subadmins Manager</h2>

                <div className="w-1/5   min-w-fit flex  gap-4 justify-end items-center  ">
                    <button className="bg-amber-400 text-white  min-w-fit hover:bg-amber-600 hover:text-blue-50 px-2 py-2.5 rounded-md shadow-lg duration-75 transition-all whitespace-nowrap flex " onClick={() => { setShow(!show) }}>{show ? "View Subadmins" : "Add Subadmins"}</button>
                </div>
            </div>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("orders")}
                                            value="orders" />
                                        <label htmlFor=""> Orders     </label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("products")}
                                            value="products" />
                                        <label htmlFor=""> Products  </label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("add_products")}
                                            value="add_products" />
                                        <label htmlFor=""> Add_products </label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("update_products")}
                                            value="update_products" />
                                        <label htmlFor=""> Update_products  </label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("delete_products")}
                                            value="delete_products" />
                                        <label htmlFor=""> Delete_products  </label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2 " name="permissions"
                                            onChange={handleCheckboxChange}
                                            checked={formData?.permissions?.includes("users")}
                                            value="users" />
                                        <label htmlFor=""> Users  </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-amber-400 text-white  min-w-fit hover:bg-amber-600 hover:text-blue-50 px-2 py-2.5 rounded-md shadow-lg duration-75 transition-all whitespace-nowrap flex "
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
                                    <th className="px-4 py-3">Permissions</th>
                                    <th className="px-4 py-3">Active</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subadmins.map((subadmin, index) => (
                                    <tr key={subadmin._id} className="hover:bg-blue-50 transition">
                                        <td className="px-4 py-2">{subadmin.name}</td>
                                        <td className="px-4 py-2">{subadmin.email}</td>
                                        <td className="px-4 py-2 capitalize">{subadmin.role}</td>
                                        <td className="px-4 py-2 w-40 capitalize  flex justify-between flex-wrap items-center gap-1 ">{subadmin.permissions.map((v) => (
                                            <p> {v}</p>
                                        ))}</td>
                                        <td className="px-4 py-2 capitalize">{subadmin.status.toString()}</td>
                                        <td className="px-6 py-3 min-w-fit whitespace-nowrap">
                                            <button
                                                onClick={() => handleEdit(subadmin)}
                                                className=" text-xs font-semibold   rounded-lg hover:scale-110"
                                            >
                                                <img src="/img/newedit.svg" alt="" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subadmin._id)}
                                                className=" text-xs font-semibold  ms-2  rounded-lg  hover:scale-110"
                                            >
                                                <img src="/img/delete-icon.svg" alt="" />
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
