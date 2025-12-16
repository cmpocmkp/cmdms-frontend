/**
 * Notification Panel Component (Right Sidebar)
 * EXACT replica of the notification panel from navbar.blade.php
 */

import { useUIStore } from '../../../store/uiStore';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export function NotificationPanel() {
  const { 
    notificationPanelOpen, 
    setNotificationPanelOpen, 
    notifications, 
    markAsRead, 
    markAllAsRead 
  } = useUIStore();

  const handleClose = () => {
    setNotificationPanelOpen(false);
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    markAsRead(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    markAllAsRead();
  };

  // Helper to render notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'minute_reply':
        return {
          btnClass: 'btn-warning',
          icon: 'ti-share-alt',
          title: 'RecordNote Reply'
        };
      case 'sectorial_agenda_reply':
        return {
          btnClass: 'btn-warning',
          icon: 'ti-share-alt',
          title: 'Sectorial Agenda Reply'
        };
      case 'minute_notification':
        return {
          btnClass: 'bg-dark',
          icon: 'ti-list-ol',
          title: 'RecordNote Decision'
        };
      case 'reply_notification':
        return {
          btnClass: 'btn-warning',
          icon: 'ti-share-alt',
          title: 'RecordNote Meeting'
        };
      case 'announcement_reply':
        return {
          btnClass: 'btn-warning',
          icon: 'ti-share-alt',
          title: 'Announcement reply'
        };
      case 'task_comment':
        return {
          btnClass: 'btn-warning',
          icon: 'ti-share-alt',
          title: 'Task reply'
        };
      case 'directive_reply':
        return {
          btnClass: 'btn-primary',
          icon: 'ti-share-alt',
          title: 'Directive Reply'
        };
      default:
        return {
          btnClass: 'btn-secondary',
          icon: 'ti-bell',
          title: 'Notification'
        };
    }
  };

  // Truncate text helper
  const truncate = (text: string, limit: number = 55) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  return (
    <>
      {/* Inline styles */}
      <style>{`
        li.list.active.department-notfication:hover {
          background: #eaeaf1 !important;
          cursor: pointer !important;
        }
        
        .settings-panel.open {
          right: 0 !important;
        }
      `}</style>

      {/* Right Sidebar Panel */}
      <div 
        id="right-sidebar" 
        className={`settings-panel ${notificationPanelOpen ? 'open' : ''}`}
      >
        <i 
          className="settings-close ti-close" 
          title="close notifications bar"
          onClick={handleClose}
          style={{ cursor: 'pointer' }}
        ></i>
        
        <ul className="nav nav-tabs border-top" id="setting-panel" role="tablist">
          <li className="nav-item">
            <a 
              className="nav-link active" 
              id="chats-tab" 
              data-toggle="tab" 
              href="#chats-section" 
              role="tab"
              aria-controls="chats-section" 
              aria-expanded="true"
            >
              Notifications
            </a>
          </li>
        </ul>
        
        <div 
          className="tab-content" 
          id="setting-content" 
          style={{ padding: 'unset', textAlign: 'unset' }}
        >
          <div 
            className="tab-pane fade scroll-wrapper show active" 
            id="chats-section" 
            role="tabpanel"
            aria-labelledby="chats-section"
          >
            <ul className="chat-list">
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => {
                    const iconInfo = getNotificationIcon(notification.type);
                    const isUnread = !notification.read_at;
                    
                    return (
                      <li 
                        key={notification.id} 
                        className="list active department-notfication" 
                        style={{ lineHeight: 'unset' }}
                      >
                        <div className="profile" style={{ marginTop: '10px' }}>
                          <button 
                            type="button" 
                            style={{ width: '32px', height: '32px' }}
                            className={`btn ${iconInfo.btnClass} btn-rounded btn-icon pd-5`}
                          >
                            <i title={iconInfo.title} className={`${iconInfo.icon} mx-0`}></i>
                          </button>
                        </div>
                        
                        <div className="info">
                          <Link
                            to={notification.data?.url || '#'}
                            title="Click to view"
                            style={{ fontSize: '12px', textDecoration: 'none' }}
                            data-container="#setting-panel"
                            data-html="true"
                            data-toggle="tooltip"
                            data-placement="left"
                            className="text-dark"
                          >
                            <div>
                              {truncate(notification.data?.title || notification.data?.subject || 'Notification', 55)}
                              {notification.data?.departmentName && (
                                <>
                                  <br />
                                  <strong style={{ color: 'green' }}>
                                    {notification.data.departmentName}
                                  </strong>
                                </>
                              )}
                              {notification.data?.userName && (
                                <span style={{ color: '#6c757d' }}>
                                  {' '}— {notification.data.userName}
                                </span>
                              )}
                            </div>
                          </Link>
                          
                          <p 
                            title={new Date(notification.created_at).toLocaleDateString()}
                            style={{ 
                              width: '140px', 
                              float: 'left', 
                              marginTop: '7px', 
                              color: '#495057' 
                            }}
                          >
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                          
                          {isUnread && (
                            <a 
                              href="#" 
                              title="Click to mark notification as read"
                              data-container="#setting-panel"
                              data-html="true"
                              data-toggle="tooltip"
                              data-placement="left"
                              className="font-weight-light small-text text-primary mark-as-read"
                              style={{ 
                                textDecoration: 'none', 
                                width: '82px', 
                                marginTop: '11px', 
                                float: 'left' 
                              }}
                              onClick={(e) => handleMarkAsRead(e, notification.id)}
                            >
                              Mark as read
                            </a>
                          )}
                        </div>
                      </li>
                    );
                  })}
                  
                  {/* Mark all as read button */}
                  {notifications.some(n => !n.read_at) && (
                    <li className="list active department-notfication" id="cms-notifications-read-all">
                      <p className="my-2 mx-2">
                        <a 
                          href="#" 
                          id="mark-all" 
                          style={{ textDecoration: 'none' }}
                          title="Click to mark All notifications as read"
                          data-container="#setting-panel"
                          data-html="true"
                          data-toggle="tooltip"
                          data-placement="left"
                          onClick={handleMarkAllAsRead}
                        >
                          Mark all as read
                        </a>
                      </p>
                    </li>
                  )}
                </>
              ) : (
                /* Empty State */
                <li className="list active">
                  <div className="profile">
                    <button 
                      type="button" 
                      className="btn btn-danger btn-rounded btn-icon pd-5"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <i className="mdi mdi-bell-off mx-0"></i>
                    </button>
                  </div>
                  <div className="info">
                    <p>You have no notifications.</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

