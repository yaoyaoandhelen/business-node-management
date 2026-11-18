// 业务节点管理系统 · 审核管理（待我审批 / 我已审批）与业务节点审核弹窗。
// 版式沿用主体身份管理系统的审核列表与审核弹窗；审核节点只有「待审批 / 已审批 / 驳回」。
const NA_TYPES = ['注册', '更新', '注销'];
const NA_STATES = ['待审批', '已审批', '驳回'];

function naMake(id, name, ident, org, orgId, type, submitted, state, extra = {}) {
  return {
    id, name, ident, org, orgId, type, submitted, state,
    version: '1.0',
    intro: '提供区域数据协同与业务服务。',
    remark: '—',
    service: '数据流通服务',
    dataType: '结构化数据',
    address: '重庆市渝中区',
    credit: orgId,
    operator: '区域数据服务运营中心',
    legal: '李明明',
    legalPhone: '19861433627',
    legalId: '371481199303253618',
    submitter: '租户管理员',
    materials: [
      { label: '业务节点登记材料', file: 'jcss/2026/09/07/17887486531961749433018212398.png' },
      { label: '法人身份证明材料', file: 'jcss/2026/09/07/legal-identity-proof.pdf' }
    ],
    reviewer: '', reviewedAt: '', opinion: '',
    ...extra
  };
}

const naRecords = [
  naMake('SP-20260928-001', 'test0907', '491370782MAC5R7KD3J5000VLl0T29VF', '惠医云（重庆）数智科技有限公司', '91370782MAC5R7KD3J', '注销', '2026-09-28 17:07:38', '待审批', {
    intro: '测试', remark: '1', service: '—', dataType: '—', address: '—', operator: '—'
  }),
  naMake('SP-20260923-002', 'dsadasdas', '—', '徐之人', '2xjllkee27n9u5dyv', '注销', '2026-09-23 14:31:51', '待审批'),
  naMake('SP-20260917-003', '测试一键上报功能', '—', '测试企业QQ', '9150010007EGMN05RG', '注册', '2026-09-17 16:10:29', '待审批'),
  naMake('SP-20260917-004', '新增业务节点0917', '—', '重庆品胜科技有限公司', '9150000079355305966', '注册', '2026-09-17 16:04:32', '待审批'),
  naMake('SP-20260917-005', '新增业务节点0917', '—', 's测试企业硅', '9A5882455211123789', '注册', '2026-09-17 16:01:01', '待审批'),
  naMake('SP-20260915-006', '业务节点0909', '—', '测试企业QQ', '9150010007EGMN05RG', '注销', '2026-09-15 16:45:01', '待审批'),
  naMake('SP-20260914-007', '验证经营时间回显', '491110108MA00BF18XXK5000VLl0T29VF', '小米之家科技有限公司', '91110108MA00BF18XK', '更新', '2026-09-14 15:54:15', '待审批'),
  naMake('SP-20260910-008', '测试业务节点新增', '491500100D7EGMN05RG5000VLl0T29VF', '测试企业QQ', '9150010007EGMN05RG', '注销', '2026-09-10 17:17:26', '待审批'),
  naMake('SP-20260910-009', '测试新流程', '491500100D7EGMN05RG5000G2K3QW81XZ', '测试企业QQ', '9150010007EGMN05RG', '更新', '2026-09-10 17:17:05', '待审批'),
  naMake('SP-20260910-010', '业务节点09100959', '491500100D7EGMN05RG5000H7B2M4D9PL', '测试企业QQ', '9150010007EGMN05RG', '注销', '2026-09-10 11:48:20', '待审批'),
  naMake('SP-20260908-011', '重庆可信数据服务节点', '491500109MA5UEJA80K5000WXXTNCS9Z', '重庆远景科技有限公司', '91500109MA5UEJA80K', '更新', '2026-09-08 09:26:14', '已审批', {
    reviewer: '当前审批人', reviewedAt: '2026-09-08 11:02:37', opinion: '登记信息与证明材料一致，审核通过。'
  }),
  naMake('SP-20260905-012', '区域产业协同节点0915', '491500100D7EGMN05RG5000K9T3V5B2CN', '区域数据服务运营中心', '9150010007EGMN05RG', '注册', '2026-09-05 14:38:02', '已审批', {
    reviewer: '当前审批人', reviewedAt: '2026-09-05 16:20:45', opinion: '接入材料完整，同意注册。'
  }),
  naMake('SP-20260903-013', '交通物流数据服务节点', '491370782MAC5R7KD3JSU50009ZANDSC4Q', '交通物流数据运营中心', '91370782MAC5R7KD3J', '注销', '2026-09-03 10:12:55', '驳回', {
    reviewer: '当前审批人', reviewedAt: '2026-09-03 15:47:09', opinion: '注销说明与附件不一致，请补充有效材料后重新提交。'
  }),
  naMake('SP-20260901-014', '城市公共数据服务平台', '491500100D7EGMN05RG5000P2L8N6D4RK', '城市数据运营中心', '9150010007EGMN05RG', '更新', '2026-09-01 09:05:33', '已审批', {
    reviewer: '当前审批人', reviewedAt: '2026-09-01 10:41:18', opinion: '变更字段与证明材料一致，审核通过。'
  }),
  naMake('SP-20260829-015', '医保行业可信数据空间', '491370782MAC5R7KD3J5000Q4S1C8F7TM', '区域数据服务运营中心', '91370782MAC5R7KD3J', '注销', '2026-08-29 16:33:47', '驳回', {
    reviewer: '当前审批人', reviewedAt: '2026-08-30 09:18:22', opinion: '存在未办结的数据流通业务，暂不予注销。'
  })
];

