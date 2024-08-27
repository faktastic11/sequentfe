import React, { useState, useEffect } from 'react';

import guidanceBackend from '../services/guidanceBackend';
import TopBar from '@/layout/topbar';

type UserInfo = {
    email: string;
    name: string;
}


const UserInfo: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await guidanceBackend.getUserInfo();
                setUserInfo({email:response?.user.email, name: response?.user.name});
                console.log('User info:', response);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    
        fetchUserInfo();
    }, []);

    return (
        <div>
            <div className="sticky top-0 z-[100]">
                <TopBar activeCompany={null} setActiveCompany={() => {}} />
            </div>
            <div>
                <h1 className="text-[24px] text-start mt-4 mx-4 font-semibold">User Info</h1>
                <div className=" mt-4">
                    <div className="mx-4">
                        <div className="flex items-center gap-4">
                            <label className=" text-right">Name:</label>
                            <span>{userInfo?.name}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="text-right">Email:</label>
                            <span>{userInfo?.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
