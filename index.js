/*
 * Dana Cita Loan Calculator 1.0.0
 *
 * Released under the MIT license - https://opensource.org/licenses/MIT
 */

function createRepaymentSchedule(startDate, tenor = 12, interestRate = 0.01, loanAmount = 1000, gracePeriod, fees) {
    Object.assign(this, {
        startDate,
        tenor,
        interestRate,
        loanAmount,
        gracePeriod,
        fees
    });

    /**
     *
     * Calculate the monthly amortized loan payments.
     * @see https://en.wikipedia.org/wiki/Compound_interest#Monthly_amortized_loan_or_mortgage_payments
     * @return {Number}
     */
    this._PMT = () => {
        var i = this.interestRate;
        var L = this.loanAmount;
        var n = this._numberOfPayments();

        // if (this.settings.valueAddedTax !== 0) {
        //     i = (1 + this._valueAddedTax()) * i; // interest rate with tax
        // }

        return (L * i) / (1 - Math.pow(1 + i, -n));
    };
    /**
     * Calculate the total interest for the loan.
     * @returns {Number}
     */
    // _interestTotal = () => {
    //     var total = 0;
    //     $.each(this._results(), function(index, value) {
    //         total += value.interest;
    //     });

    //     return total;
    // };

    /**
     * Calculates the total cost of the loan.
     * @return {Number}
     */
    this._loanTotal = () => this._PMT() * this._numberOfPayments();

    /**
     * Returns number of payments for the loan.
     * @returns {Number}
     */
    this._numberOfPayments = () => {
        var durationInYears = this._toNumeric(this.tenor) / 12;
        return Math.floor(durationInYears * 12);
    };

    /**
     * Generate the results as an array of objects,
     * each object contains the values for each period.
     * @return {Array}
     */
    this._results = () => {
        var balance = this.loanAmount;
        var interestRate = this.interestRate;
        var payment = this._PMT();
        var numberOfPayments = this._numberOfPayments();
        var results = [];

        // We loop over the number of payments and each time
        // we extract the information to build the period
        // that will be appended to the results array.
        for (var paymentNumber = 0; paymentNumber < numberOfPayments; paymentNumber++) {
            var interest = balance * interestRate;
            var principal = payment - interest;

            // update initial balance for next iteration
            initial = balance;

            // update final balance for the next iteration.
            balance = balance - principal;

            results.push({
                initial,
                principal,
                interest,
                payment,
                balance
            });
        }

        return results;
    };

    /**
     * Generate the amortization schedule.
     * @return {Array}
     */
    this.schedule = () => {
        return this._results().map(value => {
            return {
                initial: this._toMoney(value.initial),
                principal: this._toMoney(value.principal),
                interest: this._toMoney(value.interest),
                payment: this._toMoney(value.payment),
                balance: this._toMoney(value.balance)
            };
        });
    };

    /**
     * Convert numeric format to money format.
     * @param  {Number} numeric
     * @return {String}
     */
    this._toMoney = numeric => {
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
    this._toNumeric = value => {
        return parseFloat(value.toString().replace(/[^0-9\.]+/g, ''));
    };

    /**
     * To convert the provided value to percent format.
     * @param {Number} numeric
     * @returns {String}
     */
    this._toPercentage = numeric => {
        return (numeric * 100).toFixed(2) + '%';
    };

    return this.schedule();
}
console.log(createRepaymentSchedule(null, 12, (32 / 12) / 100 , 6180000, null, null));
