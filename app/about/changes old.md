"change the book a learning session" button to a "Start Up" button which when clicked opens up a bottom modal 5 multi-step form for them to register and pay.. using my learning page... i wish to create the 5 multi step registration form for people to register for programs in this page which i will tutor them or assign them a tutor, what should be in the steps and what are the actual information i should request and ask for,,,i want it like a true and real register course form and also a form where after registration they are assigned a learning user credentials to sign in, learn and track their learning and what they have learnt, lets no code yet give me your recommended update plan

Recommended Flow
I’d make this a five-step, mobile-friendly bottom sheet on phones and a centered dialog on larger screens. A clear button label like Enroll in this track or Start learning may explain the action better than “Start Up.” The selected track can be prefilled when someone opens the form from its details.

Choose a program: Track, delivery format, and preferred start window. Show the track’s duration and fee here.
Learner details: Full name, email, phone/WhatsApp, country, and time zone. If you accept minors, collect a parent or guardian’s contact and consent instead of asking for unnecessary personal details.
Goals and experience: Current skill level, relevant experience, what they want to achieve, and any learning preferences they’d like you to know. Make open-ended answers optional.
Availability and review: Preferred days and times, online or in-person preference if both are offered, and a review of their chosen program and payment plan. Include required agreement to your privacy, cancellation, and refund terms.
Payment: Show the final amount and whether it is full payment or an installment, then send them to Paystack checkout. Don’t collect card details in your form.

After Payment
Create the enrollment as pending payment before checkout, then mark it active only after Paystack confirms payment server-side. Once confirmed, create the learner account and email a time-limited link for them to set their own password. Don’t generate or email a password. Keep tutor assignment as a visible enrollment status, such as Awaiting tutor assignment, until you assign someone.

For the first learner dashboard, I’d keep progress practical: assigned track and tutor, upcoming sessions, modules or topics covered, completion status, and tutor notes or next steps. That gives learners a way to see what they’ve learned without requiring a full course-hosting platform on day one.

Implementation Order

Decide which tracks are open for enrollment, delivery options, start dates, and the exact full/deposit/installment amounts.
Add the registration sheet and save submissions as pending enrollments.
Connect enrollment-specific Paystack payments and verified payment status.
Add tutor assignment and learner account activation.
Build the learner login and basic progress dashboard.
One important integration detail: the existing Paystack flow is for services, not learning enrollments, and its callback currently redirects without recording an enrollment. Its displayed service deposit also differs from the amount calculated by the server. I’d resolve those payment rules as part of the enrollment work rather than reusing that amount logic as-is. No code changes made.


The Railway API now validates registration fields, saves enrollment records, and records payment attempts and verified payments. Next I’m adding the database tables and the Next.js proxy/Paystack path; I’m also checking the existing success page so the callback can send learners to a useful confirmation state rather than the services flow.

I’m continuing from the enrollment API work. The registration validator and payment endpoints are in place; next I’m adding their persistent schema and the Paystack confirmation path, then I’ll wire the five-step sheet to those endpoints.

The schema needs to preserve enough context for follow-up without collecting sensitive details: program, payment choice, goals, availability, format, and guardian contact only if the learner is under 18. I’m adding those fields with pending-payment/active states and explicit consent flags now.

The enrollment schema now stores registration details and required terms/privacy consent, with optional guardian information for minors; its syntax and database insert path validate. I’m now connecting Paystack’s verified callback to these enrollment/payment records, keeping the existing service-payment callback intact.

The callback now confirms learning payments only after Paystack’s server-side verification and sends them to the learning success path; existing service payments keep their current behavior. I’m adding the initialize branch next: it will fetch the enrollment from Railway, use Railway’s calculated deposit/full amount, and create a fresh payment reference before opening Paystack.

The payment initializer now ignores any client-sent price and asks the authenticated Railway service to prepare the amount from its shared track catalogue. I’m adding the public registration proxy, then I’ll build the modal to submit validated