# Stark [![Build Status](https://travis-ci.com/danacita/loanjs.svg?branch=master)](https://travis-ci.com/danacita/loanjs) [![Coverage Status](https://coveralls.io/repos/github/danacita/loanjs/badge.svg?branch=master)](https://coveralls.io/github/danacita/loanjs?branch=master) ![npm](https://img.shields.io/npm/v/@danacita/loanjs.svg) ![NPM](https://img.shields.io/npm/l/@danacita/loanjs.svg)

Stark is a loan calculator that we use internally at Dana Cita.

## Installation

```bash
npm i @danacita/stark
```

## Usage

```js
var Stark = require('@danacita/stark');
const stark = new Stark();

// or

import Stark from '@danacita/stark';
const stark = new Stark();
```

## Features

### Generate amortization schedule

Amortization is the paying off of debt with a fixed repayment schedule in regular installments over a period of time.

```js
const amortization = stark.Amortization(rate, tenor, principal, startDate, gracePeriod);
/*
[
  {
    date: '14-Jul-2019',
    month: 0,
    monthlyPayment: 0,
    principalAmount: 0,
    interestAmount: 0,
    outstandingBalance: 10300000
  },
  {
    date: '14-Aug-2019',
    month: 1,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 739610.747514377,
    interestAmount: 274666.6666666666,
    outstandingBalance: 9560390
  },
  {
    date: '14-Sep-2019',
    month: 2,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 759333.700781427,
    interestAmount: 254943.71339961662,
    outstandingBalance: 8801056
  },
  {
    date: '14-Oct-2019',
    month: 3,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 779582.5994689318,
    interestAmount: 234694.8147121119,
    outstandingBalance: 8021473
  },
  {
    date: '14-Nov-2019',
    month: 4,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 800371.4687881032,
    interestAmount: 213905.94539294037,
    outstandingBalance: 7221102
  },
  {
    date: '14-Dec-2019',
    month: 5,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 821714.707955786,
    interestAmount: 192562.70622525763,
    outstandingBalance: 6399387
  },
  {
    date: '14-Jan-2020',
    month: 6,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 843627.1001679403,
    interestAmount: 170650.31401310334,
    outstandingBalance: 5555760
  },
  {
    date: '14-Feb-2020',
    month: 7,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 866123.8228390854,
    interestAmount: 148153.59134195826,
    outstandingBalance: 4689636
  },
  {
    date: '14-Mar-2020',
    month: 8,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 889220.4581147943,
    interestAmount: 125056.95606624933,
    outstandingBalance: 3800416
  },
  {
    date: '14-Apr-2020',
    month: 9,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 912933.0036645222,
    interestAmount: 101344.41051652147,
    outstandingBalance: 2887483
  },
  {
    date: '14-May-2020',
    month: 10,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 937277.8837622427,
    interestAmount: 76999.53041880087,
    outstandingBalance: 1950205
  },
  {
    date: '14-Jun-2020',
    month: 11,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 962271.9606625693,
    interestAmount: 52005.45351847441,
    outstandingBalance: 987933
  },
  {
    date: '14-Jul-2020',
    month: 12,
    monthlyPayment: 1014277.4141810436,
    principalAmount: 987932.5462802377,
    interestAmount: 26344.867900805897,
    outstandingBalance: 0
  }
]
*/
```

### Calculate Loan Payment Period (PMT)

Payment for a loan based on constant payments and a constant interest rate.

```js
const monthlyPayment = stark.PMT(rate, tenor, principal);
// 1014277.4141810436
```

## License

Copyright (c) 2019 Dana Cita  
Licensed under the MIT license.
