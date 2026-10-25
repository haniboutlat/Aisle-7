const products = [
  { id: "avocado", name: "Ripe Hass Avocados", brand: "AH · 2 pack", category: "Produce", price: 2.49, emoji: "🥑", bg: "#edf4df", x: 167, y: 160 },
  { id: "bananas", name: "Organic Bananas", brand: "AH · 5–6 ct", category: "Produce", price: 1.79, emoji: "🍌", bg: "#fbf3d9", x: 167, y: 222 },
  { id: "strawberries", name: "Sweet Strawberries", brand: "AH · 1 lb", category: "Produce", price: 4.29, emoji: "🍓", bg: "#f8e9e4", x: 167, y: 294 },
  { id: "spinach", name: "Baby Spinach", brand: "AH · 5 oz", category: "Produce", price: 3.49, emoji: "🥬", bg: "#e7f2e4", x: 167, y: 353 },
  { id: "milk", name: "Whole Milk", brand: "Meadow Gold · 1 gal", category: "Dairy", price: 4.19, emoji: "🥛", bg: "#e8f1f7", x: 286, y: 176 },
  { id: "eggs", name: "Free Range Large Eggs", brand: "Happy Hen · 12 ct", category: "Dairy", price: 5.49, emoji: "🥚", bg: "#f7eee3", x: 286, y: 239 },
  { id: "cheddar", name: "Sharp Cheddar", brand: "Tillamook · 8 oz", category: "Dairy", price: 4.79, emoji: "🧀", bg: "#fbf1dc", x: 286, y: 312 },
  { id: "yogurt", name: "Greek Yogurt", brand: "Oikos · 5.3 oz", category: "Dairy", price: 1.69, emoji: "🥣", bg: "#f2ecf8", x: 286, y: 365 },
  { id: "sourdough", name: "Country Sourdough", brand: "Bakery · Fresh baked", category: "Bakery", price: 5.99, emoji: "🍞", bg: "#f7ecdf", x: 407, y: 174 },
  { id: "croissant", name: "Butter Croissants", brand: "Bakery · 4 ct", category: "Bakery", price: 4.49, emoji: "🥐", bg: "#f7eee1", x: 407, y: 253 },
  { id: "coffee", name: "House Blend Coffee", brand: "Stumptown · 12 oz", category: "Pantry", price: 12.99, emoji: "☕", bg: "#eee8e0", x: 528, y: 165 },
  { id: "pasta", name: "Rigatoni Pasta", brand: "De Cecco · 1 lb", category: "Pantry", price: 2.79, emoji: "🍝", bg: "#f8eddf", x: 528, y: 225 },
  { id: "olive-oil", name: "Extra Virgin Olive Oil", brand: "California Olive Ranch · 500 ml", category: "Pantry", price: 10.49, emoji: "🫒", bg: "#edf2df", x: 528, y: 292 },
  { id: "tomatoes", name: "San Marzano Tomatoes", brand: "Cento · 28 oz", category: "Pantry", price: 4.29, emoji: "🍅", bg: "#fae9e3", x: 528, y: 358 },
  { id: "sparkling", name: "Sparkling Water", brand: "LaCroix · 8 pack", category: "Drinks", price: 5.99, emoji: "🫧", bg: "#e7f2f4", x: 650, y: 170 },
  { id: "orange-juice", name: "Fresh Orange Juice", brand: "AH · 52 oz", category: "Drinks", price: 5.49, emoji: "🍊", bg: "#f9eedc", x: 650, y: 236 },
  { id: "granola", name: "Honey Almond Granola", brand: "Nature Valley · 11 oz", category: "Breakfast", price: 5.29, emoji: "🥣", bg: "#f5ecdf", x: 650, y: 302 },
  { id: "oats", name: "Rolled Oats", brand: "Bob's Red Mill · 32 oz", category: "Breakfast", price: 6.49, emoji: "🌾", bg: "#f3efdf", x: 650, y: 365 },
  { id: "dark-chocolate", name: "Dark Chocolate Bar", brand: "Tony's · 6 oz", category: "Treats", price: 4.99, emoji: "🍫", bg: "#f2e9e4", x: 407, y: 350 },
  { id: "hummus", name: "Classic Hummus", brand: "Cedar's · 10 oz", category: "Deli", price: 4.49, emoji: "🧆", bg: "#f3eee4", x: 286, y: 152 },
];

