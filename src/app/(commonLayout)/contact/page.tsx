// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@tutorlink.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: MapPin, label: 'Address', value: '123 Education Lane, Tech City' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9AM – 6PM EST' },
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
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">Have a question? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-3">
          {contactInfo.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="p-2 rounded-md bg-primary/10 shrink-0">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form Card */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            {isSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll respond as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input placeholder="Your name" required />
                  <Input type="email" placeholder="Your email" required />
                </div>
                <Input placeholder="Subject" required />
                <Textarea placeholder="Your message..." rows={5} required className="resize-none" />
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}