
const STAGE_FILES = [
  "narrative_data/0_prep_phase.json",
  "narrative_data/1_identity_verification.json",
  "narrative_data/2_medical_procedure.json",
  "narrative_data/3_healthcare_provider.json",
  "narrative_data/4_billing_information.json",
  "narrative_data/5_insurance_policy.json"
];

const ENDINGS_FILE = "narrative_data/6_endings.json";

// Select one of five complete cases per playthrough.
// Alice's identity never changes.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const CASES = [
  {
    insuranceName: "HealthFirst Blue",
    homeAddress: "742 Dinah Ave, Wonderland, OX",
    phoneNumber: "(951) 555-0148",
    groupNumber: "GRP-402",
    dateOfService: "10/14/2026",
    procedureName: "Knee MRI w/o Contrast",
    diagnosis: "Acute Medial Meniscus Tear",
    procedureCode: "CPT-73721",
    diagnosisCode: "ICD-10: S83.241A",
    hasMedNecessityDoc: true,
    facilityName: "Underland Alley Clinic",
    physicianName: "Dr. Regina White",
    providerAddress: "4500 Medical Center Dr",
    npi: "1234567890",
    isInNetwork: true,
    totalBill: "$1,450.00",
    hasItemizedBill: true,
    amountPaid: "$0.00",
    hasProofOfPayment: false,
    hasOtherInsurance: false,
    planType: "HMO",
    effectiveDates: "01/01/2026 - 12/31/2026",
    deductibleMet: false,
    copayAmount: "$20 Specialist Copay",
    hasPriorAuth: true
  },
  {
    insuranceName: "CareShield Gold",
    homeAddress: "1090 Oakridge Blvd, Looking Glass, OX",
    phoneNumber: "(951) 555-0192",
    groupNumber: "GRP-915",
    dateOfService: "11/02/2026",
    procedureName: "Outpatient Upper Endoscopy",
    diagnosis: "Chronic Unspecified Gastritis",
    procedureCode: "CPT-43235",
    diagnosisCode: "ICD-10: K29.70",
    hasMedNecessityDoc: true,
    facilityName: "Oysters' Memorial Hospital",
    physicianName: "Dr. March Lepus",
    providerAddress: "880 Suite Pkwy",
    npi: "9876543210",
    isInNetwork: true,
    totalBill: "$2,800.00",
    hasItemizedBill: true,
    amountPaid: "$150.00",
    hasProofOfPayment: true,
    hasOtherInsurance: false,
    planType: "PPO",
    effectiveDates: "06/01/2026 - 05/31/2027",
    deductibleMet: true,
    copayAmount: "$35 Specialist Copay",
    hasPriorAuth: true
  },
  {
    insuranceName: "UnitedMetro Health",
    homeAddress: "315 England Dr, Wonderland, OX",
    phoneNumber: "(951) 555-0174",
    groupNumber: "GRP-770",
    dateOfService: "09/28/2026",
    procedureName: "CT Scan Abdomen & Pelvis",
    diagnosis: "Acute Right Lower Quadrant Pain",
    procedureCode: "CPT-74177",
    diagnosisCode: "ICD-10: R10.31",
    hasMedNecessityDoc: true,
    facilityName: "Regina White Outpatient Center",
    physicianName: "Dr. Montgomery Yertle",
    providerAddress: "1220 Lobster Ave, Suite 300",
    npi: "4561237890",
    isInNetwork: true,
    totalBill: "$920.00",
    hasItemizedBill: true,
    amountPaid: "$250.00",
    hasProofOfPayment: true,
    hasOtherInsurance: false,
    planType: "EPO",
    effectiveDates: "03/01/2026 - 02/28/2027",
    deductibleMet: false,
    copayAmount: "$50 Specialist Copay",
    hasPriorAuth: false
  },
  {
    insuranceName: "AetnaPlus Select",
    homeAddress: "8842 This Way Ave, Underland, OX",
    phoneNumber: "(909) 555-0136",
    groupNumber: "GRP-218",
    dateOfService: "11/15/2026",
    procedureName: "Comprehensive Echocardiogram",
    diagnosis: "Atypical Chest Pain / Palpitations",
    procedureCode: "CPT-93306",
    diagnosisCode: "ICD-10: R07.89",
    hasMedNecessityDoc: true,
    facilityName: "Knave's Medical Group",
    physicianName: "Dr. David Okafor",
    providerAddress: "6900 That Way Ave",
    npi: "7894561230",
    isInNetwork: false,
    totalBill: "$3,640.00",
    hasItemizedBill: true,
    amountPaid: "$400.00",
    hasProofOfPayment: true,
    hasOtherInsurance: true,
    planType: "POS",
    effectiveDates: "09/01/2026 - 08/31/2027",
    deductibleMet: true,
    copayAmount: "$0 (Deductible Met)",
    hasPriorAuth: false
  },
  {
    insuranceName: "CignaCare Premier",
    homeAddress: "510 Tiger Lily Pkwy, Rabbit Hollow, OX",
    phoneNumber: "(951) 555-0183",
    groupNumber: "GRP-654",
    dateOfService: "10/03/2026",
    procedureName: "Lumbar Epidural Steroid Injection",
    diagnosis: "Lumbar Radiculopathy",
    procedureCode: "CPT-62323",
    diagnosisCode: "ICD-10: M54.16",
    hasMedNecessityDoc: true,
    facilityName: "Fox Springs Surgical Pavilion",
    physicianName: "Dr. Bill Chimney",
    providerAddress: "2450 Tiger Lily Blvd",
    npi: "3216549870",
    isInNetwork: true,
    totalBill: "$1,180.00",
    hasItemizedBill: true,
    amountPaid: "$75.00",
    hasProofOfPayment: true,
    hasOtherInsurance: false,
    planType: "HDHP",
    effectiveDates: "07/01/2026 - 06/30/2027",
    deductibleMet: false,
    copayAmount: "20% Coinsurance",
    hasPriorAuth: true
  }
];

