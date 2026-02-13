// app/dashboard/admin/users/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

   const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users', { params: { q: query } });
      setUsers(data.data?.items || []);
    } catch (err: any) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    // Prevent self-deletion
    if (deleteTarget.id === user?.id) {
      toast.error('You cannot delete your own account');
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      toast.success(`User "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }
    fetchUsers();
  }, [user, sessionLoading, router, query, fetchUsers]);

  if (sessionLoading || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
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
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={() => setDeleteTarget(u)}
                disabled={u.id === user?.id} // Disable delete for self
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No users found</p>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => !isDeleting && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}).
              <br /><br />
              All associated data (bookings, reviews, tutor profile if applicable) will also be removed.
              <br /><br />
              <span className="text-destructive font-medium">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}