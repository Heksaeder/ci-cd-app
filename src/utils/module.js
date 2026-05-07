/**
 * Calculate the age of a person given their birth date.
 * @param {object} p - The person object containing the birth date.
 * @returns {number} The age of the person in years.
 */
export function calculateAge(p) {
    if(!p) {
        throw new Error('missing param p');
    };

    let dateDiff = new Date(Date.now() - p.birth.getTime());
    let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
    return age;
}