const header=document.querySelector(".nav"),menu=document.querySelector(".menu");
if(menu)menu.addEventListener("click",()=>{const open=header.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))});
document.querySelectorAll('.nav a[href^="#"]').forEach(a=>a.addEventListener("click",()=>header.classList.remove("open")));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

const modal=document.getElementById("contact-modal");
const openModal=()=>{modal.classList.add("open");document.body.classList.add("modal-open");setTimeout(()=>modal.querySelector("input")?.focus(),100)};
const closeModal=()=>{modal.classList.remove("open");document.body.classList.remove("modal-open")};
document.querySelectorAll(".js-contact").forEach(b=>b.addEventListener("click",openModal));
if(new URLSearchParams(location.search).get("contact")==="1"){openModal();history.replaceState(null,"",location.pathname+location.hash)}
modal.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal()});

const data={
 invoice:["Exception flagged for review","A suggested summary identifies the mismatch and links the relevant source records for a person to review."],
 report:["Variance summary prepared for review","The workflow groups material movements, retrieves supporting context and drafts a concise management summary."],
 support:["Case evidence assembled","The workflow organises the issue history, highlights unresolved points and drafts a review-ready case summary."]
};
document.querySelectorAll(".request").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".request").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 const [t,p]=data[btn.dataset.flow];document.getElementById("flow-title").textContent=t;document.getElementById("flow-text").textContent=p;
}));
document.getElementById("run-flow")?.addEventListener("click",()=>{
 const tabs=[...document.querySelectorAll(".flow-tabs b")],state=document.getElementById("run-state");tabs.forEach(x=>x.classList.remove("on"));state.textContent="Running…";
 let i=0;const timer=setInterval(()=>{tabs.forEach(x=>x.classList.remove("on"));tabs[i].classList.add("on");i++;if(i===tabs.length){clearInterval(timer);setTimeout(()=>state.textContent="Ready for human review",250)}},420);
});
// V60: Live Demos dropdown. On the homepage a choice selects that demo in the stage; elsewhere it opens the demo page.
(function(){
 const dd=document.getElementById('nav-dd'); if(!dd) return;
 const btn=dd.querySelector('.nav-dd-btn');
 const setOpen=o=>{dd.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));};
 btn.addEventListener('click',e=>{e.stopPropagation();setOpen(!dd.classList.contains('open'));});
 let hoverTimer;
 if(matchMedia('(hover:hover) and (min-width:901px)').matches){
  dd.addEventListener('mouseenter',()=>{clearTimeout(hoverTimer);setOpen(true);});
  dd.addEventListener('mouseleave',()=>{hoverTimer=setTimeout(()=>setOpen(false),180);});
 }
 document.addEventListener('click',e=>{if(!dd.contains(e.target))setOpen(false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
 document.querySelectorAll('.pillar-demos a[data-stage], .dd-link[data-stage]').forEach(a=>a.addEventListener('click',e=>{
  if(typeof window.AQ_STAGE_SELECT!=='function') return;      // not on the homepage: follow the link
  e.preventDefault(); setOpen(false);
  document.querySelector('.nav')?.classList.remove('open');
  window.AQ_STAGE_SELECT(a.dataset.stage);
  const tgt=document.getElementById('demos'); if(tgt&&tgt.scrollIntoView) tgt.scrollIntoView({behavior:'smooth',block:'start'});
 }));
})();

// V62: live demo section. The selected demo runs inside a scaled frame; nothing loads until the section is near the viewport.
(function(){
 const stage=document.getElementById('demos'); if(!stage) return;
 const items=[...stage.querySelectorAll('.ds-item')], frame=document.getElementById('ds-frame'), iframe=document.getElementById('ds-iframe'),
       loading=document.getElementById('ds-loading'), title=document.getElementById('ds-title'), blurb=document.getElementById('ds-blurb'),
       open=document.getElementById('ds-open'), url=document.getElementById('ds-url'), tryEl=document.getElementById('ds-try'),
       capTag=document.getElementById('ds-cap'), indTags=document.getElementById('ds-inds'),
       tourBtn=document.getElementById('ds-tour'), prog=document.getElementById('ds-progress'), progBar=prog.querySelector('i'),
       filterBox=document.getElementById('ds-filter'), filterName=document.getElementById('ds-filter-name'), filterClear=document.getElementById('ds-filter-clear'), list=document.getElementById('ds-list');
 const BASE_W=1280, BASE_H=1120, TOUR_MS=15000;
 const INDS={finance:'Financial Services',realestate:'Real Estate',manufacturing:'Manufacturing',healthcare:'Healthcare',retail:'Retail & Consumer',tech:'Technology',mining:'Mining & Resources'};
 let current=null, armed=false, tour=false, tourStart=0, tourTick=null, filter=null;
 const visible=()=>items.filter(b=>!b.classList.contains('dim')&&(list.classList.contains('expanded')||list.classList.contains('filtering')||!b.classList.contains('more')));
 function fit(){ const w=frame.clientWidth; const base=w<600?900:BASE_W; const s=w/base; iframe.style.width=base+'px'; iframe.style.transform='scale('+s+')'; iframe.style.height=Math.max(BASE_H, frame.clientHeight/s)+'px'; }
 function load(item){
  current=item; items.forEach(b=>b.classList.toggle('on',b===item));
  const slug=item.dataset.demo, auto=item.dataset.autorun?'?embed=1&autorun=1':'?embed=1';
  title.innerHTML=item.dataset.title; blurb.textContent=item.dataset.blurb; tryEl.innerHTML=item.dataset.try||'';
  capTag.dataset.cap=item.dataset.cap; capTag.innerHTML='Part of <b>'+item.dataset.capname+'</b> \u2192';
  indTags.innerHTML=item.dataset.ind.split(' ').map(k=>'<button type="button" class="ds-tag-ind" data-ind="'+k+'">'+(INDS[k]||k)+'</button>').join('');
  open.href='demos/'+slug+'.html'; if('demoLink' in open.dataset) open.dataset.demoLink=slug; url.textContent='assetquant.ai/demos/'+slug;
  if(!armed) return;
  frame.classList.add('switching'); loading.classList.remove('hide');
  if(window.AQ_DEMOS&&window.AQ_DEMOS[slug]){ iframe.name=item.dataset.autorun?'aq-embed-autorun':'aq-embed'; iframe.removeAttribute('src'); iframe.srcdoc=window.AQ_DEMOS[slug](); }
  else { iframe.removeAttribute('srcdoc'); iframe.src='demos/'+slug+'.html'+auto; }
  if(item.scrollIntoView&&list.scrollHeight>list.clientHeight) item.scrollIntoView({block:'nearest'});
 }
 function step(dir){ const v=visible(); if(!v.length) return; let i=v.indexOf(current); i=(i+dir+v.length)%v.length; load(v[i]); }
 iframe.addEventListener('load',()=>{ if(iframe.src||iframe.srcdoc){ loading.classList.add('hide'); frame.classList.remove('switching'); } });
 items.forEach(b=>b.addEventListener('click',()=>{ stopTour(); load(b); window.dispatchEvent(new CustomEvent('aq:engaged')); }));
 document.getElementById('ds-prev').addEventListener('click',()=>{stopTour();step(-1);});
 document.getElementById('ds-next').addEventListener('click',()=>{stopTour();step(1);});
 document.addEventListener('keydown',e=>{ const t=e.target; if(t&&t.closest&&t.closest('input,textarea,select,iframe')) return; const r=stage.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return; if(e.key==='ArrowRight'){stopTour();step(1);} if(e.key==='ArrowLeft'){stopTour();step(-1);} });
 /* capability tag: open the matching accordion row */
 capTag.addEventListener('click',e=>{ e.preventDefault(); const el=document.getElementById(capTag.dataset.cap); if(!el) return; el.classList.add('pillar-flash'); setTimeout(()=>el.classList.remove('pillar-flash'),1600); if(el.scrollIntoView) el.scrollIntoView({behavior:'smooth',block:'center'}); });
 /* industry tags under the caption and the strip above both drive the same filter */
 indTags.addEventListener('click',e=>{ const b=e.target.closest('.ds-tag-ind'); if(b) applyFilter(filter===b.dataset.ind?null:b.dataset.ind); });
 /* tour */
 function startTour(){ if(!armed){armed=true;load(current);} tour=true; tourBtn.setAttribute('aria-pressed','true'); tourBtn.querySelector('.ds-tour-l').textContent='Stop the tour'; tourBtn.querySelector('.ds-tour-ic').textContent='\u25a0'; prog.hidden=false; tourStart=performance.now(); clearInterval(tourTick); tourTick=setInterval(()=>{ const t=(performance.now()-tourStart)/TOUR_MS; progBar.style.width=Math.min(100,t*100)+'%'; if(t>=1){ step(1); tourStart=performance.now(); } },400); }
 function stopTour(){ if(!tour) return; tour=false; clearInterval(tourTick); tourBtn.setAttribute('aria-pressed','false'); tourBtn.querySelector('.ds-tour-l').textContent='Play the tour'; tourBtn.querySelector('.ds-tour-ic').textContent='\u25b6'; prog.hidden=true; progBar.style.width='0'; }
 tourBtn.addEventListener('click',()=>{ tour?stopTour():startTour(); window.dispatchEvent(new CustomEvent('aq:engaged')); });
 frame.addEventListener('mouseenter',()=>{ if(tour) clearInterval(tourTick); });
 frame.addEventListener('mouseleave',()=>{ if(tour){ tourStart=performance.now()-(parseFloat(progBar.style.width)||0)/100*TOUR_MS; startTour(); } });
 /* industry filter */
 function applyFilter(key){
  filter=key; stopTour();
  document.querySelectorAll('.ds-ind .ind').forEach(b=>b.classList.toggle('on',(b.dataset.ind||'')===(key||'')));
  list.classList.toggle('filtering',!!key);
  items.forEach(b=>b.classList.toggle('dim',!!key&&!(' '+b.dataset.ind+' ').includes(' '+key+' ')));
  filterBox.hidden=!key; if(key) filterName.textContent=INDS[key]||key;
  const v=visible(); if(key&&v.length&&!v.includes(current)){ armed=true; load(v[0]); }
 }
 document.querySelectorAll('.ds-ind .ind').forEach(b=>b.addEventListener('click',()=>{ const k=b.dataset.ind||null; applyFilter(k); if(!armed){armed=true;load(current);} window.dispatchEvent(new CustomEvent('aq:engaged')); }));
 filterClear.addEventListener('click',()=>applyFilter(null));
 const more=document.getElementById('ds-more');
 if(more) more.addEventListener('click',()=>{ const ex=list.classList.toggle('expanded'); more.setAttribute('aria-expanded',String(ex)); more.firstChild.textContent=ex?'Show the featured six ':'Show all twelve demos '; });
 window.AQ_STAGE_SELECT=slug=>{const b=items.find(x=>x.dataset.demo===slug); if(b){ stopTour(); if(filter&&b.classList.contains('dim')) applyFilter(null); armed=true; load(b); }};
 /* count-up stats */
 const nums=[...stage.querySelectorAll('[data-count]')];
 const countUp=()=>nums.forEach(n=>{ const to=+n.dataset.count; if(!to){n.textContent='0';return;} const t0=performance.now(); const tick=()=>{ const p=Math.min(1,(performance.now()-t0)/900); n.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(tick); }; tick(); });
 /* init */
 const first=stage.querySelector('.ds-item[data-autorun]')||items[0];
 load(first); fit(); window.addEventListener('resize',fit);
 if('ResizeObserver' in window) new ResizeObserver(fit).observe(frame);
 const arm=()=>{ if(armed) return; armed=true; load(current); countUp(); };
 if('IntersectionObserver' in window){ const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ arm(); io.disconnect(); } },{rootMargin:'600px 0px'}); io.observe(stage); }
 else arm();
})();

