/*
 * Dana Cita Loan Calculator 1.0.0
 *
 * Released under the MIT license - https://opensource.org/licenses/MIT
 */

import Moment = require('moment');

interface RepaymentScheduleOptions {
    startDate: Date;
    tenor: number;
    interestRatePerYear: number;
    balanceRequested: number;
    origination: number;
    gracePeriod: number;
    fees: number;
}

interface RepaymentSchedule {
    loanDate: string;
    month: number;
    balance: number;
    payment: number;
    interest: number;
    principal: number;
}

/**
 *
 * @param {*} startDate "DD-MM-YYYY date object"
 * @param {*} tenor
 * @param {*} interestRatePerYear
 * @param {*} balanceRequested
 * @param {*} origination
 * @param {*} gracePeriod
 * @param {*} fees
 */
const createRepaymentSchedule = ({
    startDate,
    tenor,
    interestRatePerYear,
    balanceRequested,
    origination,
    gracePeriod,
    fees
}: RepaymentScheduleOptions) => {
    Object.assign(this, {
        currentDate: startDate,
        tenor,
        interestRatePerYear: interestRatePerYear / 100,
        interestRatePerMonth: interestRatePerYear / 12 / 100,
        loanAmount: balanceRequested,
        origination,
        gracePeriod,
        fees
    });

    /**
     *
     * Calculate the monthly amortized loan payments.
     * @see https://en.wikipedia.org/wiki/Compound_interest#Monthly_amortized_loan_or_mortgage_payments
     * @return {Number}
     */
    this._PMT = (): number => {
        const i = this.interestRatePerMonth;
        const L = this._loanAmountAfterOriginationFee();
        const n = this._numberOfPayments();

        // if (this.settings.valueAddedTax !== 0) {
        //     i = (1 + this._valueAddedTax()) * i; // interest rate with tax
        // }

        return (L * i) / (1 - Math.pow(1 + i, -n));
    };

    this._loanAmountAfterOriginationFee = () => {
        return this.loanAmount + (this.origination / 100) * this.loanAmount;
    };
    /**
     * Calculate the total interest for the loan.
     * @returns {Number}
     */
    // _interestTotal = () => {
    //     let total = 0;
    //     $.each(this._results(), function(index, value) {
    //         total += value.interest;
    //     });

    //     return total;
    // };

    /**
     * Calculates the total cost of the loan.
     * @return {Number}
     */
    this._loanTotal = (): number => this._PMT() * this._numberOfPayments();

    /**
     * Returns number of payments for the loan.
     * @returns {Number}
     */
    this._numberOfPayments = (): number => {
        const durationInYears = this._toNumeric(this.tenor) / 12;
        return Math.floor(durationInYears * 12);
    };

    /**
     * Generate the results as an array of objects,
     * each object contains the values for each period.
     * @return {Array}
     */
    this._results = (): Array<{
        loanDate: Date;
        month: number;
        principal: number;
        interest: number;
        payment: number;
        balance: number;
    }> => {
        let balance = this._loanAmountAfterOriginationFee();
        const interestRate = this.interestRatePerMonth;
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
                loanDate: this.currentDate,
                month,
                principal,
                interest,
                payment,
                balance
            });
            // update interest, loan date, principal, balance, and #months for the next iteration.
            this.currentDate = Moment(this.currentDate).add(1, 'months');
            interest = balance * interestRate;
            principal = payment - interest;
            balance = balance - principal;
            month++;
        }

        return results;
    };

    /**
     * Generate the amortization schedule.
     * @return {Array}
     */
    this._schedule = (): Array<RepaymentSchedule> => {
        return this._results().map(
            (value: any): RepaymentSchedule => {
                return {
                    loanDate: Moment(value.loanDate).format('DD-MMM-YYYY'),
                    month: value.month,
                    balance: this._toMoney(value.balance),
                    payment: this._toMoney(value.payment),
                    interest: this._toMoney(value.interest),
                    principal: this._toMoney(value.principal)
                };
            }
        );
    };

    /**
     * Convert numeric format to money format.
     * @param  {Number} numeric
     * @return {String}
     */
    this._toMoney = (numeric: number): string => {
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
    this._toNumeric = (value: string): number => {
        return parseFloat(value.toString().replace(/[^0-9\.]+/g, ''));
    };

    /**
     * To convert the provided value to percent format.
     * @param {Number} numeric
     * @returns {String}
     */
    this._toPercentage = (numeric: number): string => {
        return (numeric * 100).toFixed(2) + '%';
    };

    return this._schedule();
};
// console.log(createRepaymentSchedule(null, 12, 32, 6000000, 3.0, null, null));
// console.log(createRepaymentSchedule(null, 7, 9, 7800000, 7.00, null, null));
console.log(
    createRepaymentSchedule({
        startDate: new Date(2019, 6, 14),
        tenor: 17,
        interestRatePerYear: 44,
        balanceRequested: 2406000,
        origination: 12.0,
        gracePeriod: undefined,
        fees: undefined
    })
);
