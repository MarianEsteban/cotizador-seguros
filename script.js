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
    { key: "marcaModelo", label: "Marca y modelo", type: "text", placeholder: "Ej. Toyota Corolla XEI" },
    { key: "anio", label: "Año", type: "number", placeholder: "Ej. 2020" },
    { key: "uso", label: "Uso particular o comercial", type: "text", placeholder: "Ej. Uso particular" },
  ],
  "Hogar": [
    { key: "localidadHogar", label: "Localidad", type: "text", placeholder: "Ej. Miramar" },
    { key: "tipoVivienda", label: "Tipo de vivienda", type: "text", placeholder: "Ej. Casa" },
    { key: "condicion", label: "Propietario o inquilino", type: "text", placeholder: "Ej. Propietario" },
  ],
  "Comercio": [
    { key: "rubro", label: "Rubro", type: "text", placeholder: "Ej. Indumentaria" },
    { key: "localidadComercio", label: "Localidad", type: "text", placeholder: "Ej. Mar del Plata" },
    { key: "tipoLocal", label: "Tipo de local", type: "text", placeholder: "Ej. Local a la calle" },
  ],
  "Vida": [
    { key: "edad", label: "Edad", type: "number", placeholder: "Ej. 35" },
    { key: "ocupacion", label: "Ocupación", type: "text", placeholder: "Ej. Docente" },
  ],
  "Accidentes personales": [
    { key: "actividad", label: "Actividad", type: "text", placeholder: "Ej. Albañilería" },
    { key: "cantidadPersonas", label: "Cantidad de personas", type: "number", placeholder: "Ej. 3" },
  ],
  "Asistencia al viajero": [
    { key: "destino", label: "Destino", type: "text", placeholder: "Ej. Brasil" },
    { key: "fechaSalida", label: "Fecha de salida", type: "date" },
    { key: "fechaRegreso", label: "Fecha de regreso", type: "date" },
    { key: "cantidadPasajeros", label: "Cantidad de pasajeros", type: "number", placeholder: "Ej. 2" },
  ],
};

function createField({ key, label, type, placeholder }) {
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
  if (placeholder) input.placeholder = placeholder;

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

  let message = "Hola Mariano, quiero solicitar una cotización.";
  message += `\n\nTipo de seguro: ${selectedType}`;
  message += `\nNombre: ${getTrimmedValue("nombre")}`;
  message += `\nLocalidad: ${getTrimmedValue("localidadGeneral")}`;
  message += `\nTeléfono: ${getTrimmedValue("telefono")}`;

  if (specificFields.length) {
    message += "\nDatos adicionales:";
    specificFields.forEach((field) => {
      message += `\n- ${field.label}: ${getTrimmedValue(field.key)}`;
    });
  }

  return encodeURIComponent(message);
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
