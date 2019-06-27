import { expect } from 'chai';

import Stark from '../stark';

import {
  expectedFirstAmortization,
  expectedSecondAmortization,
  expectedThirdAmortization,
  expectedFourthAmortization
} from './fixtures';

describe('Stark test', () => {
  describe('Amortization function', () => {
    it('should validate the output without grace period', () => {
      const stark = new Stark();
      const firstAmortization = stark.Amortization(32, 12, 10300000, new Date(2019, 6, 14));
      const secondAmortization = stark.Amortization(32, 24, 20300000, new Date(2017, 4, 7));

      expect(expectedFirstAmortization).to.deep.equal(firstAmortization);
      expect(expectedSecondAmortization).to.deep.equal(secondAmortization);
    });

    it('should validate the output with grace period', () => {
      const stark = new Stark();
      const thirdAmortization = stark.Amortization(32, 12, 10300000, new Date(2019, 6, 14), 6);
      const fourthAmortization = stark.Amortization(32, 24, 20300000, new Date(2019, 4, 7), 6);

      expect(expectedThirdAmortization).to.deep.equal(thirdAmortization);
      expect(expectedFourthAmortization).to.deep.equal(fourthAmortization);
    });
  });

  describe('PMT function', () => {
    it('should validate the output', () => {
      const stark = new Stark();
      const firstMonthlyPayment = stark.PMT(32, 12, 10300000);
      const secondMonthlyPayment = stark.PMT(32, 24, 20300000);

      expect(expectedFirstAmortization[1].monthlyPayment).to.be.equal(firstMonthlyPayment);
      expect(expectedSecondAmortization[1].monthlyPayment).to.be.equal(secondMonthlyPayment);
    });
  });
});
