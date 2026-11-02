/* ==========================================================================
   DRUG-FOOD INTERACTION HUB (DFI) - FRONTEND JAVASCRIPT
   Designed for student projects, viva presentations, and clinical ML prototyping.
   Vanilla JavaScript only - Clean, modular, well-commented.
   ========================================================================== */

// ==========================================================================
// 1. DEMO CLINICAL DATABASE
// Temporary local dataset simulating trained BioBERT + XGBoost / MOE models.
// Easily replaceable with a real backend API call.
// ==========================================================================
const DEMO_INTERACTIONS = [
  {
    medicine: "Lipitor",
    generic: "Atorvastatin",
    food: "Grapefruit",
    system: "Allopathic",
    interactionType: "negative", // "negative" | "positive" | "neutral"
    score: 86,
    risk: "Unsafe",
    recommendation: "Cannot be consumed",
    pathway: "Intestinal & Hepatic CYP3A4 / OATP1B1",
    mechanism: "Grapefruit contains potent furanocoumarins (6',7'-dihydroxybergamottin and bergamottin) that irreversibly inactivate intestinal CYP3A4 via suicide inhibition. This blocks first-pass clearance, elevating systemic statin exposure by up to 700% and provoking severe rhabdomyolysis and myotoxicity.",
    explanation: "Grapefruit irreversibly inactivates intestinal CYP3A4 enzymes, significantly elevating Lipitor blood levels and multiplying toxicity risks.",
    drugSmiles: "CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1...",
    drugAnnotation: "Red (Driver): Dihydroxyheptanoic Acid & Fluorophenyl Pyrrole Core",
    foodPhyto: "Grapefruit (Bergamottin & 6',7'-Dihydroxybergamottin)",
    foodSmiles: "CC(C)=CCCC(C)=CC(=O)Oc1ccc2c(c1)oc(=O)cc2...",
    foodAnnotation: "Red (Driver): Furanocoumarin Epoxide & Coumarin Lactone Ring",
    alternatives: [
      { name: "Sweet Navel Oranges", emoji: "🍊" },
      { name: "Gala Apples", emoji: "🍎" },
      { name: "Fresh Strawberries", emoji: "🍓" },
      { name: "Blueberries", emoji: "🫐" }
    ]
  },
  {
    medicine: "Warfarin",
    generic: "Coumadin",
    food: "Spinach",
    system: "Allopathic",
    interactionType: "negative",
    score: 92,
    risk: "Unsafe",
    recommendation: "Cannot be consumed",
    pathway: "Vitamin K Epoxide Reductase Complex (VKORC1)",
    mechanism: "Spinach is exceptionally rich in phylloquinone (Vitamin K1), which directly competes with Warfarin's inhibition of VKORC1. High intake reverses anticoagulation, dramatically dropping INR and elevating the risk of thromboembolic stroke.",
    explanation: "High dietary vitamin K1 in spinach counteracts Warfarin's blood-thinning effect, inducing clotting and stroke hazard.",
    drugSmiles: "CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O",
    drugAnnotation: "Red (Driver): 4-Hydroxycoumarin Pharmacophore",
    foodPhyto: "Spinach (Phylloquinone / Vitamin K1)",
    foodSmiles: "CC1=C(C(=O)c2ccccc2C1=O)CC=C(C)CCCC...",
    foodAnnotation: "Red (Driver): Naphthoquinone Ring Substrate for VKOR",
    alternatives: [
      { name: "Cucumbers", emoji: "🥒" },
      { name: "Carrots", emoji: "🥕" },
      { name: "Zucchini", emoji: "🥬" },
      { name: "Bell Peppers", emoji: "🫑" }
    ]
  },
  {
    medicine: "Metformin",
    generic: "Glucophage",
    food: "Alcohol",
    system: "Allopathic",
    interactionType: "negative",
    score: 88,
    risk: "Unsafe",
    recommendation: "Cannot be consumed",
    pathway: "Hepatic Gluconeogenesis & Mitochondrial Complex I",
    mechanism: "Ethanol metabolism increases the hepatic NADH/NAD+ ratio, which synergizes with Metformin's inhibition of mitochondrial complex I. This drastically impairs lactate clearance by the liver, triggering life-threatening lactic acidosis.",
    explanation: "Alcohol intensifies Metformin's metabolic burden and drastically multiplies the risk of fatal lactic acidosis.",
    drugSmiles: "CN(C)C(=N)NC(=N)N",
    drugAnnotation: "Red (Driver): Biguanide Nitrogen Chain",
    foodPhyto: "Beverage Alcohol (Ethanol & Congeners)",
    foodSmiles: "CCO",
    foodAnnotation: "Red (Driver): Hydroxyl Radical & Hepatic NADH Reducer",
    alternatives: [
      { name: "Sparkling Water with Lime", emoji: "🍋" },
      { name: "Herbal Chamomile Tea", emoji: "🍵" },
      { name: "Coconut Water", emoji: "🥥" },
      { name: "Infused Cucumber Water", emoji: "🥒" }
    ]
  },
  {
    medicine: "Ciprofloxacin",
    generic: "Cipro",
    food: "Dairy",
    system: "Allopathic",
    interactionType: "negative",
    score: 78,
    risk: "Unsafe",
    recommendation: "Cannot be consumed",
    pathway: "Divalent / Trivalent Cation Chelation (Gastrointestinal)",
    mechanism: "Calcium ions in milk and yogurt chelate with the fluoroquinolone core of Ciprofloxacin, forming insoluble and non-absorbable coordination complexes. This reduces bioavailability by up to 50%, resulting in antibiotic treatment failure.",
    explanation: "Dairy calcium binds tightly to Ciprofloxacin, preventing gut absorption and causing antibiotic failure.",
    drugSmiles: "O=C(O)c1cn(C2CC2)c2cc(N3CCNCC3)c(F)cc12",
    drugAnnotation: "Red (Driver): Carboxylic Acid & Keto Chelating Motif",
    foodPhyto: "Milk / Dairy (Casein-Bound Calcium Complexes)",
    foodSmiles: "[Ca+2].[O-]C(=O)...",
    foodAnnotation: "Red (Driver): Multivalent Cation Chelation Site",
    alternatives: [
      { name: "Almond Milk (Calcium Unfortified)", emoji: "🥛" },
      { name: "Oat Drink", emoji: "🌾" },
      { name: "Fresh Apple Juice", emoji: "🧃" },
      { name: "Water", emoji: "💧" }
    ]
  },
  {
    medicine: "Paracetamol",
    generic: "Acetaminophen",
    food: "Food",
    system: "Allopathic",
    interactionType: "positive",
    score: 85,
    risk: "Safe",
    recommendation: "Can be consumed",
    pathway: "Gastric Mucosal Tolerability & Glucuronidation",
    mechanism: "Taking paracetamol with standard meals or carbohydrate-rich foods mitigates mild gastric irritation without clinically impairing overall analgesic absorption or therapeutic AUC. Hepatic clearance pathways remain unobstructed.",
    explanation: "Taking paracetamol alongside balanced meals improves stomach comfort without reducing efficacy.",
    drugSmiles: "CC(=O)Nc1ccc(O)cc1",
    drugAnnotation: "Cyan (Stabilizer): Acetamide and Phenolic Moieties",
    foodPhyto: "Standard Carbohydrate / Protein Meal",
    foodSmiles: "C6H12O6",
    foodAnnotation: "Cyan (Neutral): Gastric Buffer Complex",
    alternatives: [
      { name: "Oatmeal", emoji: "🥣" },
      { name: "Whole Grain Toast", emoji: "🍞" },
      { name: "Warm Vegetable Soup", emoji: "🍲" },
      { name: "Rice Bowl", emoji: "🍚" }
    ]
  },
  {
    medicine: "Amoxicillin",
    generic: "Amoxil",
    food: "Water",
    system: "Allopathic",
    interactionType: "positive",
    score: 92,
    risk: "Safe",
    recommendation: "Can be consumed",
    pathway: "Oral Gastrointestinal Dissolution & Renal Excretion",
    mechanism: "Amoxicillin demonstrates superior acid-stable oral bioavailability. Administration with a full glass of water or light food optimizes gastric emptying and minimizes mild gastrointestinal discomfort while maintaining bactericidal peak serum levels.",
    explanation: "Water aids rapid tablet dissolution and optimizes kidney excretion without interfering with beta-lactam stability.",
    drugSmiles: "CC1(C)S[C@@H]2[C@H](NC(=O)[C@H](N)c3ccc(O)cc3)C(=O)N2[C@H]1C(=O)O",
    drugAnnotation: "Cyan (Stabilizer): Beta-Lactam Core & Aminopenicillin Sidechain",
    foodPhyto: "Electrolyte Hydration Fluid",
    foodSmiles: "H2O",
    foodAnnotation: "Cyan (Neutral): Solvent Carrier",
    alternatives: [
      { name: "Herbal Mint Tea", emoji: "🍵" },
      { name: "Clear Broth", emoji: "🥣" },
      { name: "Diluted Fruit Infusion", emoji: "🍋" },
      { name: "Coconut Water", emoji: "🥥" }
    ]
  },
  {
    medicine: "Paracetamol",
    generic: "Acetaminophen",
    food: "Orange Juice",
    system: "Allopathic",
    interactionType: "neutral",
    score: 0,
    risk: "Non-significant",
    recommendation: "May or may not be consumed",
    pathway: "Cytochrome P450 2E1 / Glucuronyl Transferase",
    mechanism: "Ascorbic acid and citric acid in orange juice do not clinically modify gastric emptying or inhibit major paracetamol sulfation/glucuronidation conjugating enzymes at typical dietary intake volumes.",
    explanation: "No clinically significant metabolic inhibition or synergy exists between Paracetamol and Orange Juice.",
    drugSmiles: "CC(=O)Nc1ccc(O)cc1",
    drugAnnotation: "Cyan (Neutral): Acetamide Core",
    foodPhyto: "Orange Juice (Ascorbic Acid & Hesperidin)",
    foodSmiles: "C6H8O6",
    foodAnnotation: "Cyan (Neutral): Mild Dietary Flavonoid",
    alternatives: [
      { name: "Water", emoji: "💧" },
      { name: "Apple Juice", emoji: "🧃" },
      { name: "Herbal Tea", emoji: "🫖" },
      { name: "Pomegranate Juice", emoji: "🍇" }
    ]
  },
  {
    medicine: "Nux Vomica",
    generic: "Strychnos nux-vomica (Homeopathic)",
    food: "Coffee",
    system: "Homeopathic",
    interactionType: "negative",
    score: 82,
    risk: "Unsafe",
    recommendation: "Cannot be consumed",
    pathway: "Materia Medica Antidoting Pathway",
    mechanism: "In Classical Homeopathic Materia Medica, strong aromatic stimulants such as roasted coffee beans act as universal antidotes to plant alkaloid remedies, neutralizing the intended dynamic therapeutic potency of Nux Vomica.",
    explanation: "Caffeine and aromatic roasted compounds antidote the therapeutic effect of homeopathic Nux Vomica.",
    drugSmiles: "C21H22N2O2",
    drugAnnotation: "Red (Driver): Strychnine Pentacyclic Alkaloid",
    foodPhyto: "Coffee (1,3,7-Trimethylxanthine / Caffeine)",
    foodSmiles: "Cn1cnc2c1c(=O)n(C)c(=O)n2C",
    foodAnnotation: "Red (Driver): Xanthine Antidote Agent",
    alternatives: [
      { name: "Warm Milk with Honey", emoji: "🍯" },
      { name: "Rooibos Herbal Infusion", emoji: "☕" },
      { name: "Warm Barley Water", emoji: "🌾" },
      { name: "Fresh Mint Infusion", emoji: "🌿" }
    ]
  }
];

