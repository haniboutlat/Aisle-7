const products = [
  { id: "avocado", name: "Ripe Hass Avocados", brand: "AH · 2 pack", category: "Produce", price: 2.49, emoji: "🥑", bg: "#edf4df", x: 740, y: 230 },
  { id: "bananas", name: "Organic Bananas", brand: "AH · 5–6 ct", category: "Produce", price: 1.79, emoji: "🍌", bg: "#fbf3d9", x: 765, y: 255 },
  { id: "strawberries", name: "Sweet Strawberries", brand: "AH · 1 lb", category: "Produce", price: 4.29, emoji: "🍓", bg: "#f8e9e4", x: 605, y: 400 },
  { id: "spinach", name: "Baby Spinach", brand: "AH · 5 oz", category: "Produce", price: 3.49, emoji: "🥬", bg: "#e7f2e4", x: 640, y: 470 },
  { id: "milk", name: "Whole Milk", brand: "Meadow Gold · 1 gal", category: "Dairy", price: 4.19, emoji: "🥛", bg: "#e8f1f7", x: 1100, y: 820 },
  { id: "eggs", name: "Free Range Large Eggs", brand: "Happy Hen · 12 ct", category: "Dairy", price: 5.49, emoji: "🥚", bg: "#f7eee3", x: 1275, y: 615 },
  { id: "cheddar", name: "Sharp Cheddar", brand: "Tillamook · 8 oz", category: "Dairy", price: 4.79, emoji: "🧀", bg: "#fbf1dc", x: 1120, y: 315 },
  { id: "yogurt", name: "Greek Yogurt", brand: "Oikos · 5.3 oz", category: "Dairy", price: 1.69, emoji: "🥣", bg: "#f2ecf8", x: 970, y: 820 },
  { id: "sourdough", name: "Country Sourdough", brand: "Bakery · Fresh baked", category: "Bakery", price: 5.99, emoji: "🍞", bg: "#f7ecdf", x: 1275, y: 385 },
  { id: "croissant", name: "Butter Croissants", brand: "Bakery · 4 ct", category: "Bakery", price: 4.49, emoji: "🥐", bg: "#f7eee1", x: 1235, y: 495 },
  { id: "coffee", name: "House Blend Coffee", brand: "Stumptown · 12 oz", category: "Pantry", price: 12.99, emoji: "☕", bg: "#eee8e0", x: 1050, y: 690 },
  { id: "pasta", name: "Rigatoni Pasta", brand: "De Cecco · 1 lb", category: "Pantry", price: 2.79, emoji: "🍝", bg: "#f8eddf", x: 985, y: 500 },
  { id: "olive-oil", name: "Extra Virgin Olive Oil", brand: "California Olive Ranch · 500 ml", category: "Pantry", price: 10.49, emoji: "🫒", bg: "#edf2df", x: 1020, y: 550 },
  { id: "tomatoes", name: "San Marzano Tomatoes", brand: "Cento · 28 oz", category: "Pantry", price: 4.29, emoji: "🍅", bg: "#fae9e3", x: 1025, y: 585 },
  { id: "sparkling", name: "Sparkling Water", brand: "LaCroix · 8 pack", category: "Drinks", price: 5.99, emoji: "🫧", bg: "#e7f2f4", x: 690, y: 745 },
  { id: "orange-juice", name: "Fresh Orange Juice", brand: "AH · 52 oz", category: "Drinks", price: 5.49, emoji: "🍊", bg: "#f9eedc", x: 670, y: 475 },
  { id: "granola", name: "Honey Almond Granola", brand: "Nature Valley · 11 oz", category: "Breakfast", price: 5.29, emoji: "🥣", bg: "#f5ecdf", x: 1025, y: 620 },
  { id: "oats", name: "Rolled Oats", brand: "Bob's Red Mill · 32 oz", category: "Breakfast", price: 6.49, emoji: "🌾", bg: "#f3efdf", x: 1080, y: 620 },
  { id: "dark-chocolate", name: "Dark Chocolate Bar", brand: "Tony's · 6 oz", category: "Treats", price: 4.99, emoji: "🍫", bg: "#f2e9e4", x: 680, y: 690 },
  { id: "hummus", name: "Classic Hummus", brand: "Cedar's · 10 oz", category: "Deli", price: 4.49, emoji: "🧆", bg: "#f3eee4", x: 1220, y: 165 },
];

