// app/bookings/new/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useSession } from "@/providers/SessionProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Calendar as CalendarIcon, Clock, DollarSign, BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  userId: string;
  user: { 
    name: string; 
    image?: string;
    email?: string;
  };
  hourlyRate: number;
  categories: Category[];
  availabilities: AvailabilitySlot[];
}

// Helper to get next valid date for a day of week (all UTC to avoid timezone shifts)
function getNextDateForDay(dayName: string, fromDate = new Date()): Date {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const targetDay = days.indexOf(dayName.toUpperCase());

  if (targetDay === -1) return fromDate;

  // Work in UTC so .toISOString().split('T')[0] never rolls back a day
  const result = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()));

  // Start from tomorrow to ensure booking is in future
  result.setUTCDate(result.getUTCDate() + 1);

  const currentDay = result.getUTCDay();
  let daysToAdd = targetDay - currentDay;

  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  result.setUTCDate(result.getUTCDate() + daysToAdd);
  return result;
}

// Helper to generate time slots
function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  
  let currentH = startH;
  let currentM = startM;
  
  while (currentH < endH || (currentH === endH && currentM < endM)) {
    slots.push(`${String(currentH).padStart(2, "0")}:${String(currentM).padStart(2, "0")}`);
    
    // Increment by 30 minutes
    currentM += 30;
    if (currentM >= 60) {
      currentM = 0;
      currentH++;
    }
  }
  
  return slots;
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

  // Form state
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string>(
    preselectedAvailabilityId || ""
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // Fetch tutor data
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

        // Auto-select availability if provided and set suggested date
        if (preselectedAvailabilityId) {
          setSelectedAvailabilityId(preselectedAvailabilityId);
          const slot = tutorData.availabilities?.find(
            (s: AvailabilitySlot) => s.id === preselectedAvailabilityId
          );
          if (slot) {
            const nextDate = getNextDateForDay(slot.dayOfWeek);
            setSelectedDate(nextDate.toISOString().split('T')[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tutor details:", error);
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

  // When availability changes, update date to next valid date for that day
  useEffect(() => {
    if (selectedSlot) {
      const nextDate = getNextDateForDay(selectedSlot.dayOfWeek);
      setSelectedDate(nextDate.toISOString().split('T')[0]);
      setStartTime("");
      setEndTime("");
    }
  }, [selectedAvailabilityId, selectedSlot]);

  // Generate available start times
  const availableStartTimes = selectedSlot 
    ? generateTimeSlots(selectedSlot.startTime, selectedSlot.endTime).slice(0, -1) // Remove last slot as minimum 1hr needed
    : [];

  // Generate available end times (at least 1 hour after start)
  const availableEndTimes = selectedSlot && startTime
    ? (() => {
        const [startH, startM] = startTime.split(":").map(Number);
        const minEndH = startM === 30 ? startH + 1 : startH;
        const minEndM = startM === 30 ? 30 : 0;
        const minEndTime = `${String(minEndH).padStart(2, "0")}:${String(minEndM).padStart(2, "0")}`;
        
        return generateTimeSlots(selectedSlot.startTime, selectedSlot.endTime)
          .filter(time => time > minEndTime && time <= selectedSlot.endTime);
      })()
    : [];

  // Calculate duration in hours
  const calculateDuration = (): number => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return (endMinutes - startMinutes) / 60;
  };

  const duration = calculateDuration();
  const totalCost = tutor ? (Number(tutor.hourlyRate) * duration).toFixed(2) : "0.00";

  // Validate if selected date matches the availability day (use UTC to avoid off-by-one)
  const isDateValid = (): boolean => {
    if (!selectedDate || !selectedSlot) return false;
    const date = new Date(`${selectedDate}T00:00:00.000Z`);
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayName = days[date.getUTCDay()];
    return dayName === selectedSlot.dayOfWeek.toUpperCase();
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
    if (!isDateValid()) {
      toast.error(`Please select a ${selectedSlot?.dayOfWeek} for this time slot`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedAvailabilityId) {
      toast.error("Please select a time slot");
      return;
    }
    if (!selectedCategoryId) {
      toast.error("Please select a subject");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!isDateValid()) {
      toast.error(`Selected date must be a ${selectedSlot?.dayOfWeek}`);
      return;
    }
    if (!startTime) {
      toast.error("Please select a start time");
      return;
    }
    if (!endTime) {
      toast.error("Please select an end time");
      return;
    }

    const calculatedDuration = calculateDuration();
    if (calculatedDuration < 1) {
      toast.error("Minimum session duration is 1 hour");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build scheduledAt as a UTC timestamp so backend getHours() matches stored slot hours
      const scheduledDate = new Date(`${selectedDate}T${startTime}:00.000Z`);

      await api.post("/bookings", {
        tutorId: tutor?.userId,
        categoryId: selectedCategoryId,
        scheduledAt: scheduledDate.toISOString(),
        duration: calculatedDuration,
      });

      toast.success("Booking request sent successfully!");
      router.push("/dashboard/student/bookings");
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create booking";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Tutor not found</p>
          <Button onClick={() => router.push("/tutors")}>Browse Tutors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutor Profile
          </Button>
          
          <Card className="bg-linear-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={tutor.user.image} />
                  <AvatarFallback className="text-xl">
                    {tutor.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">Book a Session</h1>
                  <p className="text-muted-foreground">
                    with {tutor.user.name} • <span className="text-primary font-semibold">${tutor.hourlyRate}/hour</span>
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tutor.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Booking Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Select Subject */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Select Subject
                  </CardTitle>
                  <CardDescription>Choose the topic you want to learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tutor.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selectedCategoryId === cat.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Select Time Slot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Availability Slot
                  </CardTitle>
                  <CardDescription>Choose when you&apos;d like to meet and when you&apod like to schedule the session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutor.availabilities.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This tutor has no availability set. Please contact them directly.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {tutor.availabilities.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedAvailabilityId(slot.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedAvailabilityId === slot.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-semibold mb-1">{slot.dayOfWeek}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Select Date & Time */}
              {selectedSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Select Date & Time
                    </CardTitle>
                    <CardDescription>
                      Pick a {selectedSlot.dayOfWeek} and your preferred time (min. 1 hour session)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Tomorrow
                        className={`w-full px-3 py-2 border-2 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                          selectedDate && !isDateValid() ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {selectedDate && !isDateValid() && (
                        <p className="text-sm text-red-500">
                          Please select a {selectedSlot.dayOfWeek}
                        </p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <select
                          id="startTime"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            setEndTime(""); // Reset end time
                          }}
                          className="w-full px-3 py-2 border-2 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="">Select start time</option>
                          {availableStartTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <select
                          id="endTime"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-3 py-2 border-2 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                          disabled={!startTime}
                        >
                          <option value="">Select end time</option>
                          {availableEndTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {duration > 0 && (
                      <Alert className="bg-primary/5 border-primary/20">
                        <AlertDescription>
                          Session duration: <span className="font-semibold">{duration} hour{duration !== 1 ? 's' : ''}</span>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-medium">
                        {selectedCategoryId
                          ? tutor.categories.find((c) => c.id === selectedCategoryId)
                              ?.name
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Day:</span>
                      <span className="font-medium">
                        {selectedSlot?.dayOfWeek || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {selectedDate || "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {startTime && endTime
                          ? `${startTime} - ${endTime}`
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {duration > 0 ? `${duration} hr${duration !== 1 ? 's' : ''}` : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        Total Cost
                      </span>
                      <span className="text-primary text-2xl">${totalCost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${tutor.hourlyRate}/hr × {duration || 0} hr{duration !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={
                      isSubmitting ||
                      !selectedCategoryId ||
                      !selectedSlot ||
                      !selectedDate ||
                      !isDateValid() ||
                      !startTime ||
                      !endTime ||
                      duration < 1
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your booking will be sent to the tutor for approval
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
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
