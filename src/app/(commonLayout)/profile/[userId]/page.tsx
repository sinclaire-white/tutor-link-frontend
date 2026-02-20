'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Phone, Calendar, DollarSign, BookOpen, Award, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  age?: number;
  role: string;
  isSuspended: boolean;
  tutor?: {
    bio?: string;
    qualifications?: string;
    hourlyRate?: number;
    isApproved: boolean;
    categories: { name: string }[];
  };
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`);
        setProfile(data.data || data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-lg">User not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const roleBadgeVariant = profile.role === 'ADMIN'
    ? 'destructive'
    : profile.role === 'TUTOR'
    ? 'default'
    : 'secondary';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="text-2xl font-bold">
                {profile.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={roleBadgeVariant}>{profile.role}</Badge>
                {profile.isSuspended && (
                  <Badge variant="destructive">Suspended</Badge>
                )}
                {profile.tutor?.isApproved && (
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    Verified Tutor
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
          </div>

          {profile.phoneNumber && (
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm font-medium">{profile.phoneNumber}</p>
              </div>
            </div>
          )}

          {profile.age && (
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <Label className="text-xs text-muted-foreground">Age</Label>
                <p className="text-sm font-medium">{profile.age}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tutor Info */}
      {profile.tutor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tutor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.tutor.hourlyRate != null && (
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <Label className="text-xs text-muted-foreground">Hourly Rate</Label>
                  <p className="text-sm font-medium">${profile.tutor.hourlyRate}/hr</p>
                </div>
              </div>
            )}

            {profile.tutor.bio && (
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  <p className="text-sm mt-1 leading-relaxed">{profile.tutor.bio}</p>
                </div>
              </div>
            )}

            {profile.tutor.qualifications && (
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <Label className="text-xs text-muted-foreground">Qualifications</Label>
                  <p className="text-sm mt-1 leading-relaxed">{profile.tutor.qualifications}</p>
                </div>
              </div>
            )}

            {profile.tutor.categories?.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Teaches</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.tutor.categories.map((cat) => (
                    <Badge key={cat.name} variant="secondary">{cat.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
