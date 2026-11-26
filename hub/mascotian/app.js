(() => {
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=n=>Number(n).toLocaleString('en-US');
 const slides=$$('.slide'), total=slides.length, mq=matchMedia('(max-width:700px)');
 let current=Math.max(1,Math.min(total,Number(location.hash.match(/slide-(\d+)/)?.[1])||1));
 let continuous=false, scrolling=false;
 document.body.classList.add('js');
 function isPaged(){return !mq.matches&&!continuous;}
 function progress(){
  const p=$('#progress');p.style.setProperty('--progress',(current/total*100)+'%');
  p.querySelector('span').textContent=current;
  p.setAttribute('aria-label',`開啟閱讀目錄，目前第${current}頁，共${total}頁`);
  $$('.menu-links [data-go]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.go)===current)));
  $('#prev').disabled=current===1;$('#next').disabled=current===total;
 }
 function closeMenu(){ $('#reader-menu').hidden=true;$('#progress').setAttribute('aria-expanded','false'); }
 function go(n,{focus=false,hash=true}={}){
  current=Math.max(1,Math.min(total,n));
  slides.forEach((s,i)=>s.classList.toggle('active',i===current-1));
  if(isPaged()){slides[current-1].scrollTop=0;}else{scrolling=true;slides[current-1].scrollIntoView({behavior:'instant',block:'start'});requestAnimationFrame(()=>{scrolling=false;});}
  if(hash)history.replaceState(null,'',`#slide-${current}`);
  closeMenu();progress();
  if(focus)slides[current-1].focus({preventScroll:true});
  $('#reader-status').textContent=`第 ${current} 頁，共 ${total} 頁：${slides[current-1].dataset.title}`;
 }
 function mode(){
  const y=window.scrollY; document.body.classList.toggle('paged',isPaged());
  $('#mode-toggle').textContent=continuous?'切換逐頁閱讀':'切換連續閱讀';
  slides.forEach((s,i)=>s.classList.toggle('active',i===current-1));
  if(!isPaged())slides[current-1].scrollIntoView({behavior:'instant'}); else window.scrollTo(0,0);
  progress();
 }
 mode();go(current,{hash:!!location.hash});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-go]');if(b)go(Number(b.dataset.go),{focus:true});
  if(!e.target.closest('#reader-menu,#progress'))closeMenu();
 });
 $('#progress').addEventListener('click',()=>{const hidden=!$('#reader-menu').hidden;$('#reader-menu').hidden=hidden;$('#progress').setAttribute('aria-expanded',String(!hidden));});
 $('#prev').addEventListener('click',()=>go(current-1,{focus:true}));
 $('#next').addEventListener('click',()=>go(current+1,{focus:true}));
 $('#mode-toggle').addEventListener('click',()=>{continuous=!continuous;mode();closeMenu();});
 mq.addEventListener('change',mode);
 addEventListener('hashchange',()=>{const m=location.hash.match(/slide-(\d+)/);if(m)go(Number(m[1]),{hash:false});});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeMenu();return;}
  if($('dialog[open]')||!$('#reader-menu').hidden||e.target.closest('button,input,select,textarea,summary,[role=tab]'))return;
  if(isPaged()&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   e.preventDefault();go(e.key==='Home'?1:e.key==='End'?total:current+(e.key==='ArrowRight'?1:-1),{focus:true});
  }
 });
 let frame=false;
 addEventListener('scroll',()=>{if(isPaged()||scrolling||frame)return;frame=true;requestAnimationFrame(()=>{frame=false;
  const guide=innerHeight*.32;let n=1;
  slides.forEach((s,i)=>{if(s.getBoundingClientRect().top<=guide)n=i+1;});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)n=total;
  if(n!==current){current=n;history.replaceState(null,'',`#slide-${n}`);progress();}
 });},{passive:true});
 const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('entered');io.unobserve(e.target);}});},{threshold:.05});
 slides.forEach(s=>io.observe(s));

 const persona=[
  ['「大型貓跳台，怎麼挑才合適？」','大型貓家庭','希望平台夠用、路徑順暢，能看懂適用條件。','文章先整理平台尺寸、結構、落地與安裝等比較項目。','對照山岳等系列的正式資料；未確認規格前，不直接宣稱任何體型都適用。'],
  ['「短腿貓與幼貓，上下怎麼走？」','短腿與幼貓家庭','關心層間落差、踏點與日常活動習慣。','用配置圖解釋路徑，再列出下單前需確認的條件。','以環繞階梯貓塔等實際款式作說明，個別適用性由品牌確認。'],
  ['「多貓一起用，怎麼分配位置？」','多貓家庭','需要多個休息位置與較少互相阻擋的動線。','從貓咪數量、活動與躲藏需求規劃配置問題。','連到全景吊橋貓柱等實際系列，先確認空間與原廠安裝條件。'],
  ['「貓家具，能融入我的客廳嗎？」','重視居家美感的家庭','希望木色、占地與整體家具協調，也想知道之後可否調整。','搭配實景照片、量測與組件說明，避免只堆風格形容詞。','引導看系列、顏色與配件，仍需確認時提交空間照片與尺寸。']
 ];
 const cluster=[
  ['貓跳台推薦、實木貓跳台','搜尋者正在做商品比較','先解釋比較維度：材質、平台、安裝、維護與擴充條件。','選購指南，合併回答相近問法，不為每個近義字另寫一篇。','分類與實際商品頁；有客製問題時再引導諮詢。'],
  ['大型貓跳台、緬因貓貓跳台','搜尋者在確認自家體型是否合適','依原廠資料說明平台與配置條件；不由品種直接推論承重。','大型貓選購重點：需要量什麼、看什麼，以及哪些情況要先問。','山岳等相關系列與規格確認；實際推薦由品牌核對。'],
  ['曼赤肯貓跳台、階梯貓跳台','搜尋者在意貓咪如何上下','把層間落差、踏點與活動動線畫清楚，輔以真實配置。','階梯式與一般配置差異；不延伸成醫療或關節療效。','環繞階梯貓塔與配件資訊，確認個體活動需求。'],
  ['頂天立地貓跳台、客製化貓跳台','搜尋者在確認家裡放不放得下','先確認天花板、占地、門窗與動線，再說配置與擴充。','客製前的量測指南：照片、尺寸、貓咪資料與希望解決的問題。','貓柱與配件系列；需要個別判斷時走配置諮詢。']
 ];
 function panel(type,index){
  const el=$(`#${type}-panel`); if(!el)return;
  if(type==='persona'){
   const [q,a,b,c,d]=persona[index];el.innerHTML=`<p class="label">${a}</p><h3 class="search-phrase">${q}</h3><div class="intent-grid"><div><p class="label">飼主在意</p><p>${b}</p></div><div><p class="label">文章回答</p><p>${c}</p></div><div><p class="label">商品承接</p><p>${d}</p></div></div>`;
  }else if(type==='cluster'){
   const [q,a,b,c,d]=cluster[index];el.innerHTML=`<p class="label">${a}</p><h3 class="search-phrase">${q}</h3><div class="intent-grid"><div><p class="label">需要的答案</p><p>${b}</p></div><div><p class="label">文章方向</p><p>${c}</p></div><div><p class="label">下一步</p><p>${d}</p></div></div>`;
  }else renderOther(index);
  el.classList.remove('tab-panel');void el.offsetWidth;el.classList.add('tab-panel');
 }
 $$('[data-tabs]').forEach(list=>{
  const buttons=[...list.querySelectorAll('[role=tab]')],type=list.dataset.tabs;
  function select(i,focus){buttons.forEach((b,k)=>{b.setAttribute('aria-selected',String(i===k));b.tabIndex=i===k?0:-1;});const p=$(`#${type}-panel`);p.setAttribute('aria-labelledby',`${type}-${i}`);panel(type,i);if(focus)buttons[i].focus();}
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>select(i,false));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%buttons.length;if(e.key==='ArrowLeft')n=(i-1+buttons.length)%buttons.length;if(e.key==='Home')n=0;if(e.key==='End')n=buttons.length-1;if(n!==undefined){e.preventDefault();select(n,true);}});});select(0,false);
 });
 function renderOther(index){
  const ids=['yiwei','dongyang','agisoncat','cutepets-com-tw'],d=window.CASES[ids[index]],g=d.gsc;
  const description=[
   ['明確品種需求，讓家長認識品牌','「金漸層」指定期間平均位置 2.67，99,456 次曝光、2,933 次點擊。這是查詢資料，與下方全站總量不同。','MASCOTIAN 可從具體體型需求出發，再接到家具選購條件。'],
   ['先回答問題，再讓飼主了解訓練服務','「大型犬」指定期間平均位置 3.64，48,925 次曝光、1,602 次點擊。公開客戶回饋表示課程詢問增加，沒有可核實的單一文章轉換率。','本案可把配置問題接到有效諮詢，並另外記錄詢問品質。'],
   ['搜尋與生意的關係，需要分開驗證','業主估計每 10 位客人約 3 位從 Google 找到貓舍；同期亦有廣告。這是業主回饋，不能當成已驗證的自然搜尋轉換率。','本案從一開始區分自然搜尋、廣告與回訪，避免把所有訂單歸給 SEO。'],
   ['小量實績，也如實呈現','「寵物用品店」指定期間平均位置 3.34，465 次曝光、11 次點擊。資料期較短，不能因排名數字好看就推論大量訂單。','本案逐步看實際量測與商品行為，保留早期規模，不只選有利數字。']
  ][index];
  $('#other-panel').innerHTML=`<div class="grid2"><div><p class="label">${esc(d.name)}</p><h3>${description[0]}</h3><p class="lead">${description[1]}</p><a href="https://makarma-client-results.gorgeousamy2022.chatgpt.site/clients/${d.id}/" target="_blank" rel="noopener noreferrer">查閱公開完整案例</a></div><div><p class="label">全站 GSC 網頁搜尋</p><div class="metric-row"><div class="metric"><strong>${fmt(g.total.clicks)}</strong><span>自然搜尋點擊（次）</span></div><div class="metric"><strong>${fmt(g.total.impressions)}</strong><span>自然搜尋曝光（次）</span></div></div><p class="period">${g.start}～${g.end} · 2026-11-07 匯入</p><div class="inset"><p>${description[2]}</p></div></div></div>`;
 }
 function drawCase(box){
  const id=box.dataset.case,g=window.CASES[id].gsc,entries=Object.entries(g.monthly).filter(([month])=>month<='2026-10'),sel=box.querySelector('select');
  const period=([m,v])=>`${m}${v.complete?'（完整月）':`（${m===g.start.slice(0,7)?g.start.slice(8):'01'}～${String(m===g.end.slice(0,7)?g.end.slice(8):new Date(Number(m.slice(0,4)),Number(m.slice(5)),0).getDate()).padStart(2,'0')}日）`}`;
  sel.innerHTML='<option value="all">查看所有月份</option>'+entries.map((e,i)=>`<option value="${i}">${period(e)}</option>`).join('');
  box.querySelector('tbody').innerHTML=entries.map(e=>`<tr><th>${e[0]}</th><td>${fmt(e[1].clicks)}</td><td>${fmt(e[1].impressions)}</td><td>${period(e).replace(e[0],'')}</td></tr>`).join('');
  let W,H,L,R,T,B,pw,ph;
  const maxC=Math.ceil(Math.max(...entries.map(e=>e[1].clicks))/1000)*1000,maxI=Math.ceil(Math.max(...entries.map(e=>e[1].impressions))/50000)*50000;
  const x=i=>L+i/(entries.length-1)*pw,y=(v,max)=>T+(1-v/max)*ph;
  function render(){
   const chosen=sel.value==='all'?-1:Number(sel.value);
   W=mq.matches?350:850;H=mq.matches?270:300;L=mq.matches?53:66;R=mq.matches?57:75;T=34;B=45;pw=W-L-R;ph=H-T-B;
   let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${id==='munchee'?'貪貪':'鴻炎'}每月點擊與曝光雙曲線，2025年7月至2026年10月，首月不完整"><text x="${L}" y="18" fill="#98785b">點擊（次）</text><text x="${W-R}" y="18" text-anchor="end" fill="#667369">曝光（次）</text>`;
   for(let i=0;i<=4;i++){
    const yy=T+i/4*ph;s+=`<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#e4dfd6"/><text x="${L-10}" y="${yy+5}" text-anchor="end">${fmt(maxC*(1-i/4))}</text><text x="${W-R+10}" y="${yy+5}">${mq.matches?(maxI*(1-i/4)/10000).toLocaleString('en-US',{maximumFractionDigits:1})+'萬':fmt(maxI*(1-i/4))}</text>`;
   }
   for(const [key,max,color] of [['clicks',maxC,'#98785b'],['impressions',maxI,'#667369']]){
    entries.forEach((e,i)=>{if(i){const prev=entries[i-1];s+=`<path data-line="${key}" d="M${x(i-1)},${y(prev[1][key],max)} L${x(i)},${y(e[1][key],max)}" fill="none" stroke="${color}" stroke-width="3" ${!prev[1].complete||!e[1].complete?'stroke-dasharray="5 5"':''}/>`;}s+=`<circle cx="${x(i)}" cy="${y(e[1][key],max)}" r="${i===chosen?6:3}" fill="${color}" ${i===chosen?'stroke="#fff" stroke-width="2"':''}/>`;});
   }
   entries.forEach((e,i)=>{if((i%(mq.matches?4:3)===0&&i<entries.length-2)||i===entries.length-1)s+=`<text x="${x(i)}" y="${H-15}" text-anchor="middle">${mq.matches?e[0].slice(2,4)+'/'+Number(e[0].slice(5)):e[0].slice(2)}${!e[1].complete?'*':''}</text>`;});
   if(chosen>=0)s+=`<line x1="${x(chosen)}" x2="${x(chosen)}" y1="${T}" y2="${H-B}" stroke="#b7ac9c" stroke-dasharray="3 4"/>`;
   s+='</svg>';box.querySelector('.chart').innerHTML=s;
   box.querySelector('.month-readout').innerHTML=chosen<0?`圖表期間：${g.start}～2026-10-31。<strong>* 首月為不完整月份</strong>，虛線連接，不能當完整月比較。`:`${period(entries[chosen])}：<strong>${fmt(entries[chosen][1].clicks)}</strong> 次點擊，<strong>${fmt(entries[chosen][1].impressions)}</strong> 次曝光。${entries[chosen][1].complete?'完整月觀察。':'此月資料不完整，不與完整月份直接比較。'}`;
  }
  sel.addEventListener('change',render);mq.addEventListener('change',render);render();
 }
 $$('[data-case]').forEach(drawCase);
 $('#source-open').addEventListener('click',()=>{closeMenu();$('#sources').showModal();});
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));
 $$('[data-image]').forEach(b=>b.addEventListener('click',()=>{
  $('#lightbox').classList.remove('zoomed');$('#zoom').textContent='查看原尺寸';
  $('#lightbox-caption').textContent=b.dataset.caption;$('#lightbox-image').src=b.dataset.image;$('#lightbox-image').alt=b.dataset.caption;$('#lightbox').showModal();
 }));
 $('#zoom').addEventListener('click',()=>{const z=$('#lightbox').classList.toggle('zoomed');$('#zoom').textContent=z?'符合視窗':'查看原尺寸';});
 $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
 if(window.KEYWORDS?.rows?.length){
  const d=window.KEYWORDS,rows=d.rows.filter(r=>Number(r.monthly)>0);
  $('#keyword-metrics').innerHTML=`<p class="period">Google Ads Keyword Planner｜${esc(d.region)}／${esc(d.language)}／Google Search｜${esc(d.period)}｜查詢 ${esc(d.date)}</p><div class="table-wrap"><table><thead><tr><th>完整搜尋詞</th><th>平均月搜尋量（次）</th><th>頁首廣告出價低～高（NT$）</th></tr></thead><tbody>${rows.map(r=>`<tr><th>${esc(r.keyword)}</th><td>${fmt(r.monthly)}</td><td>${r.low!=null&&r.high!=null?Number(r.low).toFixed(2)+'～'+Number(r.high).toFixed(2):'尚未取得'}</td></tr>`).join('')}</tbody></table></div><p class="note">出價為歷史廣告參考，不是 SEO 費用、SEO 難度、保證實付 CPC 或可節省金額；搜尋量不是品牌可取得人數或訂單。</p>`;
  $('#keyword-source').innerHTML=`<article class="source-item"><h3>本案關鍵字市場數據</h3><p>第7頁；${esc(d.source)}；查詢日${esc(d.date)}；${esc(d.region)}／${esc(d.language)}／Google Search；幣別TWD。</p><p>資料期間${esc(d.period)}。只呈現實際回傳且平均月搜尋量大於0的詞；未回傳的出價保留尚未取得。</p></article>`;
 }
})();
