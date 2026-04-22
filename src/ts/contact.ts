export function contactForm() {
	const form = document.getElementById("contactForm") as HTMLFormElement | null;
	if (!form) return;

	const nameInput = document.getElementById("name") as HTMLInputElement | null;
	const emailInput = document.getElementById("contactEmail") as HTMLInputElement | null;
	const topicInput = document.getElementById("topic") as HTMLInputElement | null;
	const messageInput = document.getElementById("message") as HTMLTextAreaElement | null;
	const emailError = document.getElementById("emailError") as HTMLElement | null;
	const feedback = document.getElementById("contactMessage") as HTMLElement | null;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function showFeedback(text: string, success = true) {
		if (!feedback) return;
		feedback.textContent = text;
		feedback.classList.remove("success", "error");
		feedback.classList.add(success ? "success" : "error");
		feedback.style.display = "block";
	}

	if (emailInput && emailError) {
		emailInput.addEventListener("keyup", () => {
			const val = emailInput.value.trim();
			const valid = emailRegex.test(val);
			if (!val) {
                emailError.style.display = "none";
				emailInput.classList.remove("invalid");
				return;
			}
			if (!valid) {
				emailError.style.display = "block";
				emailInput.classList.add("invalid");
			} else {
				emailError.style.display = "none";
				emailInput.classList.remove("invalid");
			}
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
        if(feedback)
            feedback.style.display = "none";
        
		const name = nameInput?.value.trim() || "";
		const email = emailInput?.value.trim() || "";
		const topic = topicInput?.value.trim() || "";
		const message = messageInput?.value.trim() || "";

		if (!name || !email || !topic || !message) {
			showFeedback("Please fill all required fields.", false);
			return;
		}

		if (!emailRegex.test(email)) {
			showFeedback("Please enter a valid email address.", false);
			return;
		}

		showFeedback("Thank you! Your message has been sent.", true);
		form.reset();
	});
}