let naQueue = 'pending', naMenuOpen = true, naAudit = null;
const naViews = {};
const naPageId = () => (naQueue === 'completed' ? 'nodeAudit-completed' : 'nodeAudit-pending');
const naSurface = () => (naQueue === 'completed' ? 'nodeAudit.completed' : 'nodeAudit.pending');
const naQueueName = () => (naQueue === 'completed' ? '我已审批' : '待我审批');
const naTitle = () => '业务节点管理系统 · 审核管理 / ' + naQueueName();
const naReq = (el) => req('node.audit', 'nodeAudit.' + el);
const naDialogReq = (el) => req('node.audit.dialog', 'nodeAudit.audit.' + el);
const naView = () => (naViews[naQueue] ||= { draft: {}, filters: {}, page: 1, size: 10, type: '全部' });
const naDate = () => new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });

const naQueryFields = [
  ['name', '业务节点登记名称'],
  ['ident', '业务节点身份标识'],
  ['org', '所属法人或其他组织名称'],
  ['state', '状态', NA_STATES],
  ['date', '申请日期', null, 'date']
];

function naOpen(queue = 'pending', initial = false) {
  if (naAudit) naAuditClose();
  naQueue = queue === 'completed' ? 'completed' : 'pending';
  section = 'nodeAudit';
  $('#overlay').innerHTML = '';
  document.querySelector('#audit')?.remove();
  const u = new URL(location.href);
  u.searchParams.set('system', 'management');
  u.searchParams.set('view', 'nodeAudit');
  u.searchParams.set('queue', naQueue);
  if (!initial) u.searchParams.delete('review');
  history.replaceState(null, '', u);
  render();
}
function naBack() {
  section = 'launch';
  history.replaceState(null, '', '?system=management');
  render();
}
function naNav() {
  document.querySelector('header b').textContent = '业务节点管理系统';
  const inAudit = section === 'nodeAudit';
  $('#sidebar').innerHTML =
    `<div class="nav ${section === 'review' ? 'active' : ''}" onclick="section='review';render()">▦　接入登记审核</div>` +
    `<button class="identity-menu nav" aria-expanded="${naMenuOpen}" ${naReq('nav.group')} onclick="naMenuOpen=!naMenuOpen;render()"><span>▣</span>审核管理<em>${naMenuOpen ? '⌄' : '›'}</em></button>` +
    (naMenuOpen
      ? `<button class="identity-menu nav identity-sub ${inAudit && naQueue === 'pending' ? 'active' : ''}" ${naReq('nav.pending')} onclick="naOpen('pending')">待我审批</button>` +
        `<button class="identity-menu nav identity-sub ${inAudit && naQueue === 'completed' ? 'active' : ''}" ${naReq('nav.completed')} onclick="naOpen('completed')">我已审批</button>`
      : '') +
    `<div class="nav ${section === 'dirsync' ? 'active' : ''}" onclick="dsOpen()">▧　全域目录信息互通</div>` +
    `<button class="identity-menu nav identity-return" onclick="naBack()"><span>⇤</span>返回快捷入口</button>`;
}

