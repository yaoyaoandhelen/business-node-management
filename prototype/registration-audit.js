// 数据登记管理系统 · 审核管理（待我审批 / 我已审批）与审核弹窗
const RA_KINDS = ['resource', 'product', 'listing'];
const RA_RESULTS = ['待审批', '已通过', '已驳回'];
const RA_INDUSTRIES = ['农、林、牧、渔业', '采矿业', '住宿和餐饮业', '信息传输、软件和信息技术服务业', '卫生和社会工作', '文化、体育和娱乐业'];
const RA_META = {
  resource: {
    name: '数据资源审批', short: '数据资源', tabPending: '待审批的数据资源', tabCompleted: '已审批的数据资源',
    title: '数据资源登记审核', typeLabel: '数据资源登记',
    labels: { name: '数据资源名称', code: '资源编码', source: '数据资源' },
    types: ['数据资源登记', '数据资源更新', '数据资源注销'],
    sources: ['测试SFTP数据', '测试mysql数据', '测试数据2', '测试数据'],
    columns: [['name', '资源名称'], ['industry', '行业分类'], ['holderId', '资源持有方身份标识'], ['holder', '资源持有方'], ['contact', '联系人'], ['phone', '联系方式'], ['format', '资源格式'], ['submitted', '提交时间'], ['type', '审核类型'], ['result', '处理结果']]
  },
  product: {
    name: '数据产品审批', short: '数据产品', tabPending: '待审批的数据产品', tabCompleted: '已审批的数据产品',
    title: '数据产品登记审核', typeLabel: '数据产品登记',
    labels: { name: '数据产品名称', code: '产品编码', source: '数据产品' },
    types: ['数据产品登记', '数据产品更新', '数据产品注销'],
    sources: ['景区客流分析API', '医保结算分析产品', '交通物流数据报告'],
    columns: [['name', '产品名称'], ['industry', '行业分类'], ['providerId', '提供方标识'], ['provider', '提供方'], ['productType', '产品类型'], ['delivery', '交付方式'], ['submitted', '提交时间'], ['type', '审核类型'], ['result', '处理结果']]
  },
  listing: {
    name: '产品上架审批', short: '产品上架', tabPending: '待审批的产品上架', tabCompleted: '已审批的产品上架',
    title: '数据产品上架审核', typeLabel: '产品上架',
    labels: { name: '上架产品名称', code: '业务节点标识', source: '数据产品' },
    types: ['产品上架', '产品变更', '产品下架'],
    sources: ['景区客流分析API', '医保结算分析产品', '交通物流数据报告'],
    columns: [['name', '产品名称'], ['industry', '行业分类'], ['nodeId', '业务节点标识'], ['nodeName', '上架业务节点'], ['metering', '计量方式'], ['price', '价格'], ['submitted', '提交时间'], ['type', '审核类型'], ['result', '处理结果']]
  }
};
const RA_NAMES = {
  resource: ['测试SFTP数据', '测试mysql数据', '测试数据2', '测试数据', 's1111-1b', 's1111-1', '产品测试1110-07', '测试SFTP数据副本'],
  product: ['sap产品1113非一事一议', '景区客流分析API', '医保结算分析产品', '交通物流数据报告', '城市公共数据报告', '企业征信数据产品', '药店零售分析产品', '产业链协同分析产品'],
  listing: ['重庆可信数据空间·景区客流分析', '医保行业可信数据空间产品', '交通物流数据服务产品', '城市公共数据服务平台', '产业协同分析报告', '药店零售分析产品', '企业征信数据产品', '景区客流分析API']
};

