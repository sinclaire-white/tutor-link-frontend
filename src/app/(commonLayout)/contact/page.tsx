// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';


const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@tutorlink.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: MapPin, label: 'Address', value: '123 Education Lane, Tech City' },
  { icon: Clock, label: 'Hours', value: 'Mon-Fri: 9AM - 6PM EST' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSent(true);
    toast.success('Message sent!');
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">We will get back to you as soon as possible.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Info */}
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-muted">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {isSent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="Name" required />
                  <Input type="email" placeholder="Email" required />
                </div>
                <Input placeholder="Subject" required />
                <Textarea placeholder="Your message..." rows={4} required className="resize-none" />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}