import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-blue-600">MyLogo</div>

                <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
                    <a href="#" className="hover:text-blue-600">Home</a>
                    <a href="#" className="hover:text-blue-600">About</a>
                    <a href="#" className="hover:text-blue-600">Contact</a>
                </nav>

                <button
                    className="md:hidden text-2xl focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? "✕" : "≡"}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white shadow-lg px-4 pb-4">
                    <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Home</a>
                    <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">About</a>
                    <a href="#" className="block py-2 text-gray-700 hover:text-blue-600">Contact</a>
                </div>
            )}
        </header>
    );
};

export default Header;