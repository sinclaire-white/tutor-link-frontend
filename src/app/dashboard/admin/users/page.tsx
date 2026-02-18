// app/dashboard/admin/users/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Trash2, Loader2, Mail, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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
  image?: string;
  phoneNumber?: string;
  createdAt?: string;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage and monitor all platform users</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {users.length} Total Users
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="grid gap-4">
        {users.map((u, index) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src={u.image} alt={u.name} />
                      <AvatarFallback className="text-lg font-semibold bg-linear-to-br from-primary/20 to-primary/10">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl truncate">{u.name}</CardTitle>
                        <Badge 
                          variant={u.role === 'ADMIN' ? 'destructive' : u.role === 'TUTOR' ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {u.role}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        {u.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>📱</span>
                            <span>{u.phoneNumber}</span>
                          </div>
                        )}
                        {u.createdAt && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {new Date(u.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(u)}
                    disabled={u.id === user?.id}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && !isLoading && (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query</p>
          </div>
        </Card>
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
    </motion.div>
  );
}