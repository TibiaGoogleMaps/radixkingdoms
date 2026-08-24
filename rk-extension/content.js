(function () {
  "use strict";
  if (window.top !== window) return;
  if (document.getElementById("rk-main-script")) return;

  function buildUrls() {
    return {
      grama: chrome.runtime.getURL("imagens/grama.png"),
      mine: chrome.runtime.getURL("imagens/Mine.png"),
      barracks: chrome.runtime.getURL("imagens/barracks.png"),
      trezor: chrome.runtime.getURL("imagens/Trezor.png"),
      stronghold: chrome.runtime.getURL("imagens/Stronghold.png"),
      mage_tower: chrome.runtime.getURL("imagens/Mage Tower.png"),
      research_academy: chrome.runtime.getURL("imagens/Research Acadamy.png"),
      obscura_temple: chrome.runtime.getURL("imagens/Obscura Temple.png"),
      icone1: chrome.runtime.getURL("imagens/icone1.png"),
      icone2: chrome.runtime.getURL("imagens/icone2.png"),
      icone3: chrome.runtime.getURL("imagens/icone3.png"),
      icone4: chrome.runtime.getURL("imagens/icone4.png"),
      icone5: chrome.runtime.getURL("imagens/icone5.png"),
      icone6: chrome.runtime.getURL("imagens/icone6.png"),
      castle: chrome.runtime.getURL("imagens/iconeCastelo.png"),
      terrain: chrome.runtime.getURL("imagens/iconeterreno.png"),
      terrainLod1: chrome.runtime.getURL("imagens/iconeterrenoLod1.png"),
      terrainLod2: chrome.runtime.getURL("imagens/iconeterrenoLod2.png"),
      terrainLod3: chrome.runtime.getURL("imagens/iconeterrenoLod3.png"),
      terrainLod4: chrome.runtime.getURL("imagens/iconeterrenoLod4.png"),
      castle: chrome.runtime.getURL("imagens/iconeCastelo.png"),
      castleLod1: chrome.runtime.getURL("imagens/IconeCasteloLod1.png"),
      castleLod2: chrome.runtime.getURL("imagens/IconeCasteloLod2.png"),
      castleLod3: chrome.runtime.getURL("imagens/IconeCasteloLod3.png"),
      castleLod4: chrome.runtime.getURL("imagens/IconeCasteloLod4.png"),
      groupSoldier: chrome.runtime.getURL("imagens/groupSoldier.png"),
      Common: chrome.runtime.getURL("imagens/Common.png"),
      Uncommon: chrome.runtime.getURL("imagens/Uncommon.png"),
      Rare: chrome.runtime.getURL("imagens/Rare.png"),
      Epic: chrome.runtime.getURL("imagens/Epic.png"),
      Legendary: chrome.runtime.getURL("imagens/Legendary.png"),
      soldier1: chrome.runtime.getURL("imagens/Soldier1.png"),
      soldier2: chrome.runtime.getURL("imagens/Soldier2.png"),
      soldier3: chrome.runtime.getURL("imagens/Soldier3.png"),
      soldier4: chrome.runtime.getURL("imagens/Soldier4.png"),
      kgld: chrome.runtime.getURL("imagens/kgld.png"),
      Global: chrome.runtime.getURL("imagens/Global.png"),
      batalha: chrome.runtime.getURL("imagens/Batalha.png"),
      carta: chrome.runtime.getURL("imagens/Carta.png"),
      pergaminho: chrome.runtime.getURL("imagens/Pergaminho.png"),
      trezor2: chrome.runtime.getURL("imagens/Trezor2.png"),
      mais: chrome.runtime.getURL("imagens/mais.png"),
      settings: chrome.runtime.getURL("imagens/settings.png"),
      hof: chrome.runtime.getURL("imagens/Hof.png")
    };
  }

  function expose(urls) {
    var urlsJson = JSON.stringify(urls);
    var root = document.documentElement || document.head || document.body;
    if (root) root.setAttribute("data-rk-img-urls", urlsJson);
  }

  var urls = buildUrls();
  expose(urls);

  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "RK_RESCAN_IMAGES" && e.ports && e.ports[0]) {
      urls = buildUrls();
      expose(urls);
      e.ports[0].postMessage({ urls });
    }
  });

  var s = document.createElement("script");
  s.id = "rk-main-script";
  s.src = chrome.runtime.getURL("main.js");
  (document.documentElement || document.head).appendChild(s);
})();