// This is the single answer key for the entire playthrough.
const selectedCase = pick(CASES);

const caseProfile = {
  // 1. Identity Verification
  memberId: pick(["HF-884920", "BC-331094", "UN-550129", "AE-719402", "CG-604815"]),
  patientName: "Alice Lidell",
  dob: pick(["04/12/1988", "11/23/1995", "07/08/1979", "02/19/2001", "09/30/1984"]),
  insuranceName: "Ace Insurance",
  homeAddress: pick([
    "742 Dinah Ave, Wonderland, OX",
    "1090 Oakridge Blvd, Looking Glass, OX",
    "315 Englan Dr, Wonderland, OX",
    "8842 This Way Ave, Underland, OX",
    "510 Tiger Lily Pkwy, Rabbit Hollow, OX"
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
    "Underland Alley Clinic",
    "Oysters' Memorial Hospital",
    "Regina White Outpatient Center",
    "Knave's Medical Group",
    "Fox Springs Surgical Pavilion"
  ]),
  physicianName: pick([
    "Dr. Regina White",
    "Dr. March Lepus",
    "Dr. Montgomery Yurtle",
    "Dr. David Okafor",
    "Dr. Bill Chimney"
  ]),
  providerAddress: pick([
    "4500 Medical Center Dr",
    "880 Suite Pkwy",
    "1220 Lobster Ave, Suite 300",
    "6900 That Way Ave",
    "2450 Tiger Lily Blvd"
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
};*/

// Score and stage tracking
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
  if (stageLabel) {
    stageLabel.textContent = `Stage: ${stageText}`;
  }

  if (statsLabel) {
    const pct = getScorePercent();
    statsLabel.textContent =
      `Score: ${correctAnswers}/${totalQuestions} (${pct}%)`;
  }
}

function addPrepNote(title, lines) {
  const div = document.createElement("div");
  div.className = "note-item";

  const heading = document.createElement("strong");
  heading.textContent = title;
  div.appendChild(heading);

  lines.forEach((line) => {
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode(line));
  });

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
    if (caseProfile[key] !== expectedValue) {
      return false;
    }
  }

  return true;
}

// Alice's fixed identity overrides old identity choices in the JSON.
function choicesForScenario(scenario) {
  const pool = scenario.option_pool || scenario.choices || [];

  const fixedFields = {
    id_name_check: "patientName",
    id_dob_check: "dob",
    id_member_check: "memberId"
  };

  const field = fixedFields[scenario.id];

  if (!field) {
    return pool;
  }

  const correctValue = caseProfile[field];

  const correctChoice = {
    text: correctValue,
    requires: {
      [field]: correctValue
    }
  };

  const distractors = pool.filter(
    (choice) => choice.text !== correctValue
  );

  return [
    correctChoice,
    ...distractors.slice(0, 4)
  ];
}

// Display one correct and four incorrect choices.
function buildSemiRandomChoices(pool) {
  const matching = pool.filter(
    (opt) => isChoiceCorrect(opt)
  );

  const nonMatching = pool.filter(
    (opt) => !isChoiceCorrect(opt)
  );

  const chosenRight =
    matching.length > 0 ? [pick(matching)] : [];

  const chosenWrong =
    shuffleArray(nonMatching).slice(0, 4);

  return shuffleArray([
    ...chosenRight,
    ...chosenWrong
  ]);
}

// Initialize the game.
async function initGame() {
  try {
    const res = await fetch(ENDINGS_FILE);
    endingsData = (await res.json()).endings || [];
  } catch (err) {
    console.warn("Using built-in endings.");
  }

  // Generate the supporting documents before the call.
  renderCaseDocuments();

  updateStatusBar("0. Prep Phase");
  logOutput(
    "SYSTEM: Review your desk folders in Stage 0 before calling the insurer."
  );

  loadNextStage();
}

