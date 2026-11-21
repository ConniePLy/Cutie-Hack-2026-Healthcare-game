const STAGE_FILES = [
  "narrative_data/0_prep_phase.json",
  "narrative_data/1_identity_verification.json",
  "narrative_data/2_medical_procedure.json",
  "narrative_data/3_healthcare_provider.json",
  "narrative_data/4_billing_information.json",
  "narrative_data/5_insurance_policy.json"
];
const ENDINGS_FILE = "narrative_data/6_endings.json";

// 1. RANDOMIZED PATIENT DOSSIER (5 elements per pick() array across all 5 categories!)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const caseProfile = {
  // 1. Identity Verification
  memberId: pick(["HF-884920", "BC-331094", "UN-550129", "AE-719402", "CG-604815"]),
  patientName: pick(["Jordan Taylor", "Alex Rivera", "Samira Patel", "Marcus Chen", "Elena Morales"]),
  dob: pick(["04/12/1988", "11/23/1995", "07/08/1979", "02/19/2001", "09/30/1984"]),
  insuranceName: pick(["HealthFirst Blue", "CareShield Gold", "UnitedMetro Health", "AetnaPlus Select", "CignaCare Premier"]),
  homeAddress: pick([
    "742 Evergreen Ave, Riverside, CA",
    "1090 Oakridge Blvd, Moreno Valley, CA",
    "315 Canyon Crest Dr, Riverside, CA",
    "8842 Magnolia Ave, Corona, CA",
    "510 University Pkwy, San Bernardino, CA"
  ]),
  phoneNumber: pick(["(951) 555-0148", "(951) 555-0192", "(951) 555-0174", "(909) 555-0136", "(951) 555-0183"]),
  groupNumber: pick(["GRP-402", "GRP-915", "GRP-770", "GRP-218", "GRP-654"]),

  // 2. Medical Procedure Information
  dateOfService: pick(["10/14/2026", "11/02/2026", "09/28/2026", "11/15/2026", "10/03/2026"]),
  procedureName: pick([
    "Knee MRI w/o Contrast",
    "Outpatient Upper Endoscopy",
    "CT Scan Abdomen & Pelvis",
    "Comprehensive Echocardiogram",
    "Lumbar Epidural Steroid Injection"
  ]),
  diagnosis: pick([
    "Acute Medial Meniscus Tear",
    "Chronic Unspecified Gastritis",
    "Acute Right Lower Quadrant Pain",
    "Atypical Chest Pain / Palpitations",
    "Lumbar Radiculopathy"
  ]),
  procedureCode: pick(["CPT-73721", "CPT-43235", "CPT-74177", "CPT-93306", "CPT-62323"]),
  diagnosisCode: pick(["ICD-10: S83.241A", "ICD-10: K29.70", "ICD-10: R10.31", "ICD-10: R07.89", "ICD-10: M54.16"]),
  hasMedNecessityDoc: Math.random() < 0.5,

  // 3. Healthcare Provider Information
  facilityName: pick([
    "Riverside Valley Clinic",
    "Magnolia General Hospital",
    "Inland Empire Outpatient Center",
    "Canyon Springs Medical Group",
    "Box Springs Surgical Pavilion"
  ]),
  physicianName: pick([
    "Dr. Elena Rostova",
    "Dr. Marcus Vance",
    "Dr. Priya Nair",
    "Dr. David Okafor",
    "Dr. Hannah Cho"
  ]),
  providerAddress: pick([
    "4500 Medical Center Dr",
    "880 Canyon Springs Pkwy",
    "1220 Iowa Ave, Suite 300",
    "6900 Brockton Ave",
    "2450 Alessandro Blvd"
  ]),
  npi: pick(["1234567890", "9876543210", "4561237890", "7894561230", "3216549870"]),
  isInNetwork: Math.random() < 0.5,

  // 4. Billing Information
  totalBill: pick(["$1,450.00", "$2,800.00", "$920.00", "$3,640.00", "$1,180.00"]),
  hasItemizedBill: Math.random() < 0.5,
  amountPaid: pick(["$0.00", "$150.00", "$250.00", "$400.00", "$75.00"]),
  hasProofOfPayment: Math.random() < 0.5,
  hasOtherInsurance: Math.random() < 0.5,

  // 5. Insurance Policy Information
  planType: pick(["HMO", "PPO", "EPO", "POS", "HDHP"]),
  effectiveDates: pick([
    "01/01/2026 - 12/31/2026",
    "06/01/2026 - 05/31/2027",
    "03/01/2026 - 02/28/2027",
    "09/01/2026 - 08/31/2027",
    "07/01/2026 - 06/30/2027"
  ]),
  deductibleMet: Math.random() < 0.5,
  copayAmount: pick([
    "$20 Specialist Copay",
    "$35 Specialist Copay",
    "$50 Specialist Copay",
    "$0 (Deductible Met)",
    "20% Coinsurance"
  ]),
  hasPriorAuth: Math.random() < 0.5
};


