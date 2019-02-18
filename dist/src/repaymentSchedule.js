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
                    loanDate: moment_1.default(value.loanDate).format('D-MMM-YYYY'),
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
            const n = this._numberOfPayments();
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
            let balance = this._loanAmountAfterOriginationFee();
            const interestRate = this._interestRatePerMonth;
            const payment = this._PMT();
            const numberOfPayments = this._numberOfPayments();
            let interest = balance * interestRate;
            let principal = payment - interest;
            let month = 0;
            const results = [];
            // We loop over the number of payments and each time
            // we extract the information to build the period
            // that will be appended to the results array.
            for (let paymentNumber = 0; paymentNumber <= numberOfPayments; paymentNumber++) {
                results.push({
                    loanDate: this._currentDate,
                    month,
                    principal: paymentNumber === 0 ? 0 : principal,
                    interest: paymentNumber === 0 ? 0 : interest,
                    payment: paymentNumber === 0 ? 0 : payment,
                    balance
                });
                // update interest, loan date, principal, balance, and #months for the next iteration.
                this._currentDate = moment_1.default(this._currentDate).add(1, 'months');
                interest = balance * interestRate;
                principal = payment - interest;
                balance = balance - principal;
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
        this._interestRatePerMonth = interestRatePerYear / 12 / 100;
        this._loanAmount = balanceRequested;
        this._origination = origination;
        this._gracePeriod = gracePeriod;
        this._fees = fees;
    }
}
exports.default = RepaymentSchedule;
module.exports = RepaymentSchedule;
// const repaymentScheduleTest = new RepaymentSchedule({
//     startDate: new Date(2019, 6, 14),
//     tenor: 17,
//     interestRatePerYear: 44,
//     balanceRequested: 2406000,
//     origination: 12.0
// });
// console.log(repaymentScheduleTest.generateSchedule());
// // Function Implementation
// const CreateRepaymentSchedule = ({
//     startDate,
//     tenor = 12,
//     interestRatePerYear,
//     balanceRequested,
//     origination = 0,
//     gracePeriod = 0,
//     fees = 0
// }: RepaymentScheduleOptions): void => {
//     Object.assign(this, {
//         currentDate: startDate,
//         tenor,
//         interestRatePerYear: interestRatePerYear / 100,
//         interestRatePerMonth: interestRatePerYear / 12 / 100,
//         loanAmount: balanceRequested,
//         origination,
//         gracePeriod,
//         fees
//     });
//     /**
//      *
//      * Calculate the monthly amortized loan payments.
//      * @see https://en.wikipedia.org/wiki/Compound_interest#Monthly_amortized_loan_or_mortgage_payments
//      * @return {Number}
//      */
//     this._PMT = (): number => {
//         const i = this.interestRatePerMonth;
//         const L = this._loanAmountAfterOriginationFee();
//         const n = this._numberOfPayments();
//         return (L * i) / (1 - Math.pow(1 + i, -n));
//     };
//     this._loanAmountAfterOriginationFee = () => {
//         return this.loanAmount + (this.origination / 100) * this.loanAmount;
//     };
//     /**
//      * Calculate the total interest for the loan.
//      * @returns {Number}
//      */
//     // _interestTotal = () => {
//     //     let total = 0;
//     //     $.each(this._results(), function(index, value) {
//     //         total += value.interest;
//     //     });
//     //     return total;
//     // };
//     /**
//      * Calculates the total cost of the loan.
//      * @return {Number}
//      */
//     this._loanTotal = (): number => this._PMT() * this._numberOfPayments();
//     /**
//      * Returns number of payments for the loan.
//      * @returns {Number}
//      */
//     this._numberOfPayments = (): number => {
//         const durationInYears = Utils._toNumeric(this.tenor) / 12;
//         return Math.floor(durationInYears * 12);
//     };
//     /**
//      * Generate the results as an array of objects,
//      * each object contains the values for each period.
//      * @return {Array}
//      */
//     this._results = (): Array<{
//         loanDate: Date;
//         month: number;
//         principal: number;
//         interest: number;
//         payment: number;
//         balance: number;
//     }> => {
//         let balance = this._loanAmountAfterOriginationFee();
//         const interestRate = this.interestRatePerMonth;
//         const payment = this._PMT();
//         const numberOfPayments = this._numberOfPayments();
//         let interest = balance * interestRate;
//         let principal = payment - interest;
//         let month = 0;
//         const results = [];
//         // We loop over the number of payments and each time
//         // we extract the information to build the period
//         // that will be appended to the results array.
//         for (let paymentNumber = 0; paymentNumber <= numberOfPayments; paymentNumber++) {
//             results.push({
//                 loanDate: this.currentDate,
//                 month,
//                 principal,
//                 interest,
//                 payment,
//                 balance
//             });
//             // update interest, loan date, principal, balance, and #months for the next iteration.
//             this.currentDate = Moment(this.currentDate).add(1, 'months');
//             interest = balance * interestRate;
//             principal = payment - interest;
//             balance = balance - principal;
//             month++;
//         }
//         return results;
//     };
//     /**
//      * Generate the loan repayment schedule.
//      * @return {Array}
//      */
//     this.generateSchedule = (): Array<RepaymentScheduleJSON> => {
//         return this._results().map(
//             (value: any): RepaymentScheduleJSON => {
//                 return {
//                     loanDate: Moment(value.loanDate).format('DD-MMM-YYYY'),
//                     month: value.month.toString(),
//                     balance: Utils._toMoney(value.balance),
//                     payment: Utils._toMoney(value.payment),
//                     interest: Utils._toMoney(value.interest),
//                     principal: Utils._toMoney(value.principal)
//                 };
//             }
//         );
//     };
// };
// // console.log(createRepaymentSchedule(null, 12, 32, 6000000, 3.0, null, null));
// // console.log(createRepaymentSchedule(null, 7, 9, 7800000, 7.00, null, null));
