import { DiscordStorageSchema, discord, storagePrefix } from '../store/discord';
import { z } from 'zod';

const discordCredentialsKey = `${storagePrefix}credentials`;

const _attemptFragmentStorage = (mustBePopup = true): boolean => {
    const route = window.location.pathname;
    if (mustBePopup && route !== '/auth/discord') return false;

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.size <= 0) return false;

    const [accessToken, tokenType, expiresInRaw] = [
        fragment.get('access_token'),
        fragment.get('token_type'),
        fragment.get('expires_in'),
    ];

    // check to make sure everything exists
    if (!accessToken || !tokenType || !expiresInRaw) return false;

    // hit discord and get user info
    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then((discordResult) => {
            return discordResult.json();
        })
        .then((discordData: { avatar: string; id: string }) => {
            const { avatar, id } = discordData;

            const expiresIn = z.coerce.number().parse(expiresInRaw);

            const storageData: DiscordStorageSchema = {
                access_token: accessToken,
                token_type: tokenType,
                expires_in: expiresInRaw,
                expires_at: (
                    Math.floor(Date.now() / 1000) + expiresIn
                ).toString(),
                avatar,
                id,
            };

            localStorage.setItem(
                discordCredentialsKey,
                JSON.stringify(storageData)
            );

            window.opener.postMessage('The deed is done');
        });

    return true;
};

const _attemptLocalStorage = () => {
    // attempt to retreive ls
    const storage = localStorage.getItem(discordCredentialsKey);

    if (!storage) return false;

    // parse data
    const storageData: DiscordStorageSchema = JSON.parse(storage);

    // if data expired
    const expiresAt = z.coerce.number().parse(storageData.expires_at);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const dataIsExpired = nowInSeconds > expiresAt;
    if (dataIsExpired) {
        localStorage.removeItem(discordCredentialsKey);
        return false;
    }

    // if we have the data, store it in ram
    discord.accessToken = storageData.access_token;
    discord.tokenType = storageData.token_type;
    discord.expiresIn = z.coerce.number().parse(storageData.expires_in);
    discord.expiresAt = expiresAt;
    discord.avatar = storageData.avatar;
    discord.id = storageData.id;

    return true;
};

export const useDiscordCredentials = (passive = true) => {
    // try to hit local
    const localStorageSuccess = _attemptLocalStorage();

    const fragmentSuccess = !localStorageSuccess && _attemptFragmentStorage();

    // if active discord sync is needed, hit the redirect API
    if (!passive && !fragmentSuccess && !localStorageSuccess) {
        const popupWidth = 600;
        const popupHeight = 850;
        const leftPosition = (window.screen.width - popupWidth) / 2;
        const topPosition = (window.screen.height - popupHeight) / 2;
        const redirectURL = (host: string) => {
            switch (host) {
                case 'losthost':
                    return 'https://discord.com/oauth2/authorize?client_id=1219998739381616650&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fauth%2Fdiscord&scope=identify';

                case 'qwerty-clash.netlify.app':
                    return 'https://discord.com/oauth2/authorize?client_id=1219998739381616650&response_type=token&redirect_uri=https%3A%2F%2Fqwerty-clash.netlify.app%2Fauth%2Fdiscord&scope=identify';

                case 'clash.qwertycast.com':
                    return 'https://discord.com/oauth2/authorize?client_id=1219998739381616650&response_type=token&redirect_uri=https%3A%2F%2Fclash.qwertycast.com%2Fauth%2Fdiscord&scope=identify';
                default:
                    return '';
            }
        };
        const popup = window.open(
            redirectURL(location.hostname),
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${leftPosition},top=${topPosition}`
        );

        window.addEventListener(
            'message',
            (event) => {
                if (event.source !== popup) return;
                useDiscordCredentials();
            },
            false
        );
    }

    return discord;
};