// 2. PERCENTAGE SCORE TRACKING
let currentStageIndex = 0;
let currentScenarioIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let endingsData = [];

const outputBox = document.getElementById("output-box");
const choicesBox = document.getElementById("choices-box");
const notesList = document.getElementById("notes-list");
const stageLabel = document.getElementById("stage-label");
const statsLabel = document.getElementById("stats-label");

function logOutput(text) {
  outputBox.value += text + "\n\n";
  outputBox.scrollTop = outputBox.scrollHeight;
}

function getScorePercent() {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

function updateStatusBar(stageText) {
  if (stageLabel) stageLabel.textContent = `Stage: ${stageText}`;
  if (statsLabel) {
    const pct = getScorePercent();
    statsLabel.textContent = `Score: ${correctAnswers}/${totalQuestions} (${pct}%)`;
  }
}

function addPrepNote(title, lines) {
  const div = document.createElement("div");
  div.className = "note-item";
  div.innerHTML = `<strong>${title}</strong><br>${lines.join("<br>")}`;
  notesList.appendChild(div);
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isChoiceCorrect(choice) {
  if (!choice.requires) return true;
  for (const [key, expectedValue] of Object.entries(choice.requires)) {
    if (caseProfile[key] !== expectedValue) return false;
  }
  return true;
}

function buildSemiRandomChoices(pool) {
  const matching = pool.filter((opt) => isChoiceCorrect(opt));
  const nonMatching = pool.filter((opt) => !isChoiceCorrect(opt));

  const chosenRight = matching.length > 0 ? [pick(matching)] : [];
  const chosenWrong = shuffleArray(nonMatching).slice(0, 4);

  return shuffleArray([...chosenRight, ...chosenWrong]);
}

async function initGame() {
  try {
    const res = await fetch(ENDINGS_FILE);
    endingsData = (await res.json()).endings || [];
  } catch (err) {
    console.warn("Using built-in endings.");
  }
  updateStatusBar("0. Prep Phase");
  logOutput("SYSTEM: Review your desk folders in Stage 0 before calling the insurer.");
  loadNextStage();
}

async function loadNextStage() {
  choicesBox.innerHTML = "";
  if (currentStageIndex >= STAGE_FILES.length) return showFinalEnding();

  try {
    const res = await fetch(STAGE_FILES[currentStageIndex]);
    const stageData = await res.json();
    const scenario = currentStageIndex === 1
      ? stageData.scenarios[currentScenarioIndex]
      : pick(stageData.scenarios);


    updateStatusBar(stageData.title || `Stage ${currentStageIndex}`);
    logOutput(`--- ${(stageData.title || stageData.stage).toUpperCase()} ---`);
    logOutput(scenario.prompt);

    const rawPool = scenario.option_pool || scenario.choices;
    const buttonsToRender =
      currentStageIndex === 0 ? rawPool : buildSemiRandomChoices(rawPool);

    buttonsToRender.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.text;
      btn.onclick = () => handleChoiceSelection(choice, scenario);
      choicesBox.appendChild(btn);
    });
  } catch (err) {
    logOutput(`ERROR: Failed to load ${STAGE_FILES[currentStageIndex]}. Check JSON syntax.`);
    console.error(err);
  }
}

