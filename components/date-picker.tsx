'use client';

// solution link: https://github.com/shadcn-ui/ui/issues/546#issuecomment-1873947429

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
};

export default function DatePicker({ label }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false); // Track popover state

  return (
    <>
      <Label className="block mb-2">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date ? (
              format(date, 'PP', { locale: es })
            ) : (
              <span>Seleccionar fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              setIsOpen(false); // Close popover when a date is selected
            }}
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={2035}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