async function loadNextStage() {
  choicesBox.innerHTML = "";

  if (currentStageIndex >= STAGE_FILES.length) {
    return showFinalEnding();
  }

  try {
    const res = await fetch(
      STAGE_FILES[currentStageIndex]
    );

    const stageData = await res.json();

    // Ask all six identity questions in order.
    // Other stages retain the existing random-question behavior.
    const scenario = currentStageIndex === 1
      ? stageData.scenarios[currentScenarioIndex]
      : pick(stageData.scenarios);

    if (!scenario) {
      throw new Error("No scenario found for this stage");
    }

    updateStatusBar(
      stageData.title || `Stage ${currentStageIndex}`
    );

    logOutput(
      `--- ${(stageData.title || stageData.stage).toUpperCase()} ---`
    );

    logOutput(scenario.prompt);

    const rawPool = choicesForScenario(scenario);

    const buttonsToRender =
      currentStageIndex === 0
        ? rawPool
        : buildSemiRandomChoices(rawPool);

    buttonsToRender.forEach((choice) => {
      const btn = document.createElement("button");

      btn.className = "choice-btn";
      btn.textContent = choice.text;

      btn.onclick = () =>
        handleChoiceSelection(choice, scenario);

      choicesBox.appendChild(btn);
    });

  } catch (err) {
    logOutput(
      `ERROR: Failed to load ${STAGE_FILES[currentStageIndex]}. Check JSON syntax.`
    );

    console.error(err);
  }
}

// All notes use the same selected medical case.
// They are generated at the start, not during the dialogue.
function renderCaseDocuments() {
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
    `Med Necessity Doc: ${caseProfile.hasMedNecessityDoc ? "Attached" : "Missing"}`
  ]);

  addPrepNote("3. Provider", [
    `${caseProfile.physicianName} (${caseProfile.facilityName})`,
    `NPI: ${caseProfile.npi} | ${caseProfile.providerAddress}`,
    `Network: ${caseProfile.isInNetwork ? "In-Network" : "Out-of-Network"}`
  ]);

  addPrepNote("4. Billing", [
    `Total: ${caseProfile.totalBill} | Paid: ${caseProfile.amountPaid}`,
    `Itemized Bill: ${caseProfile.hasItemizedBill ? "Yes" : "No"}`,
    `Receipt: ${caseProfile.hasProofOfPayment ? "Yes" : "No"}`,
    `Other Coverage: ${caseProfile.hasOtherInsurance ? "Yes (Dual)" : "None"}`
  ]);

  addPrepNote("5. Policy", [
    `Plan: ${caseProfile.planType} (${caseProfile.effectiveDates})`,
    `Deductible: ${caseProfile.deductibleMet ? "Met" : "Unmet"}`,
    `Copay: ${caseProfile.copayAmount}`,
    `Prior Auth: ${caseProfile.hasPriorAuth ? "Approved" : "None"}`
  ]);

  addPrepNote("6. Original EOB (prior claim)", [
    "Original claim status: Denied",
    "Initial submission missing supporting details",
    `Service date: ${caseProfile.dateOfService}`,
    `Billed: ${caseProfile.totalBill}`,
    "Use the records above to request reconsideration."
  ]);
}

function handleChoiceSelection(choice, scenario) {
  logOutput(`YOU: "${choice.text}"`);

  // Stage 0: Preparation
  if (currentStageIndex === 0) {
    logOutput(
      "SYSTEM: Patient dossier is ready! Dialing now..."
    );
  } else {
    // Stages 1-5: Score the response.
    totalQuestions++;

    const correct = isChoiceCorrect(choice);

    if (correct) {
      correctAnswers++;

      logOutput(
        `✅ ${choice.right_reply || scenario.right_reply}`
      );
    } else {
      logOutput(
        `⚠️ ${choice.wrong_reply || scenario.wrong_reply}`
      );
    }
  }

  // Finish all six Phase 1 questions before advancing.
  if (
    currentStageIndex === 1 &&
    currentScenarioIndex < 5
  ) {
    currentScenarioIndex++;
  } else {
    currentStageIndex++;
    currentScenarioIndex = 0;
  }

  setTimeout(loadNextStage, 700);
}

// Three endings based on score.
function showFinalEnding() {
  const finalPercent = getScorePercent();

  updateStatusBar(
    `Call Complete (${finalPercent}%)`
  );

  logOutput(
    `=== CALL DISCONNECTED | FINAL SCORE: ${correctAnswers}/${totalQuestions} (${finalPercent}%) ===`
  );

  let ending;

  if (finalPercent >= 80) {
    ending = endingsData.find(
      (e) => e.id === "approved"
    ) || {
      title: "CLAIM APPROVED",
      summary: "Your claim has been approved."
    };
  } else if (finalPercent >= 50) {
    ending = endingsData.find(
      (e) => e.id === "semi_approved"
    ) || {
      title: "CLAIM PARTIALLY APPROVED",
      summary: "Your claim requires additional review."
    };
  } else {
    ending = endingsData.find(
      (e) => e.id === "denied"
    ) || {
      title: "CLAIM DENIED",
      summary: "Your claim has been denied."
    };
  }

  logOutput(
    `${ending.title}\n${ending.summary}`
  );

  choicesBox.innerHTML = "";

  const restartBtn = document.createElement("button");
  restartBtn.className = "choice-btn";
  restartBtn.textContent = "Start New Randomized Call";

  restartBtn.onclick = () => location.reload();

  choicesBox.appendChild(restartBtn);
}

// Start game.
initGame();
