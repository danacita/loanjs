import { Finance } from 'financejs';
import moment from 'moment';

import './interface';

export default class Stark {
  /**
   * Amortization schedule.
   *
   * @param rate        Rate of interest, 100-based (15% = 15), per period.
   * @param tenor       Length of loan in month.
   * @param principal   Loan amount.
   * @param startDate   Loan start date.
   * @param gracePeriod Grace period of loan.
   * @return            Amortization schedule.
   */
  Amortization(
    rate: number,
    tenor: number,
    principal: number,
    startDate: any,
    gracePeriod: number = 0
  ): Array<{
    date: string;
    month: number;
    monthlyPayment: number;
    principalAmount: number;
    interestAmount: number;
    outstandingBalance: number;
  }> {
    let month = 0;
    let interestAmount = 0;
    let monthlyPayment = 0;
    let principalAmount = 0;
    let outstandingBalance = principal;
    let date = startDate;

    const schedules = [];
    const monthlyInterestRate = rate / 12 / 100;
    const numberOfPayments = gracePeriod === 0 ? tenor : gracePeriod + tenor;

    for (let paymentNumber = 0; paymentNumber <= numberOfPayments; paymentNumber++) {
      schedules.push({
        date,
        month,
        monthlyPayment,
        principalAmount,
        interestAmount,
        outstandingBalance
      });

      if (gracePeriod > 0) {
        gracePeriod--;
      } else {
        monthlyPayment = this.PMT(rate, tenor, principal);
        interestAmount = outstandingBalance * monthlyInterestRate;
        principalAmount = monthlyPayment - interestAmount;
        outstandingBalance = outstandingBalance - principalAmount;
      }
      date = moment(date).add(1, 'month');
      month++;
    }

    return schedules.map(
      (schedule: {
        date: string;
        month: number;
        monthlyPayment: number;
        principalAmount: number;
        interestAmount: number;
        outstandingBalance: number;
      }): {
        date: string;
        month: number;
        monthlyPayment: number;
        principalAmount: number;
        interestAmount: number;
        outstandingBalance: number;
      } => {
        return {
          date: moment(schedule.date).format('D-MMM-YYYY'),
          month: schedule.month,
          monthlyPayment: schedule.monthlyPayment,
          principalAmount: schedule.principalAmount,
          interestAmount: schedule.interestAmount,
          outstandingBalance: Math.abs(Math.ceil(schedule.outstandingBalance))
        };
      }
    );
  }

  /**
   * Loan Payment Per Period (PMT).
   * Payment for a loan based on constant payments and a constant interest rate.
   *
   * @param rate      Rate of interest, 100-based (15% = 15), per period.
   * @param tenor     Length of loan in month.
   * @param principal Loan amount.
   * @return          Monthly payment amount.
   * @see             {@link http://www.financeformulas.net/Loan_Payment_Formula.html}
   */
  PMT(rate: number, tenor: number, principal: number): number {
    const monthlyInterestRate = rate / 12 / 100;
    const financejs = new Finance();
    return financejs.PMT(monthlyInterestRate, tenor, -principal);
  }
}
