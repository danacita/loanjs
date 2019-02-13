/**
 * Convert numeric format to money format.
 * @param  {Number} numeric
 * @return {String}
 */
export const _toMoney = (numeric: number): string => {
    if (typeof numeric == 'string') {
        numeric = parseFloat(numeric);
    }

    return '$' + numeric.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};

/**
 * Convert from money format to numeric format.
 * @param  {String} value
 * @return {Number}
 */
export const _toNumeric = (value: string): number => {
    return parseFloat(value.toString().replace(/[^0-9\.]+/g, ''));
};

/**
 * To convert the provided value to percent format.
 * @param {Number} numeric
 * @returns {String}
 */
export const _toPercentage = (numeric: number): string => {
    return (numeric * 100).toFixed(2) + '%';
};
