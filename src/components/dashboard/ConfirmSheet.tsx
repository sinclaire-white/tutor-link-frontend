"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function ConfirmSheet({ children, title, description, onConfirm }: { children?: React.ReactNode; title?: string; description?: string; onConfirm?: () => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <span>{children}</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{title || 'Confirm'}</SheetTitle>
          <SheetDescription>{description || 'Are you sure?'}</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <div className="flex gap-2 justify-end">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
