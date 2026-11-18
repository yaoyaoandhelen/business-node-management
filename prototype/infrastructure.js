// 基础设施管理系统 · 运行监测。一级菜单"运行监测"，二级菜单六个；数据为原型演示数据。
const infraTabs = ['overview', 'collection', 'objects', 'alerts', 'audit', 'control', 'efficiency'];
const infraTitles = {
  overview: '监测看板',
  collection: '运行信息收集',
  objects: '重要对象监测',
  alerts: '预警管理',
  audit: '审核管理',
  control: '采集与处置管控',
  efficiency: '运行效能分析'
};
let infraTab = 'overview',
  infraDetail = false,
  infraNode = 0,
  infraAlertTab = 'live',
  infraCtlTab = 'control',
  infraEffTab = 'reports',
  infraBoardFilter = { region: '', service: '', perm: '', level: '' };
let infraEffCycle = '',
  infraEffRankMetric = '传输成功率',
  infraEffRankType = '接入连接器',
  infraEffShortState = '';

// —— 演示数据 ——
const infraPermNames = { L1: 'L1-公开级', L2: 'L2-内部级', L3: 'L3-受控级', L4: 'L4-机密级' };
const infraPermHints = { L1: '默认开放', L2: '需授权', L3: '需审批', L4: '需二次验证' };
const infraNodes = [
  { name: '渝中政务数据业务节点', region: '渝中区', type: '业务节点', service: '数据流通服务', perm: 'L3', level: '一级', online: 1, health: 96, cpu: 62, mem: 71 },
  { name: '江北金融数据业务节点', region: '江北区', type: '业务节点', service: '数据流通服务', perm: 'L4', level: '一级', online: 1, health: 92, cpu: 78, mem: 66 },
  { name: '沙坪坝教育数据业务节点', region: '沙坪坝区', type: '业务节点', service: '技术支撑服务', perm: 'L2', level: '二级', online: 1, health: 88, cpu: 45, mem: 58 },
  { name: '南岸医疗数据业务节点', region: '南岸区', type: '业务节点', service: '安全审核服务', perm: 'L3', level: '一级', online: 0, health: 64, cpu: 12, mem: 33 },
  { name: '高新产业数据业务节点', region: '两江新区', type: '业务节点', service: '技术支撑服务', perm: 'L2', level: '二级', online: 1, health: 85, cpu: 55, mem: 60 },
  { name: '数据接入连接器-A1', region: '渝中区', type: '接入连接器', service: '数据流通服务', perm: 'L1', level: '二级', online: 1, health: 94, cpu: 38, mem: 52 },
  { name: '数据接入连接器-B2', region: '江北区', type: '接入连接器', service: '数据流通服务', perm: 'L3', level: '二级', online: 1, health: 90, cpu: 41, mem: 47 },
  { name: '数据接入连接器-C3', region: '九龙坡区', type: '接入连接器', service: '安全审核服务', perm: 'L2', level: '三级', online: 0, health: 70, cpu: 8, mem: 21 }
];
const infraEvents = [
  { time: '11-05 09:42', level: '较重', type: '指标超限', detail: 'CPU 使用率持续 15 分钟超过阈值 90%，已触发预警工单' },
  { time: '11-04 22:15', level: '一般', type: '心跳异常', detail: '心跳包延迟 8 秒，次轮采集自动恢复' },
  { time: '11-02 14:03', level: '重大', type: '离线告警', detail: '节点离线 26 分钟，处置完成后已归档复盘' },
  { time: '10-28 10:11', level: '一般', type: '磁盘 IO 波动', detail: '磁盘 I/O 速率短时升高，回落至正常区间' }
];
const infraTasks = [
  { name: '业务节点流量采集', obj: '全量业务节点', mode: '实时', metrics: '网络流量', freq: '秒级', state: '运行中' },
  { name: '连接器心跳采集', obj: '全量接入连接器', mode: '实时', metrics: '心跳包', freq: '秒级', state: '运行中' },
  { name: '资源指标周期采集', obj: '全量业务节点', mode: '周期', metrics: 'CPU / 内存 / 磁盘', freq: '每 30 秒', state: '运行中' },
  { name: '网络连接状况采集', obj: '全量业务节点与连接器', mode: '周期', metrics: '网络连接状况', freq: '每 1 分钟', state: '已暂停' },
  { name: '业务处理进度同步', obj: '全量业务节点', mode: '周期', metrics: '业务处理进度', freq: '每 5 分钟', state: '运行中' }
];
// 重要对象：可配置（在"重要对象监测"页勾选需监测的节点/连接器）
let infraObjectIdx = [0, 1, 3, 5, 6];
const infraObjectList = () => infraObjectIdx.map((i) => ({ ...infraNodes[i], idx: i }));
const infraAlerts = [
  { id: 'YJ-20261105-006', obj: '数据接入连接器-B2', type: '传输效率衰减', level: '较重', metric: '报文传输成功率 92.4%，低于历史基线', time: '11-05 15:47', channel: '短信、邮件、系统弹窗、APP弹窗', state: '待处置' },
  { id: 'YJ-20261105-005', obj: '江北金融数据业务节点', type: '负载隐性升高', level: '一般', metric: 'CPU 使用率 78%，超过历史基线 75%', time: '11-05 14:20', channel: '运维工作群、系统弹窗、APP弹窗', state: '处置中' },
  { id: 'YJ-20261105-004', obj: '南岸医疗数据业务节点', type: '节点离线', level: '重大', metric: '心跳包中断超过 5 分钟', time: '11-05 11:05', channel: '语音电话（核心负责人）、系统弹窗、APP弹窗', state: '处置中' },
  { id: 'YJ-20261104-003', obj: '数据接入连接器-C3', type: '丢包率超限', level: '一般', metric: '丢包率 3.2%，超过阈值 2%', time: '11-04 17:31', channel: '运维工作群、系统弹窗、APP弹窗', state: '已归档' }
];
// 历史故障解决方案库：按预警类型自动关联（依据需求 5.5.2.1.1.7「同步关联历史故障解决方案、处置知识沉淀」）
const infraSolutions = {
  传输效率衰减: [{ name: '连接器传输效率衰减处置方案', src: '归档复盘工单 GF-20261021-02', measure: '重启采集通道并切换备用链路，限速至 50% 观察 30 分钟', effect: '传输成功率 2 小时内恢复至基线 96%' }],
  负载隐性升高: [{ name: '节点负载隐性升高处置方案', src: '归档复盘工单 GF-20261008-01', measure: '定位高占用进程并扩容 CPU 配额，扩容后持续观察 1 小时', effect: 'CPU 使用率回落至 70% 以下' }],
  节点离线: [{ name: '节点心跳中断处置方案', src: '归档复盘工单 GF-20261012-03', measure: '排查网络链路与心跳服务，必要时切换多链路冗余采集', effect: '当次 26 分钟恢复在线' }],
  丢包率超限: [{ name: '链路丢包处置方案', src: '归档复盘工单 GF-20261018-01', measure: '切换备用链路并对上联端口做流量整形', effect: '丢包率回落至 0.5% 以下' }]
};
const infraRules = [
  { name: 'CPU 使用率超限', obj: '全量业务节点', cond: 'CPU 使用率 > 90% 持续 5 分钟', level: '较重', channel: '短信、邮件、系统弹窗、APP弹窗', on: 1 },
  { name: '节点心跳中断', obj: '全量业务节点', cond: '心跳包中断 > 5 分钟', level: '重大', channel: '语音电话（核心负责人）、系统弹窗、APP弹窗', on: 1 },
  { name: '传输成功率衰减', obj: '全量接入连接器', cond: '报文传输成功率 < 95% 持续 30 分钟', level: '较重', channel: '短信、邮件、系统弹窗、APP弹窗', on: 1 },
  { name: '丢包率超限', obj: '数据接入连接器-C3', cond: '丢包率 > 2% 即时触发', level: '一般', channel: '运维工作群、系统弹窗、APP弹窗', on: 1 }
];
const infraTickets = [
  { id: 'GD-20261105-004', alert: 'YJ-20261105-004 节点离线', owner: '陈运维', step: 2, state: '结果核验中' },
  { id: 'GD-20261105-003', alert: 'YJ-20261105-005 负载隐性升高', owner: '李运维', step: 1, state: '处置反馈中' },
  { id: 'GD-20261104-002', alert: 'YJ-20261104-003 丢包率超限', owner: '王运维', step: 4, state: '已归档' }
];
const infraTargets = [
  { name: '高新产业数据业务节点', type: '业务节点', policy: '限流', band: '限速 50 Mbps', note: '风险处置期间限速，恢复需审批' },
  { name: '数据接入连接器-C3', type: '接入连接器', policy: '断网', band: '流量已阻断', note: '重大异常处置，待影响评估' },
  { name: '沙坪坝教育数据业务节点', type: '业务节点', policy: '正常', band: '200 Mbps', note: '—' },
  { name: '数据接入连接器-A1', type: '接入连接器', policy: '正常', band: '150 Mbps', note: '—' }
];
const infraPlans = [
  { level: '一般', action: '限流', rate: '限速至 50%', duration: '持续观察 30 分钟', notify: '对象负责人', approver: '值班主管', on: 1 },
  { level: '较重', action: '限流', rate: '限速至 20%', duration: '持续直至评估完成', notify: '对象负责人、运维组', approver: '运维负责人', on: 1 },
  { level: '重大', action: '断网', rate: '流量阻断', duration: '持续直至评估完成', notify: '对象负责人、运维组、区域管理员', approver: '区域管理员', on: 1 }
];
const infraPlanOptions = {
  level: ['一般', '较重', '重大'],
  action: ['限流', '断网', '降级运行', '仅通知'],
  rate: ['限速至 70%', '限速至 50%', '限速至 20%', '限速至 10%', '流量阻断'],
  duration: ['持续观察 15 分钟', '持续观察 30 分钟', '持续观察 60 分钟', '持续直至评估完成'],
  notify: ['对象负责人', '对象负责人、运维组', '对象负责人、运维组、区域管理员'],
  approver: ['值班主管', '运维负责人', '区域管理员']
};
const infraApprovals = [
  { id: 'SP-20261105-002', applier: '李运维', action: '对数据接入连接器-B2 实施限流', level: '较重', detail: { obj: '数据接入连接器-B2', type: '接入连接器', kind: '限流', plan: '限速至 20%，同步通知对象负责人', level: '较重', reason: '报文传输成功率 92.4%，低于历史基线，触发较重预警' }, time: '11-05 16:02', state: '待审批' },
  { id: 'SP-20261105-003', applier: '陈运维', action: '对南岸医疗数据业务节点实施一键断网', level: '重大', detail: { obj: '南岸医疗数据业务节点', type: '业务节点', kind: '断网', plan: '一键断网阻断，启动审批与影响范围评估', level: '重大', reason: '节点心跳中断超过 5 分钟，触发重大预警' }, time: '11-05 11:10', state: '待审批' },
  { id: 'SP-20261105-001', applier: '王运维', action: '恢复高新产业数据业务节点流量', level: '一般', detail: { obj: '高新产业数据业务节点', type: '业务节点', kind: '解除', plan: '解除限流并恢复带宽，恢复后持续观察 30 分钟', level: '一般', reason: '限流处置完成，指标回归基线，申请恢复' }, time: '11-05 10:40', state: '已通过', reviewer: '值班主管', reviewedAt: '11-05 10:52', opinion: '指标已回归基线，同意恢复。' },
  { id: 'SP-20261104-001', applier: '赵运维', action: '对数据接入连接器-C3 实施断网', level: '重大', detail: { obj: '数据接入连接器-C3', type: '接入连接器', kind: '断网', plan: '一键断网阻断，启动审批与影响范围评估', level: '重大', reason: '丢包率 3.2%，超过阈值 2%' }, time: '11-04 17:40', state: '已通过', reviewer: '区域管理员', reviewedAt: '11-04 17:46', opinion: '重大异常，同意断网并同步启动影响评估。' },
  { id: 'SP-20261103-002', applier: '李运维', action: '对沙坪坝教育数据业务节点实施限流', level: '一般', detail: { obj: '沙坪坝教育数据业务节点', type: '业务节点', kind: '限流', plan: '限速至 50%，持续观察 30 分钟', level: '一般', reason: 'CPU 使用率短时升高，申请预防性限流' }, time: '11-03 14:22', state: '已驳回', reviewer: '值班主管', reviewedAt: '11-03 14:35', opinion: '指标已自行回落，无需预防性限流，请持续观察。' }
];
let infraAuditTab = 'pending',
  infraAuditFilter = { applier: '', level: '', kind: '' },
  infraAuditDraft = { result: '通过', opinion: '' },
  infraAuditIdx = -1;
