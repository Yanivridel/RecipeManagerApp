

export function getInitials(username: string) {
    const words = username.split(' ');
    const firstTwoWords = words.slice(0, 2);
    return firstTwoWords.map(word => word.slice(0, 2).toUpperCase()).join('');
}
export function getInitialsColor(name: string): string {
    const initials = getInitials(name);
    let hash = 0;
    for (let i = 0; i < initials.length; i++) 
        hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}
