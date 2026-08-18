document.documentElement.classList.add("has-js");

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navbar = document.querySelector(".navbar");
  const updateNavbar = () => {
    navbar?.classList.toggle("navbar-scrolled", window.scrollY > 18);
  };
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  document.querySelectorAll(".preview-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const preview = document.getElementById(button.dataset.preview);
      if (!preview) return;

      const willOpen = preview.hidden;
      preview.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));

      const textNode = Array.from(button.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      if (textNode) textNode.textContent = willOpen ? "Hide preview " : "Preview here ";

      if (willOpen) {
        preview.classList.remove("is-opening");
        requestAnimationFrame(() => preview.classList.add("is-opening"));
        preview.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    });
  });

  const expandButtons = document.querySelectorAll(".preview-expand");
  if (expandButtons.length) {
    const previewDialog = document.createElement("dialog");
    previewDialog.className = "project-preview-dialog";
    document.body.appendChild(previewDialog);

    let expandedPreview = null;

    const restorePreview = () => {
      if (!expandedPreview) return;

      const { preview, parent, nextSibling, button, markup, label } = expandedPreview;
      if (nextSibling && nextSibling.parentNode === parent) {
        parent.insertBefore(preview, nextSibling);
      } else {
        parent.appendChild(preview);
      }

      button.innerHTML = markup;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", label);
      expandedPreview = null;
      button.focus({ preventScroll: true });
    };

    const closePreview = () => {
      if (previewDialog.open) previewDialog.close();
    };

    previewDialog.addEventListener("close", restorePreview);
    previewDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closePreview();
    });
    previewDialog.addEventListener("click", (event) => {
      if (event.target !== previewDialog) return;
      const bounds = previewDialog.getBoundingClientRect();
      const clickedOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (clickedOutside) closePreview();
    });

    expandButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (expandedPreview?.button === button) {
          closePreview();
          return;
        }

        const preview = button.closest(".project-preview-shell");
        if (!preview) return;

        expandedPreview = {
          preview,
          parent: preview.parentNode,
          nextSibling: preview.nextSibling,
          button,
          markup: button.innerHTML,
          label: button.getAttribute("aria-label") || "Expand project preview",
        };

        const iframe = preview.querySelector("iframe");
        previewDialog.setAttribute(
          "aria-label",
          `${iframe?.title || "Project"} expanded preview`
        );
        previewDialog.appendChild(preview);
        button.innerHTML = '<i class="bi bi-fullscreen-exit"></i> Close';
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close expanded project preview");
        previewDialog.showModal();
        button.focus();
      });
    });
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      const originalMarkup = button.innerHTML;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }

      button.innerHTML = '<i class="bi bi-check2"></i> Copied';
      button.setAttribute("aria-live", "polite");
      window.setTimeout(() => {
        button.innerHTML = originalMarkup;
      }, 1800);
    });
  });
});
