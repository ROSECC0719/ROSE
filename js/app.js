import { getSettings, addRecent, getRecents, clearRecents, getFavorites, saveFavorites, getClients, saveClients } from './storage.js';
import { $, fmt, plain, input, textInput, pageTitle, copyText } from './utils.js';
import { countries, calcJapan, calcKorea, calcThailand, calcUS, calcHK, calcAU, calcCZ, resultCards, bestValue } from './countries.js';
import { renderSettings, bindSettings } from './settings.js';

let route = 'dashboard';
let selectedCountry = null;

function setRoute(next, country=null){
  route = next;
  selectedCountry = country;
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.route===route));
  render();
  window.scrollTo(0,0);
}

function dashboard(){
  const st=getSettings();
  return `
    <section class="panel">
      <div class="section-title">今日設定</div>
      <div class="kpi-grid">
        <div class="kpi"><small>JPY</small><b>${st.jpRate}</b></div>
        <div class="kpi"><small>KRW QU</small><b>${st.krQuRate1}</b></div>
        <div class="kpi"><small>THB</small><b>${st.thRate}</b></div>
      </div>
    </section>
    <section class="panel">
      <div class="section-title">快速報價</div>
      ${input('quickPrice','價格','',1000)}
      ${input('quickWeight','重量','g',100)}
      
    </section>
    ${countryButtons('asia','🌍 亞洲')}
    ${countryButtons('world','🌎 歐美')}
    ${recentBlock()}
  `;
}

function countryButtons(zone,title){
  return `<div class="section-title">${title}</div><div class="country-grid">${
    countries.filter(c=>c.zone===zone).map(c=>`<button class="country-card" data-country="${c.id}"><div class="main"><span>${c.icon} ${c.name}</span><span>›</span></div><small>${c.desc}</small></button>`).join('')
  }</div>`;
}

function quoteHome(){
  return `${pageTitle('📦 選擇報價國家')}${countryButtons('asia','🌍 亞洲')}${countryButtons('world','🌎 歐美')}`;
}

function quotePage(id){
  const c = countries.find(x=>x.id===id);
  if(!c)return quoteHome();
  if(id==='jp')return quoteJP();
  if(id==='kr')return quoteKR();
  if(id==='th')return quoteTH();
  if(id==='us')return quoteUS();
  if(id==='hk')return quoteHK();
  if(id==='au')return quoteAU();
  if(id==='cz')return quoteCZ();
}

function quoteJP(){
  return `${pageTitle('🇯🇵 日本報價')}<div class="panel">${input('jpPrice','商品價格（日幣）','¥',100)}${input('jpWeight','重量','g',100)}<button class="primary" id="runJP">開始計算</button></div><div id="results"></div>`;
}
function quoteKR(){
  return `${pageTitle('🇰🇷 韓國報價')}<div class="panel"><span class="pill">QU 模式</span>${input('krQuPrice','韓元價格','₩',28000)}${input('krQuWeight','重量','g',900)}<span class="pill">INN 模式</span>${input('krInnPrice','韓元價格','₩',10000)}${input('krInnWeight','重量','g',200)}<button class="primary" id="runKR">開始計算</button></div><div id="results"></div>`;
}
function quoteTH(){
  return `${pageTitle('🇹🇭 泰國報價')}<div class="panel"><span class="pill">有代購費</span>${input('thPrice','泰銖價格','฿',100)}${input('thWeight','重量','g',100)}<span class="pill">無代購費</span>${input('thWPrice','泰銖價格','฿',210)}${input('thWWeight','重量','g',400)}<button class="primary" id="runTH">開始計算</button></div><div id="results"></div>`;
}
function quoteUS(){
  return `${pageTitle('🇺🇸 美國報價')}<div class="panel"><span class="pill">算法A</span>${input('usAUsd','美金價格','$',10.99)}${input('usALb','重量','lb',1.37)}<span class="pill">算法B</span>${input('usBUsd','美金價格','$',10.99)}${input('usBLb','重量','lb',1.37)}<span class="pill">重量換算</span>${input('usG','克轉磅','g',500)}${input('usLb','磅轉克','lb',1)}<button class="primary" id="runUS">開始計算</button></div><div id="results"></div>`;
}
function quoteHK(){
  return `${pageTitle('🇭🇰 香港報價')}<div class="panel"><span class="pill">模式1</span>${input('hkPrice','港幣價格','HK$',125)}${input('hkDiscount','折扣','×',1)}<span class="pill">模式2</span>${input('hkWPrice','港幣價格','HK$',20)}${input('hkWeightFee','重量運費','NT$',85)}${input('hkWDiscount','折扣','×',1)}<button class="primary" id="runHK">開始計算</button></div><div id="results"></div>`;
}
function quoteAU(){return `${pageTitle('🇦🇺 澳洲報價')}<div class="panel">${input('auPrice','澳幣價格','A$',30)}${input('auWeight','重量','g',150)}<button class="primary" id="runAU">開始計算</button></div><div id="results"></div>`}
function quoteCZ(){return `${pageTitle('🇨🇿 捷克報價')}<div class="panel">${input('czPrice','克朗價格','Kč',119.9)}${input('czWeight','重量','g',150)}<button class="primary" id="runCZ">開始計算</button></div><div id="results"></div>`}

