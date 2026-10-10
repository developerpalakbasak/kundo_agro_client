"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/languageContext";

export function AboutClientContent() {
  const { language } = useLanguage();

  const services = [
    {
      icon: "🐄",
      title: "Livestock Solution",
      desc: "Comprehensive health, feed and management solutions for cattle, dairy and livestock farms.",
      accent: "from-amber-500/10 to-orange-500/5",
      borderHover: "hover:border-amber-300",
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      icon: "🐟",
      title: "Fisheries Solution",
      desc: "End-to-end aquaculture support, fingerlings, pond care, and water quality optimization.",
      accent: "from-cyan-500/10 to-blue-500/5",
      borderHover: "hover:border-cyan-300",
      iconBg: "bg-cyan-100 text-cyan-700",
    },
    {
      icon: "🌾",
      title: "Feed and Nutrition",
      desc: "Sole importer and supplier of premium human feed raw materials and high-yield animal feed.",
      accent: "from-emerald-500/10 to-green-500/5",
      borderHover: "hover:border-emerald-300",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: "💊",
      title: "Animal Health Products",
      desc: "Safe, authorized veterinary medicines, supplements and disease prevention chemicals.",
      accent: "from-rose-500/10 to-red-500/5",
      borderHover: "hover:border-rose-300",
      iconBg: "bg-rose-100 text-rose-700",
    },
    {
      icon: "🚜",
      title: "Farm Management",
      desc: "Consultancy and practical tools to increase harvest efficiency and reduce overall operational costs.",
      accent: "from-violet-500/10 to-purple-500/5",
      borderHover: "hover:border-violet-300",
      iconBg: "bg-violet-100 text-violet-700",
    },
    {
      icon: "⚙️",
      title: "Technical Support",
      desc: "Reliable technical solutions and professional support for the fisheries and livestock sectors.",
      accent: "from-teal-500/10 to-emerald-500/5",
      borderHover: "hover:border-teal-300",
      iconBg: "bg-teal-100 text-teal-700",
    },
  ];

  const importSegments = [
    {
      title: "DOOR TO DOOR BY ROAD CARGO",
      desc: "Handling shipments from India to Bangladesh with seamless trucking and cross-border transport.",
      icon: "🚛",
    },
    {
      title: "DOOR TO DOOR BY SEA CARGO",
      desc: "Ocean freight solutions from China and USA ports directly to Bangladesh maritime points.",
      icon: "🚢",
    },
    {
      title: "LC RECEIVE",
      desc: "Complete documentation, Letter of Credit support, and regulatory formalities carefully followed.",
      icon: "📄",
    },
    {
      title: "PAYMENT SUPPORT",
      desc: "Smooth financial processing, minimum extra expenses, and prompt trading support.",
      icon: "💳",
    },
  ];

  return (
    <div className="space-y-20 pb-24">
      {/* 1. Hero Banner with Brand Promise (Preserved Exact Design) */}
      <section className="relative overflow-hidden rounded-3xl mx-4 my-2 pt-16 pb-20 text-white shadow-xl border border-emerald-500/20">
        {/* Background Agro & Fisheries Image with Transparent Cinematic Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/about-hero.jpg"
            alt="Kundu Agro & Fisheries scenic agriculture and fish ponds"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Much lighter transparent overlay to keep image bright and visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-900/40 to-gray-950/50" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
            <span>COMPANY PROFILE</span>
            <span>•</span>
            <span>FOUNDED IN 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
            Kundu Agro &amp; Fisheries
          </h1>

          <p className="text-sm sm:text-base text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow font-medium">
            Welcome to Kundu Agro &amp; Fisheries import based company which was founded in 2026 according to the laws of Bangladesh. Our main focus is on importing &amp; Exporting quality goods for our clients world wide. Kundu Agro &amp; Fisheries is the best Import &amp; Export Company in Bangladesh. We proud to be a professional trading company in global markets.
          </p>

          {/* Brand Promise Badge */}
          <div className="pt-2">
            <span className="inline-block rounded-2xl bg-black/40 border border-emerald-400/50 px-6 py-2.5 text-sm sm:text-base font-extrabold text-emerald-200 shadow-md backdrop-blur-md">
              Brand Promise: ‘’we stand with Farmers.”
            </span>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-bold">
            <div className="rounded-xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/20 shadow-sm">
              🇧🇩 Licensed &amp; Legal Entity
            </div>
            <div className="rounded-xl bg-black/40 backdrop-blur-md px-4 py-2 border border-white/20 shadow-sm">
              🌍 India • China • USA
            </div>
            <div className="rounded-xl bg-emerald-600/60 backdrop-blur-md text-emerald-100 px-4 py-2 border border-emerald-400/40 shadow-sm">
              🤝 Zero Tolerance Quality
            </div>
          </div>
        </div>
      </section>

      {/* 2. ENHANCED Company Profile: Mission, Discipline & Trade Philosophy */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Mission Card with Modern Glass Gradient */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-gray-100 shadow-sm p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 group-hover:bg-emerald-100/70 transition-colors" />
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
                <span>🌐</span> Global Trade Vision
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Bridging the Gap Between World Factories &amp; Bangladesh
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our team believes in nurturing relationships and creating value for all customers. As one of the top import and export companies, we are committed to discipline and dedication.
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 via-emerald-50/40 to-transparent p-5 border border-emerald-100/80">
                <p className="text-sm text-emerald-950 font-medium leading-relaxed italic">
                  &ldquo;Our aim is to bridge the gap between the biggest factory of world (India &amp; China) &amp; one of the biggest consumer markets of the world&amp; (Bangladesh) &amp; provide a level of easy that the importer feels that he is just buying from his next door.&rdquo;
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We are a licensed &amp; legal entity that trades with great pride. We support &amp; respect our team members in order to promote positive environment. Our mission is to provide a hassle free business for our clients a best affordable. Our working styles very simple, best rate reliability &amp; performance.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
                <span className="text-emerald-600 font-extrabold">✓</span> Discipline &amp; Dedication
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
                <span className="text-emerald-600 font-extrabold">✓</span> Best Rate Reliability
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
                <span className="text-emerald-600 font-extrabold">✓</span> Positive Teamwork
              </span>
            </div>
          </div>

          {/* Core Commitments Card with Vibrant Accent */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-950 text-white p-8 sm:p-10 flex flex-col justify-between shadow-lg border border-emerald-800/40 relative overflow-hidden">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-white/10">
                <span>⚡</span> Service Excellence
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Zero Tolerance &amp; Prompt Commitment
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <p>
                  We assure you that our professional attitude ,prompt service, commitment to simple terms &amp; conditions will help your business multi-folds.
                </p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <p className="text-emerald-300 font-bold mb-1">Right Time • Right Place</p>
                  <p className="text-xs text-gray-200">
                    We are committed to provide our services at the right time at the right place with zero tolerance.
                  </p>
                </div>
                <p>
                  To achieve company growth, we will strive to bean effective, progressive, organization providing world-class services in the business segments and markets where we are active.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Guaranteed Growth</span>
                <span className="text-emerald-300 font-bold">World-Class Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ENHANCED Founder's Message: Executive Spotlight UI */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden p-8 sm:p-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Founder Portrait & Executive Card */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary to-emerald-400 opacity-30 blur-md group-hover:opacity-60 transition duration-500" />
                <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-100">
                  <Image
                    src="/founder-dabotosh.png"
                    alt="Dabotosh Kundu - Founder of Kundu Agro & Fisheries"
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>

              <div className="mt-5 text-center space-y-1">
                <div className="inline-block rounded-full bg-emerald-50 px-3 py-0.5 text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  Founder &amp; Director
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Dabotosh Kundu</h3>
                <p className="text-xs font-semibold text-primary">Kundu Agro &amp; Fisheries</p>
                <div className="pt-2 flex justify-center gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-primary" />
                  <span className="h-1.5 w-2 rounded-full bg-emerald-300" />
                </div>
              </div>
            </div>

            {/* Founder Message Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  <span>✍️</span> Founder&apos;s Message
                </div>
                <span className="text-xs text-gray-400 font-medium">Leadership Perspective</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                Building Lasting Business Partnerships on Quality &amp; Trust
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Kundu Agro &amp; Fisheries an import &amp; Export based company which is founded in 2026 according to the laws of Bangladesh. Our main focus is on importing quality goods for our clients worldwide. We are a team of young, experienced, dynamic individuals who have not just achieved new height in their respective careers but also knows tea dynamics, marketing sights, client man agreement &amp; sourcing knowledge. We are sole importer &amp; exporter of many human feed and animal feed products.
              </p>

              <div className="rounded-2xl bg-gray-50 border-l-4 border-primary p-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                &ldquo;We are able to present commodities at the lowest rate possible without compromising quality standards &amp; timeline. We always strive to build lasting business partnerships with our clients by offering the best value proposition for the trade. So, we are committed to bringing you the best available products, along with the highest standards of Quality at the optimum price.&rdquo;
              </div>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                We believe in maintaining long term healthy relationships with our esteemed customers by offering them unique high-quality products that why managing our customers are also an important part of our network. Please feel free to contact us with your requirements. Give us an opportunity to serve you at our best. We as sure youth at our professional attitude, prompt service, commitment to quality &amp; conditions will help you to grow your business easily.
              </p>

              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Prompt Service
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Optimum Price
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy Partnerships
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-semibold">Founder,</span>
                  <span className="text-base font-extrabold text-gray-900 block">Dabotosh Kundu</span>
                  <span className="text-xs text-primary font-semibold block">Kundu Agro &amp; Fisheries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENHANCED What We Do: Interactive Gradient Service Cards */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold text-primary">
            <span>🌾</span> WHAT WE DO
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Professional Solutions for Fisheries &amp; Livestock
          </h2>
          <div className="rounded-xl bg-gray-100 text-gray-600 px-4 py-1.5 text-xs font-semibold inline-block uppercase tracking-wider">
            WE PROVIDEPR OF ESSIONAL SERVICES IN THE FOLLOWING AREAS:
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Kundu Agro &amp; Fisheries Provide reliable Products, Technical Solution Professional Support for the fisheries and livestock sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className={`group rounded-3xl border border-gray-100 bg-white p-7 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${svc.borderHover}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${svc.accent} rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-500`} />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`h-14 w-14 rounded-2xl ${svc.iconBg} flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform`}>
                    {svc.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-300 group-hover:text-primary transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-50 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Certified Standard</span> <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Goal Banner with Floating Glow */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-emerald-100">
              Our Goal
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Empowering Farmers with Knowledge Quality Product and practical Solution.
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 pt-1">
              Providing holistic consultation, sustainable feeding practices, and round-the-clock technical guidance to elevate local aquaculture and dairy standards.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ENHANCED Import & Logistics Network: High-Tech Global Logistics UI */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 text-white p-8 sm:p-12 space-y-12 shadow-2xl border border-emerald-900/30">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-400/30">
              <span>✈️</span> INTERNATIONAL LOGISTICS &amp; TRADE
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Import &amp; Global Operations
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Our business activities are primarily regionally oriented. The operating structure is spanned across worldwide. Our major operations are into the following regional units:
            </p>
          </div>

          {/* Regional Country Cards with Dynamic Accents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 hover:bg-white/10 hover:border-emerald-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-4xl">🇮🇳</span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded-md">
                  Regional Unit
                </span>
              </div>
              <h4 className="text-lg font-bold text-white"> India</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Road cargo, seed cross-border freight forwarding, and prompt customs clearance to Bangladesh.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 hover:bg-white/10 hover:border-emerald-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-4xl">🇨🇳</span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded-md">
                  Regional Unit
                </span>
              </div>
              <h4 className="text-lg font-bold text-white"> China</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Direct sea cargo, industrial farm machinery, aquatic chemicals, and manufacturing raw materials.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-3 hover:bg-white/10 hover:border-emerald-400/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-4xl">🇺🇸</span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded-md">
                  Regional Unit
                </span>
              </div>
              <h4 className="text-lg font-bold text-white"> USA</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                High-protein nutritional concentrates, biotechnology supplements, and advanced feed additives.
              </p>
            </div>
          </div>

          {/* Subdivided Business Segments Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Secondary, the business activities are subdivided in to the following business segments:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {importSegments.map((seg, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 hover:border-emerald-400/50 hover:bg-emerald-950/40 transition-all"
                >
                  <div className="text-2xl">{seg.icon}</div>
                  <h4 className="text-xs font-bold text-emerald-200 tracking-wide">
                     {seg.title}
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {seg.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Narrative & Nationwide Network */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <p>
              Keeping in view Kundu Agro &amp; Fisheries has now expanded its operations and now also handling Shipments from India to Bangladesh, Chaina to Bangladesh. Kundu Agro &amp; Fisheries professionally to handles any kind of goods and offer the best logistics solution. With Kundu Agro &amp; Fisheries, your shipping needs are thoroughly and completely provided. We man age both Road and Sea. With better shipping services and better shipping rates, together with high quality customer services restassured your shipping is in good hands .Inquire now for your next shipment from India to Bangladesh. As such Kundu Agro &amp; Fisheries scan operate their import &amp; Export all the world etc.
            </p>
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <strong className="text-white block mb-1">Target Sectors:</strong>
                We offer services to Government Contractor, Private Sector Contractor, Public/ Private organization of non-Governmental Organization (NGO), E-commerce Business Sector, Corporate Sector, Local Sectors etc.
              </div>
              <div>
                <strong className="text-white block mb-1">Nationwide Freight:</strong>
                We can arrange transport to most cities including Dhaka and also Out side of ANYPLACE OF Bangladesh. We can arrange a complete freight solution from any point of origin through our worldwide network.
              </div>
            </div>
            <p className="text-xs text-gray-400">
              The formalities for each have to be followed carefully to ensure smooth processing and minimum extra expenses.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-xl bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 text-xs font-bold border border-emerald-400/30">
                Fast Solutions
              </span>
              <span className="rounded-xl bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 text-xs font-bold border border-emerald-400/30">
                Reliable Products
              </span>
              <span className="rounded-xl bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 text-xs font-bold border border-emerald-400/30">
                Technical Support
              </span>
            </div>
            <p className="italic text-emerald-300 pt-2 border-t border-white/10">
              Hop fully you will give us achance to serve our company and the service we provide in a best manner.
            </p>
          </div>
        </div>
      </section>

      {/* 6. ENHANCED Contact Us / Head Office Card UI */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/60 border border-emerald-100 shadow-sm p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Contact Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-800">
                <span>📍</span> HEAD OFFICE
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Contact Us
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  We welcome inquiries from Governmental organizations ,NGO’s, Trading companies ,Agents and individuals.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-primary/30 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    🏢
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Head Office Address</h4>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      Panchbibi Road, Joypurhat Sadar Joypurhat-5900, Bangladesh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-primary/30 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    📞
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Direct Phone</h4>
                    <a
                      href="tel:01713747714"
                      className="text-base font-extrabold text-primary hover:underline mt-0.5 block"
                    >
                      01713747714
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-primary/30 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Email</h4>
                    <a
                      href="mailto:dabotoshkundu.bappa@gmail.com"
                      className="text-sm font-semibold text-gray-800 hover:text-primary hover:underline mt-0.5 block break-all"
                    >
                      dabotoshkundu.bappa@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-sm border border-emerald-100 space-y-5">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-4xl shadow-md text-white">
                  🌾
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Ready to Grow Together?
                </h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Connect with our team today for imports, aquaculture seeds, feeds, or trade inquiries.
                </p>
              </div>

              <div className="w-full space-y-2.5 pt-2">
                <a
                  href="tel:01713747714"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-primary/90 hover:scale-[1.01] transition-all"
                >
                  <span>📞</span> Call Us Directly
                </a>
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all"
                >
                  <span>🛒</span> Browse Store Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
