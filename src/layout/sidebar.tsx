import React, { useEffect, useState } from 'react';
import { BiMenu, BiX, BiLogOut } from "react-icons/bi";
import { NavLink, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useFetchRecentSearches } from '@/services/queries';
import { useAuth } from '@/context/auth-context';

const Sidebar: React.FC = () => {
    const {logout}  = useAuth()
    const [, setSearchParams] = useSearchParams();

    const { data: recentSearches, isSuccess } = useFetchRecentSearches();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const hasRunEffect = localStorage.getItem('hasRunEffect');
        if ((!hasRunEffect || hasRunEffect === 'false')&& isSuccess && recentSearches?.searches.length) {
            const ticker = recentSearches?.searches?.[0];
            setSearchParams((prevParams) => {
                const newParams = new URLSearchParams(prevParams);
                newParams.set('ticker', ticker);
                return newParams;
            });
            localStorage.setItem('hasRunEffect', 'true');
        }
    }, [isSuccess]);

    const handleLogout = async () => {
        logout()
        toast.success('Logout successful');
        return <Navigate to='/' replace />
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`relative flex flex-col border border-r-[#800080] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-[180px]'} bg-neutral text-black`}>
            <div className="absolute top-4 left-4 cursor-pointer" onClick={toggleCollapse}>
                {isCollapsed ? (
                    <BiMenu color='#800080' size={36} />
                ) : (
                    <BiX color='#800080' size={36} />
                )}
            </div>
            {!isCollapsed && (
                <div className="py-4 flex flex-col items-center">
                    <nav className="py-4">
                        <ul className="text-start mt-6 flex flex-col gap-2">
                            <ListItem
                                to="/guidance"
                                currentItem="home"
                            >
                                Home
                            </ListItem>
                            <ListItem
                                to="/user-info"
                                currentItem="account"
                            >
                                Account
                            </ListItem>
                            {recentSearches?.searches?.map((search, index) => (
                                <ListItem
                                    key={index}
                                    to={`/guidance?ticker=${search}`}
                                    currentItem={`guidance?ticker=${search}`}
                                >
                                    {search}
                                </ListItem>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
            <div className="mt-auto mx-auto mb-5 ">
                {isCollapsed ? (
                    <BiLogOut
                        color='#800080'
                        size={36}
                        className="cursor-pointer mx-2 mb-4"
                        onClick={handleLogout}
                    />
                ) : (
                    <Button
                        onClick={handleLogout}
                        className='gap-x-2.5'
                    >
                        <BiLogOut
                            color='#fff'
                            size={18}
                            className=""

                        />
                        Logout

                    </Button>
                )}
            </div>
        </div>
    );
};


interface ListItemProps {
    to: string;
    currentItem: string;
    onClick?: () => void;
    children: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ to, currentItem, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <li>
            <Button
                className='w-full'
                variant={isActive ? 'default' : 'ghost'}
            >
                <NavLink to={to} end={currentItem === 'home'}>
                    {children}
                </NavLink>
            </Button>
        </li>
    );
};

export default Sidebar;
