/**
 * SAHARA TOURISM QATAR - INTERACTIVE JAVASCRIPT
 * Official Contact Info:
 * Email: saharatourism1@gmail.com
 * WhatsApp: 009746634677 (+9746634677)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Year in Footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 2. Set Default Booking Dates (Tomorrow's Date)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateFormatted = tomorrow.toISOString().split('T')[0];

    const bookingDateInput = document.getElementById('bookingDate');
    const heroTourDateInput = document.getElementById('heroTourDate');

    if (bookingDateInput) {
        bookingDateInput.min = today.toISOString().split('T')[0];
        bookingDateInput.value = dateFormatted;
    }
    if (heroTourDateInput) {
        heroTourDateInput.min = today.toISOString().split('T')[0];
        heroTourDateInput.value = dateFormatted;
    }

    // 3. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 4. Dynamic Price Calculation Engine
    const tourPackageSelect = document.getElementById('bookingTourPackage');
    const adultsInput = document.getElementById('bookingAdults');
    const kidsInput = document.getElementById('bookingKids');
    const addonCamelCheckbox = document.getElementById('addonCamel');
    const addonScooterCheckbox = document.getElementById('addonScooter');
    const addonFalconCheckbox = document.getElementById('addonFalcon');
    const priceDisplay = document.getElementById('priceDisplay');

    function calculateTotalPrice() {
        if (!tourPackageSelect || !priceDisplay) return;

        const selectedOption = tourPackageSelect.options[tourPackageSelect.selectedIndex];
        let basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 180;

        const adults = parseInt(adultsInput?.value || 1, 10);
        const kids = parseInt(kidsInput?.value || 0, 10);
        const totalGuests = Math.max(1, adults + kids);

        let totalPrice = 0;

        // If private VIP vehicle, flat price up to 6 guests
        if (selectedOption.value.includes('Private VIP 4x4')) {
            totalPrice = 1200;
        } else {
            // Kids get 30% discount on base price
            const adultTotal = adults * basePrice;
            const kidsTotal = kids * (basePrice * 0.7);
            totalPrice = adultTotal + kidsTotal;
        }

        // Add-ons
        if (addonCamelCheckbox && addonCamelCheckbox.checked) {
            totalPrice += (50 * totalGuests);
        }
        if (addonScooterCheckbox && addonScooterCheckbox.checked) {
            totalPrice += (100 * totalGuests);
        }
        if (addonFalconCheckbox && addonFalconCheckbox.checked) {
            totalPrice += (30 * totalGuests);
        }

        priceDisplay.textContent = `QAR ${Math.round(totalPrice)}`;
        return Math.round(totalPrice);
    }

    // Attach calculation listeners
    [tourPackageSelect, adultsInput, kidsInput, addonCamelCheckbox, addonScooterCheckbox, addonFalconCheckbox].forEach(el => {
        if (el) {
            el.addEventListener('change', calculateTotalPrice);
            el.addEventListener('input', calculateTotalPrice);
        }
    });

    // Run initial calculation
    calculateTotalPrice();

    // 5. Package Selection from external buttons
    window.selectPackageForBooking = function(packageName, price) {
        if (!tourPackageSelect) return;
        
        // Find matching option
        for (let i = 0; i < tourPackageSelect.options.length; i++) {
            if (tourPackageSelect.options[i].value.toLowerCase().includes(packageName.toLowerCase().substring(0, 15))) {
                tourPackageSelect.selectedIndex = i;
                break;
            }
        }

        calculateTotalPrice();

        // Smooth scroll to booking section
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 6. Gather Booking Payload Helper
    function getBookingData() {
        const name = document.getElementById('bookingName')?.value.trim() || 'Guest';
        const phone = document.getElementById('bookingPhone')?.value.trim() || 'Not provided';
        const email = document.getElementById('bookingEmail')?.value.trim() || 'Not provided';
        const tour = tourPackageSelect?.options[tourPackageSelect.selectedIndex]?.value || 'Desert Safari';
        const date = bookingDateInput?.value || dateFormatted;
        const timeSlot = document.getElementById('bookingTimeSlot')?.value || 'Afternoon & Sunset';
        const adults = adultsInput?.value || '1';
        const kids = kidsInput?.value || '0';
        const pickup = document.getElementById('bookingPickup')?.value.trim() || 'Doha Location to be shared';
        const notes = document.getElementById('bookingNotes')?.value.trim() || 'None';
        const estimatedTotal = calculateTotalPrice();

        const addons = [];
        if (addonCamelCheckbox?.checked) addons.push('Extended Camel Ride (+QAR 50)');
        if (addonScooterCheckbox?.checked) addons.push('Desert Scooter & Quad Addon (+QAR 100)');
        if (addonFalconCheckbox?.checked) addons.push('Royal Falcon Photo (+QAR 30)');

        return {
            name,
            phone,
            email,
            tour,
            date,
            timeSlot,
            adults,
            kids,
            addons: addons.length > 0 ? addons.join(', ') : 'None',
            pickup,
            notes,
            estimatedTotal
        };
    }

    // 7. Booking Form - WhatsApp Submission
    const btnSubmitWhatsApp = document.getElementById('btnSubmitWhatsApp');
    if (btnSubmitWhatsApp) {
        btnSubmitWhatsApp.addEventListener('click', () => {
            const data = getBookingData();

            if (!document.getElementById('bookingName')?.value.trim() || !document.getElementById('bookingPhone')?.value.trim()) {
                alert('Please enter your Name and WhatsApp/Phone number before booking.');
                document.getElementById('bookingName')?.focus();
                return;
            }

            const message = 
`*SAHARA TOURISM QATAR - BOOKING REQUEST*
----------------------------------------
*Name:* ${data.name}
*WhatsApp/Phone:* ${data.phone}
*Email:* ${data.email}
*Package:* ${data.tour}
*Date:* ${data.date}
*Time Slot:* ${data.timeSlot}
*Guests:* ${data.adults} Adults, ${data.kids} Children
*Activity Add-ons:* ${data.addons}
*Pickup Location:* ${data.pickup}
*Special Notes:* ${data.notes}
----------------------------------------
*Estimated Total:* QAR ${data.estimatedTotal}
*(Payment upon pickup in Doha)*

Please confirm availability and pickup time. Thank you!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/9746634677?text=${encodedMessage}`;

            // Show feedback notice
            showSuccessNotice(`Redirecting to WhatsApp (009746634677) to confirm your safari with Sahara Tourism Qatar!`);

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
        });
    }

    // 8. Booking Form - Email Submission
    const btnSubmitEmail = document.getElementById('btnSubmitEmail');
    const onlineBookingForm = document.getElementById('onlineBookingForm');

    if (btnSubmitEmail) {
        btnSubmitEmail.addEventListener('click', () => {
            const data = getBookingData();

            if (!document.getElementById('bookingName')?.value.trim() || !document.getElementById('bookingEmail')?.value.trim()) {
                alert('Please provide your Name and Email address.');
                document.getElementById('bookingName')?.focus();
                return;
            }

            const subject = encodeURIComponent(`Booking Inquiry: ${data.tour} - ${data.name} (${data.date})`);
            const body = encodeURIComponent(
`Dear Sahara Tourism Qatar Team,

I would like to book the following desert tour:

TOUR DETAILS:
- Package: ${data.tour}
- Preferred Date: ${data.date}
- Preferred Time: ${data.timeSlot}
- Guests: ${data.adults} Adult(s), ${data.kids} Child(ren)
- Activity Add-ons: ${data.addons}
- Estimated Total: QAR ${data.estimatedTotal}

GUEST CONTACT DETAILS:
- Full Name: ${data.name}
- WhatsApp / Phone: ${data.phone}
- Email: ${data.email}
- Doha Pickup Location: ${data.pickup}
- Special Notes / Dietary: ${data.notes}

Please email me back at ${data.email} or message me on WhatsApp ${data.phone} with booking confirmation.

Best regards,
${data.name}`
            );

            const mailtoUrl = `mailto:saharatourism1@gmail.com?subject=${subject}&body=${body}`;

            showSuccessNotice(`Opening your email client to send booking directly to saharatourism1@gmail.com. Our team will reply shortly!`);

            window.location.href = mailtoUrl;
        });
    }

    // Hero Quick Form Submission
    const heroQuickForm = document.getElementById('heroQuickForm');
    if (heroQuickForm) {
        heroQuickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tour = document.getElementById('heroTourSelect')?.value;
            const date = document.getElementById('heroTourDate')?.value;
            const guests = document.getElementById('heroTourGuests')?.value;
            const phone = document.getElementById('heroPhone')?.value.trim();

            const message = `Hello Sahara Tourism Qatar, I would like to inquire about booking:
Package: ${tour}
Date: ${date}
Guests: ${guests}
Phone/WhatsApp: ${phone || 'Please contact me'}

Can you share availability and price?`;

            const whatsappUrl = `https://wa.me/9746634677?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // 9. Quick Contact Form Handlers
    const contactSendWhatsApp = document.getElementById('contactSendWhatsApp');
    const quickContactForm = document.getElementById('quickContactForm');

    if (contactSendWhatsApp) {
        contactSendWhatsApp.addEventListener('click', () => {
            const name = document.getElementById('contactName')?.value.trim() || 'Traveler';
            const phone = document.getElementById('contactPhone')?.value.trim() || '';
            const email = document.getElementById('contactEmail')?.value.trim() || '';
            const msg = document.getElementById('contactMessage')?.value.trim() || 'Hello, I have an inquiry about Sahara Tourism Qatar tours.';

            const text = `*Inquiry for Sahara Tourism Qatar*
Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${msg}`;

            window.open(`https://wa.me/9746634677?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    if (quickContactForm) {
        quickContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName')?.value.trim() || 'Traveler';
            const phone = document.getElementById('contactPhone')?.value.trim() || '';
            const email = document.getElementById('contactEmail')?.value.trim() || '';
            const msg = document.getElementById('contactMessage')?.value.trim() || '';

            const subject = encodeURIComponent(`Sahara Tourism Qatar Inquiry from ${name}`);
            const body = encodeURIComponent(`From: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${msg}`);

            window.location.href = `mailto:saharatourism1@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // 10. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isHidden = answer.classList.contains('hidden');

            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
            document.querySelectorAll('.faq-question i').forEach(ic => ic.classList.remove('rotate-180'));

            // Toggle current
            if (isHidden) {
                answer.classList.remove('hidden');
                icon.classList.add('rotate-180');
            }
        });
    });

    // 11. Gallery Filter Logic
    const filterButtons = document.querySelectorAll('.gallery-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-amber-500', 'text-black');
                b.classList.add('bg-[#141C2B]', 'text-slate-300');
            });
            btn.classList.add('active', 'bg-amber-500', 'text-black');
            btn.classList.remove('bg-[#141C2B]', 'text-slate-300');

            // Filter cards
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Helper: Show Feedback Notice
    function showSuccessNotice(msg) {
        const notice = document.getElementById('bookingSuccessNotice');
        const details = document.getElementById('successDetails');
        if (notice && details) {
            details.textContent = msg;
            notice.classList.remove('hidden');
            notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});
