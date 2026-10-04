
// src/pages/ClientProfile.jsx

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { push, ref, set, get, child } from "firebase/database";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  enquiryType: "",
  propertyType: "",
  bhk: "",
  location: "",
  budget: "",
  possession: "",
  furnished: "",
  parking: "",
  message: "",
};

export default function ClientProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { currentUser, userData, loading: authLoading } = useAuth();

  const selectedProperty = state?.property || null;
  const prefillName = state?.prefillName || state?.name || "";
  const prefillEmail = state?.prefillEmail || state?.email || "";

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

    email:
      initialEmail,

    location:
      selectedProperty?.location || "",

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

  // Keep form name and email synced with authenticated account
  useEffect(() => {
    // 1. Direct state prefill takes highest precedence
    if (state?.prefillName) {
      setForm((prev) => ({
        ...prev,
        name: state.prefillName,
        email: prev.email || state.prefillEmail || ""
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
          email: needsEmail ? (currentUser.email || prev.email) : prev.email
        };
      });

      // 2. Extra safety: direct fetch from RTDB in case userData hasn't synchronized yet
      if (!bestName) {
        const userDbRef = child(ref(db), `users/${currentUser.uid}`);
        get(userDbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            if (val?.name && val.name !== 'Agent') {
              setForm((prev) => ({
                ...prev,
                name: (!prev.name || prev.name === 'Agent') ? val.name : prev.name,
                email: !prev.email ? (val.email || currentUser.email) : prev.email
              }));
            }
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

      const enquiryRef =
        push(
          ref(db, "enquiries")
        );

      await set(
        enquiryRef,
        {
          /* =========================
             PERSONAL INFORMATION
          ========================= */

          name:
            form.name.trim(),

          phone,

          email:
            form.email.trim(),


          enquiryType:
            form.enquiryType,

          propertyType:
            form.propertyType,

 

          bhk:
            isFlat
              ? form.bhk
              : "",

          preferredLocation:
            form.location.trim(),

          budget:
            form.budget.trim(),

          possession:
            form.possession,

          furnished:
            form.furnished,

          parking:
            form.parking,

          message:
            form.message.trim(),


          propertyId:
            selectedProperty?.id ||
            null,

          propertyTitle:
            selectedProperty?.title ||
            null,

          propertyLocation:
            selectedProperty?.location ||
            null,

          propertyPrice:
            selectedProperty?.price ||
            null,

          userId:
            currentUser?.uid || null,

          buyerId:
            currentUser?.uid || null,

          userEmail:
            currentUser?.email || form.email.trim(),

          userRole:
            userData?.role || "buyer",

          status:
            "new",

          source:
            "website-profile",

          createdAt:
            Date.now(),

          updatedAt:
            Date.now(),
        }
      );

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
            Profile Submitted
          </h1>

          <p>
            Thank you, <strong>{form.name || "valued client"}</strong>, for sharing your
            property requirements with us.
            Our consultant will review your
            profile and contact you shortly.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              type="button"
              className="profile-primary-button"
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

      </div>
    );
  }



  return (
    <div className="client-profile-page">

      <div className="client-profile-container">

        {/* =================================
            BACK
        ================================= */}

        <Link
          to="/"
          className="profile-back-button"
        >
          <ArrowLeft size={17} />
          Back to website
        </Link>

        {/* =================================
            HEADER
        ================================= */}

        <div className="client-profile-header">

          <p className="profile-eyebrow">
            SWASTIK PROPERTIES
          </p>

          <h1>
            Create Your Property Profile
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

                <label>
                  Full Name *
                </label>

                <input
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

                <label>
                  Mobile Number *
                </label>

                <input
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

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
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

                <label>
                  Looking To
                </label>

                <select
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

                <label>
                  Property Type
                </label>

                <select
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

                  <label>
                    Configuration
                  </label>

                  <select
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

                <label>
                  Preferred Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter your preferred location"
                />

              </div>

              {/* =================================
                  BUDGET
              ================================= */}

              <div className="profile-field">

                <label>
                  Budget
                </label>

                <input
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget"
                />

              </div>

              {/* =================================
                  POSSESSION
              ================================= */}

              <div className="profile-field">

                <label>
                  Possession
                </label>

                <select
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

                <label>
                  Furnishing
                </label>

                <select
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

                <label>
                  Parking
                </label>

                <select
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

              <label>
                Your Requirement
              </label>

              <textarea
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
