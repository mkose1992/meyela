// Meyela TV — channel switching, shelf, mobile menu.
(function () {
  const CHANNELS = [
    { title: "Minik Tohum", sub: "Kısa bölüm · 1:24", src: "assets/video/minik-tohum.mp4", poster: "assets/img/kapak-minik-tohum.jpg", tv: "assets/img/tv-minik-tohum.jpg", shape: "tall" },
    { title: "Günaydın", sub: "Şarkı · Meyela gitarla", src: "assets/video/gunaydin.mp4", poster: "assets/img/kapak-gunaydin.jpg", tv: "assets/img/tv-gunaydin.jpg", shape: "tall" },
    { title: "Misket, o benim kahvaltım!", sub: "Kısa · 0:25", src: "assets/video/misket-kahvalti.mp4", poster: "assets/img/kapak-misket-kahvalti.jpg", tv: "assets/img/tv-misket-kahvalti.jpg", shape: "tall" },
    { title: "Tohum Nasıl Büyür?", sub: "Bölüm 1 · 3:08", src: "assets/video/bolum1-tohum-nasil-buyur.mp4", poster: "assets/img/kapak-bolum1.jpg", tv: "assets/img/tv-bolum1.jpg", shape: "wide" },
    { title: "Takip et & Abone ol!", sub: "Meyela'dan bir mesaj", src: "assets/video/takip-et.mp4", poster: "assets/img/kapak-takip-et.jpg", tv: "assets/img/tv-takip-et.jpg", shape: "tall" },
  ];

  const tv = document.querySelector(".tv");
  const video = document.getElementById("tvVideo");
  const inner = document.querySelector(".screen-inner");
  const caption = document.getElementById("tvCaption");
  const display = document.getElementById("chDisplay");
  const list = document.getElementById("channels");
  const shelf = document.getElementById("shelf");
  const knobs = [document.getElementById("knobPrev"), document.getElementById("knobNext")];
  let current = 0, knobAngle = 0, captionTimer;

  // channel list beside the TV
  CHANNELS.forEach((c, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" data-i="${i}"><span class="num">${String(i + 1).padStart(2, "0")}</span><img src="${c.poster}" alt="" loading="lazy"><span><b>${c.title}</b><small>${c.sub}</small></span></button>`;
    list.appendChild(li);
  });

  // shelf with covers (episode first, wide)
  const order = [3, 0, 1, 2, 4];
  order.forEach((i) => {
    const c = CHANNELS[i];
    const b = document.createElement("button");
    b.className = "ep" + (c.shape === "wide" ? " wide" : "");
    b.type = "button";
    b.dataset.i = i;
    b.innerHTML = `<div class="cover"><img src="${c.poster}" alt="${c.title}" loading="lazy"><span class="play"></span></div><h3>${c.title}</h3><small>${c.sub}</small>`;
    shelf.appendChild(b);
  });

  function tune(i, { autoplay = false } = {}) {
    current = (i + CHANNELS.length) % CHANNELS.length;
    const c = CHANNELS[current];
    tv.classList.remove("switching"); void tv.offsetWidth; tv.classList.add("switching");
    video.pause();
    video.poster = c.tv;
    video.src = c.src;
    inner.style.setProperty("--poster", `url("${new URL(c.poster, location.href).href}")`);
    display.textContent = String(current + 1).padStart(2, "0");
    list.querySelectorAll("button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.i === current)));
    caption.textContent = `Kanal ${current + 1} · ${c.title}`;
    caption.classList.add("show");
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => caption.classList.remove("show"), 2600);
    if (autoplay) video.play().catch(() => {});
  }

  function turnKnob(dir) {
    knobAngle += dir * 45;
    knobs[dir < 0 ? 0 : 1].style.transform = `rotate(${knobAngle}deg)`;
  }

  knobs[0].addEventListener("click", () => { turnKnob(-1); tune(current - 1, { autoplay: !video.paused }); });
  knobs[1].addEventListener("click", () => { turnKnob(1); tune(current + 1, { autoplay: !video.paused }); });
  list.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    turnKnob(1); tune(+b.dataset.i, { autoplay: true });
  });
  shelf.addEventListener("click", (e) => {
    const b = e.target.closest(".ep"); if (!b) return;
    document.getElementById("tv").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => { turnKnob(1); tune(+b.dataset.i, { autoplay: true }); }, 450);
  });

  tune(0);

  // mobile menu
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }));

  // shutters open one after another when the characters come into view
  const wins = document.querySelectorAll(".window");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { wins.forEach((w, k) => setTimeout(() => w.classList.add("open"), 250 + k * 220)); io.disconnect(); }
    }), { threshold: 0.35 });
    io.observe(document.querySelector(".windows"));
  } else wins.forEach((w) => w.classList.add("open"));
  // touch: tap a window to open/close its shutters
  document.querySelectorAll(".window").forEach((w) => w.addEventListener("click", () => w.classList.toggle("open")));

  // pause hero loop when off-screen (saves battery on phones)
  const hero = document.querySelector(".hero-video");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(([e]) => { e.isIntersecting ? hero.play().catch(() => {}) : hero.pause(); }).observe(hero);
  }
})();
