import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ——— Config ———
const DEFAULT_CENTER = [12.9716, 77.5946];
const DEFAULT_ZOOM = 14;
const MIN_ZOOM = 11;
const MAP_MIN_HEIGHT = 520;

const TILES = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
};

const ROUTE_COLOR = "#2563eb";
const ROUTE_WEIGHT = 5;
const ROUTE_OPACITY = 0.9;
const FIT_ROUTE_MIN_ZOOM = 14;
const FIT_ROUTE_PADDING = [60, 60];

function getPhase(status, stepLabel) {
  const s = (status || "").toLowerCase();
  const step = (stepLabel || "").toLowerCase();
  if (s === "delivered") return "delivery";
  if (s === "shipped" || step.includes("out for delivery")) return "rider";
  return "shop";
}

function getPhaseLabel(phase) {
  switch (phase) {
    case "shop":
      return "At store";
    case "rider":
      return "On the way";
    case "delivery":
      return "Delivered";
    default:
      return "Current location";
  }
}

function formatDistance(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

async function geocodeQuery(q) {
  const s = (q || "").trim();
  if (!s) return null;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(s)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "BloomFlowerApp/1.0" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]) return null;
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  return Number.isNaN(lat) || Number.isNaN(lng) ? null : { lat, lng };
}

async function geocodeAddress(addr) {
  const parts = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean);
  return parts.length ? geocodeQuery(parts.join(", ")) : null;
}

async function fetchRoute(from, to) {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const coordsGeo = data?.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coordsGeo) || coordsGeo.length === 0) return null;
    return coordsGeo.map((c) => [c[1], c[0]]);
  } catch {
    return null;
  }
}

