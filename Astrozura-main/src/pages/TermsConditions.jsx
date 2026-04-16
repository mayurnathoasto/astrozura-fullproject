import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1E3557]">
      <Navbar />
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4A73C]">Legal Documentation</p>
        <h1 className="mt-4 text-4xl font-black">Terms & Conditions</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
          Please read these terms carefully before using Astro Zura for astrology consultations, ritual bookings, subscriptions, and ecommerce orders.
        </p>

        <div className="mt-10 space-y-8">
          {[
            ["Definitions", "Astro Zura provides digital astrology services, ritual coordination workflows, and related spiritual support services through its online platforms."],
            ["Use of Service", "All services must be used for lawful, personal, and respectful purposes. Users are responsible for the accuracy of the information they provide."],
            ["User Accounts", "Users may create accounts to manage bookings, subscriptions, or purchase history. You are responsible for maintaining account confidentiality."],
            ["Bookings & Payments", "Consultation and ritual bookings are subject to confirmation, availability, pricing, and the delivery conditions shown at the time of purchase."],
            ["Cancellations & Refunds", "Refund or cancellation handling depends on the service category, preparation status, and any custom coordination already initiated for the devotee."],
            ["Intellectual Property", "All site content, branding, layouts, and service descriptions remain the property of Astro Zura and may not be reused without written permission."],
            ["Liability Limitation", "Astrology and ritual services are spiritual guidance services and should not be treated as legal, financial, or medical advice."],
            ["Governing Law", "These terms are governed by the applicable laws of India, and any disputes are subject to the competent local jurisdiction."],
          ].map(([title, text], index) => (
            <div key={title} className="rounded-3xl bg-white p-6 shadow-sm border border-[#efe4d2]">
              <p className="text-sm font-semibold text-[#D4A73C]">Clause {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-[#13294b] p-6 text-white">
          <h2 className="text-2xl font-bold">Need Clarification?</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            If you have questions about booking rules, service limitations, or legal language, use the contact support page and our team will clarify.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
