import React, { useState, useRef, useEffect } from 'react';
import Container from '../container/Container';
import Logo from '../Logo';
import { Link, useNavigate } from 'react-router-dom';
import LogoutBtn from './LogoutBtn';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import service from '../../appwrite/config';
import { addNotification, deleteNotification } from "../../store/notificationSlice"; 

const Header = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const notifications = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(null); 
    
    const menuRef = useRef(null);
    const notificationRef = useRef(null); 
    

    const navItems = [
        { name: "Home", slug: "/", active: true },
        { name: "Login", slug: "/login", active: !authStatus },
        { name: "Signup", slug: "/signup", active: !authStatus },
        { name: "Add Post", slug: "/add-post", active: authStatus },
        { name: "My Posts", slug: "/my-posts", active: authStatus },
        { name: "Profile", slug: "/profile", active: authStatus },
        { name: "Chats", slug: "/chat", active: authStatus },
    ];

    const handleMenuToggle = () => {
        setMenuVisible((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (menuVisible && menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
        if (notificationsVisible && notificationRef.current && !notificationRef.current.contains(event.target)) {
            setNotificationsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible, notificationsVisible]);

    const handleNavigation = (slug) => {
        navigate(slug);
        window.scrollTo(0, 0);
        setMenuVisible(false); 
        setNotificationsVisible(false);
    };

    const handleNotificationClick = (postId, fromUserId) => {
        if (postId !== "null") {
            navigate(`/post/${postId}`);
        } else {
            navigate(`/profile/${fromUserId}`);
        }
        setNotificationsVisible(false);
    };

    const handleDeleteNotification = async (notificationId) => {
        const userId = userData.$id;
        setDeletingNotification(notificationId);

        const result = await service.deleteNotification(userId, notificationId, dispatch);

        if (result) {
            dispatch(deleteNotification(notificationId));
        }

        setTimeout(() => setDeletingNotification(null), 1000);
    };

    const notificationModalStyle = {
        position: 'absolute',
        right: 0,
        marginTop: '0.5rem',
        width: '20rem',
        background: 'rgba(230, 230, 250, 0.85)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        padding: '1rem',
        zIndex: 50,
        maxHeight: '800px',
        overflowY: 'hidden',
    };

    const styles = `
        .notification-container {
            max-height: 300px; 
            overflow-y: auto; 
            overflow-x: hidden;
            padding: 10px;
            position: relative;
        }
        .notification-container::-webkit-scrollbar {
            width: 12px; 
        }
        .notification-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1); 
            border-radius: 10px;
        }
        .notification-container::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #6a11cb 0%, #2575fc 100%);
            border-radius: 10px; 
            transition: background 0.3s, transform 0.2s;
        }
        .notification-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2575fc 0%, #6a11cb 100%);
            transform: scale(1.1); 
        }

        @keyframes slideOutRight {
            0% {
                transform: translateX(0); 
                opacity: 1;
            }
            100% {
                transform: translateX(100vw);
                opacity: 0;
            }
        }

        .notification-fade-out {
            animation: slideOutRight 6s ease-out forwards;
            position: absolute;
            width: 100%;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return (
        <header className='py-4 shadow-xl sticky top-0 z-50 bg-transparent bg-opacity-80 backdrop-blur-md transition-all duration-500 ease-in-out'>
            <Container>
                <nav className='flex items-center justify-between relative'>
                    {/* Logo and Site Name */}
                    <div className='flex items-center space-x-6'>
                        <Link to="/" className="flex items-center space-x-2">
                            <Logo 
                                width='80px' 
                                className='transition-all duration-700 ease-in-out transform hover:scale-125 hover:rotate-[15deg] animate-spin-slow'
                            />
                            <span className='text-2xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 transition-all duration-700 ease-out hover:scale-110 hover:translate-y-2 animate-float'>
                                {/* Poetic Odyssey */}
                            </span>
                        </Link>
                    </div>

                    {/* Hamburger Icon for Small Screens */}
                    <div ref={menuRef} className="relative md:hidden">
                        <button 
                            className="text-white text-3xl transition-all duration-300 transform hover:scale-125 hover:rotate-12 animate-popIn"
                            onClick={handleMenuToggle}
                            aria-label="Toggle navigation"
                        >
                            ☰
                        </button>
                        {menuVisible && (
                            <div className="absolute right-0 mt-3 bg-gradient-to-br from-slate-600 to-slate-900 bg-opacity-90 rounded-lg shadow-lg p-4 z-50 transition-all duration-500 ease-out animate-slideIn">
                                <ul className='flex flex-col space-y-3'>
                                    {navItems.map((item) => 
                                        item.active ? (
                                            <li key={item.name}>
                                                <button 
                                                    onClick={() => handleNavigation(item.slug)} 
                                                    className='block text-center text-white bg-gradient-to-l from-indigo-500 to-purple-600 rounded-full shadow-xl transition-all duration-500 ease-out hover:scale-110 hover:rotate-6 hover:bg-gradient-to-r px-6 py-3 animate-slideUp'>
                                                    {item.name}
                                                </button>
                                            </li>
                                        ) : null
                                    )}
                                    {authStatus && (
                                        <li>
                                            <LogoutBtn className='block text-center text-white bg-red-500 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 hover:bg-red-600 hover:shadow-xl px-4 py-2 animate-bounceOut' />
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links and Notification Bell for Medium and Large Screens */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => 
                            item.active ? (
                                <button 
                                    key={item.name} 
                                    onClick={() => handleNavigation(item.slug)} 
                                    className='text-white bg-gradient-to-r from-purple-600 to-indigo-800 rounded-full shadow-xl px-6 py-3 transition-all duration-500 ease-out hover:bg-gradient-to-l hover:scale-105 hover:rotate-3 animate-glow'>
                                    {item.name}
                                </button>
                            ) : null
                        )}

                        {/* Notifications Dropdown */}
                        {authStatus && (
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full shadow-xl transform hover:scale-125 hover:rotate-12 transition-all duration-300 animate-pulse"
                                    onClick={() => setNotificationsVisible((prev) => !prev)} 
                                    aria-label="Toggle notifications"
                                >
                                    <span className="text-2xl text-white">🔔</span>
                                </button>
                                {(notifications.length > 0) && (
                                    <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 ${notifications.length === 0 ? "hidden" : " bg-red-500"} text-white text-xs rounded-full px-2 py-1 animate-bounce`}>
                                        {notifications.length}
                                    </span>
                                )}

                                {notificationsVisible && (
                                    <div style={notificationModalStyle}>
                                        <ul className="notification-container flex flex-col space-y-2">
                                            {notifications.length > 0 ? (
                                                [...notifications]
                                                    .sort((a, b) => {
                                                        const partsA = a.split('|||');
                                                        const createdAtA = new Date(partsA[3]);
                                                        const partsB = b.split('|||');
                                                        const createdAtB = new Date(partsB[3]);
                                                        return createdAtB - createdAtA;
                                                    })
                                                    .map((notification, index) => {
                                                        const parts = notification.split('|||');
                                                        const notificationId = parts[0];
                                                        const notificationText = parts[1];
                                                        const postId = parts[parts.length - 3];
                                                        const fromUserId = parts[parts.length - 2];
                                                        const isDeleting = deletingNotification === notificationId;

                                                        return (
                                                            <li
                                                                key={index}
                                                                className={`notification-item bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg hover:bg-gradient-to-l hover:scale-105 transition-all duration-500 ease-out flex items-center justify-between px-6 py-3 ${isDeleting ? 'notification-fade-out' : ''} animate-popUp`}>
                                                                <span
                                                                    onClick={() => handleNotificationClick(postId, fromUserId)}
                                                                    className="flex-grow cursor-pointer"
                                                                >
                                                                    {notificationText}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleDeleteNotification(notificationId)}
                                                                    className="bg-gradient-to-r from-red-600 to-red-800 text-white ml-2 rounded-full px-4 py-2 transition-transform duration-300 hover:scale-110"
                                                                    aria-label="Delete notification"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.5rem' }} />
                                                                </button>
                                                            </li>
                                                        );
                                                    })
                                            ) : (
                                                <li className="text-white text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full px-4 py-2 transition-transform duration-300 hover:scale-105">
                                                    No notifications
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Logout Button at the end */}
                        {authStatus && (
                            <LogoutBtn className='bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full shadow-xl px-6 py-3 transition-all duration-500 ease-out hover:scale-105 hover:bg-red-700 animate-jump' />
                        )}
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default Header;