// V62: privacy and terms open in-page, so nothing leaves the site.
(function(){
 const dlg=document.getElementById('legal'); if(!dlg) return;
 const open=k=>{ ['privacy','terms'].forEach(x=>{ const el=document.getElementById('legal-'+x); if(el) el.hidden=x!==k; }); dlg.hidden=false; dlg.classList.add('open'); document.body.classList.add('modal-open'); document.getElementById('legal-card').scrollTop=0; };
 const close=()=>{ dlg.classList.remove('open'); dlg.hidden=true; document.body.classList.remove('modal-open'); };
 document.querySelectorAll('a[data-legal]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); open(a.dataset.legal); }));
 document.getElementById('legal-close').addEventListener('click',close);
 dlg.addEventListener('click',e=>{ if(e.target===dlg) close(); });
 document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&dlg.classList.contains('open')) close(); });
})();

// V61: reach-out prompt. Shown once per session after genuine engagement; never blocks; collapses to a pill when dismissed.
(function(){
 const box=document.getElementById('reach'), pill=document.getElementById('reach-pill'); if(!box||!pill) return;
 let shown=false, engaged=0;
 const seen=()=>{ try{ return sessionStorage.getItem('aq-reach')==='1'; }catch(e){ return false; } };
 const mark=()=>{ try{ sessionStorage.setItem('aq-reach','1'); }catch(e){} };
 const show=()=>{ if(shown||seen()) return; if(document.body.classList.contains('modal-open')) return; shown=true; box.hidden=false; };
 const dismiss=()=>{ box.hidden=true; pill.hidden=false; mark(); };
 window.addEventListener('aq:engaged',()=>{ engaged++; if(engaged>=2) setTimeout(show,1500); });
 window.addEventListener('scroll',()=>{ const p=(scrollY+innerHeight)/document.documentElement.scrollHeight; if(p>0.6) show(); },{passive:true});
 document.getElementById('reach-x').addEventListener('click',dismiss);
 document.getElementById('reach-later').addEventListener('click',dismiss);
 box.querySelector('.reach-go').addEventListener('click',()=>{ box.hidden=true; pill.hidden=false; mark(); });
 if(seen()) pill.hidden=false;
})();