const categories = ["All", "Produce", "Dairy", "Bakery", "Pantry", "Drinks", "More"];
const categoryColor = {
  Produce: "#dcebd4", Dairy: "#dce9ef", Bakery: "#f0e4d4", Pantry: "#ece8d8",
  Drinks: "#dcecef", Breakfast: "#efe9d9", Treats: "#eee1da", Deli: "#eae6dc",
};
const START = { x: 82, y: 455 };
const CHECKOUT = { x: 744, y: 60 };
const AISLE_LANES = [60, 179, 298, 419, 540, 661, 744];
const SHELF_CENTERS = [120, 237, 358, 479, 600, 703];
const CROSS_AISLES = [105, 408];
const METERS_PER_MAP_UNIT = 0.075;
const WALKING_SPEED_METERS_PER_MINUTE = 75;
const PICKUP_MINUTES_PER_PRODUCT = 0.5;
const state = { selected: new Set(), category: "All", query: "" };
let activeMobileTab = "shop";
let activeTheme = localStorage.getItem("aisle7-theme") || "light";

const $ = (selector) => document.querySelector(selector);
const money = (amount) => `$${amount.toFixed(2)}`;

function setTheme(theme) {
  activeTheme = theme;
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  $("#theme-label").textContent = isDark ? "Light mode" : "Dark mode";
  $("#theme-toggle").setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  $("#theme-toggle").setAttribute("aria-pressed", String(isDark));
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#141d26" : "#f5f7f4";
  localStorage.setItem("aisle7-theme", theme);
}

