'use strict';
const $=id=>document.getElementById(id);
const e=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const num=n=>typeof n==='number'?n.toLocaleString('zh-TW'):'尚未取得';
const currency=n=>typeof n==='number'?n.toLocaleString('zh-TW',{minimumFractionDigits:2,maximumFractionDigits:2}):'尚未取得';
const hint=(msg,error=false)=>{$('status').className=error?'err':'';$('status').textContent=msg;};
let token='';try{token=window.parent!==window?(window.parent.CLIENT_TOKEN||decodeURIComponent(window.parent.location.hash.slice(1))):'';}catch{}
if(!/^[a-zA-Z0-9]{20,64}$/.test(token))token='';
let source, canSave=false;
let draft={selected:[],notes:{},customCandidates:[]};
let pending=0;
const req=async (name,body)=>{
 const res=await fetch('/api/c/'+encodeURIComponent(token)+'/'+name,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 let v;try{v=await res.json()}catch{throw new Error('無法讀取伺服器結果');}
 if(!res.ok)throw new Error(v.error||'目前無法完成');
 return v;
};
const allRows=()=>[...source.pool,...(draft.customCandidates||[])];
function totals(){ $('total').textContent=allRows().length;$('known').textContent=allRows().filter(k=>typeof k.vol==='number').length;$('groups').textContent=source.groups.length;$('selected').textContent=canSave?draft.selected.length:'—'; }
const adsComp=k=>{const c=k.competition||k.comp, i=k.index??k.compIndex;return !c?'尚未取得':c+(typeof i==='number'?'（'+i+'）':'');};
const bid=k=>{const hi=k.high??k.hi;return k.low==null&&hi==null?'尚未取得':currency(k.low)+' ～ '+currency(hi);};
function render(){
 totals();
 const term=$('q').value.trim().toLowerCase(), cat=$('category').value, only=$('only').checked, rec=$('rec').checked, selected=new Set(draft.selected);
 const rows=allRows().filter(k=>(!cat||k.group===cat)&&(!term||k.keyword.toLowerCase().includes(term))&&(!only||selected.has(k.keyword))&&(!rec||k.recommended));
 $('result').textContent='顯示 '+rows.length+' 組';
 $('rows').innerHTML=source.groups.map(g=>{
  const results=rows.filter(x=>x.group===g.name);if(!results.length)return '';
  return '<section class="group"><h3>'+e(g.name)+'</h3><p>'+e(g.direction)+'</p>'+results.map(k=>{
   const word=e(k.keyword), note=e(draft.notes[k.keyword]||'');
   return '<article class="entry" data-key="'+word+'"><div class="word"><input type="checkbox" aria-label="暫選 '+word+'" data-action="choose" '+(selected.has(k.keyword)?'checked':'')+' '+(canSave?'':'disabled')+'><div><strong>'+word+'</strong>'+(k.recommended?'<span class="badge">顧問建議</span>':'')+'</div></div><div><small>月搜尋量</small>'+num(k.vol)+'</div><div><small>廣告競爭／指數</small>'+e(adsComp(k))+'</div><div><small>頁首出價（TWD）</small>'+bid(k)+'</div><div class="notes"><small>'+(k.queriedAt?e(String(k.queriedAt).slice(0,10)):'查詢數據尚未取得')+'</small>'+(canSave?'<details><summary>'+(note?'查看或編輯備註':'新增備註')+'</summary><textarea rows="2" maxlength="2000" aria-label="'+word+' 備註">'+note+'</textarea><button type="button" data-action="note">儲存備註</button></details>':'')+'</div></article>';
  }).join('')+'</section>';
 }).join('')||'<p>沒有符合條件的關鍵字。</p>';
}
async function save(control,body,onError){
 if(pending)return;
 pending++;control.disabled=true;hint('儲存中…');
 try{ draft=await req('research-selection',body);hint('已儲存面訪暫選或備註');totals();if($('only').checked&&body.selected===false)control.closest('.entry')?.remove();if(body.note!==undefined)control.closest('details').querySelector('summary').textContent=body.note?'查看或編輯備註':'新增備註';}
 catch(err){onError?.();hint('未儲存：'+err.message+'。請重試。',true);}
 finally{control.disabled=false;pending--;}
}
$('rows').addEventListener('change',ev=>{const x=ev.target;if(x.dataset.action==='choose'){const checked=x.checked; if(pending){x.checked=!checked;return;}save(x,{keyword:x.closest('.entry').dataset.key,selected:checked},()=>x.checked=!checked);}});
$('rows').addEventListener('click',ev=>{const x=ev.target;if(x.dataset.action==='note')save(x,{keyword:x.closest('.entry').dataset.key,note:x.closest('details').querySelector('textarea').value});});
$('look').addEventListener('submit',async ev=>{
 ev.preventDefault();if(!canSave)return;
 const term=$('term').value.trim(),button=$('go'),host=$('look-out');if(!term)return;
 button.disabled=true;host.textContent='查詢中…';host.className='';
 try{
  const data=await req('research-keyword-lookup',{keyword:term});
  const d=data.keyword&&typeof data.keyword==='object'?data.keyword:data.result||data;
  const hit=d.vol??d.avgMonthlySearches??d.volume??null;
  host.innerHTML='<p><strong>'+e(term)+'</strong>　月搜尋量：'+num(hit)+'</p><p>來源：Google Ads 關鍵字規劃工具・'+e(source.meta.market)+'・'+e(data.queriedAt?String(data.queriedAt).slice(0,10):'查詢日期未回傳')+'。沒有回傳不等於零。</p>';
  if(allRows().some(x=>x.keyword===term)){host.innerHTML+='<p>已在候選清單，請用上方搜尋。</p>';return;}
  const sel=document.createElement('select');sel.setAttribute('aria-label','要加入的分類');sel.append(new Option('請先選擇分類',''));for(const g of source.groups)sel.append(new Option(g.name,g.name));host.append(sel);sel.onchange=()=>sel.setCustomValidity('');
  const add=document.createElement('button');add.type='button';add.textContent='加入此分類候選';host.append(' ',add);
  add.onclick=async()=>{
   if(!sel.value){sel.setCustomValidity('請先選擇分類再加入。');sel.reportValidity();return;}
   add.disabled=true;
   try{
    const saved=await req('research-candidates',{keyword:term,group:sel.value});
    draft=saved;const word=saved.keyword||term;
    $('q').value=word;$('only').checked=$('rec').checked=false;$('category').value=allRows().find(x=>x.keyword===word)?.group||'';
    render();hint(saved.exists?'已找到既有候選，沒有重複新增。':'已加入面訪候選，沒有自動勾選。');
    const jump=document.createElement('button');jump.type='button';jump.textContent='查看 '+word;
    jump.onclick=()=>Array.from($('rows').querySelectorAll('.entry')).find(x=>x.dataset.key===word)?.scrollIntoView({block:'center'});
    host.textContent=saved.exists?'已在原分類。':'已加入 '+sel.value+'。';host.append(' ',jump);
   }
   catch(err){hint('未加入：'+err.message,true);host.querySelector('.add-error')?.remove();const p=document.createElement('p');p.className='err add-error';p.textContent='未加入：'+err.message;host.append(p);add.disabled=false;}
  };
 }catch(err){host.className='err';host.textContent='未取得查詢資料：'+err.message;}
 finally{button.disabled=false;}
});
async function boot(){
 try{
  const r=await fetch('./data.json');if(!r.ok)throw new Error('關鍵字資料尚未取得');source=await r.json();
  for(const g of source.groups)$('category').append(new Option(g.name,g.name));
  $('source').textContent=source.meta.dataSource+'｜'+source.meta.market+'｜查詢：'+source.meta.dates.join('、')+'。'+source.meta.period;
  if(token)try{draft=await req('research-selection');canSave=true;}catch(err){hint('無法讀取面訪暫選：'+err.message+'。目前僅供閱讀。',true);}
  else hint('目前僅供閱讀。若要暫選、備註或查新字，請從總誠客戶專區開啟。');
  $('lookup-title').closest('section').hidden=!canSave;
  $('only').disabled=!canSave;
  for(const id of ['q','category','only','rec'])$(id).addEventListener('input',render);
  render();
 }catch(err){hint(err.message,true);$('result').textContent='請稍候重新開啟。';}
}
boot();
