import { fmt, plain } from './utils.js';

export const countries = [
  {id:'jp', icon:'🇯🇵', name:'日本', zone:'asia', desc:'稅率 × 運費'},
  {id:'kr', icon:'🇰🇷', name:'韓國', zone:'asia', desc:'QU / INN'},
  {id:'th', icon:'🇹🇭', name:'泰國', zone:'asia', desc:'有代購費 / 無代購費'},
  {id:'hk', icon:'🇭🇰', name:'香港', zone:'asia', desc:'成本 / 批價'},
  {id:'us', icon:'🇺🇸', name:'美國', zone:'world', desc:'兩種算法'},
  {id:'au', icon:'🇦🇺', name:'澳洲', zone:'world', desc:'匯率 × 運費'},
  {id:'cz', icon:'🇨🇿', name:'捷克', zone:'world', desc:'克朗換算'}
];

export function calcJapan(st, price, weight){
  return st.jpShips.map(ship => ({
    title:`運費 ${Number(ship).toFixed(2)}`,
    rows:[
      ['10%稅 成本', price*1.1*st.jpRate + weight*ship],
      ['8%稅 成本', price*1.08*st.jpRate + weight*ship],
      ['税込 成本', price*st.jpRate + weight*ship]
    ]
  }));
}

export function calcKorea(st, qp, qw, ip, iw){
  const qAir1=qp*st.krQuFee/st.krQuRate1+qw*st.krQuAir1;
  const qAir2=qp*st.krQuFee/st.krQuRate2+qw*st.krQuAir2;
  const qSea1=qp*st.krQuFee/st.krQuRate1+qw*st.krQuSea;
  const qSea2=qp*st.krQuFee/st.krQuRate2+qw*st.krQuSea;
  const hAir1=ip/st.krHongRate1+iw*st.krHongAir;
  const hAir2=ip/st.krHongRate2+iw*st.krHongAir;
  const hSea1=ip/st.krHongRate1+iw*st.krHongSea;
  const hSea2=ip/st.krHongRate2+iw*st.krHongSea;
  return [
    {title:'QU 空運', rows:[[ `匯率 ${st.krQuRate1}｜運費 ${st.krQuAir1}/g`, qAir1],[`匯率 ${st.krQuRate2}｜運費 ${st.krQuAir2}/g`, qAir2]]},
    {title:'QU 海運', rows:[[ `匯率 ${st.krQuRate1}｜運費 ${st.krQuSea}/g`, qSea1],[`匯率 ${st.krQuRate2}｜運費 ${st.krQuSea}/g`, qSea2]]},
    {title:'INN 空運', rows:[[ `匯率 ${st.krHongRate1}｜運費 ${st.krHongAir}/g`, hAir1],[`匯率 ${st.krHongRate2}｜運費 ${st.krHongAir}/g`, hAir2]]},
    {title:'INN 海運', rows:[[ `匯率 ${st.krHongRate1}｜運費 ${st.krHongSea}/g`, hSea1],[`匯率 ${st.krHongRate2}｜運費 ${st.krHongSea}/g`, hSea2]]}
  ];
}

export function calcThailand(st, priceA, weightA, priceB, weightB){
  const cost=Math.round(priceA*1.1*st.thRate+weightA*st.thShip);
  const base=Math.round(priceB*st.thRate+weightB*st.thShip);
  return [
    {title:'有代購費', rows:[['成本',cost]]},
    {title:'無代購費', rows:[['成本',base],['代購費10%',Math.round(base*1.1)]]}
  ];
}

export function calcUS(st, aUsd, aLb, bUsd, bLb, g, lb){
  return [
    {title:'算法A', rows:[['結果',aUsd*st.usFeeA*st.usRate+aLb*st.usShipA]]},
    {title:'算法B', rows:[['結果',(bUsd*st.usFeeB+bLb*st.usShipB)*st.usRate]]},
    {title:'重量換算', rows:[[`${g} g =`,`${(g*0.0022046).toFixed(4)} lb`],[`${lb} lb =`,`${(lb/0.0022046).toFixed(2)} g`]]}
  ];
}

export function calcHK(st, p,d,wp,wf,wd){
  return [
    {title:'模式1：折扣＋買手費', rows:[['成本',p*d*st.hkRateCost+st.hkBuyerFee],['批價',p*d*st.hkRateWholesale+st.hkBuyerFeeWholesale]]},
    {title:'模式2：重量運費', rows:[['成本',wp*wd*st.hkShipRateCost+wf*st.hkShipPerG],['批價',wp*wd*st.hkShipRateWholesale+wf*st.hkShipPerG]]}
  ];
}

export function calcAU(st,p,w){return [{title:'澳洲小計', rows:[['結果',p*st.auRate+w*st.auShip]]}]}
export function calcCZ(st,p,w){return [{title:'捷克小計', rows:[['結果',p*st.czRate+w*st.czShip]]}]}

export function resultCards(cards){
  return `<div class="result-grid">${cards.map(c=>`<div class="result-card"><h3>${c.title}</h3>${c.rows.map(([k,v])=>`<div class="row"><span>${k}</span><span class="money">${typeof v==='number'?fmt(v):v}</span></div>`).join('')}</div>`).join('')}</div>`;
}

export function bestValue(cards){
  const nums = cards.flatMap(c=>c.rows.map(r=>typeof r[1]==='number'?r[1]:Infinity)).filter(Number.isFinite);
  return nums.length ? Math.min(...nums) : 0;
}
