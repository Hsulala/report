const flowData={publish:{label:'目前最常見的狀態',title:'文章持續增加，權重卻被分散。',body:'多篇文章可能回答相似問題，核心服務頁又沒有承接排名與轉換；Google 不容易判斷哪一頁最重要，讀者也不容易走到諮詢。',bars:[['內容數量','88%','多'],['主題聚焦','34%','待整合'],['轉換路徑','24%','待補強']]},search:{label:'搜尋策略的缺口',title:'有題目，卻沒有頁面任務。',body:'文章需要對應明確的搜尋意圖、目標頁與內部連結；否則內容之間會互相競爭，也難以累積主題權威。',bars:[['主題廣度','76%','有基礎'],['頁面分工','29%','待盤點'],['內部連結','22%','待重整']]},convert:{label:'轉換設計的斷點',title:'流量進來，卻沒有被接住。',body:'個人選購、家庭銀髮需求與機構規劃需要不同資訊與行動入口。若所有人都只看到相同按鈕，轉換意願就會在半路消失。',bars:[['專業資訊','82%','豐富'],['行動引導','31%','待補強'],['商機追蹤','18%','待建立']]}};
const topics={home:{title:'家用健身器材怎麼選？',body:'從空間、使用者、訓練目標與預算出發，串連跑步機、健身車、重訓器材與諮詢入口。',words:[['跑步機推薦',2900],['走步機',1900],['健身器材介紹',880],['居家健身器材',720],['家用跑步機推薦',390]]},senior:{title:'銀髮運動與復健設備怎麼規劃？',body:'從安全、活動能力、使用情境與專業建議切入，連到適合個人、日照與照護據點的設備方案。',words:[['肌少症',14800],['復健腳踏車',880],['肌少症運動',590],['銀髮健身',320],['老人復健腳踏車推薦',210]]},space:{title:'一個好用的健身空間怎麼完成？',body:'用場域、預算、使用人數、動線與售後回答企業、建案、社區、學校與政府機關的規劃需求。',words:[['健身房器材',720],['社區健身房',170],['跑步機維修',140],['居家健身房設計',90],['健身房設計',70]]},relax:{title:'按摩椅與舒壓設備怎麼挑？',body:'依使用者、按摩需求、空間、功能與售後服務建立比較標準，幫助消費者縮短選購時間。',words:[['按摩椅推薦',6600],['肩頸按摩器',4400],['腿部按摩機',1300],['按摩椅品牌',880],['氣壓式按摩器',170]]}};
const fmt=n=>n==null?'':Number(n).toLocaleString('en-US');
const journeys={b2c:[['搜尋','「家用跑步機怎麼選」','以需求問題進站'],['理解','比較空間、功能與售後','建立選購信心'],['評估','看商品、案例與門市資訊','降低決策阻力'],['行動','加 LINE／預約諮詢','形成可追蹤詢問']],b2b:[['搜尋','「社區健身房規劃」','以場域需求進站'],['理解','看流程、配置與過往案例','建立專業信任'],['評估','確認預算、時程與維護','降低採購風險'],['行動','提交場域規劃需求','形成可追蹤商機']]};
function setFlow(key){const d=flowData[key],p=document.querySelector('#flowPanel');p.innerHTML=`<p class="mini-label">${d.label}</p><h3>${d.title}</h3><p>${d.body}</p>${d.bars.map(x=>`<div class="flow-metric"><span>${x[0]}</span><i style="--w:${x[1]}"></i><b>${x[2]}</b></div>`).join('')}`}
document.querySelectorAll('.flow-step').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.flow-step').forEach(x=>x.classList.remove('active'));b.classList.add('active');setFlow(b.dataset.flow)}));
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');const d=topics[b.dataset.tab],p=document.querySelector('#topicPanel');p.innerHTML=`<div><p class="mini-label">主題核心</p><h3>${d.title}</h3><p>${d.body}</p></div><div class="keyword-cloud">${d.words.map(x=>`<span>${x[0]} <em>${fmt(x[1])}</em></span>`).join('')}</div><ol><li><b>支柱頁</b>完整選購／規劃指南</li><li><b>延伸文</b>單品比較與使用問題</li><li><b>轉換頁</b>商品／案例／諮詢入口</li></ol>`}));
function setJourney(key){document.querySelector('#journey').innerHTML=journeys[key].map((x,i)=>`${i?'<i>→</i>':''}<div class="${i===3?'journey-end':''}"><span>0${i+1}</span><small>${x[0]}</small><strong>${x[1]}</strong><p>${x[2]}</p></div>`).join('')}
document.querySelectorAll('.persona').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.persona').forEach(x=>x.classList.remove('active'));b.classList.add('active');setJourney(b.dataset.persona)}));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const menu=document.querySelector('#menuButton'),nav=document.querySelector('#chapterNav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
addEventListener('scroll',()=>{const h=document.documentElement;document.querySelector('#progressBar').style.width=`${(h.scrollTop/(h.scrollHeight-h.clientHeight))*100}%`},{passive:true});

