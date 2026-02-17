// app/bookings/new/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useSession } from "@/providers/SessionProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface TutorData {
  id: string;
  user: { name: string; image?: string };
  hourlyRate: number;
  categories: Category[];
  availabilities: AvailabilitySlot[];
}

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();

  const tutorId = searchParams.get("tutorId");
  const preselectedAvailabilityId = searchParams.get("availabilityId");

  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string>(
    preselectedAvailabilityId || ""
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startHour, setStartHour] = useState<string>("09:00");
  const [duration, setDuration] = useState<number>(1);

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!tutorId) {
      toast.error("Tutor ID is missing");
      router.push("/tutors");
      return;
    }

    const fetchTutor = async () => {
      try {
        const { data } = await api.get(`/tutors/public/${tutorId}`);
        const tutorData = data.data;
        setTutor(tutorData);

        // Auto-select first category if available
        if (tutorData.categories?.length > 0) {
          setSelectedCategoryId(tutorData.categories[0].id);
        }

        // Auto-select availability if provided
        if (preselectedAvailabilityId) {
          setSelectedAvailabilityId(preselectedAvailabilityId);
        }
      } catch {
        toast.error("Failed to load tutor details");
        router.push("/tutors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, user, sessionLoading, router, preselectedAvailabilityId]);

  const selectedSlot = tutor?.availabilities.find(
    (slot) => slot.id === selectedAvailabilityId
  );

  // Generate available hours based on selected slot
  const generateHourOptions = () => {
    if (!selectedSlot) return [];

    const [startH, startM] = selectedSlot.startTime.split(":").map(Number);
    const [endH, endM] = selectedSlot.endTime.split(":").map(Number);

    const options: string[] = [];
    let currentHour = startH;
    const currentMinute = startM;

    while (
      currentHour < endH ||
      (currentHour === endH && currentMinute < endM)
    ) {
      options.push(
        `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`
      );
      currentHour++;
    }

    return options;
  };

  const hourOptions = generateHourOptions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAvailabilityId) {
      toast.error("Please select an availability slot");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      const [hours, minutes] = startHour.split(":").map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes, 0, 0);

      await api.post("/bookings", {
        tutorId,
        categoryId: selectedCategoryId,
        scheduledAt: scheduledDate.toISOString(),
        duration,
      });

      toast.success("Booking request sent successfully!");
      router.push("/dashboard/student/bookings");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutor) return null;

  const totalCost = (tutor.hourlyRate * duration).toFixed(2);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
        <p className="text-muted-foreground">
          with {tutor.user.name} • ${tutor.hourlyRate}/hour
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Subject/Category *</Label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                {tutor.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Slot */}
            <div className="space-y-2">
              <Label htmlFor="availability">Day of Week *</Label>
              <select
                id="availability"
                value={selectedAvailabilityId}
                onChange={(e) => {
                  setSelectedAvailabilityId(e.target.value);
                  setStartHour("09:00");
                }}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a day</option>
                {tutor.availabilities.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.dayOfWeek} ({slot.startTime} - {slot.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Start Time */}
            {selectedSlot && (
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Start Time *
                </Label>
                <select
                  id="startTime"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {hourOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours) *</Label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {[1, 2, 3, 4, 5, 6].map((h) => (
                  <option key={h} value={h}>
                    {h} hour{h > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Cost */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Total Cost
                </span>
                <span className="text-primary">${totalCost}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${tutor.hourlyRate} × {duration} hour{duration > 1 ? "s" : ""}
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Send Booking Request"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your booking request will be sent to the tutor for approval.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <BookingFormContent />
    </Suspense>
  );
}
