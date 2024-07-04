// UserInfo.tsx

import React, { useState, useEffect } from 'react';
import TopBar from './Topbar';
import MainLayout from './mainLayout';
import guidanceBackend, { UserInfoAPIResponse } from '../services/guidanceBackend';

type Props = {};


const UserInfo: React.FC<Props> = () => {
    const [userInfo, setUserInfo] = useState<UserInfoAPIResponse | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await guidanceBackend.getUserInfo();
                setUserInfo(response.user);
                console.log('User info:', response);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
    
        fetchUserInfo();
    }, []);

    return (
        <MainLayout>
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
        </MainLayout>
    );
};

export default UserInfo;
