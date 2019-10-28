class Wizard {
    show(el) {
        if (Array.isArray(el) || el instanceof NodeList)  {
            for(let i=0; i<el.length; i++) {
                el[i].classList.add("visible");
            }
        } else {
            el.classList.add("visible");
        }
    }
    hide(el) {
        if (Array.isArray(el) || el instanceof NodeList)  {
            for(let i=0; i<el.length; i++) {
                el[i].classList.remove("visible");
            }
        } else {
            el.classList.remove("visible");
        }
    }
}

export default new Wizard();