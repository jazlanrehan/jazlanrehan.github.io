/* =========================================================
   custom.js - Site upgrade additions
   1. Custom Dropdown component (replaces native <select>)
   2. EmailJS AJAX form submission handler (notification + auto-reply)
   ========================================================= */

(function () {
    "use strict";

    /* ---------------------------------------------------
       EmailJS CONFIG
       1. Public Key: EmailJS dashboard -> Account -> API Keys -> "Public Key"
       2. Service ID: already set (your connected Gmail)
       3. Notify template: the one you already built (sends TO YOU)
       4. Auto-reply template: create a 2nd template in EmailJS that
          sends a "Thank you" email TO THE VISITOR. In that template's
          Settings tab, set "To Email" field to {{email}}.
          Paste its Template ID below once created.
    --------------------------------------------------- */
    var EMAILJS_PUBLIC_KEY = "dagxkkVNE4SETvqFI";
    var EMAILJS_SERVICE_ID = "service_l2pt8tg";                 // already set
    var EMAILJS_NOTIFY_TEMPLATE_ID = "template_qryw6fs";        // already set (sends to you)
    var EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_b54ib6t";

    if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    var WHATSAPP_NUMBER = "923060366696"; // country code + number, no +/spaces

    /* =========================================================
       Custom Dropdown
       Markup expected:
       <div class="bix-dropdown" data-name="project_type">
           <button type="button" class="bix-dropdown-toggle">
               <span class="bix-dropdown-label">Placeholder</span>
               <i class="ri-arrow-down-s-line bix-dropdown-icon"></i>
           </button>
           <input type="hidden" name="project_type" value="">
           <div class="bix-dropdown-menu">
               <div class="bix-dropdown-option" data-value="x">Label</div>
               ...
           </div>
       </div>
    ========================================================= */
    function initDropdowns() {
        var dropdowns = document.querySelectorAll(".bix-dropdown");

        dropdowns.forEach(function (dropdown) {
            var toggle = dropdown.querySelector(".bix-dropdown-toggle");
            var menu = dropdown.querySelector(".bix-dropdown-menu");
            var label = dropdown.querySelector(".bix-dropdown-label");
            var hiddenInput = dropdown.querySelector('input[type="hidden"]');
            var options = dropdown.querySelectorAll(".bix-dropdown-option");

            if (!toggle || !menu) return;

            toggle.addEventListener("click", function (e) {
                e.stopPropagation();
                var isOpen = dropdown.classList.contains("open");
                // close all other dropdowns first
                document.querySelectorAll(".bix-dropdown.open").forEach(function (d) {
                    d.classList.remove("open");
                });
                if (!isOpen) {
                    dropdown.classList.add("open");
                }
            });

            options.forEach(function (option) {
                option.addEventListener("click", function () {
                    var value = option.getAttribute("data-value");
                    var text = option.textContent.trim();

                    options.forEach(function (o) { o.classList.remove("active"); });
                    option.classList.add("active");

                    if (label) label.textContent = text;
                    if (hiddenInput) hiddenInput.value = value;

                    dropdown.classList.remove("open");

                    // dispatch change event in case other code listens for it
                    dropdown.dispatchEvent(new CustomEvent("dropdownchange", { detail: { value: value, text: text } }));
                });
            });
        });

        // Close all dropdowns when clicking outside
        document.addEventListener("click", function () {
            document.querySelectorAll(".bix-dropdown.open").forEach(function (d) {
                d.classList.remove("open");
            });
        });
    }

    /* =========================================================
       Normalize any form's raw field values into the common
       variable set used by the EmailJS templates:
       firstName, lastName, email, phone, subject, message
       (Every "bix-ajax-form" on the site funnels through here,
        regardless of its own field names, so ONE pair of
        templates works for the contact page, the homepage
        project-inquiry form, and the homepage job-offer form.)
    ========================================================= */
    function normalizeFormData(form, raw) {
        var data = {
            firstName: "",
            lastName: "",
            email: raw.email || "",
            phone: raw.phone || "N/A",
            subject: "",
            message: raw.message || ""
        };

        if (raw.firstName || raw.lastName) {
            // contact.html form already uses this shape
            data.firstName = raw.firstName || "";
            data.lastName = raw.lastName || "";
            data.subject = raw.subject || "General Inquiry";
        } else if (form.id === "contact-form") {
            // Homepage "Start a Project" form
            data.firstName = raw.name || "Website Visitor";
            var bits = [];
            if (raw.project_type) bits.push(raw.project_type);
            data.subject = "Project Inquiry" + (bits.length ? ": " + bits.join(", ") : "");
            if (raw.budget) {
                data.message = "Budget: " + raw.budget + "\n\n" + data.message;
            }
        } else if (form.id === "job-form") {
            // Homepage "Offer a Job" form
            data.firstName = raw.name || "Website Visitor";
            data.subject = "Job Offer" + (raw.job_type ? ": " + raw.job_type : "");
            if (raw.salary) {
                data.message = "Offered Salary: " + raw.salary + "\n\n" + data.message;
            }
        } else {
            // Fallback for any future/unknown form
            data.firstName = raw.name || "Website Visitor";
            data.subject = raw._subject || "New Message";
        }

        return data;
    }

    /* =========================================================
       EmailJS AJAX submission
       Works on any <form> with class "bix-ajax-form"
       Shows status in the nearest .bix-form-status element
       Sends TWO emails per submission:
         1. Notification -> to you (EMAILJS_NOTIFY_TEMPLATE_ID)
         2. Auto-reply "Thank you" -> to the visitor (EMAILJS_AUTOREPLY_TEMPLATE_ID)
    ========================================================= */
    function initFormSubmissions() {
        var forms = document.querySelectorAll(".bix-ajax-form");

        forms.forEach(function (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                var statusEl = form.querySelector(".bix-form-status");
                var submitBtn = form.querySelector('button[type="submit"]');
                var originalBtnText = submitBtn ? submitBtn.innerHTML : "";

                function setStatus(message, type) {
                    if (!statusEl) return;
                    statusEl.className = "bix-form-status " + type;
                    statusEl.textContent = message;
                }

                // Basic validation: required fields
                var requiredFields = form.querySelectorAll("[required]");
                var isValid = true;
                requiredFields.forEach(function (field) {
                    if (!field.value || field.value.trim() === "") {
                        isValid = false;
                        field.style.borderColor = "#f41a4a";
                    } else {
                        field.style.borderColor = "";
                    }
                });

                if (!isValid) {
                    setStatus("Please fill in all required fields.", "error");
                    return;
                }

                if (typeof emailjs === "undefined" ||
                    EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
                    EMAILJS_AUTOREPLY_TEMPLATE_ID === "YOUR_AUTOREPLY_TEMPLATE_ID") {
                    setStatus(
                        "Form is almost ready! EmailJS setup is not finished yet (see assets/js/custom.js). Meanwhile, feel free to reach out on WhatsApp below.",
                        "error"
                    );
                    return;
                }

                setStatus("Sending your message...", "sending");
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = "Sending...";
                }

                var rawData = {};
                new FormData(form).forEach(function (value, key) {
                    rawData[key] = value;
                });
                var emailData = normalizeFormData(form, rawData);

                function resetFormUI() {
                    form.reset();
                    form.querySelectorAll(".bix-dropdown").forEach(function (dropdown) {
                        var label = dropdown.querySelector(".bix-dropdown-label");
                        var hiddenInput = dropdown.querySelector('input[type="hidden"]');
                        var defaultLabel = dropdown.getAttribute("data-placeholder");
                        if (label && defaultLabel) label.textContent = defaultLabel;
                        if (hiddenInput) hiddenInput.value = "";
                        dropdown.querySelectorAll(".bix-dropdown-option").forEach(function (o) {
                            o.classList.remove("active");
                        });
                    });
                }

                // 1. Notify you first — this is the important one.
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_NOTIFY_TEMPLATE_ID, emailData)
                    .then(function () {
                        setStatus("Thank you! Your message has been sent. I'll get back to you soon.", "success");
                        resetFormUI();

                        // 2. Auto-reply to the visitor. If this fails, it's logged
                        //    quietly — the visitor's message was already delivered.
                        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, emailData)
                            .catch(function (err) {
                                console.warn("Auto-reply email failed to send:", err);
                            });
                    })
                    .catch(function (err) {
                        console.error("EmailJS notify send failed:", err);
                        setStatus("Something went wrong. Please try again or contact me on WhatsApp.", "error");
                    })
                    .finally(function () {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnText;
                        }
                    });
            });
        });
    }

    /* =========================================================
       WhatsApp link builder - pulls form values into a prefilled message
    ========================================================= */
    function initWhatsAppButtons() {
        var buttons = document.querySelectorAll(".bix-whatsapp-prefill");

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                var formSelector = btn.getAttribute("data-form");
                var form = formSelector ? document.querySelector(formSelector) : null;
                var message = "Hi Jazlan, I'd like to discuss a project.";

                if (form) {
                    var name = form.querySelector('[name="name"]');
                    var firstName = form.querySelector('[name="firstName"]');
                    var lastName = form.querySelector('[name="lastName"]');
                    var service = form.querySelector('[name="project_type"], [name="subject"]');
                    var details = form.querySelector('[name="message"]');

                    var fullName = "";
                    if (name && name.value) fullName = name.value;
                    else if (firstName || lastName) fullName = [(firstName && firstName.value) || "", (lastName && lastName.value) || ""].join(" ").trim();

                    var parts = [];
                    if (fullName) parts.push("Name: " + fullName);
                    if (service && service.value) parts.push("Service: " + service.value);
                    if (details && details.value) parts.push("Details: " + details.value);

                    if (parts.length) {
                        message = "Hi Jazlan, here are my project details:\n" + parts.join("\n");
                    }
                }

                var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
                window.open(url, "_blank");
            });
        });
    }

    /* =========================================================
       Pricing "Get Started" buttons -> redirect to contact page
       with the selected plan pre-filled via URL parameter
    ========================================================= */
    function initPricingButtons() {
        var buttons = document.querySelectorAll(".bix-pricing-cta");

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var plan = btn.getAttribute("data-plan") || "";
                var url = "/contact.html" + (plan ? "?plan=" + encodeURIComponent(plan) : "");
                window.location.href = url;
            });
        });

        // On contact page: if ?plan= is present, prefill the message field
        var params = new URLSearchParams(window.location.search);
        var plan = params.get("plan");
        if (plan) {
            var messageField = document.querySelector('#contactForm textarea[name="message"], #contactForm textarea');
            if (messageField && !messageField.value) {
                messageField.value = "Hi, I'm interested in the " + plan + ". ";
            }
            var subjectDropdown = document.querySelector('#contactForm .bix-dropdown');
            if (subjectDropdown) {
                var label = subjectDropdown.querySelector(".bix-dropdown-label");
                var hiddenInput = subjectDropdown.querySelector('input[type="hidden"]');
                if (label) label.textContent = "Pricing Plan Inquiry";
                if (hiddenInput) hiddenInput.value = "Pricing Plan Inquiry";
                var matchingOption = subjectDropdown.querySelector('.bix-dropdown-option[data-value="Pricing Plan Inquiry"]');
                if (matchingOption) matchingOption.classList.add("active");
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        initDropdowns();
        initFormSubmissions();
        initWhatsAppButtons();
        initPricingButtons();
    });
})();
