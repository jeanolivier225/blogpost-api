import {useState} from "react";
import {ChevronDown, Grid, Menu, Puzzle, User2, X} from "lucide-react";
import {authService} from "../services/http.service";
import {Link} from "react-router-dom";

const Navbar = () => {
    const [show, setShow] = useState(false);
    const [profile, setProfile] = useState(false);

    const { name } = authService.getCurrentUser();

    return (
        <>
            <div className="bg-gray-200 h-full w-full">
                {/* Desktop Navigation */}
                <nav className="w-full bg-gray-800 hidden xl:block shadow">
                    <div className="container px-6 h-16 flex justify-between items-center lg:items-stretch mx-auto">
                        <div className="flex items-center">
                            <div className="mr-10 flex items-center">
                                <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">FM</span>
                                </div>
                                <h3 className="text-base text-white font-bold ml-3 hidden lg:block">First Magazine</h3>
                            </div>
                            <ul className="hidden xl:flex items-center h-full">
                                <li className="cursor-pointer h-full flex items-center text-sm text-indigo-300 hover:text-indigo-100 transition duration-150 ease-in-out px-4">
                                    <Link to="/posts">
                                        <div className="flex items-center">
                                            <Grid size={20} className="mr-2" />
                                            All articles
                                        </div>
                                    </Link>
                                </li>
                                <li className="cursor-pointer h-full flex items-center text-sm text-white hover:text-indigo-300 transition duration-150 ease-in-out px-4">
                                    <Link to="/feeds">
                                        <div className="flex items-center">
                                            <Puzzle size={20} className="mr-2" />
                                            Feeds
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="h-full hidden xl:flex items-center justify-end">
                            <div className="flex items-center pl-8 relative cursor-pointer"
                                onClick={() => setProfile(!profile)}>
                                {profile && (
                                    <ul className="p-2 w-40 bg-white absolute rounded left-0 shadow mt-12 top-0 z-50">
                                        <li className="cursor-pointer text-gray-600 text-sm py-2 hover:text-indigo-700">
                                            <Link to="/profil">
                                                <div className="flex items-center">
                                                    <User2 size={20} className="text-gray-600" />
                                                    <p className="text-gray-600 ml-3">Profil</p>
                                                </div>
                                            </Link>

                                        </li>
                                        <li>
                                            <div className="flex items-center " onClick={() => authService.logout()}>
                                                <p className="text-gray-600 ml-3">Logout</p>
                                            </div>
                                        </li>
                                    </ul>
                                )}
                                <User2 size={20} className="text-white" />
                                <p className="text-white text-sm ml-2">{name}</p>
                                <ChevronDown size={16} className="text-white ml-1" />
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <nav className="xl:hidden">
                    <div className="py-4 px-6 w-full flex justify-between items-center bg-gray-800 fixed top-0 z-40">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">FM</span>
                            </div>
                            <p className="text-white font-bold ml-3">First Magazine</p>
                        </div>
                        <div onClick={() => setShow(!show)} className="text-white cursor-pointer">
                            {show ? <X size={24} /> : <Menu size={24} />}
                        </div>
                    </div>

                    {/* Mobile Sidebar */}
                    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform transition-transform duration-300 ${show ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">FM</span>
                                        </div>
                                        <p className="text-white font-bold ml-3">First Magazine</p>
                                    </div>
                                    <X size={24} className="text-white cursor-pointer" onClick={() => setShow(false)} />
                                </div>

                                <ul className="space-y-6">
                                    <li className="text-indigo-300 flex items-center cursor-pointer">
                                        <Link to="/posts">
                                            <div className="flex items-center">
                                                <Grid size={20} className="mr-3" />
                                                All articles
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="text-white flex items-center cursor-pointer">
                                        <Link to="/feeds">
                                            <div className="flex items-center">
                                                <Puzzle size={20} className="mr-3" />
                                                Feeds
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center " onClick={() => authService.logout()}>
                                            <p className="text-gray-600 ml-3">Logout</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                <Link to="/profil">
                                    <div className="flex items-center">
                                        <User2 size={20} className="text-gray-600" />
                                        <p className="text-gray-600 ml-3">{name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Backdrop */}
                    {show && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setShow(false)}
                        />
                    )}
                </nav>
            </div>
        </>
    );
};

export default Navbar;
