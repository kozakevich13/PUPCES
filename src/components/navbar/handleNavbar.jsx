// handleScroll.js

export function handleScroll(callback) {
  const handleScrollEvent = () => {
    callback();
  };

  window.addEventListener("scroll", handleScrollEvent);

  return () => {
    window.removeEventListener("scroll", handleScrollEvent);
  };
}
