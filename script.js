(function () {
  // Cole os dados do seu Google Form aqui (veja o README).
  // Enquanto estiver vazio, o visual já funciona; o envio só grava
  // as confirmações depois que você preencher formId e os entry.
  const RSVP_GOOGLE = {
    formId: "1FAIpQLSf2SN1lZ9A238kg02LTcSvPkb615InxebgYpgcIPcnNv4ykEQ",
    entries: {
      nome: "entry.851726107",
      vai: "entry.1205777567",
      pessoas: "",
      recado: "",
    },
  };

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector("#nav-menu");
  const rsvpForm = document.querySelector("#formulario");
  const sky = document.querySelector(".hero__sky");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (toggle && nav && menu) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".sr-only").textContent = open
        ? "Fechar menu"
        : "Abrir menu";
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  const solidNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-solid", window.scrollY > 24);
  };

  solidNav();
  window.addEventListener("scroll", solidNav, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", id);
    });
  });

  if (rsvpForm) {
    const status = rsvpForm.querySelector(".rsvp__status");

    const setStatus = (message, isError) => {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    };

    const isConfigured = () =>
      Boolean(
        RSVP_GOOGLE.formId &&
          RSVP_GOOGLE.entries.nome &&
          RSVP_GOOGLE.entries.vai
      );

    rsvpForm.addEventListener("change", (event) => {
      if (event.target.name !== "vai") return;
      rsvpForm.toggleAttribute("data-skip-guests", event.target.value === "Não vou");
    });

    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(rsvpForm);
      const nome = String(data.get("nome") || "").trim();
      const vai = String(data.get("vai") || "");
      const pessoas = String(data.get("pessoas") || "");
      const recado = String(data.get("recado") || "").trim();

      if (!nome || !vai) {
        setStatus("Preencha o nome e se você vai à festa.", true);
        return;
      }

      if (!isConfigured()) {
        setStatus(
          "O formulário visual está pronto. Falta conectar o Google Form no script.js para receber as confirmações. O passo a passo está no README.",
          true
        );
        return;
      }

      const post = document.createElement("form");
      post.action = `https://docs.google.com/forms/d/e/${RSVP_GOOGLE.formId}/formResponse`;
      post.method = "POST";
      post.target = "rsvp-sink";
      post.style.display = "none";

      const fields = {
        [RSVP_GOOGLE.entries.nome]: nome,
        [RSVP_GOOGLE.entries.vai]: vai,
      };
      if (RSVP_GOOGLE.entries.pessoas) {
        fields[RSVP_GOOGLE.entries.pessoas] = pessoas;
      }
      if (RSVP_GOOGLE.entries.recado) {
        fields[RSVP_GOOGLE.entries.recado] = recado;
      }

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        post.appendChild(input);
      });

      document.body.appendChild(post);
      post.submit();
      post.remove();

      rsvpForm.classList.add("is-sent");
      setStatus("Sinal recebido! Obrigado pela confirmação.");
    });
  }

  if (!reduceMotion) {
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => observer.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-in"));
    }

    if (sky && window.matchMedia("(min-width: 720px)").matches) {
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            sky.style.transform = `translateY(${y * 0.1}px)`;
          }
        },
        { passive: true }
      );
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  }
})();