function handleChoiceSelection(choice, scenario) {
  logOutput(`YOU: "${choice.text}"`);

  // Stage 0 (Prep Phase) is unscored and reveals the patient packet
  if (currentStageIndex === 0) {
    notesList.innerHTML = "";
    addPrepNote("1. Identity", [
      `Name: ${caseProfile.patientName} (DOB: ${caseProfile.dob})`,
      `Member ID: ${caseProfile.memberId} | Group: ${caseProfile.groupNumber}`,
      `Insurer: ${caseProfile.insuranceName}`,
      `Addr: ${caseProfile.homeAddress} | Tel: ${caseProfile.phoneNumber}`
    ]);
    addPrepNote("2. Procedure", [
      `DOS: ${caseProfile.dateOfService} | ${caseProfile.procedureName}`,
      `CPT: ${caseProfile.procedureCode} | ${caseProfile.diagnosisCode}`,
      `Diagnosis: ${caseProfile.diagnosis}`,
      `Med Necessity Doc: ${caseProfile.hasMedNecessityDoc ? "✅ Attached" : "❌ Missing"}`
    ]);
    addPrepNote("3. Provider", [
      `${caseProfile.physicianName} (${caseProfile.facilityName})`,
      `NPI: ${caseProfile.npi} | ${caseProfile.providerAddress}`,
      `Network: ${caseProfile.isInNetwork ? "✅ In-Network" : "⚠️ Out-of-Network"}`
    ]);
    addPrepNote("4. Billing", [
      `Total: ${caseProfile.totalBill} | Paid: ${caseProfile.amountPaid}`,
      `Itemized Bill: ${caseProfile.hasItemizedBill ? "✅ Yes" : "❌ No"} | Receipt: ${caseProfile.hasProofOfPayment ? "✅ Yes" : "❌ No"}`,
      `Other Coverage: ${caseProfile.hasOtherInsurance ? "Yes (Dual)" : "None"}`
    ]);
    addPrepNote("5. Policy", [
      `Plan: ${caseProfile.planType} (${caseProfile.effectiveDates})`,
      `Deductible: ${caseProfile.deductibleMet ? "✅ Met" : "❌ Unmet"} | Copay: ${caseProfile.copayAmount}`,
      `Prior Auth: ${caseProfile.hasPriorAuth ? "✅ Approved" : "❌ None"}`
    ]);
    logOutput("SYSTEM: Patient dossier added to your Call Prep Notes! Dialing now...");
  } else {
    // Stages 1-5: Count total questions & correct answers
    totalQuestions++;
    const correct = isChoiceCorrect(choice);

    if (correct) {
      correctAnswers++;
      logOutput(`✅ ${choice.right_reply || scenario.right_reply}`);
    } else {
      logOutput(`⚠️ ${choice.wrong_reply || scenario.wrong_reply}`);
    }
  }

  if (currentStageIndex === 1 && currentScenarioIndex < 5) {
  currentScenarioIndex++;
} else {
  currentStageIndex++;
  currentScenarioIndex = 0;
}

setTimeout(loadNextStage, 700);
}

// 3. THREE ENDINGS BASED ON PERCENTAGE SCORE
function showFinalEnding() {
  const finalPercent = getScorePercent();
  updateStatusBar(`Call Complete (${finalPercent}%)`);
  logOutput(`=== CALL DISCONNECTED | FINAL SCORE: ${correctAnswers}/${totalQuestions} (${finalPercent}%) ===`);

  let ending;

  if (finalPercent >= 80) {
    // 80% and above -> APPROVED
    ending = endingsData.find((e) => e.id === "approved") || {
      title: "✅ ENDING 1: CLAIM APPROVED (80%+)",
      summary: "Your information matched across almost every verification check. Your procedure and coverage are fully approved!"
    };
  } else if (finalPercent >= 50) {
    // 50% to 79% -> SEMI-APPROVED
    ending = endingsData.find((e) => e.id === "semi_approved") || {
      title: "⚠️ ENDING 2: SEMI-APPROVED (50% - 79%)",
      summary: "Most of your claim cleared, though one or two mismatched details require follow-up paperwork before full payout."
    };
  } else {
    // Below 50% -> DENIED
    ending = endingsData.find((e) => e.id === "denied") || {
      title: "🛑 ENDING 3: CLAIM DENIED (Below 50%)",
      summary: "Too many verification mismatches occurred during the call. Your claim was denied and must be resubmitted."
    };
  }

  logOutput(`${ending.title}\n${ending.summary}`);

  const restartBtn = document.createElement("button");
  restartBtn.className = "choice-btn";
  restartBtn.textContent = "🔄 Start New Randomized Call";
  restartBtn.onclick = () => location.reload();
  choicesBox.appendChild(restartBtn);
}
