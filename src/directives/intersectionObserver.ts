import { Directive } from "vue";

const intersectionObserver: Directive = {
  beforeMount(el, binding) {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value();
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    el._observer.unobserve(el);
  },
};

export default intersectionObserver;
