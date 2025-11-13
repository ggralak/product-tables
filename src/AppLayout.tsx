import {Outlet} from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <div className="flex justify-center w-full bg-white pt-2 sm:pt-4">
                <Outlet/>
            </div>
        </div>
    )
}

export default AppLayout;