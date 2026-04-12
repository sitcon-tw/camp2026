import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function initLandingAnimations() {
  if (typeof window === "undefined") {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    ScrollTrigger.refresh();
    return;
  }

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const onFrame = (time: number) => {
    lenis.raf(time * 1000);
  };

  const refreshScrollGeometry = () => {
    window.requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
  };

  gsap.ticker.add(onFrame);
  gsap.ticker.lagSmoothing(0);

  const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
  if (heroItems.length > 0) {
    gsap.from(heroItems, {
      y: 28,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power2.out",
      delay: 0.15,
    });
  }

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
    gsap.from(element, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 82%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>("[data-stagger-item]");
    if (items.length === 0) {
      return;
    }

    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: group,
        start: "top 80%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
    gsap.fromTo(
      element,
      { yPercent: -6, scale: 1.08 },
      {
        yPercent: 6,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  const header = document.querySelector<HTMLElement>("[data-header]");
  if (header) {
    header.classList.add("is-hidden");

    ScrollTrigger.create({
      start: 12,
      onUpdate: (self) => {
        header.classList.toggle("is-hidden", self.scroll() <= 12);
        header.classList.toggle("is-scrolled", self.scroll() > 12);
      },
    });
  }

  const faqDetails =
    gsap.utils.toArray<HTMLDetailsElement>("[data-faq-details]");
  faqDetails.forEach((details) => {
    details.addEventListener("toggle", refreshScrollGeometry);
  });

  window.addEventListener(
    "beforeunload",
    () => {
      faqDetails.forEach((details) => {
        details.removeEventListener("toggle", refreshScrollGeometry);
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove(onFrame);
      lenis.destroy();
    },
    { once: true },
  );

  ScrollTrigger.refresh();
}
