export const $ = (sel) => document.querySelector(sel);
export const fmt = (n) => 'NT$ ' + (Number.isFinite(n) ? Math.round(n).toLocaleString('zh-TW') : '0');
export const plain = (n) => Number.isFinite(n) ? Math.round(n).toLocaleString('zh-TW') : '0';
export function input(id,label,unit='',value=0){
  return `<div class="field"><label>${label}</label><div class="input-wrap"><input id="${id}" type="number" inputmode="decimal" value="${value}"><span class="unit">${unit}</span></div></div>`;
}
export function textInput(id,label,value=''){
  return `<div class="field"><label>${label}</label><div class="input-wrap"><input id="${id}" type="text" value="${value}"></div></div>`;
}
export function pageTitle(title){
  return `<div class="backline"><button class="back" data-route="dashboard">‹</button><div class="page-title">${title}</div></div>`;
}
export function copyText(text){
  if(navigator.clipboard){return navigator.clipboard.writeText(text)}
  const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve();
}