function raMake(kind, queue, i) {
  const meta = RA_META[kind], name = RA_NAMES[kind][i % RA_NAMES[kind].length];
  const day = String(15 - (i % 6)).padStart(2, '0');
  const hour = String(9 + (i % 9)).padStart(2, '0');
  const minute = String(10 + (i * 7) % 50).padStart(2, '0');
  const submitted = `2026-11-${day} ${hour}:${minute}:44`;
  const result = queue === 'pending' ? '待审批' : (i % 5 === 3 ? '已驳回' : '已通过');
  const reviewedAt = result === '待审批' ? '—' : `2026-11-${day} ${String(10 + (i % 9)).padStart(2, '0')}:${String(21 + (i * 3) % 38).padStart(2, '0')}:28`;
  const prefix = { resource: 'ZY', product: 'CP', listing: 'SJ' }[kind];
  const seq = String(i + 1 + (queue === 'completed' ? 20 : 0)).padStart(3, '0');
  const holderId = i % 3 === 0 ? '915000008365501517' : '915001093316437724';
  const nodeId = `491500109MA5UEJA80K5000FGUJF${String(i + 1).padStart(3, '0')}`;
  const record = {
    id: `${prefix}-202611${day}-${seq}`, kind, queue, name,
    code: kind === 'listing' ? nodeId : `${kind === 'resource' ? 'SJZY' : 'SJCP'}-202611${day}-${seq}`,
    subject: holderId, industry: RA_INDUSTRIES[i % RA_INDUSTRIES.length],
    type: meta.types[i % meta.types.length], source: meta.sources[i % meta.sources.length],
    holderId, holder: i % 3 === 0 ? '重庆移动测试4' : '渝时公司',
    contact: i % 3 === 0 ? '王五' : '渝时', phone: i % 3 === 0 ? '17830896022' : '18713599059',
    format: ['SFTP', 'MySQL', '其他-111', 'API'][i % 4],
    providerId: holderId, provider: i % 3 === 0 ? '某某数据科技有限公司' : '渝时公司',
    productType: 'API产品', delivery: 'API传输',
    nodeId,
    nodeName: '重庆可信数据空间测试', metering: '按次数', price: '1.00 元',
    submitted, result, reviewedAt, reviewer: result === '待审批' ? '—' : '徐之仁',
    duration: result === '待审批' ? '—' : '1分钟',
    opinion: result === '已通过' ? '审核通过' : result === '已驳回' ? '材料不完整，请补充有效证明材料后重新提交。' : '',
    submitter: i % 3 === 0 ? '王五' : 'xuxiaolong'
  };
  return record;
}
const raRecords = [];
RA_KINDS.forEach((kind) => {
  ['pending', 'completed'].forEach((queue) => {
    for (let i = 0; i < (queue === 'pending' ? 6 : 8); i++) raRecords.push(raMake(kind, queue, i));
  });
});

const raViews = {};
let raQueue = 'pending', raKind = 'resource', raMenuOpen = true, raAudit = null;
const raPageId = () => `registrationAudit-${raQueue}`;
const raSurface = () => `registrationAudit.${raQueue}.${raKind}`;
const raQueueName = () => (raQueue === 'pending' ? '待我审批' : '我已审批');
const raTitle = () => `数据登记管理系统 · 审核管理 / ${raQueueName()} / ${RA_META[raKind].short}`;
const raReq = (el) => req('registration.audit', 'registrationAudit.' + el);
const raDialogReq = (el) => req('registration.audit.dialog', 'registrationAudit.audit.' + el);
const raView = () => (raViews[`${raQueue}.${raKind}`] ||= { draft: {}, filters: {}, page: 1, size: 10, type: '全部' });
const raTypeTabs = () => ['全部', ...RA_META[raKind].types];
const raDate = () => new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });

