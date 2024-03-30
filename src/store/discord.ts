import { reactive } from 'vue';
import { object, string, z } from 'zod';
import pjson from '../../package.json';

export const storagePrefix = `qwertyclash-${pjson.version}-`;

const discordStorage = object({
    access_token: string(),
    token_type: string(),
    expires_in: string(),
    expires_at: string(),
    avatar: string(),
    id: string(),
});

export type DiscordStorageSchema = z.infer<typeof discordStorage>;

export const discord = reactive<{
    accessToken: undefined | string;
    tokenType: undefined | string;
    expiresIn: undefined | number;
    expiresAt: undefined | number;
    avatar: undefined | string;
    id: undefined | string;
}>({
    accessToken: undefined,
    tokenType: undefined,
    expiresIn: undefined,
    expiresAt: undefined,
    avatar: undefined,
    id: undefined,
});