const infraEvidence = [
  { op: '一键断网', target: '数据接入连接器-C3', user: '陈运维', time: '11-05 11:06', hash: '0x8f3a72c1…e4b9c21e' },
  { op: '限流策略变更', target: '高新产业数据业务节点', user: '李运维', time: '11-05 09:15', hash: '0x4bd209af…97aa33d2' },
  { op: '处置解除', target: '数据接入连接器-B2', user: '王运维', time: '11-04 16:20', hash: '0x21c88d5e…0f6a44b8' }
];
const infraLinks = [
  { link: '主采集链路（区域中心）', state: '正常', note: '采集断点自动续传：无积压' },
  { link: '备采集链路（多链路冗余）', state: '正常', note: '数据缺口自动补采：今日补采 3 条' },
  { link: '移动端表单上报链路', state: '异常自愈', note: '11-05 08:22 链路异常，已自动修复' }
];
const infraLedger = [
  { no: 'TZ-20261105-03', obj: '数据接入连接器-C3', action: '断网阻断', level: '重大', start: '11-05 11:06', state: '处置中' },
  { no: 'TZ-20261105-02', obj: '高新产业数据业务节点', action: '限速 50 Mbps', level: '较重', start: '11-05 09:15', state: '处置中' },
  { no: 'TZ-20261104-01', obj: '数据接入连接器-B2', action: '限流后恢复', level: '一般', start: '11-04 16:20', state: '已恢复' }
];
const infraReports = [
  { cycle: '2026-10 月度运行质量报告', generated: '11-01 09:00', summary: '平均无故障时长 412h · 故障频次 3 次 · 传输效率环比 +1.2%', push: '已按订阅推送 12 人' },
  { cycle: '2026-W44 周度运行质量报告', generated: '11-02 09:00', summary: '平均无故障时长 96h · 故障频次 1 次', push: '已按订阅推送 12 人' },
  { cycle: '2026-W43 周度运行质量报告', generated: '10-26 09:00', summary: '平均无故障时长 92h · 故障频次 2 次', push: '已按订阅推送 12 人' }
];
const infraShorts = [
  { obj: '数据接入连接器-C3', issue: '传输效率低于基线，丢包率偏高', reason: '跨区链路带宽不足，高峰期拥塞', advice: '扩容链路带宽至 200 Mbps', state: '待采纳' },
  { obj: '南岸医疗数据业务节点', issue: '本月离线 1 次，故障频次偏高', reason: '硬盘读写错误率与温度趋势异常，存在故障风险', advice: '更换硬盘与风扇备件，纳入运维周期', state: '已采纳' }
];
const infraAvail = [100,100,100,100,100,100,100,100,100,100,100,100,74,100,100,100,100,100,100,100,100,100,100,100,100,100,86,100,100,100];
const infraCpuTrend = [58,62,60,64,61,66,63,59,62,68,65,61,20,58,63,67,70,64,62,66,69,71,68,64,62,60,66,72,69,66];

// —— 导航与页面骨架 ——
// 侧边模块菜单对应的需求标记：在工作室"需求交互说明"模式下点击菜单可直接切换模块说明
const infraNavReq = { overview: 'infra.board.view', collection: 'infra.collect', objects: 'infra.objects.view', alerts: 'infra.alerts.confirm', audit: 'infra.audit', control: 'infra.control.limit', efficiency: 'infra.eff.reports' };
function infraOpen(tab = 'overview') {
  infraDetail = false;
  infraTab = infraTabs.includes(tab) ? tab : 'overview';
  section = 'infrastructure';
  const u = new URL(location.href);
  u.searchParams.set('system', 'infrastructure');
  u.searchParams.set('view', infraTab);
  history.replaceState(null, '', u);
  render();
}
function infraBackLaunch() {
  section = 'launch';
  history.replaceState(null, '', '?system=management');
  render();
}
function infraBadge(level) {
  const cls = level === '重大' ? 'red' : level === '较重' ? 'orange' : '';
  return `<span class="ai-badge ${cls}">${level}</span>`;
}
function infraMeter(label, v, off) {
  const cls = off ? 'off' : v >= 75 ? 'bad' : v >= 60 ? 'warn' : '';
  return `<div class="infra-meter ${cls}"><span>${label}</span><i style="width:${off ? 4 : v}%"></i><b style="white-space:nowrap;flex-shrink:0">${off ? '—' : v + '%'}</b></div>`;
}
function infraFlow(step) {
  const names = ['预警派单', '处置反馈', '结果核验', '归档复盘'];
  return `<div class="infra-flow">${names
    .map((n, i) => `<span class="${i + 1 < step ? 'done' : i + 1 === step ? 'current' : ''}">${n}</span>`)
    .join('<em>→</em>')}</div>`;
}
function infraBarChart(data, unit = '') {
  const max = Math.max(...data.map((d) => d.v));
  return `<div class="ai-chart">${data
    .map((d) => `<div><i style="height:${Math.round((d.v / max) * 88)}%" title="${d.v}${unit}"></i><b>${d.v}${unit}</b><span>${d.k}</span></div>`)
    .join('')}</div>`;
}
function infraDialog(title, body, foot, reqId, element) {
  $('#overlay').innerHTML = `<div class="veil"><section class="modal ai-modal infra-modal" aria-label="${title}" ${reqId ? req(reqId, element || reqId) : ''}><div class="modalhead">${title}<button class="close" onclick="$('#overlay').innerHTML=''">×</button></div><div class="modalbody">${body}</div>${foot ? `<div class="modalfoot">${foot}</div>` : ''}</section></div>`;
}
// 通用表格查询：关键字包含匹配，隐藏不匹配行
function infraSearch(input, bodyId) {
  const kw = input.value.trim();
  document.querySelectorAll('#' + bodyId + ' tr').forEach((tr) => {
    tr.style.display = !kw || tr.textContent.includes(kw) ? '' : 'none';
  });
}
const infraSearchBox = (bodyId, ph = '输入关键字查询') =>
  `<input placeholder="${ph}" oninput="infraSearch(this,'${bodyId}')" style="height:34px;border:1px solid #dce2eb;border-radius:4px;padding:0 12px;min-width:220px;font:inherit;color:#52637b;background:#fff">`;
const infraListHead = (title, small, bodyId) =>
  `<div class="ai-list-head"><h3>${title}${small ? ` <small>${small}</small>` : ''}</h3>${bodyId ? infraSearchBox(bodyId) : ''}</div>`;
function infraRender() {
  const i = infraTabs.indexOf(infraTab);
  $('#sidebar').innerHTML =
    `<div class="ai-nav-title">基础设施管理系统</div><div class="ais-group">运行监测<span>⌄</span></div>` +
    infraTabs
      .map(
        (t) =>
          `<button class="ai-nav-item ${t === infraTab && !infraDetail ? 'active' : ''}" ${req(infraNavReq[t] || 'infra.board.view', 'infrastructure.nav.' + t)} onclick="infraOpen('${t}')">${infraTitles[t]}${t === 'alerts' ? `<small>${infraAlerts.filter((a) => a.state !== '已归档').length}</small>` : t === 'audit' ? `<small>${infraApprovals.filter((a) => a.state === '待审批').length}</small>` : ''}</button>`
      )
      .join('') +
    `<button class="ai-back" onclick="infraBackLaunch()">⇤ 返回快捷入口</button>`;
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="infraBackLaunch()">首页</span><span class="selected">● 基础设施管理系统</span></div>` +
    `<div class="ai-page infra-page" data-req-module="infrastructure" data-req-page="${infraDetail ? 'infra-overview' : 'infra-' + infraTab}" data-req-surface="${infraDetail ? 'infrastructure.overview.node' : 'infrastructure.' + infraTab}" data-req-title="${infraDetail ? esc(infraNodes[infraNode].name) + ' · 节点运行详情' : infraTitles[infraTab]}">` +
    `<div class="crumb">基础设施管理系统 / ${infraDetail ? '监测看板 / 节点详情' : infraTitles[infraTab]}</div>` +
    `<div id="infra-content"></div></div>`;
  if (infraDetail) infraNodeDetail();
  else [infraBoard, infraCollect, infraObjectsPage, infraAlertsPage, infraAuditPage, infraControlPage, infraEfficiencyPage][i]();
}

// —— 监测看板 ——
function infraBoard() {
  const biz = infraNodes.filter((n) => n.type === '业务节点');
  const con = infraNodes.filter((n) => n.type === '接入连接器');
  const avg = Math.round(infraNodes.reduce((s, n) => s + n.health, 0) / infraNodes.length);
  $('#infra-content').innerHTML =
    `<div class="ai-metrics" ${req('infra.board.view', 'infrastructure.overview.metrics')}>` +
    `<article><span>业务节点在线率</span><strong>${Math.round((biz.filter((n) => n.online).length / biz.length) * 1000) / 10}%</strong><small>在线 ${biz.filter((n) => n.online).length} / 共 ${biz.length} 个</small></article>` +
    `<article><span>连接器在线率</span><strong>${Math.round((con.filter((n) => n.online).length / con.length) * 1000) / 10}%</strong><small>在线 ${con.filter((n) => n.online).length} / 共 ${con.length} 个</small></article>` +
    `<article><span>健康度评分（均值）</span><strong>${avg}</strong><small>全量业务节点与连接器</small></article>` +
    `<article><span>今日预警</span><strong>${infraAlerts.filter((a) => a.time.startsWith('11-05')).length}</strong><small>重大 1 · 较重 2</small></article>` +
    `</div>` +
    `<section class="panel" ${req('infra.board.view')}><div class="ai-filters" ${req('infra.board.view', 'infrastructure.overview.filters')} onchange="infraBoardFilter.region=$('[data-f=region]').value;infraBoardFilter.service=$('[data-f=service]').value;infraBoardFilter.perm=$('[data-f=perm]').value;infraBoardFilter.level=$('[data-f=level]').value;infraDrawBoard()">
      <label>行政区域 <select data-f="region"><option value="">全部</option>${[...new Set(infraNodes.map((n) => n.region))].map((r) => `<option>${r}</option>`).join('')}</select></label>
      <label>节点等级 <select data-f="level"><option value="">全部</option><option>一级</option><option>二级</option><option>三级</option></select></label>
      <label>服务类型 <select data-f="service"><option value="">全部</option>${[...new Set(infraNodes.map((n) => n.service))].map((r) => `<option>${r}</option>`).join('')}</select></label>
      <label>权限分级 <select data-f="perm"><option value="">全部</option>${Object.keys(infraPermNames).map((k) => `<option value="${k}">${infraPermNames[k]}</option>`).join('')}</select></label>
    </div><div class="ai-table" ${req('infra.board.view', 'infrastructure.overview.table')}><table><thead><tr><th>序号</th><th>对象名称</th><th>类型</th><th>行政区域</th><th>节点等级</th><th>服务类型</th><th>权限分级</th><th>在线状态</th><th>健康度</th><th>CPU / 内存</th><th>操作</th></tr></thead><tbody id="infra-board-rows"></tbody></table></div></section>`;
  infraDrawBoard();
}
function infraDrawBoard() {
  const list = infraNodes.filter(
    (n) =>
      (!infraBoardFilter.region || n.region === infraBoardFilter.region) &&
      (!infraBoardFilter.service || n.service === infraBoardFilter.service) &&
      (!infraBoardFilter.perm || n.perm === infraBoardFilter.perm) &&
      (!infraBoardFilter.level || n.level === infraBoardFilter.level)
  );
  $('#infra-board-rows').innerHTML = list
    .map((n, i) => {
      const idx = infraNodes.indexOf(n);
      return `<tr><td>${i + 1}</td><td><b>${esc(n.name)}</b></td><td>${n.type}</td><td>${n.region}</td><td><span class="ai-badge ${n.level === '一级' ? 'orange' : ''}">${n.level}</span></td><td>${n.service}</td><td title="${infraPermHints[n.perm]}"><span class="ai-badge ${n.perm === 'L4' ? 'red' : n.perm === 'L3' ? 'orange' : ''}">${infraPermNames[n.perm]}</span></td><td><span class="ai-badge ${n.online ? 'green' : 'red'}">${n.online ? '在线' : '离线'}</span></td><td>${n.health}</td><td>${n.online ? n.cpu + '% / ' + n.mem + '%' : '—'}</td><td class="ai-actions"><button class="link" ${req('infra.board.view')} onclick="infraNode=${idx};infraDetail=true;render()">查看详情</button></td></tr>`;
    })
    .join('') || '<tr><td colspan="11" class="empty">暂无匹配对象</td></tr>';
}
function infraNodeDetail() {
  const n = infraNodes[infraNode];
  const W = 620, H = 150;
  const line = (arr) =>
    arr.map((v, i) => `${(i * W) / (arr.length - 1)},${H - ((v - 0) / 100) * (H - 16) - 8}`).join(' ');
  $('#infra-content').innerHTML =
    `<div class="infra-detail-head" ${req('infra.board.detail', 'infrastructure.overview.node.head')}><div><b style="font-size:17px;color:#2c466a">${esc(n.name)}</b><span class="ai-badge" style="margin-left:10px">${n.type} · ${n.level} · ${infraPermNames[n.perm]}</span></div><button class="btn" onclick="infraDetail=false;render()">← 返回看板</button></div>` +
    `<div class="ai-metrics" ${req('infra.board.detail', 'infrastructure.overview.node.metrics')}><article><span>在线状态</span><strong style="color:${n.online ? '#35a178' : '#d77672'}">${n.online ? '在线' : '离线'}</strong><small>行政区域：${n.region} · 服务类型：${n.service}</small></article><article><span>健康度评分</span><strong>${n.health}</strong><small>综合运行状态评分</small></article><article><span>CPU 使用率</span><strong>${n.online ? n.cpu + '%' : '—'}</strong><small>当前采集值</small></article><article><span>内存占用率</span><strong>${n.online ? n.mem + '%' : '—'}</strong><small>当前采集值</small></article></div>` +
    `<section class="panel" style="margin-bottom:20px" ${req('infra.board.detail', 'infrastructure.overview.node.curve')}><h3>近 30 天运行参数曲线</h3><div class="infra-curve"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${line(infraAvail)}" fill="none" stroke="#35a178" stroke-width="2"/><polyline points="${line(infraCpuTrend)}" fill="none" stroke="#7fa7dd" stroke-width="2"/></svg><div class="infra-curve-legend"><span><i style="background:#35a178"></i>在线率（30 天前 → 今日）</span><span><i style="background:#7fa7dd"></i>CPU 使用率</span></div></div></section>` +
    `<section class="panel" style="margin-bottom:20px" ${req('infra.board.detail', 'infrastructure.overview.node.events')}>${infraListHead('历史事件记录', null, 'infra-event-rows')}<div class="ai-table"><table><thead><tr><th>序号</th><th>时间</th><th>级别</th><th>事件类型</th><th>事件说明</th></tr></thead><tbody id="infra-event-rows">${infraEvents
      .map((e, i) => `<tr><td>${i + 1}</td><td>${e.time}</td><td>${infraBadge(e.level)}</td><td>${e.type}</td><td>${esc(e.detail)}</td></tr>`)
      .join('')}</tbody></table></div></section>`;
}

