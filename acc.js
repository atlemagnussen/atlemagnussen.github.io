const norNum = new Intl.NumberFormat("nb-NO", { style: "decimal", minimumFractionDigits: 2 });

let inputLoan1, inputLoan2, inputInt1, inputInt2, inputMonthly, inputPayment, inputPayment1, inputPayment2;
let paymentValue, downPaymentTime1, downPaymentTime2, totalRents;

const restoreLocalStore = (element, key) => {
    const storedVal = localStorage.getItem(key);
    if (storedVal && storedVal != "NaN")
        element.value = storedVal;
};
const init = () => {
    
    // loan1
    inputLoan1 = document.querySelector("#loan1");
    restoreLocalStore(inputLoan1, "loan1Amount");
    inputLoan1.addEventListener("change", onChange);
    
    // loan2
    inputLoan2 = document.querySelector("#loan2");
    restoreLocalStore(inputLoan2, "loan2Amount");
    inputLoan2.addEventListener("change", onChange);

    // interest1
    inputInt1 = document.querySelector("#interest1");
    restoreLocalStore(inputInt1, "interest1");
    inputInt1.addEventListener("change", onChange);
    
    // interest2
    inputInt2 = document.querySelector("#interest2");
    restoreLocalStore(inputInt2, "interest2");
    inputInt2.addEventListener("change", onChange);

    inputPayment = document.querySelector("#paymentSlider");
    restoreLocalStore(inputPayment, "loan1Payment");
    inputPayment.addEventListener("change", onChange);
    paymentValue = document.querySelector("#paymentValue");

    inputPayment1 = document.querySelector("#payment1");
    inputPayment1.addEventListener("change", inputPayment1Change);
    inputPayment2 = document.querySelector("#payment2");
    inputPayment2.addEventListener("change", inputPayment2Change);

    inputMonthly = document.querySelector("#monthlyTotal");
    restoreLocalStore(inputMonthly, "monthlyTotal");
    inputMonthly.addEventListener("change", onChange); 

    downPaymentTime1 = document.querySelector("#downPaymentTime1");
    downPaymentTime2 = document.querySelector("#downPaymentTime2");
    totalRents = document.querySelector("#totalRents");
};

const inputPayment1Change = () => {
    const val1 = inputPayment1.value;
    inputPayment.value = val1;
    const val2 = inputMonthly.value - val1;
    inputPayment2.value = val2;
    onChange();
};

const inputPayment2Change = () => {
    const val2 = inputPayment2.value;
    const val1 = inputMonthly.value - val2;
    inputPayment1.value = val1;
    inputPayment.value = val1;
    onChange();
};

const onChange = () => {
    const l1 = stringToNum(inputLoan1.value);
    const l2 = stringToNum(inputLoan2.value);
    const i1 = stringToNum(inputInt1.value);
    const i2 = stringToNum(inputInt2.value);
    const m = stringToNum(inputMonthly.value);
    const p = stringToNum(inputPayment.value);
    calc(l1, l2, i1, i2, m, p);
};

const stringToNum = (str) => {
    const val = parseFloat(str);
    return val;
};
const calc = (loan1Amount, loan2Amount, interest1, interest2, monthlyTotal, loan1Payment) => {
    localStorage.setItem("loan1Amount", loan1Amount);
    localStorage.setItem("loan2Amount", loan2Amount);
    localStorage.setItem("interest1", interest1);
    localStorage.setItem("interest2", interest2);
    localStorage.setItem("monthlyTotal", monthlyTotal);
    localStorage.setItem("loan1Payment", loan1Payment);
    inputPayment.max = monthlyTotal;
    if (loan1Payment > monthlyTotal)
        inputPayment.value = monthlyTotal;

    const loan1 = {
        totalAmount: loan1Amount,
        interest: interest1,
        running: true,
        downPayMonths: 0,
        rents: 0,
        monthly: loan1Payment
    };
    
    loan1.restLoan = loan1.totalAmount;
    const loan2 = {
        totalAmount: loan2Amount,
        interest: interest2,
        running: true,
        downPayMonths: 0,
        rents: 0,
        monthly: monthlyTotal - loan1Payment
    };
    
    loan2.restLoan = loan2.totalAmount;
    inputPayment1.value = loan1.monthly;
    inputPayment2.value = loan2.monthly;
    

    let details1 = "<details><summary>Details</summary>";
    let details2 = "<details><summary>Details</summary>";
    while (loan1.running || loan2.running) {
        if (loan1.running) {
            let monthlyPay = loan1.monthly;
            if (!loan2.running) {
                monthlyPay = monthlyTotal;
                if (loan2.restLoan < 0) {
                    loan1.restLoan += loan2.restLoan;
                    loan2.restLoan = 0;
                }
            }
            loan1.downPayMonths += 1;
            const rentMonth = calcLoanRentOneMonth(loan1.restLoan, loan1.interest);
            loan1.rents += rentMonth;
            let downPayMonth = monthlyPay - rentMonth;
            loan1.restLoan -= downPayMonth;

            if (loan1.restLoan <= 0) {
                loan1.running = false;
                downPayMonth += loan1.restLoan;
            }
            details1 = `${details1}<p>
                month ${loan1.downPayMonths}: paid: ${formatNum(downPayMonth)}, interest: ${formatNum(rentMonth)};
            </p>`;
        }

        if (loan2.running) {
            let monthlyPay = loan2.monthly;
            if (!loan1.running) {
                monthlyPay = monthlyTotal;
                if (loan1.restLoan < 0) {
                    loan2.restLoan += loan1.restLoan;
                    loan1.restLoan = 0;
                }
            }

            loan2.downPayMonths += 1;
            const rentMonth = calcLoanRentOneMonth(loan2.restLoan, loan2.interest);
            loan2.rents += rentMonth;
            let downPayMonth = monthlyPay - rentMonth;
            loan2.restLoan -= downPayMonth;
            
            if (loan2.restLoan <= 0) {
                loan2.running = false;
                downPayMonth += loan2.restLoan;
            }
            details2 = `${details2}<p>
                month ${loan2.downPayMonths}: paid: ${formatNum(downPayMonth)}, interest: ${formatNum(rentMonth)};
            </p>`;    
        }
    }
    details1 = `${details1}</details>`;
    details2 = `${details2}</details>`;

    downPaymentTime1.innerHTML = `${formatLoanTotals(loan1)}${details1}`;
    downPaymentTime2.innerHTML = `${formatLoanTotals(loan2)}${details2}`;
    const tr = formatNum(loan1.rents + loan2.rents);
    totalRents.innerHTML = `<b>${tr}</b>`;
};

const formatLoanTotals = (loan) => {
    const text = `downpay time: <b>${calcYears(loan.downPayMonths)}</b> <br>
            total interest: ${formatNum(loan.rents)}`;
    return text;
};
const formatNum = (num) => {
    let n = 0;
    if (num > 0)
        n = Math.round((num + Number.EPSILON) * 100) / 100;
    return norNum.format(n);
};
const calcLoanRentOneMonth = (loan, interest) => {
    const rent = (loan * (interest/100)) / 12;
    return rent;
};

const calcYears = (months) => {
    const m = months % 12;
    const y = Math.floor(months/12);
    return `${y} years ${m} months`;
};

init();