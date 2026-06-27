import { defaults, getSettings, saveSettings } from './storage.js';
import { pageTitle } from './utils.js';

const groups = [
  ['🇯🇵 日本', [['jpRate','日幣匯率'], ['jpShips','日本運費列表']]],
  ['🇰🇷 韓國 QU', [['krQuRate1','QU 匯率1'],['krQuRate2','QU 匯率2'],['krQuAir1','QU 空運運費1 / 每g'],['krQuAir2','QU 空運運費2 / 每g'],['krQuSea','QU 海運運費 / 每g'],['krQuFee','QU 代購費倍率']]],
  ['🇰🇷 韓國 INN', [['krHongRate1','INN 匯率1'],['krHongRate2','INN 匯率2'],['krHongAir','INN 空運運費 / 每g'],['krHongSea','INN 海運運費 / 每g']]],
  ['🇹🇭 泰國', [['thRate','泰銖匯率'],['thShip','有代購運費 / 每g'],['thWeightShip','無代購運費 / 每g']]],
  ['🇺🇸 美國', [['usRate','美金匯率'],['usFeeA','算法A代購費倍率'],['usShipA','算法A運費'],['usFeeB','算法B代購費倍率'],['usShipB','算法B運費']]],
  ['🇭🇰 香港', [['hkRateCost','港幣成本匯率'],['hkRateWholesale','港幣批價匯率'],['hkBuyerFee','買手費成本'],['hkBuyerFeeWholesale','買手費批價'],['hkShipRateCost','重量成本匯率'],['hkShipRateWholesale','重量批價匯率'],['hkShipPerG','香港重量運費 / 每g']]],
  ['🇦🇺 澳洲', [['auRate','澳幣匯率'],['auShip','澳洲運費 / 每g']]],
  ['🇨🇿 捷克', [['czRate','捷克匯率'],['czShip','捷克運費 / 每g']]]
];

export function renderSettings(){
  const st = getSettings();
  const html = pageTitle('⚙️ 設定') + `<div class="panel"><div class="setting-hint">日本運費用逗號分隔，例如：0.20,0.22,0.24。韓國運費為每 g 運費；不需要就填 0。</div>
  ${groups.map(([title,items])=>`<div class="settings-group"><h3>${title}</h3>${items.map(([key,label])=>{
    const value = key==='jpShips' ? st.jpShips.join(',') : st[key];
    const type = key==='jpShips' ? 'text' : 'number';
    return `<div class="setting-row"><label>${label}</label><input id="set_${key}" type="${type}" step="0.001" value="${value}"></div>`;
  }).join('')}</div>`).join('')}
  <button class="primary" id="saveSettings">儲存設定</button>
  <button class="danger" id="resetSettings">恢復預設值</button>
  <p class="copy-note">設定會存在這台手機/電腦。換裝置要重新設定。</p></div>`;
  return html;
}

export function bindSettings(onDone){
  document.getElementById('saveSettings')?.addEventListener('click',()=>{
    const st = getSettings();
    Object.keys(defaults).forEach(k=>{
      const el = document.getElementById('set_'+k);
      if(!el)return;
      if(k==='jpShips'){
        const arr = el.value.split(',').map(x=>+x.trim()).filter(Number.isFinite);
        if(arr.length) st.jpShips = arr;
      }else{
        st[k] = +el.value;
      }
    });
    saveSettings(st);
    alert('設定已儲存');
    onDone?.();
  });
  document.getElementById('resetSettings')?.addEventListener('click',()=>{
    if(confirm('確定恢復預設設定？')){
      saveSettings(defaults);
      onDone?.();
    }
  });
}
