"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, DollarSign, Trash2, Plus, Clock, Edit, Save, X, GraduationCap, BookOpen, User } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";


interface TutorProfileData {
  name: string;
  email: string;
  image?: string;
  tutor?: {
    id: string;
    bio?: string;
    qualifications?: string;
    hourlyRate?: number;
    categories?: { id: string; name: string }[];
    availabilities?: { dayOfWeek: string; startTime: string; endTime: string }[];
  };
}

const DAYS_OF_WEEK = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
] as const;

const DAY_ABBR: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    image?: string;
    bio?: string;
    qualifications?: string;
    hourlyRate?: number;
  }>({ name: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<
    { dayOfWeek: string; startTime: string; endTime: string }[]
  >([]);

  const { user, isLoading: sessionLoading } = useSession();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/users/me");
      const profileData: TutorProfileData = data.data || data;
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        image: profileData.image,
        bio: profileData.tutor?.bio,
        qualifications: profileData.tutor?.qualifications,
        hourlyRate: profileData.tutor?.hourlyRate ? Number(profileData.tutor.hourlyRate) : undefined,
      });
      setSelectedCategories(profileData.tutor?.categories?.map((c) => c.id) || []);
      setAvailabilitySlots(profileData.tutor?.availabilities || []);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) { router.push("/sign-in?redirect=/dashboard/tutor/profile"); return; }
    if (user.role !== "TUTOR") { router.push(`/dashboard/${user.role?.toLowerCase()}/profile`); return; }
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sessionLoading, router]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleAddSlot = () => {
    setAvailabilitySlots([...availabilitySlots, { dayOfWeek: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveSlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: string, value: string) => {
    const newSlots = [...availabilitySlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setAvailabilitySlots(newSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const userUpdateData: Record<string, string> = { name: formData.name };
      if (formData.image) userUpdateData.image = formData.image;
      await api.patch("/users/me", userUpdateData);

      const tutorId = profile?.tutor?.id;
      if (!tutorId) { toast.error("Tutor profile not found"); return; }

      const currentCategoryIds = profile?.tutor?.categories?.map((c) => c.id) || [];
      const addCategoryIds = selectedCategories.filter((id) => !currentCategoryIds.includes(id));
      const removeCategoryIds = currentCategoryIds.filter((id) => !selectedCategories.includes(id));

      const tutorUpdateData: Record<string, unknown> = {};
      if (formData.bio !== undefined) tutorUpdateData.bio = formData.bio;
      if (formData.qualifications !== undefined) tutorUpdateData.qualifications = formData.qualifications;
      if (formData.hourlyRate !== undefined) tutorUpdateData.hourlyRate = formData.hourlyRate;
      if (addCategoryIds.length > 0) tutorUpdateData.addCategoryIds = addCategoryIds;
      if (removeCategoryIds.length > 0) tutorUpdateData.removeCategoryIds = removeCategoryIds;

      await api.patch(`/tutors/${tutorId}`, tutorUpdateData);
      await api.put("/availability/my-slots", { slots: availabilitySlots });

      toast.success("Profile updated successfully");
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        image: profile.image,
        bio: profile.tutor?.bio,
        qualifications: profile.tutor?.qualifications,
        hourlyRate: profile.tutor?.hourlyRate ? Number(profile.tutor.hourlyRate) : undefined,
      });
      setSelectedCategories(profile.tutor?.categories?.map((c) => c.id) || []);
      setAvailabilitySlots(profile.tutor?.availabilities || []);
    }
    setIsEditing(false);
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header Card */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-6 p-4">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={profile?.image} alt={profile?.name} />
                    <AvatarFallback className="text-2xl">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{profile?.name}</h3>
                    <p className="text-muted-foreground">Tutor Account</p>
                    {profile?.tutor?.hourlyRate && (
                      <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />{profile.tutor.hourlyRate}/hour
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            {profile?.tutor?.bio && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" /> About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.tutor.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Qualifications */}
            {profile?.tutor?.qualifications && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{profile.tutor.qualifications}</p>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            {profile?.tutor?.categories && profile.tutor.categories.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Expertise Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.tutor.categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            {profile?.tutor?.availabilities && profile.tutor.availabilities.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Weekly Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.tutor.availabilities.map((slot, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs bg-muted rounded-md px-3 py-1.5 font-medium">
                        <span>{DAY_ABBR[slot.dayOfWeek] || slot.dayOfWeek}</span>
                        <span className="text-muted-foreground">{slot.startTime} – {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!profile?.tutor?.bio && !profile?.tutor?.qualifications && !profile?.tutor?.categories?.length && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12 text-center gap-3">
                  <GraduationCap className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Your profile is incomplete.</p>
                  <Button onClick={() => setIsEditing(true)} size="sm">Complete Profile</Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Basic Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-muted" />
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Image</Label>
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                      />
                      <p className="text-xs text-muted-foreground">Max 5MB. Supports JPEG, PNG, WEBP</p>
                    </div>
                  </div>

                  {/* Tutor Info */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Tutor Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell students about yourself and your teaching experience..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Textarea
                        id="qualifications"
                        value={formData.qualifications || ""}
                        onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                        placeholder="Your qualifications and certifications..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Hourly Rate ($)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        value={formData.hourlyRate || ""}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                        placeholder="50.00"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Expertise Areas</h3>
                    {categoriesLoading ? (
                      <p className="text-sm text-muted-foreground">Loading categories...</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryToggle(category.id)}
                            />
                            <Label htmlFor={category.id} className="text-sm cursor-pointer">{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Weekly Availability
                      </h3>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddSlot}>
                        <Plus className="h-4 w-4 mr-1" /> Add Slot
                      </Button>
                    </div>

                    {availabilitySlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No availability set. Add slots so students can book you.</p>
                    ) : (
                      <div className="space-y-3">
                        {availabilitySlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                            <select
                              value={slot.dayOfWeek}
                              onChange={(e) => handleSlotChange(index, "dayOfWeek", e.target.value)}
                              className="flex-1 bg-background border rounded px-2 py-1 text-sm"
                            >
                              <option value="" disabled>Select a day</option>
                              {DAYS_OF_WEEK.map((day) => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                              className="w-32"
                            />
                            <span className="text-muted-foreground">–</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                              className="w-32"
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSlot(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSaving} className="flex-1">
                      {isSaving ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                      ) : (
                        <><Save className="h-4 w-4 mr-2" />Save Changes</>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}