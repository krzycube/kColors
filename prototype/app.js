const screenLinks = document.querySelectorAll(".screen-link");
const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-go]");

function activateScreen(target) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === target);
  });

  screenLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.target === target);
  });
}

screenLinks.forEach((link) => {
  link.addEventListener("click", () => activateScreen(link.dataset.target));
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.go;
    if (target) activateScreen(target);
  });
});
