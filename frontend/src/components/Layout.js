
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{
                marginLeft: '260px',
                width: 'calc(100% - 260px)',
                minHeight: '100vh',
                padding: '2rem'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
