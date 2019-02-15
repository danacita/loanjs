interface RepaymentScheduleJSON {
    loanDate: string;
    month: string;
    balance: string;
    payment: string;
    interest: string;
    principal: string;
}

interface RepaymentScheduleOptions {
    startDate: Date;
    tenor?: number;
    interestRatePerYear: number;
    balanceRequested: number;
    origination?: number;
    gracePeriod?: number;
    fees?: number;
}
