import { useEffect } from 'react';

type UseDayPickerCalendarFocusController = {
  isCalendarFocused: boolean;
  setIsCalendarFocused: (focused: boolean) => void;
  closeCalendar: () => void;
  onTapEnter: () => void;
};

export const useDayPickerCalendarFocusController = (
  params: UseDayPickerCalendarFocusController
) => {
  const { isCalendarFocused, setIsCalendarFocused, closeCalendar, onTapEnter } =
    params;

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event?.key?.toLowerCase() === 'arrowdown') {
        event.preventDefault();
        setIsCalendarFocused(true);
      }
      if (event?.key?.toLowerCase() === 'escape') {
        event.preventDefault();
        closeCalendar();
      }
      if (!isCalendarFocused && event?.key?.toLowerCase() === 'enter') {
        onTapEnter();
        event.preventDefault();
        closeCalendar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarFocused, setIsCalendarFocused, closeCalendar, onTapEnter]);
};
