import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as api from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const currentUserId = user ? String(user.id || user._id) : null;
  const storageKey = currentUserId ? `skillswap-notifications-${currentUserId}` : null;
  const [notifications, setNotifications] = useState(() => {
    if (!storageKey) return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!storageKey) {
      setNotifications([]);
      return;
    }
    try {
      setNotifications(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch {
      setNotifications([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(notifications.slice(0, 20)));
  }, [notifications, storageKey]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleNewMessage = (message) => {
      if (!user || String(message.to?._id) !== currentUserId) return;
      setNotifications((previous) => [
        {
          id: `${message._id}-${Date.now()}`,
          messageId: message._id,
          text: `${message.from?.name || 'Someone'} sent you a message`,
          detail: message.text,
          time: new Date().toISOString(),
          read: false,
          userId: message.from?._id
        },
        ...previous.filter((item) => item.messageId !== message._id)
      ].slice(0, 20));
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, currentUserId]);

  useEffect(() => {
    if (!user) return undefined;

    const syncSwapNotifications = async () => {
      try {
        const [{ data: incoming }, { data: outgoing }] = await Promise.all([
          api.getIncomingSwapRequests(),
          api.getOutgoingSwapRequests()
        ]);
        const candidates = [
          ...incoming
            .filter((request) => request.status === 'pending')
            .map((request) => ({
              key: `swap-in-${request._id}`,
              text: `${request.requester?.name || 'Someone'} requested a skill swap`,
              detail: `${request.skill?.title || 'Skill exchange request'}${request.skill?.amount > 0 ? ` · INR ${request.skill.amount} per session` : ' · Free exchange'}`,
              targetPath: '/profile'
            })),
          ...outgoing
            .filter((request) => request.status !== 'pending')
            .map((request) => ({
              key: request.paymentStatus === 'paid'
                ? `payment-${request._id}`
                : `swap-out-${request._id}-${request.status}`,
              text: request.paymentStatus === 'paid'
                ? `Payment confirmed for ${request.skill?.title || 'your skill exchange'}`
                : `${request.recipient?.name || 'The skill owner'} ${request.status} your swap request`,
              detail: request.skill?.title || 'Skill exchange request',
              targetPath: request.status === 'accepted' ? '/profile' : '/messages'
            }))
        ];

        if (candidates.length === 0) return;
        setNotifications((previous) => [
          ...candidates
            .filter((candidate) => !previous.some((item) => item.messageId === candidate.key))
            .map((candidate) => ({
              id: candidate.key,
              messageId: candidate.key,
              text: candidate.text,
              detail: candidate.detail,
              targetPath: candidate.targetPath,
              time: new Date().toISOString(),
              read: false
            })),
          ...previous
        ].slice(0, 20));
      } catch {
        // Socket.IO remains the primary path; polling is only a fallback.
      }
    };

    syncSwapNotifications();
    const timer = window.setInterval(syncSwapNotifications, 5000);
    return () => window.clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleSwapNotification = ({ type, request, amount }) => {
      const isIncoming = type === 'swapRequest';
      const isPayment = type === 'paymentReceived';
      const name = isIncoming ? request.requester?.name : request.recipient?.name;
      const statusText = request.status === 'accepted' ? 'accepted' : 'rejected';
      setNotifications((previous) => [
        {
          id: `swap-${request._id}-${type}`,
          messageId: `swap-${request._id}-${type}`,
          text: isPayment
            ? `${request.requester?.name || 'The learner'} paid${amount > 0 ? ` INR ${amount}` : ''} for your skill`
            : isIncoming
            ? `${request.requester?.name || 'Someone'} requested a skill swap${amount > 0 ? ` for INR ${amount}` : ''}`
            : `${name || 'The skill owner'} ${statusText} your swap request`,
          detail: `${request.skill?.title || 'Skill exchange request'}${amount > 0 ? ` · INR ${amount} per session` : ' · Free exchange'}`,
          time: new Date().toISOString(),
          read: false,
          targetPath: isIncoming || isPayment || type === 'swapUpdated' ? '/profile' : '/messages'
        },
        ...previous.filter((item) => item.messageId !== `swap-${request._id}-${type}`)
      ].slice(0, 20));
    };

    socket.on('notification', handleSwapNotification);
    return () => socket.off('notification', handleSwapNotification);
  }, [socket, user?.id]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const openNotification = (notification) => {
    setNotifications((previous) => previous.map((item) => (
      item.id === notification.id ? { ...item, read: true } : item
    )));
    setOpen(false);
    if (notification.targetPath) navigate(notification.targetPath);
    else if (notification.userId) navigate(`/messages/${notification.userId}`);
  };

  const markAllRead = () => {
    setNotifications((previous) => previous.map((item) => ({ ...item, read: true })));
  };

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/browse" className="flex items-center gap-2 text-lg font-display font-extrabold text-brand-700">
          <span className="w-8 h-8 rounded-lg bg-brand-gradient text-white flex items-center justify-center text-sm">
            ⇄
          </span>
          SkillSwap
        </Link>

        <div className="flex items-center gap-7">
          <NavLink to="/browse" className={linkClass}>Find an exchange</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/post" className={linkClass}>Share a skill</NavLink>
          <NavLink to="/messages" className={linkClass}>Conversations</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>

          <div className="relative">
            <button
              onClick={() => setOpen((current) => !current)}
              aria-label={`${unreadCount} unread notifications`}
              className="relative w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              <span aria-hidden="true">&#128276;</span>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden z-30">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-sm">Notifications</p>
                    <p className="text-xs text-gray-400">Updates from your learning community</p>
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-brand-600 font-semibold hover:underline">
                      Mark read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-400 text-center">You are all caught up.</p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => openNotification(notification)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notification.read ? 'bg-white' : 'bg-brand-50/50'}`}
                      >
                        <div className="flex items-start gap-2">
                          {!notification.read && <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0" />}
                          <div className={notification.read ? 'pl-4' : ''}>
                            <p className="text-sm font-semibold text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{notification.detail}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{new Date(notification.time).toLocaleString()}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center text-xs font-semibold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm transition-colors">
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