// V22: capability rows expand to show representative work and live demos.
document.querySelectorAll('.cap-row').forEach(btn=>{
 const toggle=()=>{
  const art=btn.closest('article');
  const open=!art.classList.contains('cap-open');
  document.querySelectorAll('.cap-list article.cap-open').forEach(a=>{a.classList.remove('cap-open');const r=a.querySelector('.cap-row');r.setAttribute('aria-expanded','false');const sym=r.querySelector('.cap-toggle b');if(sym)sym.textContent='+'});
  if(open){art.classList.add('cap-open');btn.setAttribute('aria-expanded','true')}
  const sym=btn.querySelector('.cap-toggle b');if(sym)sym.textContent=open?'−':'+';
 };
 btn.addEventListener('click',toggle);
 btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
});

// V23: excellence cards flip to show what each step means in practice.
document.querySelectorAll('.steps article.flip').forEach(card=>{
 const toggle=()=>{const f=card.classList.toggle('flipped');card.setAttribute('aria-pressed',String(f))};
 card.addEventListener('click',toggle);
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
});

// V36 governance workflow: interactive six-stage control model.
const governanceStages = [
 {badge:'DISCOVERY & CONTEXT',title:'Understand the Decision & Constraints',desc:'Frame the business objective, operating context, stakeholders and constraints before selecting analytical or technology interventions.',tool:'Context & Requirements Mapper',human:'Engagement Lead',telemetry:'Context Signals',mode:'SCOPED INTAKE',lines:['OBJECTIVE_CONTEXT_CAPTURED','CONSTRAINTS_MAPPED','DECISION_SCOPE_CONFIRMED'],risk:'Defined Scope',control:'Human Framing'},
 {badge:'EVIDENCE RETRIEVAL',title:'Retrieve Relevant Evidence',desc:'Bring together the source data, documents, prior knowledge and operational evidence needed to support the decision.',tool:'Evidence Retrieval Layer',human:'Domain Analyst',telemetry:'Evidence Trace',mode:'SOURCE CONTROL',lines:['SOURCE_SET_CONNECTED','RELEVANT_EVIDENCE_RETRIEVED','PROVENANCE_LINKS_READY'],risk:'Source Bounded',control:'Evidence Traceable'},
 {badge:'ANALYTICAL ENGINE',title:'Analyse Patterns, Risks & Scenarios',desc:'Apply analytics and AI where useful to surface patterns, exceptions, risks, opportunities and plausible scenarios.',tool:'Analytics & AI Workbench',human:'Analytics Lead',telemetry:'Analysis Signals',mode:'ASSISTED ANALYSIS',lines:['PATTERN_DETECTION_ACTIVE','SCENARIOS_EVALUATED','IMPACT_SIGNALS_GENERATED'],risk:'Model Guardrails',control:'Explainable Output'},
 {badge:'VALIDATION LAYER',title:'Validate Data, Rules & Assumptions',desc:'Test outputs against validated data, business rules, thresholds and known constraints before recommendations move forward.',tool:'Validation & Rules Engine',human:'Control Owner',telemetry:'Validation Status',mode:'CONTROL GATE',lines:['DATA_CHECKS_PASSED','BUSINESS_RULES_APPLIED','ASSUMPTIONS_FLAGGED'],risk:'Rule Governed',control:'Validation Required'},
 {badge:'HUMAN GOVERNANCE',title:'Review Recommendations & Trade-offs',desc:'Present evidence, assumptions, quantified impact and trade-offs so accountable people can challenge, refine and approve the path forward.',tool:'Decision Review Workspace',human:'Accountable Decision Owner',telemetry:'Review State',mode:'HUMAN REVIEW',lines:['RECOMMENDATION_PACK_READY','TRADE_OFFS_VISIBLE','HUMAN_APPROVAL_REQUIRED'],risk:'Approval Gated',control:'Human Accountable'},
 {badge:'OPERATIONAL INTEGRATION',title:'Execution, Deployment & Value Realisation',desc:'Insights translate into operational change, workflow automation and live production systems, with continuous KPI tracking and outcome feedback.',tool:'Enterprise Delivery Layer',human:'Transformation Operations Lead',telemetry:'Execution Telemetry',mode:'CONTINUOUS DELIVERY',lines:['DEPLOY_INTEGRATED_WORKFLOWS','TELEMETRY_STREAM_CONNECTED','VALUE_REALISATION_ACTIVE'],risk:'Governed Rollout',control:'Human Accountable'}
];
const stageTabs=[...document.querySelectorAll('.stage-tab')];
function renderGovernanceStage(i){const s=governanceStages[i];if(!s)return;stageTabs.forEach((b,n)=>b.classList.toggle('active',n===i));
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};set('stage-badge',s.badge);set('stage-count',`Step ${i+1} of 6`);set('stage-title',s.title);set('stage-description',s.desc);set('stage-tool',s.tool);set('stage-human',s.human);set('telemetry-title',s.telemetry);set('telemetry-mode',s.mode);set('stage-risk',s.risk);set('stage-control',s.control);
 typeTerminal(s.lines,s.mode);}