function renderResults(cards, meta){
  $('#results').innerHTML = resultCards(cards) + `<div class="quote-actions"><button class="mini-btn" id="copyQuote">複製報價</button><button class="mini-btn" id="saveRecent">加入最近</button></div>`;
  const best = bestValue(cards);
  const text = `📦 ROSE 報價\n${meta.title}\n價格：${meta.price}\n重量：${meta.weight}g\n參考：${fmt(best)}`;
  $('#copyQuote')?.addEventListener('click',()=>copyText(text).then(()=>alert('已複製，可以貼到 LINE')));
  $('#saveRecent')?.addEventListener('click',()=>{addRecent({time:Date.now(),...meta,best});alert('已加入最近報價')});
}

function bindQuote(id){
  const st=getSettings();
  $('#runJP')?.addEventListener('click',()=>{const p=+$('#jpPrice').value||0,w=+$('#jpWeight').value||0;renderResults(calcJapan(st,p,w),{country:'jp',title:'🇯🇵 日本',price:'¥'+p,weight:w})});
  $('#runKR')?.addEventListener('click',()=>{const qp=+$('#krQuPrice').value||0,qw=+$('#krQuWeight').value||0,ip=+$('#krInnPrice').value||0,iw=+$('#krInnWeight').value||0;renderResults(calcKorea(st,qp,qw,ip,iw),{country:'kr',title:'🇰🇷 韓國',price:'₩'+qp+' / ₩'+ip,weight:Math.max(qw,iw)})});
  $('#runTH')?.addEventListener('click',()=>{const p=+$('#thPrice').value||0,w=+$('#thWeight').value||0,wp=+$('#thWPrice').value||0,ww=+$('#thWWeight').value||0;renderResults(calcThailand(st,p,w,wp,ww),{country:'th',title:'🇹🇭 泰國',price:'฿'+p+' / ฿'+wp,weight:Math.max(w,ww)})});
  $('#runUS')?.addEventListener('click',()=>renderResults(calcUS(st,+$('#usAUsd').value||0,+$('#usALb').value||0,+$('#usBUsd').value||0,+$('#usBLb').value||0,+$('#usG').value||0,+$('#usLb').value||0),{country:'us',title:'🇺🇸 美國',price:'$',weight:0}));
  $('#runHK')?.addEventListener('click',()=>renderResults(calcHK(st,+$('#hkPrice').value||0,+$('#hkDiscount').value||0,+$('#hkWPrice').value||0,+$('#hkWeightFee').value||0,+$('#hkWDiscount').value||0),{country:'hk',title:'🇭🇰 香港',price:'HK$',weight:0}));
  $('#runAU')?.addEventListener('click',()=>{const p=+$('#auPrice').value||0,w=+$('#auWeight').value||0;renderResults(calcAU(st,p,w),{country:'au',title:'🇦🇺 澳洲',price:'A$'+p,weight:w})});
  $('#runCZ')?.addEventListener('click',()=>{const p=+$('#czPrice').value||0,w=+$('#czWeight').value||0;renderResults(calcCZ(st,p,w),{country:'cz',title:'🇨🇿 捷克',price:'Kč'+p,weight:w})});
}

