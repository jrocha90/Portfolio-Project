const menuToggle = document.querySelector("#menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

if (menuToggle && primaryNavigation) {
	document.body.classList.add("menu-enhanced");

	menuToggle.addEventListener("click", () => {
		const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

		menuToggle.setAttribute("aria-expanded", String(!isExpanded));
		menuToggle.setAttribute(
			"aria-label",
			isExpanded ? "Open navigation menu" : "Close navigation menu"
		);
		primaryNavigation.classList.toggle("is-open", !isExpanded);
	});

	primaryNavigation.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			menuToggle.setAttribute("aria-expanded", "false");
			menuToggle.setAttribute("aria-label", "Open navigation menu");
			primaryNavigation.classList.remove("is-open");
		});
	});
}

const projectCategoryFilter = document.querySelector("#project-category-filter");
const projectCards = document.querySelectorAll(".project-card");
const projectFilterStatus = document.querySelector("#project-filter-status");

if (projectCategoryFilter && projectFilterStatus && projectCards.length > 0) {
	projectCategoryFilter.addEventListener("change", () => {
		const selectedCategory = projectCategoryFilter.value;
		let visibleProjectCount = 0;

		projectCards.forEach((projectCard) => {
			const matchesCategory =
				selectedCategory === "all" ||
				projectCard.dataset.projectCategory === selectedCategory;

			projectCard.hidden = !matchesCategory;
			visibleProjectCount += Number(matchesCategory);
		});

		const projectLabel = visibleProjectCount === 1 ? "project" : "projects";
		projectFilterStatus.textContent = `Showing ${visibleProjectCount} ${projectLabel}`;
	});
}

const contactForm = document.querySelector("#contact form");

if (contactForm) {
	const requiredFields = contactForm.querySelectorAll("[required]");
	const touchedFields = new WeakSet();

	contactForm.noValidate = true;

	const getValidationMessage = (field) => {
		field.setCustomValidity("");

		if (!field.value.trim()) {
			const fieldName = field.name || "this field";
			return `Please enter your ${fieldName}.`;
		}

		if (!field.validity.valid) {
			return field.type === "email"
				? "Please enter a valid email address."
				: field.validationMessage;
		}

		return "";
	};

	const updateFieldFeedback = (field) => {
		const message = getValidationMessage(field);
		let errorMessage = field.parentElement.querySelector(
			`#${CSS.escape(`${field.id}-error`)}`
		);

		if (!errorMessage) {
			errorMessage = document.createElement("span");
			errorMessage.id = `${field.id}-error`;
			errorMessage.className = "field-error";
			errorMessage.setAttribute("aria-live", "polite");
			field.insertAdjacentElement("afterend", errorMessage);

			const describedBy = field.getAttribute("aria-describedby");
			field.setAttribute(
				"aria-describedby",
				[describedBy, errorMessage.id].filter(Boolean).join(" ")
			);
		}

		errorMessage.textContent = message;
		errorMessage.hidden = !message;

		if (touchedFields.has(field)) {
			field.setAttribute("aria-invalid", String(Boolean(message)));
		}

		field.setCustomValidity(message);
	};

	requiredFields.forEach((field) => {
		field.addEventListener("input", () => {
			touchedFields.add(field);
			updateFieldFeedback(field);
		});

		field.addEventListener("blur", () => {
			touchedFields.add(field);
			updateFieldFeedback(field);
		});
	});

	contactForm.addEventListener("submit", (event) => {
		requiredFields.forEach((field) => {
			touchedFields.add(field);
			updateFieldFeedback(field);
		});

		if (!contactForm.checkValidity()) {
			event.preventDefault();
			contactForm.reportValidity();
			return;
		}

		event.preventDefault();
		window.alert("Your form was submitted successfully!");
		window.location.hash = "top";
	});
}