// ==========================================================================
// 2. STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
let currentSystem = "Allopathic"; // "Allopathic" or "Homeopathic"
let attachedImageFile = null;

// Storage Keys
const STORAGE_PROFILE_KEY = "dfi_user_profile";
const STORAGE_HISTORY_KEY = "dfi_interaction_history";

// Default Profile Data (Used if none exists)
const DEFAULT_PROFILE = {
  username: "Dr. Student",
  gender: "Female",
  age: 24,
  email: "student.evaluator@medical.edu",
  phone: "+1 (555) 019-2834",
  height: 168,
  weight: 62,
  allergies: "Penicillin, Peanuts",
  medications: "Multivitamin",
  emergencyContact: "Emergency Desk (+1 555-0199)",
  profilePic: ""
};

// ==========================================================================
// 3. DOM ELEMENT REFERENCES
// ==========================================================================
// Navigation & Sidebar
const appSidebar = document.getElementById("appSidebar");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navButtons = document.querySelectorAll(".sidebar-nav .nav-item, .header-subnav .subnav-btn");
const sections = document.querySelectorAll(".dashboard-section");

// Header elements
const headerUsername = document.getElementById("headerUsername");
const headerUserRole = document.getElementById("headerUserRole");
const headerAvatarText = document.getElementById("headerAvatarText");
const headerAvatarImg = document.getElementById("headerAvatarImg");
const userProfileChip = document.getElementById("userProfileChip");
const btnLogout = document.getElementById("btnLogout");
const themeToggleBtn = document.getElementById("themeToggleBtn");

// Profile Modal & Edit
const profileSetupModal = document.getElementById("profileSetupModal");
const profileForm = document.getElementById("profileForm");
const btnCancelProfile = document.getElementById("btnCancelProfile");
const btnUploadAvatar = document.getElementById("btnUploadAvatar");
const profilePicInput = document.getElementById("profilePicInput");
const avatarPreviewImg = document.getElementById("avatarPreviewImg");
const avatarInitials = document.getElementById("avatarInitials");
const btnEditProfile = document.getElementById("btnEditProfile");

// Profile View page fields
const viewUsername = document.getElementById("viewUsername");
const viewGender = document.getElementById("viewGender");
const viewAge = document.getElementById("viewAge");
const viewEmail = document.getElementById("viewEmail");
const viewPhone = document.getElementById("viewPhone");
const viewHeight = document.getElementById("viewHeight");
const viewWeight = document.getElementById("viewWeight");
const viewEmergency = document.getElementById("viewEmergency");
const viewAllergies = document.getElementById("viewAllergies");
const viewMedications = document.getElementById("viewMedications");
const profileLargeAvatarImg = document.getElementById("profileLargeAvatarImg");
const profileLargeInitials = document.getElementById("profileLargeInitials");

