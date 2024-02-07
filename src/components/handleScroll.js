

export function handleScroll(callback) {
  window.addEventListener("scroll", callback);

  return () => {
    window.removeEventListener("scroll", callback);
  };
}
