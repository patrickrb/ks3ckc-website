import { KeyboardEvent } from 'react';

import { useEventListener } from '@chakra-ui/react';

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
  // Seulement lorsque le calendrier est monté
  useEventListener('keydown', (event) => {
    const keyboardEvent = event as unknown as KeyboardEvent;
    if (keyboardEvent?.key?.toLowerCase() === 'arrowdown') {
      keyboardEvent.preventDefault();
      setIsCalendarFocused(true);
    }
    if (keyboardEvent?.key?.toLowerCase() === 'escape') {
      keyboardEvent.preventDefault();
      closeCalendar();
    }
    if (!isCalendarFocused && keyboardEvent?.key?.toLowerCase() === 'enter') {
      onTapEnter();
      keyboardEvent.preventDefault();
      closeCalendar();
    }
  });
};