const categories = ["All", "Produce", "Dairy", "Bakery", "Pantry", "Drinks", "More"];
const categoryColor = {
  Produce: "#dcebd4", Dairy: "#dce9ef", Bakery: "#f0e4d4", Pantry: "#ece8d8",
  Drinks: "#dcecef", Breakfast: "#efe9d9", Treats: "#eee1da", Deli: "#eae6dc",
};
const STARTS = [{ x: 305, y: 510 }, { x: 625, y: 145 }];
const CHECKOUT = { x: 445, y: 545 };
const FLOORPLAN_GRID_STEP = 4;
const REFERENCE_MAP_WIDTH = 1536;
const REFERENCE_MAP_HEIGHT = 960;
const FLOORPLAN_BOUNDARY = [
  { x: 595, y: 10 }, { x: 900, y: 294 }, { x: 995, y: 145 }, { x: 1300, y: 145 },
  { x: 1300, y: 528 }, { x: 1325, y: 535 }, { x: 1325, y: 740 }, { x: 1280, y: 844 },
  { x: 680, y: 844 }, { x: 680, y: 950 }, { x: 350, y: 950 }, { x: 350, y: 808 },
  { x: 295, y: 808 }, { x: 295, y: 585 }, { x: 305, y: 585 }, { x: 305, y: 454 },
  { x: 295, y: 454 }, { x: 295, y: 233 }, { x: 375, y: 233 }, { x: 455, y: 310 },
  { x: 500, y: 233 }, { x: 550, y: 68 },
];
const METERS_PER_MAP_UNIT = 0.04;
const WALKING_SPEED_METERS_PER_MINUTE = 75;
const PICKUP_MINUTES_PER_PRODUCT = 0.5;
const state = { selected: new Set(), category: "All", query: "" };
let walkabilityMap;
let entrancePoints;
let checkoutPoint;
const accessPointCache = new Map();
const pathCache = new Map();
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

function isInsideFloorplan(x, y) {
  const referenceX = x * REFERENCE_MAP_WIDTH / walkabilityMap.imageWidth;
  const referenceY = y * REFERENCE_MAP_HEIGHT / walkabilityMap.imageHeight;
  let inside = false;
  for (let index = 0, previous = FLOORPLAN_BOUNDARY.length - 1; index < FLOORPLAN_BOUNDARY.length; previous = index, index += 1) {
    const currentPoint = FLOORPLAN_BOUNDARY[index];
    const previousPoint = FLOORPLAN_BOUNDARY[previous];
    const crosses = (currentPoint.y > referenceY) !== (previousPoint.y > referenceY)
      && referenceX < ((previousPoint.x - currentPoint.x) * (referenceY - currentPoint.y)) / (previousPoint.y - currentPoint.y) + currentPoint.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function buildFloorplanGrid() {
  const image = $(".map-floorplan");
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Unable to create a canvas context for the store floorplan.");
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const width = Math.ceil(canvas.width / FLOORPLAN_GRID_STEP);
  const height = Math.ceil(canvas.height / FLOORPLAN_GRID_STEP);
  const walkable = new Uint8Array(width * height);
  walkabilityMap = { width, height, imageWidth: canvas.width, imageHeight: canvas.height, walkable };
  for (let gridY = 0; gridY < height; gridY += 1) {
    for (let gridX = 0; gridX < width; gridX += 1) {
      const x = Math.floor((gridX + 0.5) * FLOORPLAN_GRID_STEP);
      const y = Math.floor((gridY + 0.5) * FLOORPLAN_GRID_STEP);
      if (!isInsideFloorplan(x, y)) continue;
      const pixel = (y * canvas.width + x) * 4;
      walkable[gridY * width + gridX] = data[pixel] > 232 && data[pixel + 1] > 232 && data[pixel + 2] > 232 ? 1 : 0;
    }
  }
  entrancePoints = STARTS.map(getNearestWalkablePoint);
  checkoutPoint = getNearestWalkablePoint(CHECKOUT);
  const reachable = new Uint8Array(walkable.length);
  const queue = new Int32Array(walkable.length);
  let queueRead = 0;
  let queueWrite = 0;
  [...entrancePoints, checkoutPoint].forEach((point) => {
    if (reachable[point.nodeIndex]) return;
    reachable[point.nodeIndex] = 1;
    queue[queueWrite] = point.nodeIndex;
    queueWrite += 1;
  });
  while (queueRead < queueWrite) {
    const node = queue[queueRead];
    queueRead += 1;
    const x = node % width;
    const y = Math.floor(node / width);
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        if (!offsetX && !offsetY) continue;
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const next = nextY * width + nextX;
        if (!walkable[next] || reachable[next]) continue;
        if (offsetX && offsetY && (!walkable[y * width + nextX] || !walkable[nextY * width + x])) continue;
        reachable[next] = 1;
        queue[queueWrite] = next;
        queueWrite += 1;
      }
    }
  }
  walkabilityMap.walkable = reachable;
  accessPointCache.clear();
  pathCache.clear();
}

