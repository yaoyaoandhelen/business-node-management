/* =========================================================================
   应用市场后台管理系统（?system=appmarket）
   承载《5.5.2.2 应用市场》需求中的供应商侧与平台运营侧能力。
   所有「支撑能力」条目与功能结构清单条目均照录需求原文，不补写字段／流程。
   ========================================================================= */
const AMK_ITEMS = window.AM_ITEMS || [];
const amkTabs = ['listing', 'audit', 'lifecycle', 'ops', 'download', 'version', 'catalog'];
const amkTitles = {
  listing: '应用上架申请', audit: '上架审核管理', lifecycle: '上架应用全生命周期',
  ops: '检索与推荐运营', download: '下载与交易管理', version: '版本与更新运营', catalog: '功能结构清单'
};
const amkNavReq = {
  listing: 'appmarket.admin.listing', audit: 'appmarket.admin.audit', lifecycle: 'appmarket.admin.lifecycle',
  ops: 'appmarket.admin.ops', download: 'appmarket.admin.download', version: 'appmarket.admin.version', catalog: 'appmarket.admin.catalog'
};
let amkTab = 'listing', amkCatalogKw = '', amkCatalogType = '全部', amkCatalogLevel = '全部';

const AMK_LISTING = [
  ['SJ-20261110-018', '接入连接器安全接入组件', '接入连接器相关软件', '重庆数字资源集团有限公司', '应用基础信息、安装包、使用手册、合规性证明', '恶意代码扫描通过 / 完整性校验通过', '材料补正中', '2026-11-10 09:12'],
  ['SJ-20261109-017', '数据开发工具套件', '数据开发工具', '中电数科（重庆）有限公司', '应用基础信息、安装包、使用手册', '恶意代码扫描通过 / 完整性校验通过', '待审核', '2026-11-09 15:40'],
  ['SJ-20261108-016', '政务数据交换业务组件', '数据应用软件', '重庆数字资源集团有限公司', '应用基础信息、安装包、使用手册、合规性证明', '待预检', '材料补正通知已发送', '2026-11-08 11:08'],
  ['SJ-20261106-015', '多源数据融合分析应用', '数据应用软件', '中电数科（重庆）有限公司', '应用基础信息、安装包', '恶意代码扫描通过', '审核通过 · 已上架', '2026-11-06 16:33'],
  ['SJ-20261103-014', '终端准入安全检查组件', '接入连接器相关软件', '重庆信创安全技术有限公司', '应用基础信息、安装包、使用手册、合规性证明', '完整性校验通过', '已驳回 · 待重新提交', '2026-11-03 10:21']
];
const AMK_AUDIT = [
  ['SH-20261110-021', '接入连接器安全接入组件', '功能完整性 / 合规性 / 安全性 / 兼容性', '自动化检测 + 人工评审', '审核一组', '待分派', '2026-11-10'],
  ['SH-20261109-020', '数据开发工具套件', '功能完整性 / 安全性 / 兼容性', '自动化检测 + 专家评审', '审核二组', '审核中', '2026-11-09'],
  ['SH-20261107-019', '政务数据交换业务组件', '功能完整性 / 合规性 / 安全性 / 兼容性', '人工评审', '审核一组', '整改复评中', '2026-11-07'],
  ['SH-20261105-018', '交通流量态势分析应用', '合规性 / 安全性', '自动化检测', '审核二组', '审核通过 · 已通知', '2026-11-05'],
  ['SH-20261102-017', '国资经营分析应用', '功能完整性 / 兼容性', '人工评审', '审核一组', '审核不通过 · 已反馈', '2026-11-02']
];
const AMK_LIFECYCLE = [
  ['政务数据交换业务组件', '数据应用软件', '重庆数字资源集团有限公司', 'V3.0.7', '已上架', '15320', '91%', '96'],
  ['接入连接器安全接入组件', '接入连接器相关软件', '重庆数字资源集团有限公司', 'V3.2.1', '已上架', '12840', '89%', '94'],
  ['设备运行监测工具', '工具类', '重庆数字资源集团有限公司', 'V2.6.0', '已上架', '9632', '86%', '92'],
  ['数据开发工具套件', '数据开发工具', '中电数科（重庆）有限公司', 'V4.1.2', '版本更新审核中', '6108', '78%', '88'],
  ['日志审计留存工具', '安全类', '重庆信创安全技术有限公司', 'V1.3.0', '下架过渡期', '3960', '65%', '82']
];
const AMK_UPDATES = [
  ['数据开发工具套件', 'V4.1.3', '功能优化 / bug修复 / 兼容性调整', '错峰发布窗口 22:00-24:00', '待审核'],
  ['设备运行监测工具', 'V2.6.1', '功能优化 / 兼容性调整', '常规窗口', '审核通过'],
  ['日志审计留存工具', 'V1.3.1', '安全更新 / bug修复', '紧急补丁通道', '已发布']
];
const AMK_OFFLINE = [
  ['XJ-20261108-004', '国资经营分析应用', '供应商主动申请下架', '功能迭代替代', '影响评估中', '2026-11-08'],
  ['XJ-20261105-003', '旧版目录同步组件', '平台强制下架', '合规风险', '过渡期通知中', '2026-11-05'],
  ['XJ-20261028-002', '测试用数据上报工具', '供应商主动申请下架', '停止维护', '已归档', '2026-10-28']
];
const AMK_CATALOG_NODES = [
  ['一级目录', '工具类', '—', '启用', '128', '已审核'],
  ['一级目录', '业务类', '—', '启用', '96', '已审核'],
  ['一级目录', '安全类', '—', '启用', '74', '已审核'],
  ['二级目录', '政务', '工具类 / 业务类 / 安全类', '启用', '62', '已审核'],
  ['二级目录', '交通', '工具类 / 业务类', '启用', '48', '已审核'],
  ['二级目录', '国资', '业务类 / 安全类', '启用', '35', '变更审核中'],
  ['三级标签', '适配场景·运行监测', '交通 / 工具类', '启用', '29', '已审核'],
  ['三级标签', '支持终端类型·服务器', '政务 / 安全类', '启用', '21', '已审核']
];
const AMK_RANK = [
  ['合规优先级', '40%', '默认排序主权重', '启用', '2026-11-08'],
  ['运行稳定性评分', '35%', '默认排序主权重', '启用', '2026-11-08'],
  ['用户综合评价', '25%', '默认排序主权重', '启用', '2026-11-08'],
  ['新上架应用流量扶持', '阶段性曝光倾斜', '扶持周期设置', '启用', '2026-11-01'],
  ['排序规则A/B测试', '对照组 / 实验组', '测试结果对比分析', '进行中', '2026-11-05']
];
const AMK_SCENES = [
  ['机场运维岗位', '岗位', '设备运行监测 / 故障排查', '用户偏好动态学习', '启用'],
  ['政务数据交换', '业务环节', '目录同步 / 交换组件', '冷启动推荐策略', '启用'],
  ['同区域同部门群组', '用户群组', '配套应用组合推荐', '协同过滤算法配置', '启用'],
  ['新用户注册信息', '冷启动', '通用工具优先', '推荐多样性控制', '启用']
];
const AMK_ZONES = [
  ['热门应用榜单', '下载量 / 评分 / 活跃度', '每日更新', '内容审核通过', '榜单争议申诉 0'],
  ['政务数字化转型专项', '政策适配专项工具', '按政策发布', '内容审核通过', '公告已发布'],
  ['信创改造专项', '政策适配专项工具', '按政策发布', '内容审核通过', '主题切换 2 次']
];
const AMK_PERMS = [
  ['运维管理主体', '核心业务类 / 高敏', '逐级审批', '配额 20 次/月', '启用'],
  ['合规注册用户', '通用类', '无需审批', '配额 50 次/月', '启用'],
  ['临时授权主体', '按授权范围', '临时下载授权', '授权到期自动回收', '启用'],
  ['接入连接器运营方', '连接器相关软件', '管理员审核', '下载频率限制', '启用']
];
const AMK_LOGS = [
  ['DL-20261110-091', '王艳波', '政务数据交换业务组件', '2026-11-10 09:41', '本区域', '正常', '归档留存不少于180天'],
  ['DL-20261110-090', '陈运维', '接入连接器安全接入组件', '2026-11-10 09:22', '本区域', '正常', '归档留存不少于180天'],
  ['DL-20261109-089', '李一', '设备运行监测工具', '2026-11-09 18:03', '跨区域', '异常下载预警', '已拦截并留痕'],
  ['DL-20261109-088', '张*', '日志审计留存工具', '2026-11-09 14:15', '本区域', '正常', '归档留存不少于180天']
];
const AMK_ENV = [
  ['操作系统版本', '麒麟V10 / 统信UOS', '检测规则版本 V2.3', '启用'],
  ['硬件配置达标检测', 'CPU / 内存 / 磁盘', '检测规则版本 V2.3', '启用'],
  ['依赖组件逐项校验', '数据库 / 中间件 / 运行库', '检测规则版本 V2.1', '启用'],
  ['安装包数字签名验证', '签名证书链', '检测规则版本 V2.3', '启用'],
  ['下载完整性校验', '分片校验失败自动重传', '分片大小与并发数可配置', '启用']
];
const AMK_TRADES = [
  ['DD-20261108-003', '数据开发工具套件', '订阅', '¥1,280.00', '支付成功 / 已交付', '电子票据已生成', '已完成对账'],
  ['DD-20261105-002', '交通流量态势分析应用', '按次', '¥980.00', '支付成功 / 已交付', '电子票据已生成', '已完成对账'],
  ['DD-20261029-001', '国资经营分析应用', '订阅', '¥680.00', '退款申请中', '票据已作废', '对账差异处理中'],
  ['DD-20261021-006', '数据开发工具套件', '按次', '¥1,280.00', '已完成', '电子票据已生成', '已完成对账']
];
const AMK_NOTICE = [
  ['安全更新模板', '安全更新强提醒', '按用户批次灰度推送', '触达率统计', '启用'],
  ['功能更新模板', '功能更新按需提醒', '全量推送', '用户升级跟踪', '启用'],
  ['停维版本提前公告', '强提醒', '全量推送', '通知阅读状态跟踪', '启用'],
  ['强制更新策略', '安全更新强提醒', '灰度批次', '更新内容安全检测', '启用']
];
const AMK_HISTORY = [
  ['政务数据交换业务组件', 'V3.0.6', '维护中', '合规留存', '完整性校验通过', '2026-10-18'],
  ['接入连接器安全接入组件', 'V3.2.0', '维护中', '合规留存', '完整性校验通过', '2026-10-20'],
  ['设备运行监测工具', 'V2.5.9', '停止维护', '合规留存', '完整性校验通过', '2026-10-12'],
  ['日志审计留存工具', 'V1.2.8', '停止维护', '版本归档', '完整性校验通过', '2026-08-22']
];
const AMK_RELEASE = [
  ['数据开发工具套件 V4.1.3', '2026-11-12 22:00', '错峰发布', '影响评估完成', '回退预案已配置'],
  ['设备运行监测工具 V2.6.1', '2026-11-11 10:00', '常规发布', '测试环境验证通过', '版本停用预案'],
  ['日志审计留存工具 V1.3.1', '2026-11-07 01:30', '紧急补丁', '影响评估完成', '回退预案已配置']
];