// —— 运行信息收集 ——
function infraCollect() {
  $('#infra-content').innerHTML =
    `<section class="panel" style="margin-bottom:20px" ${req('infra.collect', 'infrastructure.collect.access')}><h3>采集接入</h3>
      <div class="infra-protocols"><span class="infra-protocol">HTTP <i>● 已接入</i></span><span class="infra-protocol">HTTPS <i>● 已接入</i></span><span class="infra-protocol">WebSocket <i>● 已接入</i></span></div>
      <div class="infra-priority" style="margin-top:12px"><span>实时数据采集引擎：秒级捕获业务节点流量、接入连接器心跳包</span><span>定时任务调度器：配置周期性指标采集策略（CPU / 内存 / 磁盘）</span></div>
      <div class="infra-priority" style="margin-top:10px"><b style="color:#5c7191">支持采集方式（并列）：</b><span>IoT 传感器自动采集</span><span>业务系统接口同步</span><span>移动端表单填报</span><em style="color:#93a5bd">采集精度最高可达毫秒级</em></div></section>` +
    `<section class="panel" style="margin-bottom:20px" ${req('infra.collect', 'infrastructure.collect.tasks')}>${infraListHead('采集任务', null, 'infra-task-rows')}
      <div class="ai-table"><table><thead><tr><th>序号</th><th>任务名称</th><th>采集对象</th><th>采集方式</th><th>指标项</th><th>采集频率</th><th>状态</th></tr></thead><tbody id="infra-task-rows">${infraTasks
        .map(
          (t, i) =>
            `<tr><td>${i + 1}</td><td><b>${esc(t.name)}</b></td><td>${t.obj}</td><td><span class="ai-badge ${t.mode === '实时' ? 'green' : ''}">${t.mode}</span></td><td>${t.metrics}</td><td>${t.freq}</td><td><span class="ai-badge ${t.state === '运行中' ? 'green' : 'orange'}">${t.state}</span></td></tr>`
        )
        .join('')}</tbody></table></div></section>` +
    `<section class="panel" style="margin-bottom:20px" ${req('infra.collect', 'infrastructure.collect.pipeline')}><div class="ai-list-head"><h3>监测数据整合</h3><span class="ai-badge green">链路正常</span></div>
      <div class="infra-pipe">
        <div class="infra-pipe-step"><span>01 采集</span><b>3,860<small>万条</small></b><em>多协议实时采集 + 周期上报</em></div><i>›</i>
        <div class="infra-pipe-step"><span>02 清洗</span><b>1,284<small>条</small></b><em>正则 + 规则引擎过滤无效/异常</em></div><i>›</i>
        <div class="infra-pipe-step"><span>03 标准化</span><b>2.4<small>万条</small></b><em>异构数据统一 JSON Schema</em></div><i>›</i>
        <div class="infra-pipe-step"><span>04 去重</span><b>356<small>条</small></b><em>时间戳 + 哈希值比对消除重复</em></div><i>›</i>
        <div class="infra-pipe-step done"><span>05 入库</span><b>8.6<small>亿点</small></b><em>热数据指标库在线可查</em></div>
      </div>
      <div class="infra-pipe-legend"><span><i class="green"></i>清洗、去重为今日剔除量</span><span><i></i>标准化为异构报文转换量</span><span>数据来源：区域中心主链路 + 备链路冗余采集</span></div>
    </section>` +
    `<section class="panel" ${req('infra.collect', 'infrastructure.collect.storage')}><div class="ai-list-head"><h3>存储分层</h3><span class="ai-badge">热数据在线保留 90 天</span></div>
      <div class="infra-storage">
        <article><h4>热数据 · TDengine 指标库</h4><b>8.6 亿 <small style="font-size:12px;color:#8b99ad;font-weight:400">/ 10 亿点</small></b><div class="infra-tier"><i style="width:86%"></i></div><p>设备运行指标，支持 10 亿级数据点存储 · 已用 86%</p></article>
        <article><h4>日志 · MongoDB 集群</h4><b>2.3 TB</b><div class="infra-tier"><i style="width:54%"></i></div><p>非结构化日志分布式存储，3 节点副本集 · 已用 54%</p></article>
        <article><h4>冷数据 · Hadoop 生态存储</h4><b>11.2 TB</b><div class="infra-tier cold"><i style="width:37%"></i></div><p>超 90 天历史数据自动分层归档 · 已用 37%</p></article>
      </div></section>`;
}

// —— 重要对象监测 ——
function infraObjectsPage() {
  const list = infraObjectList();
  $('#infra-content').innerHTML =
    `<section class="panel" ${req('infra.objects.view', 'infrastructure.objects.list')}><div class="ai-list-head"><h3>重要对象监测清单</h3><div class="infra-head-tools">${infraSearchBox('infra-obj-rows')}<button class="btn primary" ${req('infra.objects.config', 'infrastructure.objects.config.entry')} onclick="infraObjectConfig()">⚙ 配置监测对象</button></div></div>
    <div class="ai-table infra-obj-table"><table><thead><tr><th>序号</th><th>对象名称</th><th>类型</th><th>节点等级</th><th>权限分级</th><th>CPU / 内存</th><th>状态</th><th>关联预警</th><th>操作</th></tr></thead><tbody id="infra-obj-rows">${list
      .map((n, i) => {
        const off = !n.online;
        const cnt = infraAlerts.filter((a) => a.obj === n.name && a.state !== '已归档').length;
        return `<tr><td>${i + 1}</td><td><b>${esc(n.name)}</b></td><td>${n.type}</td><td><span class="ai-badge ${n.level === '一级' ? 'orange' : ''}">${n.level}</span></td><td title="${infraPermHints[n.perm]}"><span class="ai-badge ${n.perm === 'L4' ? 'red' : n.perm === 'L3' ? 'orange' : ''}">${infraPermNames[n.perm]}</span></td><td>${off ? '<span class="muted">—</span>' : `<div class="infra-usage-meters">${infraMeter('CPU', n.cpu)}${infraMeter('内存', n.mem)}</div>`}</td><td><span class="ai-badge ${off ? 'red' : n.cpu >= 75 ? 'orange' : 'green'}">${off ? '离线' : n.cpu >= 75 ? '关注' : '正常'}</span></td><td>${cnt ? `<span class="ai-badge orange">${cnt} 条</span>` : '<span class="muted">—</span>'}</td><td class="ai-actions"><button class="link" ${req('infra.objects.view', 'infrastructure.objects.kpi')} onclick="infraKpi(${n.idx})">KPI 详情</button><button class="link" ${req('infra.objects.view', 'infrastructure.objects.records')} onclick="infraObjectAlerts(${n.idx})">预警记录</button></td></tr>`;
      })
      .join('')}</tbody></table></div></section>`;
}
function infraObjectConfig() {
  const regions = [...new Set(infraNodes.map((n) => n.region))];
  const services = [...new Set(infraNodes.map((n) => n.service))];
  infraDialog(
    '配置监测对象',
    `<p class="muted" style="font-size:13px;margin:0 0 14px">勾选需纳入重要对象监测的业务节点与接入连接器；未勾选对象仅在监测看板中展示，不做 KPI 持续监测。</p>
     <div class="infra-obj-filters" ${req('infra.objects.config', 'infrastructure.objects.config.filters')}>
       <label>类型 <select id="infra-of-type" onchange="infraObjectFilter()"><option value="">全部</option><option>业务节点</option><option>接入连接器</option></select></label>
       <label>节点等级 <select id="infra-of-level" onchange="infraObjectFilter()"><option value="">全部</option><option>一级</option><option>二级</option><option>三级</option></select></label>
       <label>权限分级 <select id="infra-of-perm" onchange="infraObjectFilter()"><option value="">全部</option>${Object.keys(infraPermNames).map((k) => `<option value="${k}">${infraPermNames[k]}</option>`).join('')}</select></label>
       <label>行政区域 <select id="infra-of-region" onchange="infraObjectFilter()"><option value="">全部</option>${regions.map((r) => `<option>${r}</option>`).join('')}</select></label>
       <label>服务类型 <select id="infra-of-service" onchange="infraObjectFilter()"><option value="">全部</option>${services.map((r) => `<option>${r}</option>`).join('')}</select></label>
       <label class="infra-of-key">查询 <input id="infra-of-key" placeholder="对象名称关键字" oninput="infraObjectFilter()"></label>
       <button class="btn" onclick="infraObjectFilter(1)">重置</button>
     </div>
     <div class="infra-check-list" id="infra-obj-list">${infraNodes
       .map(
         (n, i) =>
           `<label class="infra-check-item" data-obj-item="${i}" data-type="${n.type}" data-level="${n.level}" data-perm="${n.perm}" data-region="${n.region}" data-service="${n.service}" data-name="${esc(n.name)}"><input type="checkbox" data-obj="${i}" ${infraObjectIdx.includes(i) ? 'checked' : ''}><span><b>${esc(n.name)}</b><small>${n.type} · ${n.level} · ${infraPermNames[n.perm]} · ${n.service} · ${n.region}</small></span></label>`
       )
       .join('')}</div>
     <p class="muted" id="infra-of-count" style="font-size:12px;margin:12px 0 0"></p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraObjectConfigSave()">保存配置</button>`,
    'infra.objects.config',
    'infrastructure.objects.config.dialog'
  );
  infraObjectFilter();
}
function infraObjectFilter(reset) {
  if (reset) {
    ['infra-of-type', 'infra-of-level', 'infra-of-perm', 'infra-of-region', 'infra-of-service'].forEach((id) => ($('#' + id).value = ''));
    $('#infra-of-key').value = '';
  }
  const type = $('#infra-of-type').value, level = $('#infra-of-level').value, perm = $('#infra-of-perm').value, region = $('#infra-of-region').value, service = $('#infra-of-service').value, key = $('#infra-of-key').value.trim();
  let shown = 0, checked = 0;
  document.querySelectorAll('.infra-check-item').forEach((el) => {
    const hit =
      (!type || el.getAttribute('data-type') === type) &&
      (!level || el.getAttribute('data-level') === level) &&
      (!perm || el.getAttribute('data-perm') === perm) &&
      (!region || el.getAttribute('data-region') === region) &&
      (!service || el.getAttribute('data-service') === service) &&
      (!key || el.getAttribute('data-name').includes(key));
    el.style.display = hit ? '' : 'none';
    if (hit) shown++;
    if (el.querySelector('input').checked) checked++;
  });
  const total = document.querySelectorAll('.infra-check-item').length;
  $('#infra-of-count').textContent = `筛选结果 ${shown}/${total} 个对象 · 已选监测对象 ${checked} 个（筛选不影响已勾选状态）`;
}
function infraObjectConfigSave() {
  const picked = [...document.querySelectorAll('.infra-check-item input:checked')].map((el) => Number(el.getAttribute('data-obj')));
  if (!picked.length) return toast('请至少选择一个监测对象');
  infraObjectIdx = picked.sort((a, b) => a - b);
  $('#overlay').innerHTML = '';
  render();
  toast('已保存，当前监测对象 ' + picked.length + ' 个');
}
function infraObjectAlerts(i) {
  const n = infraNodes[i];
  const list = infraAlerts.filter((a) => a.obj === n.name);
  infraDialog(
    '预警记录 · ' + n.name,
    list.length
      ? `<div class="ai-table"><table><thead><tr><th>序号</th><th>预警编号</th><th>预警类型</th><th>级别</th><th>时间</th><th>状态</th></tr></thead><tbody>${list
          .map((a, k) => `<tr><td>${k + 1}</td><td>${a.id}</td><td>${esc(a.type)}</td><td>${infraBadge(a.level)}</td><td>${a.time}</td><td>${a.state}</td></tr>`)
          .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">预警的确认、通知与处置统一在「预警管理 · 实时预警与处置工单」中完成，本页只做查看。</p>`
      : `<p class="muted" style="font-size:13px">该对象当前无预警记录。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button><button class="btn primary" onclick="$('#overlay').innerHTML='';infraOpen('alerts')">前往预警管理</button>`,
    'infra.objects.view',
    'infrastructure.objects.records.dialog'
  );
}
function infraKpi(i) {
  const n = infraNodes[i];
  infraDialog(
    'KPI 详情 · ' + n.name,
    `<dl><dt>对象类型</dt><dd>${n.type}</dd><dt>节点等级 / 权限分级</dt><dd>${n.level} · ${infraPermNames[n.perm]}（${infraPermHints[n.perm]}）</dd><dt>所属区域 / 服务类型</dt><dd>${n.region} · ${n.service}</dd><dt>CPU 使用率</dt><dd>当前 ${n.online ? n.cpu + '%' : '—'}，告警阈值 90%</dd><dt>内存占用率</dt><dd>当前 ${n.online ? n.mem + '%' : '—'}，告警阈值 85%</dd><dt>磁盘 I/O 速率</dt><dd>当前 ${n.online ? Math.round(n.cpu * 1.4) + ' MB/s' : '—'}，告警阈值 200 MB/s</dd><dt>监测方式</dt><dd>秒级实时采集 + 周期资源指标采集，业务高峰时段持续监测</dd></dl>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button>`,
    'infra.objects.view',
    'infrastructure.objects.kpi.dialog'
  );
}

