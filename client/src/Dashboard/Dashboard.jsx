import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';
export default function Dashboard() {

    return (
        <div className="flex h-screen overflow-hidden min-h-[500px]">
            <Sidebar />
            <div className="flex-1 flex  flex-col bg-red-100 ">
                <nav className="p-4   flex justify-end gap-4 items-center">
                    <div className=' flex justify-between gap-4 items-center'>
                        <img src="/img/notification.svg" alt="Notification" />
                        <img src="/img/search.svg" alt="Search" />
                        <button className="flex items-center gap-1 p-2 border bg-white rounded">
                            Admin <img src="/img/dropdown.svg" alt="Dropdown" />
                        </button></div>
                </nav>
                <div className="main_content  p-6 overflow-auto no-scrollbar ">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