function getNearestWalkablePoint(point) {
  if (!walkabilityMap) throw new Error("The store floorplan is not ready for route planning.");
  const { width, height, imageWidth, imageHeight, walkable } = walkabilityMap;
  const centerX = Math.floor(point.x * imageWidth / REFERENCE_MAP_WIDTH / FLOORPLAN_GRID_STEP);
  const centerY = Math.floor(point.y * imageHeight / REFERENCE_MAP_HEIGHT / FLOORPLAN_GRID_STEP);
  for (let radius = 0; radius <= 40; radius += 1) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
        if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) !== radius) continue;
        const gridX = centerX + offsetX;
        const gridY = centerY + offsetY;
        if (gridX < 0 || gridY < 0 || gridX >= width || gridY >= height) continue;
        const index = gridY * width + gridX;
        if (!walkable[index]) continue;
        const distance = offsetX * offsetX + offsetY * offsetY;
        if (distance < nearestDistance) {
          nearestIndex = index;
          nearestDistance = distance;
        }
      }
    }
    if (nearestIndex !== -1) {
      return {
        nodeIndex: nearestIndex,
        x: (nearestIndex % width + 0.5) * FLOORPLAN_GRID_STEP,
        y: (Math.floor(nearestIndex / width) + 0.5) * FLOORPLAN_GRID_STEP,
      };
    }
  }
  throw new Error(`No walkable aisle found near floorplan position ${point.x}, ${point.y}.`);
}

function getAccessOptions(product) {
  if (!accessPointCache.has(product.id)) {
    accessPointCache.set(product.id, getNearestWalkablePoint(product));
  }
  return [accessPointCache.get(product.id)];
}

function findPath(startIndex, endIndex) {
  const { width, height, walkable } = walkabilityMap;
  const totalNodes = width * height;
  const costs = new Float32Array(totalNodes);
  costs.fill(Infinity);
  const previous = new Int32Array(totalNodes);
  previous.fill(-1);
  const closed = new Uint8Array(totalNodes);
  const heapNodes = [];
  const heapCosts = [];
  const heuristic = (index) => {
    const dx = Math.abs(index % width - endIndex % width);
    const dy = Math.abs(Math.floor(index / width) - Math.floor(endIndex / width));
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  };
  const push = (node, cost) => {
    let index = heapNodes.length;
    heapNodes.push(node);
    heapCosts.push(cost);
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heapCosts[parent] <= cost) break;
      heapNodes[index] = heapNodes[parent];
      heapCosts[index] = heapCosts[parent];
      index = parent;
    }
    heapNodes[index] = node;
    heapCosts[index] = cost;
  };
  const pop = () => {
    const node = heapNodes[0];
    const cost = heapCosts[0];
    const lastNode = heapNodes.pop();
    const lastCost = heapCosts.pop();
    if (heapNodes.length) {
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        if (left >= heapNodes.length) break;
        const child = right < heapNodes.length && heapCosts[right] < heapCosts[left] ? right : left;
        if (heapCosts[child] >= lastCost) break;
        heapNodes[index] = heapNodes[child];
        heapCosts[index] = heapCosts[child];
        index = child;
      }
      heapNodes[index] = lastNode;
      heapCosts[index] = lastCost;
    }
    return { node, cost };
  };
  costs[startIndex] = 0;
  push(startIndex, heuristic(startIndex));
  const neighbors = [
    [-1, -1, Math.SQRT2], [0, -1, 1], [1, -1, Math.SQRT2],
    [-1, 0, 1], [1, 0, 1],
    [-1, 1, Math.SQRT2], [0, 1, 1], [1, 1, Math.SQRT2],
  ];

  while (heapNodes.length) {
    const { node, cost } = pop();
    if (closed[node]) continue;
    if (node === endIndex) {
      const points = [];
      for (let current = endIndex; current !== -1; current = previous[current]) {
        points.push({
          x: (current % width + 0.5) * FLOORPLAN_GRID_STEP,
          y: (Math.floor(current / width) + 0.5) * FLOORPLAN_GRID_STEP,
        });
      }
      points.reverse();
      return { points, distance: costs[endIndex] * FLOORPLAN_GRID_STEP };
    }
    closed[node] = 1;
    const x = node % width;
    const y = Math.floor(node / width);
    neighbors.forEach(([offsetX, offsetY, stepCost]) => {
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) return;
      const next = nextY * width + nextX;
      if (!walkable[next] || closed[next]) return;
      if (offsetX && offsetY && (!walkable[y * width + nextX] || !walkable[nextY * width + x])) return;
      const nextCost = costs[node] + stepCost;
      if (nextCost >= costs[next]) return;
      costs[next] = nextCost;
      previous[next] = node;
      push(next, nextCost + heuristic(next));
    });
  }
  throw new Error(`No walkable route connects floorplan grid cells ${startIndex} and ${endIndex}.`);
}

