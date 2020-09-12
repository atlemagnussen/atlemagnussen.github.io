
let inputLoan1, inputLoan2, inputInt1, inputInt2, inputMonthly, inputPayment;
let paymentValue, downPaymentTime1, downPaymentTime2;

const init = () => {
    inputLoan1 = document.querySelector("#loan1");
    inputLoan1.addEventListener("change", onChange);
    
    inputInt1 = document.querySelector("#interest1");
    inputInt1.addEventListener("change", onChange);
    
    inputLoan2 = document.querySelector("#loan2");
    inputLoan2.addEventListener("change", onChange);
    
    inputInt2 = document.querySelector("#interest2");
    inputInt2.addEventListener("change", onChange);

    inputPayment = document.querySelector("#payment");
    inputPayment.addEventListener("change", onChange);
    paymentValue = document.querySelector("#paymentValue");

    inputMonthly = document.querySelector("#monthly");
    inputMonthly.addEventListener("change", onChange); 

    downPaymentTime1 = document.querySelector("#downPaymentTime1");
    downPaymentTime2 = document.querySelector("#downPaymentTime2");
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
const calc = (loan1, loan2, interest1, interest2, monthly, payment) => {
    inputPayment.max = monthly;
    if (payment > monthly)
        inputPayment = monthly;

    const loan1Monthly = payment;
    const loan2Monthly = monthly - payment;
    paymentValue.innerHTML = `loan 1: ${loan1Monthly}<br>loan 2: ${loan2Monthly}`;

    downPaymentTime1.innerHTML = "test1";
    downPaymentTime2.innerHTML = "test2";
};

const calcLoanRentAndDownPayment(loan, interest, monthly) => {
    let restLoan = loan;
    const rent = restLoan * (interest/100);
    const down = monthly - rent;
    restLoan -= down;

}

init();