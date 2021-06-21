export const rotate = (selector) => {
    const el = document.querySelector(selector)
    if (!el) return

    let counter = 1
    const intervalId = window.setInterval(function(){
        let prevclass = `loop${counter}`
        counter += 1
        if (counter > 10) {
            let prevclass = "loop10"
            counter = 1
        }
        
        let newclass = `loop${counter}`
        el.classList.remove(prevclass)
        el.classList.add(newclass)
    }, 1000);
}