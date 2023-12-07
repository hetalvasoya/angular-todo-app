export const CommonFunction = {
    convertDate: convertDate
}

function convertDate(date: Date) {
    const originalDate = new Date(date);
    originalDate.setHours(originalDate.getHours() + 5);
    originalDate.setMinutes(originalDate.getMinutes() + 30);

    // Convert the updated Date object back to an ISO string
    const updatedISOString = originalDate.toISOString();
    return updatedISOString;
}