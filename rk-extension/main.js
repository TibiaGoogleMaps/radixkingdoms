/* ================================================================
 * Radix Kingdoms - Novo Layout (extensão Chrome)
 * Injetado pela extensão via content.js em https://radixkingdoms.com/*
 * As imagens isométricas (imagens/*.png) vêm da extensão e as URLs são
 * expostas em window.__RK_IMG_URLS__ pelo content.js.
 * ================================================================ */

(function () {
  "use strict";

  /* ================================================================
   * Patch: o RDT embutido no site registra custom elements "radix-*".
   * Se o nosso RDT (CDN) carregar depois, ele tentaria re-registrar o
   * mesmo nome e lançaria NotSupportedError. Ignoramos nomes já
   * registrados, permitindo os dois coexistirem (o nosso assina a
   * transação; a UI do site nem chega a montar).
   * ================================================================ */
  const rkOrigDefine = window.customElements && window.customElements.define;
  if (rkOrigDefine) {
    window.customElements.define = function (name, ctor, opts) {
      if (window.customElements.get(name)) return;
      return rkOrigDefine.call(window.customElements, name, ctor, opts);
    };
  }

  /* ================================================================
   * Constantes (extraídas do bundle do site original)
   * ================================================================ */
  const NETWORK_ID = 1; // Mainnet
  const DAPP_DEF = "account_rdx1cye5x6qzusjdz4q7lmjqpxkqeyedw5sem9ne6xccjfq05uze2aaz72";
  const KINGDOM_MANAGER = "component_rdx1czf49543y0gp79ys3t73k9sutgs3qc5g8wsnk0fztz0604csy4g73e";
  const COIN_DISPENSER = "component_rdx1cqnvamjyzlalauyt047wqsz5ev7x4nm65zvkgyjy2et6z8yszrmlh3";
  const KINGDOM_NFT = "resource_rdx1ng5jul04uhrexpnef77wl7fxwljh5jpcxk5exvxtnfz0g8yn8y7f8j";
  const KGLD = "resource_rdx1t49stmluppglp8ul6tv4cncs5qzvytkmvfjmmq3jkncf6dyj3qxvsu";
  const XRD = "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd"; // Ah do site
  const ATTACK_ACCOUNT = "account_rdx129r7rhtnmrfhx0aenystj7h8shlzvqppqje5hgy44hkc93k387a6n9";
  const ATTACK_RESOURCE = "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd";

  const NEW_KINGDOM_COST = 600;   // XRD
  const WAR_XRD_COST = "10.0";    // XRD por ação de guerra
  const WITHDRAW_MAX_FEE = "500"; // XRD
  const CELL_W = 90;
  const CELL_H = 60; // site usa Y * 60
  const COLS = 90;
  const ROWS = 60;
  const PROSPECT_COST_KGLD = 10000;
  const GATEWAY = "https://mainnet.radixdlt.com";
  const SITE_API = "https://radixkingdoms.com/api";

  function normalizeSiteKingdomData(data) {
    const kd = data.kingdom_data || data;
    const kb = kd.kingdom_buildings || {};
    const ka = kd.kingdom_army || {};
    
    const _ratio = parseFloat(kd.minting_ratio || 0);
    const _mines = kb.mine || kd.mine || kd.mine_count || 0;
    const _lastClaim = Math.max(kd.last_time_claimed || 0, kd.mining_start || 0);
    const _isMining = kd.is_mining === true || kd.is_mining === "true";
    
    const unclaimedGold = parseFloat(
      kd.mineable_resources ||
      kd.unclaimed_gold ||
      kd.unclaimedGold ||
      kd.unclaimed_resources ||
      kd.claimable_resources ||
      kd.mining_rewards_unclaimed ||
      kd.unclaimed_mining_rewards ||
      kd.mined_unclaimed ||
      0
    );
    
    return {
      component: data.component,
      nftId: data.nftId || data.kingdom_owner_nft_id,
      name: kd.kingdom_name || data.name,
      kgld: parseFloat(kd.kgld || data.kgld || 0),
      trezor: parseFloat(kd.trezor || data.trezor || 0),
      mine: kb.mine || kd.mine || kd.mine_count || 0,
      barracks: kb.barracks || kd.barracks || 0,
      trezorCount: kb.trezor || kd.trezor || 0,
      stronghold: kb.stronghold || kd.stronghold || 0,
      mageTower: kb.mage_tower || kd.mage_tower || 0,
      researchAcademy: kb.research_academy || kd.research_academy || 0,
      obscuraTemple: kb.obscura_temple || kd.obscura_temple || 0,
      maxBuildings: kb.max_buildings || kd.max_buildings || 0,
      defendingUnits: ka.defending_units || kd.defending_units || 0,
      kingdomMissiles: ka.kingdom_missiles || kd.kingdom_missiles || 0,
      launchedMissiles: ka.launched_missiles || kd.launched_missiles || 0,
      antiMissileBarriers: ka.anti_missile_barriers || kd.anti_missile_barriers || 0,
      lockedAttacking: ka.locked_attacking_units || kd.locked_attacking_units || 0,
      lockedRaiding: ka.locked_raiding_units || kd.locked_raiding_units || 0,
      lockedFortifying: ka.locked_fortifying_units || kd.locked_fortifying_units || 0,
      lockedTraveling: ka.locked_traveling_units || kd.locked_traveling_units || 0,
      defenseStrenght: parseFloat(kd.defense_strenght || 0),
      attackStrenght: parseFloat(kd.attack_strenght || 0),
      mintingRatio: _ratio,
      mineableResources: parseFloat(kd.mineable_resources || 0),
      miningStart: kd.mining_start || 0,
      lastTimeClaimed: kd.last_time_claimed || 0,
      lastTimeWithdrawn: kd.last_time_withdrawn || 0,
      armyUnitsCompleted: kd.army_units_completed || 0,
      missilesCompleted: kd.missiles_completed || 0,
      amBarrierCompleted: kd.am_barrier_completed || 0,
      lastAttack: kd.last_attack || 0,
      lastRaid: kd.last_raid || 0,
      lastFortify: kd.last_fortify || 0,
      lastMissile: kd.last_missile || 0,
      lastProspect: kd.last_prospect || 0,
      armyToBeClaimed: kd.army_to_be_claimed || 0,
      missilesToBeClaimed: kd.missiles_to_be_claimed || 0,
      amBarriersToBeClaimed: kd.am_barriers_to_be_claimed || 0,
      underConstruction: kd.under_construction || "none",
      buildingConstructionStart: kd.building_construction_start || 0,
      buildingConstructionDuration: kd.building_construction_duration || 0,
      isBuilding: kd.is_building === true || kd.is_building === "true",
      isMining: _isMining,
      isAttacking: kd.is_attacking === true || kd.is_attacking === "true",
      isRaiding: kd.is_raiding === true || kd.is_raiding === "true",
      isFortifying: kd.is_fortifing === true || kd.is_fortifing === "true",
      unclaimedGold,
    };
  }
  const BUILD_COSTS = { mine: 300, barracks: 500, trezor: 750, stronghold: 1000, mage_tower: 5000, research_academy: 3000, obscura_temple: 5000 };
  const BUILD_MAX = { mine: 3, barracks: 4, trezor: 1, stronghold: 1, mage_tower: 4, research_academy: 1, obscura_temple: 1 };
  const BUILD_TIMES = { mine: 21600, barracks: 28800, trezor: 28800, stronghold: 36000, mage_tower: 43200, research_academy: 43200, obscura_temple: 43200 };
  const BUILD_NAMES = {
    mine: "⛏️ Mine", barracks: "⚔️ Barracks", trezor: `💰 Trezor`, stronghold: "🏰 Stronghold",
    mage_tower: "🔮 Mage Tower", research_academy: "🎓 Research Acadamy", obscura_temple: "🛕 Obscura Temple",
  };
  const BUILD_ICONS = { mine: "⛏️", barracks: "⚔️", trezor: "💰", stronghold: "🏰", mage_tower: "🔮", research_academy: "🎓", obscura_temple: "🛕" };
  const COOLDOWNS = { attack: 14400, raid: 14400, fortify: 14400, missile: 14400 }; // segundos
  const BUILD_COUNT_KEY = {
    mine: "mine", barracks: "barracks", trezor: "trezorCount",
    stronghold: "stronghold", mage_tower: "mageTower",
    research_academy: "researchAcademy", obscura_temple: "obscuraTemple",
  };

  // Detecta o nível de zoom do navegador (Ctrl +/-) para que possamos
  // aplicar um counter-scale nos elementos da UI e eles manterem
  // tamanho/posição fixos, como a grama.png (background-size) já faz.
  function detectBrowserZoom() {
    // Método: comparar a largura visível de um elemento de 100px CSS
    // com 100px reais. Quando há zoom, 100px CSS vira 100*zoom px reais.
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:100px;height:100px;visibility:hidden;pointer-events:none;";
    document.body.appendChild(probe);
    const z = probe.getBoundingClientRect().width / 100;
    probe.remove();
    return z;
  }
  function applyBrowserZoomFix() {
    const z = detectBrowserZoom();
    if (!z || !isFinite(z) || z <= 0) return;
    const inv = 1 / z;
    const ground = $("#rk-iso-ground");
    const buildings = $("#rk-iso-buildings");
    if (ground) ground.style.transform = `scale(${z})`;
    if (ground) ground.style.transformOrigin = "center center";
    if (buildings) buildings.style.transform = `scale(${inv})`;
    if (buildings) buildings.style.transformOrigin = "center bottom";
  }
  const BUILD_ACTION = {
    mine: { label: `KGLD Reivindicar mineração`, fn: () => actionClaim() },
    barracks: { label: "⚔️ Recrutar defensores", fn: () => actionRecruit() },
    trezor: { label: "💎 Depositar no Trezor", fn: () => actionTrezor() },
    mage_tower: { label: "🚀 Fabricar mísseis", fn: () => actionMissiles() },
    stronghold: null,
    obscura_temple: null,
  };

  /* ================================================================
   * CSS do novo layout
   * ================================================================ */
  const CSS = `
:root{--gold:#d4af37;--gold2:#f0d56e;--bg:#0b0f14;--panel:rgba(13,17,23,.94);--panel2:rgba(24,30,40,.92);--line:#2a3441;--txt:#e8e6df;--dim:#9aa3ad;--ok:#3fb950;--err:#f85149;--blue:#58a6ff;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;}
body{background:var(--bg);color:var(--txt);font-family:system-ui,'Segoe UI',Roboto,sans-serif;overflow:hidden;}
#rk-root{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;}
button{font-family:inherit;}
.btn{background:var(--panel2);border:1px solid var(--line);color:var(--txt);padding:7px 12px;border-radius:8px;cursor:pointer;font-size:13px;transition:border-color .15s,background .15s;}
.btn:hover:not(:disabled){border-color:var(--gold);}
.btn:disabled{opacity:.45;cursor:not-allowed;}
.btn.gold{background:linear-gradient(180deg,#6b5210,#3a2c06);border-color:var(--gold);color:var(--gold2);font-weight:600;}
.btn.ghost{background:transparent;}

/* ---- Mapa (tela cheia) ---- */
#rk-map{position:relative;flex:1;overflow:hidden;user-select:none;-webkit-user-select:none;}
#rk-map-viewport{position:absolute;inset:0;cursor:grab;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;}
#rk-map-viewport.dragging{cursor:grabbing;}
#rk-map-content{position:absolute;left:0;top:0;width:8100px;height:3600px;transform-origin:0 0;}
#rk-map-grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(60,80,60,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(60,80,60,.18) 1px,transparent 1px);
  background-size:${CELL_W}px ${CELL_H}px;
  background-image:linear-gradient(rgba(212,175,55,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.06) 1px,transparent 1px);
  z-index:1;}
#rk-map-terrain{position:absolute;inset:0;z-index:0;pointer-events:none;background-repeat:repeat;background-size:512px 512px;background-position:0 0;background-color:#10151b;}
#rk-markers{position:absolute;inset:0;z-index:2;}
#rk-create-markers{position:absolute;inset:0;z-index:20;}
#rk-create-markers .create-marker{pointer-events:auto;}
#rk-map-lines{position:absolute;inset:0;pointer-events:none;z-index:3;}
.rk-line{position:absolute;background:var(--gold);transform-origin:0 0;pointer-events:none;}
.rk-line.attack{background:rgba(255,80,80,.8);box-shadow:0 0 8px rgba(255,80,80,.6);}
.rk-line.missile{background:rgba(255,200,50,.85);box-shadow:0 0 8px rgba(255,200,50,.6);}
.rk-line.raid{background:rgba(180,50,255,.8);box-shadow:0 0 8px rgba(180,50,255,.6);}
.rk-line.fortify{background:rgba(80,180,255,.8);box-shadow:0 0 8px rgba(80,180,255,.6);}
.rk-battle-line{position:absolute;height:2px;transform-origin:0 0;z-index:1;pointer-events:none;}
.rk-battle-line.war{background:rgba(255,0,0,.8);box-shadow:0 0 6px rgba(255,0,0,.55);}
.rk-battle-line.raid{background:rgba(255,204,0,.8);box-shadow:0 0 6px rgba(255,204,0,.55);}
.rk-battle-line.missile{background:rgba(0,102,204,.9);box-shadow:0 0 6px rgba(0,102,204,.6);}
.rk-battle-line.fortify{background:rgba(0,204,0,.85);box-shadow:0 0 6px rgba(0,204,0,.55);}
.rk-battle-line.prospect{background:rgba(153,0,204,.8);box-shadow:0 0 6px rgba(153,0,204,.5);}
.rk-battle-head{position:absolute;font-size:15px;line-height:1;z-index:1;pointer-events:none;filter:drop-shadow(0 0 3px #000);}
.rk-battle-head.moving{animation:rk-missile 1.6s linear infinite;}
@keyframes rk-missile{0%{transform:translate(0,0);}100%{transform:translate(6px,-6px);}}
#rk-battles-panel{position:absolute;top:60px;right:14px;width:460px;max-height:74%;overflow-y:auto;background:var(--panel);border:1px solid var(--err);border-radius:12px;padding:10px 12px;z-index:40;box-shadow:0 12px 40px rgba(0,0,0,.7);}
.ads-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;border-bottom:1px solid var(--line);padding-bottom:8px;}
.ads-title{font-weight:800;color:var(--gold2);font-size:13px;letter-spacing:.3px;}
.ads-alert{background:var(--err);color:#fff;font-size:9px;font-weight:700;border-radius:4px;padding:1px 6px;}
.ads-upd{font-size:10px;color:var(--dim);flex:1;}
.ads-close{background:transparent;border:none;color:var(--dim);font-size:16px;cursor:pointer;line-height:1;padding:0 2px;}
.ads-close:hover{color:#fff;}
.ads-table{width:100%;border:1px solid var(--line);border-radius:8px;overflow:hidden;margin-bottom:8px;}
.ads-row{display:grid;grid-template-columns:44px 64px 1fr 1fr 64px 84px;gap:4px;padding:5px 6px;font-size:10px;align-items:center;}
.ads-hrow{background:rgba(248,81,73,.12);color:var(--gold2);font-weight:700;text-transform:uppercase;letter-spacing:.3px;border-bottom:1px solid var(--line);}
.ads-body{max-height:230px;overflow-y:auto;}
.ads-row.ads-item{border-bottom:1px solid var(--line);}
.ads-row.ads-item:last-child{border-bottom:none;}
.ads-row .ads-type{font-weight:700;display:flex;align-items:center;gap:4px;}
  .ads-thumb{position:relative;width:22px;height:22px;border-radius:4px;overflow:hidden;flex:none;background:#0b0f14;border:1px solid var(--line);}
  .ads-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
  .ads-thumb .ads-prog{position:absolute;left:0;bottom:0;height:3px;background:var(--gold);width:0%;transition:width 1s linear;}
.ads-type.war{color:#ff5555;}
.ads-type.raid{color:#ffcc00;}
.ads-type.missile{color:#58a6ff;}
.ads-type.fortify{color:#3fb950;}
.ads-type.prospect{color:#c678dd;}
.ads-row .ads-names{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ads-row .ads-cd{font-weight:700;color:#ffb3b0;text-align:right;font-variant-numeric:tabular-nums;}
.battle-section{margin-bottom:10px;}
.battle-sec-title{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.4px;margin:6px 0 4px;border-bottom:1px solid var(--line);padding-bottom:3px;}
.hof-tab{flex:1;background:transparent;border:none;color:var(--dim);padding:10px 8px;cursor:pointer;font-size:12px;font-weight:600;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;}
.hof-tab:hover{color:var(--txt);}
.hof-tab.active{color:var(--gold2);border-bottom-color:var(--gold);}
.hof-table{width:100%;border-collapse:collapse;font-size:12px;}
.hof-table th{text-align:left;padding:6px 8px;color:var(--dim);font-weight:700;text-transform:uppercase;letter-spacing:.3px;font-size:10px;border-bottom:1px solid var(--line);background:rgba(212,175,55,.05);}
.hof-table td{padding:7px 8px;border-bottom:1px solid var(--line);}
.hof-table tr:hover td{background:rgba(212,175,55,.06);}
.hof-table tr.hof-row{cursor:pointer;transition:background .12s;}
.hof-table tr.hof-row:hover td{background:rgba(212,175,55,.12);}
.hof-table td.rank{width:30px;color:var(--gold);font-weight:700;font-size:13px;text-align:center;}
.hof-table td.val{text-align:right;font-weight:600;font-family:'Courier New',monospace;}
.hof-table td.val.gold{color:var(--gold2);}
.hof-empty{text-align:center;padding:30px 12px;color:var(--dim);font-size:12px;}
.hof-table .podium-1 td{background:linear-gradient(90deg,rgba(212,175,55,.18),transparent);}
.hof-table .podium-2 td{background:linear-gradient(90deg,rgba(192,192,192,.12),transparent);}
.hof-table .podium-3 td{background:linear-gradient(90deg,rgba(205,127,50,.12),transparent);}
.hof-table .podium-1 td.rank{color:#FFD700;}
.hof-table .podium-2 td.rank{color:#C0C0C0;}
.hof-table .podium-3 td.rank{color:#CD7F32;}
.hof-own{display:inline-block;background:linear-gradient(180deg,#1a5c22,#0c3311);border:1px solid #2da13b;color:#7ee787;font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.3px;}
.hof-enemy{display:inline-block;background:linear-gradient(180deg,#5c1a1a,#330c0c);border:1px solid #d83a3a;color:#ff8a8a;font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;text-transform:uppercase;letter-spacing:.3px;}
.hof-table td.type{width:80px;text-align:center;}
.hof-summary{padding:8px 10px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;margin-bottom:10px;font-size:11px;color:var(--dim);}
.hof-summary .hof-sum-own{color:#7ee787;font-weight:600;}
.hof-summary .hof-sum-enemy{color:#ff8a8a;font-weight:600;}
.battle-list{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;}
.battle-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--txt);background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:4px 7px;cursor:pointer;}
.battle-item:hover{border-color:var(--gold);}
.battle-item .btype{font-size:12px;}
.battle-item .bfield{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.battle-item .bvs{white-space:nowrap;color:var(--dim);font-size:10px;}
.rk-badge{background:var(--err);color:#fff;border-radius:9px;padding:0 6px;font-size:10px;margin-left:5px;}
.kingdom-marker{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;text-align:center;pointer-events:none;filter:drop-shadow(0 0 4px rgba(0,0,0,.8));z-index:2;}
.kingdom-marker .castle{pointer-events:auto;cursor:pointer;font-size:40px;display:block;line-height:1;transition:transform .12s;}
.kingdom-marker .castle:hover{transform:scale(1.25);}
.kingdom-marker .kname{font-size:9px;color:#cfd6dd;text-shadow:0 1px 2px #000;display:block;max-width:78px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none;}
  .kingdom-marker .rarity-icon{position:absolute;left:-22px;top:50%;transform:translateY(-50%);width:20px;height:20px;object-fit:contain;filter:drop-shadow(0 0 3px #000);pointer-events:none;z-index:1;}
  .kingdom-marker.own .castle{filter:hue-rotate(120deg) drop-shadow(0 0 6px var(--gold));}
  .kingdom-marker.target .castle{filter:hue-rotate(-40deg) drop-shadow(0 0 6px var(--err));}

  /* Floating stats panel top-left */
  #rk-floating-stats{position:absolute;top:70px;left:14px;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 12px;z-index:20;min-width:160px;display:none;box-shadow:0 4px 16px rgba(0,0,0,.5);}
  #rk-floating-stats.show{display:block;}
  #rk-floating-stats .stat-row{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12px;}
  #rk-floating-stats .stat-icon{font-size:16px;}
  #rk-floating-stats .stat-val{color:var(--gold2);font-weight:700;font-variant-numeric:tabular-nums;}
  #rk-floating-stats .stat-label{color:var(--dim);font-size:11px;}

#rk-cursor{position:absolute;top:70px;left:12px;background:var(--panel);border:1px solid var(--line);padding:4px 10px;border-radius:6px;font-size:12px;z-index:5;}
#rk-cursor.hidden{display:none;}

/* ---- Barra superior (dentro do mapa) ---- */
#rk-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(180deg,rgba(5,8,12,.96),rgba(5,8,12,.82));border-bottom:1px solid var(--line);z-index:10;flex-wrap:wrap;}
#rk-title{font-weight:800;color:var(--gold2);font-size:15px;letter-spacing:.5px;text-shadow:0 0 12px rgba(212,175,55,.4);}
#rk-title small{display:block;font-size:10px;color:var(--dim);font-weight:400;letter-spacing:0;}
#rk-bal{display:flex;gap:12px;font-size:12px;color:var(--dim);}
#rk-bal b{color:var(--txt);}
#rk-account{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--dim);}

  #rk-kingdom{max-width:190px;background:var(--panel2);color:var(--txt);border:1px solid var(--line);border-radius:8px;padding:5px 8px;font-size:11px;cursor:pointer;}
  #rk-kingdom:disabled{opacity:.5;cursor:not-allowed;}
  #rk-target-search{max-width:200px;background:var(--panel2);color:var(--txt);border:1px solid var(--line);border-radius:8px;padding:5px 8px;font-size:11px;}
  #rk-target-search::placeholder{color:var(--dim);}
  #rk-target-search:focus{outline:none;border-color:var(--gold);}
  #rk-target-results{position:absolute;top:calc(100% - 8px);left:0;background:var(--panel2);border:1px solid var(--gold);border-radius:8px;max-height:240px;overflow-y:auto;z-index:30;min-width:220px;box-shadow:0 8px 24px rgba(0,0,0,.6);display:none;}
  #rk-target-results.show{display:block;}
  #rk-target-results .tr-item{padding:6px 10px;font-size:11px;color:var(--txt);cursor:pointer;display:flex;justify-content:space-between;gap:8px;}
  #rk-target-results .tr-item:hover{background:rgba(212,175,55,.15);}
  #rk-target-results .tr-coords{color:var(--dim);}

  #rk-ver{font-size:10px;color:var(--dim);opacity:.7;white-space:nowrap;}


.rk-act{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:54px;padding:7px 8px;border-radius:10px;background:transparent;border:1px solid transparent;color:var(--txt);cursor:pointer;font-size:10px;line-height:1.1;}
.rk-act:hover{background:var(--panel2);border-color:var(--line);}
.rk-act .ic{font-size:18px;}
.rk-act.disabled{opacity:.4;pointer-events:none;}
.rk-act.gold{background:linear-gradient(180deg,#6b5210,#3a2c06);border-color:var(--gold);color:var(--gold2);font-weight:600;}
.rk-act.pick{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold);}

/* ---- Painel do alvo (dentro do mapa, canto inferior direito) ---- */
#rk-target{position:absolute;right:14px;bottom:14px;width:300px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;z-index:9;box-shadow:0 8px 24px rgba(0,0,0,.5);}
#rk-target.hidden{display:none;}
#rk-target{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px;min-width:280px;max-width:340px;box-shadow:0 8px 24px rgba(0,0,0,.5);}
#rk-target h3{font-size:14px;color:var(--gold2);margin-bottom:8px;display:flex;align-items:center;gap:8px;}
#rk-target .tk{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:11px;color:var(--txt);margin-bottom:8px;}
#rk-target .tk .tl{color:var(--dim);}
#rk-target .tk .tv{font-weight:600;}
#rk-target .tk.warn .tv{color:var(--err);}
#rk-target .tk.ok .tv{color:var(--ok);}
#rk-target .sep{border-top:1px solid var(--line);margin:8px 0;}
#rk-target .act-row{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
#rk-target .act-row .btn{flex:1;font-size:11px;padding:6px 8px;}
#rk-target .eta{font-size:10px;color:var(--dim);white-space:nowrap;text-align:center;}
#rk-war{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
  #rk-war .wk{display:flex;flex-direction:column;gap:2px;}
  #rk-war .wk .btn{width:100%;}

/* ---- Castelo (visão interna) ---- */
#rk-castle{position:absolute;inset:0;z-index:20;background:var(--bg);display:none;flex-direction:column;overflow-y:auto;}
#rk-castle.open{display:flex;}
#rk-castle-head{display:flex;align-items:center;gap:12px;padding:10px 18px;background:linear-gradient(180deg,rgba(5,8,12,.96),rgba(5,8,12,.85));border-bottom:1px solid var(--line);position:sticky;top:0;z-index:2;flex-wrap:wrap;}
#rk-castle-head h2{color:var(--gold2);font-size:17px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
#rk-castle-head .sub{color:var(--dim);font-size:12px;}
#rk-castle-kingdom{max-width:220px;background:transparent;color:var(--gold2);border:1px solid var(--line);border-radius:8px;padding:3px 6px;font-size:13px;font-weight:700;cursor:pointer;margin-left:6px;}
#rk-castle-kingdom:hover{border-color:var(--gold);}
#rk-castle-kingdom:disabled{opacity:1;cursor:pointer;}
#rk-castle-top{padding:0;margin:0;max-width:none;width:auto;display:inline-flex;flex-direction:row;gap:8px;flex-wrap:wrap;}
.mkt-bar{display:flex;flex-direction:row;align-items:center;gap:6px;flex-wrap:wrap;}
.mkt-item{display:flex;align-items:center;gap:5px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:3px 8px;white-space:nowrap;}
.mkt-ic{display:inline-flex;align-items:center;font-size:16px;line-height:1;}
.mkt-ic img{width:18px;height:18px;object-fit:contain;}
.mkt-l{font-size:9px;color:var(--dim);text-transform:uppercase;letter-spacing:.3px;}
.mkt-v{font-size:12px;color:var(--txt);}
#rk-float-actions{position:absolute;top:12px;right:12px;z-index:6;display:flex;flex-direction:column;gap:8px;max-width:200px;}
#rk-float-actions .btn{font-size:12px;padding:7px 12px;text-align:left;box-shadow:0 4px 14px rgba(0,0,0,.5);}
#rk-castle-actions2{position:absolute;left:12px;bottom:12px;z-index:60;display:flex;flex-direction:column;gap:8px;max-width:230px;max-height:calc(100% - 24px);overflow-y:auto;}
.prod-card{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;box-shadow:0 4px 14px rgba(0,0,0,.5);}
.prod-head{font-size:12px;font-weight:600;color:var(--gold2);}
.prod-cost{font-size:10px;color:var(--dim);}
.prod-val{font-size:20px;font-weight:700;color:var(--txt);}
.prod-req{font-size:10px;color:var(--err);}

.hidden{display:none!important;}

/* ---- Botões flutuantes (histórico, meus ataques, global) ---- */
#rk-float-buttons{position:fixed;right:14px;bottom:14px;display:flex;gap:10px;z-index:2147483050;}
.rk-fab{background:none;border:none;cursor:pointer;box-shadow:none;position:relative;transition:none;padding:0;}
.rk-fab .ic{display:block;transition:transform .15s;}
.rk-fab:hover .ic{transform:scale(1.1);}
.rk-fab .rk-badge{position:absolute;top:-5px;right:-7px;}

#rk-create-kingdom-fab{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:2147483050;}
#rk-create-kingdom-fab .ic{background:linear-gradient(180deg,#6b5210,#3a2c06);border:2px solid var(--gold);color:var(--gold2);font-weight:700;font-size:14px;padding:14px 28px;border-radius:12px;cursor:pointer;transition:transform .15s,box-shadow .15s;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.5);}
#rk-create-kingdom-fab .ic:hover{transform:scale(1.05);box-shadow:0 6px 24px rgba(212,175,55,.4);}
.army-card{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;}
.army-card-content{display:flex;align-items:center;gap:8px;}
.army-icon{font-size:18px;}
.army-info{display:flex;flex-direction:column;}
.army-name{font-size:11px;color:var(--gold2);font-weight:700;}
.army-value{font-size:11px;color:var(--err);font-weight:700;}
.build-timer{font-size:10px;color:var(--txt);}
.cooldown-timer{color:#ffb3b0;font-weight:700;}
#rk-history-panel,#rk-myattacks-panel{position:absolute;top:60px;right:14px;width:760px;max-height:78%;overflow-y:auto;background:var(--panel);border:1px solid var(--gold);border-radius:12px;padding:10px 12px;z-index:40;box-shadow:0 12px 40px rgba(0,0,0,.7);}
#rk-history-search{background:var(--panel2);color:var(--txt);border:1px solid var(--line);border-radius:8px;padding:4px 8px;font-size:11px;flex:1;min-width:120px;}
.wh-row{display:grid;grid-template-columns:56px 160px 1fr 1fr 1fr 78px 58px;gap:10px;padding:4px 6px;font-size:10px;align-items:center;}
.wh-hrow{background:rgba(212,175,55,.1);color:var(--gold2);font-weight:700;text-transform:uppercase;letter-spacing:.3px;border-bottom:1px solid var(--line);}
.wh-body{max-height:420px;overflow-y:auto;}
.wh-row.wh-item{border-bottom:1px solid var(--line);}
.wh-row.wh-item:last-child{border-bottom:none;}
.wh-item .wh-type{font-weight:700;}
.wh-type.Raid{color:#ffcc00;}
.wh-type.Attack{color:#ff5555;}
.wh-type.Missile{color:#58a6ff;}
.wh-type.Fortify{color:#3fb950;}
.wh-item .wh-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.wh-details{background:var(--panel2);border:1px solid var(--line);color:var(--txt);border-radius:6px;font-size:9px;padding:2px 6px;cursor:pointer;}
.wh-details:hover{border-color:var(--gold);color:#fff;}
#rk-hd{position:fixed;inset:0;z-index:2147483055;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;}
.hd-box{background:var(--panel);border:1px solid var(--gold);border-radius:12px;padding:12px 14px;width:420px;max-width:92vw;box-shadow:0 16px 50px rgba(0,0,0,.8);}
.hd-head{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:8px;}
.hd-row{display:flex;gap:8px;padding:4px 0;font-size:11px;border-bottom:1px dashed var(--line);}
.hd-row:last-child{border-bottom:none;}
.hd-row .k{color:var(--dim);min-width:96px;}
.hd-row .v{color:var(--txt);word-break:break-all;}

/* ---- Visão isométrica do reino (imagens da pasta Imagens) ---- */
#rk-iso-scene{position:relative;flex:1 1 auto;min-height:420px;margin:0;padding:0;overflow:hidden;}
#rk-iso-ground{position:absolute;inset:0;background:#3a6b35;background-repeat:no-repeat;background-size:100% 100%;background-position:center center;}
#rk-iso-buildings{position:absolute;inset:0;display:flex;flex-wrap:wrap;align-content:center;align-items:flex-end;justify-content:center;gap:8px 14px;padding:0 260px;}
.ikb{position:relative;display:flex;flex-direction:column;align-items:center;max-width:150px;cursor:default;}
.ikb img{display:block;width:auto;max-height:130px;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(0,0,0,.45));}
.ikb.building img{opacity:.55;filter:grayscale(.3) brightness(.8) drop-shadow(0 8px 10px rgba(0,0,0,.45));}
.ikb .ikb-tag{display:flex;flex-direction:column;align-items:center;margin-top:4px;background:rgba(0,0,0,.55);border:1px solid var(--line);border-radius:8px;padding:3px 8px;font-size:11px;line-height:1.2;}
.ikb .ikb-tag b{color:var(--gold2);}
.ikb .ikb-tag small{color:var(--dim);font-size:9px;}
.ikb.max img{opacity:.85;}
.ikb.empty img{opacity:.25;filter:grayscale(.8) brightness(.5) drop-shadow(0 8px 10px rgba(0,0,0,.45));}
.ikb.empty .ikb-tag{border-style:dashed;opacity:.8;}
.ikb-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,#6b5210,#3a2c06);border:1px solid var(--gold);color:var(--gold2);font-size:11px;font-weight:600;border-radius:10px;padding:3px 10px;white-space:nowrap;width:max-content;box-shadow:0 4px 10px rgba(0,0,0,.5);z-index:2;display:flex;flex-direction:column-reverse;align-items:center;gap:1px;}
.ikb-badge [data-rk-countdown]{font-weight:700;color:#fff;}
.ikb-badge.ready{background:linear-gradient(180deg,#1a5c22,#0c3311);border-color:var(--ok);color:#7ee787;cursor:pointer;}
.ikb-badge.busy{background:linear-gradient(180deg,#20405c,#10222f);border-color:var(--blue);color:#9cc8ff;}
.ikb.clickable{cursor:pointer;}
.ikb.clickable img{transition:transform .15s ease;}
.ikb.clickable:hover img{transform:translateY(-3px);}
.ikb.clickable:hover .ikb-tag{background:rgba(20,20,30,.8);border-color:var(--gold2);}

/* ---- Status / toasts / modal ---- */
#rk-status{position:absolute;top:64px;left:50%;transform:translateX(-50%);background:var(--panel);border:1px solid var(--gold);color:var(--gold2);padding:8px 16px;border-radius:8px;font-size:13px;z-index:12;display:none;}
#rk-status.show{display:block;}
#rk-toast-root{position:fixed;top:12px;right:12px;z-index:2147483100;display:flex;flex-direction:column;gap:8px;}
.toast{background:var(--panel);border:1px solid var(--ok);color:var(--txt);padding:10px 14px;border-radius:8px;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,.5);}
.toast.err{border-color:var(--err);}
#rk-modal-root{position:fixed;inset:0;z-index:2147483200;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);}
#rk-modal-root.open{display:flex;}
.modal{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px;width:400px;max-width:92vw;max-height:95vh;overflow:visible;}
  .modal.modal-wide{width:720px;}
  .modal.modal-extra-wide{width:1080px;max-width:98vw;}
.modal h3{color:var(--gold2);margin-bottom:12px;font-size:15px;}
.modal label{display:block;font-size:12px;color:var(--dim);margin:10px 0 4px;}
.modal .info{font-size:12px;color:var(--dim);margin:4px 0 8px;}
.modal input,.modal select{width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--txt);border-radius:8px;padding:8px 10px;font-size:13px;margin-bottom:2px;}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;}
.tz-panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:4px;}
.modal.modal-trezor{width:min(720px,94vw);padding:12px;}
.modal-trezor h3{font-size:13px;margin-bottom:6px;}
.modal-trezor .tz-panels{gap:8px;}
.modal-trezor .tz-panel{padding:8px 10px;gap:4px;border-radius:8px;}
.modal-trezor .tz-panel h4{font-size:11px;margin:0;}
.modal-trezor p.info{font-size:10px;margin:2px 0;}
.modal-trezor label{font-size:10px;margin:3px 0 2px;}
.modal-trezor input[type=range].tz-scroll{height:14px;margin-bottom:2px;}
.modal-trezor input[type=number],.modal-trezor .rk-input{padding:4px 7px;font-size:12px;margin-bottom:0;}
.modal-trezor .tz-quick{gap:3px;margin-top:2px;}
.modal-trezor .tz-quick .btn{padding:4px 6px;font-size:10px;min-width:38px;}
.modal-trezor .tz-panel > .btn.gold{padding:5px;font-size:11px;}
.modal-trezor .modal-actions{margin-top:10px;}
.modal-trezor .modal-actions .btn{padding:5px 12px;font-size:11px;}
.tz-panel{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:8px;min-width:0;}
.tz-panel h4{color:var(--gold2);font-size:13px;margin:0 0 4px;}
.tz-scroll-wrap{display:flex;flex-direction:column;gap:6px;}
.tz-scroll{width:100%;height:24px;accent-color:var(--gold2);cursor:ew-resize;}
.tz-quick{display:flex;gap:4px;flex-wrap:wrap;}
.tz-quick .btn{flex:1;padding:6px;font-size:11px;min-width:50px;}
.tz-panel .rk-input{width:100%;}
  .tz-sep{border-top:1px solid var(--line);margin:10px 0;}
.building-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.building-opt{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:10px;text-align:left;cursor:pointer;color:var(--txt);}
.building-opt.selected{border-color:var(--gold);}
.building-opt:disabled{opacity:.4;cursor:not-allowed;}
.building-opt .b-name{font-size:13px;font-weight:600;}
.building-opt .b-cost{font-size:11px;color:var(--dim);margin-top:2px;}

/* Detailed building panel */
.building-grid-detailed{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.building-opt .b-header{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
.building-opt .b-icon{font-size:24px;}
.building-opt .b-details{display:flex;flex-direction:column;gap:3px;font-size:11px;}
.building-opt .b-count{color:var(--gold2);font-weight:600;}
.building-opt .b-time{color:var(--dim);}
.building-opt .b-cost{color:var(--txt);}
.building-opt .not-enough{color:var(--err);font-size:10px;font-weight:600;}

/* ---- Zoom ---- */
#rk-zoom{position:absolute;right:14px;top:70px;display:flex;flex-direction:column;gap:6px;z-index:8;}
#rk-zoom button{width:34px;height:34px;font-size:16px;border-radius:8px;}
`;

  /* ================================================================
   * Boot: remover o site e montar o nosso DOM
   * ================================================================ */
  function boot() {
    // CSP bloqueando o bundle do site (defer de mesma origem) — precisa estar
    // dentro do <head>; o boot roda com o head pronto e ANTES do
    // DOMContentLoaded, então o main.js é barrado antes de executar.
    try {
      const rkMeta = document.createElement("meta");
      rkMeta.httpEquiv = "Content-Security-Policy";
      rkMeta.content =
        "script-src 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net chrome-extension:; " +
        "style-src * 'unsafe-inline'; " +
        "img-src * data: chrome-extension:; " +
        "connect-src *; " +
        "default-src *;";
      document.head.appendChild(rkMeta);
    } catch (e) {}

    const style = document.createElement("style");
    style.id = "rk-style";
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);

    // Remove o bundle do site (defer, ainda não executou) e o CSS dele.
    // Assim o app do site NÃO roda: nada conflita com o nosso RDT (custom elements
    // do site, etc.) e a wallet restaura a sessão automaticamente.
    document.head.querySelectorAll("script, link[rel='stylesheet']").forEach((n) => n.remove());

    const root = document.createElement("div");
    root.id = "rk-root";
    root.innerHTML = `
      <div id="rk-map">
        <div id="rk-map-viewport">
          <div id="rk-map-content">
            <div id="rk-map-terrain"></div>
            <div id="rk-map-grid"></div>
            <div id="rk-map-lines"></div>
            <div id="rk-markers"></div>
            <div id="rk-create-markers"></div>
          </div>
        </div>
        <div id="rk-cursor" class="hidden"></div>
        <div id="rk-top">
          <div id="rk-title">🏰 RADIX KINGDOMS<small>novo layout</small></div>
          <div id="rk-bal"><span id="rk-bal-wallet"></span><span id="rk-bal-treasury"></span></div>
          <span id="rk-account"></span>
          <button class="btn gold" id="rk-connect">Conectar Wallet</button>
          <select id="rk-kingdom" title="Selecionar seu reino" data-i18n-attr="title=selectKingdom" disabled><option value="" data-i18n="yourKingdom"></option></select>
          <span style="position:relative;">
            <input id="rk-target-search" type="text" placeholder="🔎 Alvo: nome ou x,y" data-i18n-attr="placeholder=targetSearchPlaceholder" autocomplete="off" spellcheck="false">
            <div id="rk-target-results"></div>
          </span>
          <span id="rk-ver">v1.24.0</span>
        </div>
        <div id="rk-zoom">
          <button class="btn" id="rk-zoom-in" data-i18n-attr="title=zoomIn">+</button>
          <button class="btn" id="rk-zoom-out" data-i18n-attr="title=zoomOut">−</button>
          <button class="btn" id="rk-reset" data-i18n-attr="title=recenter">⌂</button>
        </div>
        <div id="rk-float-buttons">
          <button class="rk-fab gold" id="rk-castle-fab" data-i18n-attr="title=enterExitKingdom"><span class="ic">🌐</span></button>
          <button class="rk-fab" id="rk-battles-btn" data-i18n-attr="title=ongoingAttacks"><span class="ic">⚔️</span><span class="rk-badge" id="rk-battles-count" style="display:none"></span></button>
          <button class="rk-fab" id="rk-myattacks-btn" data-i18n-attr="title=myAttacks"><span class="ic">✉️</span><span class="rk-badge" id="rk-myattacks-count" style="display:none"></span></button>
          <button class="rk-fab" id="rk-history-btn" data-i18n-attr="title=battleHistory"><span class="ic">📜</span></button>
          <button class="rk-fab gold" id="rk-trezor-btn" data-i18n-attr="title=treasuryTrezor"><span class="ic">💎</span></button>
          <button class="rk-fab" id="rk-hof-btn" data-i18n-attr="title=hallOfFame"><span class="ic">🏆</span></button>
          <button class="rk-fab" id="rk-build-btn" data-i18n-attr="title=buildTitle"><span class="ic">🏗️</span></button>
          <button class="rk-fab" id="rk-settings-btn" data-i18n-attr="title=config"><span class="ic">⚙️</span></button>
        </div>
        <div id="rk-create-kingdom-fab" data-i18n-attr="title=createKingdom"><span class="ic" data-i18n="createKingdom">Create a New Kingdom</span></div>
        <div id="rk-floating-stats">
          <div class="stat-row"><span class="stat-icon">⚔️</span><span class="stat-val" id="fs-troops">0</span><span class="stat-label" data-i18n="troops">Troops</span></div>
          <div class="stat-row"><span class="stat-icon">🚀</span><span class="stat-val" id="fs-missiles">0</span><span class="stat-label" data-i18n="missiles">Missiles</span></div>
          <div class="stat-row"><span class="stat-icon">🛡️</span><span class="stat-val" id="fs-barriers">0</span><span class="stat-label" data-i18n="barriers">Barriers</span></div>
        </div>
        <div id="rk-battles-panel" class="hidden">
          <div class="ads-head">
            <span class="ads-title">🚨 <span data-i18n="ongoingAttacks">Ataques em Andamento</span></span>
            <span class="ads-alert">ALERT</span>
            <span class="ads-upd">Last updated: <span id="rk-battles-updated"></span></span>
            <button class="ads-close" id="rk-battles-close" data-i18n-attr="title=close">×</button>
          </div>
          <div class="ads-table">
            <div class="ads-row ads-hrow">
              <span data-i18n="battleType">Type</span><span data-i18n="battleStart">Start Time</span><span data-i18n="battleAttacker">Attacker</span><span data-i18n="battleTarget">Target</span><span data-i18n="battleArrival">Arrival Time</span><span data-i18n="battleCountdown">Countdown (D:HH:MM:SS)</span>
            </div>
            <div id="rk-active-battles" class="ads-body"></div>
          </div>
        </div>
        <div id="rk-history-panel" class="hidden">
          <div class="ads-head">
            <span class="ads-title" data-i18n="battleHistory">Kingdom War History</span>
            <input id="rk-history-search" type="text" placeholder="Search kingdoms..." data-i18n-attr="placeholder=searchKingdoms" autocomplete="off" spellcheck="false">
            <button class="ads-close" id="rk-history-close" data-i18n-attr="title=close">×</button>
          </div>
          <div class="ads-table">
            <div class="wh-row wh-hrow">
              <span data-i18n="battleType">Type</span><span data-i18n="historyTime">Time</span><span data-i18n="historyAttacker">Attacker/Sender</span><span data-i18n="historyDefender">Defender/Receiver</span><span data-i18n="historyWinner">Winner</span><span data-i18n="historyDetails">Details</span><span data-i18n="historyActions">Actions</span>
            </div>
            <div id="rk-battle-history" class="wh-body"></div>
          </div>
        </div>
        <div id="rk-hd" class="hidden">
          <div class="hd-box">
            <div class="hd-head"><span class="ads-title" data-i18n="battleDamageReport">Battle Damage Report</span><button class="ads-close" id="rk-hd-close" data-i18n-attr="title=close">×</button></div>
            <div id="rk-hd-body"></div>
          </div>
        </div>
        <div id="rk-myattacks-panel" class="hidden">
          <div class="ads-head">
            <span class="ads-title">✉️ <span data-i18n="myKingdom">Meu Reino</span></span>
            <span class="ads-upd" data-i18n="myAttacks">ataques, claims e cooldowns</span>
            <button class="ads-close" id="rk-myattacks-close" data-i18n-attr="title=close">×</button>
          </div>
          <div class="battle-sec-title" style="margin-top:0;">⏳ <span data-i18n="cooldown">Cooldowns</span></div>
          <div id="rk-my-cooldowns"></div>
          <div class="battle-sec-title">⚡ <span data-i18n="claim">Reivindicações</span></div>
          <div id="rk-my-claims"></div>
          <div class="battle-sec-title">🚀 <span data-i18n="battleAttacker">Ataques saindo</span></div>
          <div id="rk-my-attacks" class="battle-list"></div>
        </div>
        <div id="rk-target" class="hidden">
          <h3 id="rk-target-title">🎯 <span id="rk-target-name" data-i18n="targetTitle">Alvo</span> <span id="rk-target-coords" class="sub"></span><button class="ads-close" id="rk-target-close" data-i18n-attr="title=close">×</button></h3>
          <div id="rk-target-info" class="tk"></div>
          <div class="sep"></div>
          <div id="rk-war">
            <div class="wk"><button class="btn gold" id="rk-war-attack" data-i18n-attr="title=declareWar">⚔️ <span data-i18n="declareWar">Guerra</span></button><span class="eta"></span></div>
            <div class="wk"><button class="btn" id="rk-war-missile" data-i18n-attr="title=launchMissile">🚀 <span data-i18n="launchMissile">Míssil</span></button><span class="eta"></span></div>
            <div class="wk"><button class="btn" id="rk-war-raid" data-i18n-attr="title=raid">🔥 <span data-i18n="raid">Raid</span></button><span class="eta"></span></div>
            <div class="wk"><button class="btn" id="rk-war-fortify" data-i18n-attr="title=fortify">🛡️ <span data-i18n="fortify">Fortificar</span></button><span class="eta"></span></div>
          </div>
          <div id="rk-target-buildings" class="act-row" style="margin-top:8px;">
            <button class="btn" id="rk-target-view-buildings">🏗️ <span data-i18n="build">Ver Edifícios</span></button>
          </div>
        </div>
        <div id="rk-hof-panel" class="hidden" style="position:absolute;top:60px;right:14px;width:520px;max-height:78%;overflow:hidden;background:var(--panel);border:1px solid var(--gold);border-radius:12px;z-index:40;box-shadow:0 12px 40px rgba(0,0,0,.7);display:flex;flex-direction:column;">
          <div class="ads-head" style="flex:none;">
            <span class="ads-title">🏆 <span data-i18n="hallOfFame">Hall da Fama</span></span>
            <span class="ads-upd"><span id="rk-hof-updated"></span></span>
            <button class="ads-close" id="rk-hof-refresh" data-i18n-attr="title=refresh" style="font-size:14px;">↻</button>
            <button class="ads-close" id="rk-hof-close" data-i18n-attr="title=close">×</button>
          </div>
          <div class="hof-tabs" style="display:flex;border-bottom:1px solid var(--line);flex:none;">
            <button class="hof-tab active" data-tab="defenders" data-i18n="hofDefenders">Defenders</button>
            <button class="hof-tab" data-tab="raidloot" data-i18n="hofRaidLoot">Raid Loot</button>
            <button class="hof-tab" data-tab="treasury" data-i18n="hofTreasury">Treasury</button>
          </div>
          <div id="rk-hof-body" style="flex:1;overflow-y:auto;padding:10px 12px;"></div>
        </div>
        <div id="rk-status"></div>
      </div>
        <div id="rk-castle">
        <div id="rk-castle-head">
          <h2 id="rk-castle-name">🏰 <span id="rk-castle-name-txt" data-i18n="myKingdom">Meu Reino</span> <select id="rk-castle-kingdom" data-i18n-attr="title=switchKingdomTitle"><option value="" data-i18n="switchKingdom"></option></select><button class="ads-close" id="rk-castle-close" data-i18n-attr="title=close">×</button></h2>
          <span class="sub" id="rk-castle-coords"></span>
          <div id="rk-castle-top">
            <div class="mkt-bar">
              <div class="mkt-item">
                <span class="mkt-ic">${iconeHtml(1, '⏳')}</span>
                <b class="mkt-v" id="rk-castle-lastclaimed">—</b>
              </div>
              <div class="mkt-item">
                <span class="mkt-ic">${iconeHtml(2, '⚙️')}</span>
                <b class="mkt-v" id="rk-castle-production">—</b>
              </div>
              <div class="mkt-item">
                <span class="mkt-ic">${kgldHtml(18)}</span>
                <b class="mkt-v" id="rk-castle-treasury">0</b>
              </div>
              <div class="mkt-item">
                <span class="mkt-ic">${iconeHtml(4, '💎')}</span>
                <b class="mkt-v" id="rk-castle-trezor">0</b>
              </div>
              <div class="mkt-item">
                <span class="mkt-ic">${iconeHtml(5, '👑')}</span>
                <b class="mkt-v" id="rk-castle-wealth">0</b>
              </div>
              <div class="mkt-item">
                <span class="mkt-ic">${iconeHtml(6, '⚒️')}</span>
                <b class="mkt-v" id="rk-castle-reserves">0</b>
              </div>
              <div class="mkt-item" style="cursor:pointer;" id="rk-castle-prospect-btn" data-i18n-attr="title=prospectTitle">
                <span class="mkt-ic">⛏️</span>
                <span class="mkt-v" data-i18n="prospect">Prospect</span>
              </div>
              <div class="mkt-item" style="cursor:pointer;" id="rk-castle-build-btn" data-i18n-attr="title=buildTitle">
                <span class="mkt-ic" id="rk-build-icon">🏗️</span>
                <span class="mkt-v" data-i18n="build">Build</span>
              </div>
            </div>
          </div>
        </div>
        <div id="rk-iso-scene">
          <div id="rk-iso-ground"></div>
          <div id="rk-iso-buildings"></div>
          <div id="rk-castle-actions2">
            <div class="prod-card" id="prod-defenders">
              <div class="prod-head" id="prod-defenders-head">🛡️ <span data-i18n="productionCardDefenders">Defenders</span></div>
              <div class="prod-cost">${kgldHtml(14)} 300 · <span data-i18n="build">Build</span> 8h</div>
              <div class="prod-val" id="prod-defenders-val">0</div>
              <button class="btn gold" id="prod-defenders-btn" data-i18n="recruit">Recruit</button>
            </div>
            <div class="prod-card" id="prod-missiles">
              <div class="prod-head" id="prod-missiles-head">🚀 <span data-i18n="productionCardMissiles">Missiles</span></div>
              <div class="prod-cost">${kgldHtml(14)} 2500 · <span data-i18n="build">Build</span> 12h</div>
              <div class="prod-val" id="prod-missiles-val">0</div>
              <div class="prod-req" id="prod-missiles-req" data-i18n="requiresMageTower">Requires Mage Tower</div>
              <button class="btn" id="prod-missiles-btn" disabled>—</button>
            </div>
            <div class="prod-card" id="prod-launched">
              <div class="prod-head" id="prod-launched-head">💥 <span data-i18n="productionCardLaunched">Launched</span></div>
              <div class="prod-cost">&nbsp;</div>
              <div class="prod-val" id="prod-launched-val">0</div>
            </div>
            <div class="prod-card" id="prod-barriers">
              <div class="prod-head" id="prod-barriers-head">🛡️ <span data-i18n="productionCardBarriers">Barriers</span></div>
              <div class="prod-cost">${kgldHtml(14)} 2500 · Build 12h</div>
              <div class="prod-val" id="prod-barriers-val">0</div>
              <div class="prod-req" id="prod-barriers-req">Requires Obscura Temple</div>
              <button class="btn" id="prod-barriers-btn" disabled>—</button>
            </div>
          </div>
        </div>
      </div>
      <div id="rk-toast-root"></div>
      <div id="rk-modal-root"></div>
    `;
    document.body.replaceChildren(root);

    // Observa o <html> e remove scripts/estilos do site que aparecerem depois
    let obsTimer = null;
    const obs = new MutationObserver(() => {
      clearTimeout(obsTimer);
      obsTimer = setTimeout(() => {
        document.querySelectorAll("script:not(#rk-rdt-script), link[rel='stylesheet'], style:not(#rk-style), #rk-app, #root, #game, canvas.game-canvas")
          .forEach((n) => { if (n.parentNode) n.remove(); });
        if (!document.body || document.body.children[0] !== root) {
          if (document.body && !document.getElementById("rk-root")) document.body.replaceChildren(root);
        }
      }, 60);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    init();
  }

  // Espera o <body> existir (no document-start) e então monta tudo
  function waitBody() {
    if (document.body) { boot(); return; }
    setTimeout(waitBody, 5);
  }

  /* ================================================================
   * Helpers
   * ================================================================ */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const ICONE_URL = (n) => {
    try {
      const u = rkImgUrls()["icone" + n];
      if (u) return u;
    } catch (e) {}
    return "";
  };
  const iconeHtml = (num, fallback) => {
    const url = ICONE_URL(num);
    return url
      ? `<img src="${url}" style="width:20px;height:20px;object-fit:contain;vertical-align:middle;" onerror="this.outerHTML='<span style=font-size:18px;line-height:1>${fallback}</span>'">`
      : `<span style="font-size:18px;line-height:1">${fallback}</span>`;
  };

  const kgldHtml = (size = 18) => {
    try {
      const url = rkImgUrls()["kgld"];
      if (url) return `<img src="${url}" style="width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;">`;
    } catch (e) {}
    return `<span style="font-size:${size}px;line-height:1">💰</span>`;
  };

  /* ================================================================
   * Imagens dos edifícios (isométricas 2D). As URLs vêm da extensão:
   * content.js define window.__RK_IMG_URLS__ = { grama: chrome-extension://... }.
   * Fallback: se não houver URL, usamos o emoji do edifício.
   * ================================================================ */
  const rkImgCache = {};
  function rkImgUrls() {
    let urls = (window.__RK_IMG_URLS__) || {};
    if (!Object.keys(urls).length) {
      try {
        const raw = (document.documentElement || {}).getAttribute
          ? document.documentElement.getAttribute("data-rk-img-urls")
          : null;
        if (raw) urls = JSON.parse(raw) || {};
      } catch (e) {}
    }
    return urls;
  }
  async function rkImg(key) {
    if (rkImgCache[key] !== undefined) return rkImgCache[key];
    try {
      const url = rkImgUrls()[key];
      if (url && typeof url === "string" && url.length > 10) {
        rkImgCache[key] = url;
        return url;
      }
    } catch (e) {}
    rkImgCache[key] = null;
    return null;
  }

  let gsUrlCache = null;
  function groupSoldierUrl() {
    if (gsUrlCache) return gsUrlCache;
    try {
      const u = rkImgUrls()["groupSoldier"];
      if (u && typeof u === "string" && u.length > 10) gsUrlCache = u;
      return gsUrlCache || null;
    } catch (e) { return null; }
  }

  async function rkScanImages() {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (e) => resolve(e.data.urls || {});
      window.postMessage({ type: "RK_RESCAN_IMAGES" }, "*", [channel.port2]);
      setTimeout(() => resolve({}), 3000);
    });
  }

  function applyTerrain() {
    const t = $("#rk-map-terrain");
    if (!t) return;

    // Se o usuário desativou o mapa de fundo
    if (!showTerrain) {
      t.style.backgroundImage = "";
      t.style.backgroundColor = "#10151b";
      return;
    }
    t.style.backgroundColor = "";

    // LOD system: higher zoom = higher detail
    // mapState.scale: ~0.35 (zoomed out) to ~1.5+ (zoomed in)
    let url;
    const scale = mapState.scale;
    if (scale >= 1.0) {
      url = rkImgUrls()["terrain"]; // Full detail
    } else if (scale >= 0.6) {
      url = rkImgUrls()["terrainLod1"];
    } else if (scale >= 0.4) {
      url = rkImgUrls()["terrainLod2"];
    } else if (scale >= 0.25) {
      url = rkImgUrls()["terrainLod3"];
    } else {
      url = rkImgUrls()["terrainLod4"];
    }

    t.style.backgroundImage = url ? `url("${url}")` : "";
  }

  function toast(msg, isErr) {
    const el = document.createElement("div");
    el.className = "toast" + (isErr ? " err" : "");
    el.textContent = msg;
    $("#rk-toast-root").appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }
  function setStatus(msg) {
    const b = $("#rk-status");
    if (!msg) { b.classList.remove("show"); return; }
    b.textContent = msg;
    b.classList.add("show");
  }
  const field = (fields, name) => {
    if (!fields) return undefined;
    const f = fields.find((x) => x.field_name === name);
    return f ? f.value : undefined;
  };
  const structFields = (fields, name) => {
    if (!fields) return [];
    const f = fields.find((x) => x.field_name === name);
    return f && f.fields ? f.fields : [];
  };
  const intVal = (fields, name) => parseInt(field(fields, name) || 0, 10);
  const fmtAmount = (v) => (v === undefined || v === null) ? "0" : String(Math.floor(Number(v)));
  function fmtCountdown(rem) {
    rem = Math.max(0, Math.floor(rem));
    const d = Math.floor(rem / 86400);
    const h = Math.floor((rem % 86400) / 3600);
    const m = Math.floor((rem % 3600) / 60);
    const s = Math.floor(rem % 60);
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  /* ================================================================
   * Gateway API (direto, sem proxy — o site tem CORS liberado)
   * ================================================================ */
  async function gateway(path, body) {
    // Try site API first (same origin, CORS ok)
    try {
      const res = await fetch(SITE_API + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || {}),
      });
      if (res.ok) return res.json();
    } catch (e) {}
    // Fallback to mainnet
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(GATEWAY + path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "RDX-Client-Name": "radix-kingdoms-site",
            "RDX-Client-Version": "2.2.1",
          },
          body: JSON.stringify(body || {}),
        });
        if (!res.ok) throw new Error("Gateway HTTP " + res.status + " em " + path);
        return res.json();
      } catch (e) {
        lastError = e;
        if (attempt === 0) await new Promise(r => setTimeout(r, 500));
      }
    }
    throw lastError;
  }

  async function entityDetails(addresses, optIns) {
    const res = await gateway("/state/entity/details", {
      addresses,
      aggregation_level: "Vault",
      opt_ins: optIns || { non_fungible_include_nfids: true },
    });
    return res.items || [];
  }

  async function nonFungibleData(resource, ids) {
    const res = await gateway("/state/non-fungible/data", {
      resource_address: resource,
      non_fungible_ids: ids,
    });
    return (res.non_fungible_ids || []).map((n) => {
      const f = n.data && n.data.programmatic_json ? n.data.programmatic_json.fields : [];
      return { id: n.non_fungible_id, fields: f };
    });
  }

  async function fetchAllKvsKeys(kvsAddr) {
    let keys = [];
    let cursor = null;
    let stateVersion = null;
    do {
      const body = { key_value_store_address: kvsAddr, limit: 100 };
      if (cursor) {
        body.cursor = cursor;
        if (stateVersion) body.at_ledger_state = { state_version: stateVersion };
      }
      const res = await gateway("/state/key-value-store/keys", body);
      const items = res.items || [];
      keys = keys.concat(items.map((k) => k.key.raw_hex));
      cursor = res.next_cursor || null;
      stateVersion = res.ledger_state ? res.ledger_state.state_version : stateVersion;
    } while (cursor);
    return keys;
  }

  async function fetchKvsData(kvsAddr, keys) {
    const out = [];
    for (let i = 0; i < keys.length; i += 50) {
      const chunk = keys.slice(i, i + 50).map((key_hex) => ({ key_hex }));
      const res = await gateway("/state/key-value-store/data", {
        key_value_store_address: kvsAddr,
        keys: chunk,
      });
      (res.entries || []).forEach((it) => out.push(it));
    }
    return out;
  }

  async function vaultBalance(vaultAddr) {
    const items = await entityDetails([vaultAddr]);
    const d = items[0];
    if (!d) return 0;
    if (d.details && d.details.balance) return parseFloat(d.details.balance.amount || 0);
    return 0;
  }

  /* ================================================================
   * Manifests de transação (replicam o site original)
   * ================================================================ */
  const proofOfNft = (account, nftId) =>
    `CALL_METHOD\nAddress("${account}")\n"create_proof_of_non_fungibles"\nAddress("${KINGDOM_NFT}")\nArray<NonFungibleLocalId>(\nNonFungibleLocalId("${nftId}")\n)\n;\n`;

  const M = {
    create_building: (acct, k, type, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${k}")\n"create_building"\n"${type}"\n;\n`,

    claim_building: (acct, k, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"claim_building"\n;\n`,

    create_army_unit: (acct, k, n, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"create_army_unit"\n${n}i32;\n`,

    claim_army: (acct, k, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"claim_army_units"\n;\n`,

    create_missiles: (acct, k, n, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"create_missile"\n${n}i32;\n`,

    claim_missiles: (acct, k, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"claim_missiles"\n;\n`,

    create_barriers: (acct, k, n, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"create_anti_missile_barrier"\n${n}i32;\n`,

    claim_barriers: (acct, k, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"claim_create_anti_missile_barriers"\n;\n`,

    deposit_gold: (acct, k, amount, nftId) =>
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${KGLD}")\nDecimal("${amount}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${KGLD}")\nBucket("kgld")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"deposit_kgld"\nBucket("kgld")\n;\n`,

    withdraw_gold: (acct, k, maxFee, amount, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${maxFee}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("xrd")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"withdraw_kgld"\nBucket("xrd")\nDecimal("${amount}")\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    deposit_to_trezor: (acct, k, amount, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${k}")\n"put_kgld_to_trezor"\nDecimal("${amount}")\n;\n`,

    claim_mining_rewards: (acct, k, nftId) =>
      proofOfNft(acct, nftId) + `CALL_METHOD\nAddress("${k}")\n"claim_mining_rewards"\n;\n`,

    buy_a_new_kingdom: (acct, cost, x, y, name) =>
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${cost}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${KINGDOM_MANAGER}")\n"instantiate_new_kingdom"\nBucket("bucket1")\n${x}i32\n${y}i32\n"${name}"\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    buy_kgld: (acct, xrdAmount) =>
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${xrdAmount}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${COIN_DISPENSER}")\n"redeem_coin"\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    attack_another_kingdom: (acct, k, targetNft, n, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${WAR_XRD_COST}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"attack_initiate"\nBucket("bucket1")\nNonFungibleLocalId("${targetNft}")\n${n}i32\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    raid_another_kingdom: (acct, k, targetNft, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${WAR_XRD_COST}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"raid_initiate"\nBucket("bucket1")\nNonFungibleLocalId("${targetNft}")\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    fortify_another_kingdom: (acct, k, targetNft, n, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${WAR_XRD_COST}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"fortify_initiate"\nBucket("bucket1")\nNonFungibleLocalId("${targetNft}")\n${n}i32\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    fire_missiles_at_kingdom: (acct, k, targetNft, n, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${WAR_XRD_COST}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"missile_initiate"\nBucket("bucket1")\nNonFungibleLocalId("${targetNft}")\n${n}i32\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,

    prospect_resources: (acct, k, nftId) =>
      proofOfNft(acct, nftId) +
      `CALL_METHOD\nAddress("${acct}")\n"withdraw"\nAddress("${XRD}")\nDecimal("${WAR_XRD_COST}")\n;\n` +
      `TAKE_ALL_FROM_WORKTOP\nAddress("${XRD}")\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${k}")\n"prospect_initiate"\nBucket("bucket1")\n;\n` +
      `CALL_METHOD\nAddress("${acct}")\n"deposit_batch"\nExpression("ENTIRE_WORKTOP")\n;\n`,
  };

  /* ================================================================
   * Wallet (RDT direto na origem do site — sem ponte)
   * ================================================================ */
  let rdt = null;
  let account = null;
  let walletConnected = false;

  function unwrapResult(res) {
    if (!res) return res;
    console.debug("unwrapResult input:", res);
    // Formato real do RDT (igual ao usado pelo site): Result expõe { value, error }
    if (res.error !== undefined && res.error !== null) {
      const err = res.error;
      throw new Error((err && (err.message || err.error)) || JSON.stringify(err));
    }
    if (res.value !== undefined) return res.value;
    // RDT 2.x: Result.match(okFn, errFn) — dois callbacks posicionais.
    // (v1.x usava um objeto {ok, err}; tratamos os dois para compatibilidade)
    if (typeof res.match === "function") {
      let ok = null, err = null;
      try {
        res.match((v) => { ok = v; }, (e) => { err = e; });
      } catch (e) {
        try {
          res.match({ ok: (v) => { ok = v; }, err: (e2) => { err = e2; } });
        } catch (e3) {
          console.error("res.match falhou nas duas formas:", e3, res);
        }
      }
      if (err) throw new Error((err && (err.message || err.error)) || JSON.stringify(err));
      return ok;
    }
    if (typeof res.isOk === "function") {
      if (res.isOk()) return res.value;
      const err = res.error;
      throw new Error((err && (err.message || err.error)) || JSON.stringify(err));
    }
    if (res.isOk === true) return res.value;
    if (res.isErr === true) throw new Error((res.error && (res.error.message || res.error.error)) || JSON.stringify(res.error));
    if (res.error) throw new Error((res.error && (res.error.message || res.error.error)) || JSON.stringify(res.error));
    if (res.status === "CommittedSuccess" || res.status === "committed_success") return res;
    if (res.status && res.status !== "CommittedSuccess" && res.status !== "committed_success") {
      throw new Error("Transaction failed: " + res.status);
    }
    return res.value !== undefined ? res.value : res;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.id = "rk-rdt-script";
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Não foi possível carregar o SDK da Radix (RDT)."));
      document.head.appendChild(s);
    });
  }

  function readStoredSession() {
    try {
      const raw = localStorage.getItem("rdt:" + DAPP_DEF + ":" + NETWORK_ID + ":state");
      if (!raw) return null;
      const st = JSON.parse(raw);
      const wd = st && st.walletData;
      const acc = wd && wd.accounts && wd.accounts[0];
      return (acc && acc.address) ? acc : null;
    } catch (e) { return null; }
  }

  function initWallet() {
    loadScript("https://cdn.jsdelivr.net/npm/@radixdlt/radix-dapp-toolkit@2.2.1/dist/radix-dapp-toolkit.bundle.umd.js")
      .then(() => {
        const RDTlib = (globalThis.RDT && globalThis.RDT.default) || globalThis.RDT;
        if (!RDTlib || !RDTlib.RadixDappToolkit) throw new Error("RDT indisponível");
        rdt = RDTlib.RadixDappToolkit({
          dAppDefinitionAddress: DAPP_DEF,
          networkId: RDTlib.RadixNetwork ? RDTlib.RadixNetwork.Mainnet : NETWORK_ID,
          applicationName: "Kingdoms of Radix",
          applicationVersion: "1.0.0",
        });
        rdt.walletApi.setRequestData({ accounts: { quantifier: "atLeast", quantity: 1 } });
        // Tenta restaurar sessão DIRETO do localStorage (não depende do
        // RDT emitir walletData$ — garante "já conectado" mesmo se o RDT
        // falhar em restaurar por causa de conflito com o RDT do site).
        const storedAcc = readStoredSession();
        if (storedAcc) {
          account = storedAcc;
          walletConnected = true;
          onWalletChanged();
        }
        // Restaura a sessão existente (você já está conectado no site) e reage
        // a mudanças da wallet. Emite sozinho se já houver sessão salva.
        rdt.walletApi.walletData$.subscribe((w) => {
          const allAcc = (w && w.accounts) ? w.accounts.map(a => a.address) : [];
          console.log("[rk-layout] walletData$ emit - contas:", allAcc, "persona:", w?.persona?.label);
          const acc = allAcc[0] || null;
          if (acc !== account) {
            console.log("[rk-layout] trocando account:", account, "->", acc);
            account = acc;
            walletConnected = !!acc;
            onWalletChanged();
          }
        });
        // Se ainda não emitiu sessão após alguns segundos, mostra dica de conectar
        setTimeout(() => {
          if (!account) toast(t("connectWallet"), false);
        }, 6000);
      })
      .catch((e) => toast(e.message, true));
  }

  async function connectWallet() {
    if (!rdt) { toast(t("sdkLoading"), true); return; }
    setStatus("Aguardando aprovação na sua wallet...");
    try {
      const res = await rdt.walletApi.sendRequest();
      const val = unwrapResult(res);
      if (val && val.accounts && val.accounts.length) {
        account = val.accounts[0].address;
        walletConnected = true;
        onWalletChanged();
      } else {
        toast(t("noWalletAccount"), true);
      }
    } catch (e) {
      const msg = (e && e.message) || String(e);
      console.error("[rk-layout] connectWallet error:", e);
      // Erro "e is not a function" geralmente indica conflito entre os dois
      // RDTs (site + CDN) no fluxo de conexão. Tenta reconectar limpo.
      if (msg.includes("is not a function")) {
        toast(t("walletConflict"), true);
      } else {
        toast(t("walletFailed") + msg, true);
      }
    } finally {
      setStatus(null);
    }
  }

  /* ================================================================
   * Estado da aplicação
   * ================================================================ */
  let kingdoms = [];
  let ownKingdoms = [];
  let selectedOwn = null;
  let target = null;
  let ownStates = {};
  let lastTargetState = null;
  let activeAttacks = [];
  let battleHistory = [];
  let battleTimer = null;

/* ================================================================
 * Carregamento de dados
 * ================================================================ */
  async function fetchAllKingdoms() {
    // Try site API first for all kingdoms
    try {
      const res = await fetch(`${SITE_API}/kingdoms`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          console.log("[rk-layout] Got all kingdoms from site API:", data.length);
          return data.map((k) => ({
            name: k.name || k.kingdom_name,
            x: parseInt(k.x || k.kingdom_x_coord || 0, 10),
            y: parseInt(k.y || k.kingdom_y_coord || 0, 10),
            component: k.component || k.kingdom_component,
            created: parseInt(k.created || k.creation_time || 0, 10),
            nftId: k.nftId || k.kingdom_owner_nft_id,
          })).filter((k) => k.component);
        }
      }
    } catch (e) {
      console.debug("[rk-layout] Site API kingdoms failed:", e.message);
    }
    
    // Fallback to gateway
    const mgr = await entityDetails([KINGDOM_MANAGER]);
    const kvsAddr = mgr[0] ? field(mgr[0].details.state.fields, "kingdom_info") : null;
    if (!kvsAddr) return [];
    const keys = await fetchAllKvsKeys(kvsAddr);
    const entries = await fetchKvsData(kvsAddr, keys);
    return entries.map((e) => {
      const f = e.value && e.value.programmatic_json ? e.value.programmatic_json.fields : [];
      const nftId = e.key && e.key.programmatic_json ? e.key.programmatic_json.value : null;
      return {
        name: field(f, "kingdom_name") || "???",
        x: parseInt(field(f, "kingdom_x_coord") || 0, 10),
        y: parseInt(field(f, "kingdom_y_coord") || 0, 10),
        component: field(f, "kingdom_component") || null,
        created: parseInt(field(f, "creation_time") || 0, 10),
        nftId,
      };
    }).filter((k) => k.component);
  }

  async function fetchOwnKingdoms() {
    let accAddr = account;
    if (!accAddr) return [];
    
    // Try site API first for user's kingdoms
    try {
      const res = await fetch(`${SITE_API}/user/kingdoms`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          return data.map((k) => ({
            nftId: k.nftId || k.kingdom_owner_nft_id,
            name: k.name || k.kingdom_name,
            component: k.component || k.kingdom_component,
            imageUrl: k.imageUrl || k.key_image_url,
            kingdomType: k.kingdomType || k.kingdom_type || "Common",
          }));
        }
      }
    } catch (e) {
      console.debug("[rk-layout] Site API user/kingdoms failed:", e.message);
    }
    
    // Fallback to gateway
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const items = await entityDetails([accAddr]);
        const acc = items[0];
        if (!acc) { await sleep(1000); continue; }
        const nf = (acc.non_fungible_resources?.items || []).find((i) => i.resource_address === KINGDOM_NFT);
        const nfids = (nf && nf.vaults && nf.vaults.items) ? nf.vaults.items.flatMap((v) => v.items || []) : [];
        if (!nfids.length) { await sleep(1000); continue; }
        const data = await nonFungibleData(KINGDOM_NFT, nfids);
        if (data.length) return data.map((n) => ({
          nftId: n.id,
          name: field(n.fields, "kingdom_name") || n.id,
          component: field(n.fields, "kingdom_component") || "",
          imageUrl: field(n.fields, "key_image_url") || null,
          kingdomType: field(n.fields, "kingdom_type") || "Common",
        }));
      } catch (e) {
        console.error("[rk-layout] fetchOwnKingdoms erro:", e);
      }
      await sleep(1000);
    }
    return [];
  }

  async function fetchKingdomStateFromSiteApi(component) {
    try {
      const res = await fetch(`${SITE_API}/kingdom/${component}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        return normalizeSiteKingdomData({ ...data, component });
      }
    } catch (e) {
      console.debug("[rk-layout] Site API fetch failed for", component, e.message);
    }
    return null;
  }

  async function fetchKingdomState(component) {
    // Try site API first (has correct formatted data)
    let state = await fetchKingdomStateFromSiteApi(component);
    if (state) return state;
    
    // Fallback to gateway
    const items = await entityDetails([component]);
    const d = items[0];
    if (!d || !d.details || !d.details.state) return null;
    const f = d.details.state.fields || [];
    const kd = structFields(f, "kingdom_data");
    const kb = structFields(kd, "kingdom_buildings");
    const ka = structFields(kd, "kingdom_army");
    const krs = structFields(f, "kingdom_random_state");
    const kgldVault = field(f, "kgld_vault");
    const trezorVault = field(f, "trezor_vault");
    const [kgld, trezor] = await Promise.all([
      kgldVault ? vaultBalance(kgldVault) : 0,
      trezorVault ? vaultBalance(trezorVault) : 0,
    ]);
    const _ratio = parseFloat(field(kd, "minting_ratio") || 0);
    const _mines = intVal(kb, "mine") || intVal(kd, "mine") || intVal(kd, "mine_count") || 0;
    const _lastClaim = Math.max(intVal(kd, "last_time_claimed"), intVal(kd, "mining_start"));
    const _isMining = field(kd, "is_mining") === true || field(kd, "is_mining") === "true";

    // Fórmula EXATA do site (encontrada no JS minificado):
    // unclaimedResources = min((now - mining_start) * mines * ratio, mineable_resources)
    // com cap de 28 dias no (now - mining_start)
    // Se mining_start = 0, o site usa now (diff = 0, result = 0)
    const _totalMineable = parseFloat(field(kd, "mineable_resources") || 0);
    const _miningStart = parseInt(field(kd, "mining_start") || "0", 10);
    let unclaimedGold = 0;
    if (_ratio > 0 && _mines > 0 && _miningStart > 0) {
      const nowSec = Math.floor(Date.now() / 1000);
      const miningStartSec = _miningStart > 1e12 ? Math.floor(_miningStart / 1000) : _miningStart;
      const diff = nowSec - miningStartSec;
      const cappedDiff = diff < 2419200 ? diff : 2419200;
      if (cappedDiff > 0) {
        const calc = Math.floor(cappedDiff * _mines * _ratio);
        unclaimedGold = calc < _totalMineable ? calc : _totalMineable;
        if (unclaimedGold < 0) unclaimedGold = 0;
      }
    }
    // Se mining_start = 0 OU cálculo inválido: unclaimed = 0 (NÃO usar mineable como fallback,
    // pois para reinos com mineração parada o site mostra 0)

    // Raid Loot para inimigos: (mineable_resources - kgld_in_treasury) * 0.15
    const _raidLoot = Math.max(0, (_totalMineable - (kgld || 0)) * 0.15);


    return {
      component,
      nftId: field(f, "kingdom_owner_nft_id") || null,
      name: field(kd, "kingdom_name") || null,
      kgld,
      trezor,
      mine: _mines,
      barracks: intVal(kb, "barracks") || intVal(kd, "barracks") || 0,
      trezorCount: intVal(kb, "trezor") || intVal(kb, "trezor_count") || intVal(kd, "trezor") || intVal(kd, "trezor_count") || 0,
      stronghold: intVal(kb, "stronghold") || intVal(kd, "stronghold") || 0,
      mageTower: intVal(kb, "mage_tower") || intVal(kd, "mage_tower") || 0,
      researchAcademy: intVal(kb, "research_academy") || intVal(kd, "research_academy") || 0,
      obscuraTemple: intVal(kb, "obscura_temple") || intVal(kd, "obscura_temple") || 0,
      maxBuildings: intVal(kb, "max_buildings") || intVal(kd, "max_buildings") || 0,
      defendingUnits: intVal(ka, "defending_units") || intVal(kd, "defending_units") || 0,
      kingdomMissiles: intVal(ka, "kingdom_missiles") || intVal(kd, "kingdom_missiles") || 0,
      launchedMissiles: intVal(ka, "launched_missiles") || intVal(kd, "launched_missiles") || 0,
      antiMissileBarriers: intVal(ka, "anti_missile_barriers") || intVal(kd, "anti_missile_barriers") || 0,
      lockedAttacking: intVal(ka, "locked_attacking_units") || intVal(kd, "locked_attacking_units") || 0,
      lockedRaiding: intVal(ka, "locked_raiding_units") || intVal(kd, "locked_raiding_units") || 0,
      lockedFortifying: intVal(ka, "locked_fortifying_units") || intVal(kd, "locked_fortifying_units") || 0,
      lockedTraveling: intVal(ka, "locked_traveling_units") || intVal(kd, "locked_traveling_units") || 0,
      defenseStrenght: parseFloat(field(kd, "defense_strenght") || 0),
      attackStrenght: parseFloat(field(kd, "attack_strenght") || 0),
      mintingRatio: _ratio,
      mineableResources: parseFloat(field(kd, "mineable_resources") || 0),
      miningStart: intVal(kd, "mining_start"),
      lastTimeClaimed: intVal(kd, "last_time_claimed"),
      lastTimeWithdrawn: intVal(kd, "last_time_withdrawn"),
      armyUnitsCompleted: intVal(kd, "army_units_completed"),
      missilesCompleted: intVal(kd, "missiles_completed"),
      amBarrierCompleted: intVal(kd, "am_barrier_completed"),
      lastAttack: intVal(krs, "last_attack"),
      lastRaid: intVal(krs, "last_raid"),
      lastFortify: intVal(krs, "last_fortify"),
      lastMissile: intVal(krs, "last_missile"),
      lastProspect: intVal(krs, "last_prospect"),
      armyToBeClaimed: intVal(kd, "army_to_be_claimed"),
      missilesToBeClaimed: intVal(kd, "missiles_to_be_claimed"),
      amBarriersToBeClaimed: intVal(kd, "am_barriers_to_be_claimed"),
      underConstruction: field(kd, "under_construction") || "none",
      buildingConstructionStart: intVal(kd, "building_construction_start"),
      buildingConstructionDuration: intVal(kd, "building_construction_duration"),
      isBuilding: field(kd, "is_building") === true || field(kd, "is_building") === "true",
      isMining: _isMining,
      isAttacking: field(kd, "is_attacking") === true || field(kd, "is_attacking") === "true",
      isRaiding: field(kd, "is_raiding") === true || field(kd, "is_raiding") === "true",
      isFortifying: field(kd, "is_fortifing") === true || field(kd, "is_fortifing") === "true",
      unclaimedGold,
    };
  }

  async function fetchWalletKgld() {
    if (!account) return 0;
    try {
      const items = await entityDetails([account]);
      const acc = items[0];
      const fr = (acc.fungible_resources.items || []).find((i) => i.resource_address === KGLD);
      return fr ? parseFloat(fr.amount || 0) : 0;
    } catch (e) { return 0; }
  }

  /* ================================================================
   * Map rendering (pan / zoom)
   * ================================================================ */
  const mapState = { x: 0, y: 0, scale: 0.35 };
  let lastCastleScale = 0;

  function castleSize() {
    return Math.round(Math.min(64, Math.max(30, 40 / mapState.scale)));
  }

  function castleLodUrl() {
    const scale = mapState.scale;
    if (scale >= 1.0) return rkImgUrls()["castle"];
    if (scale >= 0.6) return rkImgUrls()["castleLod1"];
    if (scale >= 0.4) return rkImgUrls()["castleLod2"];
    if (scale >= 0.25) return rkImgUrls()["castleLod3"];
    return rkImgUrls()["castleLod4"];
  }
  function soldierSize() {
    return Math.round(Math.min(64, Math.max(32, 40 / mapState.scale)));
  }

  function clampMap() {
    const vp = $("#rk-map-viewport");
    if (!vp) return;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const mapW = 8100 * mapState.scale;
    const mapH = 3600 * mapState.scale;
    // Permite sair até 50% do viewport para cada lado
    const overflowX = vw * 0.5;
    const overflowY = vh * 0.5;
    // Limite mínimo: mapState.x + mapW >= vw - overflowX (mostra pelo menos 50% do mapa)
    // Limite máximo: mapState.x <= overflowX (não passa de 50% de fundo vazio)
    const minX = -mapW + vw - overflowX;
    const maxX = overflowX;
    const minY = -mapH + vh - overflowY;
    const maxY = overflowY;
    if (mapState.x < minX) mapState.x = minX;
    if (mapState.x > maxX) mapState.x = maxX;
    if (mapState.y < minY) mapState.y = minY;
    if (mapState.y > maxY) mapState.y = maxY;
  }

  function applyTransform() {
    clampMap();
    const c = $("#rk-map-content");
    c.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;
    if (lastCastleScale !== mapState.scale) {
      lastCastleScale = mapState.scale;
      const size = castleSize();
      const castleUrl = castleLodUrl();
      c.querySelectorAll(".kingdom-marker .castle").forEach((el) => {
        if (el.tagName === "IMG") {
          el.style.width = size + "px";
          el.style.height = size + "px";
          if (castleUrl) el.src = castleUrl;
        } else el.style.fontSize = size + "px";
      });
      applyTerrain();
    }
    positionTargetPanel();
  }

  function recenter() {
    const vp = $("#rk-map-viewport");
    const w = vp.clientWidth, h = vp.clientHeight;
    mapState.scale = 0.35;
    mapState.x = (w - 8100 * mapState.scale) / 2;
    mapState.y = (h - 3600 * mapState.scale) / 2;
    applyTransform();
  }

  function zoomAt(cx, cy, factor) {
    const old = mapState.scale;
    const ns = Math.min(3, Math.max(0.15, old * factor));
    const k = ns / old;
    mapState.x = cx - (cx - mapState.x) * k;
    mapState.y = cy - (cy - mapState.y) * k;
    mapState.scale = ns;
    applyTransform();
  }

  function setupMap() {
    const vp = $("#rk-map-viewport");
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0, moved = 0;

    vp.addEventListener("pointerdown", (e) => {
      if (e.target && e.target.closest && e.target.closest(".kingdom-marker")) return;
      e.preventDefault();
      dragging = true;
      moved = 0;
      sx = e.clientX; sy = e.clientY;
      ox = mapState.x; oy = mapState.y;
      vp.classList.add("dragging");
      vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      moved = Math.max(moved, Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy));
      mapState.x = ox + (e.clientX - sx);
      mapState.y = oy + (e.clientY - sy);
      clampMap();
      applyTransform();
    });
    vp.addEventListener("pointerup", () => { dragging = false; vp.classList.remove("dragging"); });
    vp.addEventListener("pointercancel", () => { dragging = false; vp.classList.remove("dragging"); });

    vp.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.1 : 0.9);
    }, { passive: false });

    vp.addEventListener("click", (e) => {
      if (moved > 6) return;
      const isBg = e.target === vp
        || e.target.id === "rk-map-grid"
        || e.target.id === "rk-map-content"
        || e.target.id === "rk-markers";
      const isCreateMarker = e.target.closest && e.target.closest(".create-marker");
      if (isBg || isCreateMarker) {
        const cell = cellFromPoint(e);
        if (cell) handleMapCellClick(cell.x, cell.y);
      }
    });

    $("#rk-zoom-in").addEventListener("click", () => {
      const r = vp.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, 1.25);
    });
    $("#rk-zoom-out").addEventListener("click", () => {
      const r = vp.getBoundingClientRect();
      zoomAt(r.width / 2, r.height / 2, 0.8);
    });
    $("#rk-reset").addEventListener("click", () => {
      recenter();
      if (selectedOwn) {
        const k = kingdoms.find((x) => x.component === selectedOwn.component);
        if (k) focusOn(k);
      }
    });

    // recenter só quando o viewport tiver tamanho (no document-start ainda não tem layout)
    (function deferRecenter() {
      const w = vp.clientWidth;
      if (w > 0) { recenter(); return; }
      setTimeout(deferRecenter, 50);
    })();
  }

  function cellFromPoint(e) {
    const rect = $("#rk-map-viewport").getBoundingClientRect();
    const mx = (e.clientX - rect.left - mapState.x) / mapState.scale;
    const my = (e.clientY - rect.top - mapState.y) / mapState.scale;
    const x = Math.floor(mx / CELL_W);
    const y = Math.floor(my / CELL_H);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return null;
    return { x, y };
  }

  function handleMapCellClick(x, y) {
    const chip = $("#rk-cursor");
    chip.textContent = `x: ${x}, y: ${y}`;
    chip.classList.remove("hidden");
    const here = kingdoms.find((k) => k.x === x && k.y === y);
    if (here) { onKingdomClick(here); return; }
    
    // Handle position selection for creating kingdom
    if (pickCreateMode) {
      pendingCreate = { x, y };
      pickCreateMode = false;
      renderCreateMarker();
      toast(`Posição selecionada: (${x}, ${y})`);
      openCreateKingdomModal();
    }
  }

  function focusOn(k) {
    const vp = $("#rk-map-viewport");
    mapState.scale = 0.8;
    mapState.x = vp.clientWidth / 2 - (k.x * CELL_W + CELL_W / 2) * mapState.scale;
    mapState.y = vp.clientHeight / 2 - (k.y * CELL_H + CELL_H / 2) * mapState.scale;
    applyTransform();
  }

  function battleTypeLabel(n) {
    const t = typeof n === "string" ? parseInt(n, 10) : n;
    switch (t) { case 4: return "War"; case 2: return "Raid"; case 32: return "Fortify"; case 16: return "Prospect"; case 8: return "Missile"; default: return "War"; }
  }
  function battleIcon(type) {
    switch (type) { case "Raid": return "🏹"; case "Missile": return "🚀"; case "Fortify": return "🛡️"; case "Prospect": return "⛏️"; default: return "⚔️"; }
  }
  function parseEventFields(ev) {
    const out = {};
    if (ev && ev.payload && ev.payload.programmatic_json && ev.payload.programmatic_json.fields) {
      ev.payload.programmatic_json.fields.forEach((f) => {
        const n = Number(f.value);
        if (Number.isFinite(n)) {
          out[f.field_name] = f.field_name === "damage_per_missile" ? Math.floor(n) : Math.round(n);
        } else {
          out[f.field_name] = f.value;
        }
      });
    }
    // Mesma lógica do site: para Fortify usa sender/receiver diferentes
    if (ev && ev.identifier && ev.identifier.event === "Fortify") {
      out.sender = out.proof_id;
      out.receiver = out.target_nft_id;
      out.amount = out.army_units_transfered;
    }
    return out;
  }
  let battleNftMap = {};
  function kingdomByNft(nftId) {
    if (!nftId) return null;
    const s = String(nftId);
    let k = kingdoms.find((kk) => String(kk.nftId) === s);
    if (!k) k = battleNftMap[s] || null;
    return k;
  }
  async function ensureBattleNftMap() {
    const ids = new Set();
    activeAttacks.forEach((a) => { if (a.attacker) ids.add(String(a.attacker)); if (a.defender) ids.add(String(a.defender)); });
    battleHistory.forEach((b) => { if (b.attacker) ids.add(String(b.attacker)); if (b.defender) ids.add(String(b.defender)); });
    const missing = Array.from(ids).filter((id) => !kingdomByNft(id) && !(battleNftMap[id] !== undefined));
    for (let i = 0; i < missing.length; i += 29) {
      const chunk = missing.slice(i, i + 29);
      try {
        const data = await nonFungibleData(KINGDOM_NFT, chunk);
        data.forEach((n) => {
          const comp = field(n.fields, "kingdom_component");
          const k = comp ? kingdoms.find((kk) => kk.component === comp) : null;
          battleNftMap[String(n.id)] = k || null;
        });
      } catch (e) { console.error("Erro ao resolver NFT de batalha:", e); }
    }
  }
  function kingName(nftId) {
    const k = kingdomByNft(nftId);
    return k ? k.name : (nftId || "?").toString().slice(0, 8);
  }

  async function fetchActiveBattles() {
    try {
      const seen = new Set();
      const attacks = [];
      let cursor = null;
      for (let page = 0; page < 10; page++) {
        const body = {
          limit_per_page: 20,
          affected_global_entities_filter: [ATTACK_ACCOUNT],
          events_filter: [{ event: "Deposit", resource_address: ATTACK_RESOURCE }],
          opt_ins: { detailed_events: true },
        };
        if (cursor) body.cursor = cursor;
        const res = await gateway("/stream/transactions", body);
        const items = res.items || [];
        for (const it of items) {
          if (!it.receipt || !it.receipt.detailed_events) continue;
          for (const ev of it.receipt.detailed_events) {
            if (ev.identifier && ev.identifier.event === "RandomInitiated") {
              const f = parseEventFields(ev);
              const key = `${it.transaction_hash}-${f.activation_time}`;
              if (seen.has(key)) continue;
              seen.add(key);
              const at = typeof f.activation_time === "string" ? parseInt(f.activation_time, 10) : f.activation_time;
              if (!at) continue;
              attacks.push({
                id: key,
                type: battleTypeLabel(f.random_type),
                random_type: f.random_type,
                timestamp: it.confirmed_at,
                activation_time: at,
                attacker: f.attacker,
                defender: f.defender,
              });
            }
          }
        }
        cursor = res.next_cursor || null;
        if (!cursor) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      activeAttacks = attacks.sort((a, b) => (a.activation_time || 0) - (b.activation_time || 0));
    } catch (e) {
      console.error("Erro ao buscar batalhas ativas:", e);
    }
  }

  async function fetchBattleHistory() {
    // Try to fetch from radixkingdoms.com API first
    try {
      const res = await fetch("https://radixkingdoms.com/api/battle-history", {
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          battleHistory = data.map((b) => ({
            type: b.type || b.eventType,
            timestamp: b.timestamp || b.time || b.createdAt,
            attacker: b.attacker || b.attackerName,
            defender: b.defender || b.defenderName,
            winner: b.winner || b.winnerName,
            war_spoils: b.warSpoils || b.spoils || 0,
            missiles_fired: b.missilesFired || 0,
            damage_per_missile: b.damagePerMissile || 0,
            army_units_transfered: b.armyUnitsTransferred || 0,
            transactionHash: b.txHash || b.transactionHash
          })).slice(0, 60);
          return;
        }
      }
    } catch (e) {
      console.log("Site API unavailable, falling back to gateway:", e);
    }

    // Fallback: fetch do gateway - Igual ao site, busca DEPOSIT E WITHDRAWAL
    try {
      const seen = new Set();
      const history = [];

      const processItems = (items, label) => {
        let battleFound = 0;
        for (const it of items) {
          if (!it.receipt || !it.receipt.detailed_events) continue;
          for (const ev of it.receipt.detailed_events) {
            const idn = ev.identifier || {};
            const evName = idn.event || "";
            // SÓ eventos finalizados: Kingdom*Completed OU Fortify
            const isCompleted = /^Kingdom.*Completed$/.test(evName) || evName === "Fortify";
            if (!isCompleted) continue;
            const isBattleEvent = idn.blueprint === "KingdomManagerComponent" || evName === "Fortify";
            if (!isBattleEvent) continue;
            battleFound++;
            const f = parseEventFields(ev);
            const type = evName.replace("Kingdom", "").replace("Completed", "");
            if (!type) continue;
            // Chave única: tx_hash + event + emitter_entity (se vazio, usa campo extra)
            const emitter = ev.emitter_entity || `${f.attacker || f.sender || ""}-${f.defender || f.receiver || ""}`;
            const key = `${it.transaction_hash}-${evName}-${emitter}`;
            if (seen.has(key)) continue;
            seen.add(key);
            history.push({
              type,
              timestamp: it.confirmed_at,
              attacker: f.attacker || f.sender,
              defender: f.defender || f.receiver,
              winner: f.winner,
              war_spoils: f.war_spoils,
              missiles_fired: f.missiles_fired,
              damage_per_missile: f.damage_per_missile,
              army_units_transfered: f.army_units_transfered,
              transactionHash: it.transaction_hash,
            });
          }
        }
        if (label && window.console) console.log(`[BattleHistory ${label}] processed ${items.length} txs, ${battleFound} completed events, total history=${history.length}`);
      };

      // Sempre log do total final
      if (window.console) console.log(`[BattleHistory] START - ATTACK_ACCOUNT=${ATTACK_ACCOUNT.length} ATTACK_RESOURCE=${ATTACK_RESOURCE}`);

      // Busca DEPOSIT (mesmo filtro do site)
      let cursor = null;
      for (let page = 0; page < 30; page++) {
        const body = {
          limit_per_page: 20,
          affected_global_entities_filter: [ATTACK_ACCOUNT],
          events_filter: [{ event: "Deposit", resource_address: ATTACK_RESOURCE }],
          opt_ins: { detailed_events: true },
        };
        if (cursor) body.cursor = cursor;
        const res = await gateway("/stream/transactions", body);
        const items = res.items || [];
        processItems(items, `Deposit page ${page + 1}`);
        cursor = res.next_cursor || null;
        if (!cursor) break;
        await new Promise((r) => setTimeout(r, 100));
      }

      // Busca WITHDRAWAL (mesmo filtro do site)
      cursor = null;
      for (let page = 0; page < 30; page++) {
        const body = {
          limit_per_page: 20,
          affected_global_entities_filter: [ATTACK_ACCOUNT],
          events_filter: [{ event: "Withdrawal", resource_address: ATTACK_RESOURCE }],
          opt_ins: { detailed_events: true },
        };
        if (cursor) body.cursor = cursor;
        const res = await gateway("/stream/transactions", body);
        const items = res.items || [];
        processItems(items, `Withdrawal page ${page + 1}`);
        cursor = res.next_cursor || null;
        if (!cursor) break;
        await new Promise((r) => setTimeout(r, 100));
      }

      // Ordena por timestamp decrescente (mais recente primeiro)
      history.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
      battleHistory = history.slice(0, 100);
      if (window.console) console.log(`[BattleHistory] DONE - total events=${history.length}, battleHistory.length=${battleHistory.length}, first timestamp=${battleHistory[0]?.timestamp}`);
    } catch (e) {
      console.error("Erro ao buscar histórico de batalhas:", e);
    }
  }

  function battleValue(b) {
    if (b.type === "Missile") return `${b.missiles_fired || 0} x ${b.damage_per_missile || 0} dmg`;
    if (b.type === "Attack" || b.type === "Raid") return `${b.war_spoils || 0} ${kgldHtml(14)}`;
    if (b.type === "Fortify") return `${b.army_units_transfered || 0} un`;
    return "";
  }

  function countdownLabel(at) {
    const ms = (typeof at === "string" ? parseInt(at, 10) : at) * 1000 - Date.now();
    if (ms <= 0) return "chegou";
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms % 86400000 / 3600000);
    const m = Math.floor(ms % 3600000 / 60000);
    const s = Math.floor(ms % 60000 / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d)}:${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  async function refreshBattles() {
    await Promise.all([fetchActiveBattles(), fetchBattleHistory()]);
    await ensureBattleNftMap();
    renderBattles();
    renderMyAttacks();
    renderHistory();
    renderLines();
  }

  function kingDisplay(nftId) {
    const k = kingdomByNft(nftId);
    const name = k ? k.name : "Unknown";
    return `${name} (${nftId})`;
  }

  const tsMs = (v) => typeof v === "string" && v.indexOf("T") >= 0 ? new Date(v).getTime() : (parseInt(v, 10) || 0) * 1000;

  function timeLabel(v) {
    let ms;
    if (typeof v === "string") ms = v.indexOf("T") >= 0 ? new Date(v).getTime() : parseInt(v, 10) * 1000;
    else ms = v * 1000;
    if (!ms || isNaN(ms)) return "—";
    const d = new Date(ms);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function timeEmoji(at) {
    const ms = (typeof at === "string" ? parseInt(at, 10) : at) * 1000 - Date.now();
    if (ms <= 0) return "☠️";
    if (ms > 6 * 3600000) return "⚔️";
    if (ms > 2 * 3600000) return "🚨";
    if (ms > 45 * 60000) return "🟠";
    return "🔴";
  }

  function renderBattles() {
    const badge = $("#rk-battles-count");
    const nowMs = Date.now();
    const ongoing = activeAttacks.filter((a) => {
      const at = typeof a.activation_time === "string" ? parseInt(a.activation_time, 10) : a.activation_time;
      return at && at * 1000 > nowMs;
    });
    if (badge) {
      badge.textContent = ongoing.length;
      badge.style.display = ongoing.length ? "inline-block" : "none";
    }
    const panel = $("#rk-battles-panel");
    if (!panel || panel.classList.contains("hidden")) return;
    const upd = $("#rk-battles-updated");
    if (upd) upd.textContent = new Date().toLocaleTimeString();
const act = $("#rk-active-battles");
      if (act) {
        const gs = groupSoldierUrl();
        const sorted = [...ongoing].sort((a, b) => (a.activation_time || 0) - (b.activation_time || 0));
        act.innerHTML = sorted.length ? sorted.map((a) => {
        const ts = typeof a.timestamp === "string" ? parseInt(a.timestamp, 10) : a.timestamp;
        const at = a.activation_time;
        const typeCell = gs
          ? `<span class="ads-type ${(a.type || "").toLowerCase()}"><span class="ads-thumb" data-rk-prog="${ts || 0}" data-rk-end="${at || 0}"><img src="${gs}" alt="soldiers"><span class="ads-prog"></span></span>${a.type}</span>`
          : `<span class="ads-type ${(a.type || "").toLowerCase()}">${battleIcon(a.type)} ${a.type}</span>`;
        return `
        <div class="ads-row ads-item" title="${kingDisplay(a.attacker)} → ${kingDisplay(a.defender)}">
          ${typeCell}
          <span>${timeLabel(ts)}</span>
          <span class="ads-names">${kingDisplay(a.attacker)}</span>
          <span class="ads-names">${kingDisplay(a.defender)}</span>
          <span>${timeLabel(at)}</span>
          <span class="ads-cd">${countdownLabel(at)}</span>
        </div>`;
      }).join("") : `<div class="ads-row ads-item"><span style="grid-column:1/-1;color:var(--dim);">${t("semAtaquesAtivos")}</span></div>`;
    }
  }

  async function ensureOwnStates() {
    const missing = ownKingdoms.filter((k) => !ownStates[k.component]);
    for (const k of missing) {
      try { ownStates[k.component] = await fetchKingdomState(k.component); } catch (e) { /* mantém vazio */ }
    }
    renderMyAttacks();
  }

  function renderMyAttacks() {
    const badge = $("#rk-myattacks-count");
    const mineIds = new Set(ownKingdoms.map((k) => k.nftId));
    const nowMs = Date.now();
    const nowSec = Math.floor(nowMs / 1000);
    const mine = activeAttacks.filter((a) => {
      const at = typeof a.activation_time === "string" ? parseInt(a.activation_time, 10) : a.activation_time;
      return mineIds.has(a.attacker) && at && at * 1000 > nowMs;
    });
    const states = ownKingdoms.map((k) => ({ k, st: ownStates[k.component] })).filter((x) => x.st);
    const claims = [];
    const cNow = Math.floor(Date.now() / 1000);
    for (const { k, st } of states) {
      const tag = (k.name || st.nftId || "?").toString().slice(0, 20);
      const comp = k.component;
      const nftId = st.nftId;
      if (st.armyToBeClaimed > 0 && cNow > (st.armyUnitsCompleted || 0)) claims.push({ icon: "⚔️", tag, comp, nftId, type: "army", count: st.armyToBeClaimed, txt: `${st.armyToBeClaimed} ${t("troops")}` });
      if (st.missilesToBeClaimed > 0 && cNow > (st.missilesCompleted || 0)) claims.push({ icon: "🚀", tag, comp, nftId, type: "missile", count: st.missilesToBeClaimed, txt: `${st.missilesToBeClaimed} ${t("missiles")}` });
      if (st.amBarriersToBeClaimed > 0 && cNow > (st.amBarrierCompleted || 0)) claims.push({ icon: "🛡️", tag, comp, nftId, type: "barrier", count: st.amBarriersToBeClaimed, txt: `${st.amBarriersToBeClaimed} ${t("barriers")}` });
      const uc = st.underConstruction;
      const validBuild = uc && typeof uc === "string" && uc.trim().toLowerCase() !== "none" && BUILD_NAMES[uc.trim().toLowerCase()];
      if (validBuild && (st.buildingConstructionStart || 0) > 0 && (st.buildingConstructionDuration || 0) > 0 && cNow > ((st.buildingConstructionStart || 0) + (st.buildingConstructionDuration || 0))) claims.push({ icon: "🏗️", tag, comp, nftId, type: "build", txt: `${t("construction")} ${validBuild}` });
      if (st.unclaimedGold > 0) claims.push({ icon: kgldHtml(16), tag, comp, nftId, type: "gold", txt: `${Math.floor(st.unclaimedGold).toLocaleString()} ${t("gold")}` });
    }
    const total = mine.length + claims.length;
    if (badge) {
      badge.textContent = total;
      badge.style.display = total ? "inline-block" : "none";
    }
    const list = $("#rk-my-attacks");
    const cdWrap = $("#rk-my-cooldowns");
    const clWrap = $("#rk-my-claims");
    if (!list || !cdWrap || !clWrap) return;
    const cdCards = [];
    for (const { k, st } of states) {
      const defs = [
        { icon: "⚔️", name: "Attack", end: st.lastAttack + 14400 },
        { icon: "🏹", name: "Raid", end: st.lastRaid + 14400 },
        { icon: "🚀", name: "Missile", end: st.lastMissile + 14400 },
        { icon: "🏰", name: "Fortify", end: st.lastFortify + 604800 },
      ];
      for (const d of defs) {
        const rem = d.end - nowSec;
        if (rem <= 0) continue;
        const txt = d.name === "Fortify"
          ? `${Math.floor(rem / 86400)}d ${Math.floor(rem % 86400 / 3600)}h ${Math.floor(rem % 3600 / 60)}m`
          : `${Math.floor(rem / 3600)}:${String(Math.floor(rem % 3600 / 60)).padStart(2, "0")}:${String(Math.floor(rem % 60)).padStart(2, "0")}`;
        cdCards.push(`<div class="army-card cooldown-card">
          <div class="army-card-content">
            <div class="army-icon">${d.icon}</div>
            <div class="army-info">
              <div class="army-name">${d.name} ${t("cooldownLabel")}</div>
              <div class="army-kingdom">${k.name}</div>
              <div class="army-value">${t("active")}</div>
            </div>
          </div>
          <div class="build-timer cooldown-timer">${t("endsIn")}: ${txt}</div>
        </div>`);
      }
    }
    cdWrap.innerHTML = cdCards.length ? cdCards.join("") : `<div class="battle-item" style="color:var(--dim);cursor:default;">${t("noCooldown")}</div>`;
    clWrap.innerHTML = claims.length ? claims.map((c) => `
      <div class="battle-item" title="${c.tag}" style="display:flex;align-items:center;gap:8px;">
        <span class="btype">${c.icon}</span>
        <span class="bfield" style="flex:1;">${c.tag} — ${c.txt}</span>
        ${c.type === "army" ? `<button class="btn gold" onclick='claimFor("${c.comp}","${c.nftId}","army")'>⚔️ ${t("claim")}</button>` : ""}
        ${c.type === "missile" ? `<button class="btn gold" onclick='claimFor("${c.comp}","${c.nftId}","missile")'>🚀 ${t("claim")}</button>` : ""}
        ${c.type === "barrier" ? `<button class="btn gold" onclick='claimFor("${c.comp}","${c.nftId}","barrier")'>🛡️ ${t("claim")}</button>` : ""}
        ${c.type === "build" ? `<button class="btn gold" onclick='claimFor("${c.comp}","${c.nftId}","build")'>🏗️ ${t("claim")}</button>` : ""}
        ${c.type === "gold" ? `<button class="btn gold" onclick='claimFor("${c.comp}","${c.nftId}","gold")'>${kgldHtml(14)} ${t("claim")}</button>` : ""}
      </div>`).join("") : `<div class="battle-item" style="color:var(--dim);cursor:default;">${t("nothingToClaim")}</div>`;
    list.innerHTML = mine.length ? mine.map((a) => `
      <div class="battle-item" title="${battleTypeLabel(a.random_type)}: você → ${kingDisplay(a.defender)}">
        <span class="btype">${battleIcon(a.type)}</span>
        <span class="bfield">→ ${kingDisplay(a.defender)}</span>
        <span class="bvs">chega em ${countdownLabel(a.activation_time)}</span>
      </div>`).join("") : `<div class="battle-item" style="color:var(--dim);cursor:default;">${t("notAttacking")}</div>`;
  }

  let lastFilteredHistory = [];

  function dtLabel(v) {
    const ms = tsMs(v);
    if (!ms) return "—";
    const d = new Date(ms);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function fmt(n) {
    return (n || 0).toLocaleString("pt-BR");
  }

  function historyDetails(b) {
    if (b.type === "Missile") return `${fmt(b.missiles_fired)} x ${fmt(b.damage_per_missile)} damage`;
    if (b.type === "Attack" || b.type === "Raid") return `${fmt(b.war_spoils)} gold`;
    if (b.type === "Fortify") return `${fmt(b.army_units_transfered)} units`;
    return `${fmt(b.war_spoils || b.amount)} gold`;
  }

  function renderHistory() {
    const body = $("#rk-battle-history");
    const search = $("#rk-history-search");
    if (!body || !search) return;
    const panel = $("#rk-history-panel");
    if (panel && panel.classList.contains("hidden")) return;
    const q = (search.value || "").toLowerCase();
    const filtered = battleHistory.filter((b) => {
      const a = (kingDisplay(b.attacker) || "").toLowerCase();
      const d = (kingDisplay(b.defender) || "").toLowerCase();
      const w = (b.winner ? kingDisplay(b.winner) : "").toLowerCase();
      return !q || a.includes(q) || d.includes(q) || w.includes(q);
    });
    lastFilteredHistory = filtered;
    body.innerHTML = filtered.length ? filtered.map((b, i) => `
      <div class="wh-row wh-item" title="${dtLabel(b.timestamp)}">
        <span class="wh-type ${b.type.toLowerCase()}">${b.type}</span>
        <span>${dtLabel(b.timestamp)}</span>
        <span class="wh-name">${kingDisplay(b.attacker)}</span>
        <span class="wh-name">${kingDisplay(b.defender)}</span>
        <span class="wh-name">${b.winner ? kingDisplay(b.winner) : "—"}</span>
        <span>${historyDetails(b)}</span>
        <button class="wh-details" data-i="${i}" title="Detalhes">Details</button>
      </div>`).join("") : `<div class="wh-row wh-item" style="grid-column:1/-1;color:var(--dim);">Sem histórico</div>`;
  }

  function showBattleDetail(b) {
    const bdy = $("#rk-hd-body");
    const panel = $("#rk-hd");
    if (!bdy || !panel) return;
    const att = kingDisplay(b.attacker);
    const def = kingDisplay(b.defender);
    const win = b.winner ? kingDisplay(b.winner) : "—";
    bdy.innerHTML = `
      <div class="hd-row"><span class="k">Type</span><span class="v">${b.type}</span></div>
      <div class="hd-row"><span class="k">Time</span><span class="v">${dtLabel(b.timestamp)}</span></div>
      <div class="hd-row"><span class="k">Attacker</span><span class="v">${att}</span></div>
      <div class="hd-row"><span class="k">Defender</span><span class="v">${def}</span></div>
      <div class="hd-row"><span class="k">Winner</span><span class="v">${win}</span></div>
      <div class="hd-row"><span class="k">Details</span><span class="v">${historyDetails(b)}</span></div>
      <div class="hd-row"><span class="k">Tx Hash</span><span class="v">${b.transactionHash || "—"}</span></div>`;
    panel.classList.remove("hidden");
  }

  function renderLines() {
    if (!showLines) return;
    const container = $("#rk-map-lines");
    if (!container) return;
    container.innerHTML = "";
    // Draw lines for kingdoms with active deployments
    kingdoms.forEach((k) => {
      const st = ownStates[k.component] || (k.state ? k.state : null);
      if (!st) return;
      const hasAttacking = st.isAttacking || st.lockedAttacking > 0;
      const hasRaiding = st.isRaiding || st.lockedRaiding > 0;
      const hasFortifying = st.isFortifying || st.lockedFortifying > 0;
      const hasMissiles = st.launchedMissiles > 0;
      if (!hasAttacking && !hasRaiding && !hasFortifying && !hasMissiles) return;
      // Draw to target
      const tgt = target;
      if (!tgt) return;
      const color = hasAttacking ? "attack" : hasRaiding ? "raid" : hasFortifying ? "fortify" : "missile";
      const x1 = k.x * CELL_W + CELL_W / 2;
      const y1 = k.y * CELL_H + CELL_H / 2;
      const x2 = tgt.x * CELL_W + CELL_W / 2;
      const y2 = tgt.y * CELL_H + CELL_H / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180 / Math.PI);
      const line = document.createElement("div");
      line.className = "rk-line " + color;
      line.style.left = x1 + "px";
      line.style.top = y1 + "px";
      line.style.width = len + "px";
      line.style.height = "2px";
      line.style.transform = `rotate(${angle}deg)`;
      line.style.transformOrigin = "0 0";
      container.appendChild(line);
    });
    // Battle lines from active attacks (global): attacker -> enemy castle
    const nowMs = Date.now();
    activeAttacks.forEach((a) => {
      const at = typeof a.activation_time === "string" ? parseInt(a.activation_time, 10) : a.activation_time;
      if (!at || at * 1000 < nowMs) return;
      const fromK = kingdomByNft(a.attacker);
      const toK = kingdomByNft(a.defender);
      if (!fromK || !toK) return;
      const type = battleTypeLabel(a.random_type);
      const x1 = fromK.x * CELL_W + CELL_W / 2;
      const y1 = fromK.y * CELL_H + CELL_H / 2;
      const x2 = toK.x * CELL_W + CELL_W / 2;
      const y2 = toK.y * CELL_H + CELL_H / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180 / Math.PI);
      const line = document.createElement("div");
      line.className = "rk-battle-line " + type.toLowerCase();
      line.style.left = x1 + "px";
      line.style.top = y1 + "px";
      line.style.width = len + "px";
      line.style.height = "2px";
      line.style.transform = `rotate(${angle}deg)`;
      line.style.transformOrigin = "0 0";
      container.appendChild(line);
      const head = document.createElement("div");
      head.className = "rk-battle-head";
      const gs = groupSoldierUrl();
      const startMs = a.timestamp
        ? (typeof a.timestamp === "string" && a.timestamp.indexOf("T") >= 0 ? new Date(a.timestamp).getTime() : parseInt(a.timestamp, 10) * 1000)
        : at * 1000;
      const endMs = at * 1000;
      const durMs = Math.max(1000, endMs - startMs);
      const pct = Math.min(1, Math.max(0, (nowMs - startMs) / durMs));
      const hx = x1 + dx * pct;
      const hy = y1 + dy * pct;
      head.style.left = hx + "px";
      head.style.top = hy + "px";
      head.style.transform = "translate(-50%,-50%)";
      if (gs) {
        const sz = castleSize();
        head.innerHTML = `<img src="${gs}" alt="" style="width:${sz}px;height:${sz}px;object-fit:contain;" onerror="this.outerHTML='<span>${timeEmoji(at)}</span>'">`;
      } else {
        head.textContent = timeEmoji(at);
      }
      head.dataset.rkMove = "1";
      head.dataset.x1 = x1;
      head.dataset.y1 = y1;
      head.dataset.dx = dx;
      head.dataset.dy = dy;
      head.dataset.start = startMs;
      head.dataset.end = endMs;
      head.title = `${type}: ${kingDisplay(a.attacker)} → ${kingDisplay(a.defender)} chega em ${countdownLabel(a.activation_time)}`;
      container.appendChild(head);
    });
  }

  function updateFloatingStats() {
    const panel = $("#rk-floating-stats");
    if (!panel) return;
    let st = null;
    if (target && target.state) st = target.state;
    else if (selectedOwn) st = ownStates[selectedOwn.component];
    if (st) {
      $("#fs-troops").textContent = fmtAmount(st.defendingUnits);
      $("#fs-missiles").textContent = fmtAmount(st.kingdomMissiles);
      $("#fs-barriers").textContent = fmtAmount(st.antiMissileBarriers);
      panel.classList.add("show");
    } else {
      panel.classList.remove("show");
    }
  }

  function renderMarkers() {
    const container = $("#rk-markers");
    if (!container) return;
    container.innerHTML = "";
    for (const k of kingdoms) {
      const el = document.createElement("div");
      const isOwn = selectedOwn && selectedOwn.component === k.component;
      const isTarget = target && target.component === k.component;
      el.className = "kingdom-marker" + (isOwn ? " own" : "") + (isTarget ? " target" : "");
      el.style.left = (k.x * CELL_W + CELL_W / 2) + "px";
      el.style.top = ((k.y + 1) * CELL_H) + "px";
      el.style.zIndex = 10000 - k.y;
      const castleUrl = !useCastleEmoji ? castleLodUrl() : null;
      const csz = castleSize();
      const castleHtml = castleUrl
        ? `<img class="castle" src="${castleUrl}" style="width:${csz}px;height:${csz}px;" onerror="this.outerHTML='<span class=castle>🏰</span>'">`
        : '<span class="castle">🏰</span>';
      const isOwnKingdom = ownKingdoms.some((ok) => ok.component === k.component);
      const rarityHtml = isOwnKingdom ? (() => {
        const st = ownStates[k.component];
        const rarity = (st && st.kingdomType) || k.kingdomType || "Common";
        const rarityIcon = { Common: "Common", Uncommon: "Uncommon", Rare: "Rare", Epic: "Epic", Legendary: "Legendary" }[rarity] || "Common";
        const rarityUrl = rkImgUrls()[rarityIcon];
        return rarityUrl
          ? `<img class="rarity-icon" src="${rarityUrl}" alt="${rarity}" style="width:24px;height:24px;object-fit:contain;">`
          : "";
      })() : "";
      el.innerHTML = castleHtml + rarityHtml + '<span class="kname"></span>';
      el.dataset.comp = k.component;
      // Adiciona ID do reino (ex: #271#) se disponível
      const idStr = k.nftId || "";
      const shortId = idStr.match(/#(\d+)#/)?.[1] || "";
      const displayName = k.name + (shortId ? ` #${shortId}#` : "");
      el.querySelector(".kname").textContent = displayName;
      el.addEventListener("click", (ev) => { ev.stopPropagation(); onKingdomClick(k); });
      container.appendChild(el);
    }
    updateFloatingStats();
    renderCreateMarker();
  }

  function renderCreateMarker() {
    const container = $("#rk-create-markers");
    if (!container) return;
    container.querySelectorAll(".create-marker").forEach((el) => el.remove());
    if (!pickCreateMode) return;
    
    const maisUrl = rkImgUrls()["mais"];
    const sz = castleSize();
    let markerCount = 0;
    
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (kingdoms.some((k) => k.x === x && k.y === y)) continue;
        
        const isSelected = pendingCreate && pendingCreate.x === x && pendingCreate.y === y;
        const el = document.createElement("div");
        el.className = "create-marker" + (isSelected ? " selected" : "");
        el.style.cssText = `position:absolute;left:${x * CELL_W + CELL_W / 2}px;top:${(y + 1) * CELL_H}px;transform:translate(-50%,-100%);z-index:${isSelected ? 10001 : 10000};`;
        el.dataset.x = x; el.dataset.y = y;
        
        const opacity = isSelected ? "1" : "0.35";
        const filter = isSelected ? "drop-shadow(0 0 12px #d4af37)" : "drop-shadow(0 0 6px #d4af37)";
        
        const html = maisUrl
          ? `<img src="${maisUrl}" alt="+" style="width:${sz}px;height:${sz}px;object-fit:contain;${filter};opacity:${opacity};" onerror="this.onerror=null;this.outerHTML='<span style=font-size:${sz}px;color:#d4af37;${filter};opacity:${opacity};>+</span>'">`
          : `<span style="font-size:${sz}px;color:#d4af37;${filter};opacity:${opacity};">+</span>`;
        el.innerHTML = html;
        
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          pendingCreate = { x, y };
          renderCreateMarker();
          toast(`Posição: (${x}, ${y})`);
          openCreateKingdomModal();
        });
        container.appendChild(el);
        markerCount++;
      }
    }
    console.log(`Created ${markerCount} create markers, maisUrl:`, maisUrl);
  }

  /* ================================================================
   * Interações com o mapa
   * ================================================================ */
  let pendingCreate = null;
  let pickCreateMode = false;

  // Settings
  let autoRefreshEnabled = true;
  let showLines = true;
  let soundEnabled = false;
  let refreshInterval = 30;
  let showTerrain = true;
  let useCastleEmoji = false;
  let language = "pt";

  const I18N = {
    pt: {
      // Settings modal
      settings: "Configurações",
      autoRefresh: "Auto-refresh (30s)",
      showLines: "Mostrar linhas de ataque no mapa",
      sound: "Notificações sonoras",
      refreshInterval: "Intervalo de atualização (segundos)",
      showTerrain: "Mostrar mapa de fundo",
      useCastleEmoji: "Usar emoji 🏰 ao invés do ícone de castelo",
      language: "Idioma",
      save: "Salvar",
      saved: "Configurações salvas",

      // Top bar
      selectKingdom: "Selecionar seu reino",
      yourKingdom: "Seu reino...",
      targetSearchPlaceholder: "🔎 Alvo: nome ou x,y",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      recenter: "Centralizar",
      enterExitKingdom: "Entrar / sair do reino",
      ongoingAttacks: "Ataques em andamento",
      myAttacks: "Meu reino: ataques, claims e cooldowns",
      battleHistory: "Histórico de batalhas",
      treasuryTrezor: "Treasury & Trezor",
      config: "Configurações",
      createKingdom: "Criar novo reino",

      // Floating stats
      troops: "Troops",
      missiles: "Missiles",
      barriers: "Barreiras",

      // Panels (close buttons, etc.)
      close: "Fechar",

      // Battles panel
      battleType: "Tipo",
      battleStart: "Início",
      battleAttacker: "Atacante",
      battleTarget: "Alvo",
      battleArrival: "Chegada",
      battleCountdown: "Contagem (D:HH:MM:SS)",

      // History panel
      searchKingdoms: "Buscar reinos...",
      historyTime: "Hora",
      historyAttacker: "Atacante/Remetente",
      historyDefender: "Defensor/Recebedor",
      historyWinner: "Vencedor",
      historyDetails: "Detalhes",
      historyActions: "Ações",
      battleDamageReport: "Relatório de dano de batalha",
      detailsBtn: "Detalhes",

      // Target panel
      targetTitle: "Alvo",
      declareWar: "Declarar guerra",
      launchMissile: "Lançar míssil",
      raid: "Raid",
      fortify: "Fortificar",

      // Castle panel
      myKingdom: "Meu Reino",
      switchKingdom: "Trocar de reino...",
      switchKingdomTitle: "Trocar de reino",
      prospect: "Prospectar",
      prospectTitle: "Prospectar recursos",
      buildTitle: "Construir edifício",

      // Castle info text labels
      treasury: "Tesouro",
      unclaimedGold: "Unclaimed Gold",
      raidLoot: "Raid Loot",
      unclaimedRes: "Unclaimed Res",
      unclaimedArmy: "Unclaimed Army",
      unclaimedMissiles: "Unclaimed Missiles",
      unclaimedBarriers: "Unclaimed Barriers",
      distance: "Distância",
      units: "unidades",
      deployed: "Em campo",
      amBarriers: "Barreiras AM",

      // Castle labels (production cards)
      recruit: "Recrutar",
      production: "Produção",
      build: "Construir",
      claim: "Reivindicar",
      productionCardDefenders: "Defenders",
      productionCardMissiles: "Missiles",
      productionCardLaunched: "Lançados",
      productionCardBarriers: "Barreiras",
      productionCardMage: "Mage Tower",
      productionCardObscura: "Templo Obscura",
      productionCardBarracks: "Quartel",
      productionCardAcademy: "Academia",
      productionCardStronghold: "Fortaleza",

      // Trezor panel
      trezorTitle: "Trezor",
      deposit: "Depositar",
      withdraw: "Withdraw",
      balance: "Saldo",
      amount: "Valor",

      // Hall of Fame
      hallOfFame: "Hall da Fama",
      hofDefenders: "Defenders",
      hofRaidLoot: "Raid Loot",
      hofTreasury: "Treasury",
      hofRank: "#",
      hofType: "Tipo",
      hofKingdom: "Reino",
      hofOwn: "Próprio",
      hofEnemy: "Inimigo",
      hofTotal: "total",
      hofDefendersVal: "Defensores",
      hofRaidLootVal: "Raid Loot",
      hofTreasuryVal: "Tesouraria",
      hofNoData: "Nenhum dado disponível ainda.",
      refresh: "Atualizar",

      // Create kingdom modal
      kingdomName: "Nome do reino",
      kingdomNamePlaceholder: "Ex.: Valhalla",
      create: "Criar",
      cancel: "Cancelar",
      positionInvalid: "Posição inválida.",
      kingdomNameRequired: "Dê um nome ao reino.",
      positionTaken: "Já existe um reino nessa posição.",
      clickCellToChoose: "Clique numa célula vazia do mapa para escolher a posição.",

      // Confirm modal
      confirm: "Confirmar",
      yes: "Sim",
      no: "Não",
      create: "Criar",
      blocked: "Bloqueado",
      claim: "Reivindicar",

      // Toast messages - wallet
      connectWallet: "Conecte a wallet (botão acima) para ver seus reinos e jogar.",
      sdkLoading: "SDK da wallet ainda carregando, tente de novo em instantes.",
      noWalletAccount: "A wallet não retornou uma conta.",
      walletConflict: "Conflito de wallet detectado. Recarregue a página (F5) e tente conectar novamente.",
      walletFailed: "Conexão com a wallet falhou: ",
      connectWalletFirst: "Conecte a wallet primeiro.",
      noKingdomYet: "Você não tem reino na wallet. Crie um reino (600 XRD).",
      clickTargetFirst: "Clique em um reino no mapa para selecionar o alvo.",
      sdkNotLoaded: "SDK da wallet não carregado.",
      txInProgress: "Já enviando transação...",
      txConfirmed: "confirmado!",
      txWarning: "⚠️ : ",
      txError: "❌ : ",

      // Toast messages - kingdom
      ownKingdom: "Esse é o seu reino: ",
      loadKingdomError: "Erro ao carregar o reino: ",
      kingdomNotLoaded: "Estado do reino não carregado.",
      pickBuilding: "Selecione um edifício disponível.",
      noBuildToClaim: "Nenhuma construção para reivindicar.",
      noArmyToClaim: "Nenhuma tropa para reivindicar.",
      noMissilesToClaim: "Nenhum míssil para reivindicar.",
      noBarriersToClaim: "Nenhuma barreira para reivindicar.",
      requiresBarracks: "Você precisa de um quartel para recrutar defensores.",
      requiresMageTower: "Requer Torre de Mago: construa uma para fabricar mísseis.",
      requiresObscuraTemple: "Requer Templo Obscura: construa um para fabricar barreiras.",

      // Toast messages - validation
      invalidValue: "Valor inválido.",
      invalidQuantity: "Quantidade inválida.",
      invalidQuantityMax: "Quantidade inválida (1 a ",
      invalidAmountMax: "Valor inválido (máximo ",
      invalidAmountRange: "Valor inválido (1 a ",

      // Toast messages - data
      fetchingKingdoms: "Buscando reinos da conta: ",
      noKingdomsFound: "Conta conectada, mas nenhum reino encontrado nela. Verifique se está na conta correta.",
      kingdomsLoadError: "Não foi possível carregar os reinos da rede. Verifique a internet.",
      dataLoadError: "Erro ao carregar dados: ",
      updateError: "Erro ao atualizar: ",
      kingdomUpdated: "Reino atualizado.",
      imagesReloaded: "Imagens recarregadas (",
      imageReloadError: "Erro ao recarregar imagens: ",

      // Build costs labels
      mine: "Mine",
      barracks: "Barracks",
      trezor: "Trezor",
      stronghold: "Stronghold",
      mageTower: "Mage Tower",
      researchAcademy: "Research Academy",
      obscuraTemple: "Obscura Temple",

      // HUD
      active: "Ativo",
      inactive: "Inativo",
      cooldown: "Cooldown",

      // Top bar
      location: "Localização",
      coords: "Coordenadas",

      // Iso view badges
      readyToClaim: "prontos p/ claim",
      readyToClaimShort: "pronto p/ claim",
      underConstruction: "em construção",
      training: "criando soldados…",
      trainingShort: "treinando...",
      recruitingShort: "recrutando...",
      manufacturingMissiles: "fabricando mísseis…",
      manufacturingMissilesShort: "fabricando...",
      manufacturingBarriers: "fabricando barreiras…",
      manufacturingBarriersShort: "fabricando...",
      defenders: "defensores",
      missiles: "mísseis",
      barriers: "barreiras",
      troops: "tropas",
      notBuilt: "não possui",
      loading: "Carregando",
      construction: "construção",
      gold: "ouro",
      active: "Ativo",
      endsIn: "Termina em",
      cooldownLabel: "Cooldown",
      semAtaquesAtivos: "Sem ataques ativos no momento",
      noCooldown: "Nenhum cooldown ativo",
      noReinosConecte: "Sem reinos (conecte a wallet)",
      noKingdomFound: "Nenhum reino encontrado",
      productionInProgress: "Produção em andamento. Pronto em ",
      nothingToClaim: "Nada para reivindicar",
      notAttacking: "Você não está atacando",
    },
    en: {
      // Settings modal
      settings: "Settings",
      autoRefresh: "Auto-refresh (30s)",
      showLines: "Show attack lines on map",
      sound: "Sound notifications",
      refreshInterval: "Refresh interval (seconds)",
      showTerrain: "Show background map",
      useCastleEmoji: "Use emoji 🏰 instead of castle icon",
      language: "Language",
      save: "Save",
      saved: "Settings saved",

      // Top bar
      selectKingdom: "Select your kingdom",
      yourKingdom: "Your kingdom...",
      targetSearchPlaceholder: "🔎 Target: name or x,y",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      recenter: "Center",
      enterExitKingdom: "Enter / leave kingdom",
      ongoingAttacks: "Ongoing attacks",
      myAttacks: "My kingdom: attacks, claims & cooldowns",
      battleHistory: "Battle history",
      treasuryTrezor: "Treasury & Vault",
      config: "Settings",
      createKingdom: "Create new kingdom",

      // Floating stats
      troops: "Troops",
      missiles: "Missiles",
      barriers: "Barriers",

      // Panels (close buttons, etc.)
      close: "Close",

      // Battles panel
      battleType: "Type",
      battleStart: "Start Time",
      battleAttacker: "Attacker",
      battleTarget: "Target",
      battleArrival: "Arrival",
      battleCountdown: "Countdown (D:HH:MM:SS)",

      // History panel
      searchKingdoms: "Search kingdoms...",
      historyTime: "Time",
      historyAttacker: "Attacker/Sender",
      historyDefender: "Defender/Receiver",
      historyWinner: "Winner",
      historyDetails: "Details",
      historyActions: "Actions",
      battleDamageReport: "Battle Damage Report",
      detailsBtn: "Details",

      // Target panel
      targetTitle: "Target",
      declareWar: "Declare war",
      launchMissile: "Launch missile",
      raid: "Raid",
      fortify: "Fortify",

      // Castle panel
      myKingdom: "My Kingdom",
      switchKingdom: "Switch kingdom...",
      switchKingdomTitle: "Switch kingdom",
      prospect: "Prospect",
      prospectTitle: "Prospect resources",
      buildTitle: "Build building",

      // Castle info text labels
      treasury: "Treasury",
      unclaimedGold: "Unclaimed Gold",
      raidLoot: "Raid Loot",
      unclaimedRes: "Unclaimed Res",
      unclaimedArmy: "Unclaimed Army",
      unclaimedMissiles: "Unclaimed Missiles",
      unclaimedBarriers: "Unclaimed Barriers",
      distance: "Distance",
      units: "units",
      deployed: "Deployed",
      amBarriers: "AM Barriers",

      // Castle labels (production cards)
      recruit: "Recruit",
      production: "Production",
      build: "Build",
      claim: "Claim",
      productionCardDefenders: "Defenders",
      productionCardMissiles: "Missiles",
      productionCardLaunched: "Launched",
      productionCardBarriers: "Barriers",
      productionCardMage: "Mage Tower",
      productionCardObscura: "Obscura Temple",
      productionCardBarracks: "Barracks",
      productionCardAcademy: "Academy",
      productionCardStronghold: "Stronghold",

      // Trezor panel
      trezorTitle: "Vault",
      deposit: "Deposit",
      withdraw: "Withdraw",
      balance: "Balance",
      amount: "Amount",

      // Hall of Fame
      hallOfFame: "Hall of Fame",
      hofDefenders: "Defenders",
      hofRaidLoot: "Raid Loot",
      hofTreasury: "Treasury",
      hofRank: "#",
      hofType: "Type",
      hofKingdom: "Kingdom",
      hofOwn: "Own",
      hofEnemy: "Enemy",
      hofTotal: "total",
      hofDefendersVal: "Defenders",
      hofRaidLootVal: "Raid Loot",
      hofTreasuryVal: "Treasury",
      hofNoData: "No data available yet.",
      refresh: "Refresh",

      // Create kingdom modal
      kingdomName: "Kingdom name",
      kingdomNamePlaceholder: "Ex.: Valhalla",
      create: "Create",
      cancel: "Cancel",
      positionInvalid: "Invalid position.",
      kingdomNameRequired: "Give a name to the kingdom.",
      positionTaken: "A kingdom already exists at that position.",
      clickCellToChoose: "Click an empty cell on the map to choose the position.",

      // Confirm modal
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      create: "Create",
      blocked: "Blocked",
      claim: "Claim",

      // Toast messages - wallet
      connectWallet: "Connect the wallet (button above) to see your kingdoms and play.",
      sdkLoading: "Wallet SDK still loading, try again in a moment.",
      noWalletAccount: "The wallet did not return an account.",
      walletConflict: "Wallet conflict detected. Reload the page (F5) and try to connect again.",
      walletFailed: "Wallet connection failed: ",
      connectWalletFirst: "Connect the wallet first.",
      noKingdomYet: "You don't have a kingdom in the wallet. Create one (600 XRD).",
      clickTargetFirst: "Click a kingdom on the map to select the target.",
      sdkNotLoaded: "Wallet SDK not loaded.",
      txInProgress: "Already sending transaction...",
      txConfirmed: "confirmed!",
      txWarning: "⚠️ : ",
      txError: "❌ : ",

      // Toast messages - kingdom
      ownKingdom: "This is your kingdom: ",
      loadKingdomError: "Error loading the kingdom: ",
      kingdomNotLoaded: "Kingdom state not loaded.",
      pickBuilding: "Select an available building.",
      noBuildToClaim: "No construction to claim.",
      noArmyToClaim: "No troops to claim.",
      noMissilesToClaim: "No missiles to claim.",
      noBarriersToClaim: "No barriers to claim.",
      requiresBarracks: "You need a barracks to recruit defenders.",
      requiresMageTower: "Requires Mage Tower: build one to manufacture missiles.",
      requiresObscuraTemple: "Requires Obscura Temple: build one to manufacture barriers.",

      // Toast messages - validation
      invalidValue: "Invalid value.",
      invalidQuantity: "Invalid quantity.",
      invalidQuantityMax: "Invalid quantity (1 to ",
      invalidAmountMax: "Invalid value (max ",
      invalidAmountRange: "Invalid value (1 to ",

      // Toast messages - data
      fetchingKingdoms: "Fetching kingdoms from account: ",
      noKingdomsFound: "Account connected, but no kingdom found. Check if you're on the right account.",
      kingdomsLoadError: "Could not load kingdoms from the network. Check your internet.",
      dataLoadError: "Error loading data: ",
      updateError: "Error updating: ",
      kingdomUpdated: "Kingdom updated.",
      imagesReloaded: "Images reloaded (",
      imageReloadError: "Error reloading images: ",

      // Build costs labels
      mine: "Mine",
      barracks: "Barracks",
      trezor: "Vault",
      stronghold: "Stronghold",
      mageTower: "Mage Tower",
      researchAcademy: "Research Academy",
      obscuraTemple: "Obscura Temple",

      // HUD
      active: "Active",
      inactive: "Inactive",
      cooldown: "Cooldown",

      // Top bar
      location: "Location",
      coords: "Coordinates",

      // Iso view badges
      readyToClaim: "ready to claim",
      readyToClaimShort: "ready to claim",
      underConstruction: "under construction",
      training: "training soldiers…",
      trainingShort: "training...",
      recruitingShort: "recruiting...",
      manufacturingMissiles: "manufacturing missiles…",
      manufacturingMissilesShort: "manufacturing...",
      manufacturingBarriers: "manufacturing barriers…",
      manufacturingBarriersShort: "manufacturing...",
      defenders: "defenders",
      missiles: "missiles",
      barriers: "barriers",
      troops: "troops",
      notBuilt: "not built",
      loading: "Loading",
      construction: "construction",
      gold: "gold",
      active: "Active",
      endsIn: "Ends in",
      cooldownLabel: "Cooldown",
      semAtaquesAtivos: "No active attacks at the moment",
      noCooldown: "No active cooldown",
      noReinosConecte: "No kingdoms (connect wallet)",
      noKingdomFound: "No kingdom found",
      productionInProgress: "Production in progress. Ready at ",
      nothingToClaim: "Nothing to claim",
      notAttacking: "You're not attacking",
    },
  };

  function t(key) {
    return (I18N[language] && I18N[language][key]) || I18N.pt[key] || key;
  }

  // Aplica i18n a elementos com atributo data-i18n
  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");
      if (attr) {
        el.setAttribute(attr, t(key));
      } else {
        el.textContent = t(key);
      }
    });
  }

  async function onKingdomClick(k) {
    if (selectedOwn && selectedOwn.component === k.component) {
      await selectOwnKingdom(selectedOwn.nftId, true);
      toast(t("ownKingdom") + k.name);
      return;
    }
    setStatus(`${t("loading")} ${k.name}...`);
    try {
      const st = await fetchKingdomState(k.component);
      lastTargetState = st;
      target = { ...k, nftId: k.nftId || (st ? st.nftId : null), state: st };
      renderMarkers();
      renderLines();
      updateTargetPanel();
      updateETAs();
    } catch (e) {
      toast(t("loadKingdomError") + e.message, true);
    } finally {
      setStatus(null);
    }
  }

  function cdLabel(last) {
    const now = Math.floor(Date.now() / 1000);
    if (!last) return "pronto";
    const rem = 14400 - (now - last);
    return rem > 0 ? `${Math.ceil(rem / 60)}min` : "pronto";
  }

  function buildKingdomInfoText(st, k) {
    const myK = selectedOwn ? kingdoms.find(x => x.component === selectedOwn.component) : null;
    const dist = myK ? Math.hypot(k.x - myK.x, k.y - myK.y).toFixed(2) : "?";
    // Para reinos inimigos, mostra Raid Loot; para o próprio, Unclaimed Gold
    const isOwn = selectedOwn && k.component === selectedOwn.component;
    const goldLabel = isOwn ? t("unclaimedGold") : t("raidLoot");
    // O site mostra o mesmo cálculo de unclaimedGold (em tempo real) para ambos
    const goldValue = st.unclaimedGold ?? 0;
    const lines = [
      `${t("distance")}: ${dist} ${t("units")}`,
      `🗺️ ${t("location")}: ${k.x}, ${k.y}`,
      `🛡️ ${t("productionCardDefenders")}: ${st.defendingUnits ?? "?"}`,
      `⚔️ ${t("deployed")}: ${st.lockedAttacking + st.lockedRaiding + st.lockedFortifying + st.lockedTraveling ?? 0}`,
      `🚀 ${t("productionCardMissiles")}: ${st.kingdomMissiles ?? "?"}`,
      `🛡️ ${t("amBarriers")}: ${st.antiMissileBarriers ?? "?"}`,
      `${kgldHtml(16)} ${t("treasury")}: ${fmtAmount(st.kgld ?? 0)} KGLD`,
      `⛏️ ${goldLabel}: ${fmtAmount(goldValue)}`,
      `⚔️ ${t("unclaimedArmy")}: ${st.armyToBeClaimed ?? 0}`,
      `🚀 ${t("unclaimedMissiles")}: ${st.missilesToBeClaimed ?? 0}`,
      `🛡️ ${t("unclaimedBarriers")}: ${st.amBarriersToBeClaimed ?? 0}`,
    ];
    return lines;
  }

  function positionTargetPanel() {
    const panel = $("#rk-target");
    if (!panel || !target || !target.component) return;
    const marker = document.querySelector(".kingdom-marker[data-comp='" + target.component + "']");
    const vp = $("#rk-map-viewport");
    if (!marker || !vp) return;
    const vpr = vp.getBoundingClientRect();
    const r = marker.getBoundingClientRect();
    const panelW = 300;
    const panelH = 340;
    const cx = r.left - vpr.left + r.width / 2;
    const top = r.top - vpr.top;
    let x = Math.max(8, Math.min(cx - panelW / 2, vpr.width - panelW - 8));
    let y = top - panelH - 14;
    if (y < 8) y = top + r.height + 14;
    panel.style.left = x + "px";
    panel.style.top = y + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  }

  function updateTargetPanel() {
    const panel = $("#rk-target");
    if (!panel) return;
    if (target) {
      const titleEl = $("#rk-target-title");
      const coordsEl = $("#rk-target-coords");
      const infoEl = $("#rk-target-info");
      if (titleEl) {
        const nameEl = $("#rk-target-name");
        if (nameEl) nameEl.textContent = target.name || "Alvo";
        else titleEl.textContent = `🎯 ${target.name || "Alvo"}`;
      }
      if (coordsEl) coordsEl.textContent = `(${target.x}, ${target.y})`;
      if (infoEl) {
        if (target.state) {
          const lines = buildKingdomInfoText(target.state, target);
          infoEl.innerHTML = lines.map((l, i) => {
            const [label, ...rest] = l.split(": ");
            const val = rest.join(": ");
            const cls = /Unclaimed/.test(label) && val !== "0" && val !== "?" ? " warn" : "";
            return `<div class="tk${cls}"><span class="tl">${label}:</span><span class="tv">${val}</span></div>`;
          }).join("");
        } else {
          infoEl.innerHTML = `<div class="tk"><span class="tl">${t("loading")}...</span></div>`;
        }
      }
      const canWar = walletConnected && selectedOwn && target.nftId;
      const warBtns = ["rk-war-attack", "rk-war-missile", "rk-war-raid", "rk-war-fortify"];
      warBtns.forEach(id => { const b = $("#" + id); if (b) b.disabled = !canWar; });
      const viewBtn = $("#rk-target-view-buildings");
      if (viewBtn) viewBtn.disabled = !target.state;
      panel.classList.remove("hidden");
      positionTargetPanel();
    } else {
      panel.classList.add("hidden");
    }
  }

  function updateETAs() {
    if (!target || !target.state || !selectedOwn) return;
    const myK = kingdoms.find((x) => x.component === selectedOwn.component);
    if (!myK) return;
    const euclid = Math.hypot(target.x - myK.x, target.y - myK.y);
    // Fórmula exata do site: distance = Math.pow(1.05, Math.floor(euclid) - 1)
    const siteDist = euclid >= 1 ? Math.pow(1.05, Math.floor(euclid) - 1) : 0;
    const mySt = ownStates[selectedOwn.component];
    const speedFactor = (mySt && mySt.researchAcademy > 0) ? 0.9 : 1;
    const times = {
      attack: Math.round(7200 * siteDist * speedFactor),
      missile: Math.round(1800 * siteDist * speedFactor),
      raid: Math.round(3600 * siteDist * speedFactor),
      fortify: Math.round(7200 * siteDist * speedFactor),
    };
    function fmtETA(hours) {
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      const s = Math.floor(((hours - h) * 60 - m) * 60);
      return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
    }
    const addETA = (btnId, secs) => {
      const btn = $("#" + btnId);
      if (!btn || !btn.parentElement) return;
      const etaEl = btn.parentElement.querySelector(".eta");
      if (etaEl) etaEl.textContent = `Est. arrival: 🏃 ${fmtETA(secs / 3600)}`;
    };
    addETA("rk-war-attack", times.attack);
    addETA("rk-war-missile", times.missile);
    addETA("rk-war-raid", times.raid);
    addETA("rk-war-fortify", times.fortify);
  }

  function hideTargetPanel() {
    target = null;
    lastTargetState = null;
    renderMarkers();
    renderLines();
    updateTargetPanel();
  }

  /* ================================================================
   * Wallet / seleção de reino
   * ================================================================ */
  async function onWalletChanged() {
    const btn = $("#rk-connect");
    const label = $("#rk-account");
    if (walletConnected && account) {
      btn.textContent = "Desconectar (recarregue)";
      label.textContent = account;
      label.title = account;
      await loadAll();
    } else {
      btn.textContent = "Conectar Wallet";
      label.textContent = "";
      label.title = "";
      const sel = $("#rk-kingdom");
      if (sel) {
        sel.innerHTML = "";
        sel.disabled = true;
        const o = document.createElement("option");
        o.value = "";
        o.textContent = "Sem reinos (conecte a wallet)";
        sel.appendChild(o);
      }
    }
  }

  function updateKingdomSelect() {
    const sel = $("#rk-kingdom");
    if (!sel) return;
    const prev = selectedOwn ? selectedOwn.nftId : null;
    sel.innerHTML = "";
    if (!ownKingdoms.length) {
      sel.disabled = true;
      const o = document.createElement("option");
      o.value = "";
      o.textContent = account ? t("noKingdomsFound") : t("noReinosConecte");
      sel.appendChild(o);
      return;
    }
    sel.disabled = false;
    ownKingdoms.forEach((k) => {
      const o = document.createElement("option");
      o.value = k.nftId;
      o.textContent = (k.name || k.nftId.slice(0, 12)) + (k.nftId === prev ? " (atual)" : "");
      sel.appendChild(o);
    });
    if (prev) sel.value = prev;
  }

  function updateCastleKingdomSelect() {
    const sel = $("#rk-castle-kingdom");
    if (!sel) return;
    const prev = selectedOwn ? selectedOwn.nftId : null;
    sel.innerHTML = '<option value="">Trocar reino...</option>';
    if (!ownKingdoms.length) {
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    ownKingdoms.forEach((k) => {
      if (k.nftId === prev) return;
      const o = document.createElement("option");
      o.value = k.nftId;
      o.textContent = (k.name || k.nftId.slice(0, 12));
      sel.appendChild(o);
    });
    if (prev) sel.value = prev;
  }

  async function selectOwnKingdom(nftId, forceRefresh) {
    const own = ownKingdoms.find((k) => k.nftId === nftId);
    if (!own) return;
    selectedOwn = own;
    updateKingdomSelect();
    if ($("#rk-castle").classList.contains("open")) updateCastleKingdomSelect();
    renderMarkers();
    renderLines();
    const k = kingdoms.find((x) => x.component === own.component);
    if (forceRefresh || !ownStates[own.component]) {
      setStatus(`${t("loading")}...`);
      try {
        ownStates[own.component] = await fetchKingdomState(own.component);
      } catch (e) {
        ownStates[own.component] = null;
      } finally { setStatus(null); }
    }
    const st = ownStates[own.component];
    if (st) {
      updateBalances();
      if ($("#rk-castle").classList.contains("open")) renderCastle();
    }
    if (k) focusOn(k);
    updateTargetPanel();
  }

  function buildOwnInfoText(st) {
    const lines = [
      `🏰 ${st.name || "Seu reino"}`,
      `${kgldHtml(16)} ${t("treasury")}: ${fmtAmount(st.kgld)} KGLD | 💎 ${t("trezor")}: ${fmtAmount(st.trezor)}/2000`,
      `⛏️ Mina: ${st.mine} | ⚔️ Quartel: ${st.barracks} | 🏰 Fortaleza: ${st.stronghold} | 🔮 Torre: ${st.mageTower}`,
      `🎓 Academia: ${st.researchAcademy} | 🌀 Templo: ${st.obscuraTemple}`,
      `⚔️ Defensores: ${st.defendingUnits} | 🚀 Mísseis: ${st.kingdomMissiles} | 🛡️ Barreiras: ${st.antiMissileBarriers}`,
      `🔁 Em ataque: ${st.lockedAttacking} | Raid: ${st.lockedRaiding} | Fortificando: ${st.lockedFortifying}`,
      `📦 Para reivindicar — Tropas: ${st.armyToBeClaimed} | Mísseis: ${st.missilesToBeClaimed} | Barreiras: ${st.amBarriersToBeClaimed}`,
      `🏗️ Construindo: ${st.underConstruction === "none" ? "nada" : st.underConstruction}`,
    ];
    return lines.join("\n");
  }

  async function updateBalances() {
    const walletK = await fetchWalletKgld();
    $("#rk-bal-wallet").innerHTML = `${kgldHtml(16)} Wallet: <b>${fmtAmount(walletK)}</b> KGLD`;
    const st = selectedOwn ? ownStates[selectedOwn.component] : null;
    $("#rk-bal-treasury").innerHTML = `${kgldHtml(16)} ${t("treasury")}: <b>${fmtAmount(st ? st.kgld : 0)}</b>`;
  }

  /* ================================================================
   * Ações
   * ================================================================ */
  function requireOwn() {
    if (!walletConnected || !account) { toast(t("connectWalletFirst"), true); return false; }
    if (!selectedOwn) { toast(t("noKingdomYet"), true); return false; }
    return true;
  }
  function requireTarget() {
    if (!target || !target.nftId) { toast(t("clickTargetFirst"), true); return false; }
    return true;
  }

  async function sendManifest(manifest, label) {
    if (!rdt) { toast(t("sdkNotLoaded"), true); return; }
    if (sendManifest._busy) { toast(t("txInProgress"), true); return; }
    sendManifest._busy = true;
    setStatus(`Enviando: ${label}...`);
    try {
      const res = await rdt.walletApi.sendTransaction({ transactionManifest: manifest, version: 1 });
      const val = unwrapResult(res);
      const status = val ? val.status : "unknown";
      if (status === "CommittedSuccess") {
        toast(`✅ ${label} ${t("txConfirmed")}`);
        setTimeout(refreshAll, 2500);
      } else {
        toast(`⚠️ ${label}: ${status}`, true);
      }
    } catch (e) {
      console.error(`sendManifest error [${label}]:`, e);
      toast(`❌ ${label}: ${e.message}`, true);
    } finally {
      sendManifest._busy = false;
      setStatus(null);
    }
  }

  let modalHandler = null;

  function openModal(title, bodyHtml, onConfirm) {
    const root = $("#rk-modal-root");
    if (modalHandler) root.removeEventListener("click", modalHandler);
    const hasConfirm = typeof onConfirm === "function";
    root.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        ${bodyHtml}
        <div class="modal-actions">
          <button class="btn" data-act="cancel">${hasConfirm ? "Cancelar" : "Fechar"}</button>
          ${hasConfirm ? `<button class="btn gold" data-act="ok">Confirmar</button>` : ""}
        </div>
      </div>`;
    root.classList.add("open");
    modalHandler = (e) => {
      if (e.target === root) { closeModal(); return; }
      if (e.target.closest("[data-act='cancel']")) { closeModal(); return; }
      if (hasConfirm && e.target.closest("[data-act='ok']")) {
        const btn = e.target.closest("[data-act='ok']");
        btn.disabled = true;
        onConfirm(root).then(closeModal).catch(err => {
          console.error("Modal confirm error:", err);
          toast("Erro: " + (err?.message || err), true);
          closeModal();
        });
      }
    };
    root.addEventListener("click", modalHandler);
    return root;
  }

  function closeModal() {
    const root = $("#rk-modal-root");
    if (modalHandler) { root.removeEventListener("click", modalHandler); modalHandler = null; }
    root.classList.remove("open");
    root.innerHTML = "";
  }

  function numberInput(label, def, min) {
    return `<label>${label}</label><input type="number" class="rk-input" min="${min || 1}" value="${def}" step="1">`;
  }

  /* --- Criar Reino --- */
  function openCreateKingdomModal() {
    const pos = pendingCreate || { x: 5, y: 5 };
    openModal(
      "🏗️ Criar novo reino (600 XRD)",
      `<p class="info">Posição escolhida: (${pos.x}, ${pos.y}).</p>
       <label>Posição X</label><input type="number" class="rk-input" id="nk-x" min="0" max="89" value="${pos.x}">
       <label>Posição Y</label><input type="number" class="rk-input" id="nk-y" min="0" max="59" value="${pos.y}">
       <label>Nome do reino</label><input type="text" class="rk-input" id="nk-name" maxlength="40" placeholder="Ex.: Valhalla">`,
      async (root) => {
        const x = parseInt(root.querySelector("#nk-x").value, 10);
        const y = parseInt(root.querySelector("#nk-y").value, 10);
        const name = root.querySelector("#nk-name").value.trim();
        if (isNaN(x) || isNaN(y) || x < 0 || x >= COLS || y < 0 || y >= ROWS) { toast(t("positionInvalid"), true); return; }
        if (!name) { toast(t("kingdomNameRequired"), true); return; }
        const taken = kingdoms.some((k) => k.x === x && k.y === y);
        if (taken) { toast(t("positionTaken"), true); return; }
        pendingCreate = null;
        await sendManifest(M.buy_a_new_kingdom(account, NEW_KINGDOM_COST, x, y, name), "Criar reino");
      }
    );
  }

  function actionCreateKingdom() {
    if (!requireOwn()) return;
    pickCreateMode = true;
    pendingCreate = null;
    console.log("DEBUG: pickCreateMode set to true, calling renderCreateMarker");
    renderCreateMarker();
    toast(t("clickCellToChoose"));
  }

  /* --- Comprar KGLD --- */
  function actionBuyKgld() {
    if (!requireOwn()) return;
    openModal(
      `${kgldHtml(18)} Comprar KGLD`,
      `<p class="info">Troca 1 XRD por 45 KGLD no CoinDispenser.</p>${numberInput("Quantidade de XRD", "10")}`,
      async (root) => {
        const v = parseFloat(root.querySelector(".rk-input").value);
        if (!v || v <= 0) { toast(t("invalidValue"), true); return; }
        await sendManifest(M.buy_kgld(account, v), "Comprar KGLD");
      }
    );
  }

  /* --- Recrutar (1 unidade por quartel por ciclo de 8h) --- */
  async function actionRecruit() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    const max = st ? st.barracks : 0;
    if (!max) { toast(t("requiresBarracks"), true); return; }

    const [kgldUrl, soldier1Url, soldier2Url, soldier3Url, soldier4Url] = await Promise.all([
      rkImg("kgld"),
      rkImg("soldier1"),
      rkImg("soldier2"),
      rkImg("soldier3"),
      rkImg("soldier4"),
    ]);
    const soldierUrls = [soldier1Url, soldier2Url, soldier3Url, soldier4Url].filter(Boolean);
    while (soldierUrls.length < 4) soldierUrls.push("");

    const cardsHtml = Array.from({ length: max }, (_, i) => {
      const n = i + 1;
      const cost = n * 300;
      const imgUrl = soldierUrls[i] || "";
      return `
        <button class="recruit-card" data-n="${n}" style="cursor:pointer;flex:1;min-width:0;background:var(--panel2);border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;min-height:320px;transition:transform .15s,box-shadow .15s;">
          ${imgUrl ? `<img src="${imgUrl}" alt="soldado ${n}" style="width:220px;height:220px;object-fit:contain;">` : `<div style="font-size:96px;">⚔️</div>`}
          <div style="font-size:16px;color:var(--gold2);font-weight:700;">${n} Soldado${n > 1 ? "s" : ""}</div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--txt);">
            ${kgldUrl ? `<img src="${kgldUrl}" alt="KGLD" style="width:18px;height:18px;vertical-align:middle;">` : kgldHtml(16)}
            <span>${cost} KGLD</span>
          </div>
          <div style="font-size:12px;color:var(--dim);">Tempo: 8h</div>
        </button>
      `;
    }).join("");

    openModal(
      "⚔️ Recrutar defensores",
      `<div class="recruit-grid" style="display:flex;gap:16px;margin-top:12px;">${cardsHtml}</div>`,
      async (root) => {
        const selected = root.querySelector(".recruit-card.selected");
        const n = selected ? parseInt(selected.dataset.n, 10) : 1;
        if (!n || n <= 0 || n > max) { toast(`Quantidade inválida (1 a ${max}).`, true); return; }
        await sendManifest(M.create_army_unit(account, selectedOwn.component, n, selectedOwn.nftId), "Recrutar defensores");
      }
    );
    // Modal mais largo para acomodar 4 cards de soldado
    const modEl = $("#rk-modal-root").querySelector(".modal");
    if (modEl) modEl.classList.add("modal-wide");

    // Hover + seleção via addEventListener (CSP-safe)
    const modalRoot = document.getElementById("rk-modal-root");
    modalRoot.querySelectorAll(".recruit-card").forEach(btn => {
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-4px)";
        btn.style.boxShadow = "0 12px 32px rgba(0,0,0,.5)";
      });
      btn.addEventListener("mouseleave", () => {
        if (!btn.classList.contains("selected")) {
          btn.style.transform = "";
          btn.style.boxShadow = "";
        }
      });
      btn.addEventListener("click", () => {
        modalRoot.querySelectorAll(".recruit-card").forEach(b => {
          b.classList.remove("selected");
          b.style.boxShadow = "";
        });
        btn.classList.add("selected");
        btn.style.boxShadow = "0 0 0 3px var(--gold)";
      });
    });
  }

  /* --- Mísseis (requer Torre de Mago) --- */
  function actionMissiles() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (!st || st.mageTower <= 0) { toast(t("requiresMageTower"), true); return; }
    openModal(
      "🚀 Fabricar mísseis",
      `<p class="info">Custo: 2500 KGLD cada.</p>${numberInput("Quantidade de mísseis", "1", 1)}`,
      async (root) => {
        const n = parseInt(root.querySelector(".rk-input").value, 10);
        if (!n || n <= 0) { toast(t("invalidQuantity"), true); return; }
        await sendManifest(M.create_missiles(account, selectedOwn.component, n, selectedOwn.nftId), "Fabricar mísseis");
      }
    );
  }

  /* --- Barreiras (requer Templo Obscura) --- */
  function actionBarriers() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (!st || st.obscuraTemple <= 0) { toast(t("requiresObscuraTemple"), true); return; }
    openModal(
      "🛡️ Fabricar barreiras anti-míssil",
      `<p class="info">Custo: 2500 KGLD cada.</p>${numberInput("Quantidade de barreiras", "1", 1)}`,
      async (root) => {
        const n = parseInt(root.querySelector(".rk-input").value, 10);
        if (!n || n <= 0) { toast(t("invalidQuantity"), true); return; }
        await sendManifest(M.create_barriers(account, selectedOwn.component, n, selectedOwn.nftId), "Fabricar barreiras");
      }
    );
  }

  /* --- Sacar KGLD do tesouro (com taxa em XRD) --- */
  function actionWithdraw() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    const bal = st ? Math.floor(st.kgld) : 0;
    openModal(
      "🏧 Sacar KGLD do tesouro",
      `<p class="info">Saldo no tesouro: ${bal} KGLD. A taxa de saque é paga em XRD.</p>${numberInput("Quantidade de KGLD", "100", 1)}`,
      async (root) => {
        const amt = parseFloat(root.querySelector(".rk-input").value);
        if (!amt || amt <= 0 || amt > bal) { toast(t("invalidAmountMax") + bal + ").", true); return; }
        await sendManifest(M.withdraw_gold(account, selectedOwn.component, WITHDRAW_MAX_FEE, amt, selectedOwn.nftId), "Sacar KGLD");
      }
    );
  }

  /* --- Prospectar --- */
  function actionProspect() {
    if (!requireOwn()) return;
    openModal(
      "⛏️ Prospectar recursos",
      `<p class="info">Custa ${WAR_XRD_COST} XRD e ${PROSPECT_COST_KGLD} KGLD.</p>`,
      async () => { await sendManifest(M.prospect_resources(account, selectedOwn.component, selectedOwn.nftId), "Prospectar recursos"); }
    );
  }

  /* --- Reivindicar mineração --- */
  function actionClaim() {
    if (!requireOwn()) return;
    openModal(
      `${kgldHtml(18)} Reivindicar recompensas de mineração`,
      `<p class="info">Reivindica o KGLD minerado acumulado no seu reino.</p>`,
      async () => { await sendManifest(M.claim_mining_rewards(account, selectedOwn.component, selectedOwn.nftId), "Reivindicar mineração"); }
    );
  }

  /* --- Tesouro --- */
  function actionTreasury() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    const bal = st ? Math.floor(st.kgld) : 0;
    openModal(
      "🏦 Tesouro do reino",
      `<label>Operação</label>
       <select class="rk-input" id="tx-op"><option value="deposit">Depositar KGLD</option><option value="withdraw">Retirar KGLD</option></select>
       <label>Quantidade de KGLD (disponível no tesouro: ${bal})</label>
       <input type="number" class="rk-input" id="tx-amount" min="1" value="10" step="1">`,
      async (root) => {
        const op = root.querySelector("#tx-op").value;
        const amt = parseFloat(root.querySelector("#tx-amount").value);
        if (!amt || amt <= 0) { toast(t("invalidValue"), true); return; }
        if (op === "deposit") {
          await sendManifest(M.deposit_gold(account, selectedOwn.component, amt, selectedOwn.nftId), "Depositar KGLD");
        } else {
          await sendManifest(M.withdraw_gold(account, selectedOwn.component, WITHDRAW_MAX_FEE, amt, selectedOwn.nftId), "Retirar KGLD");
        }
      }
    );
  }

  /* --- Trezor --- */
  async function actionTrezor() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    const cur = st ? Math.floor(st.trezor) : 0;
    const max = 1999;
    const avail = Math.max(0, max - cur);
    const bal = st ? Math.floor(st.kgld) : 0;
    const lastW = st && st.lastTimeWithdrawn ? new Date(st.lastTimeWithdrawn * 1000).toLocaleString("pt-BR") : "—";
    const nowS = Math.floor(Date.now() / 1000);
    const remSecs = (st.lastTimeWithdrawn || 0) + 2419200 - nowS;
    const remFee = remSecs > 0 ? ((remSecs / 2419200) * 500).toFixed(2) : "0.00";
    const unclaimed = st ? Math.floor(st.unclaimedGold || 0) : 0;
    // Total dentro do jogo (Treasury + Unclaimed Mining) - usado em Trezor e Withdraw
    const totalInGame = bal + unclaimed;
    // Busca KGLD na wallet para Deposit
    const walletK = await fetchWalletKgld();
    const walletKInt = Math.floor(walletK);
    const root = openModal(
      "💎 Treasury & Trezor",
      `<div class="tz-panels">
        <div class="tz-panel">
          <h4>${kgldHtml(18)} Deposit KGLD (from wallet)</h4>
          <div class="tk"><span class="tl">Wallet:</span><span class="tv">${walletKInt} KGLD</span></div>
          <p class="info">Send KGLD from your wallet into your kingdom treasury.</p>
          <label>Amount (KGLD) — scroll right to increase</label>
          <div class="tz-scroll-wrap">
            <input type="range" class="tz-scroll tz-wallet-scroll" min="1" max="${Math.max(1, walletKInt)}" value="1" step="1">
            <input type="number" class="rk-input tz-wallet-dep" min="1" max="${walletKInt}" value="1" step="1">
          </div>
          <div class="tz-quick">
            <button class="btn" data-wallet-pct="25">25%</button>
            <button class="btn" data-wallet-pct="50">50%</button>
            <button class="btn" data-wallet-pct="75">75%</button>
            <button class="btn gold" data-wallet-pct="100">MAX (${walletKInt})</button>
          </div>
          <button class="btn gold" id="tz-tdep-btn">Deposit KGLD</button>
        </div>
        <div class="tz-panel">
          <h4>⛏️ Mining</h4>
          <div class="tk"><span class="tl">Treasury:</span><span class="tv">${bal} KGLD</span></div>
          <div class="tk"><span class="tl">Unclaimed:</span><span class="tv" style="color:#ff5050;font-weight:bold;">${unclaimed} KGLD</span></div>
          <div class="tk"><span class="tl">Total in game:</span><span class="tv" style="color:var(--gold2);font-weight:bold;">${totalInGame} KGLD</span></div>
          <p class="info">Claim your mined KGLD into the kingdom treasury.</p>
          <button class="btn gold" id="tz-claim-btn" ${unclaimed <= 0 ? 'style="opacity:.4;cursor:not-allowed;" disabled' : ""}>${kgldHtml(14)} Claim Mining (${unclaimed})</button>
        </div>
        <div class="tz-panel">
          <h4>💎 Trezor</h4>
          <div class="tk"><span class="tl">In Trezor:</span><span class="tv">${cur} / ${max} KGLD</span></div>
          <div class="tk"><span class="tl">Available space:</span><span class="tv">${avail} KGLD</span></div>
          <div class="tk"><span class="tl">From Treasury:</span><span class="tv">${totalInGame} KGLD</span></div>
          <p class="info">Deposits take 24h. Protects KGLD from raids.</p>
          <label>Amount (KGLD) — scroll right to increase</label>
          <div class="tz-scroll-wrap">
            <input type="range" class="tz-scroll tz-trezor-scroll" min="1" max="${Math.max(1, Math.min(avail, totalInGame))}" value="1" step="1">
            <input type="number" class="rk-input tz-trezor-dep" min="1" max="${Math.max(1, Math.min(avail, totalInGame))}" value="1" step="1">
          </div>
          <div class="tz-quick">
            <button class="btn" data-trezor-pct="25">25%</button>
            <button class="btn" data-trezor-pct="50">50%</button>
            <button class="btn" data-trezor-pct="75">75%</button>
            <button class="btn gold" data-trezor-pct="100">MAX</button>
          </div>
          <button class="btn gold" id="tz-trezor-btn">Deposit in Trezor</button>
        </div>
        <div class="tz-panel">
          <h4>💸 Withdraw (to wallet)</h4>
          <div class="tk"><span class="tl">Treasury:</span><span class="tv">${bal} KGLD</span></div>
          <div class="tk"><span class="tl">In Trezor:</span><span class="tv">${cur} KGLD</span></div>
          <div class="tk"><span class="tl">Total withdrawable:</span><span class="tv" style="color:var(--gold2);font-weight:bold;">${bal + cur} KGLD</span></div>
          <div class="tk"><span class="tl">Last withdrawal:</span><span class="tv">${lastW}</span></div>
          <div class="tk"><span class="tl">Remaining Fee:</span><span class="tv">${remFee} XRD</span></div>
          <p class="info">Withdrawal fee is paid in XRD.</p>
          <label>Amount (KGLD) — scroll right to increase</label>
          <div class="tz-scroll-wrap">
            <input type="range" class="tz-scroll tz-wd-scroll" min="1" max="${Math.max(1, bal + cur)}" value="1" step="1">
            <input type="number" class="rk-input tz-wd" min="1" max="${bal + cur}" value="1" step="1">
          </div>
          <div class="tz-quick">
            <button class="btn" data-wd-pct="25">25%</button>
            <button class="btn" data-wd-pct="50">50%</button>
            <button class="btn" data-wd-pct="75">75%</button>
            <button class="btn gold" data-wd-pct="100">MAX (${bal + cur})</button>
          </div>
          <button class="btn gold" id="tz-wd-btn">Withdraw</button>
        </div>
      </div>`
    );
    const modEl = root.querySelector(".modal");
    if (modEl) modEl.classList.add("modal-trezor");

    // Helper para bindar scroll + input + botoes de porcentagem
    const bindScrollGroup = (scrollSel, inputSel, btnAttr, totalFn) => {
      const scrollEl = root.querySelector(scrollSel);
      const inputEl = root.querySelector(inputSel);
      if (scrollEl && inputEl) {
        scrollEl.addEventListener("input", () => { inputEl.value = scrollEl.value; });
        inputEl.addEventListener("input", () => {
          let v = parseInt(inputEl.value, 10) || 1;
          const max = parseInt(scrollEl.max, 10) || 1;
          if (v < 1) v = 1;
          if (v > max) v = max;
          scrollEl.value = v;
        });
      }
      root.querySelectorAll(`[${btnAttr}]`).forEach((btn) => {
        btn.addEventListener("click", () => {
          const pct = parseInt(btn.getAttribute(btnAttr), 10) || 0;
          const total = totalFn();
          const v = Math.max(1, Math.floor(total * pct / 100));
          if (inputEl) inputEl.value = v;
          if (scrollEl) scrollEl.value = v;
        });
      });
    };

    // Bind para Deposit KGLD (wallet)
    bindScrollGroup(".tz-wallet-scroll", ".tz-wallet-dep", "data-wallet-pct", () => walletKInt);
    // Bind para Trezor (max = min(avail, totalInGame))
    bindScrollGroup(".tz-trezor-scroll", ".tz-trezor-dep", "data-trezor-pct", () => Math.min(avail, totalInGame));
    // Bind para Withdraw (max = Treasury + Trezor)
    const totalWithdrawable = bal + cur;
    bindScrollGroup(".tz-wd-scroll", ".tz-wd", "data-wd-pct", () => totalWithdrawable);

    const trezBtn = $("#tz-trezor-btn");
    if (trezBtn) trezBtn.onclick = async () => {
      const n = parseFloat(root.querySelector(".tz-trezor-dep").value);
      const cap = Math.min(avail, totalInGame);
      if (!n || n <= 0 || n > cap) { toast(t("invalidAmountRange") + cap + ").", true); return; }
      await sendManifest(M.deposit_to_trezor(account, selectedOwn.component, n, selectedOwn.nftId), "Deposit in Trezor");
    };
    const tdepBtn = $("#tz-tdep-btn");
    if (tdepBtn) tdepBtn.onclick = async () => {
      const n = parseFloat(root.querySelector(".tz-wallet-dep").value);
      if (!n || n <= 0 || n > walletKInt) { toast(t("invalidAmountMax") + walletKInt + ").", true); return; }
      await sendManifest(M.deposit_gold(account, selectedOwn.component, n, selectedOwn.nftId), "Deposit KGLD");
    };
    const wdBtn = $("#tz-wd-btn");
    if (wdBtn) wdBtn.onclick = async () => {
      const n = parseFloat(root.querySelector(".tz-wd").value);
      if (!n || n <= 0 || n > totalWithdrawable) { toast(t("invalidAmountMax") + totalWithdrawable + ").", true); return; }
      await sendManifest(M.withdraw_gold(account, selectedOwn.component, WITHDRAW_MAX_FEE, n, selectedOwn.nftId), "Withdraw KGLD");
    };
    const claimBtn = $("#tz-claim-btn");
    if (claimBtn) claimBtn.onclick = async () => {
      await sendManifest(M.claim_mining_rewards(account, selectedOwn.component, selectedOwn.nftId), "Claim Mining");
    };
  }

  /* --- Settings Modal --- */
  function openSettingsModal() {
    const root = openModal(
      "⚙️ " + t("settings"),
      `<div class="settings-panel" style="display:flex;flex-direction:column;gap:16px;">
        <div class="setting-item">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="set-auto-refresh" ${autoRefreshEnabled ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--gold);">
            <span>${t("autoRefresh")}</span>
          </label>
        </div>
        <div class="setting-item">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="set-show-lines" ${showLines ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--gold);">
            <span>${t("showLines")}</span>
          </label>
        </div>
        <div class="setting-item">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="set-sound" ${soundEnabled ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--gold);">
            <span>${t("sound")}</span>
          </label>
        </div>
        <div class="setting-item">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="set-show-terrain" ${showTerrain ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--gold);">
            <span>${t("showTerrain")}</span>
          </label>
        </div>
        <div class="setting-item">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="set-castle-emoji" ${useCastleEmoji ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--gold);">
            <span>${t("useCastleEmoji")}</span>
          </label>
        </div>
        <div class="setting-item">
          <label>${t("language")}</label>
          <select id="set-language" class="rk-input" style="width:140px;">
            <option value="pt" ${language === "pt" ? "selected" : ""}>Português</option>
            <option value="en" ${language === "en" ? "selected" : ""}>English</option>
          </select>
        </div>
        <div class="setting-item">
          <label>${t("refreshInterval")}</label>
          <input type="number" class="rk-input" id="set-refresh-interval" min="5" max="300" value="${refreshInterval}" step="5" style="width:100px;">
        </div>
        <div class="setting-item">
          <button class="btn gold" id="set-save">${t("save")}</button>
        </div>
      </div>`,
      async (root) => {
        const autoRefresh = root.querySelector("#set-auto-refresh").checked;
        const lines = root.querySelector("#set-show-lines").checked;
        const sound = root.querySelector("#set-sound").checked;
        const interval = parseInt(root.querySelector("#set-refresh-interval").value, 10);
        const terrain = root.querySelector("#set-show-terrain").checked;
        const emojiCastle = root.querySelector("#set-castle-emoji").checked;
        const lang = root.querySelector("#set-language").value;

        autoRefreshEnabled = autoRefresh;
        showLines = lines;
        soundEnabled = sound;
        refreshInterval = isNaN(interval) ? 30 : Math.max(5, Math.min(300, interval));
        showTerrain = terrain;
        useCastleEmoji = emojiCastle;
        language = lang;

        if (autoRefreshEnabled && !autoRefreshTimer) {
          startAutoRefresh();
        } else if (!autoRefreshEnabled && autoRefreshTimer) {
          clearInterval(autoRefreshTimer);
          autoRefreshTimer = null;
        } else if (autoRefreshTimer) {
          clearInterval(autoRefreshTimer);
          startAutoRefresh();
        }

        // Re-renderiza mapa (terreno) e castelos
        applyTerrain();
        renderMarkers();
        applyI18n(); // Atualiza textos conforme idioma

        // Re-renderiza painéis com textos traduzidos
        if (typeof renderCastle === "function") renderCastle();
        if (typeof updateTargetPanel === "function" && target) updateTargetPanel();
        if (typeof renderBattles === "function") renderBattles();
        if (typeof renderHistory === "function") renderHistory();
        if (typeof renderMyAttacks === "function") renderMyAttacks();

        localStorage.setItem("rk-settings", JSON.stringify({
          autoRefreshEnabled, showLines, soundEnabled, refreshInterval,
          showTerrain, useCastleEmoji, language
        }));

        toast(t("saved"));
      }
    );
  }

  /* --- Reivindicações --- */
  function actionClaimBuild() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (st && (st.underConstruction === "none" || !st.underConstruction)) { toast(t("noBuildToClaim"), true); return; }
    sendManifest(M.claim_building(account, selectedOwn.component, selectedOwn.nftId), "Reivindicar construção");
  }
  function actionClaimArmy() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (st && !(st.armyToBeClaimed > 0)) { toast(t("noArmyToClaim"), true); return; }
    sendManifest(M.claim_army(account, selectedOwn.component, selectedOwn.nftId), "Reivindicar tropas");
  }
  function actionClaimMissiles() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (st && !(st.missilesToBeClaimed > 0)) { toast(t("noMissilesToClaim"), true); return; }
    sendManifest(M.claim_missiles(account, selectedOwn.component, selectedOwn.nftId), "Reivindicar mísseis");
  }
  function actionClaimBarriers() {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    if (st && !(st.amBarriersToBeClaimed > 0)) { toast(t("noBarriersToClaim"), true); return; }
    sendManifest(M.claim_barriers(account, selectedOwn.component, selectedOwn.nftId), "Reivindicar barreiras");
  }
  window.claimFor = async (comp, nftId, type) => {
    if (!requireOwn()) return;
    const manifestMap = {
      army: M.claim_army(account, comp, nftId),
      missile: M.claim_missiles(account, comp, nftId),
      barrier: M.claim_barriers(account, comp, nftId),
      build: M.claim_building(account, comp, nftId),
      gold: M.claim_mining_rewards(account, comp, nftId),
    };
    const labelMap = { army: "tropas", missile: "mísseis", barrier: "barreiras", build: "construção", gold: "mineração" };
    await sendManifest(manifestMap[type], `Reivindicar ${labelMap[type]}`);
  };

  /* --- Ações de guerra --- */
  function warCountModal(title, label, onConfirm) {
    openModal(title, numberInput(label, "1", 1), async (root) => {
      const n = parseInt(root.querySelector(".rk-input").value, 10);
      if (!n || n <= 0) { toast(t("invalidQuantity"), true); return; }
      await onConfirm(n);
    });
  }

  function actionAttack() {
    if (!requireOwn() || !requireTarget()) return;
    warCountModal(`⚔️ Atacar ${target.name}`, "Quantidade de unidades atacantes", (n) =>
      sendManifest(M.attack_another_kingdom(account, selectedOwn.component, target.nftId, n, selectedOwn.nftId), `Atacar ${target.name}`));
  }
  function actionRaid() {
    if (!requireOwn() || !requireTarget()) return;
    openModal(`🏴‍☠️ Raid em ${target.name}`, `<p class="info">Custa ${WAR_XRD_COST} XRD. Rouba KGLD do tesouro alvo.</p>`,
      () => sendManifest(M.raid_another_kingdom(account, selectedOwn.component, target.nftId, selectedOwn.nftId), `Raid em ${target.name}`));
  }
  function actionFortify() {
    if (!requireOwn() || !requireTarget()) return;
    warCountModal(`🛡️ Fortificar ${target.name}`, "Quantidade de unidades de reforço", (n) =>
      sendManifest(M.fortify_another_kingdom(account, selectedOwn.component, target.nftId, n, selectedOwn.nftId), `Fortificar ${target.name}`));
  }
  function actionLaunch() {
    if (!requireOwn() || !requireTarget()) return;
    warCountModal(`🚀 Lançar mísseis em ${target.name}`, "Quantidade de mísseis", (n) =>
      sendManifest(M.fire_missiles_at_kingdom(account, selectedOwn.component, target.nftId, n, selectedOwn.nftId), `Lançar mísseis em ${target.name}`));
  }
  function actionViewBuildings() {
    if (!target || !target.state) { toast(t("kingdomNotLoaded"), true); return; }
    const st = target.state;
    const nowS = Math.floor(Date.now() / 1000);
    const rows = [];
    for (const type of Object.keys(BUILD_NAMES)) {
      const lvl = st[BUILD_COUNT_KEY[type]] || 0;
      const max = BUILD_MAX[type] || 1;
      const row = `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:6px 4px;border-bottom:1px solid var(--line);font-size:12px;">
        <span>${BUILD_NAMES[type]}</span>
        <span style="color:${lvl > 0 ? "var(--gold2)" : "var(--dim)"};font-weight:600;white-space:nowrap;">${lvl > 0 ? `${lvl} / ${max}` : "—"}</span>
      </div>`;
      rows.push(row);
    }
    const uc = st.underConstruction && st.underConstruction !== "none" ? st.underConstruction : null;
    let ucLine = "";
    if (uc) {
      const readyAt = (st.buildingConstructionStart || 0) + (st.buildingConstructionDuration || 0);
      ucLine = `<p class="info">Em construção: ${BUILD_NAMES[uc] || uc}${readyAt > nowS ? ` — <span data-rk-countdown="${readyAt}">pronto em</span>` : " — pronto p/ claim"}</p>`;
    }
    openModal(`🏗️ Edifícios de ${target.name}`, `<div style="display:grid;gap:0;">${rows.join("")}</div>${ucLine}`);
  }

  function bindTargetSearch() {
    const input = $("#rk-target-search");
    const results = $("#rk-target-results");
    if (!input || !results) return;
    const closeResults = () => results.classList.remove("show");
    // Apenas lista resultados, NÃO faz zoom
    const listResults = (query) => {
      const q = (query || "").trim().toLowerCase();
      if (!q) { results.innerHTML = ""; closeResults(); return; }
      const coordsMatch = q.match(/^\s*(\d{1,2})\s*[.,;:\s]\s*(\d{1,2})\s*$/);
      let matches;
      if (coordsMatch) {
        const x = parseInt(coordsMatch[1], 10), y = parseInt(coordsMatch[2], 10);
        matches = kingdoms.filter((k) => k.x === x && k.y === y);
      } else {
        matches = kingdoms.filter((k) => {
          const name = (k.name || "").toLowerCase();
          return name.includes(q);
        });
      }
      if (matches.length === 0) {
        results.innerHTML = `<div class="tr-item" style="justify-content:center;color:var(--dim);">${t("noKingdomFound")}</div>`;
        results.classList.add("show");
        return [];
      }
      results.innerHTML = matches.slice(0, 12).map((k) =>
        `<div class="tr-item" data-nft="${k.nftId}"><span>${k.name || "Reino"}</span><span class="tr-coords">(${k.x},${k.y})</span></div>`
      ).join("");
      results.classList.add("show");
      Array.from(results.querySelectorAll(".tr-item[data-nft]")).forEach((el) => {
        el.addEventListener("click", () => {
          const nft = el.dataset.nft;
          const k = kingdoms.find((x) => x.nftId === nft);
          if (k) selectTargetKingdom(nft, true);
          input.value = el.textContent.trim().replace(/\s+/g, " ");
          results.innerHTML = "";
          closeResults();
        });
      });
      return matches;
    };
    // Ao digitar: só lista, não faz zoom
    input.addEventListener("input", () => listResults(input.value));
    // Ao pressionar Enter: navega para o primeiro resultado (ou match exato)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = (input.value || "").trim().toLowerCase();
        if (!q) return;
        // Procura match exato primeiro
        const exact = kingdoms.find((k) => (k.name || "").toLowerCase() === q);
        if (exact) {
          selectTargetKingdom(exact.nftId, true);
          input.value = (exact.name || "Reino") + ` (${exact.x},${exact.y})`;
          results.innerHTML = "";
          closeResults();
          return;
        }
        // Senão, pega o primeiro resultado da lista visível
        const first = results.querySelector(".tr-item[data-nft]");
        if (first) first.click();
      }
      if (e.key === "Escape") { results.innerHTML = ""; closeResults(); }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#rk-target-search") && !e.target.closest("#rk-target-results")) {
        results.innerHTML = "";
        closeResults();
      }
    });
  }

  function selectTargetKingdom(nftId, withFocus = true) {
    const t = kingdoms.find((k) => k.nftId === nftId);
    if (!t) return;
    target = t;
    const si = $("#rk-target-search");
    if (si) si.value = (t.name || "Reino") + ` (${t.x},${t.y})`;
    // Fetch state for target
    fetchKingdomState(t.component).then((st) => {
      if (st) {
        target.state = st;
        lastTargetState = st;
        updateTargetPanel();
        updateETAs();
      }
    });
    renderMarkers();
    renderLines();
    // Zoom no reino encontrado
    if (withFocus && typeof focusOn === "function") {
      focusOn(t);
    }
  }

  function actionMissileAttack() {
    actionLaunch();
  }

  /* ================================================================
   * Visão do Castelo (gerenciar construções)
   * ================================================================ */
  function openCastle() {
    if (!requireOwn()) return;
    $("#rk-castle").classList.add("open");
    renderCastle();
  }

  function toggleCastle() {
    if ($("#rk-castle").classList.contains("open")) closeCastle();
    else openCastle();
  }

  function closeCastle() {
    $("#rk-castle").classList.remove("open");
  }

  async function renderIsoView() {
    const scene = $("#rk-iso-scene");
    const ground = $("#rk-iso-ground");
    const wrap = $("#rk-iso-buildings");
    if (!scene || !ground || !wrap) return;
    applyBrowserZoomFix();

    const st = selectedOwn ? ownStates[selectedOwn.component] : null;
    wrap.innerHTML = "";
    if (!st) {
      ground.style.backgroundImage = "";
      return;
    }

    const grass = await rkImg("grama");
    if (grass) ground.style.backgroundImage = `url("${grass}")`;

    const entries = [
      { type: "mine", count: st.mine, name: t("mine") },
      { type: "barracks", count: st.barracks, name: t("barracks") },
      { type: "trezor", count: st.trezorCount, name: t("trezor") },
      { type: "stronghold", count: st.stronghold, name: t("stronghold") },
      { type: "mage_tower", count: st.mageTower, name: t("mageTower") },
      { type: "research_academy", count: st.researchAcademy, name: t("researchAcademy") },
      { type: "obscura_temple", count: st.obscuraTemple, name: t("obscuraTemple") },
    ];
    const visible = entries;
    const now = Math.floor(Date.now() / 1000);
    for (const e of visible) {
      const src = await rkImg(e.type);
      const el = document.createElement("div");
      const building = st.underConstruction === e.type;
      const max = BUILD_MAX[e.type];
      const has = e.count > 0;
      el.className = "ikb" + (building ? " building" : "") + (has && e.count >= max ? " max" : "") + (has ? "" : " empty");
      el.title = `${e.name}: ${e.count}/${max}` + (building ? ` (${t("underConstruction")})` : "");
      el.innerHTML = src
        ? `<img src="${src}" alt="${e.name}" draggable="false">`
        : `<div style="font-size:40px;line-height:1">${BUILD_ICONS[e.type]}</div>`;
      // Emoji ⚠️ para edifícios não construídos
      if (!has) {
        el.innerHTML += `<div class="ikb-badge" style="background:rgba(248,81,73,.9);color:#fff;font-size:14px;line-height:1;padding:2px 6px;border-radius:6px;">⚠️</div>`;
        // Clique para construir
        el.style.cursor = "pointer";
        el.onclick = () => actionBuild(e.type);
      }
      if (e.type === "mine" && has) {
        el.innerHTML += `<div class="ikb-badge">${kgldHtml(14)} ${t("unclaimedGold")}: ${fmtAmount(st.unclaimedGold)}</div>`;
      }
      if (e.type === "barracks" && has) {
        const claimable = (st.armyToBeClaimed || 0) > 0 && (st.armyUnitsCompleted || 0) <= now;
        if (claimable) {
          el.innerHTML += `<div class="ikb-badge ready">⚔️ ${st.armyToBeClaimed} ${t("readyToClaim")}</div>`;
        } else if ((st.armyToBeClaimed || 0) > 0 && (st.armyUnitsCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy">⏳ ${st.armyToBeClaimed} Ready in: <span data-rk-countdown="${st.armyUnitsCompleted}">${t("training")}</span></div>`;
        } else if ((st.armyUnitsCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy"><span data-rk-countdown="${st.armyUnitsCompleted}">⏳ ${t("training")}</span></div>`;
        } else {
          el.innerHTML += `<div class="ikb-badge">🛡️ ${fmtAmount(st.defendingUnits)} ${t("defenders")}</div>`;
        }
      }
      if (e.type === "trezor" && has) {
        el.innerHTML += `<div class="ikb-badge">💎 ${fmtAmount(st.trezor)}</div>`;
      }
      if (e.type === "mage_tower" && has) {
        const claimable = (st.missilesToBeClaimed || 0) > 0 && (st.missilesCompleted || 0) <= now;
        if (claimable) {
          el.innerHTML += `<div class="ikb-badge ready">🚀 ${st.missilesToBeClaimed} ${t("readyToClaim")}</div>`;
        } else if ((st.missilesToBeClaimed || 0) > 0 && (st.missilesCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy">🚀 ${st.missilesToBeClaimed} Ready in: <span data-rk-countdown="${st.missilesCompleted}">${t("manufacturingMissiles")}</span></div>`;
        } else if ((st.missilesCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy"><span data-rk-countdown="${st.missilesCompleted}">🚀 ${t("manufacturingMissiles")}</span></div>`;
        } else {
          el.innerHTML += `<div class="ikb-badge">🚀 ${fmtAmount(st.kingdomMissiles)} ${t("missiles")}</div>`;
        }
      }
      if (e.type === "obscura_temple" && has) {
        const claimable = (st.amBarriersToBeClaimed || 0) > 0 && (st.amBarrierCompleted || 0) <= now;
        if (claimable) {
          el.innerHTML += `<div class="ikb-badge ready">🛡️ ${st.amBarriersToBeClaimed} ${t("readyToClaim")}</div>`;
        } else if ((st.amBarriersToBeClaimed || 0) > 0 && (st.amBarrierCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy">🛡️ ${st.amBarriersToBeClaimed} Ready in: <span data-rk-countdown="${st.amBarrierCompleted}">${t("manufacturingBarriers")}</span></div>`;
        } else if ((st.amBarrierCompleted || 0) > now) {
          el.innerHTML += `<div class="ikb-badge busy"><span data-rk-countdown="${st.amBarrierCompleted}">🛡️ ${t("manufacturingBarriers")}</span></div>`;
        } else {
          el.innerHTML += `<div class="ikb-badge">🛡️ ${fmtAmount(st.antiMissileBarriers)} ${t("barriers")}</div>`;
        }
      }
      if (building) {
        const readyAt = (st.buildingConstructionStart || 0) + (st.buildingConstructionDuration || 0);
        if (readyAt > now) {
          el.innerHTML += `<div class="ikb-badge busy"><span data-rk-countdown="${readyAt}">🏗️ ${t("underConstruction")}…</span></div>`;
        } else {
          el.innerHTML += `<div class="ikb-badge ready">🏗️ ${t("readyToClaimShort")}</div>`;
        }
      }
      const tag = document.createElement("div");
      tag.className = "ikb-tag";
      const buildReadyAt = (st.buildingConstructionStart || 0) + (st.buildingConstructionDuration || 0);
      const subtag = building
        ? `⏳ <span data-rk-countdown="${buildReadyAt}">${t("underConstruction")}</span>`
        : (has ? e.count + "/" + max : t("notBuilt"));
      tag.innerHTML = `<b>${e.name}</b><small>${subtag}</small>`;
      el.appendChild(tag);
      const isTraining =
        (e.type === "barracks" && has && (st.armyUnitsCompleted || 0) > now) ||
        (e.type === "mage_tower" && has && (st.missilesCompleted || 0) > now) ||
        (e.type === "obscura_temple" && has && (st.amBarrierCompleted || 0) > now);
      const readyClaim =
        building ||
        (e.type === "mine" && has && (st.unclaimedGold || 0) > 0) ||
        (e.type === "barracks" && has && (st.armyToBeClaimed || 0) > 0 && (st.armyUnitsCompleted || 0) <= now) ||
        (e.type === "mage_tower" && has && (st.missilesToBeClaimed || 0) > 0 && (st.missilesCompleted || 0) <= now) ||
        (e.type === "obscura_temple" && has && (st.amBarriersToBeClaimed || 0) > 0 && (st.amBarrierCompleted || 0) <= now);
      if (readyClaim) {
        el.classList.add("clickable");
        if (building) el.addEventListener("click", () => actionClaimBuild());
        else if (e.type === "mine") el.addEventListener("click", () => actionClaim());
        else if (e.type === "barracks") el.addEventListener("click", () => actionClaimArmy());
        else if (e.type === "mage_tower") el.addEventListener("click", () => actionClaimMissiles());
        else if (e.type === "obscura_temple") el.addEventListener("click", () => actionClaimBarriers());
      } else if (isTraining) {
        el.classList.add("clickable");
        const doneAt = e.type === "barracks" ? st.armyUnitsCompleted : e.type === "mage_tower" ? st.missilesCompleted : st.amBarrierCompleted;
        el.addEventListener("click", () => toast(t("productionInProgress") + new Date(doneAt * 1000).toLocaleTimeString(language === "en" ? "en-US" : "pt-BR"), false));
      } else if (has && !building) {
        // Ocioso: clicar no edifício abre a ação de produção correspondente
        el.classList.add("clickable");
        if (e.type === "barracks") el.addEventListener("click", () => actionRecruit());
        else if (e.type === "mage_tower") el.addEventListener("click", () => actionMissiles());
        else if (e.type === "obscura_temple") el.addEventListener("click", () => actionBarriers());
        else if (e.type === "trezor") el.addEventListener("click", () => actionTrezor());
        else if (e.type === "mine") el.addEventListener("click", () => actionClaim());
      }
      wrap.appendChild(el);
    }
  }

  async function renderCastle() {
    const st = ownStates[selectedOwn.component];
    if (!st) {
      setStatus(`${t("loading")}...`);
      try {
        ownStates[selectedOwn.component] = await fetchKingdomState(selectedOwn.component);
      } catch (e) {
      toast(t("loadKingdomError") + e.message, true);
      } finally { setStatus(null); }
    }
    const s = ownStates[selectedOwn.component];
    if (!s) return;
    const k = kingdoms.find((x) => x.component === selectedOwn.component);
    $("#rk-castle-name-txt").textContent = s.name || selectedOwn.name || "Meu Reino";
    $("#rk-castle-coords").textContent = k ? `(${k.x}, ${k.y})` : "";
    $("#rk-castle-treasury").textContent = fmtAmount(s.kgld);
    $("#rk-castle-trezor").textContent = fmtAmount(s.trezor);
    $("#rk-castle-wealth").textContent = fmtAmount((s.kgld || 0) + (s.trezor || 0) + (s.unclaimedGold || 0));
    $("#rk-castle-reserves").textContent = fmtAmount(s.mineableResources);
    $("#rk-castle-lastclaimed").textContent = s.lastTimeClaimed
      ? new Date(s.lastTimeClaimed * 1000).toLocaleString(language === "en" ? "en-US" : "pt-BR")
      : "—";
    $("#rk-castle-production").textContent = s.mintingRatio
      ? (s.mintingRatio * 3600 * (s.mine || 1)).toFixed(2) + " gold/h"
      : "—";

    $("#prod-defenders-val").textContent = s.defendingUnits;
    $("#prod-missiles-val").textContent = s.kingdomMissiles;
    $("#prod-launched-val").textContent = s.launchedMissiles;
    $("#prod-barriers-val").textContent = s.antiMissileBarriers;

    const nowSec = Math.floor(Date.now() / 1000);
    const reqMage = s.mageTower > 0;
    const reqObscura = s.obscuraTemple > 0;

    // Load construction icon for build button
    const buildIconUrl = await rkImg("construction");
    const buildIconEl = $("#rk-build-icon");
    if (buildIconEl && buildIconUrl) {
      buildIconEl.innerHTML = `<img src="${buildIconUrl}" style="width:20px;height:20px;">`;
    }

    // Emoji ⚠️ para edifícios não construídos
    const defHead = $("#prod-defenders-head");
    defHead.innerHTML = "🛡️ " + t("productionCardDefenders");

    const misHead = $("#prod-missiles-head");
    misHead.innerHTML = "🚀 " + t("productionCardMissiles");

    const lauHead = $("#prod-launched-head");
    lauHead.innerHTML = "💥 " + t("productionCardLaunched");

    const barHead = $("#prod-barriers-head");
    barHead.innerHTML = "🛡️ " + t("productionCardBarriers");

    const dBtn = $("#prod-defenders-btn");
    const mBtn = $("#prod-missiles-btn");
    const bBtn = $("#prod-barriers-btn");

    const armyClaimable = (s.armyToBeClaimed || 0) > 0 && nowSec > (s.armyUnitsCompleted || 0);
    const armyBuilding = (s.armyToBeClaimed || 0) > 0 && (s.armyUnitsCompleted || 0) > nowSec;
    if (armyClaimable) {
      dBtn.innerHTML = `⚔️ ${t("claim")} ${s.armyToBeClaimed}`;
      dBtn.disabled = false;
      dBtn.onclick = actionClaimArmy;
    } else if (armyBuilding) {
      dBtn.innerHTML = `⏳ ${s.armyToBeClaimed} Ready in: <span data-rk-countdown="${s.armyUnitsCompleted}">${t("trainingShort")}</span>`;
      dBtn.disabled = true;
      dBtn.onclick = null;
    } else if ((s.armyUnitsCompleted || 0) > nowSec) {
      dBtn.innerHTML = `⏳ <span data-rk-countdown="${s.armyUnitsCompleted}">${t("trainingShort")}</span>`;
      dBtn.disabled = true;
      dBtn.onclick = null;
    } else {
      dBtn.innerHTML = t("recruit");
      dBtn.disabled = false;
      dBtn.onclick = actionRecruit;
    }

    const missileClaimable = (s.missilesToBeClaimed || 0) > 0 && nowSec > (s.missilesCompleted || 0);
    const missileBuilding = (s.missilesToBeClaimed || 0) > 0 && (s.missilesCompleted || 0) > nowSec;
    if (missileClaimable) {
      mBtn.innerHTML = `🚀 ${t("claim")} ${s.missilesToBeClaimed}`;
      mBtn.disabled = false;
      mBtn.onclick = actionClaimMissiles;
      $("#prod-missiles-req").style.display = "none";
    } else if (missileBuilding) {
      mBtn.innerHTML = `🚀 ${s.missilesToBeClaimed} Ready in: <span data-rk-countdown="${s.missilesCompleted}">${t("manufacturingMissilesShort")}</span>`;
      mBtn.disabled = true;
      mBtn.onclick = null;
      $("#prod-missiles-req").style.display = "none";
    } else if ((s.missilesCompleted || 0) > nowSec) {
      mBtn.innerHTML = `🚀 <span data-rk-countdown="${s.missilesCompleted}">${t("manufacturingMissilesShort")}</span>`;
      mBtn.disabled = true;
      mBtn.onclick = null;
      $("#prod-missiles-req").style.display = "none";
    } else {
      mBtn.disabled = !reqMage;
      mBtn.innerHTML = reqMage ? t("create") : t("blocked");
      mBtn.onclick = actionMissiles;
      $("#prod-missiles-req").style.display = reqMage ? "none" : "";
    }

    const barrierClaimable = (s.amBarriersToBeClaimed || 0) > 0 && nowSec > (s.amBarrierCompleted || 0);
    const barrierBuilding = (s.amBarriersToBeClaimed || 0) > 0 && (s.amBarrierCompleted || 0) > nowSec;
    if (barrierClaimable) {
      bBtn.innerHTML = `🛡️ ${t("claim")} ${s.amBarriersToBeClaimed}`;
      bBtn.disabled = false;
      bBtn.onclick = actionClaimBarriers;
      $("#prod-barriers-req").style.display = "none";
    } else if (barrierBuilding) {
      bBtn.innerHTML = `🛡️ ${s.amBarriersToBeClaimed} Ready in: <span data-rk-countdown="${s.amBarrierCompleted}">${t("manufacturingBarriersShort")}</span>`;
      bBtn.disabled = true;
      bBtn.onclick = null;
      $("#prod-barriers-req").style.display = "none";
    } else if ((s.amBarrierCompleted || 0) > nowSec) {
      bBtn.innerHTML = `🛡️ <span data-rk-countdown="${s.amBarrierCompleted}">${t("manufacturingBarriersShort")}</span>`;
      bBtn.disabled = true;
      bBtn.onclick = null;
      $("#prod-barriers-req").style.display = "none";
    } else {
      bBtn.disabled = !reqObscura;
      bBtn.innerHTML = reqObscura ? t("create") : t("blocked");
      bBtn.onclick = actionBarriers;
      $("#prod-barriers-req").style.display = reqObscura ? "none" : "";
    }

    renderIsoView();
  }

  function actionBuild(preType) {
    if (!requireOwn()) return;
    const st = ownStates[selectedOwn.component];
    const treasury = st ? st.kgld : 0;
    const opts = Object.entries(BUILD_NAMES).map(([type, name]) => {
      const count = st ? st[BUILD_COUNT_KEY[type]] || 0 : 0;
      const max = BUILD_MAX[type];
      const full = count >= max;
      const cost = BUILD_COSTS[type];
      const timeHours = Math.round(BUILD_TIMES[type] / 3600);
      const canAfford = treasury >= cost;
      const icon = BUILD_ICONS[type] || "";
      const sel = preType === type ? " selected" : "";
      const disabled = full || !canAfford;
      const notEnough = !canAfford && !full ? ' <span class="not-enough">(KGLD insuficiente)</span>' : '';
      return `<button class="building-opt${sel}" data-type="${type}"${disabled ? " disabled" : ""}>
        <div class="b-header">
          <span class="b-icon">${icon}</span>
          <span class="b-name">${name}</span>
        </div>
        <div class="b-details">
          <div class="b-count">${count} / ${max}</div>
          <div class="b-time">⏱️ ${timeHours}h</div>
          <div class="b-cost">${kgldHtml(14)} ${cost}${notEnough}</div>
        </div>
      </button>`;
    }).join("");
    const root = openModal(
      "🏗️ Kingdom Structures",
      `<div class="building-grid-detailed">${opts}</div><p class="info">Clique para selecionar, depois confirme. Custo sai do tesouro (${fmtAmount(treasury)} KGLD).</p>`,
      async (ovl) => {
        const sel = ovl.querySelector(".building-opt.selected:not([disabled])");
        const type = sel ? sel.dataset.type : null;
        if (!type) { toast(t("pickBuilding"), true); return; }
        await sendManifest(M.create_building(account, selectedOwn.component, type, selectedOwn.nftId), `Construir ${BUILD_NAMES[type]}`);
      }
    );
    const mbox = root.querySelector(".modal");
    if (mbox) mbox.classList.add("modal-wide");
    root.querySelectorAll(".building-opt:not([disabled])").forEach((b) => {
      b.addEventListener("click", () => {
        root.querySelectorAll(".building-opt").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
      });
    });
  }

  /* ================================================================
   * Carregamento geral + refresh
   * ================================================================ */
  async function loadAll() {
    setStatus(`${t("loading")}...`);
    try {
      kingdoms = await fetchAllKingdoms();
      for (let attempt = 0; kingdoms.length === 0 && attempt < 3; attempt++) {
        await sleep(1500);
        kingdoms = await fetchAllKingdoms();
      }
      console.log("[rk-layout] loadAll usando account:", account);
      // Invalida cache do HoF ao recarregar reinos (pode ter novos reinos)
      hofAllKingdomsStates = {};
      toast(t("fetchingKingdoms") + (account ? account.slice(0, 12) + "..." : "não conectada"), false);
      ownKingdoms = await fetchOwnKingdoms();
      const typeByComp = new Map(ownKingdoms.map((k) => [k.component, k.kingdomType]));
      for (const k of kingdoms) {
        if (typeByComp.has(k.component)) k.kingdomType = typeByComp.get(k.component);
      }
      if (!selectedOwn && ownKingdoms.length) {
        selectedOwn = ownKingdoms[0];
        await selectOwnKingdom(selectedOwn.nftId, true);
      } else if (account && !ownKingdoms.length) {
        toast(t("noKingdomsFound"), false);
      }
      updateKingdomSelect();
      updateCastleKingdomSelect();
      renderMarkers();
      renderLines();
      updateTargetPanel();
      // Pré-carrega estados de todos os reinos próprios para o badge funcionar
      if (ownKingdoms.length > 0) {
        await Promise.all(ownKingdoms.map(async (k) => {
          try {
            if (!ownStates[k.component]) ownStates[k.component] = await fetchKingdomState(k.component);
          } catch (e) { /* ignora */ }
        }));
        renderMyAttacks();
      }
      await updateBalances();
      if (kingdoms.length === 0) toast(t("kingdomsLoadError"), true);
    } catch (e) {
      toast(t("dataLoadError") + e.message, true);
    } finally {
      setStatus(null);
      refreshBattles();
    }
  }

  async function refreshAll() {
    setStatus("Atualizando...");
    try {
      kingdoms = await fetchAllKingdoms();
      ownKingdoms = await fetchOwnKingdoms();
      updateKingdomSelect();
      updateCastleKingdomSelect();
      renderMarkers();
      renderLines();
      if (selectedOwn) {
        // Atualiza estado de TODOS os reinos próprios
        await Promise.all(ownKingdoms.map(async (k) => {
          try {
            ownStates[k.component] = await fetchKingdomState(k.component);
          } catch (e) { /* mantém estado anterior */ }
        }));
        if (target && target.component) {
          const tst = await fetchKingdomState(target.component);
          lastTargetState = tst;
          target.state = tst;
          if (target.nftId !== tst.nftId) target.nftId = tst.nftId;
        }
        if ($("#rk-castle").classList.contains("open")) renderCastle();
      }
      updateTargetPanel();
      renderMyAttacks();
      await updateBalances();
    } catch (e) {
      toast(t("updateError") + e.message, true);
    } finally {
      setStatus(null);
    }
  }

/* ================================================================
   * Bindings + init
   * ================================================================ */
  let autoRefreshTimer = null;
  let autoRefreshing = false;
  function startAutoRefresh() {
    if (!autoRefreshEnabled) return;
    if (autoRefreshTimer) return;
    autoRefreshTimer = setInterval(async () => {
      if (autoRefreshing || !account || !selectedOwn) return;
      autoRefreshing = true;
      try {
        // Atualiza estado de TODOS os reinos próprios em paralelo
        // (necessário para o badge de notificações contar corretamente)
        await Promise.all(ownKingdoms.map(async (k) => {
          try {
            const st = await fetchKingdomState(k.component);
            if (st) ownStates[k.component] = st;
          } catch (e) { /* mantém estado anterior */ }
        }));
        if (target && target.component) {
          const tst = await fetchKingdomState(target.component);
          if (tst) {
            lastTargetState = tst;
            target.state = tst;
            if (target.nftId !== tst.nftId) target.nftId = tst.nftId;
          }
        }
        renderMarkers();
        renderLines();
        updateTargetPanel();
        updateETAs();
        renderMyAttacks();
        await updateBalances();
        if ($("#rk-castle").classList.contains("open")) renderCastle();
      } catch (e) {
        // silencioso: mantém os dados anteriores até o próximo ciclo
      } finally {
        autoRefreshing = false;
      }
    }, refreshInterval * 1000);
  }

  /* --- Hall of Fame --- */
  let hofActiveTab = "defenders";
  let hofAllKingdomsStates = {}; // cache: { component: state } para TODOS os reinos (próprios + inimigos)
  let hofLoadingPromise = null;

  async function loadAllKingdomStates(forceReload = false) {
    // Se já está carregando, retorna a promise em andamento (a menos que forceReload)
    if (hofLoadingPromise && !forceReload) return hofLoadingPromise;

    const allComps = kingdoms.map((k) => k.component);
    const toLoad = forceReload ? allComps : allComps.filter((c) => !hofAllKingdomsStates[c]);

    if (toLoad.length === 0) return;

    const upd = $("#rk-hof-updated");
    const updateProgress = (done, total) => {
      if (upd) upd.textContent = `${t("loading")}... ${done}/${total}`;
    };

    updateProgress(0, toLoad.length);

    hofLoadingPromise = (async () => {
      const CHUNK = 20; // requests paralelos (a site API aguenta; HTTP/2 multiplexa)
      let done = 0;
      for (let i = 0; i < toLoad.length; i += CHUNK) {
        const chunk = toLoad.slice(i, i + CHUNK);
        await Promise.all(chunk.map(async (comp) => {
          try {
            const st = await fetchKingdomState(comp);
            if (st) hofAllKingdomsStates[comp] = st;
          } catch (e) { /* ignora */ }
          done++;
          updateProgress(done, toLoad.length);
        }));
        // Renderiza progressivamente: mostra resultados parciais a cada lote
        renderHofBody();
      }
    })();

    try {
      await hofLoadingPromise;
    } finally {
      hofLoadingPromise = null;
    }
  }

  function renderHofBody() {
    const body = $("#rk-hof-body");
    if (!body) return;

    const ownSet = new Set(ownKingdoms.map((k) => k.component));

    // Coleta dados de TODOS os reinos (próprios + inimigos)
    const rows = kingdoms.map((k) => {
      const st = hofAllKingdomsStates[k.component];
      if (!st) return null;
      const mineable = st.mineableResources || 0;
      const kgld = st.kgld || 0;
      const unclaimedGold = st.unclaimedGold || 0;
      const isOwn = ownSet.has(k.component);

      // Raid Loot = unclaimedGold (quantidade disponível para saque)
      // Para inimigos (kgld = 0), não conseguimos ler o vault - mostra 0 ou usa fallback
      let raidLoot;
      if (!isOwn && kgld === 0) {
        // Inimigo: não temos acesso ao vault - mostra o unclaimedGold como aproximação
        raidLoot = Math.max(0, unclaimedGold);
      } else {
        // Próprio: usa unclaimedGold direto
        raidLoot = Math.max(0, unclaimedGold);
      }

      return {
        component: k.component,
        name: k.name || `Reino #${k.component.slice(-4)}`,
        isOwn: isOwn,
        defenders: st.defendingUnits || 0,
        raidloot: raidLoot,
        treasury: kgld,
      };
    }).filter(Boolean);

    if (rows.length === 0) {
      body.innerHTML = `<div class="hof-empty">${t("hofNoData")}</div>`;
      return;
    }

    // Ordena pela coluna ativa
    const sorted = [...rows].sort((a, b) => b[hofActiveTab] - a[hofActiveTab]);

    const headers = {
      defenders: t("hofDefendersVal"),
      raidloot: kgldHtml(14) + " " + t("hofRaidLootVal"),
      treasury: kgldHtml(14) + " " + t("hofTreasuryVal"),
    };

    const fmtVal = (v, key) => {
      if (key === "defenders") return Math.floor(v).toLocaleString(language === "en" ? "en-US" : "pt-BR");
      return fmtAmount(v);
    };

    const ownCount = sorted.filter((r) => r.isOwn).length;
    const enemyCount = sorted.length - ownCount;

    const html = `
      <div class="hof-summary">
        <span class="hof-sum-own">${ownCount} ${t("hofOwn").toLowerCase()}</span> · 
        <span class="hof-sum-enemy">${enemyCount} ${t("hofEnemy").toLowerCase()}</span> · 
        <span>${sorted.length} ${t("hofTotal")}</span>
      </div>
      <table class="hof-table">
        <thead>
          <tr>
            <th>${t("hofRank")}</th>
            <th>${t("hofType")}</th>
            <th>${t("hofKingdom")}</th>
            <th class="val">${headers[hofActiveTab]}</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((r, i) => `
            <tr class="hof-row ${i === 0 ? 'podium-1' : i === 1 ? 'podium-2' : i === 2 ? 'podium-3' : ''}" data-comp="${r.component}">
              <td class="rank">${i + 1}${i === 0 ? ' 🏆' : ''}</td>
              <td class="type">${r.isOwn ? '<span class="hof-own">' + t("hofOwn") + '</span>' : '<span class="hof-enemy">' + t("hofEnemy") + '</span>'}</td>
              <td>${r.name}</td>
              <td class="val gold">${fmtVal(r[hofActiveTab], hofActiveTab)}${hofActiveTab !== 'defenders' ? ' KGLD' : ''}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;

    body.innerHTML = html;

    // Torna as linhas clicáveis - navega para o reino
    body.querySelectorAll(".hof-row").forEach((row) => {
      row.addEventListener("click", () => {
        const comp = row.dataset.comp;
        const k = kingdoms.find((x) => x.component === comp);
        if (k && typeof focusOn === "function") {
          focusOn(k);
          // Fecha o painel do HoF
          const p = $("#rk-hof-panel");
          if (p) p.classList.add("hidden");
        }
      });
    });
  }

  function openHofModal() {
    const p = $("#rk-hof-panel");
    if (!p) return;

    // Toggle
    if (!p.classList.contains("hidden")) {
      p.classList.add("hidden");
      return;
    }

    p.classList.remove("hidden");
    hofActiveTab = "defenders";
    // Reseta tabs ativas
    document.querySelectorAll(".hof-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === hofActiveTab);
    });

    // Renderiza imediatamente com dados em cache (se houver)
    renderHofBody();

    // Carrega estados de TODOS os reinos em background (próprios + inimigos)
    const upd = $("#rk-hof-updated");
    loadAllKingdomStates().then(() => {
      renderHofBody();
      if (upd) upd.textContent = new Date().toLocaleTimeString(language === "en" ? "en-US" : "pt-BR");
    });
  }

  function bindUI() {
    const safeAdd = (id, event, fn) => { const el = $("#" + id); if (el) el.addEventListener(event, fn); };

    safeAdd("rk-connect", "click", connectWallet);
safeAdd("rk-kingdom", "change", (e) => { if (e.target.value) selectOwnKingdom(e.target.value, false); });
    safeAdd("rk-castle-kingdom", "change", (e) => { if (e.target.value) selectOwnKingdom(e.target.value, true); });
    bindTargetSearch();

    safeAdd("rk-castle-fab", "click", toggleCastle);
    safeAdd("rk-create-kingdom-fab", "click", actionCreateKingdom);
    safeAdd("rk-battles-btn", "click", () => {
      const panel = $("#rk-battles-panel");
      if (!panel) return;
      panel.classList.toggle("hidden");
      if (!panel.classList.contains("hidden")) renderBattles();
    });
    safeAdd("rk-battles-close", "click", () => {
      const panel = $("#rk-battles-panel");
      if (panel) panel.classList.add("hidden");
    });
    safeAdd("rk-history-btn", "click", () => {
      const p = $("#rk-history-panel");
      if (!p) return;
      p.classList.toggle("hidden");
      if (!p.classList.contains("hidden")) {
        // Força recarga do histórico ao abrir
        fetchBattleHistory().then(() => renderHistory());
      }
    });
    safeAdd("rk-history-close", "click", () => {
      const p = $("#rk-history-panel");
      if (p) p.classList.add("hidden");
    });
    safeAdd("rk-history-search", "input", () => renderHistory());
    safeAdd("rk-history-panel", "click", (e) => {
      const btn = e.target.closest(".wh-details");
      if (!btn) return;
      const i = parseInt(btn.dataset.i, 10);
      if (!isNaN(i) && lastFilteredHistory[i]) showBattleDetail(lastFilteredHistory[i]);
    });
    safeAdd("rk-hd-close", "click", () => {
      const p = $("#rk-hd");
      if (p) p.classList.add("hidden");
    });
    safeAdd("rk-myattacks-btn", "click", () => {
      const p = $("#rk-myattacks-panel");
      if (!p) return;
      p.classList.toggle("hidden");
      if (!p.classList.contains("hidden")) {
        ensureOwnStates();
        renderMyAttacks();
      }
    });
    safeAdd("rk-myattacks-close", "click", () => {
      const p = $("#rk-myattacks-panel");
      if (p) p.classList.add("hidden");
    });
    safeAdd("rk-castle-build", "click", () => actionBuild());
    safeAdd("rk-castle-build-btn", "click", () => actionBuild());
    safeAdd("rk-castle-withdraw", "click", actionWithdraw);
    safeAdd("rk-castle-deposit", "click", actionTreasury);
    safeAdd("rk-castle-prospect-btn", "click", actionProspect);
    safeAdd("rk-castle-claim", "click", actionClaim);
    safeAdd("rk-castle-trezor", "click", actionTrezor);
    safeAdd("rk-castle-refresh", "click", async () => {
      setStatus("Atualizando reino...");
      try {
        ownStates[selectedOwn.component] = await fetchKingdomState(selectedOwn.component);
        await renderCastle();
        toast(t("kingdomUpdated"));
      } catch (e) { toast(t("updateError") + e.message, true); } finally { setStatus(null); }
    });
    safeAdd("rk-castle-reload-img", "click", async () => {
      try {
        const urls = await rkScanImages();
        document.documentElement.setAttribute("data-rk-img-urls", JSON.stringify(urls));
        window.__RK_IMG_URLS__ = urls;
        applyTerrain();
        renderMarkers();
        await renderIsoView();
        toast(t("imagesReloaded") + Object.keys(urls).length + ").");
      } catch (e) { toast(t("imageReloadError") + e.message, true); }
    });
    safeAdd("rk-war-attack", "click", actionAttack);
    safeAdd("rk-war-missile", "click", actionLaunch);
    safeAdd("rk-war-raid", "click", actionRaid);
    safeAdd("rk-war-fortify", "click", actionFortify);
    safeAdd("rk-target-view-buildings", "click", actionViewBuildings);
    safeAdd("rk-target-close", "click", hideTargetPanel);
    safeAdd("rk-castle-close", "click", closeCastle);
    safeAdd("rk-trezor-btn", "click", actionTrezor);
    safeAdd("rk-hof-btn", "click", openHofModal);
    safeAdd("rk-hof-close", "click", () => { const p = $("#rk-hof-panel"); if (p) p.classList.add("hidden"); });
    safeAdd("rk-hof-refresh", "click", async () => {
      const upd = $("#rk-hof-updated");
      if (upd) upd.textContent = t("loading") + "...";
      // Força recarga de todos os reinos
      await loadAllKingdomStates(true);
      renderHofBody();
      if (upd) upd.textContent = new Date().toLocaleTimeString(language === "en" ? "en-US" : "pt-BR");
    });
    document.querySelectorAll(".hof-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        hofActiveTab = tab.dataset.tab;
        document.querySelectorAll(".hof-tab").forEach((t) => t.classList.toggle("active", t === tab));
        renderHofBody();
      });
    });
    safeAdd("rk-settings-btn", "click", openSettingsModal);
    safeAdd("rk-build-btn", "click", () => actionBuild());
  }

  async function loadUIImages() {
    try {
      const [globalUrl, batalhaUrl, cartaUrl, pergaminhoUrl, trezor2Url, settingsUrl, hofUrl, buildUrl] = await Promise.all([
        rkImg("Global"),
        rkImg("batalha"),
        rkImg("carta"),
        rkImg("pergaminho"),
        rkImg("trezor2"),
        rkImg("settings"),
        rkImg("hof"),
        rkImg("construction"),
      ]);

      const setIcon = (sel, url, fallback) => {
        const el = $(sel);
        if (el) {
          if (url) el.innerHTML = `<img src="${url}" alt="${fallback}" style="width:48px;height:48px;object-fit:contain;display:block;">`;
        }
      };

      setIcon("#rk-castle-fab .ic", globalUrl, "Global");
      setIcon("#rk-battles-btn .ic", batalhaUrl, "⚔️");
      setIcon("#rk-myattacks-btn .ic", cartaUrl, "✉️");
      setIcon("#rk-history-btn .ic", pergaminhoUrl, "📜");
      setIcon("#rk-trezor-btn .ic", trezor2Url, "💎");
      setIcon("#rk-hof-btn .ic", hofUrl, "🏆");
      setIcon("#rk-settings-btn .ic", settingsUrl, "⚙️");
      setIcon("#rk-build-btn .ic", buildUrl, "🏗️");
    } catch (e) {}
  }

  function init() {
    // Load settings from localStorage
    try {
      const saved = localStorage.getItem("rk-settings");
      if (saved) {
        const s = JSON.parse(saved);
        autoRefreshEnabled = s.autoRefreshEnabled ?? true;
        showLines = s.showLines ?? true;
        soundEnabled = s.soundEnabled ?? false;
        refreshInterval = s.refreshInterval ?? 30;
        showTerrain = s.showTerrain ?? true;
        useCastleEmoji = s.useCastleEmoji ?? false;
        language = s.language ?? "pt";
      }
    } catch (e) {}

    // Aplica i18n aos elementos com data-i18n antes de tudo
    applyI18n();

    // Cada parte é independente: um erro em uma NÃO impede as outras.
    try { bindUI(); } catch (e) { showFatal("UI: " + e.message); }
    initWallet();   // wallet primeiro (restaura sessão, seta account)
    loadAll();      // depois carrega reinos (precisa de account para próprios)
    try { setupMap(); } catch (e) { showFatal("Mapa: " + e.message); }
    applyTerrain();
    applyBrowserZoomFix();
    window.addEventListener("resize", applyBrowserZoomFix);
    loadUIImages();
    startAutoRefresh();
    battleTimer = setInterval(() => refreshBattles(), 30000);
    setInterval(() => { renderBattles(); renderMyAttacks(); renderHistory(); renderLines(); }, 5000);
    setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      let done = false;
      document.querySelectorAll("[data-rk-countdown]").forEach((el) => {
        const at = parseInt(el.dataset.rkCountdown, 10);
        if (!at) return;
        const rem = at - now;
        if (rem <= 0) { el.textContent = "pronto!"; done = true; }
        else el.textContent = fmtCountdown(rem);
      });
      document.querySelectorAll("[data-rk-prog]").forEach((el) => {
        const start = parseInt(el.dataset.rkProg, 10);
        const end = parseInt(el.dataset.rkEnd, 10);
        if (!start || !end || end <= start) return;
        const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        const bar = el.querySelector(".ads-prog");
        if (bar) bar.style.width = pct.toFixed(1) + "%";
      });
      // Quando um countdown zera, busca estado novo e re-renderiza (flip claim)
      if (done && selectedOwn && $("#rk-castle").classList.contains("open")) {
        fetchKingdomState(selectedOwn.component)
          .then((st) => { if (st) ownStates[selectedOwn.component] = st; renderCastle(); })
          .catch(() => {});
      }
    }, 1000);
  }

  function showFatal(msg) {
    try {
      console.error("[rk-layout] " + msg);
      const el = document.createElement("div");
      el.style.cssText = "position:fixed;bottom:70px;left:50%;transform:translateX(-50%);z-index:2147483500;background:#3a0d0d;border:1px solid #f85149;color:#ffb3b0;padding:8px 14px;border-radius:8px;font-size:12px;max-width:90%;";
      el.textContent = "⚠️ " + msg;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 15000);
    } catch (e) {}
  }

  // Inicia depois que TODAS as definições acima existirem (evita erro
  // "Cannot access '$' before initialization" se o body já existir aqui).
  waitBody();
})();
