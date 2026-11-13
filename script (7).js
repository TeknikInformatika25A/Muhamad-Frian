/* Ichiban Sushi - JavaScript
   Dibuat oleh: Muhamad Frian Erliana */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var rupiah = function (n) { return "Rp " + n.toLocaleString("id-ID"); };

  /* ---------- Menu mobile & header ---------- */
  var burger = $("#frian_burger"), nav = $("#frian_menu"), header = $("#frian_header");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("frian_open");
      burger.textContent = open ? "\u2715" : "\u2630";
    });
  }
  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("frian_scrolled", window.scrollY > 10);
  });

  /* ---------- Animasi muncul saat scroll ---------- */
  var reveals = $$(".frian_reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("frian_visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("frian_visible"); });
  }

  /* ---------- Counter angka statistik ---------- */
  $$("[data-frian-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-frian-count"), 10), suffix = el.getAttribute("data-frian-suffix") || "";
    var cur = 0, step = Math.max(1, Math.round(target / 60));
    var t = setInterval(function () {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toLocaleString("id-ID") + suffix;
    }, 25);
  });

  /* ---------- Menu: filter + keranjang pesanan ---------- */
  var filterBtns = $$(".frian_filter_btn"), dishes = $$(".frian_dish");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("frian_active"); });
      btn.classList.add("frian_active");
      var cat = btn.getAttribute("data-frian-cat");
      dishes.forEach(function (d) {
        d.classList.toggle("frian_hide", cat !== "semua" && d.getAttribute("data-frian-cat") !== cat);
      });
    });
  });

  var cartBox = $("#frian_cart_items");
  if (cartBox) {
    var cart = {};
    var totalEl = $("#frian_cart_total");
    var render = function () {
      var keys = Object.keys(cart), total = 0;
      if (!keys.length) {
        cartBox.innerHTML = '<p class="frian_cart_empty">Belum ada pesanan. Klik "Tambah" pada menu.</p>';
      } else {
        cartBox.innerHTML = keys.map(function (k) {
          var it = cart[k]; total += it.price * it.qty;
          return '<div class="frian_cart_item"><span>' + it.name + '<br><small>' + rupiah(it.price) + '</small></span>' +
            '<span class="frian_cart_ctrl"><button data-frian-act="min" data-frian-k="' + k + '">-</button>' + it.qty +
            '<button data-frian-act="plus" data-frian-k="' + k + '">+</button></span></div>';
        }).join("");
      }
      totalEl.textContent = rupiah(total);
    };
    $$(".frian_add_btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var d = b.closest(".frian_dish"), name = d.getAttribute("data-frian-name"), price = parseInt(d.getAttribute("data-frian-price"), 10);
        if (!cart[name]) cart[name] = { name: name, price: price, qty: 0 };
        cart[name].qty++;
        render();
        b.textContent = "\u2713 Ditambah";
        setTimeout(function () { b.textContent = "+ Tambah"; }, 800);
      });
    });
    cartBox.addEventListener("click", function (e) {
      var k = e.target.getAttribute("data-frian-k"); if (!k) return;
      if (e.target.getAttribute("data-frian-act") === "plus") cart[k].qty++;
      else { cart[k].qty--; if (cart[k].qty <= 0) delete cart[k]; }
      render();
    });
    var orderBtn = $("#frian_order_btn");
    var updateLink = function () {
      var keys = Object.keys(cart);
      if (!keys.length) { orderBtn.removeAttribute("href"); orderBtn.textContent = "Pilih menu dulu"; return; }
      var text = "Halo Ichiban Sushi, saya mau pesan:\n" + keys.map(function (k) { return "- " + cart[k].name + " x" + cart[k].qty; }).join("\n") + "\nTotal: " + totalEl.textContent;
      orderBtn.setAttribute("href", "https://wa.me/6281234567890?text=" + encodeURIComponent(text));
      orderBtn.textContent = "Pesan via WhatsApp";
    };
    var baseRender = render;
    render = function () { baseRender(); updateLink(); };
    render();
  }

  /* ---------- Galeri lightbox ---------- */
  var box = $("#frian_lightbox");
  if (box) {
    var pic = $("#frian_lightbox_pic"), cap = $("#frian_lightbox_cap");
    $$(".frian_tile").forEach(function (t) {
      t.addEventListener("click", function () {
        pic.className = "frian_lightbox_pic " + t.getAttribute("data-frian-g");
        pic.textContent = t.getAttribute("data-frian-emoji");
        cap.textContent = t.getAttribute("data-frian-cap");
        box.classList.add("frian_open");
      });
    });
    var close = function () { box.classList.remove("frian_open"); };
    box.addEventListener("click", function (e) { if (e.target === box || e.target.className === "frian_lightbox_close") close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- FAQ accordion ---------- */
  $$(".frian_faq_q").forEach(function (q) {
    q.addEventListener("click", function () { q.parentNode.classList.toggle("frian_open"); });
  });

  /* ---------- Countdown promo ---------- */
  var cd = $("#frian_countdown");
  if (cd) {
    var end = new Date(); end.setDate(end.getDate() + 7); end.setHours(23, 59, 59, 0);
    var tick = function () {
      var diff = Math.max(0, end - new Date());
      var v = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];
      $$("[data-frian-cd]").forEach(function (el, i) { el.textContent = String(v[i]).padStart(2, "0"); });
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Hari ini di tabel jam buka ---------- */
  var rows = $$("#frian_hours tr[data-frian-day]");
  if (rows.length) {
    var today = new Date().getDay();
    rows.forEach(function (r) {
      var days = r.getAttribute("data-frian-day").split(",").map(Number);
      if (days.indexOf(today) > -1) r.classList.add("frian_today");
    });
    var status = $("#frian_open_status");
    if (status) {
      var h = new Date().getHours();
      status.textContent = (h >= 10 && h < 22) ? "\uD83D\uDFE2 Sedang buka sekarang" : "\uD83D\uDD34 Sedang tutup (buka pukul 10.00)";
    }
  }

  /* ---------- Form kontak ---------- */
  var form = $("#frian_form");
  if (form) {
    var rules = {
      nama: function (v) { return v.trim().length >= 3 ? "" : "Nama minimal 3 karakter."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Format email tidak valid."; },
      telepon: function (v) { return /^(\+62|62|0)8[0-9]{8,11}$/.test(v.replace(/[\s-]/g, "")) ? "" : "Nomor HP tidak valid (contoh 0812xxxxxxx)."; },
      subjek: function (v) { return v ? "" : "Silakan pilih subjek."; },
      pesan: function (v) { return v.trim().length >= 10 ? "" : "Pesan minimal 10 karakter."; }
    };
    var check = function (input) {
      var f = input.closest(".frian_field"), msg = rules[input.name](input.value);
      f.classList.toggle("frian_invalid", !!msg);
      $(".frian_error", f).textContent = msg;
      return !msg;
    };
    $$("input, select, textarea", form).forEach(function (i) {
      i.addEventListener("blur", function () { check(i); });
      i.addEventListener("input", function () { if (i.closest(".frian_invalid")) check(i); });
    });
    var counter = $("#frian_char");
    $("textarea", form).addEventListener("input", function (e) { counter.textContent = e.target.value.length + " karakter"; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("input, select, textarea", form).forEach(function (i) { if (!check(i)) ok = false; });
      var note = $("#frian_notice");
      if (!ok) { note.className = ""; return; }
      try {
        var all = JSON.parse(localStorage.getItem("frian_pesan") || "[]");
        all.push({ nama: form.nama.value, email: form.email.value, subjek: form.subjek.value, pesan: form.pesan.value, waktu: new Date().toISOString() });
        localStorage.setItem("frian_pesan", JSON.stringify(all));
      } catch (err) { /* abaikan jika storage diblokir */ }
      note.textContent = "\u2705 Terima kasih, " + form.nama.value.trim() + "! Pesan Anda sudah terkirim ke pemilik Ichiban Sushi.";
      note.className = "frian_show";
      form.reset(); counter.textContent = "0 karakter";
    });
  }
})();
