'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchUsers = useCallback(() => {
    api.get('/users', { params: { q: query } })
      .then(({ data }) => setUsers(data.data?.items || []))
      .catch(console.error);
  }, [query]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (!user.role || user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || ''}`);
      return;
    }
    fetchUsers();
  }, [user, isLoading, router, fetchUsers]);

  const handleSuspend = async (id: string, isSuspended: boolean) => {
    try {
      await api.patch(`/users/${id}/suspend`, { suspended: !isSuspended });
      fetchUsers();
      toast.success(isSuspended ? 'User unsuspended' : 'User suspended');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="text-base">{u.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <Badge variant={u.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                  {u.role}
                </Badge>
                {u.isSuspended && <Badge variant="outline">Suspended</Badge>}
              </div>
              <Button
                variant={u.isSuspended ? 'outline' : 'destructive'}
                size="sm"
                onClick={() => handleSuspend(u.id, !!u.isSuspended)}
              >
                {u.isSuspended ? 'Unsuspend' : 'Suspend'}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}