function naQuery(reset = false) {
  const v = naView();
  if (reset) {
    v.draft = {};
    v.filters = {};
    v.type = '全部';
  } else {
    v.filters = Object.fromEntries(Object.entries(v.draft).map(([k, value]) => [k, String(value).trim()]));
  }
  v.page = 1;
  naRender();
}
function naFiltered() {
  const v = naView(), f = v.filters;
  return naRecords
    .map((r, index) => ({ r, index }))
    .filter(({ r }) => (naQueue === 'completed' ? r.state !== '待审批' : r.state === '待审批'))
    .filter(({ r }) =>
      (v.type === '全部' || r.type === v.type) &&
      (!f.name || r.name.includes(f.name)) &&
      (!f.ident || r.ident.includes(f.ident)) &&
      (!f.org || r.org.includes(f.org)) &&
      (!f.state || r.state === f.state) &&
      (!f.date || r.submitted.slice(0, 10) === f.date)
    );
}
function naTypeCode(type) {
  return { '全部': 'all', '注册': 'register', '更新': 'update', '注销': 'cancel' }[type] || 'all';
}
function naTypeCounts() {
  const queued = naRecords.filter((r) => (naQueue === 'completed' ? r.state !== '待审批' : r.state === '待审批'));
  const counts = { '全部': queued.length };
  NA_TYPES.forEach((t) => { counts[t] = queued.filter((r) => r.type === t).length; });
  return counts;
}
function naFilterType(type) {
  const v = naView();
  if (!['全部', ...NA_TYPES].includes(type) || v.type === type) return;
  v.type = type;
  v.draft = {};
  v.filters = {};
  v.page = 1;
  naRender();
}
function naStateBadge(state) {
  const cls = state === '待审批' ? 'orange' : state === '已审批' ? 'green' : 'red';
  return `<span class="identity-badge ${cls}">${state}</span>`;
}
function naTypeBadge(type) {
  const cls = type === '注销' ? 'red' : type === '更新' ? 'orange' : '';
  return `<span class="identity-badge ${cls}">${type}</span>`;
}
function naRender() {
  document.querySelector('header b').textContent = '业务节点管理系统';
  nav();
  const v = naView(), list = naFiltered(), typeCounts = naTypeCounts();
  const pages = Math.max(1, Math.ceil(list.length / v.size));
  v.page = Math.min(v.page, pages);
  const rows = list.slice((v.page - 1) * v.size, v.page * v.size);
  const columns = ['业务节点登记名称', '业务节点身份标识', '所属法人或其他组织名称', '所属法人或其他身份标识', '审核类型', '申请时间', '状态'];
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="naBack()">首页</span><span class="selected">● 审核管理 / ${naQueueName()}</span></div>` +
    `<div class="identity-page node-audit-page" data-req-page="${naPageId()}" data-req-surface="${naSurface()}" data-req-title="${naTitle()}">` +
    `<section class="identity-navigation" ${naReq('typeNav')} aria-label="审核类型"><div class="identity-type-navigation" role="tablist" aria-label="审核类型">${['全部', ...NA_TYPES]
      .map((t) => `<button type="button" role="tab" aria-selected="${v.type === t}" class="identity-type-tab ${v.type === t ? 'active' : ''}" ${naReq('typeNav.tab.' + naTypeCode(t))} onclick="naFilterType('${t}')"><span>${t}</span><b>${typeCounts[t]}</b></button>`)
      .join('')}</div></section>` +
    `<form class="identity-filters" onsubmit="event.preventDefault();naQuery()" ${naReq('query')}>` +
    `<div class="identity-query-fields">${naQueryFields
      .map(([key, label, options, inputType]) =>
        `<label ${naReq('query.field.' + key)}><span>${label}</span>${
          options
            ? `<select name="${key}" aria-label="${label}" onchange="naView().draft[this.name]=this.value"><option value="">全部</option>${options.map((x) => `<option ${v.draft[key] === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`
            : `<input name="${key}" aria-label="${label}" type="${inputType || 'text'}" placeholder="请输入" value="${esc(v.draft[key] || '')}" oninput="naView().draft[this.name]=this.value">`
        }</label>`
      )
      .join('')}</div>` +
    `<div class="identity-query-actions" ${naReq('query.actions')}><button class="btn" type="button" onclick="naQuery(true)">重置</button><button class="btn primary" type="submit">查询</button></div>` +
    `</form>` +
    `<section class="identity-results" ${naReq('list')} aria-label="${naQueueName()}列表">` +
    `<div class="identity-table-tools" ${naReq('list.heading')}><h2>${naQueueName()}</h2><button type="button" aria-label="刷新列表" title="刷新列表" onclick="naRender()">↻</button></div>` +
    `<div class="identity-table-scroll"><table style="width:100%" ${naReq('list.table')}><thead><tr><th>序号</th>${columns.map((n) => `<th>${n}</th>`).join('')}<th>操作</th></tr></thead><tbody>${rows
      .map(
        ({ r, index }, i) =>
          `<tr><td>${(v.page - 1) * v.size + i + 1}</td><td title="${esc(r.name)}">${esc(r.name)}</td><td title="${esc(r.ident)}">${esc(r.ident)}</td><td title="${esc(r.org)}">${esc(r.org)}</td><td>${esc(r.orgId)}</td><td>${naTypeBadge(r.type)}</td><td>${esc(r.submitted)}</td><td>${naStateBadge(r.state)}</td><td><button type="button" class="link" ${naReq('list.handle')} onclick="naAuditOpen(${index})">${r.state === '待审批' ? '审批' : '查看'}</button></td></tr>`
      )
      .join('') || `<tr><td colspan="${columns.length + 2}" class="empty">暂无匹配记录</td></tr>`}</tbody></table></div>` +
    `<div class="identity-pagination" ${naReq('pagination')}><span>共 ${list.length} 条</span><select aria-label="每页条数" onchange="naView().size=Number(this.value);naView().page=1;naRender()">${[10, 20, 50]
      .map((n) => `<option value="${n}" ${n === v.size ? 'selected' : ''}>${n}条/页</option>`)
      .join('')}</select><button ${v.page === 1 ? 'disabled' : ''} aria-label="上一页" onclick="naView().page--;naRender()">‹</button><b>${v.page}</b><button ${v.page === pages ? 'disabled' : ''} aria-label="下一页" onclick="naView().page++;naRender()">›</button><label>前往 <input type="number" aria-label="跳转页码" min="1" max="${pages}" value="${v.page}" onchange="naView().page=Math.max(1,Math.min(${pages},Math.floor(Number(this.value)||1)));naRender()"> 页</label></div>` +
    `</section></div>`;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}

function naAuditOpen(index) {
  const row = naRecords[index];
  if (!row) return;
  naAudit = { index, draft: { result: '已审批', opinion: '', error: '' }, material: null };
  ['header', '#sidebar', '#main'].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.inert = true;
  });
  naAuditRender();
  $('#overlay [role="dialog"]').focus();
}
function naAuditClose() {
  ['header', '#sidebar', '#main'].forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) element.inert = false;
  });
  naAudit = null;
  $('#overlay').innerHTML = '';
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
  document.querySelector('.node-audit-page .identity-results .link')?.focus();
}
function naAuditSwitch(type) {
  if (!naAudit || !NA_TYPES.includes(type)) return;
  const index = naRecords.findIndex((r) => r.type === type && (naQueue === 'completed' ? r.state !== '待审批' : r.state === '待审批'));
  if (index < 0) return toast('暂无「' + type + '」类型的' + naQueueName() + '记录');
  naAudit = { index, draft: { result: '已审批', opinion: '', error: '' }, material: null };
  naAuditRender();
}
function naAuditMaterial(file) {
  naAudit.material = file;
  naAuditRender();
  document.querySelector('.identity-audit-material-note')?.scrollIntoView({ block: 'center' });
}
function naFlow(r) {
  const secondCls = r.state === '待审批' ? 'current' : r.state === '已审批' ? 'done' : 'rejected';
  const thirdCls = r.state === '已审批' ? 'done' : r.state === '驳回' ? 'rejected' : 'upcoming';
  return `<ol class="identity-flow" aria-label="业务节点审核分流记录">
    <li class="done"><span class="identity-flow-marker">✓</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>流程开始</strong><time>${esc(r.submitted)}</time></div><p>${esc(r.submitter)} · 提交业务节点${r.type}申请</p></div></li>
    <li class="${secondCls}"><span class="identity-flow-marker">${secondCls === 'current' ? '2' : '✓'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>待审批</strong><span class="identity-flow-status ${secondCls}">${r.state === '待审批' ? '待审批' : '已审核'}</span></div><p>处理人：租户管理员 · 接收时间：${esc(r.submitted)}</p></div></li>
    <li class="${thirdCls}"><span class="identity-flow-marker">${thirdCls === 'done' ? '✓' : thirdCls === 'rejected' ? '×' : '3'}</span><div class="identity-flow-content"><div class="identity-flow-line"><strong>${r.state === '驳回' ? '驳回' : '已审批'}</strong>${r.reviewedAt ? `<time>${esc(r.reviewedAt)}</time>` : ''}</div>${r.state === '待审批' ? '<p>待审批人出具结论</p>' : `<p>审核人：${esc(r.reviewer)}</p>${r.opinion ? `<div class="identity-flow-opinion">${esc(r.opinion)}</div>` : ''}`}</div></li>
  </ol>`;
}
function naAuditRender() {
  const a = naAudit;
  if (!a) return;
  const r = naRecords[a.index];
  const readOnly = r.state !== '待审批';
  const scrollTop = document.querySelector('.identity-audit-information')?.scrollTop || 0;
  const sideScrollTop = document.querySelector('.identity-audit-side')?.scrollTop || 0;
  const d = a.draft;
  const basicFields = [
    ['业务节点登记名称', r.name], ['业务节点版本', r.version],
    ['业务功能介绍', r.intro], ['备注', r.remark],
    ['服务类型', r.service], ['法人姓名', r.legal],
    ['流通数据类型', r.dataType], ['法人联系方式', r.legalPhone],
    ['业务节点物理地址', r.address], ['法人身份证号', r.legalId],
    ['统一社会信用代码', r.credit], ['运营机构名称', r.operator],
    ['所属法人或其他组织名称', r.org, true], ['所属法人或其他身份标识', r.orgId, true],
    ['申请时间', r.submitted, true]
  ];
  $('#overlay').innerHTML =
    `<div class="identity-audit-veil"><section class="identity-audit-dialog node-audit-dialog" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="na-audit-title" data-req-page="${naPageId()}" data-req-surface="nodeAudit.audit.dialog" data-req-layer="dialog" data-req-title="业务节点${r.type}审核">` +
    `<div class="identity-audit-header" ${naDialogReq('context')}><div><span class="identity-audit-eyebrow">业务节点管理系统 · 审核管理</span><h1 id="na-audit-title">业务节点${r.type}审核 <span class="identity-audit-state">${r.state}</span></h1></div><button class="identity-audit-close" aria-label="关闭审核弹窗" ${naDialogReq('close')} onclick="naAuditClose()">×</button></div>` +
    `<div class="identity-audit-scenarios" ${naDialogReq('typeSwitch')}><span>审核类型</span><div role="tablist" aria-label="切换审核类型">${NA_TYPES.map((t) => `<button role="tab" aria-selected="${r.type === t}" class="${r.type === t ? 'active' : ''}" onclick="naAuditSwitch('${t}')">${t}</button>`).join('')}</div></div>` +
    `<p class="identity-audit-demo-hint" ${naDialogReq('typeNote')}>此处多个审核类型弹窗仅作原型展示，真实审核流每次只有一个审核类型。</p>` +
    `<div class="identity-audit-layout"><div class="identity-audit-information">` +
    `<section class="identity-audit-focus" ${naDialogReq('subject')}><span class="identity-audit-focus-icon">▣</span><div><h2>${esc(r.name)}</h2><p>业务节点身份标识：${esc(r.ident)}</p><p>提交人：${esc(r.submitter)} <span>申请时间：${esc(r.submitted)}</span></p></div><div class="identity-audit-ref"><span>申请编号</span><strong>${esc(r.id)}</strong></div></section>` +
    `<section class="identity-audit-section" ${naDialogReq('request')}><div class="identity-audit-section-title"><h2>本次${r.type}申请</h2><span>${r.state === '待审批' ? r.type + '待审核' : r.state}</span></div><div class="identity-audit-request"><dl class="identity-audit-fields"><div><dt>审核类型</dt><dd>${naTypeBadge(r.type)}</dd></div><div><dt>申请事项</dt><dd>业务节点${r.type}登记申请</dd></div><div class="wide"><dt>申请说明</dt><dd>${esc(r.intro)}</dd></div></dl></div></section>` +
    `<section class="identity-audit-section" ${naDialogReq('basic')}><div class="identity-audit-section-title"><h2>基本信息</h2><span>业务节点登记信息</span></div><div class="identity-audit-request"><dl class="identity-audit-fields">${basicFields.map(([label, value, wide]) => `<div class="${wide ? 'wide' : ''}"><dt>${label}</dt><dd>${esc(value || '—')}</dd></div>`).join('')}</dl></div></section>` +
    `<section class="identity-audit-section" ${naDialogReq('materials')}><div class="identity-audit-section-title"><h2>材料清单</h2><span>共 ${r.materials.length} 份</span></div><div class="identity-audit-request"><div class="na-files">${r.materials
      .map((m) => {
        const ext = m.file.split('.').pop().toUpperCase() === 'PDF' ? 'PDF' : 'IMG';
        return `<div class="na-file-row"><span class="identity-audit-file-icon">${ext}</span><div><strong>${esc(m.label)}</strong><small>${esc(m.file)}</small></div><span class="identity-badge green">已上传</span><button type="button" class="link" onclick="naAuditMaterial('${esc(m.file)}')">预览</button><button type="button" class="link" onclick="toast('下载服务暂不可用，请稍后重试')">下载</button></div>`;
      })
      .join('')}</div>${a.material ? `<div class="identity-audit-material-note" role="status"><strong>材料查看 · ${esc(a.material)}</strong><button class="link" onclick="naAudit.material=null;naAuditRender()">收起</button></div>` : ''}</div></section>` +
    `</div><div class="identity-audit-side">` +
    `<aside class="identity-audit-decision" ${naDialogReq('decision')}><div class="identity-audit-decision-heading"><span>审核工作区</span><h2>${readOnly ? '审核结果' : '请完成业务节点审核'}</h2></div>` +
    (readOnly
      ? `<div class="identity-audit-read-result">${naStateBadge(r.state)}<dl><dt>审核人</dt><dd>${esc(r.reviewer || '—')}</dd><dt>审核时间</dt><dd>${esc(r.reviewedAt || '—')}</dd><dt>审核意见</dt><dd>${esc(r.opinion || '—')}</dd></dl></div><div class="identity-audit-bottom-close" ${naDialogReq('actions')}><button class="btn" onclick="naAuditClose()">关闭</button></div>`
      : `<form id="na-audit-form" onsubmit="event.preventDefault();naAuditSubmit()"><fieldset><legend>审核结果 <em>*</em></legend><label class="identity-audit-choice ${d.result === '已审批' ? 'selected' : ''}"><input type="radio" name="na-result" value="已审批" ${d.result === '已审批' ? 'checked' : ''} onchange="naAudit.draft.result=this.value;naAudit.draft.error='';naAuditRender()">已审批</label><label class="identity-audit-choice ${d.result === '驳回' ? 'selected' : ''}"><input type="radio" name="na-result" value="驳回" ${d.result === '驳回' ? 'checked' : ''} onchange="naAudit.draft.result=this.value;naAudit.draft.error='';naAuditRender()">驳回</label></fieldset><label class="identity-audit-opinion">审核意见 ${d.result === '驳回' ? '<em>*</em>' : '<span>（选填）</span>'}<textarea aria-label="审核意见" maxlength="300" placeholder="${d.result === '驳回' ? '请填写驳回原因，便于申请人补充材料' : '请输入审核意见'}" oninput="naAudit.draft.opinion=this.value;naAudit.draft.error='';">${esc(d.opinion)}</textarea></label><p class="identity-audit-error" role="alert">${esc(d.error)}</p><div class="identity-audit-submit" ${naDialogReq('actions')}><button type="submit" class="btn primary">提交审核</button></div></form>`) +
    `</aside>` +
    `<section class="identity-audit-section identity-flow-section" ${naDialogReq('flow')}><div class="identity-audit-section-title"><h2>分流记录</h2><span class="identity-flow-type">${r.type}</span></div><div class="identity-flow-body">${naFlow(r)}</div></section>` +
    `</div></div></section></div>`;
  const information = document.querySelector('.identity-audit-information');
  if (information) information.scrollTop = scrollTop;
  const side = document.querySelector('.identity-audit-side');
  if (side) side.scrollTop = sideScrollTop;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
function naAuditSubmit() {
  const a = naAudit;
  if (!a) return;
  const r = naRecords[a.index];
  if (r.state !== '待审批') return;
  const opinion = (a.draft.opinion || '').trim();
  if (a.draft.result === '驳回' && !opinion) {
    a.draft.error = '请填写驳回原因。';
    return naAuditRender();
  }
  if (opinion.length > 300) {
    a.draft.error = '审核意见最多 300 字。';
    return naAuditRender();
  }
  r.state = a.draft.result;
  r.reviewer = '当前审批人';
  r.reviewedAt = naDate();
  r.opinion = opinion || '登记信息与证明材料一致，审核通过。';
  naAuditClose();
  render();
  toast(r.state === '已审批' ? '审核通过：' + r.id + ' 已归入「我已审批」' : '已驳回：' + r.id + ' 已通知申请人');
}

const naPreviousRender = render;
render = function () {
  if (section === 'nodeAudit') {
    naRender();
    return;
  }
  naPreviousRender();
};
const naPreviousNav = nav;
nav = function () {
  if (['review', 'dirsync', 'nodeAudit'].includes(section)) {
    naNav();
    return;
  }
  naPreviousNav();
};
const naPreviousNavigate = navigate;
navigate = function (i) {
  if (section === 'launch' && i === 5) {
    naOpen('pending');
    return;
  }
  naPreviousNavigate(i);
};
document.addEventListener('keydown', (event) => {
  if (naAudit && event.key === 'Escape') {
    event.preventDefault();
    naAuditClose();
  }
});

(function () {
  const q = new URLSearchParams(location.search);
  if (q.get('view') !== 'nodeAudit') return;
  naOpen(q.get('queue') === 'completed' ? 'completed' : 'pending', true);
  if (q.get('review') === '1') {
    const index = naRecords.findIndex((r) => r.state === '待审批');
    if (index >= 0) naAuditOpen(index);
  }
})();