const amkBadge = (s, cls) => `<span class="ai-badge ${cls || ''}">${esc(s)}</span>`;
const amkKv = pairs => `<div class="amk-kv">${pairs.map(([k, v]) => `<div>${k}：<b>${esc(v)}</b></div>`).join('')}</div>`;
const amkBlock = (reqId, el, title, body) => `<div class="amk-block" ${req(reqId, el)}><h3>${title}</h3>${body}</div>`;
const amkFilter = (input, bodyId) => { const kw = input.value.trim(); document.querySelectorAll('#' + bodyId + ' tr').forEach(tr => { tr.style.display = !kw || tr.textContent.includes(kw) ? '' : 'none'; }); };
const amkFilterAll = input => { const kw = input.value.trim(); document.querySelectorAll('#amk-content tbody tr').forEach(tr => { tr.style.display = !kw || tr.textContent.includes(kw) ? '' : 'none'; }); };
const amkFilterSelect = sel => { const v = sel.value; document.querySelectorAll('#amk-content tbody tr').forEach(tr => { tr.style.display = v === '全部' || tr.textContent.includes(v) ? '' : 'none'; }); };
const amkSearchBox = (bodyId, ph) => `<input class="amk-search" placeholder="${ph || '输入关键字查询'}" oninput="amkFilter(this,'${bodyId}')" aria-label="${ph || '输入关键字查询'}">`;
const AMK_L1 = { listing: '5.5.2.2.5 应用上架与审核管理', audit: '5.5.2.2.5 应用上架与审核管理', lifecycle: '5.5.2.2.6 上架应用全生命周期管理', ops: '5.5.2.2.1 应用检索', download: '5.5.2.2.3 应用下载', version: '5.5.2.2.4 应用更新通知', catalog: '5.5.2.2 应用市场' };
const amkHead = (title, bodyId) => `<div class="ai-list-head"><h3>${title}</h3>${amkSearchBox(bodyId)}</div>`;
const amkTable = (heads, rows, bodyId) => `<div class="ai-table"><table><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody id="${bodyId}">${rows}</tbody></table></div>`;
const amkRow = (cells, i) => `<tr><td>${i + 1}</td>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
const amkNote = text => `<p class="amk-note">${text}</p>`;
const amkMetrics = arr => `<div class="ai-metrics" ${req(amkNavReq[amkTab], 'appmarket.admin.' + amkTab + '.stats')}>${arr.map(([l, v, d]) => `<article><span>${l}</span><strong>${v}</strong><small>${d}</small></article>`).join('')}</div>`;

function amkSupportRows(l1s, l2kw) {
  return AMK_ITEMS.filter(r => l1s.some(l1 => r.l1 === l1) && (r.level.indexOf('支撑能力') === 0 || r.level === '章节末附加') && (!l2kw || r.l2.indexOf(l2kw) >= 0));
}
function amkSupport(title, l1s, l2kw, reqId) {
  const list = amkSupportRows(l1s, l2kw);
  const rows = list.map((r, i) => `<tr ${req(reqId, 'appmarket.admin.' + amkTab + '.support.item')}><td>${i + 1}</td><td>${r.no}</td><td>${esc(r.src)}</td><td>${esc(r.level)}</td><td>${amkBadge(r.type, r.type === '技术实施' ? 'orange' : '')}</td><td>${esc(r.item)}</td><td>${esc(r.tech || '—')}</td><td>${esc(r.note || '—')}</td></tr>`).join('');
  return `<section class="amk-sec" ${req(reqId, 'appmarket.admin.' + amkTab + '.support')}><div class="ai-list-head"><h3>${title}</h3>${amkSearchBox('amk-support-' + amkTab)}</div>
    <div class="ai-table"><table class="amk-support"><thead><tr><th>序号</th><th>清单序号</th><th>需求出处</th><th>叙述层级</th><th>条目类型</th><th>需求条目（原文照录）</th><th>技术实施要点（原文词）</th><th>备注</th></tr></thead><tbody id="amk-support-${amkTab}">${rows}</tbody></table></div>
    ${amkNote('原文仅提供名称的支撑能力在此只照录名称与出处，未补写字段、枚举或流程；需求出处编号层级按原文照录。')}</section>`;
}
const amkFilters = (reqId, fields) => `<div class="amk-filters" ${req(reqId, 'appmarket.admin.' + amkTab + '.filters')}>${fields.map(([label, opts]) => `<label>${label} <select onchange="amkFilterSelect(this)"><option>全部</option>${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></label>`).join('')}<input class="amk-search" placeholder="输入关键字查询本页全部表格" oninput="amkFilterAll(this)" aria-label="输入关键字查询本页全部表格"><button class="btn" ${req(reqId, 'appmarket.admin.' + amkTab + '.filters.req')} onclick="amkReqDialog(AMK_L1[amkTab])">查看需求条目</button></div>`;

function amkOpen(tab = 'listing') {
  amkTab = amkTabs.includes(tab) ? tab : 'listing';
  section = 'appmarket';
  const u = new URL(location.href);
  u.searchParams.set('system', 'appmarket');
  u.searchParams.set('view', amkTab);
  history.replaceState(null, '', u);
  render();
}
function amkBackLaunch() {
  section = 'launch';
  document.querySelector('header b').textContent = '基础设施运营管理系统';
  history.replaceState(null, '', '?system=management');
  render();
}
function amkRender() {
  document.querySelector('header b').textContent = '应用市场后台管理系统';
  $('#sidebar').innerHTML = `<div class="ai-nav-title">应用市场后台管理系统</div><div class="ais-group">应用市场管理<span>⌄</span></div>` +
    amkTabs.map(t => `<button class="ai-nav-item ${t === amkTab ? 'active' : ''}" ${req(amkNavReq[t], 'appmarket.admin.nav.' + t)} onclick="amkOpen('${t}')">${amkTitles[t]}</button>`).join('') +
    `<button class="ai-back" onclick="amkBackLaunch()">⇤ 返回快捷入口</button>`;
  $('#main').innerHTML = `<div class="systemtabs"><span onclick="amkBackLaunch()">首页</span><span class="selected">● 应用市场后台管理系统</span></div>` +
    `<div class="ai-page amk-page" data-req-page="appmarket-${amkTab}" data-req-surface="appmarket.admin.${amkTab}" data-req-title="${amkTitles[amkTab]}">` +
    `<div class="crumb">应用市场后台管理系统 / ${amkTitles[amkTab]}</div><div id="amk-content"></div></div>`;
  ({ listing: amkListing, audit: amkAudit, lifecycle: amkLifecycle, ops: amkOps, download: amkDownload, version: amkVersion, catalog: amkCatalogPage })[amkTab]();
}
function amkDialog(title, body, foot, surface) {
  $('#overlay').innerHTML = `<div class="veil"><section class="modal ai-modal amk-modal" role="dialog" aria-modal="true" aria-label="${title}" data-req-page="appmarket-${amkTab}" data-req-surface="${surface}" data-req-layer="dialog" data-req-title="${title}"><div class="modalhead">${title}<button class="close" onclick="$('#overlay').innerHTML=''">×</button></div><div class="modalbody">${body}</div><div class="modalfoot">${foot}</div></section></div>`;
}

/* —— 1. 应用上架申请 —— */
function amkListing() {
  const rq = 'appmarket.admin.listing';
  const rows = AMK_LISTING.map((r, i) => amkRow([`<b>${esc(r[1])}</b>`, r[0], r[2], esc(r[3]), esc(r[4]), esc(r[5]), amkBadge(r[6], r[6].indexOf('通过') >= 0 && r[6].indexOf('不通过') < 0 ? 'green' : r[6].indexOf('驳回') >= 0 ? 'red' : 'orange'), r[7], `<button class="btn" ${req(rq, 'appmarket.admin.listing.table.detail')} onclick="amkListingDialog(${i})">查看详情</button>`], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['上架申请总数', '5', '原型演示数据'], ['待审核', '1', '含材料补正'], ['审核通过 · 已上架', '1', '自动上架'], ['安装包安全预检', '4', '恶意代码扫描 / 完整性校验']]) +
    amkFilters(rq, [['上架类型', ['接入连接器相关软件', '数据开发工具', '数据应用软件']], ['申请状态', ['待审核', '材料补正中', '审核通过', '已驳回']], ['供应商', [...new Set(AMK_LISTING.map(r => r[3]))]]]) +
    `<section ${req(rq, 'appmarket.admin.listing.table')}>${amkHead('上架申请列表', 'amk-main-listing')}${amkTable(['序号', '应用名称', '申请编号', '上架类型', '供应商', '上架材料清单', '安装包安全预检', '申请状态', '提交时间', '操作'], rows, 'amk-main-listing')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.listing.materials')}><div class="ai-list-head"><h3>上架材料清单模板</h3>${amkSearchBox('amk-materials')}</div>${amkTable(['序号', '上架类型', '必备材料', '模板状态', '材料模板下载'], ['接入连接器相关软件|应用基础信息、安装包、使用手册、合规性证明|已启用|提供下载', '数据开发工具|应用基础信息、安装包、使用手册|已启用|提供下载', '数据应用软件|应用基础信息、安装包、使用手册|已启用|提供下载'].map((s, i) => amkRow(s.split('|').map(esc), i)).join(''), 'amk-materials')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.5 应用上架与审核管理'], '多类型应用上架支持', rq) +
    amkNote('支持接入连接器相关软件、数据开发工具、数据应用软件等各类应用的上架申请；申请主体提交应用基础信息（名称、版本、供应商、功能描述等）、安装包、使用手册、合规性证明等材料。章节末附加句「应用上架申请、应用信息审核」原文位于 5.5.2.2.1 末尾，按原文位置保留，未移位。');
}
function amkListingDialog(i) {
  const r = AMK_LISTING[i];
  const body = amkBlock('appmarket.admin.listing.dialog', 'appmarket.admin.listing.dialog.info', '申请信息', amkKv([['申请编号', r[0]], ['应用名称', r[1]], ['上架类型', r[2]], ['供应商', r[3]], ['提交时间', r[7]], ['申请状态', r[6]]])) +
    amkBlock('appmarket.admin.listing.dialog', 'appmarket.admin.listing.dialog.materials', '上架材料清单', `<div class="amk-tags">${r[4].split('、').map(x => `<span>${esc(x)}</span>`).join('')}</div><p class="amk-note">支持上架材料清单模板管理、材料补正通知、多轮补正记录管理、材料模板下载管理。</p>`) +
    amkBlock('appmarket.admin.listing.dialog', 'appmarket.admin.listing.dialog.precheck', '安装包安全预检', amkKv([['恶意代码扫描', r[5]], ['完整性校验', r[5]], ['供应商资质预审', '待执行'], ['上架协议在线签署', '待执行']])) +
    amkBlock('appmarket.admin.listing.dialog', 'appmarket.admin.listing.dialog.progress', '申请进度跟踪', `<div class="amk-tags"><span>申请撤回管理</span><span>申请重新提交管理</span><span>申请编号自动生成</span><span>申请时效统计分析</span><span>上架意向登记管理</span><span>申请驳回原因分类统计</span><span>上架辅导资料管理</span><span>申请咨询答疑管理</span></div>`) +
    amkBlock('appmarket.admin.listing.dialog', 'appmarket.admin.listing.dialog.actions', '操作区', `<button class="btn" onclick="$('#overlay').innerHTML='';toast('演示环境：材料补正通知已记录')">发送材料补正通知</button> <button class="btn primary" onclick="$('#overlay').innerHTML='';toast('演示环境：已提交审核任务分派')">提交审核</button>`);
  amkDialog('上架申请详情 · ' + r[0], body, '<button class="btn" onclick="$(\'#overlay\').innerHTML=\'\'">关闭</button>', 'appmarket.admin.listing.dialog');
}

