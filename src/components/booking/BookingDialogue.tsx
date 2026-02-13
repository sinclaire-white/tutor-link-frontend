// components/booking/BookingDialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, DollarSign } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    userId: string;
    user: { name: string };
    hourlyRate: number;
  };
  slot: AvailabilitySlot | null;
}

export function BookingDialog({ isOpen, onClose, tutor, slot }: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!slot) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate next occurrence of this day
      const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const targetDay = daysOfWeek.indexOf(slot.dayOfWeek);
      const today = new Date().getDay();
      let daysUntil = targetDay - today;
      if (daysUntil <= 0) daysUntil += 7; // Next week if today or passed
      
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + daysUntil);
      const [hours, minutes] = slot.startTime.split(':');
      bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await api.post('/bookings', {
        tutorId: tutor.userId,
        categoryId: tutor.categories?.[0]?.id, // Or let student choose
        scheduledAt: bookingDate.toISOString(),
      });

      toast.success('Booking request sent!');
      onClose();
      router.push('/dashboard/student/bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            You are about to book a session with {tutor.user.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Day</p>
              <p className="font-medium">{slot.dayOfWeek}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rate</p>
              <p className="font-medium">${tutor.hourlyRate}/hour</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}