// V41: the telemetry terminal types its signals live for the selected stage.
let termTimers=[];
function typeTerminal(lines,mode){
 const t=document.getElementById('stage-terminal');if(!t)return;
 termTimers.forEach(clearTimeout);termTimers=[];
 t.classList.remove('signal-run');
 const statusLine='> '+String(mode||'STAGE').replace(/\s+/g,'_')+' :: ACTIVE';
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){
  t.innerHTML=lines.map(x=>`<code>&gt; ${x}</code>`).join('')+`<code class="term-ok">${statusLine.replace('>','&gt;')}</code>`;return;
 }
 t.innerHTML='';
 let li=0;
 const nextLine=()=>{
  const isStatus=li===lines.length;
  if(li>lines.length)return;
  const code=document.createElement('code');
  code.className='typing'+(isStatus?' term-ok':'');
  t.appendChild(code);
  const text=isStatus?statusLine:'> '+lines[li];
  const start=performance.now(),cps=75;
  const tick=()=>{
   const ci=Math.min(text.length,Math.max(1,Math.floor((performance.now()-start)/1000*cps)));
   code.textContent=text.slice(0,ci);
   if(ci<text.length){termTimers.push(setTimeout(tick,26));}
   else{code.classList.remove('typing');li++;termTimers.push(setTimeout(nextLine,isStatus?0:140));}
  };
  termTimers.push(setTimeout(tick,30));
 };
 nextLine();
}
stageTabs.forEach((b,i)=>b.addEventListener('click',()=>renderGovernanceStage(i)));if(stageTabs.length)renderGovernanceStage(0);


