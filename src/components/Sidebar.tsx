import React, { useState, useEffect } from 'react';
import { BiMenu, BiX, BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import guidanceBackend, { RecentSearchesAPIResponse } from '../services/guidanceBackend';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    setActiveCompany: React.Dispatch<React.SetStateAction<string | null>>;
    setSearchCompany: React.Dispatch<React.SetStateAction<boolean>>;
    searchCompany: boolean;
    activeCompany: string | null;
};

const Sidebar: React.FC<Props> = ({ setActiveCompany, setSearchCompany, activeCompany }) => {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>('home');
    const navigate = useNavigate();
    const location = useLocation();
    const fetchRecentSearches = async () => {
        try {
            const response: RecentSearchesAPIResponse = await guidanceBackend.getRecentSearches();
            if (response && response.searches) {
                setRecentSearches(response.searches);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Error fetching recent searches:', error);
        }
    };

    useEffect(()=>{
            setTimeout(() => {
                fetchRecentSearches();
            }, 1000);
    },[activeCompany])

    useEffect(() => {
        fetchRecentSearches();
    }, []);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/guidance') {
            setSelectedItem('home');
        } else if (path === '/user-info') {
            setSelectedItem('account');
        } else {
            const search = recentSearches.find(search => path.includes(search));
            if (search) {
                setSelectedItem(search);
            }
        }
    }, [location, recentSearches]);

    const handleLogout = async () => {
        try {
            await guidanceBackend.logout();
            toast.success('Logout successful');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleNavLinkClick = (item: string) => {
        setSelectedItem(item);
        if (item === 'home') {
            setActiveCompany(null);
            setSearchCompany(false);
        }
    };

    return (
        <div className={`relative flex flex-col border border-r-[#6200ee] ${isCollapsed ? 'w-16' : 'w-[180px]'} bg-[#f2f2f2] text-black`}>
            <ToastContainer />
            <div className="absolute top-4 left-4 cursor-pointer" onClick={toggleCollapse}>
                {isCollapsed ? (
                    <BiMenu color='black' size={36} />
                ) : (
                    <BiX color='black' size={36} />
                )}
            </div>
            {!isCollapsed && (
                <div className="py-4 flex flex-col items-center">
                    <nav className="py-4">
                        <ul className="text-start mt-6 flex flex-col gap-2">
                            <li>
                                <NavLink
                                    to="/guidance"
                                    className={`block px-5 py-2 rounded ${selectedItem === 'home' ? 'text-white bg-[#6200ee]' : 'text-[#6200ee] hover:bg-purple-100'}`}
                                    onClick={() => handleNavLinkClick('home')}
                                    end
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/user-info"
                                    className={`block px-5 py-2 rounded ${selectedItem === 'account' ? 'text-white bg-[#6200ee]' : 'text-[#6200ee] hover:bg-purple-100'}`}
                                    onClick={() => handleNavLinkClick('account')}
                                >
                                    Account
                                </NavLink>
                            </li>
                            {recentSearches.map((search, index) => (
                                <li key={index}>
                                    <div
                                        className={`block px-5 py-2 rounded cursor-pointer ${selectedItem === search ? 'text-white bg-[#6200ee]' : 'text-[#6200ee] hover:bg-purple-100'}`}
                                        onClick={() => {
                                            setActiveCompany(search);
                                            setSearchCompany(true);
                                            handleNavLinkClick(search);
                                        }}
                                    >
                                        {search}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
            <div className="mt-auto">
                {isCollapsed ? (
                    <BiLogOut
                        color='black'
                        size={36}
                        className="cursor-pointer mx-2 mb-4"
                        onClick={handleLogout}
                    />
                ) : (
                    <button
                        onClick={handleLogout}
                        className="mx-4 bg-[#6200ee] hover:bg-purple-800 text-white py-2 px-5 rounded mb-4"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
