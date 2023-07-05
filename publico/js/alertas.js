export const esconderAlerta = () => {
  const el = document.querySelector(".alerta");
  if (el) el.parentElement.removeChild(el);
};
export const mostrarAlerta = (type, msg) => {
  esconderAlerta();
  const markup = `<div class="alerta alerta--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(esconderAlerta, 5000);
};
