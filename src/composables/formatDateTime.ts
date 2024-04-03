export const useFormatDateTime = (iso: string) => {
    const date = new Date(iso).toLocaleDateString('en-US', {
        weekday: 'short', // Abbreviated day of the week (e.g., Wed)
        month: 'short', // Abbreviated month name (e.g., Apr)
        day: '2-digit', // Day of the month as two digits (e.g., 03)
    });
    const time = new Date(iso).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
    });

    return `${date} ${time}`;
};
