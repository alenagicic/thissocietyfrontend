import { memo } from 'react';
import { useNotifications } from '../Hooks/Messaging/useNotifications';
import { Outlet } from 'react-router-dom';

const NotificationsPage = memo(() => {

    const {
        notifications,
        isNotificationsLoading,
        handleLoadMoreNotifications,
        hasMoreNotifications,
        handleNotificationClick
    } = useNotifications();

    return (
        <div className="pages-wrapper" id="notifications">

            <h3 >
                <i className='bi bi-bell'></i> Notifications
            </h3>

            {isNotificationsLoading && notifications.length === 0 ? (
                <div className='spinner'></div>                
            ) : notifications.length > 0 ? (
                <>
                    <ul className="notification-list">
                        {notifications.map((notification) => (
                            <li
                                key={notification.SK}
                                className={`notification-item`}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="notification-message">
                                    {notification.message}
                                </span>
                                <span className="notification-timestamp">
                                    {new Date(notification.created_at).toLocaleString()}
                                </span>
                                <span
                                    className={`notification-status ${notification.status === 'UNREAD' ? 'setting-not-unread' : 'setting-not-read'}`}
                                >
                                    {notification.status.toLowerCase()}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {hasMoreNotifications && (
                        <div className="text-center mt-3">
                            <button
                                onClick={handleLoadMoreNotifications}
                                className="btn btn-secondary load-more-btn"
                                disabled={isNotificationsLoading}
                            >
                                {isNotificationsLoading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="no-content">No notifications found.</p>
            )}

            <Outlet />
            
        </div>
    );
});

export default NotificationsPage;