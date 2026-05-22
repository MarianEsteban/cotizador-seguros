// Número de WhatsApp destino (ME Seguros)
const whatsappNumber = "5492291515617";

const form = document.getElementById("cotizadorForm");
const tipoSeguro = document.getElementById("tipoSeguro");
const dynamicFields = document.getElementById("dynamicFields");
const errorMessage = document.getElementById("errorMessage");

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-navigation");
const navLinks = primaryNav ? primaryNav.querySelectorAll("a") : [];
const currentYear = document.getElementById("current-year");

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Estructura de campos por tipo de seguro
const fieldsConfig = {
  "Automotor": [
    { key: "marcaModelo", label: "Marca y modelo", type: "text" },
    { key: "anio", label: "Año", type: "number" },
    { key: "uso", label: "Uso particular o comercial", type: "text" },
  ],
  "Hogar": [
    { key: "localidadHogar", label: "Localidad", type: "text" },
    { key: "tipoVivienda", label: "Tipo de vivienda", type: "text" },
    { key: "condicion", label: "Propietario o inquilino", type: "text" },
  ],
  "Comercio": [
    { key: "rubro", label: "Rubro", type: "text" },
    { key: "localidadComercio", label: "Localidad", type: "text" },
    { key: "tipoLocal", label: "Tipo de local", type: "text" },
  ],
  "Vida": [
    { key: "edad", label: "Edad", type: "number" },
    { key: "ocupacion", label: "Ocupación", type: "text" },
  ],
  "Accidentes personales": [
    { key: "actividad", label: "Actividad", type: "text" },
    { key: "cantidadPersonas", label: "Cantidad de personas", type: "number" },
  ],
  "Asistencia al viajero": [
    { key: "destino", label: "Destino", type: "text" },
    { key: "fechaSalida", label: "Fecha de salida", type: "date" },
    { key: "fechaRegreso", label: "Fecha de regreso", type: "date" },
    { key: "cantidadPasajeros", label: "Cantidad de pasajeros", type: "number" },
  ],
};

function createField({ key, label, type }) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", key);
  labelEl.textContent = `${label} *`;

  const input = document.createElement("input");
  input.id = key;
  input.name = key;
  input.type = type;
  input.required = true;

  wrapper.appendChild(labelEl);
  wrapper.appendChild(input);
  return wrapper;
}

function renderDynamicFields(type) {
  dynamicFields.innerHTML = "";
  const config = fieldsConfig[type] || [];

  config.forEach((field) => {
    dynamicFields.appendChild(createField(field));
  });
}

function getTrimmedValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function validateForm() {
  const requiredBase = ["nombre", "localidadGeneral", "telefono", "tipoSeguro"];

  for (const fieldId of requiredBase) {
    if (!getTrimmedValue(fieldId)) {
      return "Por favor, completá todos los campos principales.";
    }
  }

  const selectedType = tipoSeguro.value;
  const specificFields = fieldsConfig[selectedType] || [];

  for (const field of specificFields) {
    if (!getTrimmedValue(field.key)) {
      return "Por favor, completá todos los campos del seguro seleccionado.";
    }
  }

  return "";
}

function buildWhatsappMessage() {
  const selectedType = tipoSeguro.value;
  const specificFields = fieldsConfig[selectedType] || [];

  let message = "*Nueva consulta desde Cotizador rápido*%0A";
  message += `%0A*Nombre y apellido:* ${encodeURIComponent(getTrimmedValue("nombre"))}`;
  message += `%0A*Localidad:* ${encodeURIComponent(getTrimmedValue("localidadGeneral"))}`;
  message += `%0A*Teléfono/WhatsApp:* ${encodeURIComponent(getTrimmedValue("telefono"))}`;
  message += `%0A*Tipo de seguro:* ${encodeURIComponent(selectedType)}`;

  specificFields.forEach((field) => {
    message += `%0A*${encodeURIComponent(field.label)}:* ${encodeURIComponent(getTrimmedValue(field.key))}`;
  });

  return message;
}

tipoSeguro.addEventListener("change", (event) => {
  renderDynamicFields(event.target.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.textContent = "";

  const error = validateForm();
  if (error) {
    errorMessage.textContent = error;
    return;
  }

  const message = buildWhatsappMessage();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
});
