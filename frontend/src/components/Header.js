import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [activeTab, setActiveTab] = useState("Home");

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveTab('Home')
        } else if (location.pathname === '/add') {
            setActiveTab('AddCustomer')
        } else if (location.pathname === '/about') {
            setActiveTab('About')
        }
    }, [location])

    return (
        <div className='header' style={{ marginTop: "none" }} >
            <p className='logo' style={{ marginTop: '10px' }}>Customer Web App</p>
            <div className='header-right' style={{ marginTop: '10px' }}>
                <Link to="/">
                    <p className={`${activeTab === 'Home' ? 'active' : ''}`} onClick={() => setActiveTab("Home")} >Home</p>
                </Link>
                <Link to="/add">
                    <p className={`${activeTab === 'AddCustomer' ? 'active' : ''}`} onClick={() => setActiveTab("AddCustomer")} >Add Customer</p>
                </Link>
                <Link to="/about">
                    <p className={`${activeTab === 'About' ? 'active' : ''}`} onClick={() => setActiveTab("About")} >About</p>
                </Link>
            </div>
        </div>
    )
}

export default Header