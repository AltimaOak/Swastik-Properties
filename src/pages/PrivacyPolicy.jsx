import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFDFD]">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-secondary/5 rounded-full text-secondary mb-4">
            <Shield size={40} />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-secondary mb-4 italic"
          >
            PRIVACY <span className="text-primary font-black uppercase">POLICY</span>
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
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>Swastik Properties</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy or our practices with regards to your personal information, please contact us at <a href="mailto:swastik_prop@rediffmail.com" className="text-secondary hover:underline font-bold">swastik_prop@rediffmail.com</a>.
            </p>
            <p>
              When you visit our website (the "Site") and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy. We seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Eye size={20} /></span>
              2. Information We Collect
            </h2>
            <p>
              We collect personal information that you voluntarily provide to us when registering on the Site (as an Agent or Buyer), expressing an interest in obtaining information about us or our properties, or otherwise contacting us.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and password credentials.</li>
              <li><strong>Listing Data:</strong> If you are an agent, we collect property details, pricing, images, and description details you upload.</li>
              <li><strong>Automatically Collected Data:</strong> When you visit our website, we automatically collect certain information such as your IP address, browser characteristics, operating system, and device details via cookies and tracking technologies.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><RefreshCw size={20} /></span>
              3. Google AdSense & Third-Party Advertising
            </h2>
            <p>
              We use third-party advertising companies, including Google, to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl space-y-3">
              <p className="font-bold text-zinc-800">Please note the following disclosures required by Google:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-zinc-600">
                <li>Google, as a third-party vendor, uses cookies to serve ads on your site.</li>
                <li>Google's use of the DoubleClick cookie enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-bold">Google Ads Settings</a>.</li>
                <li>You can also opt out of third-party vendor's use of cookies for interest-based advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-bold">www.aboutads.info</a>.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Lock size={20} /></span>
              4. How We Use and Share Information
            </h2>
            <p>
              We use personal information collected via our Site for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To post and display real estate listings (for Agents).</li>
              <li>To allow communication between Buyers and Agents regarding listings.</li>
              <li>To monitor site analytics, improve performance, and protect the security of our platform.</li>
            </ul>
            <p>
              We do not share, sell, rent, or trade any of your personal information with third parties for their promotional purposes. We may share contact information between registered Buyers and Agents to facilitate property inquiries.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Shield size={20} /></span>
              5. Data Security & Retention
            </h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-secondary flex items-center gap-3 italic">
              <span className="p-1.5 bg-secondary/5 rounded-lg"><Shield size={20} /></span>
              6. Your Privacy Rights
            </h2>
            <p>
              You have the right to access, update, correct, or delete your personal information. If you wish to delete your account or modify any information, you may do so directly from your dashboard or contact us using the details below.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4 pt-6 border-t border-zinc-100">
            <h2 className="text-2xl font-black text-secondary italic">
              Contact Us
            </h2>
            <p>
              If you have questions or comments about this policy, you may contact us at:
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

export default PrivacyPolicy;
