import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";


const Navbar = () => {
    return (
        <div className="flex fixed top-0 left-0 w-full  items-center justify-between bg-[#E04848] text-white px-6 py-3 shadow-md">
            {/* Logo Section */}
            <div className="flex items-center space-x-2">
                {/* Logo Container */}
                {/* <div className="w-10 h-10 bg-[#E04848] rounded-full overflow-hidden flex items-center justify-center">
                    <img
                        src={"/src/assets/images/logo.png"} // Use the imported logo
                        alt="Logo"
                        className="w-full h-full object-cover" // Ensures the image fits the container
                    />
                </div> */}
                {/* Title */}
                <h1 className="text-lg font-bold">SwiftRide</h1>
            </div>






            {/* Search Section */}
            <div className="flex-1 mx-4 max-w-md">
                <Input
                    type="text"
                    placeholder="Search here"
                    className="w-full border-white bg-white-600 text-white placeholder-gray-800"
                />
            </div>


            {/* User and Notification Section */}
            <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <div className="relative">
                    <Bell className="text-white hover:text-gray-300 cursor-pointer" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-white border"></div>
                </div>
                {/* REMOVED: User Info section */}
            </div>
        </div>
    );
};

export default Navbar;