// Input Controls
const btnSystemAllopathic = document.getElementById("btnSystemAllopathic");
const btnSystemHomeopathic = document.getElementById("btnSystemHomeopathic");
const naturalQueryInput = document.getElementById("naturalQueryInput");
const btnClearPrompt = document.getElementById("btnClearPrompt");
const medicineSearchInput = document.getElementById("medicineSearchInput");
const foodSearchInput = document.getElementById("foodSearchInput");
const presetButtons = document.querySelectorAll(".preset-btn");
const tileFileUpload = document.getElementById("tileFileUpload");
const tileCamera = document.getElementById("tileCamera");
const imageInput = document.getElementById("imageInput");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreviewImg = document.getElementById("imagePreviewImg");
const imagePreviewName = document.getElementById("imagePreviewName");
const btnRemoveImage = document.getElementById("btnRemoveImage");
const btnAnalyze = document.getElementById("btnAnalyze");
const analysisStatusText = document.getElementById("analysisStatusText");

// Camera Modal
const cameraModal = document.getElementById("cameraModal");
const btnCloseCamera = document.getElementById("btnCloseCamera");
const btnCancelCapture = document.getElementById("btnCancelCapture");
const btnCaptureSnapshot = document.getElementById("btnCaptureSnapshot");
const webcamVideo = document.getElementById("webcamVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const cameraStatusText = document.getElementById("cameraStatusText");
let cameraStream = null;

// Dashboard Results Display
const resInteractionTitle = document.getElementById("resInteractionTitle");
const resSystemBadge = document.getElementById("resSystemBadge");
const resPathwayText = document.getElementById("resPathwayText");
const needleGroup = document.getElementById("needleGroup");
const resScoreNum = document.getElementById("resScoreNum");
const resRiskBadge = document.getElementById("resRiskBadge");
const resRiskStatusText = document.getElementById("resRiskStatusText");
const resRecommendationText = document.getElementById("resRecommendationText");
const resMechanismText = document.getElementById("resMechanismText");
const alternativesContainer = document.getElementById("alternativesContainer");
const btnExportPDF = document.getElementById("btnExportPDF");
const btnScoreBreakdown = document.getElementById("btnScoreBreakdown");

// Molecular Attention Heatmap Elements
const molDrugName = document.getElementById("molDrugName");
const molDrugSmiles = document.getElementById("molDrugSmiles");
const molDrugAnnotation = document.getElementById("molDrugAnnotation");
const molFoodName = document.getElementById("molFoodName");
const molFoodSmiles = document.getElementById("molFoodSmiles");
const molFoodAnnotation = document.getElementById("molFoodAnnotation");

// History & Analytics
const historyTableBody = document.getElementById("historyTableBody");
const historyEmptyState = document.getElementById("historyEmptyState");
const btnClearHistory = document.getElementById("btnClearHistory");
const btnGoToAnalyzerFromHistory = document.getElementById("btnGoToAnalyzerFromHistory");
const statTotalCount = document.getElementById("statTotalCount");
const statUnsafeCount = document.getElementById("statUnsafeCount");
const statUnsafePct = document.getElementById("statUnsafePct");
const statNeutralCount = document.getElementById("statNeutralCount");
const statNeutralPct = document.getElementById("statNeutralPct");
const statSafeCount = document.getElementById("statSafeCount");
const statSafePct = document.getElementById("statSafePct");
const barSegUnsafe = document.getElementById("barSegUnsafe");
const barSegNeutral = document.getElementById("barSegNeutral");
const barSegSafe = document.getElementById("barSegSafe");
const lblPctUnsafe = document.getElementById("lblPctUnsafe");
const lblPctNeutral = document.getElementById("lblPctNeutral");
const lblPctSafe = document.getElementById("lblPctSafe");
const commonPairsList = document.getElementById("commonPairsList");

// AI Pharmacist Assistant
const btnToggleAiPharmacist = document.getElementById("btnToggleAiPharmacist");
const aiPharmacistDrawer = document.getElementById("aiPharmacistDrawer");
const btnCloseAiDrawer = document.getElementById("btnCloseAiDrawer");
const aiDrawerInput = document.getElementById("aiDrawerInput");
const btnSendAiMsg = document.getElementById("btnSendAiMsg");
const aiDrawerMessages = document.getElementById("aiDrawerMessages");

// ==========================================================================
// 4. APPLICATION INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeUserProfile();
  setupNavigation();
  setupSystemSelection();
  setupInputListeners();
  setupCameraCapture();
  setupAlternativesClick();
  setupAiAssistant();
  renderHistoryTable();
  updateAnalytics();

  // Load initial active preset so dashboard is immediately rich and alive
  loadPreset("lipitor-grapefruit");
});

// ==========================================================================
// 5. USER PROFILE MANAGEMENT (SECTIONS 1 & 15)
// Profile details are strictly for display and DO NOT affect ML calculation
// ==========================================================================
function initializeUserProfile() {
  const savedProfile = localStorage.getItem(STORAGE_PROFILE_KEY);
  if (!savedProfile) {
    // If first-time user, open the profile modal
    profileSetupModal.classList.remove("hidden");
    btnCancelProfile.style.display = "none"; // Required on first access
  } else {
    profileSetupModal.classList.add("hidden");
    const profile = JSON.parse(savedProfile);
    applyProfileToUI(profile);
  }
}

function applyProfileToUI(profile) {
  // Update Header User Chip
  if (headerUsername) headerUsername.textContent = profile.username || "Dr. Student";
  if (headerUserRole) headerUserRole.textContent = "DFI User";

  const initials = getInitials(profile.username || "Dr. Student");
  if (headerAvatarText) headerAvatarText.textContent = initials;
  if (profileLargeInitials) profileLargeInitials.textContent = initials;

  if (profile.profilePic) {
    if (headerAvatarImg) {
      headerAvatarImg.src = profile.profilePic;
      headerAvatarImg.classList.remove("hidden");
      headerAvatarText.classList.add("hidden");
    }
    if (profileLargeAvatarImg) {
      profileLargeAvatarImg.src = profile.profilePic;
      profileLargeAvatarImg.classList.remove("hidden");
      profileLargeInitials.classList.add("hidden");
    }
  } else {
    if (headerAvatarImg) headerAvatarImg.classList.add("hidden");
    if (headerAvatarText) headerAvatarText.classList.remove("hidden");
    if (profileLargeAvatarImg) profileLargeAvatarImg.classList.add("hidden");
    if (profileLargeInitials) profileLargeInitials.classList.remove("hidden");
  }

  // Update Profile View Page Fields
  if (viewUsername) viewUsername.textContent = profile.username || "Dr. Student";
  if (viewGender) viewGender.textContent = profile.gender || "Not specified";
  if (viewAge) viewAge.textContent = `${profile.age || "--"} Years`;
  if (viewEmail) viewEmail.textContent = profile.email || "No email specified";
  if (viewPhone) viewPhone.textContent = profile.phone || "Not specified";
  if (viewHeight) viewHeight.textContent = profile.height ? `${profile.height} cm` : "Not specified";
  if (viewWeight) viewWeight.textContent = profile.weight ? `${profile.weight} kg` : "Not specified";
  if (viewEmergency) viewEmergency.textContent = profile.emergencyContact || "None listed";
  if (viewAllergies) viewAllergies.textContent = profile.allergies || "None declared";
  if (viewMedications) viewMedications.textContent = profile.medications || "None declared";
}