function markerHtml(type) {
  const colors = {
    shop: "#7C3AED",
    rider: "#DB2777",
    delivery: "#0D9488",
  };
  const color = colors[type];
  const icons = {
    shop: '<path d="M2 7l4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',
    rider:
      '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="4" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>',
    delivery:
      '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  };
  return `
    <div style="
      width:44px;height:44px;
      background:${color};
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 4px 14px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${icons[type]}
      </svg>
    </div>
  `;
}

export function TrackingMap({
  riderLat,
  riderLng,
  status = "",
  currentStepLabel = "",
  shopAddress,
  shopLat,
  shopLng,
  deliveryAddress,
  deliveryLat,
  deliveryLng,
  className = "",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const shopMarkerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const lineRef = useRef(null);

  const [shopCoords, setShopCoords] = useState(() =>
    shopLat != null && shopLng != null
      ? { lat: Number(shopLat), lng: Number(shopLng) }
      : null,
  );
  const [deliveryCoords, setDeliveryCoords] = useState(() =>
    deliveryLat != null && deliveryLng != null
      ? { lat: Number(deliveryLat), lng: Number(deliveryLng) }
      : null,
  );
  const [distanceM, setDistanceM] = useState(null);
  const [routePoints, setRoutePoints] = useState(null);

  const hasRider =
    riderLat != null &&
    riderLng != null &&
    !Number.isNaN(riderLat) &&
    !Number.isNaN(riderLng);
  const phase = getPhase(status, currentStepLabel);
  const showMap = hasRider || phase === "rider" || phase === "delivery";

  useEffect(() => {
    if (deliveryCoords) return;
    if (
      !deliveryAddress ||
      (!hasRider && phase !== "rider" && phase !== "delivery")
    )
      return;
    const parts = [
      deliveryAddress.street,
      deliveryAddress.city,
      deliveryAddress.state,
      deliveryAddress.zip,
    ].filter(Boolean);
    if (!parts.length) return;
    let cancelled = false;
    const timeout = setTimeout(() => {
      geocodeAddress(deliveryAddress).then((co) => {
        if (!cancelled && co) setDeliveryCoords(co);
      });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [deliveryAddress, hasRider, phase, deliveryCoords]);

  useEffect(() => {
    if (deliveryLat != null && deliveryLng != null)
      setDeliveryCoords({ lat: Number(deliveryLat), lng: Number(deliveryLng) });
  }, [deliveryLat, deliveryLng]);

  useEffect(() => {
    if (shopCoords || (shopLat != null && shopLng != null)) return;
    if (
      !shopAddress ||
      (!hasRider && phase !== "rider" && phase !== "delivery")
    )
      return;
    let cancelled = false;
    const timeout = setTimeout(() => {
      geocodeQuery(shopAddress).then((co) => {
        if (!cancelled && co) setShopCoords(co);
      });
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [shopAddress, hasRider, phase, shopCoords, shopLat, shopLng]);

  useEffect(() => {
    if (shopLat != null && shopLng != null)
      setShopCoords({ lat: Number(shopLat), lng: Number(shopLng) });
  }, [shopLat, shopLng]);

  useEffect(() => {
    if (!hasRider || !deliveryCoords || riderLat == null || riderLng == null) {
      setRoutePoints(null);
      return;
    }
    let cancelled = false;
    fetchRoute(
      { lat: riderLat, lng: riderLng },
      { lat: deliveryCoords.lat, lng: deliveryCoords.lng },
    )
      .then((points) => {
        if (cancelled) return;
        setRoutePoints(points && points.length > 0 ? points : null);
      })
      .catch(() => {
        if (!cancelled) setRoutePoints(null);
      });
    return () => {
      cancelled = true;
    };
  }, [hasRider, riderLat, riderLng, deliveryCoords]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: hasRider
        ? [riderLat, riderLng]
        : deliveryLat != null && deliveryLng != null
          ? [Number(deliveryLat), Number(deliveryLng)]
          : DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 10,
      maxZoom: 18,
      scrollWheelZoom: true,
    });
    L.tileLayer(TILES.url, {
      attribution: TILES.attribution,
      subdomains: TILES.subdomains || "abc",
      maxZoom: 20,
      maxNativeZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      shopMarkerRef.current = null;
      riderMarkerRef.current = null;
      destMarkerRef.current = null;
      lineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!showMap) {
      [shopMarkerRef, riderMarkerRef, destMarkerRef, lineRef].forEach((ref) => {
        if (ref.current) {
          map.removeLayer(ref.current);
          ref.current = null;
        }
      });
      setDistanceM(null);
      return;
    }

    const shop = shopCoords;
    const dest = deliveryCoords;

    if (hasRider) {
      const rLat = riderLat;
      const rLng = riderLng;
      const riderPoint = L.latLng(rLat, rLng);
      const riderIcon = L.divIcon({
        className: "",
        html: markerHtml("rider"),
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng(riderPoint);
        riderMarkerRef.current.setIcon(riderIcon);
      } else {
        const m = L.marker(riderPoint, { icon: riderIcon }).addTo(map);
        m.bindPopup(getPhaseLabel(phase), { closeButton: true });
        riderMarkerRef.current = m;
      }
      if (dest)
        setDistanceM(riderPoint.distanceTo(L.latLng(dest.lat, dest.lng)));
    } else {
      if (riderMarkerRef.current) {
        map.removeLayer(riderMarkerRef.current);
        riderMarkerRef.current = null;
      }
      setDistanceM(null);
    }

    if (shop) {
      const pt = L.latLng(shop.lat, shop.lng);
      if (shopMarkerRef.current) shopMarkerRef.current.setLatLng(pt);
      else {
        const m = L.marker(pt, {
          icon: L.divIcon({
            className: "",
            html: markerHtml("shop"),
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
        }).addTo(map);
        m.bindPopup("Store", { closeButton: true });
        shopMarkerRef.current = m;
      }
    } else if (shopMarkerRef.current) {
      map.removeLayer(shopMarkerRef.current);
      shopMarkerRef.current = null;
    }

    if (dest) {
      const destPoint = L.latLng(dest.lat, dest.lng);
      if (destMarkerRef.current) destMarkerRef.current.setLatLng(destPoint);
      else {
        const m = L.marker(destPoint, {
          icon: L.divIcon({
            className: "",
            html: markerHtml("delivery"),
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
        }).addTo(map);
        m.bindPopup("Delivery address", { closeButton: true });
        destMarkerRef.current = m;
      }

      if (hasRider && riderLat != null && riderLng != null) {
        const riderPoint = L.latLng(riderLat, riderLng);
        const lineLatLngs =
          routePoints && routePoints.length > 0
            ? routePoints.map(([lat, lng]) => L.latLng(lat, lng))
            : [riderPoint, destPoint];
        if (lineRef.current) lineRef.current.setLatLngs(lineLatLngs);
        else {
          const line = L.polyline(lineLatLngs, {
            color: ROUTE_COLOR,
            weight: ROUTE_WEIGHT,
            opacity: ROUTE_OPACITY,
          }).addTo(map);
          lineRef.current = line;
        }
        const bounds = L.latLngBounds(lineLatLngs);
        map.fitBounds(bounds, { padding: FIT_ROUTE_PADDING, maxZoom: 18 });
        if (map.getZoom() < FIT_ROUTE_MIN_ZOOM) map.setZoom(FIT_ROUTE_MIN_ZOOM);
      } else {
        if (lineRef.current) {
          map.removeLayer(lineRef.current);
          lineRef.current = null;
        }
        const points = shop
          ? [L.latLng(shop.lat, shop.lng), destPoint]
          : [destPoint];
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: FIT_ROUTE_PADDING, maxZoom: 18 });
        if (map.getZoom() < FIT_ROUTE_MIN_ZOOM) map.setZoom(FIT_ROUTE_MIN_ZOOM);
      }
    } else {
      if (destMarkerRef.current) {
        map.removeLayer(destMarkerRef.current);
        destMarkerRef.current = null;
      }
      if (lineRef.current) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }
      if (hasRider && riderLat != null && riderLng != null) {
        map.setView([riderLat, riderLng], map.getZoom());
      }
    }
  }, [
    showMap,
    hasRider,
    riderLat,
    riderLng,
    shopCoords,
    deliveryCoords,
    phase,
    routePoints,
  ]);

  const showDistance = phase === "rider" && distanceM != null;
  const handleFitRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const line = lineRef.current;
    const pts = line?.getLatLngs?.();
    if (pts?.length) {
      const b = L.latLngBounds(pts);
      map.fitBounds(b, { padding: FIT_ROUTE_PADDING, maxZoom: 18 });
      if (map.getZoom() < FIT_ROUTE_MIN_ZOOM) map.setZoom(FIT_ROUTE_MIN_ZOOM);
    } else if (riderMarkerRef.current && destMarkerRef.current) {
      const b = L.latLngBounds([
        riderMarkerRef.current.getLatLng(),
        destMarkerRef.current.getLatLng(),
      ]);
      map.fitBounds(b, { padding: FIT_ROUTE_PADDING, maxZoom: 18 });
      if (map.getZoom() < FIT_ROUTE_MIN_ZOOM) map.setZoom(FIT_ROUTE_MIN_ZOOM);
    }
  }, []);
  const addressLine = deliveryAddress
    ? [deliveryAddress.street, deliveryAddress.city, deliveryAddress.state]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}
      style={{
        minHeight: MAP_MIN_HEIGHT,
        height: "max(520px, 55vh)",
        background: "linear-gradient(180deg, #fdf4ff 0%, #faf5ff 100%)",
      }}
    >
      {showMap && (
        <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between gap-3 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-violet-200/60 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
              {getPhaseLabel(phase)}
            </p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {phase === "rider" && !hasRider
                ? "Waiting for rider location…"
                : phase === "rider"
                  ? "Rider on the way"
                  : phase === "shop"
                    ? "Order at store"
                    : "Delivered"}
            </p>
            {addressLine && phase === "delivery" && (
              <p
                className="text-xs text-gray-500 truncate mt-0.5"
                title={addressLine}
              >
                {addressLine}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showDistance && (
              <div className="px-3 py-1.5 rounded-full bg-violet-100 text-violet-800 font-bold text-sm">
                {formatDistance(distanceM)} to go
              </div>
            )}
            <button
              type="button"
              onClick={handleFitRoute}
              className="p-2 rounded-lg bg-white/80 hover:bg-white border border-violet-200/60 text-violet-700 hover:text-violet-900 transition-colors"
              title="Fit map to route"
              aria-label="Fit map to route"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full rounded-2xl"
        style={{ minHeight: MAP_MIN_HEIGHT, height: "max(520px, 55vh)" }}
      />

      {!showMap && (
        <div
          className="absolute inset-0 z-[1000] flex items-center justify-center rounded-2xl text-gray-500 text-sm font-medium"
          style={{
            background:
              "linear-gradient(180deg, rgba(253,244,255,0.95) 0%, rgba(250,245,255,0.95) 100%)",
          }}
        >
          Map will show when order is out for delivery
        </div>
      )}
    </div>
  );
}
