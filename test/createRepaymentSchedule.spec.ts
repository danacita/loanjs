import {expect} from 'chai';
import {CreateRepaymentSchedule} from '../src/createRepaymentSchedule';
import '../src/interfaces';

describe('Create Repayment Schedule', () => {
    let repaymentScheduleOne: any;
    let repaymentScheduleTwo: any;
    let repaymentScheduleThree: any;

    beforeEach(() => {
        repaymentScheduleOne = CreateRepaymentSchedule({
            startDate: new Date(2019, 6, 14),
            tenor: 17,
            interestRatePerYear: 44,
            balanceRequested: 2406000,
            origination: 12.0
        });

        repaymentScheduleTwo =CreateRepaymentSchedule({
            startDate: new Date(2017, 4, 7),
            tenor: 7,
            interestRatePerYear: 10,
            balanceRequested: 1250000,
            origination: 10.0
        });

        repaymentScheduleThree = CreateRepaymentSchedule({
            startDate: new Date(2022, 11, 8),
            tenor: 22,
            interestRatePerYear: 21,
            balanceRequested: 4520500,
            origination: 3.0
        });
    });

    it('should initialize with the default values', () => {
        const defaultRepaymentSchedule: any = CreateRepaymentSchedule({
            startDate: new Date(2019, 0, 11),
            interestRatePerYear: 20,
            balanceRequested: 1500000
        });

        expect(defaultRepaymentSchedule.currentDate).to.deep.equal(new Date(2019, 0, 11));
        expect(defaultRepaymentSchedule.interestRatePerYear).to.equal(20 / 100);
        expect(defaultRepaymentSchedule.interestRatePerMonth).to.equal(20 / 12 / 100);
        expect(defaultRepaymentSchedule.loanAmount).to.equal(1500000);

        // Default Values
        expect(defaultRepaymentSchedule.tenor).to.equal(12);
        expect(defaultRepaymentSchedule.origination).to.equal(0);
        expect(defaultRepaymentSchedule.gracePeriod).to.equal(0);
        expect(defaultRepaymentSchedule.fees).to.equal(0);
    });

    it('should output the correct payment value from PMT function', () => {
        repaymentScheduleOne.generateSchedule();
        expect(repaymentScheduleOne._PMT()).to.equal(215814);
    });
});
