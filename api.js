const USERNAME = "coalition";
const PASSWORD = "skills-test";
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

async function fetchPatientData() {
  const headers = new Headers({
    Authorization: "Basic " + btoa(`${USERNAME}:${PASSWORD}`)
  });

  try {
    const response = await fetch(API_URL, { headers });

    if (!response.ok) {
      throw new Error(`Fetching was unsuccessful: ${response.statusText}`);
    }

    const data = await response.json();
    displayPatientData(data);
    displaySingleProfile(data);
    displaySingleLabResult(data);
    displaySingleDiagnosticList(data);
    initiateChart(data[3]);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function displayPatientData(data) {
  const patientListDiv = document.getElementById("patients-list");

  data.forEach(patient => {
    const patientCard = document.createElement("div");
    patientCard.classList.add("patient-card");
    if (patient.name === "Jessica Taylor") {
      patientCard.classList.add("selected");
    }
    
    patientCard.innerHTML = `
      <img class="patient-card-img" src="${patient.profile_picture}" alt="Profile Picture"/>
      <div class="patient-info">
        <p>${patient.name}</p>
        <p>${patient.gender}, ${patient.age}</p>
      </div>
      <img class="patient-card-right-flex" src="/images/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="More Options"/>
    `;
    
    patientListDiv.appendChild(patientCard);
  });
}

function displaySingleProfile(data) {
  const singleProfileDiv = document.getElementById("profile-container");
  const singlePatient = data[3];
  const profileInfo = document.createElement("div");
  profileInfo.classList.add("profile-container-inner");

  profileInfo.innerHTML = `
    <div class="header">
      <img src="${singlePatient.profile_picture}" class="profile-head-img" alt="Profile Picture"/>
      <p>${singlePatient.name}</p>
    </div>
    <div class="info-card">
      <img src="/images/BirthIcon.svg" alt="Birth Icon"/>
      <div class="info-details">
        <p>Date Of Birth</p>
        <p>${singlePatient.date_of_birth}</p>
      </div>
    </div>
    <div class="info-card">
      <img src="/images/FemaleIcon.svg" alt="Gender Icon"/>
      <div class="info-details">
        <p>Gender</p>
        <p>${singlePatient.gender}</p>
      </div>
    </div>
    <div class="info-card">
      <img src="/images/PhoneIcon.svg" alt="Phone Icon"/>
      <div class="info-details">
        <p>Phone Number</p>
        <p>${singlePatient.phone_number}</p>
      </div>
    </div>
    <div class="info-card">
      <img src="/images/PhoneIcon.svg" alt="Emergency Contact Icon"/>
      <div class="info-details">
        <p>Emergency</p>
        <p>${singlePatient.emergency_contact}</p>
      </div>
    </div>
    <div class="info-card">
      <img src="/images/InsuranceIcon.svg" alt="Insurance Icon"/>
      <div class="info-details">
        <p>Insurance Provider</p>
        <p>${singlePatient.insurance_type}</p>
      </div>
    </div>
    <button>Show All Information</button>
  `;

  singleProfileDiv.appendChild(profileInfo);
}

function displaySingleLabResult(data) {
  const labResultsDiv = document.getElementById("lab-results-list");
  const labResults = data[3].lab_results;

  labResults.forEach(labResult => {
    const resultCard = document.createElement("div");
    resultCard.classList.add("lab-result-card");
    resultCard.innerHTML = `
      <p>${labResult}</p>
      <img src="/images/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="Download Icon"/>
    `;
    labResultsDiv.appendChild(resultCard);
  });
}

function displaySingleDiagnosticList(data) {
  const diagnosticListTable = document.getElementById("diagnostic-list-table");
  const diagnosticList = data[3].diagnostic_list;

  diagnosticList.forEach(diagnosis => {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
      <td>${diagnosis.name}</td>
      <td>${diagnosis.description}</td>
      <td>${diagnosis.status}</td>
    `;
    diagnosticListTable.appendChild(tableRow);
  });
}

function initiateChart(data = {}) {
  const diagnosisHistory = data.diagnosis_history || [];
  const diastolicAverageElem = document.getElementById("distolicAverage");
  const systolicAverageElem = document.getElementById("systolicAverage");

  if (diagnosisHistory.length >= 3) {
    diastolicAverageElem.innerText = diagnosisHistory[2].blood_pressure.diastolic.value;
    systolicAverageElem.innerText = diagnosisHistory[2].blood_pressure.systolic.value;
  }

  const ctx = document.getElementById("my-chart");
  const labels = diagnosisHistory.map(d => d.month).slice(0, 6).reverse();
  const diastolicValues = diagnosisHistory.map(d => d.blood_pressure.diastolic.value).slice(0, 6).reverse();
  const systolicValues = diagnosisHistory.map(d => d.blood_pressure.systolic.value).slice(0, 6).reverse();

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Diastolic",
          data: diastolicValues,
          fill: true,
          borderColor: "#7E6CAB",
          backgroundColor: "transparent",
          tension: 0.4,
          pointBackgroundColor: "#8C6FE6",
          pointBorderColor: "#ffffff",
          radius: 6
        },
        {
          label: "Systolic",
          data: systolicValues,
          fill: true,
          borderColor: "#C26EB4",
          backgroundColor: "transparent",
          pointBackgroundColor: "#E66FD2",
          pointBorderColor: "#ffffff",
          tension: 0.4,
          radius: 6
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

fetchPatientData();
