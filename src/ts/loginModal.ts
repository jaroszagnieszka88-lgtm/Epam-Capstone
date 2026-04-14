export function loginModal() {
    const modal = document.getElementById("loginModal") as HTMLDivElement;
    const trigger = document.getElementById("userTrigger") as HTMLAnchorElement;
    const form = document.getElementById("loginForm") as HTMLFormElement;

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const togglePassword = document.getElementById("togglePassword") as HTMLSpanElement;

    const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    modal.addEventListener("click", (e: MouseEvent) => {
        if (e.target !== modal)
            return;
        form.reset();
        modal.classList.add("hidden");
    });

    trigger.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";
        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.textContent = isHidden ? "🙈" : "👁️";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            return;
        }

        if (!password) {
            alert("Password is required");
            return;
        }

        modal.classList.add("hidden");

        form.reset();
        passwordInput.type = "password";
    });
}
