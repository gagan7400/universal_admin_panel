import { Table, TableBody, TableCell, TableHeader, TableRow, } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrders } from "../redux/actions/orderAction";


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
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Price  </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Payment Status  </TableCell>
                            <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs "  >  Status  </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100  ">
                        {allorders && allorders.slice(0, 5).map((order) => (
                            <TableRow key={order._id} className="">
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                            <img src={order.orderItems[0].image} className="h-[50px] w-[50px]" alt={order.name}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    {order.totalPrice}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    {order.paymentInfo.status}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm  ">
                                    <Badge size="sm" color={order.orderStatus === "Delivered" ? "success" : order.orderStatus === "Processing" ? "warning" : "error"} >{order.orderStatus} </Badge>
                                </TableCell>
                            </TableRow>
                        )).reverse()}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
