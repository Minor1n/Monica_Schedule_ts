export function getNextMondayAndTomorrow(): string[] {
    const today = new Date();
    const dayOfWeek = today.getDay();

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dayOfWeek === 6) {
        tomorrow = getNextMonday(today);
    }

    const nextMonday = getNextMonday(today);

    return [
        formatDate(nextMonday),
        formatDate(tomorrow),
    ];
}

export function getNextMonday(date: Date): Date {
    const result = new Date(date);
    const dayOfWeek = date.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7;
    result.setDate(date.getDate() + daysUntilMonday);
    return result;
}

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}