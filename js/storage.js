export const STORAGE_KEYS = {
  settings: 'roseStudioSettings',
  legacySettings: 'roseSettings',
  recents: 'roseStudioRecents',
  favorites: 'roseStudioFavorites',
  clients: 'roseStudioClients'
};

export const defaults = {
  jpRate:.21,
  jpShips:[.20,.22,.24,.25,.27,.28],
  krQuFee:1.03,
  krQuRate1:39,
  krQuRate2:40,
  krQuAir1:.26,
  krQuAir2:.21,
  krQuSea:.16,
  krHongRate1:40,
  krHongRate2:42,
  krHongAir:.23,
  krHongSea:.146,
  thRate:1,
  thShip:.17,
  thWeightShip:.18,
  usRate:32,
  usFeeA:1.08,
  usShipA:180,
  usFeeB:1.07,
  usShipB:5,
  hkRateCost:3.8,
  hkRateWholesale:5,
  hkBuyerFee:0,
  hkBuyerFeeWholesale:30,
  hkShipRateCost:4.2,
  hkShipRateWholesale:5,
  hkShipPerG:.15,
  auRate:23,
  auShip:.175,
  czRate:1.4,
  czShip:.3
};

function readJSON(key, fallback){
  try{return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))}
  catch{return fallback}
}
export function getSettings(){
  const current = readJSON(STORAGE_KEYS.settings, null);
  const legacy = readJSON(STORAGE_KEYS.legacySettings, {});
  return {...defaults, ...(legacy || {}), ...(current || {})};
}
export function saveSettings(settings){
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}
export function getRecents(){return readJSON(STORAGE_KEYS.recents, [])}
export function addRecent(item){
  const list = [item, ...getRecents()].slice(0,20);
  localStorage.setItem(STORAGE_KEYS.recents, JSON.stringify(list));
}
export function clearRecents(){localStorage.removeItem(STORAGE_KEYS.recents)}
export function getFavorites(){
  const base = [
    {name:'Dior', country:'jp', price:5800, weight:300},
    {name:'Nike', country:'kr', price:28000, weight:900},
    {name:'UNIQLO', country:'jp', price:1990, weight:250},
    {name:'GU', country:'jp', price:990, weight:200},
    {name:'Costco', country:'us', price:19.99, weight:2}
  ];
  return readJSON(STORAGE_KEYS.favorites, base);
}
export function saveFavorites(list){localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(list))}
export function getClients(){return readJSON(STORAGE_KEYS.clients, ['Amy','小美','Kelly'])}
export function saveClients(list){localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(list))}