function getWalkingPath(from, to) {
  if (!walkabilityMap) throw new Error("The store floorplan is not ready for route planning.");
  const end = to.isCheckout ? checkoutPoint : to;
  const starts = from.isStart ? entrancePoints : [from];
  let shortest;
  starts.forEach((start) => {
    const cacheKey = `${start.nodeIndex}:${end.nodeIndex}`;
    if (!pathCache.has(cacheKey)) pathCache.set(cacheKey, findPath(start.nodeIndex, end.nodeIndex));
    const candidate = pathCache.get(cacheKey);
    if (!shortest || candidate.distance < shortest.distance) shortest = candidate;
  });
  return shortest;
}

function planRoute(order) {
  if (order.length === 0) return { route: [], walkingPath: [], distance: 0 };

  const layers = [];
  order.forEach((product, index) => {
    const options = getAccessOptions(product);
    const layer = options.map((option) => {
      if (index === 0) {
        return { cost: getWalkingPath({ isStart: true }, option).distance, previous: -1 };
      }
      let best = { cost: Infinity, previous: -1 };
      layers[index - 1].forEach((previous, previousIndex) => {
        const previousStop = { ...order[index - 1], ...getAccessOptions(order[index - 1])[previousIndex] };
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
    const lastStop = { ...order[order.length - 1], ...getAccessOptions(order[order.length - 1])[side] };
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
    ...getAccessOptions(product)[chosenSides[index]],
  }));
  const itinerary = [{ isStart: true }, ...route, { ...CHECKOUT, isCheckout: true }];
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

function getRoute() {
  const remaining = [...state.selected].map((id) => products.find((product) => product.id === id));
  const order = [];
  let current = { isStart: true };
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
  const svg = $("#store-map");
  const pathData = route.length ? routeData.walkingPath.map((point) => `${point.x},${point.y}`).join(" ") : "";
  const stopMarkers = route.map((product, index) => `
    <g class="map-stop" aria-label="Stop ${index + 1}: ${product.name}">
      <circle cx="${product.x}" cy="${product.y}" r="12" fill="#fff" fill-opacity=".92"></circle>
      <circle cx="${product.x}" cy="${product.y}" r="9" fill="#173f6b" stroke="#fff" stroke-width="2"></circle>
      <text x="${product.x}" y="${product.y + 3}" text-anchor="middle" fill="#fff" font-size="8" font-family="DM Sans, sans-serif" font-weight="700">${index + 1}</text>
    </g>`).join("");
  svg.innerHTML = `
    <defs>
      <filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.3" flood-color="#173f6b" flood-opacity=".2"/></filter>
    </defs>
    ${route.length ? `<polyline points="${pathData}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"></polyline><polyline points="${pathData}" fill="none" stroke="#285e90" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round" filter="url(#route-shadow)"></polyline>` : ""}
    ${route.length ? `<circle cx="${routeData.walkingPath[0].x}" cy="${routeData.walkingPath[0].y}" r="10" fill="#fff" stroke="#1688d4" stroke-width="3"/><path d="M${routeData.walkingPath[0].x - 4} ${routeData.walkingPath[0].y}h8m-4-4v8" stroke="#1688d4" stroke-width="1.5"/><circle cx="${checkoutPoint.x}" cy="${checkoutPoint.y}" r="10" fill="#f5eee0" stroke="#c8b991" stroke-width="2"/><path d="M${checkoutPoint.x - 4} ${checkoutPoint.y - 3}h8v6h-8z" fill="none" stroke="#9f8e67" stroke-width="1"/>` : ""}
    ${stopMarkers}
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
const floorplanImage = $(".map-floorplan");
if (floorplanImage.complete && floorplanImage.naturalWidth) {
  buildFloorplanGrid();
} else {
  floorplanImage.addEventListener("load", () => {
    buildFloorplanGrid();
    renderRoute();
  }, { once: true });
  floorplanImage.addEventListener("error", () => {
    console.error("The store floorplan could not be loaded; route planning is unavailable.");
  }, { once: true });
}

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
