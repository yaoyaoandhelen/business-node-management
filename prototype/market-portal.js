window.installMarketPortal=function(c) {
  const {app,req,safeText:esc,amDialog,amKv,amTable,go,toast,close}=c;
  const S=window.MarketStore;
  let keyword='';
  const attr=(area)=>req('appmarket.owner','appmarket.owner.'+area);
  const dlg=(area)=>req('appmarket.owner.dialog','appmarket.owner.dialog.'+area);
  function render(){
    const content=app.querySelector('.workspace .content');if(!content)return;
    const host=app.querySelector('[data-req-surface]');Object.assign(host.dataset,{reqSurface:'portal.workbench.apps',reqPage:'portal-my-apps',reqTitle:'我的应用'});
    app.querySelectorAll('.side-item').forEach(b=>b.classList.toggle('active',b.hasAttribute('data-market-owner')));
    const d=S.read(),rows=d.apps.filter(a=>!keyword||a.name.includes(keyword));
    content.innerHTML=`<div class="market-owner"><div class="market-owner-head" ${attr('actions')}><h2>我的应用</h2><button class="btn primary" data-owner="new">新增应用</button></div><form id="market-owner-search" class="market-owner-filters" ${attr('filters')}><input class="input" name="keyword" aria-label="应用名称查询" placeholder="应用名称" value="${esc(keyword)}"><button class="btn primary">查询</button><button type="button" class="btn" data-owner="reset">重置</button></form><section ${attr('list')}>${amTable(['序号','应用名称','版本','状态','最近申请','操作'],rows.map((a,i)=>{
      const pending=d.requests.find(r=>r.target===a.id&&r.state==='待审核'),latest=d.requests.find(r=>r.target===a.id);
      const button=(action,label)=>`<button data-owner="${action}" data-id="${a.id}">${label}</button>`;
      return `<tr><td>${i+1}</td><td>${esc(a.name)}</td><td>${esc(a.version)}</td><td>${pending?'审核中':a.status}</td><td>${latest?esc(latest.action+' / '+latest.state):'—'}</td><td><div class="market-actions">${button('detail','详情')}${!pending&&a.status!=='已注销'?button('edit',a.status==='草稿'?'编辑':'更新')+(a.status==='草稿'?button('submit','提交审核'):button('cancel','注销')):''}${button('history','变更记录')}</div></td></tr>`;
    }),'暂无应用')}</section><div class="market-count">共 ${rows.length} 条</div></div>`;
  }
  function options(level,value){return [...new Set(S.read().nodes.filter(n=>n.level===level).map(n=>n.name))].map(n=>`<option ${n===value?'selected':''}>${esc(n)}</option>`).join('');}
  function secondOptions(root,value){const d=S.read(),p=d.nodes.find(n=>n.level===1&&n.name===root);const nodes=d.nodes.filter(n=>n.level===2&&n.parent===p?.id);return nodes.length?nodes.map(n=>`<option ${n.name===value?'selected':''}>${esc(n.name)}</option>`).join(''):'<option value="">暂无二级目录</option>';}
  function form(a){
    const v=a||{name:'',version:'',vendor:'重庆数字资源集团有限公司',desc:'',tags:[]};
    amDialog(a?(a.status==='草稿'?'编辑应用':'更新应用'):'新增应用',`<form id="market-app-form" data-id="${a?.id||''}" class="market-form"><section class="market-form-grid" ${dlg('info')}>${[['name','应用名称'],['version','版本'],['vendor','供应商']].map(([k,n])=>`<label>${n}<input name="${k}" value="${esc(v[k])}" required></label>`).join('')}<label>一级目录<select name="l1" required>${options(1,v.l1)}</select></label><label>二级目录<select name="l2" required>${secondOptions(v.l1||S.read().nodes.find(n=>n.level===1)?.name,v.l2)}</select></label><label class="wide">功能描述<textarea name="desc" required>${esc(v.desc)}</textarea></label></section><section ${dlg('tags')}><label>应用标签</label><div class="market-chip-group">${S.read().nodes.filter(n=>n.level===3).map(n=>{const t=n.parent+'·'+n.name;return `<label><input type="checkbox" name="tags" value="${esc(t)}" ${v.tags.includes(t)?'checked':''}>${esc(t.replace('·',' / '))}</label>`;}).join('')}</div></section><section class="market-form-grid" ${dlg('materials')}>${[['package','安装包'],['manual','使用手册'],['complianceFile','合规性证明']].map(([k,n])=>`<label>${n}<input type="file" name="${k}">${v[k]?`<span>${esc(v[k])}</span>`:''}</label>`).join('')}</section><section ${dlg('actions')}><p class="market-error" role="alert"></p><button type="submit" class="btn primary">${a&&a.status!=='草稿'?'提交更新审核':'保存草稿'}</button></section></form>`,'<button class="btn" data-action="close">取消</button>','portal.workbench.apps.edit.dialog');
  }
  function detail(a,historyOnly){
    const r=S.read().requests.filter(r=>r.target===a.id),mark=x=>req('appmarket.owner.detail','appmarket.owner.detail.'+x);
    amDialog(historyOnly?'变更记录':'应用详情',`${historyOnly?'':`<section ${mark('info')}>${amKv([['应用名称',a.name],['版本',a.version],['供应商',a.vendor],['状态',a.status],['功能描述',a.desc],['一级目录',a.l1],['二级目录',a.l2],['标签',a.tags.join('、')||'—'],['安装包',a.package||'—'],['使用手册',a.manual||'—'],['合规性证明',a.complianceFile||'—']])}</section>`}<section ${mark('history')}>${amTable(['序号','申请事项','状态','提交时间','审核意见'],r.map((x,i)=>`<tr><td>${i+1}</td><td>${x.action}</td><td>${x.state}</td><td>${x.submitted}</td><td>${esc(x.opinion||'—')}</td></tr>`),'暂无变更记录')}</section>`,'<button class="btn" data-action="close">关闭</button>','portal.workbench.apps.detail.dialog');
  }
  function mount(){
    const side=app.querySelector('.workspace .sidebar');if(!side)return;
    side.querySelector('.side-item.active')?.setAttribute('data-market-identity','');
    side.insertAdjacentHTML('beforeend',`<button class="side-item" data-market-owner ${attr('nav')}>▦　 我的应用</button>`);
    if(new URL(location.href).searchParams.get('panel')==='apps')render();
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-market-owner]')){const u=new URL(location.href);u.searchParams.set('panel','apps');history.replaceState(null,'',u);go('workbench');}
    if(e.target.closest('[data-market-identity]')){const u=new URL(location.href);u.searchParams.delete('panel');history.replaceState(null,'',u);go('workbench');}
    const b=e.target.closest('[data-owner]');if(!b)return;
    const a=S.read().apps.find(a=>a.id===b.dataset.id);
    try{
      if(b.dataset.owner==='new')form();
      if(b.dataset.owner==='reset'){keyword='';render();}
      if(b.dataset.owner==='edit')form(a);
      if(['detail','history'].includes(b.dataset.owner))detail(a,b.dataset.owner==='history');
      if(b.dataset.owner==='submit'){S.submit('应用上架','新增',a.id,null,a);render();toast('已提交审核');}
      if(b.dataset.owner==='cancel')amDialog('注销应用',`<form id="market-app-cancel" data-id="${a.id}" class="market-form"><section ${req('appmarket.owner.cancel','appmarket.owner.cancel.reason')}><label>注销说明<textarea name="reason" required></textarea></label></section><section ${req('appmarket.owner.cancel','appmarket.owner.cancel.actions')}><p class="market-error" role="alert"></p><button class="btn primary" type="submit">提交注销审核</button></section></form>`,'<button class="btn" data-action="close">取消</button>','portal.workbench.apps.cancel.dialog');
    }catch(x){toast(x.message);}
  });
  document.addEventListener('change',e=>{if(e.target.matches('#market-app-form [name=l1]'))document.querySelector('#market-app-form [name=l2]').innerHTML=secondOptions(e.target.value,'');});
  document.addEventListener('submit',e=>{
    if(e.target.id==='market-owner-search'){e.preventDefault();keyword=e.target.elements.keyword.value.trim();render();}
    if(!['market-app-form','market-app-cancel'].includes(e.target.id))return;
    e.preventDefault();const f=e.target,data=new FormData(f),d=S.read(),old=d.apps.find(a=>a.id===f.dataset.id);
    try{
      if(f.id==='market-app-cancel'){const reason=String(data.get('reason')).trim();if(!reason)throw Error('请填写注销说明');S.submit('应用上架','注销',old.id,old,{...old,cancelReason:reason});}
      else{
        const values=Object.fromEntries(['name','version','vendor','desc','l1','l2'].map(k=>[k,String(data.get(k)||'').trim()]));
        if(['name','version','vendor','desc'].some(k=>!values[k]))throw Error('请完整填写应用基本信息');
        values.tags=data.getAll('tags');for(const k of ['package','manual','complianceFile'])values[k]=data.get(k)?.name||old?.[k]||'';
        if(old&&old.status!=='草稿')S.submit('应用上架','更新',old.id,old,{...old,...values});
        else{const a={...(old||{}),...values,id:old?.id||S.id(),status:'草稿',history:old?.history||[]};if(old)d.apps[d.apps.indexOf(old)]=a;else d.apps.unshift(a);S.write(d);}
      }
      close(true);render();toast(f.id==='market-app-form'&&(!old||old.status==='草稿')?'草稿已保存':'已提交审核');
    }catch(x){f.querySelector('[role=alert]').textContent=x.message;}
  });
  return {mount};
}