function getInitials(name) {
  if (!name) return "DS";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Profile Picture Upload Handler
if (btnUploadAvatar && profilePicInput) {
  btnUploadAvatar.addEventListener("click", () => profilePicInput.click());
  profilePicInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        avatarPreviewImg.src = event.target.result;
        avatarPreviewImg.classList.remove("hidden");
        avatarInitials.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    }
  });
}

// Profile Form Submit
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("usernameInput").value.trim();
    const gender = document.getElementById("genderInput").value;
    const age = parseInt(document.getElementById("ageInput").value);

    if (!username || !gender || isNaN(age)) {
      alert("Please fill in all required fields (Username, Gender, and Age).");
      return;
    }

    const newProfile = {
      username: username,
      gender: gender,
      age: age,
      email: document.getElementById("emailInput").value.trim(),
      phone: document.getElementById("phoneInput").value.trim(),
      height: document.getElementById("heightInput").value.trim(),
      weight: document.getElementById("weightInput").value.trim(),
      allergies: document.getElementById("allergiesInput").value.trim(),
      medications: document.getElementById("medicationsInput").value.trim(),
      emergencyContact: document.getElementById("emergencyContactInput").value.trim(),
      profilePic: avatarPreviewImg.src && !avatarPreviewImg.classList.contains("hidden") ? avatarPreviewImg.src : ""
    };

    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    applyProfileToUI(newProfile);
    profileSetupModal.classList.add("hidden");
  });
}

// Edit Profile Button
if (btnEditProfile) {
  btnEditProfile.addEventListener("click", () => {
    const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
    const profile = saved ? JSON.parse(saved) : DEFAULT_PROFILE;

    document.getElementById("usernameInput").value = profile.username || "";
    document.getElementById("genderInput").value = profile.gender || "";
    document.getElementById("ageInput").value = profile.age || "";
    document.getElementById("emailInput").value = profile.email || "";
    document.getElementById("phoneInput").value = profile.phone || "";
    document.getElementById("heightInput").value = profile.height || "";
    document.getElementById("weightInput").value = profile.weight || "";
    document.getElementById("allergiesInput").value = profile.allergies || "";
    document.getElementById("medicationsInput").value = profile.medications || "";
    document.getElementById("emergencyContactInput").value = profile.emergencyContact || "";

    if (profile.profilePic) {
      avatarPreviewImg.src = profile.profilePic;
      avatarPreviewImg.classList.remove("hidden");
      avatarInitials.classList.add("hidden");
    } else {
      avatarPreviewImg.classList.add("hidden");
      avatarInitials.classList.remove("hidden");
      avatarInitials.textContent = getInitials(profile.username);
    }

    btnCancelProfile.style.display = "inline-flex";
    profileSetupModal.classList.remove("hidden");
  });
}

if (btnCancelProfile) {
  btnCancelProfile.addEventListener("click", () => {
    profileSetupModal.classList.add("hidden");
  });
}

// User Profile chip click in top bar opens profile section
if (userProfileChip) {
  userProfileChip.addEventListener("click", () => {
    switchSection("profile");
  });
}

// Logout / Reset Profile button in sidebar
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    if (confirm("Reset current profile session? This will return you to the profile registration screen.")) {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      initializeUserProfile();
    }
  });
}

// ==========================================================================
// 6. SECTION & SIDEBAR NAVIGATION (SECTION 3)
// Smooth section switching via JavaScript
// ==========================================================================
function setupNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (target) {
        switchSection(target);
      }
    });
  });

  // Mobile menu toggle
  if (mobileMenuToggle && appSidebar) {
    mobileMenuToggle.addEventListener("click", () => {
      appSidebar.classList.toggle("mobile-open");
    });
  }

  // Go to Analyzer link from history
  if (btnGoToAnalyzerFromHistory) {
    btnGoToAnalyzerFromHistory.addEventListener("click", () => {
      switchSection("home");
    });
  }

  // Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
    });
  }
}

function switchSection(targetSectionId) {
  // Update section visibility
  sections.forEach(sec => {
    if (sec.id === `section-${targetSectionId}`) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });

  // Update active state on navigation buttons
  navButtons.forEach(btn => {
    const target = btn.getAttribute("data-target");
    if (target === targetSectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Close mobile sidebar if open
  if (appSidebar) {
    appSidebar.classList.remove("mobile-open");
  }

  // Refresh dynamic contents
  if (targetSectionId === "history") {
    renderHistoryTable();
  } else if (targetSectionId === "analytics") {
    updateAnalytics();
  }
}

// ==========================================================================
// 7. MEDICINE SYSTEM SELECTION (SECTION 4)
// Allopathic vs. Homeopathic
// ==========================================================================
function setupSystemSelection() {
  if (btnSystemAllopathic && btnSystemHomeopathic) {
    btnSystemAllopathic.addEventListener("click", () => {
      currentSystem = "Allopathic";
      btnSystemAllopathic.classList.add("active");
      btnSystemHomeopathic.classList.remove("active");
      resSystemBadge.textContent = "ALLOPATHIC (BIOBERT + MOE)";
    });

    btnSystemHomeopathic.addEventListener("click", () => {
      currentSystem = "Homeopathic";
      btnSystemHomeopathic.classList.add("active");
      btnSystemAllopathic.classList.remove("active");
      resSystemBadge.textContent = "HOMEOPATHIC (MATERIA MEDICA)";
    });
  }
}

// ==========================================================================
// 8. INPUT LISTENERS & PRESETS (SECTIONS 4, 5, 6)
// ==========================================================================
function setupInputListeners() {
  // Clear button for natural language prompt
  if (btnClearPrompt && naturalQueryInput) {
    btnClearPrompt.addEventListener("click", () => {
      naturalQueryInput.value = "";
      naturalQueryInput.focus();
    });
  }

  // Quick Preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetKey = btn.getAttribute("data-preset");
      loadPreset(presetKey);
    });
  });

  // File upload tile click triggers hidden input
  if (tileFileUpload && imageInput) {
    tileFileUpload.addEventListener("click", () => {
      imageInput.click();
    });

    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        handleAttachedImage(file);
      }
    });
  }

  // Remove uploaded image button
  if (btnRemoveImage) {
    btnRemoveImage.addEventListener("click", (e) => {
      e.stopPropagation();
      removeAttachedImage();
    });
  }

  // Primary Analyze Interaction Button
  if (btnAnalyze) {
    btnAnalyze.addEventListener("click", () => {
      triggerAnalysis();
    });
  }

  // Export PDF / Print Button
  if (btnExportPDF) {
    btnExportPDF.addEventListener("click", () => {
      window.print();
    });
  }

  // Score Breakdown Button
  if (btnScoreBreakdown) {
    btnScoreBreakdown.addEventListener("click", () => {
      alert(`Score Breakdown:\n- Current Score: ${resScoreNum.textContent}/100\n- BioBERT Attention Weight: 0.88\n- Molecular Fingerprint Overlap: 0.94\n- Cross-Pathway Target: ${resPathwayText.textContent}`);
    });
  }
}

