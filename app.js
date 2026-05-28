// RX8E 2026 Setup Sheet App
// Komplett setup-logger fÃ¶r XRAY RX8E 2026

const setups = JSON.parse(localStorage.getItem('rx8e_setups') || '[]');
let currentSetup = null;

// === DEFAULT/BASIC SETUP frÃ¥n XRAY ===
const DEFAULT_SETUP = {
  name: "RX8E Basic Setup 2026",
  date: new Date().toISOString().split('T')[0],
  track: "",
  
  // === GEOMETRY ===
  // FRONT
  frontCamber: "1.5",
  frontCaster: "6",
  frontToe: "1.5",  // toe-out i grader
  frontRideHeight: "8.0",
  
  // REAR
  rearCamber: "2.0",
  rearToe: "3",  // toe-in i grader
  rearRideHeight: "9.0",
  
  // === SHOCKS ===
  frontShockOil: "600",
  frontShockSpring: "5.6",  // spring rate
  frontShockPosition: "2-DOT KIT",  // shock tower position
  frontShockLength: "",
  
  rearShockOil: "600",
  rearShockSpring: "5.0",  // spring rate
  rearShockPosition: "3",
  rearShockLength: "",
  
  // === ANTI-ROLL BAR ===
  frontAntiRollBar: "NO",
  rearAntiRollBar: "NO",
  
  // === DIFFERENTIAL ===
  frontDiffOil: "5000",
  centerDiffOil: "7000",
  rearDiffOil: "3000",
  frontDiffHeight: "",
  rearDiffHeight: "",
  
  // === WEIGHT DISTRIBUTION ===
  frontWeight: "",
  rearWeight: "",
  batteryPosition: "",
  electronicsPosition: "",
  
  // === BODY / AERO ===
  bodyPosition: "17",  // body post position
  bodyHeight: "2mm",  // body move/height
  wingHeight: "",
  wingAngle: "",
  aeroDisk: "NO",  // YES/NO
  
  // === ELECTRONICS ===
  esc: "",
  motor: "",
  motorTiming: "",
  turboBoost: "",
  servo: "",
  receiver: "",
  battery: "",
  
  // === GEARING ===
  pinion: "",
  spurGear: "",
  internalRatio: "3.31",  // XRAY RX8E default
  finalRatio: "",
  
  // === TIRES ===
  frontTireBrand: "",
  frontTireCompound: "",
  frontTireInserts: "",
  frontWheelType: "",
  
  rearTireBrand: "",
  rearTireCompound: "",
  rearTireInserts: "",
  rearWheelType: "",
  
  // === TRACK CONDITIONS ===
  trackSurface: "",  // asphalt, carpet, etc.
  trackLayout: "",   // technical, fast, mixed
  trackTemperature: "",
  airTemperature: "",
  humidity: "",
  
  // === RUNTIME DATA ===
  laps: "",
  bestLapTime: "",
  raceTime: "",
  finalPosition: "",
  qualifyingPosition: "",
  
  // === NOTES ===
  notes: `Front/Rear:
- Ride Height: 8.0/9.0mm
- Toe: 1.5Â° toe-out fram, 3Â° bak
- Camber: 1.5Â° fram, 2.0Â° bak
- Caster: 6Â° fram
- Shock Oil: 600 bÃ¥da
- Shock Positions: 2-DOT KIT fram, 3 bak
- Shock Springs: 5.6 fram, 5.0 bak
- Anti-Roll Bar: NO fram och bak
- Diff Oil: 5000/7000/3000 (F/C/R)
- Body Position: 17`
};