// V64: Contact is email-only; no third-party form submission.\n\n// V40: visible workflow motion attached to the actual V36 elements.
(() => {
  const tabs = [...document.querySelectorAll('.stage-tab')];
  const panel = document.querySelector('.stage-panel');

  function animateStage() {
    if (!panel) return;
    panel.classList.add('processing');
    setTimeout(() => {
      panel.classList.remove('processing');
    }, 330);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => setTimeout(animateStage, 20)));
  setTimeout(animateStage, 250);
})();

// V63: governance workflow opens on request from the How we work section.
(function(){
 const t=document.getElementById('gov-toggle'), p=document.getElementById('gov-panel'); if(!t||!p) return;
 t.addEventListener('click',()=>{ const open=p.hidden; p.hidden=!open; t.setAttribute('aria-expanded',String(open)); t.textContent=open?'Hide the governance workflow \u2191':'See how we keep AI accountable \u2192'; if(open&&p.scrollIntoView) p.scrollIntoView({behavior:'smooth',block:'start'}); });
})();


// V64.7: Formspree submission, retaining the existing in-page modal.
(()=>{
  const form=document.getElementById('aq-enquiry');
  if(!form)return;
  const status=document.getElementById('aq-form-status');
  const button=form.querySelector('.aq-send');
  const success=document.getElementById('aq-success');
  const done=success?.querySelector('.aq-success-close');
  done?.addEventListener('click',()=>{
    document.querySelector('#contact-modal [data-close]')?.click();
    setTimeout(()=>{success.hidden=true;form.hidden=false;status.hidden=true;},200);
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    button.disabled=true;
    status.hidden=false; status.textContent='Submitting your enquiry…';
    try{
      const response=await fetch(form.action,{
        method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}
      });
      if(!response.ok)throw new Error('Formspree submission failed ('+response.status+')');
      form.reset();
      status.hidden=true; form.hidden=true; success.hidden=false;
    }catch(error){
      console.error('AssetQuant enquiry:',error);
      status.hidden=false; status.textContent='We could not send your enquiry. Please try again or email contactus@assetquant.ai.';
    }finally{button.disabled=false;}
  });
})();

// V64.9.1: keep the floating contact control clear of the footer and legal links.
(()=>{
 const footer=document.querySelector('footer.compact-footer');
 const pill=document.getElementById('reach-pill');
 const reach=document.getElementById('reach');
 if(!footer || !pill || !('IntersectionObserver' in window)) return;
 const observer=new IntersectionObserver(entries=>{
   const atFooter=entries.some(entry=>entry.isIntersecting);
   document.body.classList.toggle('aq-footer-visible',atFooter);
   if(atFooter && reach && !reach.hidden){reach.hidden=true; pill.hidden=false;}
 },{threshold:0,rootMargin:'0px 0px 0px 0px'});
 observer.observe(footer);
})();
