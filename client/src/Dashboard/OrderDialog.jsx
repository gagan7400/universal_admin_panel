import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API

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
                                            <span>₹{Math.round(order?.itemsPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span>₹{Math.round(order?.shippingPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (GST):</span>
                                            <span>₹{Math.round(order?.taxPrice)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-orange-600 border-t pt-2 mt-2">
                                            <span>Total Price:</span>
                                            <span>₹{Math.round(order?.totalPrice)}</span>
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
                                    <p><span className="text-gray-500">Total:</span> <span className="text-red-500 font-bold">₹{Math.round(order?.totalPrice)}</span></p>
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

                                {/* Invoice: PDF is rendered from HTML template (Puppeteer) */}
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Invoice</h3>
                                    {order?.invoiceNumber ? (
                                        <p className="text-sm text-gray-600 mb-3">{order.invoiceNumber}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 mb-3">Legacy order — PDF is built from the HTML template on open/download.</p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    const res = await axios.get(
                                                        `${API}/api/order/admin/order/${order._id}/invoice`,
                                                        { responseType: 'blob', withCredentials: true }
                                                    )
                                                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
                                                    window.open(url, '_blank', 'noopener,noreferrer')
                                                } catch (error) {
                                                    console.log(error)
                                                    alert('Could not open invoice')
                                                }
                                            }}
                                            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            View invoice (PDF)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    const res = await axios.get(
                                                        `${API}/api/order/admin/order/${order._id}/invoice?download=1`,
                                                        { responseType: 'blob', withCredentials: true }
                                                    )
                                                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
                                                    const a = document.createElement('a')
                                                    a.href = url
                                                    a.download = `${order.invoiceNumber || `invoice-${order._id?.slice(-6)}`}.pdf`
                                                    a.click()
                                                    window.URL.revokeObjectURL(url)
                                                } catch (error) {
                                                    console.log(error)
                                                    alert('Could not download invoice')
                                                }
                                            }}
                                            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800"
                                        >
                                            Download PDF
                                        </button>
                                    </div>
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