// === ALLA FÃ„LT DEFINITIONER ===
const FIELD_GROUPS = [
  {
    title: "Grundinfo",
    fields: [
      { key: "name", label: "Setup-namn", type: "text", placeholder: "t.ex. RX8E Basic Setup 2026" },
      { key: "date", label: "Datum", type: "date" },
      { key: "track", label: "Bana", type: "text", placeholder: "Bannamn" },
    ]
  },
  {
    title: "Framvagn - Geometri",
    fields: [
      { key: "frontCamber", label: "Camber", type: "number", step: "0.1", suffix: "Â°", info: "Negativ camber, typiskt 1-2Â°" },
      { key: "frontCaster", label: "Caster", type: "number", step: "0.5", suffix: "Â°", info: "Typiskt 4-8Â°" },
      { key: "frontToe", label: "Toe", type: "number", step: "0.5", suffix: "Â°", info: "Toe-out, positivt vÃ¤rde = toe-out" },
      { key: "frontRideHeight", label: "Ride Height", type: "number", step: "0.5", suffix: "mm", info: "Typiskt 7-9mm fram" },
    ]
  },
  {
    title: "Bakvagn - Geometri",
    fields: [
      { key: "rearCamber", label: "Camber", type: "number", step: "0.1", suffix: "Â°", info: "Negativ camber, typiskt 1.5-2.5Â°" },
      { key: "rearToe", label: "Toe", type: "number", step: "0.5", suffix: "Â°", info: "Toe-in, typiskt 2-4Â°" },
      { key: "rearRideHeight", label: "Ride Height", type: "number", step: "0.5", suffix: "mm", info: "Typiskt 8-10mm bak" },
    ]
  },
  {
    title: "StÃ¶tdÃ¤mpare Fram",
    fields: [
      { key: "frontShockOil", label: "Oil (cSt)", type: "number", step: "50", suffix: "cSt", info: "Typiskt 400-700" },
      { key: "frontShockSpring", label: "Spring Rate", type: "number", step: "0.1", suffix: "", info: "t.ex. 5.6" },
      { key: "frontShockPosition", label: "Position", type: "text", placeholder: "t.ex. 2-DOT KIT", info: "Shock tower position" },
      { key: "frontShockLength", label: "LÃ¤ngd", type: "number", step: "0.5", suffix: "mm", info: "TotallÃ¤ngd dÃ¤mpare" },
    ]
  },
  {
    title: "StÃ¶tdÃ¤mpare Bak",
    fields: [
      { key: "rearShockOil", label: "Oil (cSt)", type: "number", step: "50", suffix: "cSt", info: "Typiskt 400-700" },
      { key: "rearShockSpring", label: "Spring Rate", type: "number", step: "0.1", suffix: "", info: "t.ex. 5.0" },
      { key: "rearShockPosition", label: "Position", type: "text", placeholder: "t.ex. 3", info: "Shock tower position" },
      { key: "rearShockLength", label: "LÃ¤ngd", type: "number", step: "0.5", suffix: "mm", info: "TotallÃ¤ngd dÃ¤mpare" },
    ]
  },
  {
    title: "KrÃ¤ngningshÃ¤mmare",
    fields: [
      { key: "frontAntiRollBar", label: "Fram", type: "text", placeholder: "t.ex. NO, 2.0mm", info: "NO = ingen" },
      { key: "rearAntiRollBar", label: "Bak", type: "text", placeholder: "t.ex. NO, 2.0mm", info: "NO = ingen" },
    ]
  },
  {
    title: "Differentialer",
    fields: [
      { key: "frontDiffOil", label: "Front Diff Oil", type: "number", step: "500", suffix: "cSt", info: "Typiskt 3000-7000" },
      { key: "centerDiffOil", label: "Center Diff Oil", type: "number", step: "500", suffix: "cSt", info: "Typiskt 5000-10000" },
      { key: "rearDiffOil", label: "Rear Diff Oil", type: "number", step: "500", suffix: "cSt", info: "Typiskt 2000-5000" },
      { key: "frontDiffHeight", label: "Front Diff Height", type: "number", step: "0.5", suffix: "mm" },
      { key: "rearDiffHeight", label: "Rear Diff Height", type: "number", step: "0.5", suffix: "mm" },
    ]
  },
  {
    title: "Kropp / Aero",
    fields: [
      { key: "bodyPosition", label: "Body Post Position", type: "text", placeholder: "t.ex. 17", info: "Position body posts" },
      { key: "bodyHeight", label: "Body Height/Move", type: "text", placeholder: "t.ex. 2mm", info: "Body offset frÃ¥n standard" },
      { key: "wingHeight", label: "Wing Height", type: "number", step: "0.5", suffix: "mm" },
      { key: "wingAngle", label: "Wing Angle", type: "number", step: "0.5", suffix: "Â°" },
      { key: "aeroDisk", label: "Aero Disk", type: "select", options: ["YES", "NO"], info: "Aerodynamisk skiva bak" },
    ]
  },
  {
    title: "ViktfÃ¶rdelning",
    fields: [
      { key: "frontWeight", label: "Front Weight", type: "number", step: "1", suffix: "%" },
      { key: "rearWeight", label: "Rear Weight", type: "number", step: "1", suffix: "%" },
      { key: "batteryPosition", label: "Battery Position", type: "text", placeholder: "t.ex. Front, Center, Rear" },
      { key: "electronicsPosition", label: "Electronics Position", type: "text", placeholder: "t.ex. Standard, Forward" },
    ]
  },
  {
    title: "UtvÃ¤xling",
    fields: [
      { key: "pinion", label: "Pinion", type: "number", step: "1", suffix: "T", info: "Tandantal pinion" },
      { key: "spurGear", label: "Spur Gear", type: "number", step: "1", suffix: "T", info: "Tandantal spur" },
      { key: "internalRatio", label: "Internal Ratio", type: "number", step: "0.01", suffix: ":1", info: "RX8E default: 3.31:1" },
      { key: "finalRatio", label: "Final Ratio", type: "number", step: "0.01", suffix: ":1", info: "BerÃ¤knas automatiskt" },
    ]
  },
  {
    title: "DÃ¤ck Fram",
    fields: [
      { key: "frontTireBrand", label: "MÃ¤rke", type: "text", placeholder: "t.ex. Sweep, Protoform" },
      { key: "frontTireCompound", label: "Compound", type: "text", placeholder: "t.ex. 32, 36, 40" },
      { key: "frontTireInserts", label: "Inserts", type: "text", placeholder: "t.ex. Hard, Medium" },
      { key: "frontWheelType", label: "FÃ¤lgtyp", type: "text", placeholder: "t.ex. Dish, Spoke" },
    ]
  },
  {
    title: "DÃ¤ck Bak",
    fields: [
      { key: "rearTireBrand", label: "MÃ¤rke", type: "text", placeholder: "t.ex. Sweep, Protoform" },
      { key: "rearTireCompound", label: "Compound", type: "text", placeholder: "t.ex. 32, 36, 40" },
      { key: "rearTireInserts", label: "Inserts", type: "text", placeholder: "t.ex. Hard, Medium" },
      { key: "rearWheelType", label: "FÃ¤lgtyp", type: "text", placeholder: "t.ex. Dish, Spoke" },
    ]
  },
  {
    title: "BanfÃ¶rhÃ¥llanden",
    fields: [
      { key: "trackSurface", label: "Banebana", type: "select", options: ["", "Asphalt", "Carpet", "Rubber", "Foam"], info: "Banebana material" },
      { key: "trackLayout", label: "Layout", type: "select", options: ["", "Technical", "Fast", "Mixed"], info: "Banebana karaktÃ¤r" },
      { key: "trackTemperature", label: "Bantemp", type: "number", step: "1", suffix: "Â°C" },
      { key: "airTemperature", label: "Lufttemp", type: "number", step: "1", suffix: "Â°C" },
      { key: "humidity", label: "Luftfuktighet", type: "number", step: "1", suffix: "%" },
    ]
  },
  {
    title: "KÃ¶rtid Data",
    fields: [
      { key: "laps", label: "Varv", type: "number", step: "1" },
      { key: "bestLapTime", label: "BÃ¤sta varv", type: "text", placeholder: "mm:ss.ms", info: "t.ex. 1:23.45" },
      { key: "raceTime", label: "Racetid", type: "text", placeholder: "mm:ss" },
      { key: "finalPosition", label: "Slutposition", type: "number", step: "1" },
      { key: "qualifyingPosition", label: "Kvalposition", type: "number", step: "1" },
    ]
  },
  {
    title: "Elektronik",
    fields: [
      { key: "esc", label: "ESC", type: "text", placeholder: "t.ex. Hobbywing XR8 Pro" },
      { key: "motor", label: "Motor", type: "text", placeholder: "t.ex. Hobbywing 1900KV" },
      { key: "motorTiming", label: "Motor Timing", type: "text", placeholder: "t.ex. 30Â°" },
      { key: "turboBoost", label: "Turbo Boost", type: "text", placeholder: "t.ex. 20%" },
      { key: "servo", label: "Servo", type: "text", placeholder: "t.ex. Savox 1252MG" },
      { key: "receiver", label: "Receiver", type: "text", placeholder: "t.ex. Sanwa RX-482" },
      { key: "battery", label: "Batteri", type: "text", placeholder: "t.ex. 2S 6000mAh 100C" },
    ]
  },
  {
    title: "Ã–vriga InstÃ¤llningar",
    fields: [
      { key: "frontArmMount", label: "Front Arm Mount", type: "text", placeholder: "t.ex. A, B, C" },
      { key: "rearArmMount", label: "Rear Arm Mount", type: "text", placeholder: "t.ex. D, E, F" },
      { key: "steeringAckermann", label: "Ackermann", type: "text", placeholder: "t.ex. Standard" },
      { key: "frontHubCarrier", label: "Front Hub Carrier", type: "text", placeholder: "t.ex. 4Â°" },
      { key: "rearHubCarrier", label: "Rear Hub Carrier", type: "text", placeholder: "t.ex. 2Â°" },
      { key: "casterBlock", label: "Caster Block", type: "text", placeholder: "t.ex. 12Â°, 14Â°" },
      { key: "suspensionArmType", label: "Suspension Arm", type: "text", placeholder: "t.ex. Standard, Hard" },
      { key: "shockTower", label: "Shock Tower", type: "text", placeholder: "t.ex. Graphite, Hard" },
    ]
  }
];

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <h1>ðŸŽï¸ RX8E 2026 Setup Sheet</h1>
      <div class="header-buttons">
        <button onclick="newSetup()" class="btn-new">âž• Ny Setup</button>
        <button onclick="loadDefault()" class="btn-default">ðŸ“‹ Basic Setup</button>
      </div>
    </div>
    
    <div class="setup-list" id="setupList"></div>
    
    <div class="editor" id="editor" style="display:none">
      <div class="editor-header">
        <h2 id="editorTitle">Redigera Setup</h2>
        <div class="editor-actions">
          <button onclick="saveSetup()" class="btn-save">ðŸ’¾ Spara</button>
          <button onclick="exportSetup()" class="btn-export">ðŸ“¤ Exportera</button>
          <button onclick="closeEditor()" class="btn-close">âŒ StÃ¤ng</button>
        </div>
      </div>
      
      <div class="setup-form" id="setupForm"></div>
      
      <div class="notes-section">
        <label>ðŸ“ Anteckningar</label>
        <textarea id="notes" rows="10" placeholder="Skriv dina anteckningar hÃ¤r..."></textarea>
      </div>
    </div>
  `;
  
  renderSetupList();
}

function renderSetupList() {
  const list = document.getElementById('setupList');
  if (!setups.length) {
    list.innerHTML = '<p class="empty">Inga sparade setups. Klicka pÃ¥ "Ny Setup" eller "Basic Setup" fÃ¶r att bÃ¶rja.</p>';
    return;
  }
  
  list.innerHTML = `
    <h3>ðŸ“ Sparade Setups (${setups.length})</h3>
    <div class="setups-grid">
      ${setups.map((s, i) => `
        <div class="setup-card" onclick="editSetup(${i})">
          <div class="setup-card-header">
            <strong>${escapeHtml(s.name)}</strong>
            <span class="setup-date">${s.date}</span>
          </div>
          <div class="setup-card-track">${escapeHtml(s.track || 'Ingen bana')}</div>
          <div class="setup-card-stats">
            <span>ðŸ“ RH: ${s.frontRideHeight}/${s.rearRideHeight}mm</span>
            <span>ðŸ”§ Oil: ${s.frontShockOil}/${s.rearShockOil}</span>
          </div>
          <div class="setup-card-actions" onclick="event.stopPropagation()">
            <button onclick="editSetup(${i})" class="btn-small">âœï¸</button>
            <button onclick="duplicateSetup(${i})" class="btn-small">ðŸ“‹</button>
            <button onclick="deleteSetup(${i})" class="btn-small btn-danger">ðŸ—‘ï¸</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderForm() {
  const form = document.getElementById('setupForm');
  form.innerHTML = FIELD_GROUPS.map(group => `
    <div class="field-group">
      <h4>${group.title}</h4>
      <div class="fields-grid">
        ${group.fields.map(field => `
          <div class="field">
            <label>
              ${field.label}
              ${field.info ? `<span class="info" title="${field.info}">â„¹ï¸</span>` : ''}
            </label>
            ${field.type === 'select' ? `
              <select id="${field.key}" onchange="updateField('${field.key}', this.value)">
                ${field.options.map(opt => `
                  <option value="${opt}" ${currentSetup[field.key] === opt ? 'selected' : ''}>${opt || '-- VÃ¤lj --'}</option>
                `).join('')}
              </select>
            ` : `
              <input 
                type="${field.type}" 
                id="${field.key}"
                value="${currentSetup[field.key] || ''}"
                step="${field.step || ''}"
                placeholder="${field.placeholder || ''}"
                onchange="updateField('${field.key}', this.value)"
              >
              ${field.suffix ? `<span class="suffix">${field.suffix}</span>` : ''}
            `}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  document.getElementById('notes').value = currentSetup.notes || '';
  document.getElementById('editorTitle').textContent = currentSetup.name || 'Ny Setup';
}

function updateField(key, value) {
  currentSetup[key] = value;
  if (key === 'name') {
    document.getElementById('editorTitle').textContent = value;
  }
  
  // Auto-calculate final ratio
  if ((key === 'pinion' || key === 'spurGear' || key === 'internalRatio') && 
      currentSetup.pinion && currentSetup.spurGear && currentSetup.internalRatio) {
    const pinion = parseFloat(currentSetup.pinion);
    const spur = parseFloat(currentSetup.spurGear);
    const internal = parseFloat(currentSetup.internalRatio);
    if (pinion > 0) {
      currentSetup.finalRatio = ((spur / pinion) * internal).toFixed(2);
      document.getElementById('finalRatio').value = currentSetup.finalRatio;
    }
  }
}

function newSetup() {
  currentSetup = { ...DEFAULT_SETUP };
  currentSetup.name = 'Ny Setup ' + new Date().toLocaleDateString('sv-SE');
  currentSetup.date = new Date().toISOString().split('T')[0];
  showEditor();
}

function loadDefault() {
  currentSetup = { ...DEFAULT_SETUP };
  showEditor();
}

function editSetup(index) {
  currentSetup = { ...setups[index] };
  currentSetup._index = index;
  showEditor();
}

function duplicateSetup(index) {
  const copy = { ...setups[index] };
  copy.name = copy.name + ' (Kopia)';
  copy.date = new Date().toISOString().split('T')[0];
  setups.push(copy);
  saveToStorage();
  renderSetupList();
}

function deleteSetup(index) {
  if (confirm('Ta bort setup "' + setups[index].name + '"?')) {
    setups.splice(index, 1);
    saveToStorage();
    renderSetupList();
  }
}

function showEditor() {
  document.getElementById('setupList').style.display = 'none';
  document.getElementById('editor').style.display = 'block';
  renderForm();
}

function closeEditor() {
  document.getElementById('setupList').style.display = 'block';
  document.getElementById('editor').style.display = 'none';
  currentSetup = null;
}

function saveSetup() {
  currentSetup.notes = document.getElementById('notes').value;
  
  if (currentSetup._index !== undefined) {
    setups[currentSetup._index] = { ...currentSetup };
    delete setups[currentSetup._index]._index;
  } else {
    setups.push({ ...currentSetup });
  }
  
  saveToStorage();
  renderSetupList();
  closeEditor();
  alert('Setup sparad! âœ…');
}

function exportSetup() {
  currentSetup.notes = document.getElementById('notes').value;
  const data = JSON.stringify(currentSetup, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RX8E_setup_${currentSetup.name.replace(/\s+/g, '_')}_${currentSetup.date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function saveToStorage() {
  localStorage.setItem('rx8e_setups', JSON.stringify(setups));
}

// Init
renderApp();
