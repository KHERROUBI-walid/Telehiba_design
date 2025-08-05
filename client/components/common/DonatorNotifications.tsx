import React, { useState, useEffect } from 'react';
import { Bell, Heart, Gift, Users, X, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

interface DonatorNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const DonatorNotifications: React.FC<DonatorNotificationsProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_family': return <Users className="w-5 h-5 text-blue-500" />;
      case 'urgent_need': return <Bell className="w-5 h-5 text-red-500" />;
      case 'sponsorship_update': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'thank_you': return <Gift className="w-5 h-5 text-green-500" />;
      case 'impact_report': return <Eye className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Tout marquer
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-500">Vous êtes à jour avec toutes vos activités</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative mb-2 p-4 rounded-xl border-l-4 transition-all cursor-pointer hover:shadow-md ${
                    !notification.isRead 
                      ? `${getPriorityColor(notification.priority)} shadow-sm`
                      : 'bg-white border-l-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          
                          {/* Family info if available */}
                          {notification.familyName && notification.familyAvatar && (
                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src={notification.familyAvatar}
                                alt={notification.familyName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-xs text-gray-600">{notification.familyName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        {/* Action button if available */}
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to action URL
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            Voir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-app-purple hover:text-app-purple/80"
            >
              Voir toutes les notifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock notifications generator
export const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: 'notif1',
      type: 'urgent_need',
      title: 'Besoin urgent',
      message: 'Une famille a besoin d\'aide pour acheter des médicaments',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
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
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
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
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      priority: 'low'
    },
    {
      id: 'notif4',
      type: 'new_family',
      title: 'Nouvelle famille',
      message: 'Une nouvelle famille s\'est inscrite dans votre ville',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      priority: 'low'
    }
  ];
};

export default DonatorNotifications;
