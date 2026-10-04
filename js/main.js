/* Progressive enhancement only: every section is readable without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("theme-toggle");

  function currentTheme() {
    return root.dataset.theme || (prefersDark.matches ? "dark" : "light");
  }

  function syncThemeButton() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
      syncThemeButton();
    });
    prefersDark.addEventListener("change", syncThemeButton);
  }

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById("site-nav");
  var navToggle = document.getElementById("nav-toggle");
  var desktopNav = window.matchMedia("(min-width: 960px)");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        navToggle.focus();
      }
    });
    desktopNav.addEventListener("change", function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* ---------- Scroll spy: mark the section currently in view ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible.set(entry.target.id, entry.isIntersecting); });
      // Highlight the first section (in document order) that crosses the middle band.
      var active = sections.find(function (s) { return visible.get(s.id); });
      if (!active) return;
      navLinks.forEach(function (a) {
        if (a.getAttribute("href") === "#" + active.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Publication filters (counts come from the list itself) ---------- */
  var filterBtns = document.querySelectorAll(".filter");
  var pubs = document.querySelectorAll(".pub");
  var pubStatus = document.getElementById("pubs-status");

  function matches(pub, filter) {
    if (filter === "all") return true;
    if (filter === "first") return pub.hasAttribute("data-first");
    return pub.dataset.type === filter;
  }

  document.querySelectorAll(".filter-count").forEach(function (el) {
    var filter = el.dataset.count;
    var n = 0;
    pubs.forEach(function (pub) { if (matches(pub, filter)) n++; });
    el.textContent = String(n);
  });

  function applyFilter(filter, label) {
    var shown = 0;
    pubs.forEach(function (pub) {
      var ok = matches(pub, filter);
      pub.hidden = !ok;
      if (ok) shown++;
    });
    filterBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
    });
    pubStatus.textContent = filter === "all"
      ? ""
      : "Showing " + shown + " of " + pubs.length + " publications (" + label + ").";
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.firstChild.textContent.trim().toLowerCase();
      applyFilter(btn.dataset.filter, label);
    });
  });

  /* ---------- Awards: show the first six, reveal the rest on demand ---------- */
  var AWARDS_VISIBLE = 6;
  var awards = document.querySelectorAll(".award");
  var awardsMore = document.querySelector(".awards-more");
  var awardsToggle = document.getElementById("awards-toggle");

  if (awards.length > AWARDS_VISIBLE && awardsMore && awardsToggle) {
    var toggleLabel = awardsToggle.querySelector(".awards-toggle-label");
    var setAwards = function (expanded) {
      awards.forEach(function (card, i) {
        if (i >= AWARDS_VISIBLE) card.hidden = !expanded;
      });
      awardsToggle.setAttribute("aria-expanded", String(expanded));
      toggleLabel.textContent = expanded ? "Show fewer awards" : "Show all " + awards.length + " awards";
    };
    awardsMore.hidden = false;
    setAwards(false);
    awardsToggle.addEventListener("click", function () {
      var expanded = awardsToggle.getAttribute("aria-expanded") !== "true";
      setAwards(expanded);
      // Move focus to the first newly shown card so keyboard users land on the new content.
      if (expanded) {
        var firstNew = awards[AWARDS_VISIBLE].querySelector("a");
        if (firstNew) firstNew.focus();
      }
    });
  }

  /* ---------- Lightbox for award photos and certificates ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var lbClose = document.getElementById("lightbox-close");

  if (lightbox && typeof lightbox.showModal === "function") {
    document.querySelectorAll("a.award-media, a.cert-media").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var thumb = link.querySelector("img");
        var card = link.closest(".award, .cert");
        var title = card && card.querySelector("h3, h4");
        lbImg.src = link.getAttribute("href");
        lbImg.alt = thumb ? thumb.alt : "";
        lbCaption.textContent = title ? title.textContent : "";
        lightbox.showModal();
      });
    });
    lbClose.addEventListener("click", function () { lightbox.close(); });
    // A click on the dimmed backdrop lands on the dialog element itself.
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener("close", function () { lbImg.removeAttribute("src"); });
  }
  // Without <dialog> support the links simply open the full-size image.

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");

  if (copyBtn && navigator.clipboard && window.isSecureContext) {
    copyBtn.hidden = false;
    var copyLabel = copyBtn.querySelector(".copy-label");
    var resetTimer;
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(copyBtn.dataset.email).then(function () {
        copyBtn.classList.add("is-copied");
        copyLabel.textContent = "Copied";
        copyStatus.textContent = "Email address copied to clipboard.";
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          copyBtn.classList.remove("is-copied");
          copyLabel.textContent = "Copy";
          copyStatus.textContent = "";
        }, 2000);
      }, function () {
        copyStatus.textContent = "Could not copy. Please select the address manually.";
      });
    });
  }
})();
