import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bhagwat from "../assets/bhagwat.png";
import astro1 from "../assets/astro1.png";
import astro2 from "../assets/astro2.png";
import astro3 from "../assets/astro3.png";

const pillars = [
  { title: "Authentic Traditions", text: "We work with Vedic practitioners and structured ritual workflows rooted in traditional practice." },
  { title: "Purity & Simplicity", text: "Every service is designed to be clear, respectful, and practical for modern devotees." },
  { title: "Vedic Excellence", text: "From astrology to rituals, our approach focuses on accuracy, clarity, and verified coordination." },
];

const priests = [
  { name: "Acharya Raghuram", specialty: "Temple rituals and vastu ceremonies", image: astro1 },
  { name: "Pt. Vishwanathan", specialty: "Vedic puja coordination and mantra recitation", image: astro2 },
  { name: "Varnasi Dayanand", specialty: "Anusthan guidance and spiritual consultations", image: astro3 },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1E3557]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center rounded-[32px] bg-[#13294b] p-8 md:p-12 text-white overflow-hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4A73C]">About Astro Zura</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-black leading-tight">Guiding Your Divine Journey</h1>
            <p className="mt-5 max-w-xl text-sm md:text-base leading-7 text-slate-200">
              Astro Zura connects devotees with authentic astrology guidance, ritual coordination, and practical spiritual support for modern life.
            </p>
            <a href="#timeline" className="mt-6 inline-flex rounded-xl bg-[#D4A73C] px-5 py-3 text-sm font-bold text-[#1E3557]">Our Journey</a>
          </div>

          <img src={bhagwat} alt="Astro Zura" className="h-[320px] w-full rounded-[28px] object-cover" />
        </div>

        <section className="py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4A73C]">Our Core Values</p>
          <h2 className="mt-3 text-3xl font-black">Rooted in Vedic Excellence</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm border border-[#efe4d2]">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="timeline" className="py-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4A73C]">Milestones</p>
            <h2 className="mt-3 text-3xl font-black">Our Sacred Timeline</h2>
          </div>
          <div className="mt-12 max-w-3xl mx-auto space-y-6">
            {[
              "The humble beginning of Astro Zura with devotion-first astrology support.",
              "Temple and priest coordination systems were formalized for rituals and anusthan delivery.",
              "A shared platform was launched for astrology, panchang, remedies, and rituals.",
            ].map((item, index) => (
              <div key={index} className="rounded-3xl bg-white p-5 shadow-sm border border-[#efe4d2]">
                <p className="text-sm font-semibold text-[#D4A73C]">Phase {index + 1}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4A73C]">Our Team</p>
          <h2 className="mt-3 text-3xl font-black">Meet Our Venerable Priests</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {priests.map((priest) => (
              <div key={priest.name} className="rounded-3xl bg-white p-6 shadow-sm border border-[#efe4d2]">
                <img src={priest.image} alt={priest.name} className="h-20 w-20 rounded-full object-cover mx-auto" />
                <h3 className="mt-4 text-xl font-bold">{priest.name}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-6">{priest.specialty}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-[#13294b] px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-black">Begin Your Spiritual Consultation Today</h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm leading-6 text-slate-200">
            Whether you seek astrology guidance, ritual booking, or personalized spiritual support, our team is ready to help.
          </p>
          <a href="/astrologers" className="mt-6 inline-flex rounded-xl bg-[#D4A73C] px-5 py-3 text-sm font-bold text-[#1E3557]">Book a Consultation</a>
        </section>
      </section>

      <Footer />
    </div>
  );
}
