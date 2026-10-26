import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileText, Printer, Mail, X, Sparkles } from "lucide-react";
import { push, ref, set, get, child } from "firebase/database";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import emailjs from "@emailjs/browser";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  state: "",
  city: "",
  area: "",
  customArea: "",
  married: "",
  wifeName: "",
  children: "",
  budgetMin: "",
  budgetMax: "",
  parent: "",
  companyName: "",
  jobRole: "",
  experience: "",
  jobLocation: "",
  enquiryType: "",
  propertyType: "",
  bhk: "",
  possession: "",
  furnished: "",
  parking: "",
  message: "",
};

const MAX_BUDGET = 10000000;

export default function ClientProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { currentUser, userData, loading: authLoading } = useAuth();

  const selectedProperty = state?.property || null;
  const prefillName = state?.prefillName || state?.name || "";
  const prefillEmail = state?.prefillEmail || state?.email || "";
  const prefillPhone = state?.prefillPhone || "";

  const selectedPropertyType =
    selectedProperty?.propertyType ||
    selectedProperty?.type ||
    "Flat";

  const safePropertyType =
    selectedPropertyType === "Shop"
      ? "Shop"
      : "Flat";

  const selectedBhk =
    safePropertyType === "Flat"
      ? selectedProperty?.bhk || ""
      : "";

  const locationAreas = {
    Thane: [
      "Kasarvadavali",
      "Ghodbunder Road",
      "Hiranandani Estate",
      "Kolshet",
      "Majiwada",
      "Manpada",
      "Panch Pakhadi",
      "Vartak Nagar",
      "Other",
    ],
    Mumbai: [
      "Andheri",
      "Bandra",
      "Borivali",
      "Dadar",
      "Goregaon",
      "Kandivali",
      "Malad",
      "Powai",
      "Other",
    ],
    "Navi Mumbai": [
      "Airoli",
      "Belapur",
      "Ghansoli",
      "Kharghar",
      "Nerul",
      "Panvel",
      "Vashi",
      "Other",
    ],
  };

  const initialName =
    prefillName ||
    (userData?.name && userData.name !== 'Agent' ? userData.name : '') ||
    (currentUser?.displayName && currentUser.displayName !== 'Agent' ? currentUser.displayName : '');

  const initialEmail =
    prefillEmail ||
    currentUser?.email ||
    "";

  const [form, setForm] = useState({
    ...initialForm,

    name:
      initialName,

    phone:
      prefillPhone || userData?.phone || "",

    email:
      initialEmail,

    propertyType:
      safePropertyType,

    bhk:
      selectedBhk,
  });

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const [submittedData, setSubmittedData] =
    useState(null);

  const [showLetterheadModal, setShowLetterheadModal] =
    useState(false);

  const [emailStatus, setEmailStatus] =
    useState("idle");

  const [emailErrorMsg, setEmailErrorMsg] =
    useState("");

  // Keep form name and email synced with authenticated account
  useEffect(() => {
    // 1. Direct state prefill takes highest precedence
    if (state?.prefillName || state?.prefillEmail || state?.prefillPhone) {
      setForm((prev) => ({
        ...prev,
        name: state.prefillName || prev.name,
        email: prev.email || state.prefillEmail || "",
        phone: prev.phone || state.prefillPhone || ""
      }));
    }

    if (currentUser) {
      const bestName =
        state?.prefillName ||
        (userData?.name && userData.name !== 'Agent' ? userData.name : '') ||
        (currentUser.displayName && currentUser.displayName !== 'Agent' ? currentUser.displayName : '');

      setForm((prev) => {
        const needsName = !prev.name || prev.name === 'Agent';
        const needsEmail = !prev.email;

        if (!needsName && !needsEmail) return prev;

        return {
          ...prev,
          name: needsName ? (bestName || prev.name) : prev.name,
          email: needsEmail ? (currentUser.email || prev.email) : prev.email,
          phone: prev.phone || userData?.phone || ""
        };
      });

      // 2. Extra safety: direct fetch from RTDB in case userData hasn't synchronized yet
      if (!bestName || !userData?.phone) {
        const userDbRef = child(ref(db), `users/${currentUser.uid}`);
        get(userDbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            setForm((prev) => ({
              ...prev,
              name: (!prev.name || prev.name === 'Agent') && val?.name && val.name !== 'Agent'
                ? val.name
                : prev.name,
              email: !prev.email ? (val?.email || currentUser.email) : prev.email,
              phone: prev.phone || val?.phone || ""
            }));
          }
        }).catch((err) => console.warn("Failed to fetch user record for name:", err));
      }
    }
  }, [currentUser, userData, state]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="client-profile-page flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-100 border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary font-bold text-xs uppercase tracking-widest">Verifying Account...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, prompt for sign up first
  if (!currentUser) {
    return <Navigate to="/signup?redirect=/client-profile" replace state={state} />;
  }

  const isFlat =
    form.propertyType === "Flat";

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => {



      if (name === "propertyType") {
        return {
          ...previous,

          propertyType: value,

          bhk:
            value === "Flat"
              ? previous.bhk || "2 BHK"
              : "",
        };
      }

      if (name === "state") {
        return {
          ...previous,
          state: value,
          city: "",
          area: "",
          customArea: "",
        };
      }

      if (name === "city") {
        return {
          ...previous,
          city: value,
          area: "",
          customArea: "",
        };
      }

      if (name === "area") {
        return {
          ...previous,
          area: value,
          customArea: "",
        };
      }

      if (name === "married" && value !== "Yes") {
        return {
          ...previous,
          married: value,
          wifeName: "",
          children: "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };



  const cleanPhone = (phone) => {
    let number = String(phone || "")
      .replace(/\D/g, "");

    if (
      number.length === 12 &&
      number.startsWith("91")
    ) {
      number =
        number.substring(2);
    }

    return number;
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const phone =
      cleanPhone(form.phone);

    /* Phone validation */

    if (
      !/^[6-9]\d{9}$/.test(phone)
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (
      form.budgetMin &&
      form.budgetMax &&
      Number(form.budgetMax) < Number(form.budgetMin)
    ) {
      setError("Maximum budget must be greater than or equal to the minimum budget.");
      return;
    }

    if (
      Number(form.budgetMin || 0) > MAX_BUDGET ||
      Number(form.budgetMax || 0) > MAX_BUDGET
    ) {
      setError("Budget must be between ₹0 and ₹1 crore.");
      return;
    }

    /* Name validation */

    if (
      form.name.trim().length < 2
    ) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    /* Requirement validation */

    if (!form.enquiryType) {
      setError(
        "Please select what you are looking to do."
      );

      return;
    }

    /* Property type validation */

    if (!form.propertyType) {
      setError(
        "Please select a property type."
      );

      return;
    }

    setLoading(true);

    try {
      const enquiryRef = push(ref(db, "inquiries"));
      const referenceId = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
      const submissionDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const preferredLocationStr = [
        form.area === "Other" ? form.customArea.trim() : form.area,
        form.city,
        form.state,
      ].filter(Boolean).join(", ");

      const budgetDisplayStr = form.budgetMin || form.budgetMax
        ? `₹${form.budgetMin || "0"} - ₹${form.budgetMax || "Open"}`
        : "Flexible / Open";

      const enquiryPayload = {
        referenceId,
        /* =========================
           PERSONAL INFORMATION
        ========================= */
        name: form.name.trim(),
        phone,
        email: form.email.trim(),
        state: form.state,
        city: form.city,
        area: form.area === "Other" ? form.customArea.trim() : form.area,
        married: form.married,
        wifeName: form.married === "Yes" ? form.wifeName.trim() : "",
        children: form.married === "Yes" ? form.children.trim() : "",
        parent: form.parent.trim(),
        companyName: form.companyName.trim(),
        jobRole: form.jobRole.trim(),
        experience: form.experience.trim(),
        jobLocation: form.jobLocation.trim(),
        enquiryType: form.enquiryType,
        propertyType: form.propertyType,
        bhk: isFlat ? form.bhk : "",
        preferredLocation: preferredLocationStr,
        budget: form.budgetMin || form.budgetMax
          ? `${form.budgetMin || "0"} - ${form.budgetMax || "No maximum"}`
          : "",
        budgetRange: {
          minimum: form.budgetMin,
          maximum: form.budgetMax,
        },
        possession: form.possession,
        furnished: form.furnished,
        parking: form.parking,
        message: form.message.trim(),
        propertyId: selectedProperty?.id || null,
        propertyTitle: selectedProperty?.title || null,
        propertyLocation: selectedProperty?.location || null,
        propertyPrice: selectedProperty?.price || null,
        userId: currentUser?.uid || null,
        buyerId: currentUser?.uid || null,
        userEmail: currentUser?.email || form.email.trim(),
        userRole: userData?.role || "buyer",
        status: "new",
        source: "website-profile",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await set(enquiryRef, enquiryPayload);

      // Formatted Letterhead text message for EmailJS
      const letterheadTextMessage = `
================================================================
                    SWASTIK PROPERTIES
                   BUY  |  SELL  |  RENT
       EMAIL: swastik_prop@rediffmail.com
       WEB: www.swastik-properties.co.in
       MAHARERA Reg. No.: A031332601288
================================================================

ACKNOWLEDGEMENT OF CLIENT PROFILE & PROPERTY ENQUIRY
Reference ID: ${referenceId}
Date: ${submissionDate}

To,
${form.name.trim()}
Email: ${form.email.trim()}
Phone: ${phone}
Location: ${preferredLocationStr || "Thane / Mumbai"}

Subject: Acknowledgement for Client Profile Creation & Property Requirement Registration

Dear ${form.name.trim()},

We, at Swastik Properties, would like to express our sincere appreciation for creating your Client Profile and submitting your property requirement enquiry on our official website.

Your requirements have been successfully registered in our verified client database. Below is the summary of your registered specifications:

----------------------------------------------------------------
REGISTERED REQUIREMENT SUMMARY:
----------------------------------------------------------------
• Reference No: ${referenceId}
• Client Name: ${form.name.trim()}
• Mobile Number: ${phone}
• Email Address: ${form.email.trim()}
• Enquiry Type: ${form.enquiryType || 'General Requirement'}
• Property Type: ${form.propertyType || 'Flat'}${isFlat && form.bhk ? ` (${form.bhk})` : ''}
• Preferred Location: ${preferredLocationStr || 'Flexible'}
• Budget Range: ${budgetDisplayStr}
• Possession: ${form.possession || 'Flexible'}
• Furnishing: ${form.furnished || 'Any'}
• Parking: ${form.parking || 'Any'}
${form.message.trim() ? `• Specific Requirement: ${form.message.trim()}\n` : ''}----------------------------------------------------------------

Our dedicated property consultant will review your specifications and contact you shortly with verified, tailored properties matching your requirements.

We particularly appreciate your trust in Swastik Properties and look forward to assisting you in finding the ideal property.

With sincere appreciation,

Swastik Properties
MAHARERA Reg. No.: A031332601288
Place: Thane, Maharashtra
Authorized Signature

================================================================
                  BUY  |  SELL  |  RENT
    Swastik Properties | MAHARERA Reg. No.: A031332601288
================================================================
`.trim();

      // Dispatch Email via EmailJS on behalf of Swastik Properties
      const templateParams = {
        // Common recipient variables
        to_email: form.email.trim(),
        email: form.email.trim(),
        user_email: form.email.trim(),
        client_email: form.email.trim(),
        recipient_email: form.email.trim(),

        // Recipient name variables
        to_name: form.name.trim(),
        name: form.name.trim(),
        client_name: form.name.trim(),
        user_name: form.name.trim(),

        // Sender & Reply
        from_name: 'Swastik Properties',
        from_email: 'swastik_prop@rediffmail.com',
        reply_to: 'swastik_prop@rediffmail.com',

        // Subject & Content
        subject: `Acknowledgement: Client Profile & Property Enquiry (${referenceId}) - Swastik Properties`,
        message: letterheadTextMessage,
        content: letterheadTextMessage,
        html_message: letterheadTextMessage,

        // Profile specific fields
        client_phone: phone,
        phone: phone,
        reference_id: referenceId,
        date: submissionDate,
        enquiry_type: form.enquiryType || 'Requirement',
        property_type: form.propertyType || 'Flat',
        bhk: isFlat ? form.bhk : 'N/A',
        location: preferredLocationStr || 'Not specified',
        budget: budgetDisplayStr,
        possession: form.possession || 'Flexible',
      };

      try {
        const emailResponse = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id',
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
        );
        console.log("EmailJS Acknowledgement Sent:", emailResponse.status, emailResponse.text);
        setEmailStatus("sent");
        setEmailErrorMsg("");
      } catch (emailErr) {
        console.warn("Acknowledgement email dispatch notice:", emailErr);
        setEmailStatus("failed");
        const errMsg = emailErr?.text || emailErr?.message || "Email service unavailable";
        setEmailErrorMsg(errMsg);
      }

      setSubmittedData({
        ...enquiryPayload,
        budgetDisplay: budgetDisplayStr,
        submissionDate,
      });

      setSubmitted(true);

    } catch (submitError) {

      console.error(
        "Client profile submission error:",
        submitError
      );

      setError(
        "We could not submit your profile. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  if (submitted) {
    return (
      <div className="client-profile-page">

        <div className="profile-success-card">

          <div className="profile-success-icon">
            <CheckCircle2 size={42} />
          </div>

          <p className="profile-eyebrow">
            SWASTIK PROPERTIES
          </p>

          <h1>
            Profile & Enquiry Submitted
          </h1>

          <p>
            Thank you, <strong>{submittedData?.name || form.name || "valued client"}</strong>, for sharing your
            property requirements with Swastik Properties.
            Our consultant will review your specifications and contact you shortly.
          </p>

          {/* Email / Letterhead Confirmation Notice */}
          {emailStatus === "sent" ? (
            <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                  Official Acknowledgement Email Dispatched
                </p>
                <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                  An acknowledgement letter on official <strong>Swastik Properties</strong> letterhead has been emailed to <strong>{form.email}</strong>.
                </p>
                <p className="text-[11px] text-emerald-600/80 mt-1">
                  (Note: Please check your Spam / Junk folder or Promotions tab if not seen in your Primary inbox.)
                </p>
              </div>
            </div>
          ) : (
            <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Enquiry Registered • Official Letterhead Generated
                </p>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Your requirements are registered in our database. Click below to view, print, or save your official <strong>Swastik Properties</strong> letterhead acknowledgement right now.
                </p>
                {emailErrorMsg && (
                  <p className="text-[11px] text-amber-700 mt-1 font-mono bg-amber-100/70 px-2 py-1 rounded inline-block">
                    Notice: {emailErrorMsg}
                  </p>
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            <button
              type="button"
              className="profile-primary-button flex items-center justify-center gap-2"
              onClick={() => setShowLetterheadModal(true)}
            >
              <FileText size={16} />
              View / Print Official Letterhead
            </button>

            <button
              type="button"
              className="profile-primary-button"
              style={{ background: '#7B1113', color: '#ffffff', boxShadow: 'none' }}
              onClick={() =>
                navigate(userData?.role === 'agent' ? "/dashboard/agent" : "/dashboard/buyer")
              }
            >
              Go to Dashboard
            </button>

            <button
              type="button"
              className="profile-primary-button"
              style={{ background: '#f4f4f5', color: '#18181b', boxShadow: 'none' }}
              onClick={() =>
                navigate("/")
              }
            >
              Back to Website
            </button>
          </div>

        </div>

        {/* =========================================================
           OFFICIAL SWASTIK PROPERTIES LETTERHEAD MODAL
        ========================================================= */}
        {showLetterheadModal && submittedData && (
          <div className="letterhead-modal-backdrop" onClick={() => setShowLetterheadModal(false)}>
            <div 
              className="letterhead-modal-content" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Control Bar (Excluded from Print) */}
              <div className="no-print flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#7B1113]" />
                  <span className="font-bold text-sm text-zinc-800">
                    Swastik Properties Official Letterhead
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7B1113] text-white rounded-xl text-xs font-bold hover:bg-red-950 transition shadow-sm cursor-pointer"
                  >
                    <Printer size={15} /> Print / Save PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLetterheadModal(false)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200 transition cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Printable Letterhead Paper Sheet */}
              <div className="printable-letterhead-card p-8 md:p-12 bg-white text-zinc-800 font-sans">
                {/* Header matching provided document */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.png" 
                      alt="Swastik Properties Logo" 
                      className="h-16 md:h-20 w-auto object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <h1 className="text-xl md:text-2xl font-black text-[#7B1113] tracking-wider uppercase font-serif">
                        SWASTIK
                      </h1>
                      <p className="text-[10px] tracking-[0.3em] font-black text-zinc-500 uppercase -mt-1">
                        — PROPERTIES —
                      </p>
                      <p className="text-[10px] tracking-[0.25em] font-black text-[#C59B27] uppercase mt-0.5">
                        BUY | SELL | RENT
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right text-xs text-zinc-600 space-y-1 font-medium">
                    <div>
                      <span className="font-black text-[#7B1113] tracking-widest text-[10px] uppercase mr-2">EMAIL</span>
                      <a href="mailto:swastik_prop@rediffmail.com" className="text-zinc-700 hover:underline">
                        swastik_prop@rediffmail.com
                      </a>
                    </div>
                    <div>
                      <span className="font-black text-[#7B1113] tracking-widest text-[10px] uppercase mr-2">WEB</span>
                      <a href="https://www.swastik-properties.co.in" target="_blank" rel="noreferrer" className="text-zinc-700 hover:underline">
                        www.swastik-properties.co.in
                      </a>
                    </div>
                  </div>
                </div>

                {/* Double colored accent line (Maroon + Gold) */}
                <div className="my-6">
                  <div className="h-1 bg-[#7B1113] w-full"></div>
                  <div className="h-0.5 bg-[#C59B27] w-full mt-0.5"></div>
                </div>

                {/* Document Title */}
                <div className="text-center my-6">
                  <h2 className="text-base md:text-lg font-black text-zinc-900 tracking-wider uppercase">
                    LETTER OF ACKNOWLEDGEMENT
                  </h2>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Client Profile & Property Enquiry Registration
                  </p>
                </div>

                {/* Reference ID & Date bar */}
                <div className="flex justify-between items-center text-xs text-zinc-500 mb-6 pb-2 border-b border-zinc-100">
                  <span>Ref No: <strong className="text-zinc-900">{submittedData.referenceId}</strong></span>
                  <span>Date: <strong className="text-zinc-900">{submittedData.submissionDate}</strong></span>
                </div>

                {/* Recipient Details */}
                <div className="text-xs md:text-sm text-zinc-700 space-y-1 mb-6">
                  <p className="font-bold text-zinc-900">To,</p>
                  <p className="font-black text-zinc-900 text-base">{submittedData.name}</p>
                  <p><span className="text-zinc-500">Mobile:</span> {submittedData.phone}</p>
                  <p><span className="text-zinc-500">Email:</span> {submittedData.email}</p>
                  {submittedData.preferredLocation && (
                    <p><span className="text-zinc-500">Location:</span> {submittedData.preferredLocation}</p>
                  )}
                </div>

                {/* Subject */}
                <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-lg text-xs md:text-sm font-bold text-zinc-900 mb-6">
                  Subject: Acknowledgement for Client Profile Creation & Property Requirement Registration
                </div>

                {/* Salutation & Body matching the letterhead in image */}
                <div className="text-xs md:text-sm text-zinc-700 leading-relaxed space-y-3.5">
                  <p>Dear <strong>{submittedData.name}</strong>,</p>

                  <p>
                    We, at <strong>Swastik Properties</strong>, would like to express our sincere appreciation for creating your Client Profile and submitting your property requirement enquiry on our official website.
                  </p>

                  <p>
                    The requirements you have shared have been successfully registered in our verified client database. Our dedicated property consultants are reviewing your preferences and will reach out to you shortly with verified, high-matching options that effectively represent the standards and quality of <strong>Swastik Properties</strong>.
                  </p>

                  {/* Registered Requirement Summary Box */}
                  <div className="my-5 bg-zinc-50/80 rounded-xl p-4 md:p-5 border border-zinc-200">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#7B1113] mb-3 pb-1.5 border-b border-zinc-200">
                      Registered Requirement Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                      <div>
                        <span className="text-zinc-500 font-medium">Reference ID:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.referenceId}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Enquiry Type:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.enquiryType || 'General Enquiry'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Property Type:</span>{' '}
                        <strong className="text-zinc-900">
                          {submittedData.propertyType} {submittedData.bhk ? `(${submittedData.bhk})` : ''}
                        </strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Preferred Location:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.preferredLocation || 'Thane / Mumbai'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Budget Range:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.budgetDisplay}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Possession Status:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.possession || 'Flexible'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Furnishing Status:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.furnished || 'Any'}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-medium">Parking Requirement:</span>{' '}
                        <strong className="text-zinc-900">{submittedData.parking || 'Any'}</strong>
                      </div>
                    </div>
                    {submittedData.message && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-200 text-xs">
                        <span className="text-zinc-500 font-medium">Client Note:</span>{' '}
                        <span className="text-zinc-800 italic">"{submittedData.message}"</span>
                      </div>
                    )}
                  </div>

                  <p>
                    We particularly appreciate your trust in Swastik Properties and assure you of our complete commitment, transparency, and assistance throughout your property search process.
                  </p>

                  <p>
                    For any immediate assistance or enquiries, feel free to contact our team at <strong>swastik_prop@rediffmail.com</strong> or visit <strong>www.swastik-properties.co.in</strong>.
                  </p>
                </div>

                {/* Sign-off section */}
                <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs md:text-sm text-zinc-700">
                  <div>
                    <p className="font-semibold text-zinc-800">With sincere appreciation,</p>
                    <p className="font-black text-[#7B1113] text-base mt-1">Swastik Properties</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      MAHARERA Reg. No.: <strong className="text-zinc-700">A031332601288</strong>
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Place: <strong>Thane, Maharashtra</strong>
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="h-10 border-b border-dashed border-zinc-400 w-44 mb-1 mx-auto sm:ml-auto"></div>
                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                      Authorized Signature
                    </p>
                  </div>
                </div>

                {/* Footer matching PDF */}
                <div className="mt-10 pt-4 border-t-2 border-zinc-200 text-center">
                  <p className="text-xs font-black tracking-[0.3em] text-zinc-800 uppercase">
                    BUY  |  SELL  |  RENT
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Swastik Properties | MAHARERA Reg. No.: A031332601288
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }



  return (
    <div className="client-profile-page">

      <div className="client-profile-container">

        {/* =================================
            BACK
        ================================= */}

        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="profile-back-button"
        >
          <ArrowLeft size={17} />
          Back to website
        </button>

        {/* =================================
            HEADER
        ================================= */}

        <div className="client-profile-header">

          <p className="profile-eyebrow">
            SWASTIK PROPERTIES
          </p>

          <h1>
            Enquiry Form
          </h1>

          <p>
            Tell us about your requirement and
            we'll help you find properties that
            suit your needs.
          </p>

        </div>

        {/* =================================
            SELECTED PROPERTY
        ================================= */}

        {selectedProperty && (
          <div className="profile-selected-property">

            <div>

              <span>
                YOU'RE ENQUIRING ABOUT
              </span>

              <strong>
                {selectedProperty.title ||
                  "Selected Property"}
              </strong>

              {selectedProperty.location && (
                <small>
                  {selectedProperty.location}
                </small>
              )}

            </div>

          </div>
        )}

        {/* =================================
            PROFILE FORM
        ================================= */}

        <form
          className="client-profile-card"
          onSubmit={handleSubmit}
        >

          {/* =================================
              PERSONAL INFORMATION
          ================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div className="profile-section-number">
                01
              </div>

              <div>

                <h2>
                  Personal Information
                </h2>

                <p>
                  {currentUser?.email ? (
                    <span>
                      Logged in as <strong>{currentUser.email}</strong>. Details pre-filled from your account.
                    </span>
                  ) : (
                    "Tell us how we can contact you."
                  )}
                </p>

              </div>

            </div>

            <div className="profile-form-grid">

              {/* Full Name */}

              <div className="profile-field">

                <label htmlFor="client-name">
                  Full Name *
                </label>

                <input
                  id="client-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />

              </div>

              {/* Mobile */}

              <div className="profile-field">

                <label htmlFor="client-phone">
                  Mobile Number *
                </label>

                <input
                  id="client-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={13}
                  required
                />

              </div>

              {/* Email */}

              <div className="profile-field">

                <label htmlFor="client-email">
                  Email Address
                </label>

                <input
                  id="client-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />

              </div>

              {/* Married */}

              <div className="profile-field">

                <label htmlFor="client-married">
                  Married
                </label>

                <select
                  id="client-married"
                  name="married"
                  value={form.married}
                  onChange={handleChange}
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>

              {form.married === "Yes" && (
                <>
                  {/* Wife Name */}

                  <div className="profile-field">

                    <label htmlFor="client-wifeName">
                      Wife Name
                    </label>

                    <input
                      id="client-wifeName"
                      type="text"
                      name="wifeName"
                      value={form.wifeName}
                      onChange={handleChange}
                      placeholder="Enter wife name"
                    />

                  </div>

                  {/* Children */}

                  <div className="profile-field">

                    <label htmlFor="client-children">
                      Children
                    </label>

                    <input
                      id="client-children"
                      type="text"
                      name="children"
                      value={form.children}
                      onChange={handleChange}
                      placeholder="Enter Number of Children"
                    />

                  </div>
                </>
              )}

              {/* Parent */}

              <div className="profile-field">

                <label htmlFor="client-parent">
                  Parent
                </label>

                <input
                  id="client-parent"
                  type="text"
                  name="parent"
                  value={form.parent}
                  onChange={handleChange}
                  placeholder="Enter parent name(any one)"
                />

              </div>

              {/* Company Name */}

              <div className="profile-field">

                <label htmlFor="client-companyName">
                  Company Name
                </label>

                <input
                  id="client-companyName"
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  autoComplete="organization"
                />

              </div>

              {/* Job Role */}

              <div className="profile-field">

                <label htmlFor="client-jobRole">
                  Job Role
                </label>

                <input
                  id="client-jobRole"
                  type="text"
                  name="jobRole"
                  value={form.jobRole}
                  onChange={handleChange}
                  placeholder="Enter job role"
                  autoComplete="organization-title"
                />

              </div>

              {/* Experience */}

              <div className="profile-field">

                <label htmlFor="client-experience">
                  Experience
                </label>

                <input
                  id="client-experience"
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Enter experience(year)"
                />

              </div>

              {/* Job Location */}

              <div className="profile-field">

                <label htmlFor="client-jobLocation">
                  Job Location
                </label>

                <input
                  id="client-jobLocation"
                  type="text"
                  name="jobLocation"
                  value={form.jobLocation}
                  onChange={handleChange}
                  placeholder="Enter job location"
                />

              </div>

            </div>

          </div>

          {/* =================================
              PROPERTY REQUIREMENT
          ================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div className="profile-section-number">
                02
              </div>

              <div>

                <h2>
                  Property Requirement
                </h2>

                <p>
                  Help us understand what you're
                  looking for.
                </p>

              </div>

            </div>

            <div className="profile-form-grid">

              {/* =================================
                  LOOKING TO
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-enquiryType">
                  Looking To
                </label>

                <select
                  id="client-enquiryType"
                  name="enquiryType"
                  value={form.enquiryType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Buy">
                    Buy
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="Sell">
                    Sell
                  </option>

                </select>

              </div>

              {/* =================================
                  PROPERTY TYPE
                  ONLY FLAT / SHOP
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-propertyType">
                  Property Type
                </label>

                <select
                  id="client-propertyType"
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Flat">
                    Flat
                  </option>

                  <option value="Shop">
                    Shop
                  </option>

                </select>

              </div>

              {/* =================================
                  CONFIGURATION
                  ONLY FOR FLAT
              ================================= */}

              {isFlat && (
                <div className="profile-field">

                  <label htmlFor="client-bhk">
                    Configuration
                  </label>

                  <select
                    id="client-bhk"
                    name="bhk"
                    value={form.bhk}
                    onChange={handleChange}
                  >

                    <option value="1 RK">
                      1 RK
                    </option>

                    <option value="1 BHK">
                      1 BHK
                    </option>

                    <option value="2 BHK">
                      2 BHK
                    </option>

                    <option value="3 BHK">
                      3 BHK
                    </option>

                    <option value="4+ BHK">
                      4+ BHK
                    </option>

                  </select>

                </div>
              )}

              {/* =================================
                  LOCATION
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-state">
                  State
                </label>

                <select
                  id="client-state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>

              </div>

              <div className="profile-field">

                <label htmlFor="client-city">
                  City
                </label>

                <select
                  id="client-city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={!form.state}
                >
                  <option value="">Select city</option>
                  {form.state === "Maharashtra" && (
                    <>
                      <option value="Thane">Thane</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                    </>
                  )}
                </select>

              </div>

              <div className="profile-field">

                <label htmlFor="client-area">
                  Area
                </label>

                <select
                  id="client-area"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  disabled={!form.city}
                >
                  <option value="">Select area</option>
                  {(locationAreas[form.city] || []).map((area) => (
                    <option key={area} value={area}>
                      {area === "Other" ? "Other / Not listed" : area}
                    </option>
                  ))}
                </select>

              </div>

              {form.area === "Other" && (
                <div className="profile-field">

                  <label htmlFor="client-customArea">
                    Enter Area
                  </label>

                  <input
                    id="client-customArea"
                    type="text"
                    name="customArea"
                    value={form.customArea}
                    onChange={handleChange}
                    placeholder="Enter your area"
                  />

                </div>
              )}

              {/* =================================
                  BUDGET
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-budgetMin">
                  Budget Range (INR)
                </label>

                <div className="profile-form-grid">
                  <div>
                    <label htmlFor="client-budgetMin" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                      Minimum Budget
                    </label>
                    <input
                      id="client-budgetMin"
                      type="number"
                      name="budgetMin"
                      value={form.budgetMin}
                      onChange={handleChange}
                      placeholder="Minimum budget"
                      min="0"
                      max={MAX_BUDGET}
                      step="10000"
                      aria-label="Minimum budget in rupees"
                    />
                  </div>

                  <div>
                    <label htmlFor="client-budgetMax" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                      Maximum Budget
                    </label>
                    <input
                      id="client-budgetMax"
                      type="number"
                      name="budgetMax"
                      value={form.budgetMax}
                      onChange={handleChange}
                      placeholder="Maximum budget"
                      min="0"
                      max={MAX_BUDGET}
                      step="10000"
                      aria-label="Maximum budget in rupees"
                    />
                  </div>
                </div>

              </div>

              {/* =================================
                  POSSESSION
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-possession">
                  Possession
                </label>

                <select
                  id="client-possession"
                  name="possession"
                  value={form.possession}
                  onChange={handleChange}
                >

                  <option value="">
                    Any
                  </option>

                  <option value="Ready to Move">
                    Ready to Move
                  </option>

                  <option value="Within 6 Months">
                    Within 6 Months
                  </option>

                  <option value="Within 1 Year">
                    Within 1 Year
                  </option>

                  <option value="Later">
                    Later
                  </option>

                </select>

              </div>

              {/* =================================
                  FURNISHING
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-furnished">
                  Furnishing
                </label>

                <select
                  id="client-furnished"
                  name="furnished"
                  value={form.furnished}
                  onChange={handleChange}
                >

                  <option value="">
                    Any
                  </option>

                  <option value="Unfurnished">
                    Unfurnished
                  </option>

                  <option value="Semi Furnished">
                    Semi Furnished
                  </option>

                  <option value="Fully Furnished">
                    Fully Furnished
                  </option>

                </select>

              </div>

              {/* =================================
                  PARKING
              ================================= */}

              <div className="profile-field">

                <label htmlFor="client-parking">
                  Parking
                </label>

                <select
                  id="client-parking"
                  name="parking"
                  value={form.parking}
                  onChange={handleChange}
                >

                  <option value="">
                    Any
                  </option>

                  <option value="Required">
                    Required
                  </option>

                  <option value="Not Required">
                    Not Required
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* =================================
              ADDITIONAL DETAILS
          ================================= */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div className="profile-section-number">
                03
              </div>

              <div>

                <h2>
                  Additional Details
                </h2>

                <p>
                  Anything else you'd like us to know?
                </p>

              </div>

            </div>

            <div className="profile-field">

              <label htmlFor="client-message">
                Your Requirement
              </label>

              <textarea
                id="client-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Enter any specific requirements, preferences, or questions you have regarding your property search."
                rows={5}
              />

            </div>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* =================================
              SUBMIT
          ================================= */}

          <div className="profile-submit-area">

            <p>
              By submitting this form, you agree
              to be contacted by Swastik Properties
              regarding your property requirement.
            </p>

            <button
              type="submit"
              className="profile-primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating Profile..."
                : "Submit My Profile"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