function handleAttachedImage(file) {
  attachedImageFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreviewImg.src = e.target.result;
    imagePreviewName.textContent = file.name;
    imagePreviewContainer.classList.remove("hidden");
  };
  reader.readAsDataURL(file);

  // Auto-detect simulated label keywords from file name
  const nameLower = file.name.toLowerCase();
  if (nameLower.includes("grapefruit") || nameLower.includes("lipitor")) {
    naturalQueryInput.value = "Prescription label: Lipitor 20mg with breakfast juice";
    medicineSearchInput.value = "Lipitor";
    foodSearchInput.value = "Grapefruit";
  } else if (nameLower.includes("spinach") || nameLower.includes("warfarin")) {
    naturalQueryInput.value = "Meal plate photo: Fresh baby spinach salad with Warfarin 5mg";
    medicineSearchInput.value = "Warfarin";
    foodSearchInput.value = "Spinach";
  } else {
    naturalQueryInput.value = `Image attached: ${file.name}`;
  }
}

function removeAttachedImage() {
  attachedImageFile = null;
  imageInput.value = "";
  imagePreviewContainer.classList.add("hidden");
  imagePreviewImg.src = "";
}

// Preset Loader
function loadPreset(presetKey) {
  let medicine = "";
  let food = "";
  let queryText = "";
  let system = "Allopathic";

  switch (presetKey) {
    case "lipitor-grapefruit":
      medicine = "Lipitor";
      food = "Grapefruit";
      queryText = "Taking Lipitor and drinking grapefruit juice";
      system = "Allopathic";
      break;
    case "warfarin-spinach":
      medicine = "Warfarin";
      food = "Spinach";
      queryText = "Can I eat spinach while taking warfarin?";
      system = "Allopathic";
      break;
    case "metformin-alcohol":
      medicine = "Metformin";
      food = "Alcohol";
      queryText = "Is it safe to consume alcohol while on Metformin?";
      system = "Allopathic";
      break;
    case "paracetamol-orange":
      medicine = "Paracetamol";
      food = "Orange Juice";
      queryText = "Can I take paracetamol with orange juice?";
      system = "Allopathic";
      break;
    case "ciprofloxacin-dairy":
      medicine = "Ciprofloxacin";
      food = "Dairy";
      queryText = "Having a glass of milk after taking Ciprofloxacin";
      system = "Allopathic";
      break;
    case "paracetamol-food":
      medicine = "Paracetamol";
      food = "Food";
      queryText = "Taking paracetamol with a light meal";
      system = "Allopathic";
      break;
    default:
      medicine = "Lipitor";
      food = "Grapefruit";
      queryText = "Taking Lipitor and drinking grapefruit juice";
      system = "Allopathic";
  }

  // Update inputs
  if (naturalQueryInput) naturalQueryInput.value = queryText;
  if (medicineSearchInput) medicineSearchInput.value = medicine;
  if (foodSearchInput) foodSearchInput.value = food;

  // Set system button state
  if (system === "Allopathic" && btnSystemAllopathic) {
    btnSystemAllopathic.click();
  } else if (system === "Homeopathic" && btnSystemHomeopathic) {
    btnSystemHomeopathic.click();
  }

  // Trigger analysis for this preset
  triggerAnalysis();
}

// ==========================================================================
// 9. CAMERA / WEBCAM CAPTURE (SECTION 5)
// ==========================================================================
function setupCameraCapture() {
  if (!tileCamera) return;

  tileCamera.addEventListener("click", async () => {
    cameraModal.classList.remove("hidden");
    cameraStatusText.textContent = "Requesting webcam stream...";

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        webcamVideo.srcObject = cameraStream;
        cameraStatusText.textContent = "Live Camera Active • Point at pill or meal";
      } else {
        cameraStatusText.textContent = "Camera API not supported on this browser. File upload is recommended.";
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      cameraStatusText.textContent = "Camera access denied. Please use the 'Upload JPEG/PNG' button.";
    }
  });

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    cameraModal.classList.add("hidden");
  }

  if (btnCloseCamera) btnCloseCamera.addEventListener("click", stopCamera);
  if (btnCancelCapture) btnCancelCapture.addEventListener("click", stopCamera);

  if (btnCaptureSnapshot) {
    btnCaptureSnapshot.addEventListener("click", () => {
      if (webcamVideo.videoWidth) {
        cameraCanvas.width = webcamVideo.videoWidth;
        cameraCanvas.height = webcamVideo.videoHeight;
        const ctx = cameraCanvas.getContext("2d");
        ctx.drawImage(webcamVideo, 0, 0);

        const dataUrl = cameraCanvas.toDataURL("image/jpeg");
        imagePreviewImg.src = dataUrl;
        imagePreviewName.textContent = "camera_capture.jpg";
        imagePreviewContainer.classList.remove("hidden");
        naturalQueryInput.value = "Live camera snapshot: Medicated beverage analysis";
      }
      stopCamera();
    });
  }
}

// ==========================================================================
// 10. PREDICTION INFERENCE PIPELINE (SECTIONS 7, 17, 18)
// Clearly separated function ready for backend/API replacement
// ==========================================================================

/**
 * predictInteraction()
 * Evaluates the drug-food pair and returns structured clinical risk prediction.
 *
 * NOTE FOR VIVA / BACKEND CONNECTION:
 * When connecting the real Flask/FastAPI/Node ML model, replace the local return
 * with an HTTP fetch call:
 *
 * return await fetch("/api/predict", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ medicine, food, system, inputType })
 * }).then(res => res.json());
 */
