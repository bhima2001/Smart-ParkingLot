export const generateSlots = (parsedStart, parsedEnd) => {
    // Generate 1-hour slots between parsedStart and parsedEnd
    // Each slot is an object: { start: <timestamp in ms>, end: <timestamp in ms> }
    let slots = [];
    let curr = parseInt(parsedStart);
    const end = parseInt(parsedEnd);
    while (curr < end) {
        console.log(curr);
        let next = curr + 60 * 60 * 1000; // add 1 hour in ms
        if (next > end) next = end;
        slots.push({ start: new Date(curr), end: new Date(next) });
        curr = next;
    }
    return slots;
}