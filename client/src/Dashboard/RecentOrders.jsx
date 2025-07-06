import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrders } from "../redux/actions/orderAction";
const tableData = [
    {
        id: 1,
        name: "MacBook Pro 13”",
        variants: "2 Variants",
        category: "Laptop",
        price: "$2399.00",
        status: "Delivered",
        image: "/order/product-01.jpg", // Replace with actual image URL
    },
    {
        id: 2,
        name: "Apple Watch Ultra",
        variants: "1 Variant",
        category: "Watch",
        price: "$879.00",
        status: "Pending",
        image: "/product/product-02.jpg", // Replace with actual image URL
    },
    {
        id: 3,
        name: "iPhone 15 Pro Max",
        variants: "2 Variants",
        category: "SmartPhone",
        price: "$1869.00",
        status: "Delivered",
        image: "/product/product-03.jpg", // Replace with actual image URL
    },
    {
        id: 4,
        name: "iPad Pro 3rd Gen",
        variants: "2 Variants",
        category: "Electronics",
        price: "$1699.00",
        status: "Canceled",
        image: "/product/product-04.jpg", // Replace with actual image URL
    },
    {
        id: 5,
        name: "AirPods Pro 2nd Gen",
        variants: "1 Variant",
        category: "Accessories",
        price: "$240.00",
        status: "Delivered",
        image: "/product/product-05.jpg", // Replace with actual image URL
    },
];

export default function RecentOrders() {
    let { allorders, loading, error } = useSelector(state => state.order);
    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllOrders());
    }, [])
 
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4   sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800  ">
                        Recent Orders
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <NavLink to="/dashboard/orders" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800  ">
                        See all
                    </NavLink>
                </div>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-gray-100   border-y">
                        <TableRow>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Products  </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Category  </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Price  </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Status  </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100  ">
                        {allorders && allorders.map((order) => (
                            <TableRow key={order._id} className="">
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                            <img src={order.image} className="h-[50px] w-[50px]" alt={order.name}
                                            />
                                        </div>

                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    {order.category}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    {order.price}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    <Badge size="sm" color={order.orderStatus === "Delivered" ? "success" : order.orderStatus === "Processing" ? "warning" : "error"} >{order.orderStatus} </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