function quickBind(){
  $('#quickRun')?.addEventListener('click',()=>{
    const st=getSettings(), p=+$('#quickPrice').value||0, w=+$('#quickWeight').value||0;
    const cards = [
      {title:'🇯🇵 日本 最低', rows:[['參考',bestValue(calcJapan(st,p,w))]]},
      {title:'🇰🇷 韓國 QU參考', rows:[['參考',bestValue(calcKorea(st,p,w,p,w))]]},
      {title:'🇹🇭 泰國參考', rows:[['參考',bestValue(calcThailand(st,p,w,p,w))]]}
    ];
    $('#quickResults').innerHTML = resultCards(cards);
  });
}

function recentBlock(){
  const list=getRecents();
  return `<div class="section-title">最近報價</div><div class="panel">${list.length?list.map(x=>`<div class="row"><span>${x.title}<br><small>${new Date(x.time).toLocaleString('zh-TW')}</small></span><span class="money">${fmt(x.best)}</span></div>`).join('')+'<button class="secondary" id="clearRecent">清除最近</button>':'<div class="empty">目前沒有最近報價</div>'}</div>`;
}
function favoritesPage(){
  const fav=getFavorites();
  return `${pageTitle('❤️ 收藏商品')}<div class="panel">${fav.map((f,i)=>`<div class="row"><span>${f.name}<br><small>${f.country.toUpperCase()}｜${f.price}｜${f.weight}g</small></span><button class="mini-btn" data-fav="${i}">報價</button></div>`).join('')}</div><div class="panel">${textInput('favName','商品名稱','')}${textInput('favCountry','國家代碼 jp/kr/th/us/hk/au/cz','jp')}${input('favPrice','價格','',0)}${input('favWeight','重量','g',0)}<button class="primary" id="addFav">加入收藏</button></div>`;
}
function bindFavorites(){
  document.querySelectorAll('[data-fav]').forEach(btn=>btn.addEventListener('click',()=>{const f=getFavorites()[+btn.dataset.fav];setRoute('quote',f.country);setTimeout(()=>prefillFavorite(f),0)}));
  $('#addFav')?.addEventListener('click',()=>{const list=getFavorites();list.unshift({name:$('#favName').value||'未命名',country:$('#favCountry').value||'jp',price:+$('#favPrice').value||0,weight:+$('#favWeight').value||0});saveFavorites(list.slice(0,30));render()});
}
function prefillFavorite(f){
  const map={jp:['jpPrice','jpWeight'],th:['thPrice','thWeight'],au:['auPrice','auWeight'],cz:['czPrice','czWeight'],kr:['krQuPrice','krQuWeight']};
  const ids=map[f.country]; if(!ids)return;
  const p=$('#'+ids[0]), w=$('#'+ids[1]); if(p)p.value=f.price; if(w)w.value=f.weight;
}
function profitPage(){
  return `${pageTitle('📈 利潤分析')}<div class="panel">${input('profitCost','成本','NT$',1000)}${input('profitSale','售價','NT$',1500)}<button class="primary" id="runProfit">計算利潤</button></div><div id="profitResults"></div><div class="section-title">客戶</div><div class="panel" id="clientList">${getClients().map(c=>`<div class="row"><span>${c}</span><span>›</span></div>`).join('')}</div>`;
}
function bindProfit(){
  $('#runProfit')?.addEventListener('click',()=>{const cost=+$('#profitCost').value||0,sale=+$('#profitSale').value||0,earn=sale-cost,rate=cost?earn/cost*100:0;$('#profitResults').innerHTML=resultCards([{title:'利潤結果',rows:[['賺',earn],['利潤率',rate.toFixed(1)+'%']]}])});
}

function render(){
  const app=$('#app');
  if(route==='dashboard')app.innerHTML=dashboard();
  if(route==='quote')app.innerHTML=selectedCountry?quotePage(selectedCountry):quoteHome();
  if(route==='favorites')app.innerHTML=favoritesPage();
  if(route==='profit')app.innerHTML=profitPage();
  if(route==='settings')app.innerHTML=renderSettings();

  document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>setRoute(el.dataset.route)));
  document.querySelectorAll('[data-country]').forEach(el=>el.addEventListener('click',()=>setRoute('quote',el.dataset.country)));
  $('#clearRecent')?.addEventListener('click',()=>{clearRecents();render()});
  quickBind();
  bindQuote(selectedCountry);
  bindFavorites();
  bindProfit();
  if(route==='settings')bindSettings(()=>render());
}

render();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}