// —— 预警管理 ——
function infraAlertsPage() {
  const tabs = { live: '实时预警与处置工单', rules: '预警规则库', stats: '统计分析' };
  $('#infra-content').innerHTML =
    `<section class="panel" style="padding:0!important;margin-bottom:20px;overflow:hidden"><div class="ais-tabs" style="padding:0 24px;margin:0">${Object.entries(tabs)
      .map(([k, n]) => `<button class="${infraAlertTab === k ? 'active' : ''}" onclick="infraAlertTab='${k}';render()">${n}</button>`)
      .join('')}</div><div style="padding:24px" id="infra-alert-body"></div></section>`;
  const b = $('#infra-alert-body');
  if (infraAlertTab === 'live')
    b.innerHTML =
      infraListHead('实时预警', null, 'infra-alert-rows') +
      `<div class="ai-table" ${req('infra.alerts.deal', 'infrastructure.alerts.deal.table')}><table class="infra-alert-table"><thead><tr><th style="width:56px">序号</th><th style="width:128px">预警编号</th><th>预警对象</th><th style="width:168px">对象当前指标</th><th style="width:104px">预警类型</th><th>触发指标</th><th style="width:64px">级别</th><th style="width:96px">时间</th><th style="width:76px">状态</th><th style="width:118px">操作</th></tr></thead><tbody id="infra-alert-rows">${infraAlerts
        .map((a, i) => {
          const node = infraNodes.find((n) => n.name === a.obj);
          return `<tr><td>${i + 1}</td><td>${a.id}</td><td><b>${esc(a.obj)}</b></td><td>${node ? (node.online ? `<div class="infra-usage-meters">${infraMeter('CPU', node.cpu)}${infraMeter('内存', node.mem)}</div>` : '<span class="ai-badge red">离线</span>') : '<span class="muted">—</span>'}</td><td>${a.type}</td><td>${esc(a.metric)}</td><td>${infraBadge(a.level)}</td><td>${a.time}</td><td><span class="ai-badge ${a.state === '已归档' ? 'green' : a.state === '待处置' ? 'orange' : a.state === '已误判' ? '' : 'orange'}">${a.state}</span></td><td class="ai-actions">${a.state === '已归档' ? '<button class="link" onclick="infraTicketDetail(2)">查看归档</button>' : a.state === '已误判' ? '<span class="muted" style="font-size:12px">已标记误判</span>' : `<button class="link" ${req('infra.alerts.deal', 'infrastructure.alerts.deal.action')} onclick="infraAlertDeal(${i})">处置</button><button class="link" ${req('infra.alerts.confirm', 'infrastructure.alerts.confirm.action')} onclick="infraAlertConfirm(${i})">预警确认</button>`}</td></tr>`;
        })
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">「对象当前指标」展示预警对象最近一次上报的 CPU / 内存占用，帮助判断预警严重程度；对象离线时标识离线。通知渠道不在列表中单独展示，在预警确认弹窗中按级别自动勾选并支持调整，口径：一般 → 运维工作群；较重 → 短信、邮件；重大 → 语音电话呼叫核心负责人；系统弹窗与 APP 弹窗所有级别默认勾选。预警确认用于判定该预警为真实异常还是误报：确认预警时系统按级别自动勾选渠道并支持人工调整后发送；误判标记则不生成处置工单、不发送通知。</p>` +
      `<section class="panel" style="margin-top:20px">${infraListHead('处置工单', null, 'infra-ticket-rows')}<div class="ai-table infra-ticket-table" ${req('infra.alerts.deal', 'infrastructure.alerts.deal.tickets')}><table><thead><tr><th>序号</th><th>工单号</th><th>关联预警</th><th>处置人</th><th>闭环进度</th><th>状态</th><th>操作</th></tr></thead><tbody id="infra-ticket-rows">${infraTickets
        .map(
          (t, i) =>
            `<tr><td>${i + 1}</td><td>${t.id}</td><td>${esc(t.alert)}</td><td>${t.owner}</td><td>${infraFlow(t.step)}</td><td><span class="ai-badge ${t.state === '已归档' ? 'green' : 'orange'}">${t.state}</span></td><td class="ai-actions"><button class="link" onclick="infraTicketDetail(${i})">详情</button></td></tr>`
        )
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">预警确认后自动生成处置工单，工单与预警在同页联动展示，便于跟踪闭环进度。</p></section>`;
  if (infraAlertTab === 'rules')
    b.innerHTML =
      infraListHead('预警规则库', null, 'infra-rule-rows') +
      `<button class="btn primary" ${req('infra.alerts.rules', 'infrastructure.alerts.rules.new')} onclick="infraRuleNew()" style="margin-bottom:14px">＋ 新增规则</button><div class="ai-table" ${req('infra.alerts.rules', 'infrastructure.alerts.rules.table')}><table><thead><tr><th>序号</th><th>规则名称</th><th>预警对象</th><th>触发条件</th><th>级别判定</th><th>通知渠道</th><th>启用</th><th>操作</th></tr></thead><tbody id="infra-rule-rows">${infraRules
        .map(
          (r, i) =>
            `<tr><td>${i + 1}</td><td><b>${esc(r.name)}</b></td><td>${esc(r.obj)}</td><td>${esc(r.cond)}</td><td>${infraBadge(r.level)}</td><td>${r.channel}</td><td><span class="ai-badge ${r.on ? 'green' : ''}">${r.on ? '启用' : '停用'}</span></td><td class="ai-actions"><button class="link" onclick="toast('规则已${r.on ? '停用' : '启用'}')">${r.on ? '停用' : '启用'}</button></td></tr>`
        )
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">内置降噪策略：同类预警自动聚合，抑制重复告警；超时未处置的预警按升级机制自动升级通知。级别判定默认按预警对象的权限分级自动生成（L1/L2→一般、L3→较重、L4→重大），支持手动修改；通知渠道随级别自动匹配。</p>`;
  if (infraAlertTab === 'stats') {
    const W = 620, H = 150;
    const trend = [4, 3, 5, 2, 2, 1, 0];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const pts = trend.map((v, i) => `${(i * W) / (trend.length - 1)},${H - (v / 6) * (H - 20) - 10}`).join(' ');
    const area = `0,${H} ${pts} ${W},${H}`;
    b.innerHTML =
      `<div class="ai-metrics" style="grid-template-columns:repeat(4,1fr)" ${req('infra.alerts.stats', 'infrastructure.alerts.stats.metrics')}>` +
      `<article><span>本周预警总数</span><strong>17</strong><small>一般 12 · 较重 4 · 重大 1</small></article>` +
      `<article><span>平均处置时效</span><strong>1.6h</strong><small>从预警触发到结果核验</small></article>` +
      `<article><span>超时自动升级</span><strong style="color:#35a178">0 件</strong><small>升级机制：超时未处置自动升级</small></article>` +
      `<article><span>处置闭环率</span><strong>94.1%</strong><small>16 / 17 已归档复盘</small></article></div>` +
      `<div class="infra-hero">` +
      `<section class="panel" ${req('infra.alerts.stats', 'infrastructure.alerts.stats.distribution')}><h3>预警级别分布 <small>本周 · 17 件</small></h3><div style="margin-top:18px">` +
      `<div class="ai-distribution"><span>一般预警（运维工作群 + 系统/APP弹窗）</span><b>12 件 · 70.6%</b><div><i style="width:70.6%;background:#7fa7dd"></i></div></div>` +
      `<div class="ai-distribution"><span>较重预警（短信、邮件 + 弹窗）</span><b>4 件 · 23.5%</b><div><i style="width:23.5%;background:#e0a94f"></i></div></div>` +
      `<div class="ai-distribution"><span>重大预警（语音电话呼叫核心负责人）</span><b>1 件 · 5.9%</b><div><i style="width:5.9%;background:#d77672"></i></div></div>` +
      `</div><p class="muted" style="font-size:12px;margin:16px 0 0">按异常影响范围与严重程度分级，通知渠道随级别自动匹配。</p></section>` +
      `<section class="panel"><h3>近 7 日预警趋势</h3><div class="infra-curve" style="margin-top:14px"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polygon points="${area}" fill="#e3edfa"/><polyline points="${pts}" fill="none" stroke="#5d84bd" stroke-width="2.5"/></svg><div class="infra-curve-legend"><span><i style="background:#5d84bd"></i>每日预警量（件）</span>${days.map((d, i) => `<span>${d} ${trend[i]}</span>`).join('')}</div></div></section>` +
      `</div>` +
      `<section class="panel"><h3>分级处置时效统计</h3><div class="ai-table"><table><thead><tr><th>预警级别</th><th>本周数量</th><th>平均处置时效</th><th>通知渠道</th><th>超时升级</th><th>闭环率</th></tr></thead><tbody>` +
      `<tr><td>${infraBadge('一般')}</td><td>12 件</td><td>2.1h</td><td>运维工作群、系统/APP弹窗</td><td>0 件</td><td>91.7%</td></tr>` +
      `<tr><td>${infraBadge('较重')}</td><td>4 件</td><td>1.4h</td><td>短信、邮件、弹窗</td><td>0 件</td><td>100%</td></tr>` +
      `<tr><td>${infraBadge('重大')}</td><td>1 件</td><td>0.3h</td><td>语音电话、弹窗</td><td>0 件</td><td>100%</td></tr>` +
      `</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">统计口径：按预警触发时间归入当周，闭环率 = 已归档复盘工单 / 对应级别预警量；系统弹窗与 APP 弹窗为全级别默认渠道，不计入分级渠道统计。</p></section>`;
  }
}
function infraAlertBase(a) {
  const node = infraNodes.find((n) => n.name === a.obj);
  const sols = infraSolutions[a.type] || [];
  return `<h3>预警信息</h3><dl><dt>预警对象</dt><dd>${esc(a.obj)}</dd><dt>预警类型 / 级别</dt><dd>${a.type} · ${infraBadge(a.level)}</dd><dt>触发指标</dt><dd>${esc(a.metric)}</dd><dt>触发时间</dt><dd>${a.time}</dd><dt>通知渠道</dt><dd>${a.channel}（按级别自动匹配）</dd></dl>
   <h3>对象当前指标</h3>${node ? (node.online ? `<div class="infra-usage-meters" style="max-width:340px;margin:4px 0 10px">${infraMeter('CPU', node.cpu)}${infraMeter('内存', node.mem)}</div><dl><dt>健康度评分</dt><dd>${node.health}</dd><dt>在线状态</dt><dd><span class="ai-badge green">在线</span></dd></dl>` : `<dl><dt>在线状态</dt><dd><span class="ai-badge red">离线</span></dd><dt>健康度评分</dt><dd>${node.health}</dd></dl>`) : '<p class="muted" style="font-size:13px;margin:4px 0 10px">—</p>'}
   <h3>关联历史方案 <small style="font-weight:400;color:#8b9bb0">按预警类型自动匹配</small></h3>${sols
     .map(
       (s, k) =>
         `<div style="border:1px solid #e3e9f2;border-radius:8px;padding:12px 16px;margin:6px 0 10px"><b style="font-size:13px">${k + 1}. ${esc(s.name)}</b><dl style="margin:8px 0 0"><dt>来源</dt><dd>${esc(s.src)}</dd><dt>处置措施</dt><dd>${esc(s.measure)}</dd><dt>处置效果</dt><dd>${esc(s.effect)}</dd></dl></div>`
     )
     .join('') || '<p class="muted" style="font-size:13px;margin:0 0 14px">暂无同类型历史故障解决方案。</p>'}`;
}
function infraAlertDeal(i) {
  const a = infraAlerts[i];
  infraDialog(
    '预警处置 · ' + a.id,
    infraAlertBase(a) +
    `<h3>闭环处置</h3><div style="margin:6px 0 16px">${infraFlow(1)}</div>
     <label class="field-line">处置意见<textarea placeholder="请输入处置措施与结果"></textarea></label>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraDealSubmit(${i})">提交处置反馈</button>`,
    'infra.alerts.deal',
    'infrastructure.alerts.deal.dialog'
  );
}
function infraDealSubmit(i) {
  $('#overlay').innerHTML = '';
  render();
  toast('处置反馈已提交，进入结果核验');
}
function infraAlertConfirm(i) {
  const a = infraAlerts[i];
  const map = {
    一般: ['运维工作群', '系统弹窗', 'APP弹窗'],
    较重: ['短信', '邮件', '系统弹窗', 'APP弹窗'],
    重大: ['语音电话呼叫核心负责人', '系统弹窗', 'APP弹窗']
  };
  const all = ['运维工作群', '短信', '邮件', '语音电话呼叫核心负责人', '系统弹窗', 'APP弹窗'];
  const picked = map[a.level] || [];
  infraDialog(
    '预警确认 · ' + a.id,
    infraAlertBase(a) +
    `<h3>确认结论 <small style="font-weight:400;color:#8b9bb0">判定该预警是真实异常还是误报</small></h3>
     <div class="infra-channel-grid" style="margin:4px 0 16px">
       <label class="infra-channel"><input type="radio" name="infra-verdict" value="real" checked onchange="document.getElementById('infra-verdict-ch').style.display=''"><span>确认预警 · 真实异常，进入处置闭环</span></label>
       <label class="infra-channel"><input type="radio" name="infra-verdict" value="misjudge" onchange="document.getElementById('infra-verdict-ch').style.display='none'"><span>误判标记 · 误报告警，不进入处置闭环</span></label>
     </div>
     <div id="infra-verdict-ch">
     <h3>通知渠道 <small style="font-weight:400;color:#8b9bb0">已按预警级别自动勾选，可调整</small></h3>
     <div class="infra-channel-grid">${all
       .map(
         (c) => `<label class="infra-channel"><input type="checkbox" data-ch="${c}" ${picked.includes(c) ? 'checked' : ''}><span>${c}</span></label>`
       )
       .join('')}</div>
     <p class="muted" style="font-size:12px;margin:0 0 14px">级别规则：一般 → 运维工作群；较重 → 短信、邮件；重大 → 语音电话呼叫核心负责人；系统弹窗与 APP 弹窗所有级别默认勾选。</p>
     </div>
     <label class="field-line">确认备注<textarea id="infra-confirm-note" placeholder="可选：填写确认依据、已采取措施等"></textarea></label>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraAlertConfirmSave(${i})">提交确认</button>`,
    'infra.alerts.confirm',
    'infrastructure.alerts.confirm.dialog'
  );
}
function infraAlertConfirmSave(i) {
  const a = infraAlerts[i];
  const verdict = (document.querySelector('input[name="infra-verdict"]:checked') || {}).value || 'real';
  $('#overlay').innerHTML = '';
  if (verdict === 'misjudge') {
    a.state = '已误判';
    a.misjudge = true;
    render();
    toast('已标记为误报告警，不生成处置工单、不发送通知');
    return;
  }
  const chs = [...document.querySelectorAll('.infra-channel input[type="checkbox"]:checked')].map((el) => el.getAttribute('data-ch'));
  if (!chs.length) return toast('请至少选择一个通知渠道');
  infraAlerts[i].channel = chs.join('、');
  if (infraAlerts[i].state === '待处置') infraAlerts[i].state = '处置中';
  render();
  toast('已确认预警（真实异常），按级别向 ' + chs.length + ' 个渠道发送通知');
}
const infraRulePresets = [
  { name: 'CPU 使用率超限', metric: 'CPU 使用率', op: '>', th: '90', unit: '%', dur: '持续 5 分钟' },
  { name: '内存占用过高', metric: '内存占用率', op: '>', th: '85', unit: '%', dur: '持续 5 分钟' },
  { name: '磁盘 I/O 超限', metric: '磁盘 I/O 速率', op: '>', th: '200', unit: 'MB/s', dur: '持续 5 分钟' },
  { name: '节点心跳中断', metric: '心跳包中断', op: '>', th: '5', unit: '分钟', dur: '即时触发' },
  { name: '传输成功率衰减', metric: '报文传输成功率', op: '<', th: '95', unit: '%', dur: '持续 30 分钟' },
  { name: '丢包率超限', metric: '丢包率', op: '>', th: '2', unit: '%', dur: '即时触发' },
  { name: '响应时延超限', metric: '响应时延', op: '>', th: '200', unit: 'ms', dur: '持续 5 分钟' },
  { name: '磁盘故障风险预测', metric: '硬盘读写错误率 / 温度趋势', op: '>', th: '预警基线', unit: '', dur: '模型预测触发' }
];
const infraChannelByLevel = {
  一般: '运维工作群、系统弹窗、APP弹窗',
  较重: '短信、邮件、系统弹窗、APP弹窗',
  重大: '语音电话呼叫核心负责人、系统弹窗、APP弹窗'
};
const infraLevelByPerm = { L1: '一般', L2: '一般', L3: '较重', L4: '重大' };
function infraRuleNew() {
  const p = infraRulePresets[0];
  infraDialog(
    '新增预警规则',
    `<label class="field-line"><span>规则名称 <i style="color:#c0392b;font-style:normal">*</i></span><select id="infra-rule-name" onchange="infraRuleNameChange()">${infraRulePresets.map((x) => `<option>${x.name}</option>`).join('')}</select></label>
     <label class="field-line"><span>预警对象 <i style="color:#c0392b;font-style:normal">*</i></span><select id="infra-rule-obj" onchange="infraRuleObjChange()"><option value="">全量对象（业务节点与接入连接器）</option>${infraNodes.map((n) => `<option>${esc(n.name)}</option>`).join('')}</select></label>
     <div class="infra-rule-cond"><label>监测指标<select id="infra-rule-metric">${[...new Set(infraRulePresets.map((x) => x.metric))].map((m) => `<option>${m}</option>`).join('')}</select></label><label>比较符<select id="infra-rule-op"><option>&gt;</option><option>&lt;</option><option>≥</option><option>≤</option></select></label><label>阈值<input id="infra-rule-th" value="${p.th}"></label><label>单位<input id="infra-rule-unit" value="${p.unit}" readonly></label><label>持续时长<select id="infra-rule-dur">${['即时触发', '持续 1 分钟', '持续 5 分钟', '持续 30 分钟', '模型预测触发'].map((d) => `<option ${d === p.dur ? 'selected' : ''}>${d}</option>`).join('')}</select></label></div>
     <label class="field-line">级别判定<select id="infra-rule-level" onchange="infraRuleLevelChange()">${['一般', '较重', '重大'].map((l) => `<option ${l === '较重' ? 'selected' : ''}>${l}</option>`).join('')}</select><small style="color:#8b9bb0;font-size:12px" id="infra-rule-level-hint">按预警对象的权限分级自动判定（L1/L2→一般、L3→较重、L4→重大），可手动修改</small></label>
     <label class="field-line">通知渠道<input id="infra-rule-channel" value="${infraChannelByLevel['较重']}" readonly style="background:#f6f8fc;color:#7c8ca3"></label>
     <p class="muted" style="font-size:12px;margin:6px 0 0">通知渠道随级别自动匹配：一般 → 运维工作群；较重 → 短信、邮件；重大 → 语音电话呼叫核心负责人；系统弹窗与 APP 弹窗默认全部勾选。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraRuleSave()">保存</button>`,
    'infra.alerts.rules',
    'infrastructure.alerts.rules.dialog'
  );
}
function infraRuleNameChange() {
  const name = $('#infra-rule-name').value;
  const p = infraRulePresets.find((x) => x.name === name);
  if (!p) return;
  $('#infra-rule-metric').value = p.metric;
  $('#infra-rule-op').value = p.op;
  $('#infra-rule-th').value = p.th;
  $('#infra-rule-unit').value = p.unit;
  $('#infra-rule-dur').value = p.dur;
}
function infraRuleObjChange() {
  const obj = $('#infra-rule-obj').value;
  const node = infraNodes.find((n) => n.name === obj);
  const level = node ? infraLevelByPerm[node.perm] : '较重';
  $('#infra-rule-level').value = level;
  $('#infra-rule-level-hint').textContent = node
    ? `已按「${obj}」的权限分级 ${infraPermNames[node.perm]} 自动判定为「${level}」，可手动修改`
    : '全量对象未绑定具体权限分级，默认按「较重」判定，可手动修改';
  infraRuleLevelChange();
}
function infraRuleLevelChange() {
  $('#infra-rule-channel').value = infraChannelByLevel[$('#infra-rule-level').value] || '';
}
function infraRuleSave() {
  const name = $('#infra-rule-name').value.trim();
  if (!name) return toast('请填写规则名称');
  const obj = $('#infra-rule-obj').value || '全量业务节点与接入连接器';
  const metric = $('#infra-rule-metric').value,
    op = $('#infra-rule-op').value,
    th = $('#infra-rule-th').value,
    unit = $('#infra-rule-unit').value,
    dur = $('#infra-rule-dur').value;
  const level = $('#infra-rule-level').value;
  infraRules.unshift({ name, obj, cond: `${metric} ${op} ${th}${unit} ${dur}`, level, channel: infraChannelByLevel[level], on: 1 });
  $('#overlay').innerHTML = '';
  render();
  toast('规则已保存并启用');
}
function infraTicketDetail(i) {
  const t = infraTickets[i];
  infraDialog(
    '处置工单 · ' + t.id,
    `<dl><dt>关联预警</dt><dd>${esc(t.alert)}</dd><dt>处置人</dt><dd>${t.owner}</dd><dt>当前环节</dt><dd>${t.state}</dd></dl><h3>闭环流程</h3><div style="margin:8px 0 6px">${infraFlow(t.step === 4 ? 5 : t.step)}</div><p class="muted" style="font-size:12px;margin:10px 0 0">闭环流程：预警派单 → 处置反馈 → 结果核验 → 归档复盘。工单同步关联历史故障解决方案，归档后生成复盘记录。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button>`,
    'infra.alerts.deal',
    'infrastructure.alerts.deal.ticket.dialog'
  );
}

