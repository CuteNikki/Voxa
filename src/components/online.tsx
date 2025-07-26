import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '../../convex/_generated/api';

export default function OnlineUsersList() {
  const onlineUsers = useQuery(api.functions.presence.getOnlineUsers.getOnlineUsers);
  const [users, setUsers] = useState<{ first_name: string; last_name: string; image_url: string; id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIds = onlineUsers?.map((user) => user.userId) || [];
    if (!userIds.length) {
      setUsers([]);
      setLoading(false);
      return;
    }

    fetch(`/api/clerk-users?ids=${userIds.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, [onlineUsers]);

  if (loading) return <div>Loading users...</div>;
  if (!users.length) return <div>No users online</div>;

  return (
    <ul>
      <h3 className='text-lg font-semibold mb-2'>Online Users:</h3>
      {users.map((user) => (
        <li key={user.id} className='flex items-center mb-2'>
          <Image
            src={user.image_url}
            alt={`${user.first_name} avatar`}
            width={512}
            height={512}
            style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }}
          />
          {user.first_name} {user.last_name}
          last seen: {new Date(onlineUsers?.find((u) => u.userId === user.id)?.lastSeen || 0).toLocaleTimeString()}
        </li>
      ))}
    </ul>
  );
}
