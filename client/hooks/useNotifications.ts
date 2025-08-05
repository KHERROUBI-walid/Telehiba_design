import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'new_family' | 'urgent_need' | 'sponsorship_update' | 'thank_you' | 'impact_report';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  familyName?: string;
  familyAvatar?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif1',
        type: 'urgent_need',
        title: 'Besoin urgent',
        message: 'Une famille a besoin d\'aide pour acheter des médicaments',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        priority: 'high',
        familyName: 'Famille Martin',
        familyAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b85644?w=100&h=100&fit=crop&crop=center',
        actionUrl: '/donator-dashboard?tab=pending'
      },
      {
        id: 'notif2',
        type: 'thank_you',
        title: 'Message de remerciement',
        message: 'La Famille Dubois vous remercie pour votre donation',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        priority: 'medium',
        familyName: 'Famille Dubois',
        familyAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=center'
      },
      {
        id: 'notif3',
        type: 'sponsorship_update',
        title: 'Mise à jour parrainage',
        message: 'Votre famille parrainée a reçu ses courses cette semaine',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    setIsLoading(false);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (10% chance every 30 seconds)
      if (Math.random() < 0.1) {
        addNotification({
          type: 'urgent_need',
          title: 'Nouvelle demande d\'aide',
          message: 'Une famille a besoin d\'aide urgente',
          priority: 'high',
          familyName: 'Famille Exemple',
          familyAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b85644?w=100&h=100&fit=crop&crop=center'
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/icon-192x192.png',
        tag: newNotification.id
      });
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId && !notification.isRead
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.isRead ? prev - 1 : prev;
    });
  }, [notifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      
      if (notification && !notification.isRead) {
        setUnreadCount(count => count - 1);
      }
      
      return newNotifications;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotifications;