// ---------- 關鍵字市場（Google Ads 數據） ----------
(function(){
  const G=window.KW_GROUPS, M=window.KW_META; if(!G) return;
  const keys=Object.keys(G); let cur='home', onlyPri=false, sortKey='vol', sortDir=-1;
  const sum=document.querySelector('#kwSummary'), tabs=document.querySelector('#kwTabs'), panel=document.querySelector('#kwPanel');
  const total=k=>G[k].rows.reduce((a,r)=>a+(r[1]||0),0);
  sum.innerHTML=keys.map(k=>`<button data-k="${k}"><small>${G[k].role}</small><b>${G[k].name}</b><strong>${fmt(total(k))}</strong><span>${G[k].rows.length} 組字・合計月搜尋量</span></button>`).join('');
  tabs.innerHTML=keys.map(k=>`<button class="tab" role="tab" data-k="${k}">${G[k].name}</button>`).join('');
  document.querySelector('#kwPicked').textContent=keys.reduce((a,k)=>a+G[k].rows.length,0);
  document.querySelector('#kwRaw').textContent=fmt(M.rawCount);
  document.querySelector('#kwNodata').innerHTML=(window.KW_NODATA||[]).map(x=>`<span>${x} <em>尚未取得</em></span>`).join('');
  document.querySelector('#kwExcluded').innerHTML=(window.KW_EXCLUDED||[]).map(x=>`<li><b>不列入｜${x[0]}</b>${x[1]}</li>`).join('');
  const col={kw:0,vol:1,comp:2,bid:3};
  function render(){
    const g=G[cur]; let rows=g.rows.slice(); if(onlyPri) rows=rows.filter(r=>r[6]);
    const ci=col[sortKey], cmpRank={'高':3,'中':2,'低':1};
    rows.sort((a,b)=>{let x=a[ci],y=b[ci]; if(sortKey==='comp'){x=cmpRank[x]||0;y=cmpRank[y]||0} if(sortKey==='kw') return sortDir*String(x).localeCompare(String(y),'zh-Hant'); return sortDir*((x??-1)-(y??-1))});
    const max=Math.max(...g.rows.map(r=>r[1]||0));
    const th=(k,l,cls='')=>`<th class="${cls}" data-s="${k}" ${sortKey===k?`aria-sort="${sortDir<0?'descending':'ascending'}"`:''}>${l}</th>`;
    panel.innerHTML=`<div class="kw-panel-head"><div><p class="mini-label">${g.role}</p><h3>${g.name}｜${g.rows.length} 組精選關鍵字</h3><p>${g.note}</p></div><div class="kw-toggle"><button data-p="0" class="${onlyPri?'':'on'}">全部</button><button data-p="1" class="${onlyPri?'on':''}">只看 ◆ 優先</button></div></div>
    <div class="kw-table-wrap"><table class="kw-table"><thead><tr>${th('kw','關鍵字')}${th('vol','月搜尋量')}${th('comp','競爭')}${th('bid','頁首出價上限','num')}<th class="hide-sm">搜尋意圖</th><th class="hide-sm">建議內容方向</th></tr></thead><tbody>
    ${rows.map(r=>`<tr class="${r[6]?'pri':''}"><td class="kw"><b>${r[0]}</b></td><td class="vol"><div class="vol-cell"><i style="--w:${max?Math.max(2,r[1]/max*100):0}%"></i><span>${fmt(r[1])}</span></div></td><td><span class="comp comp-${r[2]}">${r[2]}</span></td><td class="num">${r[3]==null?'<span class="na">未提供</span>':'NT$'+r[3].toFixed(2)}</td><td class="hide-sm"><span class="intent">${r[4]}</span></td><td class="dir hide-sm">${r[5]}</td></tr>`).join('')}
    </tbody></table></div><p class="kw-legend">◆ 建議優先｜資料：${M.source}・${M.geo}・${M.lang}・${M.network}・${M.period}・查詢日 ${M.queried}｜「未提供」為 Google Ads 未回傳，不代表 0</p>`;
    document.querySelectorAll('#kwTabs .tab,#kwSummary button').forEach(b=>b.classList.toggle('active',b.dataset.k===cur));
    panel.querySelectorAll('th[data-s]').forEach(t=>t.addEventListener('click',()=>{const k=t.dataset.s; if(sortKey===k) sortDir*=-1; else {sortKey=k; sortDir=k==='kw'?1:-1} render()}));
    panel.querySelectorAll('.kw-toggle button').forEach(b=>b.addEventListener('click',()=>{onlyPri=b.dataset.p==='1';render()}));
  }
  const pick=k=>{cur=k;render()};
  tabs.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.k)));
  sum.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{pick(b.dataset.k);tabs.scrollIntoView({behavior:'smooth',block:'start'})}));
  render();
})();

// ---------- 案例：每月點擊長條圖 ----------
(function(){
  const C=window.CASE_ULTRA, el=document.querySelector('#caseBars'); if(!C||!el) return;
  const max=Math.max(...C.clicks), n=C.clicks.length;
  el.innerHTML=C.clicks.map((v,i)=>`<div class="bar ${i<3?'early':''} ${C.partialLast&&i===n-1?'partial':''}" style="--h:${v/max*88}%" title="${C.months[i]}：${v} 次"><b>${v}</b><i></i></div>`).join('');
  const lab=document.createElement('div'); lab.className='bar-labels';
  lab.innerHTML=C.months.map((m,i)=>`<span>${i===0||m.endsWith('-01')?m.slice(2,4)+'/':''}${+m.slice(5)}${C.partialLast&&i===n-1?'*':''}</span>`).join('');
  el.after(lab);
})();