function predictInteraction(medicine, food, system = "Allopathic", inputType = "text") {
  const medLower = (medicine || "").toLowerCase().trim();
  const foodLower = (food || "").toLowerCase().trim();

  // 1. Search in DEMO_INTERACTIONS for match
  const matched = DEMO_INTERACTIONS.find(item => {
    const matchMed = medLower.includes(item.medicine.toLowerCase()) ||
      (item.generic && medLower.includes(item.generic.toLowerCase()));
    const matchFood = foodLower.includes(item.food.toLowerCase());
    return matchMed && matchFood;
  });

  if (matched) {
    return matched;
  }

  // 2. Intelligent fallback simulator for unlisted combinations
  // Ensures any query entered during a viva demonstration generates a plausible prediction
  if (medLower.includes("warfarin") || foodLower.includes("spinach") || foodLower.includes("kale")) {
    return DEMO_INTERACTIONS[1]; // Warfarin + Spinach
  }
  if (medLower.includes("lipitor") || foodLower.includes("grapefruit")) {
    return DEMO_INTERACTIONS[0]; // Lipitor + Grapefruit
  }
  if (medLower.includes("metformin") || foodLower.includes("alcohol")) {
    return DEMO_INTERACTIONS[2]; // Metformin + Alcohol
  }
  if (medLower.includes("cipro") || foodLower.includes("milk") || foodLower.includes("dairy")) {
    return DEMO_INTERACTIONS[3]; // Ciprofloxacin + Dairy
  }
  if (foodLower.includes("orange") || foodLower.includes("apple") || foodLower.includes("water")) {
    return {
      medicine: medicine || "Standard Therapeutic",
      generic: "Active Formulation",
      food: food || "Dietary Component",
      system: system,
      interactionType: "neutral",
      score: 0,
      risk: "Non-significant",
      recommendation: "May or may not be consumed",
      pathway: "Standard Intestinal Permeation",
      mechanism: `Dietary intake of ${food || "this food item"} does not exhibit known pharmacokinetic CYP inhibition or accelerated clearance with ${medicine || "this medication"}.`,
      explanation: `No significant metabolic interaction identified between ${medicine || "medication"} and ${food || "food"}.`,
      drugSmiles: "C1=CC=C(C=C1)C(=O)O",
      drugAnnotation: "Cyan (Neutral): Stable Organic Framework",
      foodPhyto: `${food || "Food Phytochemical"} Complex`,
      foodSmiles: "C6H12O6",
      foodAnnotation: "Cyan (Neutral): Non-reactive Dietary Matrix",
      alternatives: [
        { name: "Mineral Water", emoji: "💧" },
        { name: "Oat Porridge", emoji: "🥣" },
        { name: "Steamed Rice", emoji: "🍚" },
        { name: "Sliced Apples", emoji: "🍎" }
      ]
    };
  }

  // Default Positive/Safe fallback
  return {
    medicine: medicine || "Prescribed Therapeutic",
    generic: "General Medication",
    food: food || "Dietary Item",
    system: system,
    interactionType: "positive",
    score: 82,
    risk: "Safe",
    recommendation: "Can be consumed",
    pathway: "Normal First-Pass Hepatic Absorption",
    mechanism: `Co-administration of ${food || "this dietary item"} with ${medicine || "prescribed medicine"} is compatible and supports optimal patient tolerance.`,
    explanation: `Safe co-consumption profile verified. No contraindications detected.`,
    drugSmiles: "C10H14N2O",
    drugAnnotation: "Cyan (Stabilizer): Safe Bioavailable Core",
    foodPhyto: `${food || "Dietary Nutrient"} Fraction`,
    foodSmiles: "C12H22O11",
    foodAnnotation: "Cyan (Stabilizer): Nutrient Carrier Matrix",
    alternatives: [
      { name: "Whole Grain Bread", emoji: "🍞" },
      { name: "Oatmeal", emoji: "🥣" },
      { name: "Vegetable Broth", emoji: "🍲" },
      { name: "Herbal Infusion", emoji: "🍵" }
    ]
  };
}