function raQueryFields() {
  const m = RA_META[raKind];
  return [
    ['name', m.labels.name], ['code', m.labels.code], ['subject', '主体标识'],
    ['dateFrom', '提交开始日期', null, 'date'], ['dateTo', '提交结束日期', null, 'date'],
    ['industry', '行业分类', RA_INDUSTRIES],
    ['source', m.labels.source, m.sources], ['result', '处理结果', RA_RESULTS]
  ];
}
function raOpen(queue = 'pending', kind = 'resource', initial = false) {
  if (raAudit) raAuditClose();
  raQueue = queue === 'completed' ? 'completed' : 'pending';
  raKind = RA_KINDS.includes(kind) ? kind : 'resource';
  section = 'registrationAudit';
  $('#overlay').innerHTML = '';
  document.querySelector('#audit')?.remove();
  const u = new URL(location.href);
  u.searchParams.set('system', 'registration');
  u.searchParams.set('view', 'registrationAudit');
  u.searchParams.set('queue', raQueue);
  u.searchParams.set('tab', raKind);
  if (!initial) u.searchParams.delete('review');
  const wanted = u.searchParams.get('auditType');
  if (wanted && raTypeTabs().includes(wanted) && wanted !== '全部') raView().type = wanted;
  else { raView().type = '全部'; u.searchParams.delete('auditType'); }
  history.replaceState(null, '', u);
  render();
}
function raBack() {
  section = 'launch';
  history.replaceState(null, '', '?system=management');
  render();
}
function raNav() {
  document.querySelector('header b').textContent = '数据登记管理系统';
  $('#sidebar').innerHTML =
    `<div class="nav" ${raReq('nav.monitor')} onclick="registrationOpen()">◈　数据风险监测</div>` +
    `<button class="identity-menu nav" aria-expanded="${raMenuOpen}" ${raReq('nav.group')} onclick="raMenuOpen=!raMenuOpen;render()"><span>▣</span>审核管理<em>${raMenuOpen ? '⌄' : '›'}</em></button>` +
    (raMenuOpen
      ? `<button class="identity-menu nav identity-sub ${raQueue === 'pending' ? 'active' : ''}" ${raReq('nav.pending')} onclick="raOpen('pending',raKind)">待我审批</button>` +
        `<button class="identity-menu nav identity-sub ${raQueue === 'completed' ? 'active' : ''}" ${raReq('nav.completed')} onclick="raOpen('completed',raKind)">我已审批</button>`
      : '') +
    `<button class="identity-menu nav identity-return" onclick="raBack()"><span>⇤</span>返回快捷入口</button>`;
}
function raKindCounts(kind) {
  return raRecords.filter((r) => r.kind === kind && r.result === '待审批').length;
}
function raSwitchKind(kind) {
  if (!RA_KINDS.includes(kind) || kind === raKind) return;
  raKind = kind;
  raView().page = 1;
  const u = new URL(location.href);
  u.searchParams.set('tab', kind);
  u.searchParams.delete('review');
  u.searchParams.delete('auditType');
  history.replaceState(null, '', u);
  render();
}
function raTypeCounts() {
  const pool = raRecords.filter((r) => r.kind === raKind && (raQueue === 'pending' ? r.result === '待审批' : r.result !== '待审批'));
  const counts = { '全部': pool.length };
  RA_META[raKind].types.forEach((type) => { counts[type] = pool.filter((r) => r.type === type).length; });
  return counts;
}
function raSwitchType(type) {
  const v = raView();
  if (!raTypeTabs().includes(type) || type === v.type) return;
  v.type = type;
  v.draft = {};
  v.filters = {};
  v.page = 1;
  const u = new URL(location.href);
  if (type === '全部') u.searchParams.delete('auditType');
  else u.searchParams.set('auditType', type);
  u.searchParams.delete('review');
  history.replaceState(null, '', u);
  render();
}
function raTypeStrip() {
  const counts = raTypeCounts(), current = raView().type;
  return `<section class="identity-navigation ra-navigation ra-type-panel" ${raReq('types')}>` +
    `<div class="ra-type-strip" role="tablist" aria-label="审核类型">` +
    raTypeTabs().map((type) => {
      const key = type === '全部' ? 'all' : RA_META[raKind].types.indexOf(type);
      return `<button type="button" role="tab" aria-selected="${type === current}" class="ra-type-tab ${type === current ? 'active' : ''}" onclick="raSwitchType('${esc(type)}')" ${raReq('types.item.' + key)}><span>${esc(type)}</span><b>${counts[type]}</b></button>`;
    }).join('') + `</div></section>`;
}
function raTabs() {
  return `<section class="identity-navigation ra-navigation" ${raReq('tabs')}><div class="identity-tabs ra-tabs" role="tablist" aria-label="审批类型">${RA_KINDS.map((k) => {
    const m = RA_META[k], label = raQueue === 'pending' ? m.tabPending : m.tabCompleted;
    return `<button type="button" role="tab" aria-selected="${k === raKind}" class="${k === raKind ? 'active' : ''}" onclick="raSwitchKind('${k}')" ${raReq('tabs.' + k)}>${label}${raQueue === 'pending' ? `<b>${raKindCounts(k)}</b>` : ''}</button>`;
  }).join('')}</div></section>`;
}
function raQuery(reset = false) {
  const v = raView();
  if (reset) {
    v.draft = {}; v.filters = {}; v.type = '全部';
    const u = new URL(location.href);
    u.searchParams.delete('auditType');
    history.replaceState(null, '', u);
  } else {
    const next = Object.fromEntries(Object.entries(v.draft).map(([k, value]) => [k, String(value).trim()]));
    if (next.dateFrom && next.dateTo && next.dateFrom > next.dateTo) { toast('提交开始日期不能晚于结束日期'); return; }
    v.filters = next;
  }
  v.page = 1;
  raRender();
}
function raFiltered() {
  const v = raView(), f = v.filters;
  return raRecords.filter((r) => r.kind === raKind && (v.type === '全部' || r.type === v.type) && (raQueue === 'pending' ? r.result === '待审批' : r.result !== '待审批'))
    .filter((r) =>
      (!f.name || r.name.includes(f.name)) &&
      (!f.code || r.code.includes(f.code)) &&
      (!f.subject || r.subject.includes(f.subject)) &&
      (!f.dateFrom || r.submitted.slice(0, 10) >= f.dateFrom) &&
      (!f.dateTo || r.submitted.slice(0, 10) <= f.dateTo) &&
      (!f.industry || r.industry === f.industry) &&
      (!f.source || r.source === f.source) &&
      (!f.result || r.result === f.result)
    )
    .sort((a, b) => b.submitted.localeCompare(a.submitted));
}
function raTypeBadge(type) {
  const cls = type.includes('注销') || type.includes('下架') ? 'red' : type.includes('更新') || type.includes('变更') ? 'orange' : '';
  return `<span class="identity-badge ${cls}">${esc(type)}</span>`;
}
function raResultBadge(result) {
  const cls = result === '已通过' ? 'green' : result === '已驳回' ? 'red' : 'orange';
  return `<span class="identity-badge ${cls}">${esc(result)}</span>`;
}
function raRender() {
  raNav();
  const v = raView(), meta = RA_META[raKind], fields = raQueryFields(), list = raFiltered();
  const pages = Math.max(1, Math.ceil(list.length / v.size));
  v.page = Math.min(v.page, pages);
  const rows = list.slice((v.page - 1) * v.size, v.page * v.size);
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="raBack()">首页</span><span class="selected">● 审核管理 / ${raQueueName()}</span></div>` +
    `<div class="identity-page registration-audit-page" data-req-page="${raPageId()}" data-req-surface="${raSurface()}" data-req-title="${raTitle()}">` +
    raTabs() +
    raTypeStrip() +
    `<form class="identity-filters" onsubmit="event.preventDefault();raQuery()" ${raReq('query')}>` +
    `<div class="identity-query-fields">${fields.map(([key, label, options, inputType]) =>
      `<label ${raReq('query.field.' + key)}><span>${label}</span>${options
        ? `<select name="${key}" aria-label="${label}" onchange="raView().draft[this.name]=this.value"><option value="">全部</option>${options.map((x) => `<option ${v.draft[key] === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`
        : `<input name="${key}" aria-label="${label}" type="${inputType || 'text'}" placeholder="请输入" value="${esc(v.draft[key] || '')}" oninput="raView().draft[this.name]=this.value">`}</label>`
    ).join('')}</div>` +
    `<div class="identity-query-actions" ${raReq('query.actions')}><button class="btn" type="button" onclick="raQuery(true)">重置</button><button class="btn primary" type="submit">查询</button></div>` +
    `</form>` +
    `<section class="identity-results" ${raReq('list')} aria-label="${raQueueName()} · ${meta.name}列表">` +
    `<div class="identity-table-tools" ${raReq('list.heading')}><h2>${meta.name}</h2><button type="button" aria-label="刷新列表" title="刷新列表" onclick="raRender()">↻</button></div>` +
    `<div class="identity-table-scroll"><table style="width:100%" ${raReq('list.table')}><thead><tr><th>序号</th>${meta.columns.map(([, n]) => `<th>${n}</th>`).join('')}<th>操作</th></tr></thead><tbody>${rows.map((r, i) =>
      `<tr><td>${(v.page - 1) * v.size + i + 1}</td>${meta.columns.map(([key]) =>
        `<td title="${esc(r[key] || '—')}">${key === 'type' ? raTypeBadge(r.type) : key === 'result' ? raResultBadge(r.result) : esc(r[key] || '—')}</td>`
      ).join('')}<td><button type="button" class="link" ${raReq('list.handle')} onclick="raAuditOpen('${r.id}')">${r.result === '待审批' ? '审批' : '详情'}</button></td></tr>`
    ).join('') || `<tr><td colspan="${meta.columns.length + 2}" class="empty">暂无匹配记录</td></tr>`}</tbody></table></div>` +
    `<div class="identity-pagination" ${raReq('pagination')}><span>共 ${list.length} 条</span><select aria-label="每页条数" onchange="raView().size=Number(this.value);raView().page=1;raRender()">${[10, 20, 50].map((n) => `<option value="${n}" ${n === v.size ? 'selected' : ''}>${n}条/页</option>`).join('')}</select><button ${v.page === 1 ? 'disabled' : ''} aria-label="上一页" onclick="raView().page--;raRender()">‹</button><b>${v.page}</b><button ${v.page === pages ? 'disabled' : ''} aria-label="下一页" onclick="raView().page++;raRender()">›</button><label>前往 <input type="number" aria-label="跳转页码" min="1" max="${pages}" value="${v.page}" onchange="raView().page=Math.max(1,Math.min(${pages},Math.floor(Number(this.value)||1)));raRender()"> 页</label></div>` +
    `</section></div>`;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}

function raDetail(r) {
  const meta = RA_META[r.kind];
  const common = {
    meta: [['审核类型', r.type], ['审核状态', r.result], ['提交时间', r.submitted], ['处理时间', r.reviewedAt], ['处理人', r.reviewer]],
    files: [
      ['委托协议', '委托书.docx'], ['数据样本', '数据样例.csv'], ['合规法律声明', '合法合规声明.docx'],
      ['数据源声明', '数据来源声明.docx'], ['安全等级', '安全分级分类.docx'], ['评测报告', '数据质量、产品价值评估报告.docx']
    ]
  };
  if (r.kind === 'resource') return {
    ...common,
    basic: [
      ['资源名称', r.name], ['资源标识', '—'], ['登记身份标识', r.holderId], ['资源格式', r.format],
      ['行业分类', r.industry], ['数据密级', '公开'], ['目录划分', '完全公开'], ['数据来源', '原始取得'],
      ['数据类型', '—'], ['数据管理方', '—'], ['数据所属机构', '—'], ['数据资源覆盖范围信息', '—'],
      ['数据资源质量状况', '—'], ['涉及个人信息', '否'], ['资源持有方', r.holder], ['身份标识', r.holderId],
      ['联系人', r.contact], ['联系方式', r.phone], ['资源摘要', r.name]
    ],
    items: [{ name: 'x8', type: 'float' }, { name: 'x9', type: 'float' }, { name: 'x19', type: 'float' }],
    materials: [['数据样本和材料', '数据样例.csv'], ['数据说明文档和材料', '数据资源说明文档.docx']],
    other: '该资源用于区域数据目录登记演示，样本与说明文档随登记单一并提交。'
  };
  const productBasic = [
    ['产品名称', r.name], ['数据产品标识', '—'], ['登记身份标识', '91500109MA5UEJA80K'], ['产品类型', r.productType],
    ['行业分类', r.industry], ['产品地域', '南岸区'], ['数据密级', '公开'], ['目录划分', '完全公开'],
    ['数据产品分类', '—'], ['适用场景', '—'], ['数据主体', '个人信息'], ['数据规模', '10 MB'],
    ['数据加工处理方式', '—'], ['更新频率', '5 次/天'], ['覆盖时间范围', '2026-01-01 至 2026-12-31'], ['交付方式', r.delivery],
    ['提供方标识', r.providerId], ['登记时间', r.submitted], ['经办人', 'xuxiaolong'],
    ['产品简介', '基于千万级脱敏诊疗数据，提供区域发病率监测、药品临床疗效分析及医疗资源配置评估，支持公共卫生决策与药企研发，数据不出域、可用不可见。'],
    ['数据资源标识', '—']
  ];
  const commonSections = {
    ...common,
    basic: productBasic,
    authorization: [['授权使用', '否'], ['涉及个人信息', '是'], ['使用限制', '仅限授权用户使用，严禁转售、泄露或用于身份识别，违者承担法律责任']],
    provider: [['提供方主体类型', '法人'], ['提供方简介', '某某数据科技成立于2018年，是国内领先的产业大数据服务商，专注于供应链金融风控、企业征信、政务数据应用等领域']],
    subjectDetail: [['企业住所', '—'], ['经营范围', '—'], ['法定代表人', '—'], ['注册日期', '—'], ['注册资金', '—']],
    legalAgent: [['经办人姓名', '王某某10'], ['经办人身份证', '420624200005120019'], ['经办人电话', '18971329411']],
    materials: [
      ['合法合规声明', '合法合规声明.docx'], ['数据来源声明', '数据来源声明.docx'], ['授权委托书', '委托书.docx'],
      ['数据探查', '数据样例.csv'], ['数据质量、产品价值评估报告', '数据质量、产品价值评估报告.docx'], ['安全分级分类', '安全分级分类.docx']
    ],
    other: r.kind === 'listing' ? '{"upperInfo":{"deliveryMode":"","transferMode":"","formOfDelivery":"","openConsultation":true,"settlementCycle":""}}' : '其他产品信息10'
  };
  if (r.kind === 'listing') commonSections.listing = [
    ['上架业务节点', r.nodeName], ['业务节点标识', r.nodeId],
    ['业务节点位置', 'http://118.31.65.94:1085/subPortal/trade/detail/6915001093316437724500004JK03VWZ8?dataSpace=ZQ2607150001'],
    ['计量方式', r.metering], ['计量单位', '元/次'], ['价格', r.price]
  ];
  return commonSections;
}
const RA_WIDE_LABELS = new Set(['资源摘要', '数据资源覆盖范围信息', '产品简介', '适用场景', '使用限制', '提供方简介', '业务节点位置', '其他说明']);
function raFields(pairs) {
  const cells = [], empty = () => ({ empty: true });
  let left = null;
  pairs.forEach(([label, raw]) => {
    const value = String(raw || '—');
    const wide = RA_WIDE_LABELS.has(label) || value.length > 42;
    const cell = { label, value, wide };
    if (wide) {
      if (left) cells.push(left, empty());
      left = null;
      cells.push(cell);
    } else if (left) {
      cells.push(left, cell);
      left = null;
    } else {
      left = cell;
    }
  });
  if (left) cells.push(left, empty());
  return `<dl class="identity-audit-fields ra-fields">${cells.map((c) =>
    c.empty ? `<div class="ra-field ra-field-empty" aria-hidden="true"><dt></dt><dd></dd></div>`
      : `<div class="ra-field${c.wide ? ' wide' : ''}"><dt>${esc(c.label)}</dt><dd>${esc(c.value)}</dd></div>`
  ).join('')}</dl>`;
}
function raFileRows(files, material) {
  const rows = `<div class="ra-files">${files.map(([label, file]) => {
    const ext = String(file).split('.').pop().toUpperCase();
    return `<div class="na-file-row"><span class="identity-audit-file-icon">${ext === 'CSV' ? 'CSV' : 'DOC'}</span><div><strong>${esc(label)}</strong><small>${esc(file)}</small></div><span class="identity-badge green">已上传</span><button type="button" class="link" onclick="raAuditMaterial('${esc(file)}')">预览</button><button type="button" class="link" onclick="toast('下载服务暂不可用，请稍后重试')">下载</button></div>`;
  }).join('')}</div>`;
  const note = material && files.some(([, file]) => file === material)
    ? `<div class="identity-audit-material-note" role="status"><strong>材料查看 · ${esc(material)}</strong><button class="link" onclick="raAudit.material=null;raAuditRender()">收起</button></div>`
    : '';
  return rows + note;
}
function raSection(key, title, body) {
  return `<section class="identity-audit-section ra-section" ${raDialogReq(key)}><div class="identity-audit-section-title"><h2>${title}</h2></div><div class="identity-audit-request">${body}</div></section>`;
}
function raInformation(r, material) {
  const d = raDetail(r), sections = [];
  sections.push(raSection('meta', '审核信息', raFields(d.meta)));
  sections.push(raSection('basic', '基本信息', raFields(d.basic)));
  if (d.items) sections.push(raSection('items', '信息项列表',
    `<table class="ra-items"><thead><tr><th>序号</th><th>名称</th><th>类型</th></tr></thead><tbody>${d.items.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.name)}</td><td>${esc(x.type)}</td></tr>`).join('')}</tbody></table>`));
  if (d.authorization) sections.push(raSection('authorization', '授权与限制', raFields(d.authorization)));
  if (d.provider) sections.push(raSection('provider', '提供方信息', raFields(d.provider)));
  if (d.subjectDetail) sections.push(raSection('subjectDetail', '主体详细信息', raFields(d.subjectDetail)));
  if (d.legalAgent) sections.push(raSection('legalAgent', '法人经办人信息', raFields(d.legalAgent)));
  if (d.listing) sections.push(raSection('listing', '上架信息', raFields(d.listing)));
  if (d.materials) sections.push(raSection('materials', '文件资料', raFileRows(d.materials, material)));
  if (d.other) sections.push(raSection('other', '其他说明', raFields([['其他说明', d.other]])));
  if (d.files) sections.push(raSection('files', '文件信息', raFileRows(d.files, material)));
  return sections.join('');
}
function raFlow(r) {
  const m = RA_META[r.kind], done = r.result === '已通过', rejected = r.result === '已驳回';
  const secondCls = r.result === '待审批' ? 'current' : done ? 'done' : 'rejected';
  const thirdCls = done ? 'done' : rejected ? 'rejected' : 'upcoming';
  const detail = r.result === '待审批' ? '' :
    `<p>处理人：${esc(r.reviewer)}</p><p>接收时间：${esc(r.submitted)}</p><p>处理时间：${esc(r.reviewedAt)}</p><p>耗时：${esc(r.duration)}</p><div class="identity-flow-opinion">处理意见：${esc(r.opinion)}</div>`;
  return `<ol class="identity-flow ra-flow" aria-label="${m.title}流程信息">
    <li class="done"><span class="identity-flow-marker">✓</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>流程开始</strong><time>${esc(r.submitted)}</time></div><p>${esc(r.submitter)} · 提交${esc(r.type)}申请</p></div></li>
    <li class="${secondCls}"><span class="identity-flow-marker">${secondCls === 'current' ? '2' : '✓'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>${m.title}</strong><span class="identity-flow-status ${secondCls}">${r.result === '待审批' ? '待审批' : '已审核'}</span></div>${detail}</div></li>
    <li class="${thirdCls}"><span class="identity-flow-marker">${thirdCls === 'done' ? '✓' : thirdCls === 'rejected' ? '×' : '3'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>${r.result === '待审批' ? '待出具结论' : r.result}</strong>${r.result === '待审批' ? '' : `<time>${esc(r.reviewedAt)}</time>`}</div>${r.result === '待审批' ? '<p>待审批人出具结论</p>' : `<p>审核人：${esc(r.reviewer)}</p>`}</div></li>
  </ol>`;
}
function raDecision(r, d, readOnly) {
  const heading = `<div class="identity-audit-decision-heading"><span>审核工作区</span><h2>${readOnly ? '审核结果' : '请完成登记审核'}</h2></div>`;
  if (readOnly) return `<aside class="identity-audit-decision" ${raDialogReq('decision')}>${heading}<div class="identity-audit-read-result">${raResultBadge(r.result)}<dl><dt>审核人</dt><dd>${esc(r.reviewer || '—')}</dd><dt>审核时间</dt><dd>${esc(r.reviewedAt || '—')}</dd><dt>审核意见</dt><dd>${esc(r.opinion || '—')}</dd></dl></div><div class="identity-audit-bottom-close" ${raDialogReq('actions')}><button class="btn" onclick="raAuditClose()">关闭</button></div></aside>`;
  return `<aside class="identity-audit-decision" ${raDialogReq('decision')}>${heading}<form id="ra-audit-form" onsubmit="event.preventDefault();raAuditSubmit()"><fieldset><legend>审核结果 <em>*</em></legend><label class="identity-audit-choice ${d.result === '已通过' ? 'selected' : ''}"><input type="radio" name="ra-result" value="已通过" ${d.result === '已通过' ? 'checked' : ''} onchange="raAudit.draft.result=this.value;raAudit.draft.error='';raAuditRender()">已通过</label><label class="identity-audit-choice ${d.result === '已驳回' ? 'selected' : ''}"><input type="radio" name="ra-result" value="已驳回" ${d.result === '已驳回' ? 'checked' : ''} onchange="raAudit.draft.result=this.value;raAudit.draft.error='';raAuditRender()">已驳回</label></fieldset><label class="identity-audit-opinion">审核意见 ${d.result === '已驳回' ? '<em>*</em>' : '<span>（选填）</span>'}<textarea aria-label="审核意见" maxlength="300" placeholder="${d.result === '已驳回' ? '请填写驳回原因，便于申请人补充材料' : '请输入审核意见'}" oninput="raAudit.draft.opinion=this.value;raAudit.draft.error='';">${esc(d.opinion)}</textarea></label><p class="identity-audit-error" role="alert">${esc(d.error)}</p><div class="identity-audit-submit" ${raDialogReq('actions')}><button type="submit" class="btn primary">提交审核</button></div></form></aside>`;
}
function raAuditOpen(id) {
  const index = raRecords.findIndex((r) => r.id === id);
  if (index < 0) return;
  raAudit = { index, draft: { result: '已通过', opinion: '', error: '' }, material: null };
  ['header', '#sidebar', '#main'].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.inert = true;
  });
  raAuditRender();
  $('#overlay [role="dialog"]').focus();
}
function raAuditClose() {
  ['header', '#sidebar', '#main'].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.inert = false;
  });
  raAudit = null;
  $('#overlay').innerHTML = '';
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
  document.querySelector('.registration-audit-page .identity-results .link')?.focus();
}
function raAuditSwitch(kind) {
  if (!raAudit || !RA_KINDS.includes(kind)) return;
  const index = raRecords.findIndex((r) => r.kind === kind && (raQueue === 'completed' ? r.result !== '待审批' : r.result === '待审批'));
  if (index < 0) return toast('暂无「' + RA_META[kind].name + '」类型的' + raQueueName() + '记录');
  raAudit = { index, draft: { result: '已通过', opinion: '', error: '' }, material: null };
  raAuditRender();
}
function raAuditMaterial(file) {
  raAudit.material = file;
  raAuditRender();
  document.querySelector('.identity-audit-material-note')?.scrollIntoView({ block: 'center' });
}
function raAuditRender() {
  const a = raAudit;
  if (!a) return;
  const r = raRecords[a.index], m = RA_META[r.kind], readOnly = r.result !== '待审批';
  const infoScroll = document.querySelector('.identity-audit-information')?.scrollTop || 0;
  const sideScroll = document.querySelector('.identity-audit-side')?.scrollTop || 0;
  const d = a.draft, dialogPage = `registrationAudit-${r.kind}-dialog`;
  $('#overlay').innerHTML =
    `<div class="identity-audit-veil"><section class="identity-audit-dialog registration-audit-dialog" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="ra-audit-title" data-req-page="${dialogPage}" data-req-surface="registrationAudit.${r.kind}.dialog" data-req-layer="dialog" data-req-title="${m.title}">` +
    `<div class="identity-audit-header" ${raDialogReq('context')}><div><span class="identity-audit-eyebrow">数据登记管理系统 · 审核管理</span><h1 id="ra-audit-title">${m.title} <span class="identity-audit-state">${readOnly ? r.result : '待我审批'}</span></h1></div><button class="identity-audit-close" aria-label="关闭审核弹窗" ${raDialogReq('close')} onclick="raAuditClose()">×</button></div>` +
    `<div class="identity-audit-scenarios ra-dialog-types" ${raDialogReq('typeSwitch')}><span class="ra-type-strip-label">审核类型</span><div class="ra-type-strip" role="tablist" aria-label="切换审批类型">${RA_KINDS.map((k) => `<button type="button" role="tab" aria-selected="${r.kind === k}" class="ra-type-tab ${r.kind === k ? 'active' : ''}" onclick="raAuditSwitch('${k}')">${RA_META[k].short}</button>`).join('')}</div></div>` +
    `<p class="identity-audit-demo-hint" ${raDialogReq('typeNote')}>此处多个审核类型弹窗仅作原型展示，真实审核流每次只有一个审核类型。</p>` +
    `<div class="identity-audit-layout"><div class="identity-audit-information">` +
    `<section class="identity-audit-focus" ${raDialogReq('subject')}><span class="identity-audit-focus-icon">${r.kind === 'resource' ? '▤' : '▦'}</span><div><h2>${esc(r.name)}</h2><p>${m.labels.code}：${esc(r.code)}</p><p>提交人：${esc(r.submitter)} <span>提交时间：${esc(r.submitted)}</span></p></div><div class="identity-audit-ref"><span>申请编号</span><strong>${esc(r.id)}</strong></div></section>` +
    raInformation(r, a.material) +
    `</div><div class="identity-audit-side">` +
    raDecision(r, d, readOnly) +
    `<section class="identity-audit-section identity-flow-section" ${raDialogReq('flow')}><div class="identity-audit-section-title"><h2>流程信息</h2></div><div class="identity-flow-body">${raFlow(r)}</div></section>` +
    `</div></div></section></div>`;
  const information = document.querySelector('.identity-audit-information');
  if (information) information.scrollTop = infoScroll;
  const side = document.querySelector('.identity-audit-side');
  if (side) side.scrollTop = sideScroll;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
function raAuditSubmit() {
  const a = raAudit;
  if (!a) return;
  const r = raRecords[a.index];
  if (r.result !== '待审批') return;
  const opinion = (a.draft.opinion || '').trim();
  if (a.draft.result === '已驳回' && !opinion) {
    a.draft.error = '请填写驳回原因。';
    return raAuditRender();
  }
  if (opinion.length > 300) {
    a.draft.error = '审核意见最多 300 字。';
    return raAuditRender();
  }
  r.result = a.draft.result;
  r.reviewer = '当前审批人';
  r.reviewedAt = raDate();
  r.duration = '1分钟';
  r.opinion = opinion || '登记信息与证明材料一致，审核通过。';
  raAuditClose();
  render();
  toast(r.result === '已通过' ? '审核通过：' + r.id + ' 已归入「我已审批」' : '已驳回：' + r.id + ' 已通知申请人');
}

const raPreviousRender = render;
render = function () {
  if (section === 'registrationAudit') { raRender(); return; }
  raPreviousRender();
};
document.addEventListener('keydown', (event) => {
  if (raAudit && event.key === 'Escape') { event.preventDefault(); raAuditClose(); }
});
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get('view') !== 'registrationAudit') return;
  raOpen(q.get('queue') === 'completed' ? 'completed' : 'pending', q.get('tab') || 'resource', true);
  if (q.get('review') === '1') {
    const wanted = q.get('tab') || 'resource';
    const first = raRecords.find((r) => r.kind === wanted && (raQueue === 'completed' ? r.result !== '待审批' : r.result === '待审批'));
    if (first) raAuditOpen(first.id);
  }
})();
