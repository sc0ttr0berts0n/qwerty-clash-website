import { z, array } from 'zod';
import { match } from './components';

export type FullScheduleSchema = z.infer<typeof match>;
