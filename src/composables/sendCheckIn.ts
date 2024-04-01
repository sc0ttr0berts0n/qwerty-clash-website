import { discord } from '../store/discord';

export const useSendCheckIn = async (meetID: string, checkInStatus: string) => {
    return await fetch('/.netlify/functions/checkin', {
        method: 'POST',
        body: JSON.stringify({
            accessToken: discord.accessToken,
            tokenType: discord.tokenType,
            meetID,
            checkinStatus: checkInStatus,
        }),
    });
};
