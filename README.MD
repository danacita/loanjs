## Getting Started

Install the module with:
```
npm i @danacita/loanjs
```

### Creating a new Repayment Schedule
```js
let repaymentSchedule = new RepaymentSchedule({
            startDate: new Date(2017, 4, 7),
            tenor: 7,
            interestRatePerYear: 10,
            balanceRequested: 1250000,
            origination: 10.0
});
```

### Generate a new Repayment Schedule
```js
repaymentSchedule.generateSchedule();
```

## Documentation

### RepaymentSchedule
new Repayment(optionsObject)

### Options Object
| Properties          | type   | default   | Description
| --------------------| ------ | --------- | -----------------------------------------------------------------------
| startDate           | Date   | *required | The starting date of the loan
| tenor               | number | 12        | The amount of time left for the repayment of the loan
| interestPerYear     | number | *required | Interest rate per year in percent
| balanceRequested    | number | *required | New / additional balance requested
| origination         | number | 0         | An upfront fee charged by a lender
| gracePeriod         | number | 0         | A set period of time before borrower må
| fees                | number | 0         | additional fees

### Methods
generateSchedule()

### Returns
```js
[
    {
        loanDate: '7-May-2017',
        month: 0,
        balance: 1375000,
        payment: 0,
        interest: 0,
        principal: 0
    },
    {
        loanDate: '7-Jun-2017',
        month: 1,
        balance: 1183428,
        payment: 203031,
        interest: 11458,
        principal: 191572
    },
    {
        loanDate: '7-Jul-2017',
        month: 2,
        balance: 990259,
        payment: 203031,
        interest: 9862,
        principal: 193169
    },
    {
        loanDate: '7-Aug-2017',
        month: 3,
        balance: 795481,
        payment: 203031,
        interest: 8252,
        principal: 194778
    },
    {
        loanDate: '7-Sep-2017',
        month: 4,
        balance: 599079,
        payment: 203031,
        interest: 6629,
        principal: 196402
    },
    {
        loanDate: '7-Oct-2017',
        month: 5,
        balance: 401041,
        payment: 203031,
        interest: 4992,
        principal: 198038
    },
    {
        loanDate: '7-Nov-2017',
        month: 6,
        balance: 201353,
        payment: 203031,
        interest: 3342,
        principal: 199689
    },
    {
        loanDate: '7-Dec-2017',
        month: 7,
        balance: 0,
        payment: 203031,
        interest: 1678,
        principal: 201353
    }
];
```
