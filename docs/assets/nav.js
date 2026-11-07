// 章の情報はここだけで管理する。章を追加・更新したら CHAPTERS を直す
//   num: 章番号 / title: 題名 / tags: カードに出すキーワード
//   path: ページの場所。未公開の章は null にすると「未公開・随時公開予定」と表示する
//   hue: 冒頭の帯とカードの色相（度）
(function () {
  var CHAPTERS = [
    { num: "00", title: "全体像 — 認証と認可", path: "chapters/00-overview.html", hue: 0,
      tags: ["認証", "認可", "登場人物"] },
    { num: "01", title: "OAuth 2.0 の基本", path: "chapters/01-oauth2.html", hue: 20,
      tags: ["ロール", "グラント", "スコープ", "トークン"] },
    { num: "02", title: "認可コードフロー + PKCE", path: "chapters/02-auth-code-pkce.html", hue: 40,
      tags: ["code_verifier", "state", "リダイレクト"] },
    { num: "03", title: "OpenID Connect", path: "chapters/03-oidc.html", hue: 60,
      tags: ["ID トークン", "nonce", "ディスカバリ", "JWKS"] },
    { num: "04", title: "SPA × Web API の構成", path: "chapters/04-spa-patterns.html", hue: 150,
      tags: ["BFF", "Token-Mediating", "ブラウザ内クライアント"] },
    { num: "05", title: "Web API のトークン検証", path: "chapters/05-api-validation.html", hue: 170,
      tags: ["JWT", "aud", "Introspection", "401 / 403"] },
    { num: "06", title: "トークンの保管と攻撃対策", path: "chapters/06-threats.html", hue: 200,
      tags: ["XSS", "CSRF", "CORS", "ローテーション"] },
    { num: "07", title: "実装チェックリスト", path: "chapters/07-checklist.html", hue: 230,
      tags: ["認可サーバー", "BFF", "Web API"] }
  ];
  var PLANNED_LABEL = "未公開・随時公開予定";

  var body = document.body;
  var root = body.getAttribute("data-root") || "";
  var current = body.getAttribute("data-page");
  var readable = CHAPTERS.filter(function (c) { return c.path; });
  var here = CHAPTERS.filter(function (c) { return c.path === current; })[0];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var ARROW = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24h36M30 12l12 12-12 12"/></svg>';

  // 冒頭の帯の色を章ごとに変える
  if (here) document.documentElement.style.setProperty("--hue", here.hue + "deg");

  // ヘッダー: スクロールしたら背景を付ける
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 全画面メニュー
  var overlay = document.querySelector(".menu-overlay");
  var toggle = document.querySelector(".menu-toggle");
  if (overlay && toggle) {
    var list = el("ol");
    CHAPTERS.forEach(function (c) {
      var li = el("li");
      var row = c.path ? el("a") : el("span", "is-planned");
      if (c.path) {
        row.href = root + c.path;
        if (c.path === current) row.setAttribute("aria-current", "page");
      }
      row.appendChild(el("span", "num", c.num));
      row.appendChild(el("span", null, c.title));
      if (!c.path) row.appendChild(el("span", "state", PLANNED_LABEL));
      li.appendChild(row);
      list.appendChild(li);
    });
    var home = el("li");
    var homeLink = el("a");
    homeLink.href = root + "index.html";
    homeLink.appendChild(el("span", "num", "TOP"));
    homeLink.appendChild(el("span", null, "はじめに"));
    if (current === "index.html") homeLink.setAttribute("aria-current", "page");
    home.appendChild(homeLink);
    list.insertBefore(home, list.firstChild);
    overlay.querySelector(".menu-list").appendChild(list);

    var setOpen = function (open) {
      overlay.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "章の一覧を閉じる" : "章の一覧を開く");
    };
    toggle.addEventListener("click", function () { setOpen(!overlay.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  // 章のページ: 次へ / 前へ
  var pager = document.querySelector(".pager");
  var idx = readable.indexOf(here);
  if (pager && idx >= 0) {
    var make = function (c, cls, label) {
      var a = el("a", cls);
      a.href = root + c.path;
      a.appendChild(el("span", "label", label));
      var t = el("span", "title");
      t.appendChild(document.createTextNode(c.num + "  " + c.title));
      if (cls === "next") t.insertAdjacentHTML("beforeend", ARROW);
      a.appendChild(t);
      return a;
    };
    if (idx < readable.length - 1) pager.appendChild(make(readable[idx + 1], "next", "Next chapter"));
    if (idx > 0) pager.appendChild(make(readable[idx - 1], "prev", "Previous"));
  }

  // 章のページ: 目次で今読んでいる節を示す
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".page-toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.hash.slice(1))] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          byId[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-100px 0px -70% 0px" });
    document.querySelectorAll("article h2[id], article h3[id]").forEach(function (h) { obs.observe(h); });
  }

  // トップ: 章のカード
  var grid = document.getElementById("chapter-grid");
  if (grid) {
    CHAPTERS.forEach(function (c) {
      var card = c.path ? el("a", "card") : el("div", "card is-planned");
      if (c.path) card.href = root + c.path;
      var cover = el("div", "card-cover");
      cover.style.setProperty("--hue", c.hue + "deg");
      var i = CHAPTERS.indexOf(c);
      cover.style.setProperty("--bx", [80, 20, 65, 35, 90, 50, 15, 75, 40, 60][i % 10] + "%");
      cover.style.setProperty("--by", [15, 5, 30, 10, 40, 0, 25, 8, 35, 18][i % 10] + "%");
      cover.style.setProperty("--cx", [30, 75, 10, 60, 40, 85, 55, 20, 70, 45][i % 10] + "%");
      cover.appendChild(el("span", "card-num", c.num));
      card.appendChild(cover);
      card.appendChild(el("h3", "card-title", c.title));
      card.appendChild(el("p", "card-tags", c.tags.join(" / ")));
      if (!c.path) card.appendChild(el("span", "card-state", PLANNED_LABEL));
      grid.appendChild(card);
    });
  }

  // 配色の切り替え
  var theme = document.querySelector(".theme-toggle");
  if (theme) {
    theme.addEventListener("click", function () {
      var light = document.documentElement.getAttribute("data-theme") === "light";
      if (light) document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "light");
      try { localStorage.setItem("auth-theme", light ? "dark" : "light"); } catch (e) { /* 保存できなくても切り替えは効く */ }
    });
  }
})();
