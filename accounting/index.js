const init = () => {
    console.log("test");
    const inputPayment = document.querySelector("#payment");
    inputPayment.addEventListener("change", onChange);
    
    const inputLoan1 = document.querySelector("#loan1");
    inputLoan1.addEventListener("change", onChange);
    
    const inputInt1 = document.querySelector("#interest1");
    inputInt1.addEventListener("change", onChange);
    
    const inputLoan2 = document.querySelector("#loan2");
    inputLoan2.addEventListener("change", onChange);
    
    const inputInt2 = document.querySelector("#interest2");
    inputInt2.addEventListener("change", onChange);

    const onChange = (e) => {

    };
};

init();