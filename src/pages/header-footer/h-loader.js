// ------------------------------------------------------------
// h-loader.js — Clean, Modular, Production-Ready Header Loader
// ------------------------------------------------------------
(function () {

  console.log("%c[h-loader] initialized", "color:#3b82f6; font-weight:bold;");

  // ===============================================
  // A) Identify loader script location
  // ===============================================
  const scriptEl = document.currentScript || (function () {
    const s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();

  const scriptSrc = scriptEl?.src || location.href;
  const base = scriptSrc.replace(/\/[^\/]*$/, "/");
  const headerUrl = new URL("header.html", base).href;

  console.log("[h-loader] script loaded from:", scriptSrc);
  console.log("[h-loader] resolved header path:", headerUrl);


  // ===============================================
  // B) Locate header placeholder
  // ===============================================
  const placeholder =
    document.querySelector("#header") ||
    document.querySelector("#site-header") ||
    document.querySelector("#page-header");

  if (!placeholder) {
    console.warn("[h-loader] No <div id='header'> found. Header not loaded.");
    return;
  }


  // ===============================================
  // C) Fetch & inject header
  // ===============================================
  fetch(headerUrl, { cache: "no-store" })
    .then(resp => {
      if (!resp.ok) throw new Error("Header load failed: " + resp.status);
      return resp.text();
    })
    .then(html => {
      placeholder.innerHTML = html;
      console.log("%c[h-loader] header injected successfully", "color:#10b981;");

      applyInnerPageClass();
      applyScrollHeaderEffect();
      hideLinksDynamically();
      setupMobileMenu();
      highlightActiveLink();
      setupSafeNavigation();
      handleAuthButtons();   // ⭐ Sign in / sign up / sign out logic
      handleHomeRedirect();
    })
    .catch(err => {
      console.error("[h-loader] ERROR loading header:", err);
    });



  // ======================================================================
  // ---------------------------- FUNCTIONS -------------------------------
  // ======================================================================


  // 1️⃣ Apply solid header on all inner pages
  function applyInnerPageClass() {
    const filename = location.pathname.split("/").pop().toLowerCase();

    const isHome =
      filename === "" ||
      filename === "index" ||
      filename === "index.html";

    if (!isHome) {
      document.body.classList.add("inner-page");
      console.log("[h-loader] inner-page → solid header enabled");
    } else {
      document.body.classList.remove("inner-page");
      console.log("[h-loader] home page detected → transparent header");
    }
  }



  // 2️⃣ Solid header on scroll
  function applyScrollHeaderEffect() {
    const header = document.querySelector(".header");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }

    window.addEventListener("scroll", onScroll);
    onScroll();
  }



  // 3️⃣ Hide links using <body data-hide-links="">
  function hideLinksDynamically() {
    const hideList = document.body.dataset.hideLinks;
    if (!hideList) return;

    const items = hideList.split(",").map(i => i.trim().toLowerCase());

    items.forEach(id => {
      const selector = `.nav-desktop a[data-id="${id}"], .nav-mobile a[data-id="${id}"]`;
      const link = document.querySelector(selector);
      if (link) link.style.display = "none";
    });

    console.log("[h-loader] hidden nav links:", hideList);
  }



  // 4️⃣ Mobile menu toggle
  function setupMobileMenu() {
    const btn = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".nav-mobile");

    if (!btn || !mobileNav) return;

    btn.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });

    console.log("[h-loader] mobile menu enabled");
  }



  // 5️⃣ Highlight active nav link
  function highlightActiveLink() {
    const current = location.pathname.split("/").pop();
    const links = document.querySelectorAll(".nav-link");

    links.forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href.includes(current)) a.classList.add("active");
    });
  }



  // 6️⃣ Prevent reload when clicking the same page link
  function setupSafeNavigation() {
    const anchors = document.querySelectorAll("a[href]");

    anchors.forEach(a => {
      a.addEventListener("click", ev => {
        const target = a.getAttribute("href");
        const current = location.pathname.split("/").pop();

        if (target === current) {
          ev.preventDefault();
          console.log("[h-loader] prevented same-page reload:", target);
        }
      });
    });
  }



  // ⭐ 7️⃣ SIGN-IN / SIGN-OUT LOGIC
  function handleAuthButtons() {

    const user = JSON.parse(localStorage.getItem("mc_user"));

    const loginBtn  = document.querySelector("[data-auth='login']");
    const signupBtn = document.querySelector("[data-auth='signup']");
    const logoutBtn = document.querySelector("[data-auth='logout']");

    if (!loginBtn || !signupBtn || !logoutBtn) return;

    // Detect any authentication page (signIn / signUp / login)
    const url = location.pathname.toLowerCase();
    const isAuthPage =
      url.includes("signin") ||
      url.includes("signup") ||
      url.includes("login") ||
      url.includes("register");

    // Always hide logout button on signIn / signUp pages
    if (isAuthPage) {
      loginBtn.style.display = "inline-flex";
      signupBtn.style.display = "inline-flex";
      logoutBtn.style.display = "none";
      console.log("[h-loader] Auth page detected → hiding logout");
      return;
    }

    // If user is logged in → show logout
    if (user) {
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "inline-flex";

      logoutBtn.addEventListener("click", () => {
        console.log("[h-loader] Logging out...");
        localStorage.removeItem("mc_user");
        localStorage.removeItem("mc_bookings");
        window.location.href = "../pages/signIn.html";
      });

      console.log("[h-loader] user logged in → showing logout");
    }

    // User NOT logged in → show login + signup
    else {
      loginBtn.style.display = "inline-flex";
      signupBtn.style.display = "inline-flex";
      logoutBtn.style.display = "none";
      console.log("[h-loader] no user → showing login/signup");
    }
  }


// 🏠 8️⃣ Dynamic Home redirection based on login role
function handleHomeRedirect() {

  const user = JSON.parse(localStorage.getItem("mc_user"));

  // Select Home links (desktop + mobile)
  const homeLinks = document.querySelectorAll(
    ".nav-desktop a[data-id='home'], .nav-mobile a[data-id='home']"
  );

  if (!homeLinks.length) return;

  let homeHref = "../../index.html"; // default (not logged in)

  if (user && user.role) {
    if (user.role === "customer") {
      homeHref = "./c-dashboard.html";
    } 
    else if (user.role === "mechanic") {
      homeHref = "./m-dashboard.html";
    }
  }

  homeLinks.forEach(link => {
    link.setAttribute("href", homeHref);
  });

  console.log("[h-loader] Home redirected to:", homeHref);
}


})(); // END IIFE