function renderCatalog() {
  const query = state.query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = state.category === "All"
      || (state.category === "More" ? ["Breakfast", "Treats", "Deli"].includes(product.category) : product.category === state.category);
    const matchesQuery = !query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  $("#product-list").innerHTML = filtered.map((product) => {
    const isAdded = state.selected.has(product.id);
    return `<article class="product-row">
      <span class="product-emoji" style="--emoji-bg:${categoryColor[product.category]}">${product.emoji}</span>
      <div class="product-info"><p class="product-name">${product.name}</p><p class="product-meta">${product.category} · ${product.brand.split(" · ").at(-1)}</p></div>
      <span class="product-price">${money(product.price)}</span>
      <button class="${isAdded ? "added-button" : "add-button"}" type="button" data-add="${product.id}" aria-label="${isAdded ? `${product.name} added to list` : `Add ${product.name} to list`}" ${isAdded ? "disabled" : ""}>${isAdded ? "✓" : "+"}</button>
    </article>`;
  }).join("");
  $("#no-results").classList.toggle("hidden", filtered.length !== 0);
  $("#catalog-count").textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
  document.querySelectorAll(".category-tab").forEach((tab) => {
    const active = tab.dataset.category === state.category;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
}

function renderCategories() {
  $("#category-tabs").innerHTML = categories.map((category) =>
    `<button class="category-tab${category === state.category ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${category === state.category}">${category}</button>`,
  ).join("");
}

function getAccessOptions(product) {
  const shelfIndex = SHELF_CENTERS.reduce((closest, center, index, centers) =>
    Math.abs(center - product.x) < Math.abs(centers[closest] - product.x) ? index : closest, 0);
  return [AISLE_LANES[shelfIndex], AISLE_LANES[shelfIndex + 1]].map((aisleX) => ({
    x: aisleX,
    y: product.y,
    aisleX,
  }));
}

function getWalkingPath(from, to) {
  const candidates = [];
  const addCandidate = (points) => {
    const compact = points.filter((point, index) =>
      index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
    const distance = compact.slice(1).reduce((sum, point, index) =>
      sum + Math.abs(point.x - compact[index].x) + Math.abs(point.y - compact[index].y), 0);
    candidates.push({ points: compact, distance });
  };

  if (from.isStart) {
    CROSS_AISLES.forEach((crossY) => {
      addCandidate([from, { x: from.x, y: crossY }, { x: to.aisleX, y: crossY }, to]);
    });
  } else if (to.isCheckout) {
    addCandidate([from, { x: from.aisleX, y: CROSS_AISLES[0] }, { x: to.x, y: CROSS_AISLES[0] }, to]);
  } else if (from.aisleX === to.aisleX) {
    addCandidate([from, to]);
  } else {
    CROSS_AISLES.forEach((crossY) => {
      addCandidate([from, { x: from.aisleX, y: crossY }, { x: to.aisleX, y: crossY }, to]);
    });
  }

  return candidates.reduce((shortest, candidate) =>
    candidate.distance < shortest.distance ? candidate : shortest);
}

function planRoute(order) {
  if (order.length === 0) return { route: [], walkingPath: [], distance: 0 };

  const layers = [];
  order.forEach((product, index) => {
    const options = getAccessOptions(product);
    const layer = options.map((option) => {
      if (index === 0) {
        return { cost: getWalkingPath({ ...START, isStart: true }, option).distance, previous: -1 };
      }
      let best = { cost: Infinity, previous: -1 };
      layers[index - 1].forEach((previous, previousIndex) => {
        const previousStop = { ...order[index - 1], aisleX: getAccessOptions(order[index - 1])[previousIndex].aisleX };
        const cost = previous.cost + getWalkingPath(previousStop, option).distance;
        if (cost < best.cost) best = { cost, previous: previousIndex };
      });
      return best;
    });
    layers.push(layer);
  });

  const lastLayer = layers[layers.length - 1];
  let bestEnd = { cost: Infinity, side: -1 };
  lastLayer.forEach((entry, side) => {
    const lastStop = { ...order[order.length - 1], aisleX: getAccessOptions(order[order.length - 1])[side].aisleX };
    const cost = entry.cost + getWalkingPath(lastStop, { ...CHECKOUT, isCheckout: true }).distance;
    if (cost < bestEnd.cost) bestEnd = { cost, side };
  });

  const chosenSides = Array(order.length);
  chosenSides[order.length - 1] = bestEnd.side;
  for (let index = order.length - 1; index > 0; index -= 1) {
    chosenSides[index - 1] = layers[index][chosenSides[index]].previous;
  }
  const route = order.map((product, index) => ({
    ...product,
    aisleX: getAccessOptions(product)[chosenSides[index]].aisleX,
  }));
  const stops = route.map((product) => ({ x: product.aisleX, y: product.y, aisleX: product.aisleX }));
  const itinerary = [{ ...START, isStart: true }, ...stops, { ...CHECKOUT, isCheckout: true }];
  const walkingPath = [];
  for (let index = 1; index < itinerary.length; index += 1) {
    const segment = getWalkingPath(itinerary[index - 1], itinerary[index]).points;
    walkingPath.push(...segment.slice(walkingPath.length ? 1 : 0));
  }
  return {
    route,
    walkingPath,
    distance: bestEnd.cost * METERS_PER_MAP_UNIT,
  };
}

function renderMobileMap(route) {
  const svg = $("#store-map");
  const aisleLabels = ["PRODUCE", "DAIRY", "BAKERY", "PANTRY", "DRINKS", "MORE"];
  const aisleCenters = [120, 237, 358, 479, 600, 703];
  const aisleY = (index) => 112 + index * 77;
  const aisleIndex = (product) => aisleCenters.reduce((closest, center, index) =>
    Math.abs(center - product.x) < Math.abs(aisleCenters[closest] - product.x) ? index : closest, 0);
  const accessPoint = (product) => {
    const row = aisleIndex(product);
    return {
      x: Math.max(83, Math.min(337, 83 + (product.y - 105) * 0.68)),
      y: aisleY(row) + 23,
      corridorY: aisleY(row) + 53,
    };
  };
  const start = { x: 29, y: 610 };
  const checkout = { x: 375, y: 75 };
  const walkingPath = [];
  const addSegment = (points) => {
    const compact = points.filter((point, index) =>
      index === 0 || point.x !== points[index - 1].x || point.y !== points[index - 1].y);
    walkingPath.push(...compact.slice(walkingPath.length ? 1 : 0));
  };

  if (route.length) {
    let current = start;
    route.forEach((product, index) => {
      const access = accessPoint(product);
      if (index === 0) {
        addSegment([current, { x: start.x, y: access.corridorY }, { x: access.x, y: access.corridorY }, { x: access.x, y: access.y }]);
      } else {
        const previous = accessPoint(route[index - 1]);
        addSegment([
          { x: previous.x, y: previous.y },
          { x: previous.x, y: previous.corridorY },
          { x: 375, y: previous.corridorY },
          { x: 375, y: access.corridorY },
          { x: access.x, y: access.corridorY },
          { x: access.x, y: access.y },
        ]);
      }
      current = access;
    });
    const last = accessPoint(route[route.length - 1]);
    addSegment([
      { x: last.x, y: last.y },
      { x: last.x, y: last.corridorY },
      { x: 375, y: last.corridorY },
      checkout,
    ]);
  }

  const aisleRows = aisleLabels.map((label, index) => {
    const y = aisleY(index);
    const number = String(index + 1).padStart(2, "0");
    return `<g>
      <rect x="82" y="${y}" width="274" height="48" rx="8" fill="#edf2f7" stroke="#d9e3ed"/>
      <path d="M173 ${y + 5}v38m91-38v38" stroke="#d9e3ed" stroke-width="1"/>
      <path d="M88 ${y + 24}h262" stroke="#e2e9f0" stroke-dasharray="2 5"/>
      <text x="27" y="${y + 20}" fill="#75879a" font-size="8" font-family="DM Sans, sans-serif" font-weight="700">${number}</text>
      <text x="27" y="${y + 33}" fill="#8291a0" font-size="6.5" font-family="DM Sans, sans-serif" font-weight="600">${label}</text>
    </g>`;
  }).join("");
  const markers = route.map((product, index) => {
    const point = accessPoint(product);
    return `<g class="map-stop" aria-label="Stop ${index + 1}: ${product.name}">
      <circle cx="${point.x}" cy="${point.y}" r="13" fill="#ffffff"/>
      <circle cx="${point.x}" cy="${point.y}" r="10" fill="#173f6b" stroke="#fff" stroke-width="2"/>
      <text x="${point.x}" y="${point.y + 3.3}" text-anchor="middle" fill="#fff" font-size="9" font-family="DM Sans, sans-serif" font-weight="700">${index + 1}</text>
    </g>`;
  }).join("");

  svg.setAttribute("viewBox", "0 0 420 650");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.innerHTML = `
    <defs>
      <pattern id="mobile-floor-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#eef1eb" stroke-width=".7"/></pattern>
      <filter id="mobile-route-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.3" flood-color="#173f6b" flood-opacity=".2"/></filter>
    </defs>
    <rect width="420" height="650" fill="#f8faf7"/>
    <rect x="14" y="18" width="392" height="614" rx="13" fill="#fbfcfa" stroke="#dfe6df" stroke-width="2"/>
    <rect x="23" y="27" width="374" height="596" rx="9" fill="url(#mobile-floor-grid)"/>
    <text x="30" y="53" fill="#728193" font-size="10" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">ALBERT HEIJN · KIEL</text>
    <text x="30" y="72" fill="#9aa6b1" font-size="7" font-family="DM Sans, sans-serif" font-weight="600" letter-spacing=".7">STORE AISLES</text>
    <rect x="365" y="87" width="19" height="478" rx="8" fill="#f0f4f7" stroke="#e1e8ee"/>
    <text x="374" y="330" text-anchor="middle" transform="rotate(-90 374 330)" fill="#98a5b1" font-size="7" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">MAIN WALKWAY</text>
    ${aisleRows}
    <g aria-label="Checkout counters">
      <text x="337" y="38" text-anchor="middle" fill="#8f8264" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing=".8">CHECKOUT</text>
      <rect x="309" y="45" width="57" height="22" rx="5" fill="#f3eee2" stroke="#e7dfcb"/>
      <rect x="315" y="50" width="20" height="12" rx="2" fill="#e8dfcb"/>
      <rect x="340" y="50" width="20" height="12" rx="2" fill="#e8dfcb"/>
    </g>
    <g aria-label="Store entrance">
      <path d="M22 610h36" stroke="#7894b0" stroke-width="2"/>
      <path d="m36 602-8 8 8 8" fill="none" stroke="#7894b0" stroke-width="1.8"/>
      <text x="72" y="613" fill="#859287" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing=".8">ENTRANCE</text>
    </g>
    ${route.length ? `<polyline points="${walkingPath.map((point) => `${point.x},${point.y}`).join(" ")}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${walkingPath.map((point) => `${point.x},${point.y}`).join(" ")}" fill="none" stroke="#285e90" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round" filter="url(#mobile-route-shadow)"/>` : ""}
    ${route.length ? `<circle cx="${start.x}" cy="${start.y}" r="9" fill="#fff" stroke="#7894b0" stroke-width="2"/><path d="M${start.x} ${start.y - 4}v8m-3-4h6" stroke="#496d91" stroke-width="1.5"/><circle cx="${checkout.x}" cy="${checkout.y}" r="10" fill="#f5eee0" stroke="#c8b991" stroke-width="2"/><path d="M${checkout.x - 4} ${checkout.y - 3}h8v6h-8z" fill="none" stroke="#9f8e67" stroke-width="1"/>` : ""}
    ${markers}
  `;
}

function getRoute() {
  const remaining = [...state.selected].map((id) => products.find((product) => product.id === id));
  const order = [];
  let current = { ...START, isStart: true };
  while (remaining.length) {
    let nearestIndex = 0;
    let nearestOption;
    let nearestDistance = Infinity;
    remaining.forEach((product, index) => {
      getAccessOptions(product).forEach((option) => {
        const distance = getWalkingPath(current, option).distance;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
          nearestOption = option;
        }
      });
    });
    const [next] = remaining.splice(nearestIndex, 1);
    order.push(next);
    current = { ...nearestOption };
  }

  let plan = planRoute(order);
  let improved = true;
  while (improved) {
    improved = false;
    for (let start = 0; start < order.length - 1; start += 1) {
      for (let end = start + 1; end < order.length; end += 1) {
        const candidateOrder = [
          ...order.slice(0, start),
          ...order.slice(start, end + 1).reverse(),
          ...order.slice(end + 1),
        ];
        const candidatePlan = planRoute(candidateOrder);
        if (candidatePlan.distance + 0.01 < plan.distance) {
          order.splice(0, order.length, ...candidateOrder);
          plan = candidatePlan;
          improved = true;
        }
      }
    }
  }
  return plan;
}

function renderMap(routeData) {
  const { route } = routeData;
  if (window.matchMedia("(max-width: 760px)").matches) {
    renderMobileMap(route);
    return;
  }
  $("#store-map").setAttribute("viewBox", "0 0 800 510");
  $("#store-map").setAttribute("preserveAspectRatio", "none");
  const pathData = route.length ? routeData.walkingPath.map((point) => `${point.x},${point.y}`).join(" ") : "";
  const stopMarkers = route.map((product, index) => `
    <g class="map-stop" aria-label="Stop ${index + 1}: ${product.name}">
      <circle cx="${product.aisleX}" cy="${product.y}" r="8.5" fill="#173f6b" stroke="#fff" stroke-width="2"></circle>
      <text x="${product.aisleX}" y="${product.y + 2.8}" text-anchor="middle" fill="#fff" font-size="7.5" font-family="DM Sans, sans-serif" font-weight="700">${index + 1}</text>
    </g>`).join("");
  $("#store-map").innerHTML = `
    <defs>
      <pattern id="floor-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M 22 0 L 0 0 0 22" fill="none" stroke="#eef1eb" stroke-width=".7"/></pattern>
      <filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.3" flood-color="#173f6b" flood-opacity=".2"/></filter>
    </defs>
    <rect width="800" height="510" fill="#f8faf7"/>
    <rect x="28" y="28" width="744" height="447" rx="13" fill="#fbfcfa" stroke="#dfe6df" stroke-width="2"/>
    <rect x="39" y="39" width="722" height="425" rx="9" fill="url(#floor-grid)"/>
    <text x="55" y="64" fill="#94a097" font-size="9" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1.5">ALBERT HEIJN · KIEL</text>
    <text x="77" y="94" fill="#a0aaa1" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">FRESH PRODUCE</text>
    <text x="210" y="94" fill="#a0aaa1" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">DAIRY & DELI</text>
    <text x="352" y="94" fill="#a0aaa1" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">BAKERY & TREATS</text>
    <text x="489" y="94" fill="#a0aaa1" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">PANTRY</text>
    <text x="621" y="94" fill="#a0aaa1" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">DRINKS & MORE</text>
    <g fill="#edf2f7" stroke="#d9e3ed" stroke-width="1">
      <rect x="71" y="113" width="99" height="287" rx="8"/>
      <rect x="188" y="113" width="99" height="287" rx="8"/>
      <rect x="309" y="113" width="99" height="287" rx="8"/>
      <rect x="430" y="113" width="99" height="287" rx="8"/>
      <rect x="551" y="113" width="99" height="287" rx="8"/>
      <rect x="672" y="113" width="62" height="287" rx="8"/>
    </g>
    <g fill="#f0f5fa"><rect x="48" y="100" width="704" height="11" rx="4"/><rect x="48" y="401" width="704" height="12" rx="4"/></g>
    <g stroke="#d9e3ed" stroke-width="1">
      <path d="M78 194h85 M78 260h85 M78 326h85 M195 194h85 M195 260h85 M195 326h85 M316 194h85 M316 260h85 M316 326h85 M437 194h85 M437 260h85 M437 326h85 M558 194h85 M558 260h85 M558 326h85 M678 194h50 M678 260h50 M678 326h50"/>
      <path d="M121 116v280 M238 116v280 M359 116v280 M480 116v280 M601 116v280 M703 116v280" stroke="#e2e9f0" stroke-dasharray="2 5"/>
    </g>
    <g fill="#a4b69a" font-family="DM Sans, sans-serif" font-size="7" font-weight="600" text-anchor="middle">
      <text x="121" y="421">01 · PRODUCE</text><text x="238" y="421">02 · DAIRY</text>
      <text x="359" y="421">03 · BAKERY</text><text x="480" y="421">04 · PANTRY</text>
      <text x="601" y="421">05 · DRINKS</text><text x="703" y="421">06 · MORE</text>
    </g>
    <g aria-label="Checkout counters">
      <rect x="677" y="39" width="80" height="35" rx="5" fill="#f3eee2" stroke="#e7dfcb"/>
      <rect x="686" y="46" width="28" height="20" rx="3" fill="#e8dfcb"/><rect x="719" y="46" width="28" height="20" rx="3" fill="#e8dfcb"/>
      <text x="717" y="35" text-anchor="middle" fill="#9a9077" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">CHECKOUT</text>
    </g>
    <g aria-label="Store entrance">
      <path d="M58 475h48" stroke="#fbfcfa" stroke-width="6"/>
      <path d="M58 475h48" stroke="#7894b0" stroke-width="2"/>
      <path d="M75 467l-7 8 7 8" fill="none" stroke="#7894b0" stroke-width="1.5"/>
      <text x="82" y="493" text-anchor="middle" fill="#859287" font-size="8" font-family="DM Sans, sans-serif" font-weight="700" letter-spacing="1">ENTRANCE</text>
    </g>
    ${route.length ? `<polyline points="${pathData}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"></polyline><polyline points="${pathData}" fill="none" stroke="#285e90" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round" filter="url(#route-shadow)"></polyline>` : ""}
    ${route.length ? `<circle cx="${START.x}" cy="${START.y}" r="9" fill="#fff" stroke="#7894b0" stroke-width="2"/><path d="M${START.x} ${START.y - 4}v8m-3-4h6" stroke="#496d91" stroke-width="1.5"/><circle cx="${CHECKOUT.x}" cy="${CHECKOUT.y}" r="10" fill="#f5eee0" stroke="#c8b991" stroke-width="2"/><path d="M${CHECKOUT.x - 4} ${CHECKOUT.y - 3}h8v6h-8z" fill="none" stroke="#9f8e67" stroke-width="1"/>` : ""}
    ${stopMarkers}
    ${route.length ? `<g><rect x="95" y="438" width="56" height="18" rx="5" fill="#fff" stroke="#e0e7ee"/><text x="123" y="450" text-anchor="middle" fill="#496d91" font-size="8" font-family="DM Sans, sans-serif" font-weight="700">START</text></g>` : ""}
  `;
}

function renderList() {
  const selected = products.filter((product) => state.selected.has(product.id));
  $("#list-count").textContent = selected.length;
  $("#stop-stat").textContent = selected.length;
  $("#mobile-list-count").textContent = selected.length;
  $("#mobile-list-count").classList.toggle("hidden", selected.length === 0);
  $("#shopping-items").innerHTML = selected.map((product) => `
    <div class="list-item">
      <span class="product-emoji" style="--emoji-bg:${categoryColor[product.category]}">${product.emoji}</span>
      <div class="product-info"><p class="product-name">${product.name}</p><p class="product-meta">${product.category}</p></div>
      <span class="product-price">${money(product.price)}</span>
      <button class="remove-button" type="button" data-remove="${product.id}" aria-label="Remove ${product.name} from list">×</button>
    </div>`).join("");
  $("#empty-list").classList.toggle("hidden", selected.length > 0);
  $("#shopping-items").classList.toggle("hidden", selected.length === 0);
  $("#clear-list").classList.toggle("hidden", selected.length === 0);
  const total = selected.reduce((sum, product) => sum + product.price, 0);
  $("#list-total").classList.toggle("hidden", selected.length === 0);
  $("#list-total").innerHTML = `<span>Estimated basket total</span><strong>${money(total)}</strong>`;
}

function renderRoute() {
  const routeData = getRoute();
  const { route, distance } = routeData;
  $("#distance-stat").textContent = route.length ? `${distance.toFixed(1)} m` : "—";
  const tripMinutes = Math.ceil(distance / WALKING_SPEED_METERS_PER_MINUTE + route.length * PICKUP_MINUTES_PER_PRODUCT);
  $("#time-stat").textContent = route.length ? `${tripMinutes} min` : "—";
  $("#route-stop-label").textContent = `· ${route.length} ${route.length === 1 ? "stop" : "stops"}`;
  $("#route-badge").textContent = route.length ? "Optimized for you" : "Add items to begin";
  $("#route-badge").classList.toggle("ready", route.length > 0);
  $("#route-stops").innerHTML = route.map((product, index) => `
    <div class="route-stop"><span class="stop-number">${String(index + 1).padStart(2, "0")}</span><span class="route-stop-copy"><strong>${product.name}</strong><small>${product.category}</small></span></div>`).join("");
  $("#route-empty").classList.toggle("hidden", route.length > 0);
  $("#route-stops").classList.toggle("hidden", route.length === 0);
  $("#route-footer").classList.toggle("hidden", route.length === 0);
  renderMap(routeData);
}

function renderAll() {
  renderCatalog();
  renderList();
  renderRoute();
}

function setMobileTab(tab, scrollToTop = true) {
  activeMobileTab = tab;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  document.body.classList.toggle("mobile-route", isMobile && tab === "route");
  document.querySelectorAll(".mobile-tab-panel").forEach((panel) => {
    const isActive = panel.dataset.mobileTab === tab;
    panel.classList.toggle("mobile-panel-inactive", isMobile && !isActive);
    panel.setAttribute("aria-hidden", String(isMobile && !isActive));
  });
  document.querySelectorAll(".mobile-tab").forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  if (isMobile && scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

renderCategories();
renderAll();
setMobileTab(activeMobileTab, false);
setTheme(activeTheme);

$("#category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCatalog();
});
$("#product-search").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderCatalog();
});
$("#product-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  state.selected.add(button.dataset.add);
  renderAll();
});
$("#shopping-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  state.selected.delete(button.dataset.remove);
  renderAll();
});
$("#clear-list").addEventListener("click", () => {
  state.selected.clear();
  renderAll();
});
$("#add-list-items").addEventListener("click", () => {
  setMobileTab("shop");
  window.requestAnimationFrame(() => $("#product-search").focus({ preventScroll: true }));
});
$("#mobile-tabbar").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) setMobileTab(tab.dataset.tab);
});
$("#mobile-tabbar").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...document.querySelectorAll(".mobile-tab")];
  const currentIndex = tabs.findIndex((tab) => tab.dataset.tab === activeMobileTab);
  const offset = event.key === "ArrowRight" ? 1 : -1;
  const nextTab = tabs[(currentIndex + offset + tabs.length) % tabs.length];
  setMobileTab(nextTab.dataset.tab, false);
  nextTab.focus();
});
window.addEventListener("resize", () => {
  setMobileTab(activeMobileTab, false);
  renderRoute();
});
$("#theme-toggle").addEventListener("click", () => {
  setTheme(activeTheme === "dark" ? "light" : "dark");
});
$("#store-picker-trigger").addEventListener("click", () => {
  const trigger = $("#store-picker-trigger");
  const isExpanded = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", String(!isExpanded));
  $("#store-options").classList.toggle("hidden", isExpanded);
});
$("#store-option-ah-kiel").addEventListener("click", () => {
  $("#store-picker-trigger").setAttribute("aria-expanded", "false");
  $("#store-options").classList.add("hidden");
  $("#store-picker-trigger").focus();
});
document.addEventListener("click", (event) => {
  if (event.target.closest(".store-picker")) return;
  $("#store-picker-trigger").setAttribute("aria-expanded", "false");
  $("#store-options").classList.add("hidden");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("#store-picker-trigger").getAttribute("aria-expanded") === "true") {
    $("#store-picker-trigger").setAttribute("aria-expanded", "false");
    $("#store-options").classList.add("hidden");
    $("#store-picker-trigger").focus();
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    $("#product-search").focus();
  }
});

let cameraStream;
let scanInterval;
let isDetecting = false;

function stopScanner() {
  window.clearInterval(scanInterval);
  scanInterval = undefined;
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = undefined;
  }
  $("#qr-video").srcObject = null;
  $("#camera-placeholder").classList.remove("hidden");
  $("#start-camera").disabled = false;
  document.body.classList.remove("scanner-open");
}

function closeScanner() {
  stopScanner();
  $("#scanner-modal").classList.add("hidden");
}

function enterStore() {
  closeScanner();
  $("#store-entry").classList.add("hidden");
  $("#planner-app").classList.remove("hidden");
  $("#planner-header").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openScanner() {
  $("#scanner-modal").classList.remove("hidden");
  document.body.classList.add("scanner-open");
  $("#scanner-message").textContent = "Allow camera access to scan the store QR code.";
  $("#start-camera").textContent = "Allow camera & scan";
  $("#start-camera").disabled = false;
  $("#start-camera").classList.remove("hidden");
  $("#camera-placeholder").classList.remove("hidden");
  $("#close-scanner").focus();
}

async function startQrScan() {
  const message = $("#scanner-message");
  if (!("BarcodeDetector" in window)) {
    message.textContent = "QR scanning is not supported by this browser. Choose Albert Heijn Kiel to continue.";
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    message.textContent = "Camera access is unavailable. Choose Albert Heijn Kiel to continue.";
    return;
  }

  const button = $("#start-camera");
  button.disabled = true;
  message.textContent = "Requesting camera access…";
  try {
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "environment" } },
    });
    const video = $("#qr-video");
    video.srcObject = cameraStream;
    await video.play();
    $("#camera-placeholder").classList.add("hidden");
    message.textContent = "Point your camera at the Albert Heijn Kiel store QR code.";
    button.textContent = "Scanning…";

    scanInterval = window.setInterval(async () => {
      if (isDetecting || !cameraStream) return;
      isDetecting = true;
      try {
        const codes = await detector.detect(video);
        if (codes.length) {
          const value = codes[0].rawValue.toLowerCase();
          if (value.includes("ah-kiel") || value.includes("ah kiel")
            || value.includes("albert heijn kiel") || value.includes("sint-bernardsesteenweg 143")) {
            enterStore();
          } else {
            message.textContent = "That QR code isn’t for this demo store. Scan the AH Kiel code or choose the store below.";
          }
        }
      } catch (error) {
        stopScanner();
        message.textContent = `Could not read the QR code: ${error.message}`;
      } finally {
        isDetecting = false;
      }
    }, 400);
  } catch (error) {
    stopScanner();
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      message.textContent = "Camera permission was denied. Choose Albert Heijn Kiel below, or allow camera access in your browser settings.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      message.textContent = "No camera was found on this device. Choose Albert Heijn Kiel below.";
    } else {
      message.textContent = `Camera could not start: ${error.message}`;
    }
  }
}

$("#choose-store").addEventListener("click", enterStore);
$("#open-scanner").addEventListener("click", openScanner);
$("#scanner-choose-store").addEventListener("click", enterStore);
$("#start-camera").addEventListener("click", startQrScan);
$("#close-scanner").addEventListener("click", closeScanner);
$("#scanner-modal").addEventListener("click", (event) => {
  if (event.target === $("#scanner-modal")) closeScanner();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#scanner-modal").classList.contains("hidden")) closeScanner();
});