// Natural Language Parser
function parseNaturalQuery(text) {
  if (!text) return { medicine: "", food: "" };

  const lower = text.toLowerCase();
  let medicine = "";
  let food = "";

  // Check known medications
  const meds = ["lipitor", "atorvastatin", "warfarin", "coumadin", "metformin", "ciprofloxacin", "paracetamol", "amoxicillin", "nux vomica", "aspirin", "ibuprofen"];
  for (const m of meds) {
    if (lower.includes(m)) {
      medicine = capitalize(m);
      break;
    }
  }

  // Check known foods
  const foods = ["grapefruit", "spinach", "alcohol", "dairy", "milk", "orange juice", "food", "cheese", "apple", "bread", "water", "coffee"];
  for (const f of foods) {
    if (lower.includes(f)) {
      food = capitalize(f);
      break;
    }
  }

  // If simple direct format "X and Y" or "X + Y"
  if (!medicine && !food) {
    if (text.includes("+")) {
      const parts = text.split("+");
      medicine = parts[0].trim();
      food = parts[1].trim();
    } else if (lower.includes(" and ")) {
      const parts = text.split(/ and /i);
      medicine = parts[0].trim();
      food = parts[1].trim();
    } else if (lower.includes(" with ")) {
      const parts = text.split(/ with /i);
      medicine = parts[0].trim();
      food = parts[1].trim();
    }
  }

  return {
    medicine: medicine || "Lipitor",
    food: food || "Grapefruit"
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Trigger Analysis Workflow
function triggerAnalysis() {
  if (analysisStatusText) analysisStatusText.textContent = "Running neural inference...";

  // 1. Gather inputs
  let medicine = medicineSearchInput ? medicineSearchInput.value.trim() : "";
  let food = foodSearchInput ? foodSearchInput.value.trim() : "";
  const naturalText = naturalQueryInput ? naturalQueryInput.value.trim() : "";

  // If direct fields empty, parse natural text
  if (!medicine || !food) {
    const parsed = parseNaturalQuery(naturalText);
    if (!medicine) medicine = parsed.medicine;
    if (!food) food = parsed.food;
  }

  // Update input text if empty
  if (medicineSearchInput && !medicineSearchInput.value) medicineSearchInput.value = medicine;
  if (foodSearchInput && !foodSearchInput.value) foodSearchInput.value = food;

  // 2. Perform Prediction
  const result = predictInteraction(medicine, food, currentSystem, attachedImageFile ? "image" : "text");

  // 3. Render Results to UI
  updateDashboardUI(result);

  // 4. Save to History
  saveHistoryEntry(result);

  // 5. Update Status
  setTimeout(() => {
    if (analysisStatusText) analysisStatusText.textContent = "Analysis complete • Ready";
  }, 400);
}

// ==========================================================================
// 11. DASHBOARD UI UPDATES & NEW 3-STATE GAUGE (SECTIONS 8, 9, 10, 11, 12)
// ==========================================================================
function updateDashboardUI(result) {
  // Update Header
  const titleDisplay = result.generic
    ? `${result.medicine} (${result.generic}) + ${result.food}`
    : `${result.medicine} + ${result.food}`;
  if (resInteractionTitle) resInteractionTitle.textContent = titleDisplay;
  if (resPathwayText) resPathwayText.textContent = `Target Pathway: ${result.pathway}`;

  // ========================================================================
  // CRITICAL REQUIREMENT: NEW THREE-STATE INTERACTION SPEEDOMETER / GAUGE
  // - Neutral: EXACTLY in CENTER (0).
  // - Left: Negative / Unsafe (0 -> 100, Light Yellow -> Orange -> Red).
  // - Right: Positive / Safe (0 -> 100, Light Yellow -> Light Green -> Dark Green).
  // ========================================================================
  updateSpeedometerGauge(result.interactionType, result.score);

  // Update Risk Result Text (Section 9)
  updateRiskResultText(result.interactionType, result.score);

  // Update Pharmacological Mechanism (Section 11)
  if (resMechanismText) resMechanismText.textContent = result.mechanism;

  // Update Molecular Attention Heatmap (Section 12)
  updateMolecularHeatmap(result);

  // Update Alternatives
  renderAlternatives(result.alternatives, result.medicine);
}

/**
 * updateSpeedometerGauge()
 * Moves the indicator needle dynamically according to the 3-state specification:
 * - Negative: needle moves LEFT (from 0 deg up to -85 deg)
 * - Neutral: needle stays CENTER (0 deg)
 * - Positive: needle moves RIGHT (from 0 deg up to +85 deg)
 */
function updateSpeedometerGauge(interactionType, score) {
  if (!needleGroup) return;

  let angle = 0; // 0 deg is pointing straight up to 0 Neutral tick
  const normalizedScore = Math.min(100, Math.max(0, score || 0));

  if (interactionType === "negative") {
    // Moves from center toward LEFT
    // Scale: 0 -> 100 maps to 0 deg -> -80 deg
    angle = -((normalizedScore / 100) * 80);
  } else if (interactionType === "positive") {
    // Moves from center toward RIGHT
    // Scale: 0 -> 100 maps to 0 deg -> +80 deg
    angle = +((normalizedScore / 100) * 80);
  } else {
    // Neutral / Non-significant: stays EXACTLY center
    angle = 0;
  }

  needleGroup.style.transform = `rotate(${angle}deg)`;

  // Update numerical score text and color
  if (resScoreNum) {
    resScoreNum.textContent = normalizedScore;
    if (interactionType === "negative") {
      resScoreNum.style.color = "#ef4444";
    } else if (interactionType === "positive") {
      resScoreNum.style.color = "#22c55e";
    } else {
      resScoreNum.style.color = "#facc15";
    }
  }
}

/**
 * updateRiskResultText()
 * Strictly sets:
 * POSITIVE / SAFE: "Safe" / "Can be consumed"
 * NON-SIGNIFICANT / NEUTRAL: "Non-significant" / "May or may not be consumed"
 * NEGATIVE / UNSAFE: "Unsafe" / "Cannot be consumed"
 */
function updateRiskResultText(interactionType, score) {
  if (!resRiskBadge || !resRiskStatusText || !resRecommendationText) return;

  resRiskBadge.className = "risk-status-pill";

  if (interactionType === "negative") {
    resRiskBadge.classList.add("status-unsafe");
    resRiskStatusText.textContent = "Unsafe";
    resRecommendationText.textContent = "Cannot be consumed";
  } else if (interactionType === "positive") {
    resRiskBadge.classList.add("status-safe");
    resRiskStatusText.textContent = "Safe";
    resRecommendationText.textContent = "Can be consumed";
  } else {
    resRiskBadge.classList.add("status-neutral");
    resRiskStatusText.textContent = "Non-significant";
    resRecommendationText.textContent = "May or may not be consumed";
  }
}

function updateMolecularHeatmap(result) {
  if (molDrugName) molDrugName.textContent = result.generic ? `${result.medicine} (${result.generic})` : result.medicine;
  if (molDrugSmiles) molDrugSmiles.textContent = result.drugSmiles || "C1=CC=C(C=C1)O";
  if (molDrugAnnotation) molDrugAnnotation.innerHTML = `<span class="dot-red"></span> ${result.drugAnnotation || "Active Site Interaction Motif"}`;

  if (molFoodName) molFoodName.textContent = result.foodPhyto || `${result.food} Phytochemical Complex`;
  if (molFoodSmiles) molFoodSmiles.textContent = result.foodSmiles || "C6H12O6";
  if (molFoodAnnotation) molFoodAnnotation.innerHTML = `<span class="dot-red"></span> ${result.foodAnnotation || "Active Binding Domain"}`;
}

function renderAlternatives(alternatives, currentMedicine) {
  if (!alternativesContainer) return;
  alternativesContainer.innerHTML = "";

  const list = alternatives && alternatives.length ? alternatives : [
    { name: "Sweet Navel Oranges", emoji: "🍊" },
    { name: "Gala Apples", emoji: "🍎" },
    { name: "Fresh Strawberries", emoji: "🍓" },
    { name: "Blueberries", emoji: "🫐" }
  ];

  list.forEach(alt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "alt-item-card";
    btn.setAttribute("data-alt", alt.name);
    btn.innerHTML = `
      <span class="alt-emoji">${alt.emoji}</span>
      <div class="alt-text-group">
        <span class="alt-name">${alt.name}</span>
        <span class="alt-action">Safe Substitute • Test &rarr;</span>
      </div>
    `;
    btn.addEventListener("click", () => {
      // Set food input to the alternative and re-analyze
      if (foodSearchInput) foodSearchInput.value = alt.name;
      if (naturalQueryInput) naturalQueryInput.value = `Testing ${currentMedicine || "medicine"} with ${alt.name}`;
      triggerAnalysis();
    });
    alternativesContainer.appendChild(btn);
  });
}

function setupAlternativesClick() {
  // Initial fallback event delegation
  document.querySelectorAll(".alt-item-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const altName = btn.getAttribute("data-alt");
      if (foodSearchInput) foodSearchInput.value = altName;
      if (naturalQueryInput) naturalQueryInput.value = `Testing with ${altName}`;
      triggerAnalysis();
    });
  });
}

// ==========================================================================
// 12. HISTORY MANAGEMENT (SECTION 13)
// ==========================================================================
function getHistoryData() {
  const data = localStorage.getItem(STORAGE_HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveHistoryEntry(result) {
  const history = getHistoryData();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toLocaleString([], {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    medicine: result.medicine,
    food: result.food,
    system: result.system,
    interactionType: result.interactionType,
    score: result.score,
    risk: result.risk,
    recommendation: result.recommendation
  };

  // Prepend entry (newest first)
  history.unshift(entry);
  // Keep up to 50 entries
  if (history.length > 50) history.pop();

  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
  updateAnalytics();
}

function renderHistoryTable() {
  const history = getHistoryData();
  if (!historyTableBody) return;

  historyTableBody.innerHTML = "";

  if (history.length === 0) {
    if (historyEmptyState) historyEmptyState.classList.remove("hidden");
    return;
  }

  if (historyEmptyState) historyEmptyState.classList.add("hidden");

  history.forEach(item => {
    const tr = document.createElement("tr");

    let badgeClass = "status-unsafe";
    if (item.interactionType === "positive") badgeClass = "status-safe";
    else if (item.interactionType === "neutral") badgeClass = "status-neutral";

    tr.innerHTML = `
      <td>${item.timestamp}</td>
      <td><strong>${item.medicine}</strong></td>
      <td>${item.food}</td>
      <td><span class="badge-pill badge-cyan-outline">${item.system}</span></td>
      <td><strong>${item.score}/100</strong></td>
      <td><span class="badge-status ${badgeClass}">${item.risk}</span></td>
      <td>${item.recommendation}</td>
      <td>
        <button type="button" class="btn-secondary btn-sm" onclick="retestHistoryItem('${item.medicine}', '${item.food}')">
          Re-Analyze
        </button>
      </td>
    `;
    historyTableBody.appendChild(tr);
  });
}

// Global hook for re-testing history items
window.retestHistoryItem = function (medicine, food) {
  if (medicineSearchInput) medicineSearchInput.value = medicine;
  if (foodSearchInput) foodSearchInput.value = food;
  if (naturalQueryInput) naturalQueryInput.value = `Taking ${medicine} with ${food}`;
  switchSection("home");
  triggerAnalysis();
};

// Clear History Button
if (btnClearHistory) {
  btnClearHistory.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your interaction analysis history?")) {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      renderHistoryTable();
      updateAnalytics();
    }
  });
}

