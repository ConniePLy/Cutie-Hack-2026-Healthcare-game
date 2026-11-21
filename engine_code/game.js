// 

const STAGE_FILES = [
  "narrative_data/0_prep_phase.json",
  "narrative_data/1_identity_verification.json",
  "narrative_data/2_medical_procedure.json",
  "narrative_data/3_healthcare_provider.json",
  "narrative_data/4_billing_information.json",
  "narrative_data/5_insurance_policy.json"
];
const ENDINGS_FILE = "narrative_data/6_endings.json";

// 1. RANDOMIZED PATIENT DOSSIER (Covers all 5 healthcare categories)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const caseProfile = {
  // 1. Identity Verification
  memberId: pick(["HF-884920", "BC-331094", "UN-550129"]),
  patientName: pick(["Jordan Taylor", "Alex Rivera"]),
  dob: pick(["04/12/1988", "11/23/1995"]),
  insuranceName: pick(["HealthFirst Blue", "CareShield Gold"]),
  homeAddress: pick(["742 Evergreen Ave", "1090 Oakridge Blvd"]),
  phoneNumber: pick(["(951) 555-0148", "(951) 555-0192"]),
  groupNumber: pick(["GRP-402", "GRP-915", "GRP-770"]),

  // 2. Medical Procedure Information
  dateOfService: pick(["10/14/2026", "11/02/2026"]),
  procedureName: pick(["Knee MRI w/o Contrast", "Outpatient Endoscopy"]),
  diagnosis: pick(["Acute Meniscus Tear", "Chronic Gastritis"]),
  procedureCode: pick(["CPT-73721", "CPT-43235"]),
  diagnosisCode: pick(["ICD-10: S83.241A", "ICD-10: K29.70"]),
  hasMedNecessityDoc: Math.random() < 0.5,

  // 3. Healthcare Provider Information
  facilityName: pick(["Riverside Valley Clinic", "Magnolia General Hospital"]),
  physicianName: pick(["Dr. Elena Rostova", "Dr. Marcus Vance"]),
  providerAddress: pick(["4500 Medical Center Dr", "880 Canyon Springs Pkwy"]),
  npi: pick(["1234567890", "9876543210"]),
  isInNetwork: Math.random() < 0.5,

  // 4. Billing Information
  totalBill: pick(["$1,450.00", "$2,800.00"]),
  hasItemizedBill: Math.random() < 0.5,
  amountPaid: pick(["$0.00", "$250.00"]),
  hasProofOfPayment: Math.random() < 0.5,
  hasOtherInsurance: Math.random() < 0.5,

  // 5. Insurance Policy Information
  planType: pick(["HMO", "PPO"]),
  effectiveDates: pick(["01/01/2026 - 12/31/2026", "06/01/2026 - 05/31/2027"]),
  deductibleMet: Math.random() < 0.5,
  copayAmount: pick(["$30 Specialist Copay", "$50 Specialist Copay"]),
  hasPriorAuth: Math.random() < 0.5
};

let currentStageIndex = 0;
let stats = { accuracy: 0, trust: 0, risk: 0 };
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

function updateStatusBar(stageText) {
  if (stageLabel) stageLabel.textContent = `Stage: ${stageText}`;
  if (statsLabel) {
    statsLabel.textContent = `Accuracy: ${stats.accuracy} | Trust: ${stats.trust} | Risk: ${stats.risk}`;
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

// SEMI-RANDOM OPTION BUILDER: Pulls 1 matching right answer + 2 random wrong decoys
function buildSemiRandomChoices(pool) {
  const matching = pool.filter((opt) => isChoiceCorrect(opt));
  const nonMatching = pool.filter((opt) => !isChoiceCorrect(opt));

  // Pick 1 valid right answer (if available)
  const chosenRight = matching.length > 0 ? [pick(matching)] : [];

  // Shuffle the wrong answers and pick up to 2 decoys
  const chosenWrong = shuffleArray(nonMatching).slice(0, 2);

  // Combine and shuffle button positions so the right answer isn't always first
  return shuffleArray([...chosenRight, ...chosenWrong]);
}

async function initGame() {
  try {
    const res = await fetch(ENDINGS_FILE);
    endingsData = (await res.json()).endings || [];
  } catch (err) {
    console.warn("Using fallback endings.");
  }
  logOutput("SYSTEM: Review your desk folders in Stage 0 before calling the insurer.");
  loadNextStage();
}

async function loadNextStage() {
  choicesBox.innerHTML = "";
  if (currentStageIndex >= STAGE_FILES.length) return showFinalEnding();

  try {
    const res = await fetch(STAGE_FILES[currentStageIndex]);
    const stageData = await res.json();
    const scenario = pick(stageData.scenarios);

    updateStatusBar(stageData.title || `Stage ${currentStageIndex}`);
    logOutput(`--- ${(stageData.title || stageData.stage).toUpperCase()} ---`);
    logOutput(scenario.prompt);

    // Stage 0 shows all prep buttons; Stages 1-5 pull 1 right + 2 random wrong options
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
    logOutput("SYSTEM: Full patient packet copied to your Call Prep Notes! Dialing now...");
  } else {
    const correct = isChoiceCorrect(choice);
    if (correct) {
      stats.accuracy += 2;
      stats.trust += 1;
      // Uses choice-specific reply if present, otherwise falls back to scenario-level reply
      logOutput(`✅ ${choice.right_reply || scenario.right_reply}`);
    } else {
      stats.risk += 2;
      stats.accuracy -= 1;
      logOutput(`⚠️ ${choice.wrong_reply || scenario.wrong_reply}`);
    }
  }

  currentStageIndex++;
  setTimeout(loadNextStage, 700);
}

function showFinalEnding() {
  updateStatusBar("Call Complete");
  logOutput("=== CALL DISCONNECTED: FINAL OUTCOME ===");

  let ending;
  if (stats.risk >= 4) {
    ending = endingsData || { title: "Ending 1: Claim Flagged for Audit", summary: "Mismatched policy, billing, or coding details caused an audit hold." };
  } else if (stats.accuracy >= 6) {
    ending = endingsData || { title: "Ending 2: Seamless Claim Approval", summary: "Every verification check matched your dossier! Claim approved in full." };
  } else {
    ending = endingsData || { title: "Ending 3: Pending Manual Review", summary: "Your claim was accepted with minor discrepancies and requires follow-up." };
  }

  logOutput(`${ending.title}\n${ending.summary}`);

  const restartBtn = document.createElement("button");
  restartBtn.className = "choice-btn";
  restartBtn.textContent = "🔄 Start New Randomized Call";
  restartBtn.onclick = () => location.reload();
  choicesBox.appendChild(restartBtn);
}

initGame();

