const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const scrollToSection = (sectionId) => {
  if (window.location.pathname !== "/") {
    window.location.href = `/#${sectionId}`;
    return;
  }

  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80,
      behavior: "smooth",
    });
  }
  setInterval(() => history.replaceState(null, null, " "), 1000);
};

export { scrollToSection, scrollToTop };
