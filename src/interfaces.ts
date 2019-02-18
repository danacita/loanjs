interface RepaymentScheduleJSON {
    loanDate: string;
    month: number;
    balance: number;
    payment: number;
    interest: number;
    principal: number;
}

interface RepaymentScheduleOptions {
    startDate: any;
    tenor?: number;
    interestRatePerYear: number;
    balanceRequested: number;
    origination?: number;
    gracePeriod?: number;
    fees?: number;
}
