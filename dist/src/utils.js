"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert numeric format to money format.
 * @param  {Number} numeric
 * @return {String}
 */
exports._toMoney = (numeric) => {
    if (typeof numeric == 'string') {
        numeric = parseFloat(numeric);
    }
    return numeric.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};
/**
 * Convert from money format to numeric format.
 * @param  {String} value
 * @return {Number}
 */
exports._toNumeric = (value) => {
    return parseFloat(value.toString().replace(/[^0-9\.]+/g, ''));
};
/**
 * To convert the provided value to percent format.
 * @param {Number} numeric
 * @returns {String}
 */
exports._toPercentage = (numeric) => {
    return (numeric * 100).toFixed(0) + '%';
};
/**
 * To check whether the date is valid
 * @param value
 * @returns {Boolean}
 */
exports._isInvalidDate = (value) => {
    if (Object.prototype.toString.call(value) === '[object Date]') {
        // it is a date
        if (isNaN(value.getTime())) {
            // date is not valid
            return true;
        }
        else {
            // date is valid
            return false;
        }
    }
    return true;
};
/**
 * To check whether the number is >= 0
 *
 * @param number
 * @return {Boolean}
 */
exports._isPositive = (value) => {
    return (value >= 0) ? true : false;
};
