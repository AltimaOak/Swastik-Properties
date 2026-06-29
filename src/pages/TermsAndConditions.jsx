import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UserCheck, ShieldAlert, Scale, HelpCircle } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-secondary/5 rounded-full text-secondary mb-4">
            <Scale size={40} />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-secondary mb-4 italic"
          >
            TERMS & <span className="text-primary font-black uppercase">CONDITIONS</span>
          </motion.h1>
          <p className="text-zinc-500 font-medium">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-zinc-100 shadow-premium space-y-10 text-zinc-600 leading-relaxed font-medium">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><FileText size={20} /></span>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the website of <strong>Swastik Properties</strong> ("we," "us," "our"), you agree to comply with and be bound by the following Terms & Conditions. If you do not agree with any part of these terms, you must not access or use this website or our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><UserCheck size={20} /></span>
              2. User Registration & Accounts
            </h2>
            <p>
              To access certain features of the Site (such as posting properties or saving favorites), you may need to register an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your password and login credentials.</li>
              <li>Promptly update your account details in case of changes.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><ShieldAlert size={20} /></span>
              3. Real Estate Listing Disclaimer
            </h2>
            <div className="bg-red-50/50 border border-secondary/10 p-6 rounded-2xl space-y-3">
              <p className="font-bold text-secondary">Crucial Listing Disclosures:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-zinc-700">
                <li>Swastik Properties is a real estate platform. Some listings are provided by independent agents and owners. We try our best to keep data accurate, but we do not guarantee the completeness, legality, or validity of any listing details (pricing, area, RERA registration, images, etc.).</li>
                <li><strong>Buyers are strongly advised</strong> to perform independent verification, visit the properties in person, and inspect valid government papers, RERA approvals, and certificates before making any financial transaction.</li>
                <li>We are not responsible for any transaction, negotiation, or dispute that takes place between buyers and agents/sellers.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><FileText size={20} /></span>
              4. Rules of Conduct
            </h2>
            <p>
              Users agree not to use the Site to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false, misleading, fraudulent, or inaccurate property information.</li>
              <li>Upload malicious code, spam, or advertise unrelated services.</li>
              <li>Infringe upon the intellectual property or privacy rights of any third party.</li>
              <li>Harass or abuse other users, buyers, or agents.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Scale size={20} /></span>
              5. Intellectual Property
            </h2>
            <p>
              All content on the Site, including text, designs, logo designs, icons, images, templates, and code, is the property of Swastik Properties or its content suppliers and is protected by Indian and international copyright laws. You may not copy, reproduce, or republish any part of this site without our prior written consent.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Scale size={20} /></span>
              6. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall Swastik Properties or its founders, employees, or partners be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this site, including but not limited to reliance on listing information, transaction disputes, or data loss.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Scale size={20} /></span>
              7. Governing Law
            </h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of India. Any legal action or dispute arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in Thane/Mumbai, Maharashtra.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4 pt-6 border-t border-zinc-100">
            <h2 className="text-2xl font-black text-secondary italic">
              Contact & Inquiries
            </h2>
            <p>
              For any questions regarding these Terms & Conditions, please contact us at:
            </p>
            <div className="space-y-2 text-zinc-700 bg-secondary/[0.02] border border-secondary/5 p-6 rounded-2xl">
              <p><strong>Swastik Properties</strong></p>
              <p>Shop no.4, D3, Unnathi Woods Phase 4, Kasarvadavali, Thane West, Thane, Maharashtra 400615</p>
              <p>MAHARERA Registration: A031332601288</p>
              <p>Phone: <a href="tel:+919987565490" className="text-secondary hover:underline">+91 99875 65490</a></p>
              <p>Email: <a href="mailto:swastik_prop@rediffmail.com" className="text-secondary hover:underline">swastik_prop@rediffmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
