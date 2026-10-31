/* AI Prototype Studio Inspector · framework independent, no dependencies */
(function(){
 const script=document.currentScript;
 const options=window.AIPrototypeInspectorConfig||{};
 const allowed=options.allowedParentOrigins||(script?.dataset.studioOrigin?[script.dataset.studioOrigin]:[]);
 if(window.parent===window||!allowed.length||window.__AIPrototypeInspector)return;
 window.__AIPrototypeInspector=true;
 const NS='ai-prototype-studio', V=1, idPattern=/^[a-zA-Z][a-zA-Z0-9._:-]{0,119}$/;
 let ctx=null,parentOrigin=null,mode='preview',hovered=null,selected=null;
 const host=document.createElement('div');host.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:2147483647';
 const shadow=host.attachShadow({mode:'closed'});shadow.innerHTML='<style>.box{position:fixed;box-sizing:border-box;border:2px solid #6757e8;background:#7363ed12;border-radius:5px;display:none;pointer-events:none}.selected{border-style:dashed;background:transparent}.label{position:absolute;left:-2px;bottom:100%;max-width:320px;padding:4px 8px;border-radius:4px 4px 0 0;background:#6757e8;color:white;font:11px/1.5 system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><div class="box selected"></div><div class="box"><span class="label"></span></div>';
 const [selection,highlight]=shadow.querySelectorAll('.box');
 function mount(){document.documentElement.appendChild(host)}if(document.documentElement)mount();else document.addEventListener('DOMContentLoaded',mount,{once:true});
 function emit(type,payload={}){if(ctx)parent.postMessage({namespace:NS,version:V,...ctx,type,payload},parentOrigin)}
 function target(e){return e instanceof Element?(e.closest('[data-req-id]')||e.closest('[data-req-section],[data-req-module]')||e.closest('button,a,input,select,textarea,[role="button"]')||e):null}
 function draw(el,box){if(!el?.isConnected||mode!=='edit'){box.style.display='none';return}const r=el.getBoundingClientRect();Object.assign(box.style,{display:'block',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'})}
 function redraw(){draw(hovered,highlight);draw(selected,selection)}
 window.addEventListener('message',e=>{
 const m=e.data;if(e.source!==parent||!allowed.includes(e.origin)||!m||m.namespace!==NS||m.version!==V||typeof m.sessionId!=='string'||typeof m.projectId!=='string'||typeof m.pageId!=='string'||!m.payload)return;
 if(m.type==='INIT'){ctx={sessionId:m.sessionId,projectId:m.projectId,pageId:m.pageId};parentOrigin=e.origin;mode='preview';redraw();emit('INITIALIZED');return}
 if(!ctx||e.origin!==parentOrigin||m.sessionId!==ctx.sessionId||m.projectId!==ctx.projectId||m.pageId!==ctx.pageId)return;
 if(m.type==='SET_MODE'&&['preview','edit'].includes(m.payload.mode)){mode=m.payload.mode;hovered=null;selected=null;redraw();emit('MODE_CHANGED',{mode})}
 if(m.type==='LOCATE_REQUIREMENT'&&typeof m.payload.reqId==='string'&&idPattern.test(m.payload.reqId)){
 const reqId=m.payload.reqId;const captured=ctx.sessionId;
 const locate=()=>{if(ctx.sessionId!==captured)return;const nodes=[...document.querySelectorAll('[data-req-id]')].filter(n=>n.dataset.reqId===reqId&&(typeof n.getClientRects!=='function'||n.getClientRects().length>0));selected=nodes[0]||null;selected?.scrollIntoView({block:'center',behavior:'smooth'});redraw();emit('LOCATED',{count:nodes.length})};
 const nodes=[...document.querySelectorAll('[data-req-id]')].filter(n=>n.dataset.reqId===reqId&&(typeof n.getClientRects!=='function'||n.getClientRects().length>0));
 if(!nodes.length){window.dispatchEvent(new CustomEvent('ai-prototype:reveal',{detail:{reqId}}));setTimeout(locate,100)}else locate();
 }

 });
 window.addEventListener('pointermove',e=>{if(mode==='edit'){hovered=target(e.target);draw(hovered,highlight);highlight.querySelector('.label').textContent=hovered?.dataset.reqId||'未关联需求 · 点击添加'}},true);
 window.addEventListener('pointerout',e=>{if(!e.relatedTarget){hovered=null;redraw()}},true);
 const blocked=['pointerdown','pointerup','mousedown','mouseup','click','dblclick','auxclick','contextmenu','touchstart','touchend','keydown','keyup','keypress','submit','beforeinput','input','change','dragstart','drop'];
 for(const type of blocked)window.addEventListener(type,e=>{
 if(mode!=='edit')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(type==='click'){selected=target(e.target);redraw();const raw=selected?.dataset.reqId;emit('ELEMENT_SELECTED',{moduleId:selected?.closest('[data-req-module]')?.dataset.reqModule||null,sectionId:selected?.closest('[data-req-section]')?.dataset.reqSection||null,reqId:idPattern.test(raw||'')?raw:null,elementId:selected?.dataset.reqElement||null,tagName:selected?.tagName||'',text:(selected?.textContent||selected?.getAttribute('placeholder')||'').trim().slice(0,120)})}
 },{capture:true,passive:false});
 window.addEventListener('scroll',redraw,true);window.addEventListener('resize',redraw);
 // Only announce readiness to explicitly trusted parent origins.
 allowed.forEach(origin=>parent.postMessage({namespace:NS,version:V,type:'READY',sessionId:'',projectId:'',pageId:'',payload:{}},origin));
})();