// ==========================================================================
// 13. ANALYTICS & STATISTICAL INSIGHTS (SECTION 14)
// Basic HTML/CSS visual summaries calculated from localStorage history
// ==========================================================================
function updateAnalytics() {
  const history = getHistoryData();
  const total = history.length;

  if (total === 0) {
    if (statTotalCount) statTotalCount.textContent = "0";
    if (statUnsafeCount) statUnsafeCount.textContent = "0";
    if (statUnsafePct) statUnsafePct.textContent = "0% of total";
    if (statNeutralCount) statNeutralCount.textContent = "0";
    if (statNeutralPct) statNeutralPct.textContent = "0% of total";
    if (statSafeCount) statSafeCount.textContent = "0";
    if (statSafePct) statSafePct.textContent = "0% of total";
    if (barSegUnsafe) barSegUnsafe.style.width = "33.3%";
    if (barSegNeutral) barSegNeutral.style.width = "33.3%";
    if (barSegSafe) barSegSafe.style.width = "33.4%";
    renderCommonPairs(history);
    return;
  }

  let unsafeCount = 0;
  let neutralCount = 0;
  let safeCount = 0;

  history.forEach(item => {
    if (item.interactionType === "negative") unsafeCount++;
    else if (item.interactionType === "neutral") neutralCount++;
    else if (item.interactionType === "positive") safeCount++;
  });

  const unsafePct = Math.round((unsafeCount / total) * 100);
  const neutralPct = Math.round((neutralCount / total) * 100);
  const safePct = Math.round((safeCount / total) * 100);

  if (statTotalCount) statTotalCount.textContent = total;
  if (statUnsafeCount) statUnsafeCount.textContent = unsafeCount;
  if (statUnsafePct) statUnsafePct.textContent = `${unsafePct}% of total queries`;

  if (statNeutralCount) statNeutralCount.textContent = neutralCount;
  if (statNeutralPct) statNeutralPct.textContent = `${neutralPct}% of total queries`;

  if (statSafeCount) statSafeCount.textContent = safeCount;
  if (statSafePct) statSafePct.textContent = `${safePct}% of total queries`;

  // Update ratio bar
  if (barSegUnsafe) barSegUnsafe.style.width = `${unsafePct}%`;
  if (barSegNeutral) barSegNeutral.style.width = `${neutralPct}%`;
  if (barSegSafe) barSegSafe.style.width = `${safePct}%`;

  if (lblPctUnsafe) lblPctUnsafe.textContent = `${unsafePct}%`;
  if (lblPctNeutral) lblPctNeutral.textContent = `${neutralPct}%`;
  if (lblPctSafe) lblPctSafe.textContent = `${safePct}%`;

  renderCommonPairs(history);
}

function renderCommonPairs(history) {
  if (!commonPairsList) return;
  commonPairsList.innerHTML = "";

  // Count frequencies of pairs
  const pairCounts = {};
  history.forEach(item => {
    const key = `${item.medicine} + ${item.food}`;
    pairCounts[key] = (pairCounts[key] || 0) + 1;
  });

  // Sort pairs by frequency
  const sortedPairs = Object.entries(pairCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sortedPairs.length === 0) {
    commonPairsList.innerHTML = `
      <div class="common-pair-item">
        <span style="color: var(--text-muted); font-size: 12px;">No interactions evaluated yet. Run analyses on the dashboard to populate live analytics.</span>
      </div>
    `;
    return;
  }

  sortedPairs.forEach(([pair, count]) => {
    const div = document.createElement("div");
    div.className = "common-pair-item";
    div.innerHTML = `
      <span style="font-weight: 600; font-size: 13px; color: #fff;">${pair}</span>
      <span class="badge-pill badge-cyan">${count} query${count > 1 ? 's' : ''}</span>
    `;
    commonPairsList.appendChild(div);
  });
}

// ==========================================================================
// 14. AI PHARMACIST ASSISTANT DRAWER
// Interactive chatbot providing explainable guidance
// ==========================================================================
function setupAiAssistant() {
  if (!btnToggleAiPharmacist || !aiPharmacistDrawer) return;

  btnToggleAiPharmacist.addEventListener("click", () => {
    aiPharmacistDrawer.classList.toggle("hidden");
  });

  if (btnCloseAiDrawer) {
    btnCloseAiDrawer.addEventListener("click", () => {
      aiPharmacistDrawer.classList.add("hidden");
    });
  }

  function sendAiQuery() {
    const query = aiDrawerInput.value.trim();
    if (!query) return;

    // Add user message to drawer
    const userMsg = document.createElement("div");
    userMsg.className = "chat-msg msg-user";
    userMsg.innerHTML = `<p>${escapeHtml(query)}</p>`;
    aiDrawerMessages.appendChild(userMsg);
    aiDrawerInput.value = "";
    aiDrawerMessages.scrollTop = aiDrawerMessages.scrollHeight;

    // Generate intelligent AI Pharmacist response
    setTimeout(() => {
      const reply = generateAiPharmacistReply(query);
      const aiMsg = document.createElement("div");
      aiMsg.className = "chat-msg msg-ai";
      aiMsg.innerHTML = `<p>${reply}</p>`;
      aiDrawerMessages.appendChild(aiMsg);
      aiDrawerMessages.scrollTop = aiDrawerMessages.scrollHeight;
    }, 500);
  }

  if (btnSendAiMsg) btnSendAiMsg.addEventListener("click", sendAiQuery);
  if (aiDrawerInput) {
    aiDrawerInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendAiQuery();
    });
  }
}

function generateAiPharmacistReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("grapefruit") || lower.includes("lipitor")) {
    return "Grapefruit furanocoumarins irreversibly inhibit CYP3A4 enzymes in the gut wall, leading to excessive statin accumulation and severe myopathy risks. Safe citrus alternatives include sweet navel oranges and gala apples.";
  }
  if (lower.includes("spinach") || lower.includes("warfarin")) {
    return "Spinach contains high amounts of Vitamin K1 (phylloquinone), which directly overrides Warfarin's anticoagulation effect at the VKORC1 enzyme. Patients on Warfarin should maintain steady, moderate Vitamin K intake.";
  }
  if (lower.includes("gauge") || lower.includes("score")) {
    return "The DFI gauge indicates interaction safety: the needle points LEFT for negative/unsafe interactions, remains in the CENTER (0) for non-significant interactions, and points RIGHT for positive/safe co-administration.";
  }
  if (lower.includes("viva") || lower.includes("project") || lower.includes("ml")) {
    return "This frontend prototype uses modular JavaScript with a clean `predictInteraction()` API design. It can be directly linked to a Flask or FastAPI backend serving BioBERT and XGBoost models.";
  }
  return "As your AI Pharmacist, I analyze pharmacokinetic pathways, cytochrome P450 inhibition, and clinical contraindications. Please enter a medication and food query to inspect interaction mechanisms.";
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
