/**
 * personnel-lists.js — centralized personnel classification data
 *
 * Loaded by index.html in this repository via <script src="personnel-lists.js"></script>.
 * This is the single source of truth for the Position and Craft / Discipline
 * master lists within this tool — edit the two arrays below to change them.
 *
 * IMPORTANT: the Alcohol and Blood Pressure tools live in separate repositories,
 * and each holds its own copy of this file. If you change a list here, make the
 * identical change in the other repository so the two stay in sync.
 *
 * Position and Craft / Discipline are always stored as two separate
 * fields (never concatenated into one string like "Piping Supervisor").
 * Both are mandatory, searchable-dropdown-only fields: the widget below
 * only commits a value when the user picks an exact entry from the list,
 * so free text can never slip through as a stored Position or Craft.
 */

const POSITION_LIST = [
  "Manager", "Superintendent", "Engineer", "Supervisor", "Foreman",
  "Coordinator", "Planner", "Inspector", "Surveyor", "Technician",
  "Operator", "Electrician", "Fitter", "Fabricator", "Welder",
  "Boilermaker", "Machinist", "Millwright", "Rigger",
  "Banksman / Signalman", "Crane Operator", "Forklift Operator",
  "MEWP / Manlift Operator", "Telehandler Operator",
  "Heavy Equipment Operator", "Driver", "Scaffolder",
  "Scaffold Inspector", "Carpenter", "Steel Fixer / Rebar Worker",
  "Mason", "Concrete Worker", "Plumber", "HVAC Technician",
  "Insulation Installer", "Cladding Installer",
  "Fireproofing Applicator", "Painter", "Blaster", "Coating Applicator",
  "Rope Access Technician", "NDT Technician", "Calibration Technician",
  "Testing Technician", "Commissioning Technician",
  "Automation / Control Technician", "Cable Technician",
  "Valve Technician", "Hydrotest / Pressure Test Technician",
  "Process Technician", "Laboratory Technician",
  "Environmental Technician", "Waste Management Worker",
  "Warehouse / Storekeeper", "Material Controller",
  "Logistics Personnel", "Security Officer", "Security Guard",
  "Traffic Marshal", "Fire Watch", "Gas Tester",
  "Confined Space Attendant", "First Aider", "Medic / Paramedic",
  "Emergency Response / Rescue Technician", "IT / Network Technician",
  "Telecom Technician", "CCTV / Security Systems Technician",
  "OEM Representative", "Vendor Representative", "Consultant",
  "Third-Party Inspector", "Auditor",
  "Government / Regulatory Inspector", "General Worker", "Helper",
  "Labourer", "Cleaner", "Housekeeping", "Catering Staff", "Visitor"
];

const CRAFT_LIST = [
  "Civil", "Structural Steel", "Tank Erection", "Silo Erection",
  "Piping", "Mechanical", "Electrical", "Instrumentation",
  "Automation / Control", "Fire Protection", "Insulation", "Cladding",
  "Fireproofing", "Painting / Coating", "Blasting", "Scaffolding",
  "Lifting / Rigging", "QA/QC", "NDT", "Survey", "Pre-Commissioning",
  "Commissioning", "HSSE", "Environmental", "Logistics",
  "Warehouse / Materials", "Transport", "HVAC", "Plumbing",
  "Telecom / ICT", "Laboratory", "Process / Operations", "Maintenance",
  "Security", "Emergency Response", "General / Support",
  "OEM / Specialist", "Vendor", "Consultant", "Client", "Visitor"
];

/**
 * Wires up a searchable, select-only dropdown ("combobox").
 *
 *   initSearchableSelect({
 *     inputId:   "f_position_search",   // visible text input the user types into
 *     hiddenId:  "f_position",          // hidden input that holds the committed value
 *     listId:    "f_position_list",     // <ul> the filtered options render into
 *     options:   POSITION_LIST,
 *     errorId:   "f_position_error"     // optional: element to show "pick from list" error
 *   });
 *
 * The hidden input is what the submit handler should read — it is only
 * ever set by clicking (or Enter-selecting) an option, never by typing,
 * so there is no path for an arbitrary value to be saved.
 */
function initSearchableSelect(cfg) {
  const input = document.getElementById(cfg.inputId);
  const hidden = document.getElementById(cfg.hiddenId);
  const list = document.getElementById(cfg.listId);
  const errorEl = cfg.errorId ? document.getElementById(cfg.errorId) : null;
  const options = cfg.options;
  let activeIndex = -1;

  function clearError() {
    if (errorEl) errorEl.textContent = "";
    input.classList.remove("combobox-invalid");
  }

  function showError(msg) {
    if (errorEl) errorEl.textContent = msg;
    input.classList.add("combobox-invalid");
  }

  function renderOptions(filterText) {
    const q = (filterText || "").trim().toLowerCase();
    const matches = q
      ? options.filter(o => o.toLowerCase().includes(q))
      : options.slice();

    list.innerHTML = "";
    activeIndex = -1;

    if (matches.length === 0) {
      list.classList.remove("open");
      return;
    }

    matches.forEach((opt) => {
      const li = document.createElement("li");
      li.textContent = opt;
      li.setAttribute("role", "option");
      li.addEventListener("mousedown", (e) => {
        // mousedown (not click) so this fires before the input's blur handler
        e.preventDefault();
        commit(opt);
      });
      list.appendChild(li);
    });
    list.classList.add("open");
  }

  function commit(value) {
    input.value = value;
    hidden.value = value;
    clearError();
    list.classList.remove("open");
  }

  function openList() {
    renderOptions(input.value);
  }

  input.addEventListener("focus", openList);
  input.addEventListener("input", () => {
    hidden.value = ""; // typing invalidates any prior committed selection
    renderOptions(input.value);
  });

  input.addEventListener("keydown", (e) => {
    const items = Array.from(list.children);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!list.classList.contains("open")) { openList(); return; }
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle("active", i === activeIndex));
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((it, i) => it.classList.toggle("active", i === activeIndex));
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        commit(items[activeIndex].textContent);
      }
    } else if (e.key === "Escape") {
      list.classList.remove("open");
    }
  });

  input.addEventListener("blur", () => {
    // Give the mousedown handler a tick to commit first.
    setTimeout(() => {
      list.classList.remove("open");
      if (input.value && hidden.value !== input.value) {
        // Typed text that doesn't match a committed option exactly.
        input.value = "";
        hidden.value = "";
      }
    }, 120);
  });

  document.addEventListener("click", (e) => {
    if (e.target !== input && !list.contains(e.target)) {
      list.classList.remove("open");
    }
  });

  return {
    /** Returns true and clears any error if valid; otherwise shows errorMessage and returns false. */
    validate(errorMessage) {
      if (hidden.value && options.includes(hidden.value)) {
        clearError();
        return true;
      }
      showError(errorMessage || "Must be selected from the list.");
      return false;
    },
    reset() {
      input.value = "";
      hidden.value = "";
      clearError();
    }
  };
}
