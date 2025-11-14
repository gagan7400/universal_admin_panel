import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'

export default function OrderDialog({ order }) {
    let [open, setOpen] = useState(false);
    return (
        <td className="px-4 py-3">
            <button
                onClick={() => setOpen(true)}
                className="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
            >
                View
            </button>
            <Dialog open={open} onClose={() => setOpen(false)} className="z-50 fixed inset-0 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4   bg-black/30">
                    <DialogPanel className="w-full max-w-6xl rounded-xl bg-white shadow-xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold">Order Details</h2>
                            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-black">Close ✕</button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

                            {/* Left section: Order items and totals */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* User */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">User</h3>
                                    <div className="flex items-center justify-between py-3 border-b last:border-none">
                                        <div className="flex items-center gap-4">
                                            <img src={order?.user?.image?.url} alt={"image"} className="w-16 h-16 object-cover rounded-md  " />
                                            <div>
                                                <p className="font-medium">{order?.user?.name}</p>
                                                <p className="text-sm text-gray-500">Email: {order?.user?.email}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-700">Phone Number : {order?.user?.phone}</p>
                                    </div>
                                </div>
                                {/* Items */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">All Items</h3>
                                    {order?.orderItems?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-3 border-b last:border-none">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md  " />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gray-700">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart totals */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-4">Cart Totals</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{order?.itemsPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span>₹{order?.shippingPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (GST):</span>
                                            <span>₹{order?.taxPrice}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-orange-600 border-t pt-2 mt-2">
                                            <span>Total Price:</span>
                                            <span>₹{order?.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right section: Summary, address, payment */}
                            <div className="space-y-6">

                                {/* Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
                                    <p><span className="text-gray-500">Order ID:</span> <strong>#{order?._id?.slice(-6).toUpperCase()}</strong></p>
                                    <p><span className="text-gray-500">Date:</span> {new Date(order?.createdAt).toLocaleDateString()}</p>
                                    <p><span className="text-gray-500">Total:</span> <span className="text-red-500 font-bold">₹{order?.totalPrice}</span></p>
                                </div>

                                {/* Shipping address */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                                    <p className="text-sm text-gray-600">
                                        {order?.shippingInfo?.address}, {order?.shippingInfo?.city}, {order?.shippingInfo?.state},<br />
                                        {order?.shippingInfo?.country} - {order?.shippingInfo?.pinCode}
                                    </p>
                                </div>

                                {/* Payment method */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                                    <p className="text-sm text-gray-600">{order?.paymentInfo?.status === 'COD' ? 'Cash on Delivery (COD)' : `Online - ${order?.paymentInfo?.status}`}</p>
                                </div>

                                {/* Delivery date */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Expected Date Of Delivery</h3>
                                    <p className="text-sm text-green-600 font-medium">
                                        {order?.createdAt ? order?.orderStatus == "Delivered" ? "Delivered" : new Date(order.createdAt).toDateString() : "Not Delivered Yet"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </td>
    )
}