// —— 审核管理 ——（处置操作审批独立成页，交互参考主体身份审核管理）
function infraAuditPage() {
  const tabs = { pending: '待我审批', completed: '我已审批' };
  const pending = infraApprovals.filter((a) => a.state === '待审批');
  $('#infra-content').innerHTML =
    `<div class="ai-metrics" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px" ${req('infra.audit', 'infrastructure.audit.metrics')}>` +
    `<article><span>待审批</span><strong>${pending.length}</strong><small>重大 ${pending.filter((a) => a.level === '重大').length} · 较重 ${pending.filter((a) => a.level === '较重').length}</small></article>` +
    `<article><span>本月已审批</span><strong>${infraApprovals.filter((a) => a.state !== '待审批').length}</strong><small>通过 ${infraApprovals.filter((a) => a.state === '已通过').length} · 驳回 ${infraApprovals.filter((a) => a.state === '已驳回').length}</small></article>` +
    `<article><span>平均审批时效</span><strong>11 分钟</strong><small>从提交到出具结论</small></article>` +
    `<article><span>重大处置审批</span><strong>区域管理员</strong><small>一般/较重 → 值班主管或运维负责人</small></article></div>` +
    `<section class="panel" style="padding:0!important;overflow:hidden"><div class="ais-tabs" style="padding:0 24px;margin:0">${Object.entries(tabs)
      .map(([k, n]) => `<button class="${infraAuditTab === k ? 'active' : ''}" ${req('infra.audit', 'infrastructure.audit.tabs')} onclick="infraAuditTab='${k}';render()">${n} <span>${k === 'pending' ? pending.length : infraApprovals.filter((a) => a.state !== '待审批').length}</span></button>`)
      .join('')}</div><div style="padding:24px" id="infra-audit-body"></div></section>`;
  const list = infraApprovals
    .filter((a) => (infraAuditTab === 'pending' ? a.state === '待审批' : a.state !== '待审批'))
    .filter((a) => (!infraAuditFilter.level || a.level === infraAuditFilter.level) && (!infraAuditFilter.applier || a.applier.includes(infraAuditFilter.applier)));
  $('#infra-audit-body').innerHTML =
    `<div class="ai-filters" style="margin-bottom:16px" ${req('infra.audit', 'infrastructure.audit.query')} onchange="infraAuditFilter.applier=$('[data-a=applier]').value;infraAuditFilter.level=$('[data-a=level]').value;infraAuditFilter.kind=$('[data-a=kind]').value;render()">
      <label>申请人 <input data-a="applier" placeholder="申请人姓名" value="${esc(infraAuditFilter.applier)}"></label>
      <label>审核类型 <select data-a="kind"><option value="">全部</option>${['限流', '断网', '解除'].map((k) => `<option ${k === infraAuditFilter.kind ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
      <label>风险等级 <select data-a="level"><option value="">全部</option>${['一般', '较重', '重大'].map((l) => `<option ${l === infraAuditFilter.level ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <button class="btn" onclick="infraAuditFilter={applier:'',level:'',kind:''};render()">重置</button>
    </div>` +
    `<div class="ai-table" ${req('infra.audit', 'infrastructure.audit.table')}><table><thead><tr><th>序号</th><th>申请编号</th><th>申请人</th><th>审核类型</th><th>申请事项</th><th>风险等级</th><th>申请时间</th><th>状态</th><th>操作</th></tr></thead><tbody>${list
      .map((a) => {
        const i = infraApprovals.indexOf(a);
        const kindCls = a.detail.kind === '断网' ? 'red' : a.detail.kind === '限流' ? 'orange' : 'green';
        return `<tr><td>${infraApprovals.indexOf(a) + 1}</td><td>${a.id}</td><td>${a.applier}</td><td><span class="ai-badge ${kindCls}">${a.detail.kind}</span></td><td>${esc(a.action)}</td><td>${infraBadge(a.level)}</td><td>${a.time}</td><td><span class="ai-badge ${a.state === '已通过' ? 'green' : a.state === '已驳回' ? 'red' : 'orange'}">${a.state}</span></td><td class="ai-actions">${a.state === '待审批' ? `<button class="link" ${req('infra.audit', 'infrastructure.audit.handle')} onclick="infraAuditOpen(${i})">审核</button>` : `<button class="link" onclick="infraAuditOpen(${i})">详情</button>`}</td></tr>`;
      })
      .join('') || '<tr><td colspan="9" class="empty">暂无审批单</td></tr>'}</tbody></table></div>` +
    `<p class="muted" style="font-size:12px;margin:14px 0 0">审批范围：限流、断网、解除恢复等处置操作提交的审批单；重大处置须区域管理员审批，一般/较重由值班主管或运维负责人审批，结论出具后自动通知申请人并上链存证。</p>`;
}
function infraAuditOpen(i) {
  infraAuditIdx = i;
  infraAuditDraft = { result: '通过', opinion: '', error: '' };
  infraAuditRender();
}
function infraAuditClose() {
  $('#overlay').innerHTML = '';
  infraAuditIdx = -1;
}
function infraAuditSwitch(kind) {
  const t = infraApprovals.findIndex((x) => x.detail.kind === kind && x.state === '待审批');
  if (t < 0) return toast('暂无「' + kind + '」类型的待审批单');
  infraAuditIdx = t;
  infraAuditDraft = { result: '通过', opinion: '', error: '' };
  infraAuditRender();
}
function infraAuditRender() {
  const a = infraApprovals[infraAuditIdx];
  if (!a) return;
  const d = a.detail;
  const readOnly = a.state !== '待审批';
  const kinds = [...new Set(infraApprovals.map((x) => x.detail.kind))];
  const approveReq = d.level === '重大' ? '区域管理员' : d.level === '较重' ? '运维负责人' : '值班主管';
  const records = infraApprovals.map((x, idx) => ({ x, idx })).filter(({ x }) => x.detail.obj === d.obj).sort((p, q) => p.x.time.localeCompare(q.x.time));
  const stateCls = (x) => (x.state === '已通过' ? 'done' : x.state === '已驳回' ? 'rejected' : 'current');
  $('#overlay').innerHTML =
    `<div class="identity-audit-veil"><section class="identity-audit-dialog" role="dialog" aria-modal="true" aria-labelledby="infra-audit-title" data-req-page="infrastructure.audit" data-req-surface="infrastructure.audit" data-req-layer="dialog" data-req-title="处置操作审核">
      <div class="identity-audit-header" ${req('infra.audit', 'infrastructure.audit.dialog.context')}>
        <div><span class="identity-audit-eyebrow">基础设施管理系统 · 审核管理</span><h1 id="infra-audit-title">处置审核 <span class="identity-audit-state">${readOnly ? a.state : '待我审批'}</span></h1></div>
        <button class="identity-audit-close" aria-label="关闭审核弹窗" onclick="infraAuditClose()">×</button>
      </div>
      <div class="identity-audit-scenarios" ${req('infra.audit', 'infrastructure.audit.dialog.switch')}>
        <span>审核类型</span>
        <div role="tablist" aria-label="切换审核类型">${kinds.map((k) => `<button role="tab" aria-selected="${d.kind === k}" class="${d.kind === k ? 'active' : ''}" onclick="infraAuditSwitch('${k}')">${k}</button>`).join('')}</div>
      </div>
      <p class="identity-audit-demo-hint">此处多个审核类型弹窗仅作原型展示，真实审核流每次只有一个审核类型。</p>
      <div class="identity-audit-layout">
        <div class="identity-audit-information">
          <section class="identity-audit-focus" ${req('infra.audit', 'infrastructure.audit.dialog.subject')}>
            <span class="identity-audit-focus-icon">⚙</span>
            <div><h2>${esc(d.obj)}</h2><p>对象类型：${d.type}</p><p>提交人：${a.applier} <span>提交时间：${a.time}</span></p></div>
            <div class="identity-audit-ref"><span>申请编号</span><strong>${a.id}</strong></div>
          </section>
          <section class="identity-audit-section" ${req('infra.audit', 'infrastructure.audit.dialog.request')}>
            <div class="identity-audit-section-title"><h2>本次处置申请</h2><span>${d.kind}处置申请</span></div>
            <dl class="identity-audit-fields"><div><dt>申请事项</dt><dd>${esc(a.action)}</dd></div><div><dt>触发原因</dt><dd>${esc(d.reason)}</dd></div><div><dt>处置动作</dt><dd><span class="ai-badge ${d.kind === '断网' ? 'red' : d.kind === '限流' ? 'orange' : 'green'}">${d.kind}</span></dd></div></dl>
          </section>
          <section class="identity-audit-section" ${req('infra.audit', 'infrastructure.audit.dialog.plan')}>
            <div class="identity-audit-section-title"><h2>处置对象与匹配预案</h2><span>按风险等级自动匹配启用中的预案</span></div>
            <dl class="identity-audit-fields"><div><dt>处置对象</dt><dd>${esc(d.obj)}（${d.type}）</dd></div><div><dt>预案策略</dt><dd>${esc(d.plan)}</dd></div><div><dt>风险等级</dt><dd>${infraBadge(d.level)}</dd></div><div><dt>审批要求</dt><dd>${approveReq}</dd></div></dl>
          </section>
          ${readOnly ? `<section class="identity-audit-section" ${req('infra.audit', 'infrastructure.audit.dialog.result')}><div class="identity-audit-section-title"><h2>审批结论</h2><span>${esc(a.reviewer || '')} · ${esc(a.reviewedAt || '')}</span></div><dl class="identity-audit-fields"><div><dt>结论</dt><dd><span class="ai-badge ${a.state === '已通过' ? 'green' : 'red'}">${a.state}</span></dd></div><div class="wide"><dt>审批意见</dt><dd>${esc(a.opinion || '—')}</dd></div></dl></section>` : ''}
        </div>
        <div class="identity-audit-side">
          <aside class="identity-audit-decision" ${req('infra.audit', 'infrastructure.audit.dialog.decision')}>
            <div class="identity-audit-decision-heading"><span>审核工作区</span><h2>${readOnly ? '审核结果' : '请完成处置审核'}</h2></div>
            ${readOnly ? `<div class="identity-audit-read-result"><span class="identity-badge ${a.state === '已通过' ? 'green' : 'red'}">${a.state}</span><dl><dt>审批人</dt><dd>${esc(a.reviewer || '—')}</dd><dt>审批时间</dt><dd>${esc(a.reviewedAt || '—')}</dd><dt>审批意见</dt><dd>${esc(a.opinion || '—')}</dd></dl></div>` : `<form id="infra-audit-form" onsubmit="event.preventDefault();infraAuditSubmit()"><fieldset><legend>审核结果 <em>*</em></legend><label class="identity-audit-choice ${infraAuditDraft.result === '通过' ? 'selected' : ''}"><input type="radio" name="infra-audit-result" value="通过" ${infraAuditDraft.result === '通过' ? 'checked' : ''} onchange="infraAuditDraft.result=this.value;infraAuditDraft.error='';infraAuditRender()">通过</label><label class="identity-audit-choice ${infraAuditDraft.result === '驳回' ? 'selected' : ''}"><input type="radio" name="infra-audit-result" value="驳回" ${infraAuditDraft.result === '驳回' ? 'checked' : ''} onchange="infraAuditDraft.result=this.value;infraAuditDraft.error='';infraAuditRender()">驳回</label></fieldset><label class="identity-audit-opinion">审批意见 ${infraAuditDraft.result === '驳回' ? '<em>*</em>' : '<span>（选填）</span>'}<textarea aria-label="审批意见" maxlength="300" placeholder="${infraAuditDraft.result === '驳回' ? '请填写驳回原因，便于处置人补充材料或调整方案' : '请输入审批意见'}" oninput="infraAuditDraft.opinion=this.value;infraAuditDraft.error='';">${esc(infraAuditDraft.opinion)}</textarea></label><p class="identity-audit-error" role="alert">${esc(infraAuditDraft.error || '')}</p><div class="identity-audit-submit"><button type="submit" class="btn primary">提交审核</button></div></form>`}
          </aside>
          <section class="identity-audit-section identity-flow-section" ${req('infra.audit', 'infrastructure.audit.dialog.flow')}>
            <div class="identity-audit-section-title"><h2>历史审批记录</h2><span class="identity-flow-type">${esc(d.obj)}</span></div>
            <div class="identity-flow-body">${records
              .map(
                ({ x }) =>
                  `<ol class="identity-flow" aria-label="${esc(x.detail.obj)}历史审批记录"><li class="done"><span class="identity-flow-marker">✓</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>提交处置申请</strong><time>${x.time}</time></div><p>${esc(x.applier)} · ${esc(x.action)}</p></div></li><li class="${stateCls(x)}"><span class="identity-flow-marker">${x.state === '待审批' ? '2' : x.state === '已通过' ? '✓' : '×'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>处置审核</strong><span class="identity-flow-status ${stateCls(x)}">${x.state === '待审批' ? '待审核' : '审核' + (x.state === '已通过' ? '通过' : '驳回')}</span></div><p>${x.state === '待审批' ? '待审批人出具结论' : esc(x.reviewer || '') + (x.reviewedAt ? ` <time>${x.reviewedAt}</time>` : '')}</p>${x.state !== '待审批' && x.opinion ? `<div class="identity-flow-opinion">${esc(x.opinion)}</div>` : ''}</div></li><li class="${x.state === '已通过' ? 'done' : 'upcoming'}"><span class="identity-flow-marker">${x.state === '已通过' ? '✓' : '3'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>审核完成</strong>${x.state === '已通过' ? `<time>${x.reviewedAt}</time>` : ''}</div>${x.state === '已通过' ? '<p>已按预案执行处置并上链存证</p>' : x.state === '已驳回' ? '<p>申请已驳回，已通知处置人</p>' : ''}</div></li></ol>`
              )
              .join('') || '<div class="identity-flow-empty">暂无该对象审批记录</div>'}</div>
          </section>
        </div>
      </div>
    </section></div>`;
}
function infraAuditSubmit() {
  const a = infraApprovals[infraAuditIdx];
  if (!a) return;
  const pass = infraAuditDraft.result === '通过';
  const opinion = (infraAuditDraft.opinion || '').trim();
  if (!pass && !opinion) {
    infraAuditDraft.error = '请填写驳回原因。';
    return infraAuditRender();
  }
  if (opinion.length > 300) {
    infraAuditDraft.error = '审批意见最多 300 字。';
    return infraAuditRender();
  }
  a.state = pass ? '已通过' : '已驳回';
  a.reviewer = '当前审批人';
  a.reviewedAt = '11-06 16:10';
  a.opinion = opinion || (pass ? '核对处置对象与匹配预案无误，同意按预案执行。' : '');
  infraAuditClose();
  render();
  toast(pass ? `审核通过：${a.id} 将按预案执行并上链存证` : `已驳回：${a.id} 已通知申请人`);
}

// —— 采集与处置管控 ——
function infraControlPage() {
  const tabs = { control: '断网限流处置', plan: '处置预案配置', evidence: '存证与审计', link: '链路保障与台账' };
  $('#infra-content').innerHTML =
    `<section class="panel" style="padding:0!important;margin-bottom:20px;overflow:hidden"><div class="ais-tabs" style="padding:0 24px;margin:0">${Object.entries(tabs)
      .map(([k, n]) => `<button class="${infraCtlTab === k ? 'active' : ''}" onclick="infraCtlTab='${k}';render()">${n}</button>`)
      .join('')}</div><div style="padding:24px" id="infra-ctl-body"></div></section>`;
  const b = $('#infra-ctl-body');
  if (infraCtlTab === 'control')
    b.innerHTML =
      infraListHead('断网限流管控对象', null, 'infra-target-rows') +
      `<div class="ai-table" ${req('infra.control.limit', 'infrastructure.control.limit.table')}><table><thead><tr><th>序号</th><th>对象名称</th><th>类型</th><th>当前策略</th><th>带宽 / 限速</th><th>说明</th><th>操作</th></tr></thead><tbody id="infra-target-rows">${infraTargets
        .map(
          (t, i) =>
            `<tr><td>${i + 1}</td><td><b>${esc(t.name)}</b></td><td>${t.type}</td><td><span class="ai-badge ${t.policy === '正常' ? 'green' : t.policy === '限流' ? 'orange' : 'red'}">${t.policy}</span></td><td>${t.band}</td><td>${esc(t.note)}</td><td class="ai-actions">${t.policy === '正常' ? `<button class="link" onclick="infraControlAsk(${i},'limit')">申请限流处置</button><button class="link" onclick="infraControlAsk(${i},'block')">申请断网处置</button>` : `<button class="link" onclick="infraControlAsk(${i},'restore')">解除恢复</button>`}</td></tr>`
        )
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">处置操作提交后进入「审核管理」审批，通过后执行并自动上链存证；恢复流量需处置人确认。</p>`;
  if (infraCtlTab === 'plan')
    b.innerHTML =
      `<section class="panel" ${req('infra.control.plan', 'infrastructure.control.plan.plans')}><div class="ai-list-head"><h3>断网处置预案</h3><button class="btn primary" ${req('infra.control.plan', 'infrastructure.control.plan.new')} onclick="infraPlanForm()">＋ 新增预案</button></div>
      <div class="ai-table"><table><thead><tr><th>序号</th><th>风险等级</th><th>处置动作</th><th>限速 / 阻断档位</th><th>持续时长</th><th>通知对象</th><th>审批人</th><th>启用</th><th>操作</th></tr></thead><tbody>${infraPlans
        .map((p, i) => `<tr><td>${i + 1}</td><td>${infraBadge(p.level)}</td><td>${p.action}</td><td>${p.rate}</td><td>${p.duration}</td><td>${p.notify}</td><td>${p.approver}</td><td><span class="ai-badge ${p.on ? 'green' : ''}">${p.on ? '启用' : '停用'}</span></td><td class="ai-actions"><button class="link" onclick="infraPlanForm(${i})">编辑</button><button class="link" onclick="infraPlanToggle(${i})">${p.on ? '停用' : '启用'}</button><button class="link" onclick="infraPlanDelete(${i})">删除</button></td></tr>`)
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">预案按风险等级匹配：处置确认弹窗与审批单自动引用启用中的预案策略；同一风险等级建议只保留一条启用预案。</p></section>`;
  if (infraCtlTab === 'evidence')
    b.innerHTML =
      infraListHead('操作存证记录', null, 'infra-evidence-rows') +
      `<div class="ai-table" ${req('infra.control.evidence', 'infrastructure.control.evidence.table')}><table><thead><tr><th>序号</th><th>操作类型</th><th>操作对象</th><th>操作人</th><th>操作时间</th><th>上链存证标识</th><th>操作</th></tr></thead><tbody id="infra-evidence-rows">${infraEvidence
        .map(
          (e, i) =>
            `<tr><td>${i + 1}</td><td><b>${e.op}</b></td><td>${esc(e.target)}</td><td>${e.user}</td><td>${e.time}</td><td>${e.hash}</td><td class="ai-actions"><button class="link" onclick="infraEvidenceVerify(${i})">查询验证</button></td></tr>`
        )
        .join('')}</tbody></table></div>`;
  if (infraCtlTab === 'link') b.innerHTML = infraLinkPage();
}
function infraPlanForm(i) {
  const p = i != null ? infraPlans[i] : { level: '一般', action: '限流', rate: '限速至 50%', duration: '持续观察 30 分钟', notify: infraPlanOptions.notify[0], approver: infraPlanOptions.approver[0], on: 1 };
  const sel = (key, cur) => `<select id="infra-plan-${key}">${infraPlanOptions[key].map((v) => `<option ${v === cur ? 'selected' : ''}>${v}</option>`).join('')}</select>`;
  infraDialog(
    i != null ? '编辑处置预案' : '新增处置预案',
    `<label class="field-line"><span>风险等级 <i style="color:#c0392b;font-style:normal">*</i></span>${sel('level', p.level)}</label>
     <label class="field-line"><span>处置动作 <i style="color:#c0392b;font-style:normal">*</i></span>${sel('action', p.action)}</label>
     <label class="field-line"><span>限速 / 阻断档位 <i style="color:#c0392b;font-style:normal">*</i></span>${sel('rate', p.rate)}</label>
     <label class="field-line"><span>持续时长 <i style="color:#c0392b;font-style:normal">*</i></span>${sel('duration', p.duration)}</label>
     <label class="field-line"><span>通知对象</span>${sel('notify', p.notify)}</label>
     <label class="field-line"><span>审批人 <i style="color:#c0392b;font-style:normal">*</i></span>${sel('approver', p.approver)}</label>
     <p class="muted" style="font-size:12px;margin:6px 0 0">预警触发后按风险等级自动匹配启用中的预案；重大等级建议由区域管理员审批。保存后立即生效。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraPlanSave(${i != null ? i : 'null'})">保存</button>`,
    'infra.control.plan',
    i != null ? 'infrastructure.control.plan.dialog' : 'infrastructure.control.plan.new.dialog'
  );
}
function infraPlanSave(i) {
  const get = (k) => $('#infra-plan-' + k).value;
  const p = { level: get('level'), action: get('action'), rate: get('rate'), duration: get('duration'), notify: get('notify'), approver: get('approver'), on: 1 };
  if (i === null || i === 'null') infraPlans.push(p);
  else Object.assign(infraPlans[i], p);
  $('#overlay').innerHTML = '';
  render();
  toast('预案已保存：' + p.level + ' · ' + p.action + '（' + p.approver + ' 审批）');
}
function infraPlanToggle(i) {
  infraPlans[i].on = infraPlans[i].on ? 0 : 1;
  render();
  toast('预案已' + (infraPlans[i].on ? '启用' : '停用'));
}
function infraPlanDelete(i) {
  infraDialog(
    '删除处置预案',
    `<p>确认删除「${infraBadge(infraPlans[i].level)} ${infraPlans[i].action} · ${infraPlans[i].approver} 审批」预案？删除后该等级处置将无法自动匹配预案。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraPlans.splice(${i},1);$('#overlay').innerHTML='';render();toast('预案已删除')">确认删除</button>`,
    'infra.control.plan',
    'infrastructure.control.plan.delete'
  );
}
let infraLedgerFilter = { key: '', state: '', level: '' };
function infraLinkPage() {
  const cards = [
    { name: '主采集链路（区域中心）', state: '正常', cls: 'green', usage: 62, delay: '12 ms', volume: '3,860 万条', note: '断点自动续传：无积压', band: '1000 Mbps 专线' },
    { name: '备采集链路（多链路冗余）', state: '正常', cls: 'green', usage: 31, delay: '18 ms', volume: '412 万条', note: '数据缺口自动补采：今日补采 3 条', band: '500 Mbps 专线' },
    { name: '移动端表单上报链路', state: '异常自愈', cls: 'orange', usage: 24, delay: '45 ms', volume: '9.6 万条', note: '11-05 08:22 链路异常，08:25 自动修复', band: 'VPN 接入' }
  ];
  const trend = [312, 298, 336, 289, 354, 322, 386];
  const list = infraLedger.filter(
    (l) => (!infraLedgerFilter.key || l.obj.includes(infraLedgerFilter.key) || l.no.includes(infraLedgerFilter.key)) && (!infraLedgerFilter.state || l.state === infraLedgerFilter.state) && (!infraLedgerFilter.level || l.level === infraLedgerFilter.level)
  );
  return (
    `<div class="ai-metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:18px" ${req('infra.control.link', 'infrastructure.control.link.health')}>` +
    cards
      .map(
        (c) =>
          `<article><span>${c.name} <span class="ai-badge ${c.cls}" style="margin-left:6px">${c.state}</span></span><strong style="font-size:20px">${c.usage}%<small style="font-size:12px;color:#8b99ad;font-weight:400"> 带宽利用率</small></strong><small>${c.band} · 平均时延 ${c.delay} · 今日采集 ${c.volume}<br>${c.note}</small></article>`
      )
      .join('') +
    `</div>` +
    `<section class="panel" style="margin-bottom:20px" ${req('infra.control.link', 'infrastructure.control.link.patrol')}><div class="ai-list-head"><h3>链路巡检与采集趋势</h3><button class="btn" onclick="toast('巡检完成：3 条链路全部可达，主备切换开关正常（演示）')">立即巡检</button></div>` +
    infraBarChart(trend.map((v, i) => ({ k: '11-0' + (i + 1), v }))) +
    `<p class="muted" style="font-size:12px;margin:10px 0 0">近 7 日采集量（万条/日）：11-05 为 386 万条；主链路承载约 88%，备链路冗余承载约 11%，移动端上报约 1%。保障机制：采集断点自动续传、数据缺口自动补采、主备链路故障自动切换。</p></section>` +
    `<section class="panel" ${req('infra.control.link', 'infrastructure.control.link.ledger')}><div class="ai-list-head"><h3>管控台账</h3></div>
    <div class="ai-filters" style="margin-bottom:14px" ${req('infra.control.link', 'infrastructure.control.link.ledger.query')} onchange="infraLedgerFilter.key=$('[data-l=key]').value;infraLedgerFilter.state=$('[data-l=state]').value;infraLedgerFilter.level=$('[data-l=level]').value;render()">
      <label>关键字 <input data-l="key" placeholder="台账编号 / 管控对象" value="${esc(infraLedgerFilter.key)}"></label>
      <label>状态 <select data-l="state"><option value="">全部</option><option ${infraLedgerFilter.state === '处置中' ? 'selected' : ''}>处置中</option><option ${infraLedgerFilter.state === '已恢复' ? 'selected' : ''}>已恢复</option></select></label>
      <label>风险等级 <select data-l="level"><option value="">全部</option>${['一般', '较重', '重大'].map((l) => `<option ${l === infraLedgerFilter.level ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <button class="btn" onclick="infraLedgerFilter={key:'',state:'',level:''};render()">重置</button>
    </div>
    <div class="ai-table"><table><thead><tr><th>序号</th><th>台账编号</th><th>管控对象</th><th>管控动作</th><th>风险等级</th><th>开始时间</th><th>状态</th><th>关联存证</th></tr></thead><tbody id="infra-ledger-rows">${list
      .map(
        (l, k) =>
          `<tr><td>${k + 1}</td><td>${l.no}</td><td><b>${esc(l.obj)}</b></td><td>${l.action}</td><td>${infraBadge(l.level)}</td><td>${l.start}</td><td><span class="ai-badge ${l.state === '已恢复' ? 'green' : 'orange'}">${l.state}</span></td><td class="ai-actions"><button class="link" onclick="toast('关联存证：0x21c88d5e…0f6a44b8，链上验证通过（演示）')">查看</button></td></tr>`
      )
      .join('') || '<tr><td colspan="8" class="empty">暂无匹配台账</td></tr>'}</tbody></table></div>
    <p class="muted" style="font-size:12px;margin:14px 0 0">采集源优先级：IoT 传感器自动采集 ＞ 业务系统接口同步 ＞ 移动端表单填报；台账与操作存证关联，支持链上验证。</p></section>`
  );
}
function infraControlAsk(i, kind) {
  const t = infraTargets[i];
  const map = { limit: ['申请限流处置', `对 ${esc(t.name)} 实施数据流量限速`, '限流'], block: ['申请断网处置', `对 ${esc(t.name)} 实施数据流量阻断（一键断网）`, '断网'], restore: ['处置解除', `解除 ${esc(t.name)} 的${t.policy}策略并恢复流量`, '解除'] };
  const [title, desc] = map[kind];
  const plan = infraPlans.find((p) => p.on && (kind === 'restore' ? p.level === '一般' : infraLevelByPlan[t.policy] === p.level)) || infraPlans.find((p) => p.on);
  infraDialog(
    title + ' · 确认',
    `<dl><dt>操作对象</dt><dd>${esc(t.name)}（${t.type}）</dd><dt>操作内容</dt><dd>${desc}</dd><dt>当前策略</dt><dd>${t.policy} · ${t.band}</dd><dt>匹配预案</dt><dd>${plan ? `${infraBadge(plan.level)} ${plan.action} · ${plan.rate} · ${plan.duration}` : '—'}</dd><dt>审批流程</dt><dd>提交后进入「审核管理」待我审批，由${plan ? plan.approver : '值班主管'}审批，通过后执行并自动上链存证</dd></dl>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="infraControlSubmit(${i},'${kind}')">提交审批</button>`,
    'infra.control.limit',
    'infrastructure.control.limit.dialog'
  );
}
const infraLevelByPlan = { 限流: '较重', 断网: '重大' };
function infraControlSubmit(i, kind) {
  const t = infraTargets[i];
  const plan = infraPlans.find((p) => p.on && (kind === 'restore' ? p.level === '一般' : (infraLevelByPlan[kind === 'block' ? '断网' : '限流'] || '较重') === p.level)) || infraPlans.find((p) => p.on);
  const name = kind === 'limit' ? '限流' : kind === 'block' ? '断网' : '解除';
  const no = 'SP-20261105-0' + (infraApprovals.length + 1);
  infraApprovals.unshift({
    id: no,
    applier: '当前处置人',
    action: `${name === '解除' ? `解除 ${t.name} 的${t.policy}策略` : `对${t.name}实施${name}`}`,
    level: plan ? plan.level : '一般',
    detail: { obj: t.name, type: t.type, kind: name, plan: plan ? `${plan.rate}，${plan.duration}` : '按默认策略执行', level: plan ? plan.level : '一般', reason: '处置人在采集与处置管控页发起' },
    time: '11-05 16:30',
    state: '待审批'
  });
  $('#overlay').innerHTML = '';
  toast(`已提交审批（${no}），可在「审核管理 · 待我审批」中处理`);
}
function infraEvidenceVerify(i) {
  const e = infraEvidence[i];
  infraDialog(
    '存证记录验证',
    `<dl><dt>操作类型</dt><dd>${e.op}</dd><dt>操作对象</dt><dd>${esc(e.target)}</dd><dt>操作人 / 时间</dt><dd>${e.user} · ${e.time}</dd><dt>上链存证标识</dt><dd>${e.hash}</dd><dt>验证结果</dt><dd><span class="ai-badge green">链上验证通过 · 存证完整</span></dd></dl>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button>`,
    'infra.control.evidence',
    'infrastructure.control.evidence.dialog'
  );
}

const infraBaselines = [
  { obj: '渝中政务数据业务节点', metric: '健康度评分', base: 95, cur: 96, dev: '+1.1%', state: '正常' },
  { obj: '江北金融数据业务节点', metric: 'CPU 使用率', base: 70, cur: 78, dev: '+11.4%', state: '波动预警' },
  { obj: '数据接入连接器-C3', metric: '报文传输成功率', base: 96, cur: 92.4, dev: '-3.8%', state: '波动预警' },
  { obj: '数据接入连接器-A1', metric: '响应时延（ms）', base: 90, cur: 78, dev: '-13.3%', state: '正常' }
];
const infraVolatility = [
  { time: '11-05 15:47', obj: '数据接入连接器-C3', metric: '报文传输成功率', dev: '-3.8%', level: '较重', state: '已转预警' },
  { time: '11-05 14:20', obj: '江北金融数据业务节点', metric: 'CPU 使用率', dev: '+11.4%', level: '一般', state: '观察中' },
  { time: '11-03 09:12', obj: '南岸医疗数据业务节点', metric: '在线率', dev: '-26.0%', level: '重大', state: '已闭环' }
];
const infraEffLedger = [
  { no: 'XN-20261105-02', cycle: '2026-W45', scope: '8 个监测对象', conclusion: '连接器 C3 传输效率低于基线，建议扩容链路带宽', time: '11-05 09:00' },
  { no: 'XN-20261105-01', cycle: '2026-W45', scope: '8 个监测对象', conclusion: '整体运行平稳，CPU 均值环比持平', time: '11-05 09:00' },
  { no: 'XN-20261028-01', cycle: '2026-W44', scope: '7 个监测对象', conclusion: '南岸医疗节点离线 1 次，已纳入运维周期优化', time: '10-28 09:00' }
];

// —— 运行效能分析 ——
function infraEfficiencyPage() {
  const tabs = { reports: '运行质量报告', ranking: '指标排名与对比', shorts: '短板与优化', mgmt: '效能管理' };
  $('#infra-content').innerHTML =
    `<section class="panel" style="padding:0!important;margin-bottom:20px;overflow:hidden"><div class="ais-tabs" style="padding:0 24px;margin:0">${Object.entries(tabs)
      .map(([k, n]) => `<button class="${infraEffTab === k ? 'active' : ''}" onclick="infraEffTab='${k}';render()">${n}</button>`)
      .join('')}</div><div style="padding:24px" id="infra-eff-body"></div></section>`;
  const b = $('#infra-eff-body');
  if (infraEffTab === 'reports') {
    const list = infraReports.filter((r) => !infraEffCycle || r.cycle.includes(infraEffCycle));
    b.innerHTML =
      `<div class="ai-metrics" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px" ${req('infra.eff.reports', 'infrastructure.eff.reports.metrics')}><article><span>平均无故障时长（本月）</span><strong>412h</strong><small>全量业务节点统计</small></article><article><span>故障频次（本月）</span><strong>3 次</strong><small>环比 -1 次</small></article><article><span>报告订阅</span><strong>12 人</strong><small>周报 + 月报双周期</small></article><article><span>最近生成</span><strong style="font-size:22px">11-05 09:00</strong><small>2026-W45 周报</small></article></div>` +
      `<section class="panel" style="margin-bottom:20px" ${req('infra.eff.reports', 'infrastructure.eff.reports.subscribe')}><div class="ai-list-head"><h3>报告订阅配置</h3><button class="btn" onclick="infraSubscribeConfig()">配置订阅</button></div><div class="infra-subscribe"><div><span>报告周期</span><b>周报（每周一 09:00）+ 月报（每月 1 日 09:00）</b></div><div><span>推送渠道</span><b>邮件、工作群</b></div><div><span>接收人</span><b>12 人（运维组 8 人 · 区域管理员 2 人 · 业务负责人 2 人）</b></div><div><span>报告内容</span><b>无故障时长、故障频次、传输效率排名、短板与优化建议</b></div></div></section>` +
      `<section class="panel" ${req('infra.eff.reports', 'infrastructure.eff.reports.list')}><div class="ai-list-head"><h3>运行质量报告</h3><div class="infra-head-tools">${infraSearchBox('infra-report-rows')}<button class="btn primary" ${req('infra.eff.reports', 'infrastructure.eff.reports.generate')} onclick="toast('已触发本期报告生成，完成后按订阅推送')">＋ 生成报告</button></div></div>
      <div class="ai-filters" style="margin-bottom:14px" ${req('infra.eff.reports', 'infrastructure.eff.reports.query')} onchange="infraEffCycle=$('[data-e=cycle]').value;render()">
        <label>报告周期 <select data-e="cycle"><option value="">全部</option><option ${infraEffCycle === '周报' ? 'selected' : ''}>周报</option><option ${infraEffCycle === '月报' ? 'selected' : ''}>月报</option></select></label>
        <button class="btn" onclick="infraEffCycle='';render()">重置</button>
      </div>
      <div class="ai-table"><table><thead><tr><th>序号</th><th>报告周期</th><th>生成时间</th><th>关键指标摘要</th><th>订阅推送</th><th>操作</th></tr></thead><tbody id="infra-report-rows">${list
        .map((r) => {
          const i = infraReports.indexOf(r);
          return `<tr><td>${i + 1}</td><td><b>${esc(r.cycle)}</b></td><td>${r.generated}</td><td>${esc(r.summary)}</td><td>${esc(r.push)}</td><td class="ai-actions"><button class="link" onclick="infraReportDetail(${i})">在线查阅</button><button class="link" onclick="toast('报告已下载（演示）')">下载</button></td></tr>`;
        })
        .join('') || '<tr><td colspan="6" class="empty">暂无匹配报告</td></tr>'}</tbody></table></div></section>`;
  }
  if (infraEffTab === 'ranking') {
    const pool = infraNodes.filter((n) => infraEffRankType === '全部' || n.type === infraEffRankType);
    const metricOf = (n) =>
      infraEffRankMetric === '传输成功率' ? { v: n.health + '%', raw: n.health } : infraEffRankMetric === '响应时延' ? { v: n.online ? 40 + n.cpu + ' ms' : '—', raw: n.online ? 200 - n.cpu : 0 } : { v: n.health, raw: n.health };
    const ranked = pool.map((n) => ({ n, m: metricOf(n) })).sort((a, b2) => b2.m.raw - a.m.raw);
    const typeOpts = ['接入连接器', '业务节点', '全部'];
    b.innerHTML =
      `<section class="panel" style="margin-bottom:20px" ${req('infra.eff.ranking', 'infrastructure.eff.ranking.query')}><div class="ai-filters" onchange="infraEffRankMetric=$('[data-e=metric]').value;infraEffRankType=$('[data-e=type]').value;render()">
        <label>排名指标 <select data-e="metric">${['传输成功率', '响应时延', '健康度评分'].map((m) => `<option ${m === infraEffRankMetric ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
        <label>对象类型 <select data-e="type">${typeOpts.map((t) => `<option ${t === infraEffRankType ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <button class="btn" onclick="toast('排名已导出（演示）')">导出排名</button>
      </div></section>` +
      `<div class="infra-hero" ${req('infra.eff.ranking', 'infrastructure.eff.ranking.board')}><section class="panel">${infraListHead(infraEffRankMetric + '排名（本月）', null, 'infra-rank-rows')}<div class="ai-table"><table><thead><tr><th>序号</th><th>对象名称</th><th>类型</th><th>${infraEffRankMetric}</th><th>健康度</th></tr></thead><tbody id="infra-rank-rows">${ranked
        .map((x, i) => `<tr><td>${i + 1}</td><td><b>${esc(x.n.name)}</b></td><td>${x.n.type}</td><td>${infraEffRankMetric === '传输成功率' ? infraMeter('成功率', x.n.health) : x.m.v}</td><td>${x.n.health}</td></tr>`)
        .join('')}</tbody></table></div></section><section class="panel"><h3>跨节点效能对比（健康度评分）</h3>${infraBarChart(ranked.slice(0, 5).map((x) => ({ k: x.n.name.replace('数据业务节点', '').replace('数据接入连接器', '-'), v: x.n.health })), '')}</section></div>`;
  }
  if (infraEffTab === 'shorts') {
    const list = infraShorts.filter((s) => !infraEffShortState || s.state === infraEffShortState);
    b.innerHTML =
      `<section class="panel" ${req('infra.eff.shorts', 'infrastructure.eff.shorts.list')}><div class="ai-list-head"><h3>运行短板定位与优化追踪</h3></div>
      <div class="ai-filters" style="margin-bottom:14px" ${req('infra.eff.shorts', 'infrastructure.eff.shorts.query')} onchange="infraEffShortState=$('[data-e=state]').value;render()">
        <label>采纳状态 <select data-e="state"><option value="">全部</option><option ${infraEffShortState === '待采纳' ? 'selected' : ''}>待采纳</option><option ${infraEffShortState === '已采纳' ? 'selected' : ''}>已采纳</option></select></label>
        <button class="btn" onclick="infraEffShortState='';render()">重置</button>
      </div>
      <div class="ai-table"><table><thead><tr><th>序号</th><th>对象</th><th>短板描述</th><th>归因分析</th><th>优化建议</th><th>采纳状态</th><th>操作</th></tr></thead><tbody id="infra-short-rows">${list
        .map((s) => {
          const i = infraShorts.indexOf(s);
          return `<tr><td>${i + 1}</td><td><b>${esc(s.obj)}</b></td><td>${esc(s.issue)}</td><td>${esc(s.reason)}</td><td>${esc(s.advice)}</td><td><span class="ai-badge ${s.state === '已采纳' ? 'green' : 'orange'}">${s.state}</span></td><td class="ai-actions">${s.state === '待采纳' ? `<button class="link" onclick="infraShorts[${i}].state='已采纳';render();toast('建议已标记采纳，进入优化措施跟踪')">采纳</button>` : `<button class="link" onclick="toast('优化效果回评：短板指标已回归基线（演示）')">效果回评</button>`}</td></tr>`;
        })
        .join('') || '<tr><td colspan="7" class="empty">暂无匹配短板</td></tr>'}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">短板流程：归因分析 → 扩容 / 优化建议 → 采纳 → 效果回评；效能指标基线动态维护，波动异常进入波动监测预警。</p></section>`;
  }
  if (infraEffTab === 'mgmt')
    b.innerHTML =
      `<div class="ai-metrics" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px" ${req('infra.eff.mgmt', 'infrastructure.eff.mgmt.metrics')}><article><span>基线覆盖率</span><strong>100%</strong><small>${infraObjectIdx.length} 个监测对象均已设基线</small></article><article><span>波动预警（本周）</span><strong style="color:#d89a36">2</strong><small>较重 1 · 一般 1</small></article><article><span>效能分析台账</span><strong>3 条</strong><small>按周期自动归档</small></article><article><span>基线更新方式</span><strong style="font-size:20px">自动 + 人工</strong><small>近 30 天滑动均值 ± 2σ</small></article></div>` +
      `<section class="panel" style="margin-bottom:20px" ${req('infra.eff.mgmt', 'infrastructure.eff.mgmt.baseline')}>${infraListHead('效能指标基线管理', null, 'infra-base-rows')}<div class="ai-table"><table><thead><tr><th>序号</th><th>对象</th><th>指标</th><th>基线值</th><th>当前值</th><th>偏离</th><th>波动状态</th><th>操作</th></tr></thead><tbody id="infra-base-rows">${infraBaselines
        .map(
          (x, i) =>
            `<tr><td>${i + 1}</td><td><b>${esc(x.obj)}</b></td><td>${x.metric}</td><td>${x.base}</td><td>${x.cur}</td><td>${x.dev}</td><td><span class="ai-badge ${x.state === '正常' ? 'green' : 'orange'}">${x.state}</span></td><td class="ai-actions"><button class="link" onclick="infraBaselineEdit(${i})">调整基线</button></td></tr>`
        )
        .join('')}</tbody></table></div></section>` +
      `<section class="panel" style="margin-bottom:20px" ${req('infra.eff.mgmt', 'infrastructure.eff.mgmt.volatility')}>${infraListHead('效能波动监测预警', null, 'infra-vol-rows')}<div class="ai-table"><table><thead><tr><th>序号</th><th>时间</th><th>对象</th><th>指标</th><th>偏离幅度</th><th>级别</th><th>状态</th><th>操作</th></tr></thead><tbody id="infra-vol-rows">${infraVolatility
        .map(
          (v, i) =>
            `<tr><td>${i + 1}</td><td>${v.time}</td><td><b>${esc(v.obj)}</b></td><td>${v.metric}</td><td>${v.dev}</td><td>${infraBadge(v.level)}</td><td><span class="ai-badge ${v.state === '已闭环' ? 'green' : v.state === '已转预警' ? '' : 'orange'}">${v.state}</span></td><td class="ai-actions">${v.state === '观察中' ? `<button class="link" onclick="infraVolatility[${i}].state='已转预警';render();toast('已转为预警，进入预警管理分级处置流程')">转预警</button>` : '—'}</td></tr>`
        )
        .join('')}</tbody></table></div></section>` +
      `<section class="panel" ${req('infra.eff.mgmt', 'infrastructure.eff.mgmt.ledger')}>${infraListHead('效能分析台账', null, 'infra-ledger2-rows')}<div class="ai-table"><table><thead><tr><th>序号</th><th>台账编号</th><th>分析周期</th><th>覆盖范围</th><th>结论摘要</th><th>归档时间</th></tr></thead><tbody id="infra-ledger2-rows">${infraEffLedger
        .map(
          (l, i) =>
            `<tr><td>${i + 1}</td><td>${l.no}</td><td>${l.cycle}</td><td>${l.scope}</td><td>${esc(l.conclusion)}</td><td>${l.time}</td></tr>`
        )
        .join('')}</tbody></table></div><p class="muted" style="font-size:12px;margin:14px 0 0">效能波动异常可一键转为预警，进入预警管理的分级处置流程；台账按周期自动归档，供历史效能趋势查询。</p></section>`;
}
function infraReportDetail(i) {
  const r = infraReports[i];
  infraDialog(
    r.cycle,
    `<div class="ai-metrics" style="grid-template-columns:repeat(3,1fr);margin:0 0 18px"><article><span>平均无故障时长</span><strong style="font-size:22px">412h</strong><small>全量业务节点</small></article><article><span>故障频次</span><strong style="font-size:22px">3 次</strong><small>环比 -1 次</small></article><article><span>连接器平均成功率</span><strong style="font-size:22px">94.8%</strong><small>环比 +1.2%</small></article></div>
     <h3>关键指标</h3><div class="ai-table" style="margin:0"><table><thead><tr><th>指标</th><th>本期</th><th>上期</th><th>趋势</th></tr></thead><tbody><tr><td>平均无故障时长</td><td>412h</td><td>396h</td><td><span class="ai-badge green">+4.0%</span></td></tr><tr><td>故障频次</td><td>3 次</td><td>4 次</td><td><span class="ai-badge green">-1 次</span></td></tr><tr><td>连接器传输效率（均值）</td><td>94.8%</td><td>93.6%</td><td><span class="ai-badge green">+1.2%</span></td></tr><tr><td>预警总量</td><td>17 件</td><td>21 件</td><td><span class="ai-badge green">-4 件</span></td></tr></tbody></table></div>
     <h3>性能短板与建议</h3><p class="muted" style="font-size:13px;line-height:1.9;margin:0">① 数据接入连接器-C3 传输成功率低于基线（92.4%），建议扩容链路带宽至 200 Mbps；② 南岸医疗数据业务节点本月离线 1 次，建议更换硬盘与风扇备件并纳入运维周期；③ CPU 高负载集中在江北金融节点（均值 78%），建议评估资源扩容。</p>
     <h3>订阅推送记录</h3><p class="muted" style="font-size:13px;margin:0">${r.push} · 生成时间 ${r.generated}</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">关闭</button>`,
    'infra.eff.reports',
    'infrastructure.eff.reports.dialog'
  );
}
function infraSubscribeConfig() {
  infraDialog(
    '报告订阅配置',
    `<label class="field-line">报告周期<select><option>周报（每周一 09:00）</option><option>月报（每月 1 日 09:00）</option><option>周报 + 月报</option></select></label>
     <label class="field-line">推送渠道<select><option>邮件、工作群</option><option>仅邮件</option><option>仅工作群</option></select></label>
     <label class="field-line">接收人<input value="运维组 8 人、区域管理员 2 人、业务负责人 2 人"></label>
     <p class="muted" style="font-size:12px;margin:0">报告生成后按配置自动推送，支持在线查阅与历史报告回溯。</p>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="$('#overlay').innerHTML='';toast('订阅配置已保存')">保存</button>`,
    'infra.eff.reports',
    'infrastructure.eff.reports.subscribe.dialog'
  );
}
function infraBaselineEdit(i) {
  const x = infraBaselines[i];
  infraDialog(
    '调整效能基线',
    `<dl><dt>对象</dt><dd>${esc(x.obj)}</dd><dt>指标</dt><dd>${x.metric}</dd><dt>当前基线</dt><dd>${x.base}（近 30 天滑动均值 ± 2σ 自动计算）</dd><dt>当前值</dt><dd>${x.cur}（偏离 ${x.dev}）</dd></dl>
     <label class="field-line" style="margin-top:16px">调整后基线<input id="infra-base-val" value="${x.base}"></label>
     <label class="field-line">调整说明<textarea placeholder="填写调整原因，调整记录将留痕"></textarea></label>`,
    `<button class="btn" onclick="$('#overlay').innerHTML=''">取消</button><button class="btn primary" onclick="$('#overlay').innerHTML='';toast('基线已调整，变更记录已留痕')">保存</button>`,
    'infra.eff.mgmt',
    'infrastructure.eff.mgmt.baseline.dialog'
  );
}

// —— 接入：render 包装（在 identity-review 之后加载，最后一级包装） ——
const infraPreviousRender = render;
render = function () {
  if (section === 'infrastructure') {
    infraRender();
    return;
  }
  infraPreviousRender();
};
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get('system') === 'infrastructure') {
    infraOpen(q.get('view') || 'overview');
    if (q.get('audit') === '1') {
      const idx = infraApprovals.findIndex((x) => x.state === '待审批');
      if (idx >= 0) infraAuditOpen(idx);
    }
  }
})();
