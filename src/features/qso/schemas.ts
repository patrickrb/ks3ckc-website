import { z } from 'zod';

export type Qso = z.infer<ReturnType<typeof zQso>>;
export const zQso = () =>
  z.object({
    COL_CALL: z.string(),
    COL_TIME_ON: z.string(),
    COL_FREQ: z.string(),
    COL_MODE: z.string(),
    COL_RST_SENT: z.string(),
    COL_RST_RCVD: z.string(),
    COL_COMMENT: z.string(),
  });
