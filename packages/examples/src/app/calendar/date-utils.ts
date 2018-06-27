export const getEndOfWeek = (d: Date) => {
    const day = d.getDay();
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() + (day === 0 ? day : 7 - day)
    );
};

// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
export const getWeekNumber = (d: Date) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7 );
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

export const sameWeek = (a: Date, b: Date) => {
    const _a = getWeekNumber(a);
    const _b = getWeekNumber(b);
    return _a[0] === _b[0] && _a[1] === _b[1];
}

export const getStartOfDay = (d: Date) => {
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
    );
}

// https://www.htmlgoodies.com/html5/javascript/calculating-the-difference-between-two-dates-in-javascript.html
/* positive if date2 > date1 */
export const daysBetween = (date1: Date, date2: Date) => {
    // Get 1 day in milliseconds
    const one_day = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    const date1_ms = getStartOfDay(date1).getTime();
    const date2_ms = getStartOfDay(date2).getTime();
    // Calculate the difference in milliseconds
    const difference_ms = date2_ms - date1_ms;
    // Convert back to days and return
    return Math.round(difference_ms / one_day);
};

