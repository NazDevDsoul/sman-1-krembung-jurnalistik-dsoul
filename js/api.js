const API_BASE = "https://script.google.com/macros/s/AKfycbyw221VQqj3ql5INNphqZfSfDtpkrFt2xcJTSlgxu7AknNu81KAwyHx5hMyvSC6Px5Z/exec";

function apiUrl(type, extra = {}) {
  const params = new URLSearchParams();
  if (type) params.set("type", type);

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  params.set("nocache", Date.now().toString());
  return `${API_BASE}?${params.toString()}`;
}

async function fetchJson(type, extra = {}) {
  const res = await fetch(apiUrl(type, extra), { cache: "no-store" });
  if (!res.ok) throw new Error(`Gagal fetch ${type}`);
  return res.json();
}