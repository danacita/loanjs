# Loanjs ![npm](https://img.shields.io/npm/v/@danacita/loanjs.svg) ![NPM](https://img.shields.io/npm/l/@danacita/loanjs.svg)

Loanjs is a loan calculator that we use internally at Dana Cita.

## Installation

```
npm i @danacita/loanjs
```

## Features

### Creating a new Repayment Schedule

```js
let repaymentSchedule = new RepaymentSchedule({
  startDate: new Date(2017, 4, 7),
  tenor: 7,
  interestRatePerYear: 10.0,
  balanceRequested: 1250000,
  origination: 10.0
});
```

### Generate a new Repayment Schedule

```js
repaymentSchedule.generateSchedule();
```

## Documentation

### Repayment Schedule

```js
new Repayment(options);
```

#### Options

| Properties          | Type   | Default   | Description
| --------------------| ------ | --------- | -----------------------------------------------------------------------
| startDate           | Date   | *required | The starting date of the loan
| tenor               | number | 12        | The amount of time left for the repayment of the loan
| interestPerYear     | number | *required | The effective interest rate per year in percent (e.g: 20.5)
| balanceRequested    | number | *required | New / additional balance requested
| origination         | number | 0         | An upfront fee charged by a lender in percent (e.g: 3.5)
| gracePeriod         | number | 0         | A set period of time before borrower must begin repayment of the loan

### Generate Schedule

```js
generateSchedule();
```

#### Returns

```js
[
  {
    date: '7-May-2017',
    month: 0,
    balance: 1375000,
    payment: 0,
    interest: 0,
    principal: 0
  },
  {
    date: '7-Jun-2017',
    month: 1,
    balance: 1183428,
    payment: 203031,
    interest: 11458,
    principal: 191572
  },
  {
    date: '7-Jul-2017',
    month: 2,
    balance: 990259,
    payment: 203031,
    interest: 9862,
    principal: 193169
  },
  {
    date: '7-Aug-2017',
    month: 3,
    balance: 795481,
    payment: 203031,
    interest: 8252,
    principal: 194778
  },
  {
    date: '7-Sep-2017',
    month: 4,
    balance: 599079,
    payment: 203031,
    interest: 6629,
    principal: 196402
  },
  {
    date: '7-Oct-2017',
    month: 5,
    balance: 401041,
    payment: 203031,
    interest: 4992,
    principal: 198038
  },
  {
    date: '7-Nov-2017',
    month: 6,
    balance: 201353,
    payment: 203031,
    interest: 3342,
    principal: 199689
  },
  {
    date: '7-Dec-2017',
    month: 7,
    balance: 0,
    payment: 203031,
    interest: 1678,
    principal: 201353
  }
];
```

## License
Copyright (c) 2019 Dana Cita  
Licensed under the MIT license.
