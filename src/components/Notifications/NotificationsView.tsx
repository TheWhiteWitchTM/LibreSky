import React, { useEffect, useState } from 'react';
import { Heart, Repeat, MessageCircle, AtSign, UserPlus, Loader2, Quote } from 'lucide-react';
import { NotificationItem, BskyPost } from '../../types/bsky';
import { atproto } from '../../services/atproto';
import { timeAgo } from '../../utils/format';

interface NotificationsViewProps {
  onOpenThread: (post: BskyPost) => void;
  onOpenUser: (handle: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onOpenThread,
  onOpenUser,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await atproto.getNotifications();
      setNotifications(res.notifications);
      await atproto.markNotificationsSeen();
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'like':
        return <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />;
      case 'repost':
        return <Repeat className="w-4 h-4 text-emerald-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-purple-400" />;
      case 'quote':
        return <Quote className="w-4 h-4 text-amber-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'like':
        return 'liked your post';
      case 'repost':
        return 'reposted your post';
      case 'follow':
        return 'started following you';
      case 'reply':
        return 'replied to you';
      case 'mention':
        return 'mentioned you';
      case 'quote':
        return 'quoted your post';
      default:
        return 'interacted with you';
    }
  };

  if (!atproto.isLoggedIn()) {
    return (
      <div className="py-24 text-center text-zinc-500 text-xs">
        Please sign in to view your notifications.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-30 px-4 py-3 bg-black/85 backdrop-blur-md border-b border-[#1c1c22]">
        <h2 className="text-sm font-bold text-white">Notifications</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="divide-y divide-[#141418]">
          {notifications.map((notif) => (
            <div
              key={notif.uri}
              onClick={() => {
                if (notif.reason === 'follow') {
                  onOpenUser(notif.author.handle);
                } else if (notif.record?.subject?.uri || notif.uri) {
                  // If there is post context
                  const targetUri = notif.record?.subject?.uri || notif.uri;
                  onOpenThread({ uri: targetUri } as any);
                }
              }}
              className="flex items-start gap-3.5 p-4 hover:bg-[#070709] cursor-pointer transition"
            >
              <div className="p-2 rounded-xl bg-[#111116] shrink-0 border border-[#22222a]">
                {getReasonIcon(notif.reason)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {notif.author.avatar ? (
                    <img
                      src={notif.author.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                      {notif.author.handle[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-white truncate">
                    {notif.author.displayName || notif.author.handle}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    {getReasonText(notif.reason)}
                  </span>
                  <span className="text-xs text-zinc-600 ml-auto shrink-0">
                    {timeAgo(notif.indexedAt)}
                  </span>
                </div>

                {notif.record?.text && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    "{notif.record.text}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-zinc-500 text-xs">
          No notifications yet.
        </div>
      )}
    </div>
  );
};