/* —— 2. 上架审核管理 —— */
function amkAudit() {
  const rq = 'appmarket.admin.audit';
  const rows = AMK_AUDIT.map((r, i) => amkRow([r[0], `<b>${esc(r[1])}</b>`, esc(r[2]), r[3], r[4], amkBadge(r[5], r[5].indexOf('通过') >= 0 && r[5].indexOf('不通过') < 0 ? 'green' : r[5].indexOf('不通过') >= 0 ? 'red' : 'orange'), r[6], `<button class="btn" ${req(rq, 'appmarket.admin.audit.table.detail')} onclick="amkAuditDialog(${i})">进入审核</button>`], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['审核任务总数', '5', '原型演示数据'], ['待分派 / 审核中', '2', '审核任务分派管理'], ['整改复评', '1', '审核意见反馈'], ['审核通过率', '40%', '审核通过率统计']]) +
    amkFilters(rq, [['审核状态', ['待分派', '审核中', '整改复评中', '审核通过', '审核不通过']], ['审核方式', ['自动化检测', '人工评审', '专家评审']], ['审核团队', ['审核一组', '审核二组']]]) +
    `<section ${req(rq, 'appmarket.admin.audit.table')}>${amkHead('上架审核任务列表', 'amk-main-audit')}${amkTable(['序号', '任务编号', '应用名称', '审核维度', '检测 / 评审方式', '审核团队', '审核状态', '任务日期', '操作'], rows, 'amk-main-audit')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.audit.dimensions')}><div class="ai-list-head"><h3>审核维度指标配置</h3>${amkSearchBox('amk-dimensions')}</div>${amkTable(['序号', '审核维度', '审核要点', '检测方式', '规则版本'], [['功能完整性|应用功能与上架申请描述一致|人工评审|V1.4'], ['合规性|符合数据流通相关标准规范|自动化检测 + 人工评审|V1.4'], ['安全性|无恶意代码、数据泄露风险|自动化检测|V1.6'], ['兼容性|适配对应系统及节点|自动化检测 + 人工评审|V1.3']].map((a, i) => amkRow(a.map(esc), i)).join(''), 'amk-dimensions')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.5 应用上架与审核管理'], '全流程审核管理', rq) +
    amkNote('审核通过的应用自动上架至应用市场，审核不通过的反馈具体问题并允许修改后重新提交，同时记录审核全流程日志；审核全流程日志留痕可追溯。');
}
function amkAuditDialog(i) {
  const r = AMK_AUDIT[i];
  const body = amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.info', '审核任务信息', amkKv([['任务编号', r[0]], ['应用名称', r[1]], ['审核团队', r[4]], ['任务日期', r[6]], ['当前状态', r[5]]])) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.dimensions', '四维审核要点', amkKv([['功能完整性', '功能与上架申请描述一致'], ['合规性', '符合数据流通相关标准规范'], ['安全性', '无恶意代码、数据泄露风险'], ['兼容性', '适配对应系统及节点']])) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.mode', '自动化检测与人工评审', `<div class="amk-tags"><span>自动化检测与人工评审结合的双轨审核机制</span><span>检测工具集成管理</span><span>审核标准文档管理</span><span>审核规则版本管理</span><span>审核报告自动生成</span></div>`) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.dispatch', '任务分派与专家评审', `<div class="amk-tags"><span>审核任务分派管理</span><span>专家评审资源调度</span><span>上会评审管理</span><span>审核团队权限管理</span></div>`) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.opinion', '审核意见与整改复评', `<div class="amk-tags"><span>审核意见反馈与整改复评管理</span><span>常见问题知识库管理</span><span>审核争议申诉处理</span><span>审核周期统计分析</span><span>审核通过率统计</span></div>`) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.notify', '结论通知与审核日志', `<div class="amk-tags"><span>审核结论通知推送</span><span>审核全流程日志留痕可追溯</span><span>审核数据统计分析</span></div>`) +
    amkBlock('appmarket.admin.audit.dialog', 'appmarket.admin.audit.dialog.actions', '操作区', `<button class="btn" onclick="$('#overlay').innerHTML='';toast('演示环境：已记录审核不通过与整改意见')">审核不通过并反馈</button> <button class="btn primary" onclick="$('#overlay').innerHTML='';toast('演示环境：审核通过，应用自动上架')">审核通过并上架</button>`);
  amkDialog('上架审核 · ' + r[0], body, '<button class="btn" onclick="$(\'#overlay\').innerHTML=\'\'">关闭</button>', 'appmarket.admin.audit.dialog');
}

/* —— 3. 上架应用全生命周期 —— */
function amkLifecycle() {
  const rq = 'appmarket.admin.lifecycle';
  const rows = AMK_LIFECYCLE.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, r[1], esc(r[2]), r[3], amkBadge(r[4], r[4] === '已上架' ? 'green' : 'orange'), r[5], r[6], r[7], `<button class="btn" ${req(rq, 'appmarket.admin.lifecycle.table.detail')} onclick="amkLifecycleDialog(${i})">查看详情</button>`], i)).join('');
  const upd = AMK_UPDATES.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, r[1], esc(r[2]), esc(r[3]), amkBadge(r[4], r[4] === '审核通过' || r[4] === '已发布' ? 'green' : 'orange')], i)).join('');
  const off = AMK_OFFLINE.map((r, i) => amkRow([r[0], `<b>${esc(r[1])}</b>`, r[2], esc(r[3]), amkBadge(r[4], r[4] === '已归档' ? 'green' : 'orange'), r[5]], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['已上架应用', '5', '原型演示数据'], ['版本更新审核中', '1', '更新包 / 更新说明'], ['下架过渡期', '1', '迁移通知 / 数据处置'], ['信息完整性评分均值', '90.4', '满分 100']]) +
    amkFilters(rq, [['应用类型', ['接入连接器相关软件', '数据开发工具', '数据应用软件', '工具类', '安全类']], ['应用状态', ['已上架', '版本更新审核中', '下架过渡期']], ['供应商', [...new Set(AMK_LIFECYCLE.map(r => r[2]))]]]) +
    `<section ${req(rq, 'appmarket.admin.lifecycle.table')}>${amkHead('已上架应用列表', 'amk-main-lifecycle')}${amkTable(['序号', '应用名称', '应用类型', '供应商', '当前版本', '应用状态', '下载量', '活跃度', '信息完整性评分', '操作'], rows, 'amk-main-lifecycle')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.lifecycle.versions')}><div class="ai-list-head"><h3>应用更新与版本管理</h3>${amkSearchBox('amk-updates')}</div>${amkTable(['序号', '应用名称', '目标版本', '更新说明类型', '版本发布窗口', '审核状态'], upd, 'amk-updates')}${amkNote('支持应用供应商提交版本更新申请，上传更新包及更新说明（含功能优化、bug修复、兼容性调整等内容），经审核通过后完成版本迭代；保留应用版本历史记录，支持用户查看各版本差异，可选择适配版本下载使用，同时支持旧版本回退功能。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.lifecycle.offline')}><div class="ai-list-head"><h3>应用下架管理</h3>${amkSearchBox('amk-offline')}</div>${amkTable(['序号', '下架编号', '应用名称', '下架场景', '下架原因', '处置状态', '登记时间'], off, 'amk-offline')}${amkNote('两种下架场景：供应商主动提交下架申请（说明停止维护、功能迭代替代等原因）审核通过后下架；平台发现合规风险、安全隐患或违规行为时执行强制下架并向供应商及已下载用户推送通知。下架应用不可新用户获取，已下载用户可查看下架说明及后续处理建议。')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.6 上架应用全生命周期管理'], '', rq) +
    amkNote('支持按应用名称、类型、供应商、版本、功能关键词等多条件开展精准检索与模糊查询；应用信息变更经审核后生效，下载量、活跃度等数据向供应商开放。');
}
function amkLifecycleDialog(i) {
  const r = AMK_LIFECYCLE[i];
  const body = amkBlock('appmarket.admin.lifecycle.dialog', 'appmarket.admin.lifecycle.dialog.info', '应用信息', amkKv([['应用名称', r[0]], ['应用类型', r[1]], ['供应商', r[2]], ['当前版本', r[3]], ['应用状态', r[4]], ['下载量 / 活跃度', r[5] + ' / ' + r[6]]])) +
    amkBlock('appmarket.admin.lifecycle.dialog', 'appmarket.admin.lifecycle.dialog.version', '版本差异与发布窗口', `<div class="amk-tags"><span>版本更新计划管理</span><span>版本发布窗口管理</span><span>版本发布影响评估与回退预案管理</span><span>查看不同版本内容差异</span><span>版本数据迁移管理</span><span>测试环境验证管理</span></div>`) +
    amkBlock('appmarket.admin.lifecycle.dialog', 'appmarket.admin.lifecycle.dialog.impact', '下架影响评估', `<div class="amk-tags"><span>下架影响评估执行：存量用户规模与替代方案预先分析</span><span>违规行为证据管理</span><span>强制下架处置流程与用户权益保障机制</span></div>`) +
    amkBlock('appmarket.admin.lifecycle.dialog', 'appmarket.admin.lifecycle.dialog.transition', '过渡期与用户通知', `<div class="amk-tags"><span>下架过渡期管理：迁移通知与数据处置</span><span>下架公告发布管理</span><span>下架申诉处理管理</span><span>下架记录归档管理</span><span>下架全程留痕可审计</span></div>`) +
    amkBlock('appmarket.admin.lifecycle.dialog', 'appmarket.admin.lifecycle.dialog.actions', '操作区', `<button class="btn" onclick="$('#overlay').innerHTML='';toast('演示环境：已记录版本差异查看')">查看版本差异</button> <button class="btn primary" onclick="$('#overlay').innerHTML='';toast('演示环境：下架申请已登记，未实际下架')">发起下架申请</button>`);
  amkDialog('应用全生命周期 · ' + r[0], body, '<button class="btn" onclick="$(\'#overlay\').innerHTML=\'\'">关闭</button>', 'appmarket.admin.lifecycle.dialog');
}

