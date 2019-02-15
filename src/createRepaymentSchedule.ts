/*
 * Dana Cita Loan Calculator 1.0.0
 *
 * Released under the MIT license - https://opensource.org/licenses/MIT
 */

import Moment from 'moment';
import * as Utils from './utils';
import './interfaces';

/**
 * Create the loan repayment schedule
 *
 * @param scheduleRepaymentOption - Based on RepaymentScheduleOptions interface
 *
 * @return the object of create repayment schedule
 */
export const CreateRepaymentSchedule = ({
    startDate,
    tenor = 12,
    interestRatePerYear,
    balanceRequested,
    origination = 0,
    gracePeriod = 0,
    fees = 0
}: RepaymentScheduleOptions): any => {
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
    this._PMT = ():number => {
        const i = this.interestRatePerMonth;
        const L = this._loanAmountAfterOriginationFee();
        const n = this._numberOfPayments();
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
        const durationInYears = Utils._toNumeric(this.tenor) / 12;
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
     * Generate the loan repayment schedule.
     * @return {Array}
     */
    this.generateSchedule = (): Array<RepaymentScheduleJSON> => {
        return this._results().map(
            (value: any): RepaymentScheduleJSON => {
                return {
                    loanDate: Moment(value.loanDate).format('DD-MMM-YYYY'),
                    month: value.month.toString(),
                    balance: Utils._toMoney(value.balance),
                    payment: Utils._toMoney(value.payment),
                    interest: Utils._toMoney(value.interest),
                    principal: Utils._toMoney(value.principal)
                };
            }
        );
    };
};

// console.log(createRepaymentSchedule(null, 12, 32, 6000000, 3.0, null, null));
// console.log(createRepaymentSchedule(null, 7, 9, 7800000, 7.00, null, null));

const createRepaymentScheduleTest = CreateRepaymentSchedule({
    startDate: new Date(2019, 6, 14),
    tenor: 17,
    interestRatePerYear: 44,
    balanceRequested: 2406000,
    origination: 12.0
});
console.log(createRepaymentScheduleTest._PMT());
