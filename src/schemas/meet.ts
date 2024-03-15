import { z, object, string, array } from 'zod';
import { match } from './components';

const meetSchema = object({
    meet_time: string().datetime(),
    match: array(match),
});

export type MeetSchema = z.infer<typeof meetSchema>;