/* —— 4. 检索与推荐运营 —— */
function amkOps() {
  const rq = 'appmarket.admin.ops';
  const nodes = AMK_CATALOG_NODES.map((r, i) => amkRow([r[0], `<b>${esc(r[1])}</b>`, esc(r[2]), amkBadge(r[3], 'green'), r[4], amkBadge(r[5], r[5] === '已审核' ? 'green' : 'orange')], i)).join('');
  const rank = AMK_RANK.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, esc(r[1]), esc(r[2]), amkBadge(r[3], 'green'), r[4]], i)).join('');
  const scenes = AMK_SCENES.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, r[1], esc(r[2]), esc(r[3]), amkBadge(r[4], 'green')], i)).join('');
  const zones = AMK_ZONES.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, esc(r[1]), esc(r[2]), amkBadge(r[3], 'green'), esc(r[4])], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['分类目录节点', '8', '三级分类目录'], ['排序策略项', '5', '权重 / 扶持 / A-B测试'], ['推荐场景', '4', '岗位 / 行业 / 业务环节'], ['榜单与专区', '3', '热门榜单 / 政策专区']]) +
    amkFilters(rq, [['配置类型', ['分类目录', '排序策略', '推荐场景', '榜单专区']], ['状态', ['启用', '停用', '变更审核中']]]) +
    `<section ${req(rq, 'appmarket.admin.ops.catalog')}><div class="ai-list-head"><h3>分类目录动态维护</h3>${amkSearchBox('amk-nodes')}</div>${amkTable(['序号', '目录层级', '节点名称', '所属上级 / 关联', '节点状态', '使用频次', '变更审核'], nodes, 'amk-nodes')}${amkNote('系统支持分类目录动态维护，各级分类的新增、调整与合并操作统一管理；提供标签组合检索能力、拼音首字母模糊检索优化与检索联想提示、检索结果分面统计与检索热词分析。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.ops.rank')}><div class="ai-list-head"><h3>排序策略与权重配置</h3>${amkSearchBox('amk-rank')}</div>${amkTable(['序号', '策略项', '权重 / 口径', '说明', '状态', '配置时间'], rank, 'amk-rank')}${amkNote('检索结果默认按合规优先级、运行稳定性评分、用户综合评价权重排序；支持排序权重配置、个性化排序、新上架应用流量扶持配置、排序效果分析与排序规则A/B测试。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.ops.recommend')}><div class="ai-list-head"><h3>推荐场景与协同推荐配置</h3>${amkSearchBox('amk-scenes')}</div>${amkTable(['序号', '推荐场景', '场景类型', '推荐内容 / 群组', '策略', '状态'], scenes, 'amk-scenes')}${amkNote('支持推荐场景配置管理（按岗位、行业、业务环节定义）、用户偏好动态学习、推荐结果解释展示、冷启动推荐策略、同类型用户群组管理、推荐白名单合规校验、协同过滤算法配置与推荐多样性控制。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.ops.zone')}><div class="ai-list-head"><h3>热门榜单与政策专区</h3>${amkSearchBox('amk-zones')}</div>${amkTable(['序号', '专区 / 榜单', '规则 / 适配政策', '更新周期', '内容审核', '运营记录'], zones, 'amk-zones')}${amkNote('支持热门榜单规则配置（按下载量、评分、活跃度等指标生成多维度榜单）、政策专区内容管理、专区运营位配置与专区数据统计分析、榜单更新周期管理与专区内容审核机制。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.ops.smart')}><div class="ai-list-head"><h3>智能检索与推荐服务</h3>${amkSearchBox('amk-smart')}</div>${amkTable(['序号', '能力项', '原文表述', '服务类型'], [['语义检索执行', '基于自然语言描述理解用户检索意图', '智能服务'], ['多源数据融合推荐', '用户行为、应用画像、场景数据综合计算推荐结果', '智能服务'], ['自然语言查询解析', '自然语言查询解析', '技术实施'], ['应用画像构建管理', '应用画像构建管理', '技术实施'], ['算法参数在线调优', '算法参数在线调优', '技术实施'], ['智能服务运营监控与效果评估', '智能服务运营监控与效果评估', '智能服务']].map((a, i) => amkRow(a.map(esc), i)).join(''), 'amk-smart')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.1 应用检索', '5.5.2.2.2 应用推荐', '5.5.2.2.7 智能检索与推荐'], '', rq) +
    amkNote('5.5.2.2.1／.2 与 5.5.2.2.7 在检索与推荐上描述相近，原文未说明是否为同一套能力，此处按原文同时保留、未做合并去重。');
}
/* —— 5. 下载与交易管理 —— */
function amkDownload() {
  const rq = 'appmarket.admin.download';
  const perms = AMK_PERMS.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, esc(r[1]), esc(r[2]), esc(r[3]), amkBadge(r[4], 'green')], i)).join('');
  const logs = AMK_LOGS.map((r, i) => amkRow([r[0], esc(r[1]), `<b>${esc(r[2])}</b>`, r[3], r[4], amkBadge(r[5], r[5] === '正常' ? 'green' : 'red'), esc(r[6])], i)).join('');
  const env = AMK_ENV.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, esc(r[1]), esc(r[2]), amkBadge(r[3], 'green')], i)).join('');
  const trades = AMK_TRADES.map((r, i) => amkRow([r[0], `<b>${esc(r[1])}</b>`, r[2], r[3], amkBadge(r[4], r[4].indexOf('退款') >= 0 ? 'orange' : 'green'), esc(r[5]), esc(r[6])], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['下载权限策略', '4', '按主体类型差异化'], ['下载日志留存', '≥180 天', '满足等保2.0三级审计要求'], ['异常下载预警', '1', '已拦截并留痕'], ['交易订单', '4', '含退款 / 对账']]) +
    amkFilters(rq, [['主体类型', ['运维管理主体', '合规注册用户', '临时授权主体', '接入连接器运营方']], ['日志状态', ['正常', '异常下载预警']], ['订单状态', ['支付成功', '退款申请中', '已完成']]]) +
    `<section ${req(rq, 'appmarket.admin.download.permission')}><div class="ai-list-head"><h3>分级权限下载管控</h3>${amkSearchBox('amk-perms')}</div>${amkTable(['序号', '主体类型', '可下载应用范围', '审批流程', '配额 / 授权', '状态'], perms, 'amk-perms')}${amkNote('关键基础设施核心业务类应用仅向授权的运维管理主体开放下载，普通通用类应用面向所有合规注册用户开放；支持下载权限角色配置、应用密级标识管理、下载审批流程配置、临时下载授权管理与授权到期自动回收。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.download.auditlog')}><div class="ai-list-head"><h3>下载行为审计查询</h3>${amkSearchBox('amk-logs')}</div>${amkTable(['序号', '日志编号', '下载主体', '应用名称', '下载时间', '区域', '审计结果', '归档留存'], logs, 'amk-logs')}${amkNote('所有下载行为全程留痕，下载日志自动归档留存不少于180天，满足等保2.0三级审计要求；配套异常下载预警、越权下载拦截管理、下载合规报告生成。原文未给出 180 天的验收方式。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.download.env')}><div class="ai-list-head"><h3>安装环境检测项配置</h3>${amkSearchBox('amk-env')}</div>${amkTable(['序号', '检测项', '检测内容', '检测规则版本', '状态'], env, 'amk-env')}${amkNote('支持大文件分片下载管理（分片大小与并发数可配置）、下载完整性校验（校验失败自动定位损坏分片重传）、安装环境检测项配置、安装包数字签名验证与安装环境修复建议。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.download.trade')}><div class="ai-list-head"><h3>交易订单与对账</h3>${amkSearchBox('amk-trades')}</div>${amkTable(['序号', '订单编号', '应用名称', '定价模式', '订单金额', '订单 / 支付 / 交付状态', '电子票据', '对账'], trades, 'amk-trades')}${amkNote('若涉及交易功能，严格遵循国家金融安全规范，提供安全的支付通道、交易记录查询、票据生成等服务；配套交易对账管理与退款流程管理、交易纠纷处理机制、交易安全风控执行。原文未给出验收方式。')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.3 应用下载', '5.5.2.2.8 应用购买与获取'], '', rq) +
    amkNote('5.5.2.2.3 的「申请—审核—解锁下载权限」与 5.5.2.2.8 的「付费购买成功后解锁下载权限」在原文中并存且关系未说明，本系统按三路径并列保留，未假定互斥或优先级。');
}
/* —— 6. 版本与更新运营 —— */
function amkVersion() {
  const rq = 'appmarket.admin.version';
  const notices = AMK_NOTICE.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, esc(r[1]), esc(r[2]), esc(r[3]), amkBadge(r[4], 'green')], i)).join('');
  const history = AMK_HISTORY.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, r[1], amkBadge(r[2], r[2] === '维护中' ? 'green' : 'orange'), r[3], esc(r[4]), r[5]], i)).join('');
  const release = AMK_RELEASE.map((r, i) => amkRow([`<b>${esc(r[0])}</b>`, r[1], r[2], esc(r[3]), esc(r[4])], i)).join('');
  $('#amk-content').innerHTML = amkMetrics([['更新通知模板', '4', '按更新类型差异化配置'], ['历史正式版本', '4', '统一存储 / 合规留存'], ['灰度批次', '2', '按用户批次逐步放量'], ['版本发布计划', '3', '含紧急补丁']]) +
    amkFilters(rq, [['更新类型', ['安全更新', '功能更新', '停维公告', '强制更新']], ['版本生命周期状态', ['维护中', '停止维护']], ['发布方式', ['错峰发布', '常规发布', '紧急补丁']]]) +
    `<section ${req(rq, 'appmarket.admin.version.notice')}><div class="ai-list-head"><h3>更新通知运营管理</h3>${amkSearchBox('amk-notices')}</div>${amkTable(['序号', '通知模板', '分级触达策略', '灰度 / 推送', '统计与跟踪', '状态'], notices, 'amk-notices')}${amkNote('系统自动在应用内生成并推送更新通知，向用户展示新版本号、更新内容及发布时间等信息；支持更新通知模板管理、更新分级触达策略、更新批次灰度推送、更新触达率统计与用户升级跟踪。原文另有「系统弹窗、消息推送」表述，并列保留。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.version.history')}><div class="ai-list-head"><h3>历史版本规范管理</h3>${amkSearchBox('amk-history')}</div>${amkTable(['序号', '应用名称', '历史版本', '生命周期状态', '合规留存策略', '完整性校验', '发布时间'], history, 'amk-history')}${amkNote('系统留存所有应用的历史正式版本，支持历史版本统一存储管理、版本差异说明管理、版本生命周期状态管理（维护中／停止维护）、版本合规留存策略配置、版本完整性校验与版本台账管理。')}</section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.version.release')}><div class="ai-list-head"><h3>版本发布计划与回退预案</h3>${amkSearchBox('amk-release')}</div>${amkTable(['序号', '版本发布计划', '发布窗口', '发布方式', '影响评估', '回退预案'], release, 'amk-release')}${amkNote('支持版本更新计划管理（迭代路线图）、版本发布窗口管理（重大版本错峰发布）、版本发布影响评估与回退预案管理、紧急补丁发布管理、停维版本提前公告。')}</section>` +
    amkSupport('支撑能力清单（原文仅列名称）', ['5.5.2.2.4 应用更新通知'], '', rq) +
    amkNote('版本／历史版本管理在 5.5.2.2.4.1 与 5.5.2.2.6.1.2 各写一遍，原文未说明是否为同一功能，本系统按原文同时保留、未做合并。');
}
/* —— 7. 功能结构清单 —— */
function amkCatalogRows() {
  const kw = amkCatalogKw.trim().toLowerCase();
  return AMK_ITEMS.filter(r => (!kw || [r.item, r.l1, r.l2, r.src, r.tech, r.landing].join(' ').toLowerCase().includes(kw)) &&
    (amkCatalogType === '全部' || r.type === amkCatalogType) && (amkCatalogLevel === '全部' || r.level === amkCatalogLevel))
    .map(r => `<tr><td>${r.no}</td><td>${esc(r.src)}</td><td>${esc(r.l1)}</td><td>${esc(r.l2)}</td><td>${esc(r.level)}</td><td>${amkBadge(r.type, r.type === '技术实施' ? 'orange' : '')}</td><td>${esc(r.item)}</td><td>${esc(r.tech || '—')}</td><td>${esc(r.landing)}</td><td>${esc(r.note || '—')}</td></tr>`).join('');
}
function amkCatalogPage() {
  const rq = 'appmarket.admin.catalog';
  $('#amk-content').innerHTML = `<div class="amk-filters" ${req(rq, 'appmarket.admin.catalog.filters')}>
      <input class="amk-search" id="amk-catalog-kw" placeholder="输入需求条目 / 出处 / 技术词查询" maxlength="120" value="${esc(amkCatalogKw)}" oninput="amkCatalogFilter(this)" aria-label="需求条目查询">
      <label>条目类型 <select id="amk-catalog-type" onchange="amkCatalogChange()">${['全部', '功能需求', '技术实施'].map(v => `<option ${amkCatalogType === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>叙述层级 <select id="amk-catalog-level" onchange="amkCatalogChange()">${['全部', '章节概述', '主段功能', '深化能力', '支撑能力·第1批', '支撑能力·第2批', '支撑能力·第3批', '章节末附加'].map(v => `<option ${amkCatalogLevel === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <button class="btn" onclick="amkCatalogReset()">重置</button><span class="amk-note">共 336 条 · 功能需求 221 条 / 技术实施 115 条</span></div>` +
    `<section ${req(rq, 'appmarket.admin.catalog.table')}><div class="ai-list-head"><h3>功能结构清单（原文逐字照录）</h3>${amkSearchBox('amk-catalog-rows')}</div>
      <div class="ai-table"><table class="amk-support"><thead><tr><th>序号</th><th>需求出处</th><th>一级模块</th><th>二级模块</th><th>叙述层级</th><th>条目类型</th><th>需求条目（原文照录）</th><th>技术实施要点（原文词）</th><th>原型落地位置（设计映射）</th><th>备注</th></tr></thead><tbody id="amk-catalog-rows">${amkCatalogRows()}</tbody></table></div></section>` +
    `<section class="amk-sec" ${req(rq, 'appmarket.admin.catalog.note')}><div class="ai-list-head"><h3>编制口径</h3></div><p class="amk-note">本清单 336 条全部逐字照录《5.5.2.2 应用市场》需求原文，未增、未删、未改写、未合并、未去重。原文仅提供名称的支撑能力在此只照录名称与出处，不补写字段、枚举或流程；「原型落地位置」为本原型的设计映射，不属于需求原文。原文编号层级不统一、4 处章节末附加支撑能力内容与所在章节不一致、多处内容交叉重复，均按原文位置照录。</p></section>`;
}
function amkCatalogFilter(input) { amkCatalogKw = input.value; const b = $('#amk-catalog-rows'); if (b) b.innerHTML = amkCatalogRows(); }
function amkCatalogChange() { amkCatalogType = $('#amk-catalog-type').value; amkCatalogLevel = $('#amk-catalog-level').value; const b = $('#amk-catalog-rows'); if (b) b.innerHTML = amkCatalogRows(); }
function amkCatalogReset() { amkCatalogKw = ''; amkCatalogType = '全部'; amkCatalogLevel = '全部'; amkCatalogPage(); }

/* —— 需求条目说明弹窗：所有内容取自原文清单 —— */
function amkReqDialog(l1, l2) {
  const list = AMK_ITEMS.filter(r => r.l1 === l1 && (!l2 || r.l2 === l2));
  const body = amkBlock('appmarket.admin.config.dialog', 'appmarket.admin.config.dialog.info', '需求出处信息', amkKv([['一级模块', l1], ['二级模块', l2 || '全部'], ['条目数', String(list.length)], ['数据来源', '门户应用市场功能结构清单（原文逐字照录）']])) +
    amkBlock('appmarket.admin.config.dialog', 'appmarket.admin.config.dialog.items', '原文条目清单', `<div class="ai-table"><table><thead><tr><th>序号</th><th>需求出处</th><th>叙述层级</th><th>需求条目（原文照录）</th></tr></thead><tbody>${list.map(r => `<tr><td>${r.no}</td><td>${esc(r.src)}</td><td>${esc(r.level)}</td><td>${esc(r.item)}</td></tr>`).join('')}</tbody></table></div>`) +
    amkBlock('appmarket.admin.config.dialog', 'appmarket.admin.config.dialog.tech', '技术实施要点（原文词）', `<div class="amk-tags">${[...new Set(list.map(r => r.tech).filter(Boolean).flatMap(t => t.split('、')))].map(t => `<span>${esc(t)}</span>`).join('') || '<span>本模块无技术实施命中词</span>'}</div>`) +
    amkBlock('appmarket.admin.config.dialog', 'appmarket.admin.config.dialog.note', '口径说明', `<p class="amk-note">条目类型由「原文技术词表」机械匹配得出，命中词逐字写入技术实施要点；未命中即为功能需求。原文没有技术方案层面的内容（技术选型、部署架构、接口规格、性能指标定义等均未写），此处不补写。</p>`) +
    amkBlock('appmarket.admin.config.dialog', 'appmarket.admin.config.dialog.actions', '操作区', `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button>`);
  amkDialog('需求条目说明 · ' + (l2 || l1), body, '<button class="btn" onclick="$(\'#overlay\').innerHTML=\'\'">关闭</button>', 'appmarket.admin.config.dialog');
}

/* —— 挂载：render 包装 + 快捷入口卡片 + URL 分派 —— */
const amkPreviousRender = render;
render = function () {
  if (section === 'appmarket') { amkRender(); return; }
  amkPreviousRender();
  if (section === 'launch') amkPatchLaunch();
};
names.push('应用市场后台管理系统');
colors.push(['#70b6d8', '#2a6c95']);
icons.push('<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="11" height="11" rx="2"/><rect x="19" y="4" width="11" height="11" rx="2"/><rect x="4" y="19" width="11" height="11" rx="2"/><rect x="19" y="19" width="11" height="11" rx="2"/></svg>');
document.addEventListener('click', e => {
  if (e.target.closest('[data-req-id="appmarket.admin.enter"]')) { e.stopImmediatePropagation(); selectSystem(names.indexOf('应用市场后台管理系统')); amkOpen('listing'); }
}, true);
function amkPatchLaunch() {
  const card = document.querySelector('.cards > .card:nth-child(' + (names.indexOf('应用市场后台管理系统') + 1) + ')');
  if (card) { card.setAttribute('data-req-id', 'appmarket.admin.enter'); card.setAttribute('data-req-element', 'appmarket.admin.enter'); card.removeAttribute('onclick'); }
}
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get('system') === 'appmarket' && ['categories','frequency','keywords','searchHistory','searchApi'].includes(q.get('view'))) return;
  if (q.get('system') === 'appmarket') amkOpen(amkTabs.includes(q.get('view')) ? q.get('view') : 'listing');
  else if (section === 'launch') render();
})();
