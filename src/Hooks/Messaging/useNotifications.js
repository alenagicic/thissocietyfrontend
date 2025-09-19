import { useState, useEffect, useContext, useRef } from "react";
import { fetchNotifications, markNotificationAsRead } from "../../Utils/api";
import { AuthContext } from '../../Context/AuthContext';
import { ScrollContext } from '../../Context/ScrollContext';
import { useNavigate } from "react-router-dom";

export const useNotifications = () => {

    const navigate = useNavigate();

    const { setCommentIdToScrollTo } = useContext(ScrollContext);

    const { user } = useContext(AuthContext);

    const initialRenderNotifications = useRef(true);

    const [notifications, setNotifications] = useState([]);
    const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
    const [lastKnownNotificationKey, setLastKnownNotificationKey] = useState(null);
    const [hasMoreNotifications, setHasMoreNotifications] = useState(true);

    useEffect(() => {
        if (user?.email) {
            if (initialRenderNotifications.current) {
                initialRenderNotifications.current = false;
                fetchUserNotifications(null);
            }
        }
    }, [user]);

    const fetchUserNotifications = async (startKey) => {
        if (!user?.email || isNotificationsLoading) return;
        setIsNotificationsLoading(true);
        try {
            const response = await fetchNotifications(user.userId, startKey);

            if (!response || !response.data) {
                console.error("API response for notifications is malformed or empty:", response);
                setHasMoreNotifications(false);
                return;
            }

            const existingSk = new Set(notifications.map(notif => notif.SK));
            const uniqueNewNotifications = response.data.filter(
                notif => !existingSk.has(notif.SK)
            );

            setNotifications(prevNotifications => [...prevNotifications, ...uniqueNewNotifications]);
            setLastKnownNotificationKey(response.last_evaluated_key);
            setHasMoreNotifications(!!response.last_evaluated_key);

        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setHasMoreNotifications(false);
        } finally {
            setIsNotificationsLoading(false);
        }
    };

    const handleLoadMoreNotifications = () => {
        fetchUserNotifications(lastKnownNotificationKey);
    };

    const handleNotificationClick = async (notification) => {

        setCommentIdToScrollTo(notification.comment_id)

        if (notification.article_id) {
            try {
                const response = await markNotificationAsRead(user.userId, notification.SK);
                if (response.message === "Notification marked as read.") {
                    setNotifications(prevNotifications =>
                        prevNotifications.map(notif =>
                            notif.SK === notification.SK ? { ...notif, status: "READ" } : notif
                        )
                    );
                } else {
                    console.error("Failed to mark notification as read:", response.error);
                }

                navigate(`/content/main/latest/${notification.article_id}`)

            } catch (error) {
                console.error("Error handling notification click:", error);
            }
        }
    };

    return {
        notifications,
        isNotificationsLoading,
        handleLoadMoreNotifications,
        hasMoreNotifications,
        handleNotificationClick
    };
};