/* AI Prototype Studio Inspector · framework independent, no dependencies */
(function(){
 const script=document.currentScript;
 const options=window.AIPrototypeInspectorConfig||{};
 const allowed=options.allowedParentOrigins||(script?.dataset.studioOrigin?[script.dataset.studioOrigin]:[]);
 if(window.parent===window||!Array.isArray(allowed)||!allowed.length||window.__AIPrototypeInspector)return;
 window.__AIPrototypeInspector=true;
 const NS='ai-prototype-studio',V=1,idPattern=/^[a-zA-Z][a-zA-Z0-9._:-]{0,119}$/;
 let ctx=null,parentOrigin=null,mode='preview',hovered=null,selected=null,scheduled=false,forceNext=false,lastContext='';
 const host=document.createElement('div');host.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:2147483647';
 const shadow=host.attachShadow({mode:'closed'});
 shadow.innerHTML='<style>.box{position:fixed;box-sizing:border-box;border:2px solid #6757e8;background:#7363ed12;border-radius:5px;display:none;pointer-events:none}.selected{border-style:dashed;background:transparent}.label{position:absolute;left:-2px;bottom:100%;max-width:320px;padding:4px 8px;border-radius:4px 4px 0 0;background:#6757e8;color:white;font:11px/1.5 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><div class="box selected"></div><div class="box"><span class="label"></span></div>';
 const [selection,highlight]=shadow.querySelectorAll('.box');
 function mount(){document.documentElement.appendChild(host)}
 if(document.documentElement)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
 function emit(type,payload={}){if(ctx)parent.postMessage({namespace:NS,version:V,...ctx,type,payload},parentOrigin)}
 function semantic(value){return typeof value==='string'&&idPattern.test(value)?value:null}
 function visible(el){
  if(!(el instanceof Element)||!el.isConnected||el===host||!el.getClientRects().length)return false;
  for(let node=el;node instanceof Element;node=node.parentElement){
   const style=getComputedStyle(node);
   if(node.hidden||style.display==='none'||style.visibility==='hidden'||style.visibility==='collapse')return false;
  }
  const r=el.getBoundingClientRect();return r.width>0&&r.height>0;
 }
 function layerOrder(el){let order=0;for(let node=el;node instanceof Element;node=node.parentElement){const z=Number.parseInt(getComputedStyle(node).zIndex,10);if(Number.isFinite(z))order=Math.max(order,z)}return order}
 function currentSurface(){
  const surfaces=[...document.querySelectorAll('[data-req-surface],dialog[open],[role="dialog"]')].filter(visible);
  const dialogs=surfaces.filter(el=>el.dataset.reqLayer==='dialog'||el.matches('dialog[open],[role="dialog"]'));
  if(dialogs.length)return dialogs.map((el,index)=>({el,index,z:layerOrder(el)})).sort((a,b)=>a.z-b.z||a.index-b.index).at(-1).el;
  return surfaces.at(-1)||document.body||document.documentElement;
 }
 function rectangle(el){if(!visible(el))return null;const r=el.getBoundingClientRect(),round=n=>Math.round(n*100)/100;return {x:round(r.left),y:round(r.top),width:round(r.width),height:round(r.height)}}
 // Labels are declared metadata, never field values, table cells, filenames or free-form content.
 function safeText(el){return (el?.dataset.reqLabel||semantic(el?.dataset.reqElement)||semantic(el?.dataset.reqId)||el?.tagName||'').trim().slice(0,120)}
 function description(el){return {reqId:semantic(el?.dataset.reqId),elementId:semantic(el?.dataset.reqElement),moduleId:semantic(el?.closest('[data-req-module]')?.dataset.reqModule),sectionId:semantic(el?.closest('[data-req-section]')?.dataset.reqSection),tagName:el?.tagName||'',text:safeText(el),rect:rectangle(el)}}
 function surfaceNodes(root){return [root,...root.querySelectorAll('[data-req-id]')].filter(el=>semantic(el.dataset.reqId)&&!el.closest('[data-req-context-ignore]')&&visible(el))}
 function context(){
  const root=currentSurface(),pageRoot=root.closest('[data-req-page]');
  return {pageId:semantic(root.dataset.reqPage)||semantic(pageRoot?.dataset.reqPage)||ctx?.pageId||'',surfaceId:semantic(root.dataset.reqSurface)||'page',title:(root.dataset.reqTitle||document.title||'原型页面').slice(0,160),viewport:{width:window.innerWidth,height:window.innerHeight},elements:surfaceNodes(root).slice(0,1000).map(description)};
 }
 function draw(el,box){
  const root=currentSurface();
  if(mode!=='edit'||!visible(el)||(root!==el&&!root.contains(el))){box.style.display='none';return}
  const r=el.getBoundingClientRect();Object.assign(box.style,{display:'block',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
 }
 function redraw(){draw(hovered,highlight);draw(selected,selection)}
 function schedule(force=false){
  forceNext=forceNext||force;if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;redraw();if(!ctx)return;const payload=context(),signature=JSON.stringify(payload);if(forceNext||signature!==lastContext){lastContext=signature;emit('CONTEXT_CHANGED',payload)}forceNext=false});
 }
 function target(el){return el instanceof Element?(el.closest('[data-req-id]')||el.closest('[data-req-section],[data-req-module]')||el.closest('button,a,input,select,textarea,[role="button"]')||el):null}
 function locate(reqId,elementId){
  const captured=ctx.sessionId;
  const candidates=()=>surfaceNodes(currentSurface()).filter(el=>el.dataset.reqId===reqId&&(!elementId||el.dataset.reqElement===elementId));
  const apply=()=>{if(ctx.sessionId!==captured)return;const nodes=candidates();selected=nodes.find(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth})||nodes[0]||null;selected?.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});redraw();emit('LOCATED',{count:nodes.length,reqId,elementId:elementId||selected?.dataset.reqElement||null,rect:rectangle(selected)});schedule(true)};
  if(!candidates().length){window.dispatchEvent(new CustomEvent('ai-prototype:reveal',{detail:{reqId,elementId:elementId||null}}));setTimeout(apply,100)}else apply();
 }
 window.addEventListener('message',e=>{
  const m=e.data;
  if(e.source!==parent||!allowed.includes(e.origin)||!m||m.namespace!==NS||m.version!==V||typeof m.sessionId!=='string'||typeof m.projectId!=='string'||typeof m.pageId!=='string'||!m.payload||typeof m.payload!=='object')return;
  if(m.type==='INIT'){ctx={sessionId:m.sessionId,projectId:m.projectId,pageId:m.pageId};parentOrigin=e.origin;mode='preview';lastContext='';redraw();emit('INITIALIZED');schedule(true);return}
  if(!ctx||e.origin!==parentOrigin||m.sessionId!==ctx.sessionId||m.projectId!==ctx.projectId||m.pageId!==ctx.pageId)return;
  if(m.type==='SET_MODE'&&['preview','edit'].includes(m.payload.mode)){mode=m.payload.mode;hovered=null;selected=null;redraw();emit('MODE_CHANGED',{mode});schedule(true)}
  if(m.type==='REQUEST_CONTEXT')schedule(true);
  if(m.type==='LOCATE_REQUIREMENT'&&semantic(m.payload.reqId)&&(!m.payload.elementId||semantic(m.payload.elementId)))locate(m.payload.reqId,m.payload.elementId);
 });
 window.addEventListener('pointermove',e=>{if(mode==='edit'){hovered=target(e.target);draw(hovered,highlight);highlight.querySelector('.label').textContent=safeText(hovered)||'未关联需求 · 点击添加'}},true);
 window.addEventListener('pointerout',e=>{if(!e.relatedTarget){hovered=null;redraw()}},true);
 const blocked=['pointerdown','pointerup','mousedown','mouseup','click','dblclick','auxclick','contextmenu','touchstart','touchend','keydown','keyup','keypress','submit','beforeinput','input','change','dragstart','drop'];
 for(const type of blocked)window.addEventListener(type,e=>{
  if(mode!=='edit')return;if(type.startsWith('key')&&e.key==='Tab')return;e.preventDefault();e.stopImmediatePropagation();
  if(type==='click'){selected=target(e.target);redraw();emit('ELEMENT_SELECTED',description(selected));schedule(true)}
 },{capture:true,passive:false});
 window.addEventListener('scroll',()=>schedule(),true);window.addEventListener('resize',()=>schedule());
 window.addEventListener('ai-prototype:context-changed',()=>schedule(true));
 new MutationObserver(records=>{if(records.some(record=>record.target!==host&&!host.contains(record.target)))schedule()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','open','data-req-id','data-req-element','data-req-surface','data-req-page','data-req-title','data-req-layer','data-req-context-ignore']});
 // The source origin and frame-bound INIT identity remain unchanged as business surfaces change.
 allowed.forEach(origin=>parent.postMessage({namespace:NS,version:V,type:'READY',sessionId:'',projectId:'',pageId:'',payload:{}},origin));
})();
