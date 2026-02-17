// app/dashboard/tutor/profile/page.tsx
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
import { Loader2, DollarSign, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "@/hooks/useCategories";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/ImageUpload";


// Updated interface to match API response structure
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
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push("/sign-in?redirect=/dashboard/tutor/profile");
      return;
    }
    if (user.role !== "TUTOR") {
      router.push(`/dashboard/${user.role?.toLowerCase()}/profile`);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        const profileData: TutorProfileData = data.data || data;
        setProfile(profileData);
        
        // Set form data from nested tutor object
        setFormData({
          name: profileData.name || "",
          image: profileData.image,
          bio: profileData.tutor?.bio,
          qualifications: profileData.tutor?.qualifications,
          hourlyRate: profileData.tutor?.hourlyRate ? Number(profileData.tutor.hourlyRate) : undefined,
        });
        
        setSelectedCategories(
          profileData.tutor?.categories?.map((c) => c.id) || [],
        );
        setAvailabilitySlots(profileData.tutor?.availabilities || []);
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, sessionLoading, router]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };
  
  const handleAddSlot = () => {
    setAvailabilitySlots([
      ...availabilitySlots,
      { dayOfWeek: "", startTime: "", endTime: "" },
    ]);
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
      // Update user profile - filter out undefined values
      const userUpdateData: any = { name: formData.name };
      if (formData.image) userUpdateData.image = formData.image;
      
      await api.patch("/users/me", userUpdateData);

      // Get tutor ID from profile
      const tutorId = profile?.tutor?.id;
      if (!tutorId) {
        toast.error("Tutor profile not found");
        return;
      }

      // Calculate category changes correctly
      const currentCategoryIds = profile?.tutor?.categories?.map((c) => c.id) || [];
      const addCategoryIds = selectedCategories.filter(
        (id) => !currentCategoryIds.includes(id),
      );
      const removeCategoryIds = currentCategoryIds.filter(
        (id) => !selectedCategories.includes(id),
      );

      // Update tutor profile - filter out undefined values
      const tutorUpdateData: any = {};
      if (formData.bio !== undefined) tutorUpdateData.bio = formData.bio;
      if (formData.qualifications !== undefined) tutorUpdateData.qualifications = formData.qualifications;
      if (formData.hourlyRate !== undefined) tutorUpdateData.hourlyRate = formData.hourlyRate;
      if (addCategoryIds.length > 0) tutorUpdateData.addCategoryIds = addCategoryIds;
      if (removeCategoryIds.length > 0) tutorUpdateData.removeCategoryIds = removeCategoryIds;
      
      await api.patch(`/tutors/${tutorId}`, tutorUpdateData);

      await api.put("/availability/my-slots", { slots: availabilitySlots });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tutor Profile</h1>

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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <p className="text-xs text-muted-foreground">
                  Max 5MB. Supports JPEG, PNG, WEBP
                </p>
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
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell students about yourself and your teaching experience..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, qualifications: e.target.value })
                  }
                  placeholder="Your qualifications and certifications..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Hourly Rate ($)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="50.00"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Expertise Areas</h3>
              {categoriesLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading categories...
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.id)
                        }
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Weekly Availability
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSlot}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slot
                </Button>
              </div>

              {availabilitySlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No availability set. Add slots so students can book you.
                </p>
              ) : (
                <div className="space-y-3">
                  {availabilitySlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50"
                    >
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) =>
                          handleSlotChange(index, "dayOfWeek", e.target.value)
                        }
                        className="flex-1 bg-background border rounded px-2 py-1 text-sm"
                      >
                        <option value="" disabled>
                          Select a day
                        </option>
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <div className="relative w-32">
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleSlotChange(index, "startTime", e.target.value)
                          }
                          placeholder="Start time"
                          className="w-full"
                        />
                      </div>
                      <span className="text-muted-foreground">-</span>
                      <div className="relative w-32">
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleSlotChange(index, "endTime", e.target.value)
                          }
                          placeholder="End time"
                          className="w-full"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSlot(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/tutor")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}