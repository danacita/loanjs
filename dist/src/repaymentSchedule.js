"use strict";
/*
 * Dana Cita Loan Calculator 1.0.0
 *
 * Released under the MIT license - https://opensource.org/licenses/MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Utils = __importStar(require("./utils"));
require("./interfaces");
const lodash_1 = __importDefault(require("lodash"));
'use strict';
/**
 * Create the loan repayment schedule
 *
 * @param scheduleRepaymentOption - Based on RepaymentScheduleOptions interface
 *
 * @return the object of create repayment schedule
 */
class RepaymentSchedule {
    constructor({ startDate, tenor = 12, interestRatePerYear, balanceRequested, origination = 0, gracePeriod = 0, fees = 0 }) {
        /**
         * Getter Methods
         */
        this.tenor = () => this._tenor;
        this.currentDate = () => this._currentDate;
        this.interestRatePerYear = () => this._interestRatePerYear;
        this.interestRatePerMonth = () => this._interestRatePerMonth;
        this.loanAmount = () => this._loanAmount;
        this.origination = () => this._origination;
        this.gracePeriod = () => this._gracePeriod;
        this.fees = () => this._fees;
        /**
         * Public Methods
         */
        /**
         * Calculate the total interest for the loan.
         * @returns {Number}
         */
        this.interestTotal = () => {
            return this._results().reduce((total, value) => (total += value.interest), 0);
        };
        /**
         * Calculates the total cost of the loan.
         * @return {Number}
         */
        this.loanTotal = () => this._PMT() * this._numberOfPayments();
        /**
         * Generate the loan repayment schedule.
         * @return {Array}
         */
        this.generateSchedule = () => {
            return this._results().map((value) => {
                return {
                    date: moment_1.default(value.date).format('D-MMM-YYYY'),
                    month: Math.round(value.month),
                    balance: Math.abs(Math.round(value.balance)),
                    payment: Math.round(value.payment),
                    interest: Math.round(value.interest),
                    principal: Math.round(value.principal)
                };
            });
        };
        /**
         * Private Methods
         */
        /**
         *
         * Calculate the monthly amortized loan payments.
         * @see https://en.wikipedia.org/wiki/Compound_interest#Monthly_amortized_loan_or_mortgage_payments
         * @return {Number}
         */
        this._PMT = () => {
            const i = this._interestRatePerMonth;
            const L = this._loanAmountAfterOriginationFee();
            const n = this._numberOfPayments() - this._gracePeriod;
            return (L * i) / (1 - Math.pow(1 + i, -n));
        };
        this._loanAmountAfterOriginationFee = () => {
            return this._loanAmount + (this._origination / 100) * this._loanAmount;
        };
        this._numberOfPayments = () => {
            const durationInYears = this._tenor / 12;
            return Math.floor(durationInYears * 12);
        };
        /**
         * Generate the results as an array of objects,
         * each object contains the values for each period.
         * @return {Array}
         */
        this._results = () => {
            let currentGracePeriod = this._gracePeriod;
            let balance = this._loanAmountAfterOriginationFee();
            const interestRate = this._interestRatePerMonth;
            let payment = balance * interestRate;
            const numberOfPayments = this._numberOfPayments();
            let interest = payment;
            let principal = payment - interest;
            let month = 0;
            const results = [];
            // We loop over the number of payments and each time
            // we extract the information to build the period
            // that will be appended to the results array.
            for (let paymentNumber = 0; paymentNumber <= numberOfPayments; paymentNumber++) {
                results.push({
                    date: this._currentDate,
                    month,
                    principal: paymentNumber === 0 ? 0 : principal,
                    interest: paymentNumber === 0 ? 0 : interest,
                    payment: paymentNumber === 0 ? 0 : payment,
                    balance
                });
                // update interest, loan date, principal, balance, and #months for the next iteration.
                if (currentGracePeriod > 0) {
                    currentGracePeriod--;
                }
                else {
                    payment = this._PMT();
                    interest = balance * interestRate;
                    principal = payment - interest;
                    balance = balance - principal;
                }
                this._currentDate = moment_1.default(this._currentDate).add(1, 'months');
                month++;
            }
            return results;
        };
        // Type Validations
        if (Utils._isInvalidDate(startDate))
            throw new Error('Invalid Type for startDate!');
        if (!lodash_1.default.isNumber(tenor))
            throw new Error('Invalid Type for tenor');
        if (!lodash_1.default.isNumber(interestRatePerYear))
            throw new Error('Invalid Type for interestRatePerYear');
        if (!lodash_1.default.isNumber(balanceRequested))
            throw new Error('Invalid Type for balanceRequested');
        if (!lodash_1.default.isNumber(origination))
            throw new Error('Invalid Type for origination');
        if (!lodash_1.default.isNumber(gracePeriod))
            throw new Error('Invalid Type for gracePeriod');
        if (!lodash_1.default.isNumber(fees))
            throw new Error('Invalid Type for fees');
        // Number Validations
        if (!Utils._isPositive(tenor))
            throw new Error('tenor must be >= 0');
        if (!Utils._isPositive(interestRatePerYear))
            throw new Error('interestRatePerYear must be >= 0');
        if (!Utils._isPositive(balanceRequested))
            throw new Error('balanceRequested must be >= 0');
        if (!Utils._isPositive(origination))
            throw new Error('origination must be >= 0');
        if (!Utils._isPositive(gracePeriod))
            throw new Error('gracePeriod must be >= 0');
        if (!Utils._isPositive(fees))
            throw new Error('fees must be >= 0');
        this._currentDate = startDate;
        this._tenor = tenor;
        this._interestRatePerYear = interestRatePerYear / 100;
        this._interestRatePerMonth = (this._interestRatePerYear === 0) ? 0.00000000000001 : interestRatePerYear / 12 / 100;
        this._loanAmount = balanceRequested;
        this._origination = origination;
        this._gracePeriod = gracePeriod;
        this._fees = fees;
    }
}
exports.default = RepaymentSchedule;
module.exports = RepaymentSchedule;
