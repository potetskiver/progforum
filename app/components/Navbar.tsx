import "../globals.css"

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="flex items-center justify-between bg-gray-800 p-1 pl-4 text-white">
                <ul className="flex space-x-4 navbar-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/categories">Categories</a></li>
                    <li><a href="/trending">Trending</a></li>
                </ul>
            </div>
        </nav>
    );
}