import { expect } from 'chai';

import '../interfaces';
import RepaymentSchedule from '../repaymentSchedule';
import {
  expectedRepaymentScheduleGracePeriod,
  expectedRepaymentScheduleOne,
  expectedRepaymentScheduleThree,
  expectedRepaymentScheduleTwo,
  expectedRepaymentScheduleZeroInterest
} from './fixtures';

describe('Repayment Schedule', () => {
  let repaymentScheduleOne: any;
  let repaymentScheduleTwo: any;
  let repaymentScheduleThree: any;
  let repaymentScheduleZeroInterestRate: any;

  beforeEach(() => {
    repaymentScheduleOne = new RepaymentSchedule({
      startDate: new Date(2019, 6, 14),
      tenor: 17,
      interestRatePerYear: 44,
      balanceRequested: 2406000,
      origination: 12.0
    });

    repaymentScheduleTwo = new RepaymentSchedule({
      startDate: new Date(2017, 4, 7),
      tenor: 7,
      interestRatePerYear: 10,
      balanceRequested: 1250000,
      origination: 10.0
    });

    repaymentScheduleThree = new RepaymentSchedule({
      startDate: new Date(2022, 11, 8),
      tenor: 22,
      interestRatePerYear: 21,
      balanceRequested: 4520500,
      origination: 3.0
    });

    repaymentScheduleZeroInterestRate = new RepaymentSchedule({
      startDate: new Date(2019, 11, 25),
      tenor: 3,
      interestRatePerYear: 0,
      balanceRequested: 10700000,
      origination: 0
    });

  });

  it('should initialize with the default values', () => {
    const defaultRepaymentSchedule: any = new RepaymentSchedule({
      startDate: new Date(2019, 0, 11),
      interestRatePerYear: 20,
      balanceRequested: 1500000
    });

    expect(defaultRepaymentSchedule.currentDate()).to.deep.equal(new Date(2019, 0, 11));
    expect(defaultRepaymentSchedule.interestRatePerYear()).to.equal(20 / 100);
    expect(defaultRepaymentSchedule.interestRatePerMonth()).to.equal(20 / 12 / 100);
    expect(defaultRepaymentSchedule.loanAmount()).to.equal(1500000);

    // Default Values
    expect(defaultRepaymentSchedule.tenor()).to.equal(12);
    expect(defaultRepaymentSchedule.origination()).to.equal(0);
    expect(defaultRepaymentSchedule.gracePeriod()).to.equal(0);
    expect(defaultRepaymentSchedule.fees()).to.equal(0);
  });

  it('should check the output from the generateSchedule function', () => {
    // First Case of Repayment Schedule
    const generatedRepaymentScheduleOne = repaymentScheduleOne.generateSchedule();
    expect(generatedRepaymentScheduleOne).to.deep.equal(expectedRepaymentScheduleOne);

    // Second Case of Repayment Schedule
    const generatedRepaymentScheduleTwo = repaymentScheduleTwo.generateSchedule();
    expect(generatedRepaymentScheduleTwo).to.deep.equal(expectedRepaymentScheduleTwo);

    // Third Case of Repayment Schedule
    const generatedRepaymentScheduleThree = repaymentScheduleThree.generateSchedule();
    expect(generatedRepaymentScheduleThree).to.deep.equal(expectedRepaymentScheduleThree);

    // Fourth case zero interest rate
    const generatedRepaymentScheduleZeroInterest = repaymentScheduleZeroInterestRate.generateSchedule();
    expect(generatedRepaymentScheduleZeroInterest).to.deep.equal(expectedRepaymentScheduleZeroInterest);

  });

  it('should check the output from generateSchedule from RepaymentSchedulewith grace period', () => {
    const repaymentScheduleGracePeriod = new RepaymentSchedule({
      startDate: new Date(2019, 1, 2),
      tenor: 18,
      interestRatePerYear: 28,
      balanceRequested: 35000000,
      origination: 3.0,
      gracePeriod: 6
    });
    const generatedRepaymentScheduleGracePeriod = repaymentScheduleGracePeriod.generateSchedule();
    expect(generatedRepaymentScheduleGracePeriod).to.deep.equal(
      expectedRepaymentScheduleGracePeriod
    );
  });

  it('should throw an error with "Invalid Type for startDate!" text if RepaymentSchedule initialize with an invalid type argument for startDate', () => {
    expect(
      () =>
        new RepaymentSchedule({
          startDate: 'invalidStartDateType',
          interestRatePerYear: 20,
          balanceRequested: 1500000
        })
    ).to.throw(Error, 'Invalid Type for startDate!');
  });

  it('should throw an error with "tenor must be >= 0"', () => {
    expect(() => {
      new RepaymentSchedule({
        startDate: new Date(2019, 0, 11),
        interestRatePerYear: 20,
        balanceRequested: 1500000,
        tenor: -1
      });
    }).to.throw(Error, 'tenor must be >= 0');
  });

  it('should throw an error with "tenor must be >= 0"', () => {
    expect(() => {
      new RepaymentSchedule({
        startDate: new Date(2019, 0, 11),
        interestRatePerYear: 20,
        balanceRequested: 1500000,
        tenor: -1
      });
    }).to.throw(Error, 'tenor must be >= 0');
  });

  it('should throw an error with "interestRatePerYear must be >= 0"', () => {
    expect(() => {
      new RepaymentSchedule({
        startDate: new Date(2019, 0, 11),
        interestRatePerYear: -1,
        balanceRequested: 1500000,
        tenor: 2
      });
    }).to.throw(Error, 'interestRatePerYear must be >= 0');
  });

  it('should throw an error with "balanceRequested must be >= 0"', () => {
    expect(() => {
      new RepaymentSchedule({
        startDate: new Date(2019, 0, 11),
        interestRatePerYear: 1,
        balanceRequested: -1,
        tenor: 2
      });
    }).to.throw(Error, 'balanceRequested must be >= 0');
  });

  it('should throw an error with "origination must be >= 0"', () => {
    expect(() => {
      new RepaymentSchedule({
        startDate: new Date(2019, 0, 11),
        interestRatePerYear: 1,
        balanceRequested: 1000000,
        tenor: 2,
        origination: -1
      });
    }).to.throw(Error, 'origination must be >= 0');
  });

  // it('should throw an error with "Invalid Type for tenor!" text if RepaymentSchedule initialize with an invalid type argument for tenor', () => {
  //     expect(() => {
  //         new RepaymentSchedule({
  //             startDate: 'invalidStartDateType',
  //             interestRatePerYear: 20,
  //             balanceRequested: 1500000,
  //             tenor:
  //         });
  //     });
  // });
});
