import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShow(window.scrollY > 100);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    show && (
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="ScrollToTop">
        &#8593;
      </button>
    )
  );
};

export default ScrollToTop;
