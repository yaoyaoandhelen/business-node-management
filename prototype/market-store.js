(function(){
const seedApps = [
  { id: 'APP-0001', name: '接入连接器安全接入组件', py: 'jrljgaqrjzj', l1: '安全类', l2: '政务', tags: ['适配场景·安全防护', '支持终端类型·服务器'], vendor: '重庆数字资源集团有限公司', version: 'V3.2.1', env: '麒麟V10 / 鲲鹏920 / 达梦V8', xc: '麒麟V10 操作系统、鲲鹏920 处理器、达梦V8 数据库', score: 4.8, stability: 96, compliance: '高', downloads: 12840, size: '286 MB', updated: '2026-11-08', mode: '申请下载', price: '—', cert: '已通过信创适配认证', qual: '官方准入资质（关键基础设施专项应用）', supply: '供应链安全评估结论：通过', security: '安全测评报告：通过；无安全漏洞记录', resource: 'CPU 2 核 / 内存 4 GB / 磁盘 8 GB', desc: '面向接入连接器的身份认证、传输加密与访问留痕组件。', spec: true },
  { id: 'APP-0002', name: '设备运行监测工具', py: 'sbyxjcgj', l1: '工具类', l2: '交通', tags: ['适配场景·运行监测', '支持终端类型·服务器'], vendor: '重庆数字资源集团有限公司', version: 'V2.6.0', env: '统信UOS / 海光C86 / 人大金仓', xc: '统信UOS 操作系统、海光C86 处理器、人大金仓数据库', score: 4.7, stability: 94, compliance: '高', downloads: 9632, size: '164 MB', updated: '2026-11-06', mode: '免费下载', price: '免费', cert: '已通过信创适配认证', qual: '—', supply: '—', security: '安全测评报告：通过；无安全漏洞记录', resource: 'CPU 2 核 / 内存 2 GB / 磁盘 4 GB', desc: '采集设备运行指标并生成实时监测视图，适配机场运维岗位。', spec: false },
  { id: 'APP-0003', name: '故障排查辅助工具', py: 'gzpcfzgj', l1: '工具类', l2: '交通', tags: ['适配场景·故障排查', '支持终端类型·桌面'], vendor: '重庆交通枢纽科技有限公司', version: 'V1.9.3', env: '麒麟V10 / 飞腾S2500', xc: '麒麟V10 操作系统、飞腾S2500 处理器', score: 4.6, stability: 92, compliance: '中', downloads: 7421, size: '98 MB', updated: '2026-11-05', mode: '免费下载', price: '免费', cert: '已通过信创适配认证', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 1 核 / 内存 1 GB / 磁盘 2 GB', desc: '按故障现象关联历史处置方案，辅助运维人员定位问题。', spec: false },
  { id: 'APP-0004', name: '数据开发工具套件', py: 'sjkfgjtc', l1: '工具类', l2: '国资', tags: ['适配场景·数据开发', '支持终端类型·桌面'], vendor: '中电数科（重庆）有限公司', version: 'V4.1.2', env: '麒麟V10 / 鲲鹏920 / openGauss', xc: '麒麟V10 操作系统、鲲鹏920 处理器、openGauss 数据库', score: 4.5, stability: 91, compliance: '中', downloads: 6108, size: '512 MB', updated: '2026-11-03', mode: '付费购买', price: '¥1,280.00', cert: '已通过信创适配认证', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 4 核 / 内存 8 GB / 磁盘 20 GB', desc: '提供数据建模、任务编排与质量校验的一体化开发环境。', spec: false },
  { id: 'APP-0005', name: '政务数据交换业务组件', py: 'zwjhjhywzj', l1: '业务类', l2: '政务', tags: ['适配场景·安全防护', '支持终端类型·服务器'], vendor: '重庆数字资源集团有限公司', version: 'V3.0.7', env: '麒麟V10 / 鲲鹏920 / 达梦V8', xc: '麒麟V10 操作系统、鲲鹏920 处理器、达梦V8 数据库', score: 4.9, stability: 97, compliance: '高', downloads: 15320, size: '342 MB', updated: '2026-11-09', mode: '申请下载', price: '—', cert: '已通过信创适配认证', qual: '官方准入资质（关键基础设施专项应用）', supply: '供应链安全评估结论：通过', security: '安全测评报告：通过；无安全漏洞记录', resource: 'CPU 4 核 / 内存 8 GB / 磁盘 16 GB', desc: '支撑跨部门政务数据交换与目录同步的业务处理组件。', spec: true },
  { id: 'APP-0006', name: '国资经营分析应用', py: 'gzjyfx yy', l1: '业务类', l2: '国资', tags: ['适配场景·运行监测', '支持终端类型·桌面'], vendor: '中电数科（重庆）有限公司', version: 'V2.2.0', env: '统信UOS / 海光C86', xc: '统信UOS 操作系统、海光C86 处理器', score: 4.3, stability: 89, compliance: '中', downloads: 4380, size: '208 MB', updated: '2026-10-28', mode: '付费购买', price: '¥680.00', cert: '—', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 2 核 / 内存 4 GB / 磁盘 6 GB', desc: '面向国资监管场景的经营指标汇总与可视化分析应用。', spec: false },
  { id: 'APP-0007', name: '终端准入安全检查组件', py: 'zdzr aqjc zj', l1: '安全类', l2: '政务', tags: ['适配场景·安全防护', '支持终端类型·移动端'], vendor: '重庆信创安全技术有限公司', version: 'V1.6.4', env: '麒麟V10 / 飞腾S2500', xc: '麒麟V10 操作系统、飞腾S2500 处理器', score: 4.4, stability: 90, compliance: '高', downloads: 5216, size: '76 MB', updated: '2026-11-01', mode: '申请下载', price: '—', cert: '已通过信创适配认证', qual: '官方准入资质（关键基础设施专项应用）', supply: '供应链安全评估结论：通过', security: '安全测评报告：通过；无安全漏洞记录', resource: 'CPU 1 核 / 内存 1 GB / 磁盘 1 GB', desc: '对接入终端执行基线核查、准入判定与合规留痕。', spec: true },
  { id: 'APP-0008', name: '交通流量态势分析应用', py: 'jtlltsfxyy', l1: '业务类', l2: '交通', tags: ['适配场景·运行监测', '支持终端类型·服务器'], vendor: '重庆交通枢纽科技有限公司', version: 'V2.8.1', env: '麒麟V10 / 鲲鹏920 / openGauss', xc: '麒麟V10 操作系统、鲲鹏920 处理器、openGauss 数据库', score: 4.6, stability: 93, compliance: '中', downloads: 8840, size: '256 MB', updated: '2026-11-07', mode: '付费购买', price: '¥980.00', cert: '已通过信创适配认证', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 4 核 / 内存 8 GB / 磁盘 12 GB', desc: '汇聚路网流量数据并输出态势研判结果。', spec: false },
  { id: 'APP-0009', name: '日志审计留存工具', py: 'rzsj lcgj', l1: '安全类', l2: '国资', tags: ['适配场景·安全防护', '支持终端类型·服务器'], vendor: '重庆信创安全技术有限公司', version: 'V1.3.0', env: '统信UOS / 海光C86 / 人大金仓', xc: '统信UOS 操作系统、海光C86 处理器、人大金仓数据库', score: 4.2, stability: 88, compliance: '中', downloads: 3960, size: '124 MB', updated: '2026-10-25', mode: '免费下载', price: '免费', cert: '—', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 2 核 / 内存 2 GB / 磁盘 10 GB', desc: '下载行为全程留痕，日志自动归档留存不少于180天。', spec: false },
  { id: 'APP-0010', name: '多源数据融合分析应用', py: 'dysjrhfxyy', l1: '业务类', l2: '政务', tags: ['适配场景·数据开发', '支持终端类型·服务器'], vendor: '中电数科（重庆）有限公司', version: 'V1.1.0', env: '麒麟V10 / 鲲鹏920', xc: '麒麟V10 操作系统、鲲鹏920 处理器', score: 4.1, stability: 86, compliance: '中', downloads: 1420, size: '430 MB', updated: '2026-11-10', mode: '申请下载', price: '—', cert: '—', qual: '—', supply: '—', security: '安全测评报告：通过', resource: 'CPU 4 核 / 内存 8 GB / 磁盘 16 GB', desc: '新上架应用，支持多源数据关联与语义检索结果联动。', spec: false }
];
const key='business-node-market-working-v1';
const now=()=>new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'});
const id=()=>crypto.randomUUID();
const initial=()=>{
 const nodes=[];
 ['工具类','业务类','安全类'].forEach((name,i)=>{nodes.push({id:'root'+i,name,level:1,parent:'',original:name});['政务','交通','国资'].forEach((n,j)=>nodes.push({id:'industry'+i+j,name:n,level:2,parent:'root'+i,original:n}));});
 [['适配场景',['运行监测','故障排查','数据开发','安全防护']],['支持终端类型',['服务器','桌面','移动端']]].forEach(([group,tags],i)=>tags.forEach((name,j)=>nodes.push({id:'tag'+i+j,name,level:3,parent:group,original:name})));
 return {nodes,apps:seedApps.slice(0,2).map(a=>({...a,status:'已上架',history:[]})),requests:[],keywords:{},searches:[],reviews:{}};
};
function read(){try{return JSON.parse(localStorage.getItem(key))||initial()}catch{return initial()}}
function write(d){localStorage.setItem(key,JSON.stringify(d));window.dispatchEvent(new Event('market.changed'));return d}
const MSDate=a=>a.history?.[0]?.time?.slice(0,10)||now().slice(0,10);
function publicApps(){
 const d=read(),original=initial().nodes;
 const approved=d.requests.filter(r=>r.type==='分类目录变更'&&r.state==='已通过');
 const resolve=node=>{if(!node)return null;let nid=node.id;const seen=new Set();while(!seen.has(nid)){seen.add(nid);const merge=approved.find(r=>r.target===nid&&r.action==='合并');if(!merge)break;nid=merge.after.mergeTo;}return d.nodes.find(n=>n.id===nid)||null;};
 const merged=seedApps.filter(a=>!d.apps.some(x=>x.id===a.id)).concat(d.apps.filter(a=>a.status==='已上架'));
 return merged.map(a=>{
  const x={env:'—',xc:'—',score:0,stability:0,compliance:'—',downloads:0,size:'—',updated:a.updated||MSDate(a),mode:'申请下载',price:'—',cert:'—',qual:'—',supply:'—',security:'—',resource:'—',py:'',...a};
  const rootSource=d.nodes.find(n=>n.level===1&&n.name===a.l1)||original.find(n=>n.level===1&&n.name===a.l1),root=resolve(rootSource);
  const childSource=d.nodes.find(n=>n.level===2&&n.parent===rootSource?.id&&n.name===a.l2)||original.find(n=>n.level===2&&n.parent===rootSource?.id&&n.name===a.l2),child=resolve(childSource);
  if(root)x.l1=root.name;
  if(child){x.l2=child.name;const parent=d.nodes.find(n=>n.id===child.parent);if(parent)x.l1=parent.name;}
  x.tags=(a.tags||[]).map(t=>{const [group,name]=t.split('·');const n=resolve(d.nodes.find(n=>n.level===3&&n.parent===group&&n.name===name)||original.find(n=>n.level===3&&n.parent===group&&n.name===name));return n?n.parent+'·'+n.name:t;});
  return x;
 });
}
function submit(type,action,target,before,after){const d=read();if(d.requests.some(r=>r.target===target&&r.state==='待审核'))throw Error('该对象已有待审核申请');const r={id:id(),type,action,target,before,after,state:'待审核',submitted:now(),applicant:type==='应用上架'?'重庆数字资源集团有限公司':'当前管理员',reviewedAt:'',opinion:''};d.requests.unshift(r);write(d);return r}
function decide(rid,result,opinion){const d=read(),r=d.requests.find(x=>x.id===rid);if(!r||r.state!=='待审核')throw Error('申请状态已变化，请刷新');if(result==='驳回'&&!opinion.trim())throw Error('请填写驳回意见');if(opinion.length>300)throw Error('审核意见最多300字');r.state=result;r.opinion=opinion.trim();r.reviewedAt=now();if(result==='已通过'){
 if(r.type==='分类目录变更'){
  if(r.action==='新增')d.nodes.push(r.after);
  else if(r.action==='删除')d.nodes=d.nodes.filter(n=>n.id!==r.target);
  else if(r.action==='合并'){const dest=d.nodes.find(n=>n.id===r.after.mergeTo),src=d.nodes.find(n=>n.id===r.target);if(!dest||!src)throw Error('目录节点已变化');d.nodes.forEach(n=>{if(n.parent===src.id)n.parent=dest.id});d.nodes=d.nodes.filter(n=>n.id!==r.target);d.apps.forEach(a=>{if(src.level===1&&a.l1===src.name)a.l1=dest.name;if(src.level===2&&a.l2===src.name&&a.l1===d.nodes.find(n=>n.id===src.parent)?.name){a.l2=dest.name;a.l1=d.nodes.find(n=>n.id===dest.parent)?.name||a.l1;}if(src.level===3)a.tags=a.tags.map(t=>t===src.parent+'·'+src.name?dest.parent+'·'+dest.name:t)});}
  else {const i=d.nodes.findIndex(n=>n.id===r.target);if(i<0)throw Error('目录节点已变化');const old=d.nodes[i];d.nodes[i]=r.after;d.apps.forEach(a=>{if(old.level===1&&a.l1===old.name)a.l1=r.after.name;if(old.level===2&&a.l2===old.name&&a.l1===d.nodes.find(n=>n.id===old.parent)?.name){a.l2=r.after.name;a.l1=d.nodes.find(n=>n.id===r.after.parent)?.name||a.l1;}if(old.level===3)a.tags=a.tags.map(t=>t===old.parent+'·'+old.name?r.after.parent+'·'+r.after.name:t)});}
 }else{const i=d.apps.findIndex(x=>x.id===r.target);if(i<0)throw Error('应用不存在');const history=d.apps[i].history||[];d.apps[i]={...d.apps[i],...r.after,status:r.action==='注销'?'已注销':'已上架',history:[{time:r.reviewedAt,action:r.action,result:'已通过',opinion:r.opinion},...history]};}
 }else if(r.type==='应用上架'){const a=d.apps.find(x=>x.id===r.target);if(a)a.history=[{time:r.reviewedAt,action:r.action,result:'驳回',opinion:r.opinion},...(a.history||[])];}
 write(d);return r}
function recordSearch(query,tags,l1,l2,count){const d=read();d.searches.unshift({id:id(),query,tags:[...tags],l1,l2,count,user:'王*波',time:now()});write(d)}
window.MarketStore={read,write,now,id,submit,decide,recordSearch,publicApps,seedApps};
})();
