'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { es } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerProps = {
  label: string;
  value?: Date; // External value
  onChange?: (date: Date | undefined) => void; // Callback for external state sync
};

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false); // Track popover state

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (onChange) {
      onChange(selectedDate); // Notify parent component
    }
    setIsOpen(false); // Close popover when a date is selected
  };

  return (
    <div className='my-2'>
      <Label className="block mb-2">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {value ? (
              format(value, 'PP', { locale: es })
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateChange}
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={2035}
            locale={es}
            defaultMonth={value || new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
