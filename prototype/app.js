const $ = (s) => document.querySelector(s);
let selectedSystem = -1;
function selectSystem(index) {
  selectedSystem = index;
  document.querySelectorAll('.cards > .card').forEach((card, i) => {
    card.classList.toggle('selected', i === index);
    if (i === index) card.setAttribute('aria-current', 'true');
    else card.removeAttribute('aria-current');
  });
}
let section = 'launch',
  rows = [],
  uploads = {},
  auditScenario = 'pass';
const req = (id, el = id) => `data-req-id="${id}" data-req-element="${el}"`;
const icons = [
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h13l7 7v21H7z"/><path d="M20 3v8h7M11 17h12M11 22h12M11 27h8"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h26v22H4zM4 14h26M4 21h26M12 7v22M22 7v22"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7h18M12 17h18M12 27h18"/><circle cx="5" cy="7" r="1"/><circle cx="5" cy="17" r="1"/><circle cx="5" cy="27" r="1"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="26" height="26" rx="2"/><path d="m9 16 6 7L26 11"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6 19 3v28L4 28zM21 7h9v21h-9M23 11h5M23 15h5M23 19h5M23 23h5"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 21 9-9M10 17l-3 3a6 6 0 0 0 9 9l5-5M24 17l3-3a6 6 0 0 0-9-9l-5 5"/></svg>'
];
const names = [
  '标识管理系统',
  '连接器管理系统',
  '主体身份管理系统',
  '业务节点管理系统',
  '数据目录管理系统',
  '存证服务'
];
const colors = [
  ['#7599dc', '#294e9b'],
  ['#9c79df', '#532ca0'],
  ['#6ed8c7', '#229a8b'],
  ['#d8b16e', '#a4742c'],
  ['#df7777', '#a92c30'],
  ['#79a3df', '#2d5c9e']
];
function toast(t) {
  $('#toast').textContent = t;
  $('#toast').style.display = 'block';
  setTimeout(() => ($('#toast').style.display = 'none'), 2600);
}
function nav() {
  let items =
    section === 'launch'
      ? ['快捷入口', '鉴权管理', '流程中心', '区域目录管理系统', '应用上架', '审核管理']
      : ['系统首页', '接入登记审核', '业务节点管理', '运行监测', '系统设置'];
  $('#sidebar').innerHTML =
    items
      .map(
        (n, i) =>
          `<div class="nav ${section !== 'launch' && ((section === 'home' && i === 0) || (section === 'review' && i === 1)) ? 'active' : ''}" onclick="navigate(${i})"><span>${['↗', '▣', '▦', '▧', '◉', '◉'][i]}</span>${n}${i ? '<em>⌄</em>' : ''}</div>`
      )
      .join('') +
    (section !== 'launch'
      ? '<div class="nav" onclick="section=\'launch\';render()"><span>⇤</span>返回快捷入口</div>'
      : '');
}
function navigate(i) {
  if (section === 'launch') {
    if (i === 0) render();
    else toast('请从快捷入口进入业务子系统');
    return;
  }
  section = i === 1 ? 'review' : 'home';
  if (i > 1) {
    toast('当前服务暂不可用，请稍后重试');
    return;
  }
  render();
}
function render() {
  nav();
  if (section === 'launch') {
    $('#main').innerHTML =
      `<div class="launch" ${req('portal.system.switch','management.system.launchpad')}><div class="hero"><span class="eyebrow">• LAUNCHPAD</span><h1>快捷入口</h1><p>选择业务子系统，快速开始工作</p></div><div class="cards">${names.map((n, i) => `<article class="card ${selectedSystem === i ? 'selected' : ''}" tabindex="0" ${selectedSystem === i ? 'aria-current="true"' : ''} onfocusin="selectSystem(${i})" onkeydown="if(event.target===this && (event.key==='Enter' || event.key===' ')){event.preventDefault();this.click()}" ${req(i === 3 ? 'node.enter' : i === 4 ? 'catalog.browse' : 'system.' + i)} onclick="selectSystem(${i});${i === 0 ? 'identifierOpen()' : i === 3 ? "section='home';render()" : i === 4 ? 'catalogOpen()' : "toast('当前服务暂不可用，请稍后重试')"}"><span class="num">0${i + 1}</span><div class="icon" style="--light:${colors[i][0]};--dark:${colors[i][1]}">${icons[i]}</div><h2>${n}</h2><p>业务子系统</p><button class="enter">立即进入</button><span class="arrow">→</span></article>`).join('')}</div></div>`;
    return;
  }
  if (section === 'home') {
    $('#main').innerHTML =
      `<div class="workspace"><div class="crumb">业务节点管理系统 / 系统首页</div><div class="pageheading"><div><h1>业务节点管理系统</h1><span class="muted">统一管理业务节点接入，保障服务合规运行</span></div><span class="muted"></span></div><div class="summary panel" ${req('node.statistics')}><article>接入登记总数<strong>${rows.length}</strong><span class="muted">登记记录</span></article><article>待人工审核<strong>${rows.length}</strong><span class="muted">机器审核通过后进入</span></article><article>已完成审核<strong>0</strong><span class="muted">人工审核完成的登记</span></article></div><div class="panel"><h3>快捷操作</h3><p class="muted">发起业务节点接入登记，完成材料填报与审核</p><button class="btn primary" ${req('node.review')} onclick="section='review';render()">接入登记审核 →</button></div><div class="panel"><h3>接入审核流程</h3><div class="auditsteps">① 填写登记与上传材料　 →　 ② 机器内容审核　 →　 ③ 提交成功　 →　 ④ 人工审核</div><p class="muted">内容安全检查覆盖登记文本及上传材料。模型异常时保留当前表单，禁止直接进入人工审核。</p></div></div>`;
    return;
  }
  $('#main').innerHTML =
    `<div class="workspace"><div class="crumb">业务节点管理系统 / 接入登记审核</div><div class="pageheading"><div><h1>接入登记审核</h1><span class="muted">管理接入申请，查看机器审核与人工审核进度</span></div><button class="btn primary" ${req('node.create')} onclick="openForm()">＋ 新增接入注册</button></div><div class="panel"><div class="filters" ${req('node.query')}><label>登记名称</label><input id="search" placeholder="请输入登记名称"><label>审核状态</label><select id="state"><option>全部</option><option>待人工审核</option></select><button class="btn primary" onclick="drawRows()">查询</button><button class="btn" onclick="$('#search').value='';$('#state').selectedIndex=0;drawRows()">重置</button></div><table><thead><tr><th>序号</th><th>登记名称</th><th>所属组织</th><th>服务类型</th><th>版本号</th><th>机器审核</th><th>人工审核状态</th><th>操作</th></tr></thead><tbody id="rows"></tbody></table><div class="pagination">共 ${rows.length} 条　　每页 10 条　　〈 <b>1</b> 〉</div></div></div>`;
  drawRows();
}
function esc(t) {
  return String(t).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}
function drawRows() {
  const found = rows.filter((r) => r.name.includes($('#search').value));
  $('#rows').innerHTML = found.length
    ? found
        .map(
          (r, i) =>
            `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.org)}</td><td>${esc(r.service || '—')}</td><td>${esc(r.version)}</td><td><span class="status ok">已通过</span></td><td><span class="status">待人工审核</span></td><td><button class="link" onclick="showDetail(${rows.indexOf(r)})">查看详情</button></td></tr>`
        )
        .join('')
    : '<tr><td colspan="8" class="empty">▤<br><br>暂无接入登记记录<br><br><span class="muted">点击「新增接入注册」发起申请</span></td></tr>';
}
const fields = [
  ['name', '登记名称', '请输入业务节点登记名称', true],
  ['operator', '运营机构名称', '请输入运营机构名称'],
  ['org', '所属组织', '请选择所属组织', true],
  ['credit', '统一社会信用代码', '请输入统一社会信用代码'],
  ['service', '服务类型', '请选择服务类型'],
  ['version', '版本号', '请输入版本号，如 1.0.0 或 v1.0.0', true],
  ['date', '经营时间', '请选择经营时间'],
  ['legal', '法人姓名', '请输入法人姓名'],
  ['phone', '法人联系方式', '请输入法人联系方式'],
  ['idcard', '法人身份证号', '请输入法人身份证号'],
  ['address', '物理地址', '请输入业务节点物理地址']
];
function field(f) {
  return `<div class="field" ${req('node.field.' + f[0])}><label class="${f[3] ? 'required' : ''}">${f[1]}</label>${f[0] === 'service' ? '<select name="service"><option value="">请选择服务类型</option><option>数据服务</option><option>应用服务</option><option>基础设施服务</option></select>' : `<input name="${f[0]}" placeholder="${f[2]}" ${f[3] ? 'required' : ''} ${f[0] === 'date' ? 'type="date"' : ''} ${f[0] === 'address' ? 'maxlength="100"' : ''}>`}</div>`;
}
function upload(label, key, required = false) {
  return `<label class="upload">${label}<input type="file" hidden accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onchange="onFile(this,'${key}')"></label><span class="files" id="file-${key}"></span>`;
}
function openForm() {
  uploads = {};
  $('#overlay').innerHTML =
    `<div class="veil"><section class="modal"><div class="modalhead">新增接入注册<button class="close" onclick="closeForm()">×</button></div><div class="modalbody"><div class="notice">ⓘ 点击提交审核后，系统先对填写的文字进行敏感词审核，通过后进入人工审核。</div><form id="registration" onsubmit="submitRegistration(event)"><div class="formgrid"><h3 class="form-section-heading">基本信息</h3>${fields.slice(0,7).map(field).join('')}<h3 class="form-section-heading">法人信息</h3>${fields.slice(7,10).map(field).join('')}<h3 class="form-section-heading">业务信息</h3>${fields.slice(10).map(field).join('')}<div class="field full" ${req('node.field.description')}><label class="required">业务简介</label><textarea name="description" required placeholder="请输入业务功能简介"></textarea></div><h3 class="form-section-heading">证明材料</h3><div class="field full" ${req('node.material')}><label class="required">核心业务证明材料</label><div class="content">${upload('上传证明材料', 'core')}</div></div><div class="field full" ${req('node.material', 'node.material.filename')}><label>证明材料文件名</label><input name="filename" placeholder="请输入业务功能证明材料文件名"></div><div class="field full" ${req('node.material')}><label>登记材料</label><div class="content" style="display:flex;justify-content:space-between"><div>${upload('上传营业执照', 'license')}</div><div>${upload('上传法人身份证', 'identity')}</div><div>${upload('上传服务承诺书', 'promise')}</div></div></div><div class="field full" ${req('node.templates')} style="align-items:flex-start"><label style="padding-top:15px">登记材料模板</label><div class="content"><div class="templates">${['营业执照模板', '身份证模板', '服务承诺书模板'].map((n, i) => `<div class="template"><h3><span>${['▤', '♙', '♧'][i]}</span>${n}<a href="./template-${i}.txt" download>↓ 下载模板</a></h3><p>${['请下载营业执照模板，按格式准备企业营业执照副本扫描件或复印件，确保统一社会信用代码、企业名称、法定代表人等信息清晰可辨。', '请下载身份证模板，按格式准备法定代表人身份证正反面扫描件或照片，确保姓名、身份证号码、有效期等关键信息完整清晰。', '请下载服务承诺书模板，按照模板填写并加盖企业公章后上传，承诺书内容应包含服务内容、服务期限、责任义务等相关条款。'][i]}</p></div>`).join('')}</div><div class="tip">🟠 请下载模板后按要求填写，填写完成后将扫描件或照片上传至对应登记材料区域。模板仅供参考。</div></div></div><div class="field full" ${req('node.field.remark')}><label>备注</label><textarea name="remark" placeholder="请输入备注说明"></textarea></div><h3 class="form-section-heading">服务地址</h3><div class="field full" ${req('node.endpoint')} style="align-items:flex-start"><label class="required" style="padding-top:12px">业务节点地址</label><div class="content"><div id="addresses"></div><button type="button" class="link" onclick="addAddress()">＋ 添加地址</button></div></div></div></form></div><div class="modalfoot"><button class="btn" onclick="closeForm()">取消</button><button type="button" class="btn riskpreview" ${req('node.machineAudit', 'node.machineAudit.preview')} onclick="previewCurrentRisk()">测试机机器审核不通过页面</button><button class="btn primary" form="registration" type="submit" ${req('node.submit')}>提交审核</button></div></section></div>`;
  addAddress();

}
function addAddress() {
  const div = document.createElement('div');
  div.className = 'addresses';
  div.innerHTML =
    '<select required name="endpointType"><option value="">地址类型</option><option>业务服务</option><option>数据服务</option></select><input required name="endpoint" type="url" pattern="https://.*" placeholder="服务地址(https://)"><input name="api" type="url" pattern="https://.*" placeholder="API地址(https://)"><button type="button" class="link" onclick="testConnection(this)">连通性检测</button><button type="button" class="link" onclick="if($(\'#addresses\').children.length>1)this.parentElement.remove();else toast(\'至少保留一个地址\')">♜</button>';
  $('#addresses').append(div);
}
function testConnection(b) {
  const v = b.parentElement.querySelector('[name=endpoint]');
  if (!v.checkValidity() || !v.value) {
    v.reportValidity();
    return;
  }
  b.textContent = '检测中…';
  setTimeout(() => {
    b.textContent = '连通性检测';
    toast('连通性检测完成');
  }, 700);
}
function onFile(input, key) {
  const f = input.files[0];
  if (!f) return;
  const extension = f.name.includes('.') ? f.name.split('.').pop().toLowerCase() : '';
  if (!['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'].includes(extension)) {
    toast('仅支持PDF、PNG、JPG、JPEG、DOC、DOCX格式');
    input.value = '';
    return;
  }
  if (f.size > 20 * 1024 * 1024) {
    toast('单个文件不能超过20MB');
    input.value = '';
    return;
  }
  uploads[key] = f.name;
  $('#file-' + key).textContent = f.name;
  if (key === 'core') $('[name=filename]').value = f.name;
}
function closeForm() {
  if (confirm('关闭后未保存的修改将丢失，确认关闭？')) $('#overlay').innerHTML = '';
}
function fillDemo() {
  const d = {
    name: '区域数据协同服务节点',
    operator: '区域数据服务运营中心',
    org: '区域运营中心',
    credit: '91500000MA01A1234X',
    service: '数据服务',
    version: 'v1.0.0',
    date: '2026-10-30',
    legal: '张明',
    phone: '13800138000',
    description: '提供区域数据目录检索与安全交换服务。',
    address: '区域数据中心',
    endpoint: 'https://example.com',
    api: 'https://example.com/api',
    endpointType: '数据服务'
  };
  for (const [k, v] of Object.entries(d)) if ($(`[name=${k}]`)) $(`[name=${k}]`).value = v;
  uploads.core = '核心业务证明材料.pdf';
  $('#file-core').textContent = uploads.core;
  $('[name=filename]').value = uploads.core;
  auditScenario = $('#scenario')?.value || auditScenario;
  toast('资料已填写');
}
function registrationTextFindings(data, force = false) {
  const fields = [
    ['name', '登记名称'],
    ['operator', '运营机构名称'],
    ['org', '所属组织'],
    ['address', '物理地址'],
    ['description', '业务简介'],
    ['filename', '证明材料文件名'],
    ['remark', '备注']
  ];
  const rules = [
    ['敏感词', '敏感词测试', '请删除敏感表述，使用准确、客观的业务说明。'],
    ['涉黄内容', '涉黄测试', '请删除色情、低俗或性暗示相关内容。'],
    ['涉暴内容', '涉暴测试', '请删除暴力、威胁或煽动伤害相关内容。']
  ];
  const hits = fields.flatMap(([field, label]) =>
    rules
      .filter((rule) => String(data?.[field] || '').includes(rule[1]))
      .map((rule) => ({ field, label, type: rule[0], suggestion: rule[2] }))
  );
  if (force && !hits.length)
    hits.push({ field: 'description', label: '业务简介', type: '敏感词', suggestion: rules[0][2] });
  return hits;
}
let pending,
  auditTimer,
  submitting = false;
function setSubmitting(value) {
  submitting = value;
  const button = $('[form="registration"][type="submit"]');
  if (button) {
    button.disabled = value;
    button.textContent = value ? '审核中…' : '提交审核';
  }
}
function submitRegistration(e) {
  e.preventDefault();
  if (submitting) return;
  if (!uploads.core) {
    toast('请上传核心业务证明材料');
    return;
  }
  const d = Object.fromEntries(new FormData($('#registration')));
  if (!/^v?\d+\.\d+\.\d+$/.test(d.version)) {
    toast('版本号格式应为 1.0.0 或 v1.0.0');
    return;
  }
  pending = { ...d, uploads: { ...uploads } };
  auditScenario = $('#scenario')?.value || auditScenario;
  pending.findings = registrationTextFindings({
    ...d,
    filename: [d.filename, ...Object.values(uploads)].filter(Boolean).join(' ')
  });
  const risk = pending.findings.length > 0;
  setSubmitting(true);
  showAudit('loading');
  clearTimeout(auditTimer);
  auditTimer = setTimeout(() => {
    showAudit(
      auditScenario === 'error' ? 'error' : risk || auditScenario === 'risk' ? 'risk' : 'pass'
    );
    setSubmitting(false);
  }, 1600);
}
function showAudit(state) {
  let layer = $('#audit');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'audit';
    layer.className = 'veil';
    layer.style.zIndex = 30;
    document.body.append(layer);
  }
  const info = {
    loading: ['敏感词审核中', '正在对填写的文字进行敏感词审核，请稍候。'],
    risk: ['机器审核未通过', '检测到风险，申请未提交至人工审核。'],
    error: ['机器审核暂不可用', '审核服务暂时不可用，申请尚未提交。请稍后重试。'],
    pass: ['机器审核通过，提交成功', '申请已进入人工审核队列，请等待审核结果。']
  }[state];
  layer.innerHTML = `<div class="auditbox" ${req('node.machineAudit')}>${state === 'loading' ? '<div class="loader"></div>' : `<div class="auditmark" style="color:${state === 'pass' ? '#2e9f82' : '#d69b3c'}">${state === 'pass' ? '✓' : '!'}</div>`}<h2>${info[0]}</h2><p>${info[1]}</p><div class="auditsteps"><span>① 机器审核 ${state === 'pass' ? '✓' : ''}</span><span>→</span><span>② 人工审核 ${state === 'pass' ? '待处理' : '未进入'}</span></div>${state === 'risk' ? '<div class="error">风险位置：登记文字<br>风险类型：敏感词、涉黄或涉暴内容<br>请修改相关文字后重新提交。</div>' : state === 'pass' ? '<div class="success">机器审核：通过　｜　人工审核：待审核</div>' : ''}${state !== 'loading' ? `<p><button class="btn primary" onclick="finishAudit('${state}')">${state === 'pass' ? '完成' : state === 'risk' ? '返回修改' : '返回重试'}</button></p>` : ''}</div>`;
  if (state === 'pass') {
    rows.unshift({ ...pending });
    $('#overlay').innerHTML = '';
    section = 'review';
    render();
  }
}
function finishAudit(state) {
  $('#audit').remove();
}
function showDetail(i) {
  const r = rows[i];
  $('#overlay').innerHTML =
    `<div class="veil"><div class="auditbox"><h2>接入登记详情</h2><p>${esc(r.name)}</p><div class="success">机器审核通过 · 待人工审核</div><p>所属组织：${esc(r.org)}<br>版本号：${esc(r.version)}<br>业务简介：${esc(r.description)}</p><button class="btn primary" onclick="$('#overlay').innerHTML=''">关闭</button></div></div>`;
}
render();
// Each subsystem owns its navigation and page shell.
const portalRender = render;
nav = function () {
  const portal = section === 'launch';
  document.querySelector('header b').textContent = portal
    ? '基础设施运营管理系统'
    : '业务节点管理系统';
  const menu = portal
    ? ['快捷入口', '鉴权管理', '流程中心', '区域目录管理系统', '应用上架', '审核管理']
    : ['接入登记审核'];
  $('#sidebar').innerHTML = menu
    .map(
      (n, i) =>
        `<div class="nav ${!portal && i === 0 ? 'active' : ''} ${!portal && i === 0 ? 'subnav' : ''}" ${!portal && i === 0 ? req('node.review') : ''} onclick="${portal ? 'navigate(' + i + ')' : i === 0 ? "section='review';render()" : "toast('当前服务暂不可用，请稍后重试')"}"><span>${['◉', '✉', '▧', '▤', '', '▦', '▧', '▣'][i % 8]}</span>${n}${!portal && i === 3 ? '<em>⌄</em>' : ''}</div>`
    )
    .join('');
};
render = function () {
  if (section === 'launch') {
    portalRender();
    return;
  }
  if (section === 'identifier') {
    identifierRender();
    return;
  }
  section = 'review';
  nav();
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 接入登记审核 ×</span></div><div class="registration-page"><div class="inner-page-heading"><div><h1>接入登记审核</h1><p>管理业务节点接入登记与审核进度</p></div></div><section class="panel querypanel" ${req('node.query')}><div class="query-panel-heading">筛选条件</div><div class="querygrid">${['业务节点登记名称', '业务节点标识', '状态', '统一社会信用代码', '所属法人或组织名称', '所属法人身份标识'].map((n, i) => `<label><span>${n}</span>${i === 2 ? '<select id="state"><option>请选择</option><option>待人工审核</option></select>' : `<input id="${i === 0 ? 'search' : 'filter-' + i}" placeholder="请输入">`}</label>`).join('')}</div><div class="queryactions"><button class="btn primary" onclick="drawRows()">⌕ 查询</button><button class="btn" onclick="document.querySelectorAll('.querygrid input').forEach(e=>e.value='');$('#state').selectedIndex=0;drawRows()">↻ 重置</button></div></section><section class="panel listpanel"><div class="list-section-heading"><h2>接入登记列表</h2></div><div class="listtools"><button class="btn" ${req('node.create')} onclick="openForm()">＋ 新增</button><button class="btn" onclick="toast('批量导入服务暂不可用，请稍后重试')">↥ 批量导入</button><button class="btn" onclick="toast('标识样式设置暂不可用，请稍后重试')">⚑ 调整标识样式</button><span style="margin-left:auto;color:#98a5b6">↻　⊞</span></div><table><thead><tr>${['业务节点登记名称', '业务节点标识', '所属法人或其他组织名称', '所属法人身份标识', '统一社会信用代码', '操作'].map((n) => '<th>' + n + '</th>').join('')}</tr></thead><tbody id="rows"></tbody></table><div class="pagination" id="pagination"></div></section></div>`;
  drawRows();
};
const examples = [
  '工业互联网可信数据空间',
  '区域产业数据服务节点',
  '企业数据协同服务平台',
  '医保行业可信数据空间',
  '城市公共数据服务平台',
  '交通物流数据服务节点',
  '重庆区域可信数据空间'
];
drawRows = function () {
  if (!$('#rows')) return;
  const filters = {
    name: $('#search').value.trim(),
    identifier: $('#filter-1').value.trim(),
    state: $('#state').value,
    credit: $('#filter-3').value.trim(),
    org: $('#filter-4').value.trim(),
    legalId: $('#filter-5').value.trim()
  };
  const list = [
    ...rows.map((r, sourceIndex) => ({ ...r, newRecord: true, sourceIndex })),
    ...examples.map((name, i) => ({
      name,
      org: i === 5 ? '交通物流数据运营中心' : i === 4 ? '城市数据运营中心' : '区域数据服务运营中心',
      identifier: [0, 3, 5, 6].includes(i) ? '491370782MAC5R7KD3J5000VLl0T29VF' : '-',
      legalId: '91370782MAC5R7…',
      credit: '91370782MAC5R7…',
      version: 'v1.0.0',
      description: '提供区域数据协同与业务服务。'
    }))
  ].filter(
    (r) =>
      r.name.includes(filters.name) &&
      (r.identifier || '待分配').includes(filters.identifier) &&
      (!filters.state || filters.state === '请选择' || r.newRecord) &&
      (r.credit || '').includes(filters.credit) &&
      r.org.includes(filters.org) &&
      (r.legalId || '').includes(filters.legalId)
  );
  $('#rows').innerHTML = list.length
    ? list
        .map(
          (r, i) =>
            `<tr><td>${esc(r.name)}${r.newRecord ? '<small class="newstate">待人工审核</small>' : ''}</td><td><span class="identifier">${r.newRecord ? '待分配' : r.identifier}</span></td><td>${esc(r.org)}</td><td>${esc(r.legalId || '—')}</td><td>${esc(r.credit || '—')}</td><td>${r.newRecord ? `<span class="status ok">机器审核通过</span><button class="link detail-link" onclick="showDetail(${r.sourceIndex})">查看详情</button>` : `<button class="link" onclick="toast('当前服务暂不可用，请稍后重试')">${i % 3 === 0 ? '♧ 登记更新　♜ 注销　更多⌄' : '⟳ 重新提交　⊙ 详情'}</button>`}</td></tr>`
        )
        .join('')
    : '<tr><td colspan="6" class="empty">暂无匹配记录</td></tr>';
  $('#pagination').innerHTML = `共 ${list.length} 条　　10条/页　　〈 <b>1</b> 〉　 前往　1　页`;
};
let identifierMenuOpen = true;
const identifierRows = [
  { name: '测试日志', code: '69150010933164377245000WA79O41TX', type: '数据产品', status: '正常', stage: '生成', stageStatus: '成功', node: '数据产品注册审批流', scene: '数据产品', uses: 0, created: '2026-11-03 11:23:52' },
  { name: '重庆移动测试', code: '491500000836550152B5000TJ6L1FX28', type: '数据平台', status: '正常', stage: '生成', stageStatus: '成功', node: '业务节点注册审批流', scene: '数据平台', uses: 0, created: '2026-11-03 09:39:37' },
  { name: '何青阳', code: '91500000836550152B', type: '企业', status: '正常', stage: '生成', stageStatus: '成功', node: '身份注册系统', scene: '企业', uses: 0, created: '2026-11-03 09:25:45' },
  { name: '多机构客户收入联合推算（安全多方计算融合开…）', code: '692410185E4J2QX50PK5000WV1TTDMES', type: '数据产品', status: '正常', stage: '生成', stageStatus: '成功', node: '数据产品注册审批流', scene: '数据产品', uses: 0, created: '2026-11-02 16:29:06' },
  { name: '何光秋', code: 'zqbnj3bzn1841q934b', type: '个人', status: '正常', stage: '生成', stageStatus: '成功', node: '身份注册系统', scene: '个人', uses: 0, created: '2026-11-02 11:02:11' },
  { name: '安全多方计算（融合产品）', code: '692410185E4J2QX50PK5000XJBUT15TS', type: '数据产品', status: '正常', stage: '生成', stageStatus: '成功', node: '数据产品注册审批流', scene: '数据产品', uses: 0, created: '2026-10-30 17:26:00' },
  { name: '连接器回归测试产品上架 1029', code: '691500120MA618N3X4C50007146CIN1D', type: '数据产品', status: '正常', stage: '生成', stageStatus: '成功', node: '数据产品注册审批流', scene: '数据产品', uses: 0, created: '2026-10-29 17:22:26' },
  { name: '连接器回归测试资源上架 1029', code: '791500120MA618N3X4C5000NYM8S71EH', type: '数据资源', status: '正常', stage: '生成', stageStatus: '成功', node: '数据资源注册审批流', scene: '数据资源', uses: 0, created: '2026-10-29 17:22:09' },
  { name: '李五', code: '1mi8zwq1tabzb09m8d', type: '个人', status: '正常', stage: '生成', stageStatus: '成功', node: '身份注册系统', scene: '个人', uses: 0, created: '2026-10-29 15:20:26' },
  { name: '回归缺陷6654', code: '6915001000RGM16RFG95000CETEILXVN', type: '数据产品', status: '正常', stage: '生成', stageStatus: '成功', node: '数据产品注册审批流', scene: '数据产品', uses: 0, created: '2026-10-28 14:51:23' },
  { name: '数据资源失效记录', code: '7zqbnj3bzn1841q934b5000l26HKLFOK', type: '数据资源', status: '已停用', stage: '失效', stageStatus: '成功', node: '数据资源注册审批流', scene: '数据资源', uses: 0, created: '2026-11-02 11:17:01' }
];
function identifierOpen() {
  $('#overlay').innerHTML = '';
  document.querySelector('#audit')?.remove();
  section = 'identifier';
  identifierMenuOpen = true;
  identifierRender();
}
function identifierNav() {
  document.querySelector('header b').textContent = '标识管理系统';
  $('#sidebar').innerHTML = `<div class="nav identifier-parent" ${req('identifier.manage', 'identifier.menu.lifecycle')} onclick="identifierMenuOpen=!identifierMenuOpen;identifierNav()"><span>◉</span>生命周期管理<em>${identifierMenuOpen ? '⌃' : '⌄'}</em></div>${identifierMenuOpen ? `<div class="nav subnav active identifier-subnav" ${req('identifier.manage', 'identifier.menu.management')} onclick="identifierRender()">标识管理</div>` : ''}`;
}
function identifierRender() {
  identifierNav();
  $('#main').innerHTML = `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 标识管理</span></div><div class="identifier-page"><div class="inner-page-heading"><div><h1>标识管理</h1><p>生命周期管理 / 标识管理</p></div></div><section class="panel identifier-query-panel" ${req('identifier.manage', 'identifier.query')}><div class="query-panel-heading">查询条件</div><form id="identifier-filters" onsubmit="event.preventDefault();identifierQuery()"><div class="identifier-querygrid"><label ${req('identifier.manage', 'identifier.query.name')}><span>对象名称</span><input id="identifier-name" placeholder="请输入对象名称"></label><label ${req('identifier.manage', 'identifier.query.code')}><span>标识编码</span><input id="identifier-code" placeholder="请输入标识编码"></label><label ${req('identifier.manage', 'identifier.query.type')}><span>标识类型</span><select id="identifier-type"><option value="">请选择标识类型</option>${['数据产品', '数据平台', '数据资源', '企业', '个人'].map((type) => `<option>${type}</option>`).join('')}</select></label><label ${req('identifier.manage', 'identifier.query.stage')}><span>生命周期阶段</span><select id="identifier-stage"><option value="">请选择阶段</option><option>生成</option><option>失效</option></select></label><label ${req('identifier.manage', 'identifier.query.stageStatus')}><span>阶段状态</span><select id="identifier-stage-status"><option value="">请选择状态</option><option>成功</option><option>处理中</option><option>失败</option></select></label><label ${req('identifier.manage', 'identifier.query.node')}><span>操作节点</span><input id="identifier-node" placeholder="请输入操作节点"></label><label class="identifier-date-field" ${req('identifier.manage', 'identifier.query.timeRange')}><span>时间范围</span><div class="identifier-date-range"><input id="identifier-start" type="date" aria-label="开始日期"><span>至</span><input id="identifier-end" type="date" aria-label="结束日期"></div></label></div><div class="queryactions"><button class="btn primary" type="submit">⌕ 查询</button><button class="btn" type="button" onclick="identifierReset()">↻ 重置</button></div></form></section><section class="panel identifier-list-panel" ${req('identifier.manage', 'identifier.list')}><div class="listtools"><button class="btn" onclick="identifierSync()">↻ 同步</button><span class="identifier-list-title">标识列表</span><div class="identifier-list-tools"><button class="link" title="刷新列表" onclick="identifierDrawRows();toast('列表已刷新')">↻</button><button class="link" title="列表字段已合并两张设计图" onclick="toast('当前展示合并后的全部字段')">⊞</button></div></div><div class="identifier-table-scroll"><table><thead><tr>${['对象名称', '标识编码', '标识类型', '状态', '生命周期阶段', '阶段状态', '操作节点', '使用场景', '使用频次', '创建时间', '操作'].map((name) => `<th>${name}</th>`).join('')}</tr></thead><tbody id="identifier-rows"></tbody></table></div><div class="pagination" id="identifier-pagination"></div></section></div>`;
  identifierDrawRows();
}
function identifierFilterValues() {
  return {
    name: $('#identifier-name').value.trim(),
    code: $('#identifier-code').value.trim(),
    type: $('#identifier-type').value,
    stage: $('#identifier-stage').value,
    stageStatus: $('#identifier-stage-status').value,
    node: $('#identifier-node').value.trim(),
    start: $('#identifier-start').value,
    end: $('#identifier-end').value
  };
}
function identifierQuery() {
  const filters = identifierFilterValues();
  if (filters.start && filters.end && filters.start > filters.end) {
    toast('开始日期不能晚于结束日期');
    return;
  }
  const count = identifierDrawRows();
  toast(`查询完成，共 ${count} 条记录`);
}
function identifierReset() {
  $('#identifier-filters').reset();
  identifierDrawRows();
}
function identifierDrawRows() {
  const filters = identifierFilterValues();
  const list = identifierRows.filter((row) =>
    row.name.includes(filters.name) &&
    row.code.toLowerCase().includes(filters.code.toLowerCase()) &&
    (!filters.type || row.type === filters.type) &&
    (!filters.stage || row.stage === filters.stage) &&
    (!filters.stageStatus || row.stageStatus === filters.stageStatus) &&
    row.node.includes(filters.node) &&
    (!filters.start || row.created.slice(0, 10) >= filters.start) &&
    (!filters.end || row.created.slice(0, 10) <= filters.end)
  );
  $('#identifier-rows').innerHTML = list.length
    ? list.map((row) => `<tr><td class="identifier-object-name" title="${esc(row.name)}">${esc(row.name)}</td><td><code class="identifier-code">${esc(row.code)}</code></td><td>${esc(row.type)}</td><td><span class="status ${row.status === '正常' ? 'ok' : 'identifier-disabled'}">${esc(row.status)}</span></td><td><span class="identifier-tag ${row.stage === '失效' ? 'danger' : ''}">${esc(row.stage)}</span></td><td><span class="identifier-tag">${esc(row.stageStatus)}</span></td><td>${esc(row.node)}</td><td>${esc(row.scene)}</td><td class="identifier-number">${row.uses}</td><td class="identifier-time">${esc(row.created)}</td><td class="identifier-actions"><button type="button" class="link">◉ 详情</button><button type="button" class="link">⊘ 停用</button><button type="button" class="link">▥ 轨迹</button><button type="button" class="link">更多 ⌄</button></td></tr>`).join('')
    : '<tr><td colspan="11" class="empty">暂无符合条件的标识记录</td></tr>';
  $('#identifier-pagination').innerHTML = `共 ${list.length} 条　　20条/页　　〈 <b>1</b> 〉`;
  return list.length;
}
function identifierSync() {
  toast('同步完成，标识数据已是最新状态');
}
const baseAudit = showAudit;
showAudit = function (state, { preview = false } = {}) {
  if (state !== 'risk') {
    baseAudit(state);
    return;
  }
  let layer = $('#audit');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'audit';
    layer.className = 'veil';
    document.body.append(layer);
  }
  layer.style.zIndex = 30;
  const demo = preview || auditScenario === 'risk';
  const hits = pending?.findings?.length
    ? pending.findings
    : registrationTextFindings(pending, demo);
  if (pending) pending.findings = hits;
  layer.innerHTML = `<section class="riskdialog" ${req('node.machineAudit')}><div class="riskhead"><span class="riskshield">!</span><div><span class="riskcaption">内容安全审核结果</span><h2>敏感词审核未通过</h2></div><button class="close" onclick="finishAudit('risk')">×</button></div><div class="riskbody"><div class="risknotice">⊗ 本次申请未提交成功，不会进入人工审核队列。已填写的信息和已选材料将保留。请修改后重新提交审核。</div><div class="risksectiontitle"><h3>风险明细 <span>${hits.length} 项</span></h3></div><table class="risktable"><thead><tr><th scope="col">序号</th><th>风险类型</th><th>命中位置</th><th>命中内容 / 证据</th><th>修改建议</th></tr></thead><tbody>${hits.map((r, i) => `<tr><td class="risk-index">${i + 1}</td><td><span class="riskbadge">${esc(r.type)}</span></td><td>${esc(r.label)}</td><td><span class="excerpt">… <mark>命中内容片段</mark> …</span></td><td>${esc(r.suggestion)}</td></tr>`).join('')}</tbody></table></div><footer><button class="btn primary" onclick="locateRisk()">返回修改</button></footer></section>`;
};
function locateRisk() {
  $('#audit')?.remove();
  const field = pending?.findings?.[0]?.field || 'description';
  const e = $('[name="' + field + '"]');
  if (e) {
    e.classList.add('riskfield');
    e.focus();
    e.scrollIntoView({ block: 'center', behavior: 'smooth' });
    e.addEventListener('input', () => e.classList.remove('riskfield'), { once: true });
  }
}
function previewCurrentRisk() {
  if (submitting) return;
  pending = { ...Object.fromEntries(new FormData($('#registration'))), uploads: { ...uploads } };
  setSubmitting(true);
  showAudit('loading');
  clearTimeout(auditTimer);
  auditTimer = setTimeout(() => {
    showAudit('risk', { preview: true });
    setSubmitting(false);
  }, 1600);
}
function previewRisk() {
  openForm();
  fillDemo();
  $('[name=description]').value = '提供区域数据交换服务，登记内容包含需复核的风险表述。';
  auditScenario = 'risk';
  previewCurrentRisk();
}
function downloadRiskReport() {
  const text =
    '内容安全审核结果\n机器审核未通过；申请未提交；未进入人工审核。\n风险位置：业务简介\n风险证据：命中内容片段\n请修改后重新提交。';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  a.download = '机器审核结果.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}
// Render after subsystem overrides; route shortcuts aid review without replacing the iframe.
if (new URLSearchParams(location.search).get('view')) {
  section = new URLSearchParams(location.search).get('view') === 'identifier' ? 'identifier' : 'review';
}
render();
if (new URLSearchParams(location.search).get('view') === 'risk') previewRisk();

if (new URLSearchParams(location.search).get('view') === 'loading') {
  openForm();
  fillDemo();
  showAudit('loading');
}

// Data catalog and query security prototype.
let catalogTab = 'list',
  catalogSelected = 0,
  queryTimes = [],
  catalogLogs = [],
  catalogAlerts = [],
  blockedUntil = 0;
const products = [
  '景区游客大数据报告',
  '春节返乡大数据报告',
  '投资用户分析大数据报告',
  '金融风控定制模型分',
  '商圈客群大数据报告'
];
const industries = [
  '农、林、牧、渔业',
  '采矿业',
  '制造业',
  '电力、热力、燃气及水生产和供应业',
  '建筑业',
  '批发和零售业',
  '交通运输、仓储和邮政业',
  '住宿和餐饮业',
  '信息传输、软件和信息技术服务业',
  '金融业',
  '房地产业',
  '租赁和商务服务业',
  '科学研究和技术服务业',
  '水利、环境和公共设施管理业',
  '居民服务、修理和其他服务业',
  '教育',
  '卫生和社会工作',
  '文化、体育和娱乐业'
];
const productIntro =
  '分析景区游客数量、客源地、到访频次、停留时长及周边流动情况，为景区客流管理、设施配置、营销推广和运营优化提供支持。';
function catalogOpen() {
  document.querySelector('#audit')?.remove();
  $('#overlay').innerHTML = '';
  section = 'catalog';
  catalogTab = 'list';
  catalogRender();
}
function catalogRender() {
  document.querySelector('header b').textContent = '数据目录系统';
  if (['alerts','profile'].includes(catalogTab)) catalogTab='logs';
  $('#sidebar').innerHTML = `<div class="nav ${['list','detail'].includes(catalogTab)?'active':''}" onclick="catalogTab='list';catalogRender()">▦　数据目录</div><div class="nav ${catalogTab==='logs'?'active':''}" onclick="catalogTab='logs';catalogRender()">▤　查询安全管控</div><div class="nav ${catalogTab==='monitor'?'active':''}" ${req('catalog.audit','catalog.monitor.menu')} onclick="catalogTab='monitor';catalogRender()">◈　数据风险监测</div>`;
  $('#main').innerHTML = `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 数据目录管理系统</span></div><div class="catalog ${['logs','monitor'].includes(catalogTab)?'unified-audit':''}"><div class="cat-toolbar"><span>数据目录管理 / ${catalogTab==='detail'?'数据目录详情':catalogTab==='logs'?'查询安全管控':catalogTab==='monitor'?'数据风险监测':'数据目录'}</span></div><div id="catbody"></div></div>`;
  if (catalogTab === 'list') catalogList();
  if (catalogTab === 'detail') catalogDetail();
  if (catalogTab === 'logs') catalogAudit();
  if (catalogTab === 'monitor') monitorRender();
}
function catalogList() {
  $('#catbody').innerHTML =
    `<section class="panel"><div class="cat-filters" ${req('catalog.query')} >${['产品类型', '交互方式', '产品名称', '产品唯一标识', '提供方名称', '敏感等级'].map((n, i) => `<label>${n}${[0, 1, 5].includes(i) ? `<select id="cq${i}"><option value="">请选择</option>${(i === 0 ? ['数据报告', 'API产品'] : i === 1 ? ['文件传输'] : ['公开', '内部', '机密']).map((x) => `<option>${x}</option>`).join('')}</select>` : `<input id="cq${i}" placeholder="请输入">`}</label>`).join('')}<div><button class="btn primary" onclick="catalogQuery()">⌕ 查询</button> <button class="btn" onclick="document.querySelectorAll('.cat-filters input,.cat-filters select').forEach(e=>e.value='');catalogResults()">↻ 重置</button></div></div></section><section class="panel cat-results"><aside><input placeholder="请输入行业分类" oninput="document.querySelectorAll('.industry').forEach(e=>e.hidden=!e.textContent.includes(this.value))">${industries.map((n) => `<div class="industry" onclick="this.parentNode.querySelectorAll('.industry').forEach(e=>e.classList.remove('chosen'));this.classList.add('chosen');catalogQuery()">${n}</div>`).join('')}</aside><div id="cat-results"></div></section>`;
  catalogResults();
}
function catalogResults() {
  const keyword = $('#cq2')?.value || '',
    type = $('#cq0')?.value || '';
  let found = products
    .map((name, i) => ({ name, i }))
    .filter(
      (x) =>
        x.name.includes(keyword) &&
        (!type || type === (x.i === 3 ? 'API产品' : '数据报告')) &&
        (!$('#cq4').value || '中国移动通信集团重庆有限公司'.includes($('#cq4').value)) &&
        (!$('#cq3').value || ('691500000736550152L5000' + x.i).includes($('#cq3').value)) &&
        (!$('#cq5').value || $('#cq5').value === '公开')
    );
  $('#cat-results').innerHTML =
    found
      .map(
        ({ name, i }) =>
          `<article class="cat-product"><button class="link" style="float:right" ${req('catalog.detail')} onclick="catalogSelected=${i};catalogTab='detail';catalogRender()">查看详情</button><h3><span class="status">${i === 3 ? 'API产品' : '数据报告'}</span>　${name}　<span class="status">文件传输</span></h3><p>产品简介：${i === 0 ? productIntro : '围绕行业业务场景，分析客群特征、地域分布及活跃规律，为业务运营提供参考。'}</p><div class="cat-meta"><span>产品唯一标识：691500000736550152L5000${i}9D0G2KDI</span><span>数据资源标识码：[]</span><span>行业分类：信息传输、软件和信息技术服务业</span><span>提供方名称：中国移动通信集团重庆有限公司</span><span>提供方标识：91500000736550152L</span><span>登记完成时间：2026-10-26 16:32:03</span></div></article>`
      )
      .join('') || '<div class="empty">暂无匹配的数据目录</div>';
  return found.length;
}
function catalogQuery(reason) {
  const now=Date.now(), evaluation=auditEvaluate('GOV-1001',now,reason), why=evaluation.why;
  queryTimes=auditWindows.get('GOV-1001').times;
  blockedUntil=evaluation.until;
  let count = why ? 0 : catalogResults();
  const id = 'Q' + now + '-' + catalogLogs.length;
  const record=auditMakeRecord(auditActors[0],'本地查询',now,catalogLogs.length,why,evaluation.frequency);
  record.filter={productType:$('#cq0')?.value||'',delivery:$('#cq1')?.value||'',productName:$('#cq2')?.value||'',productId:$('#cq3')?.value||'',provider:$('#cq4')?.value||'',securityLevel:$('#cq5')?.value||''};
  record.id=id;record.count=count;record.target=$('#cq2')?.value||'全部数据目录';record.resultSummary=why?'策略拒绝，未执行目录查询':'返回公开目录元数据 '+count+' 条';catalogLogs.unshift(record);catalogLogs.sort((a,b)=>b.at.localeCompare(a.at));
  if (why) {
    let event=catalogAlerts.find(a=>a.uid==='GOV-1001'&&a.why===(why.includes('高频')?'高频访问':why)&&a.state==='待研判'); if(event)event.evidenceIds.push(id);else catalogAlerts.unshift({id,uid:'GOV-1001',why:why.includes('高频')?'高频访问':why,time:record.time,state:'待研判',evidenceIds:[id]});
    $('#overlay').innerHTML =
      `<div class="veil"><div class="auditbox"><div class="auditmark" style="color:#d45353">!</div><h2>查询已被安全策略阻断</h2><p>${why.includes('高频') ? '最近连续 60 秒查询 ' + queryTimes.length + ' 次，已达到 50 次风险阈值。请在冷却期结束后重试。' : why === '越权访问' ? '当前身份无权查询该资源，请联系管理员核实权限。' : '一次性令牌已使用，请重新认证后再查询。'}</p><p>请求编号：${id}<br>已记录审计轨迹并生成风险预警，本次未执行数据查询。</p><button class="btn primary" onclick="$('#overlay').innerHTML=''">我知道了</button></div></div>`;
  } else toast('查询完成，返回 ' + count + ' 条目录，已记录审计日志');
}
// All records below are labelled prototype fixtures, never production audit evidence.
const auditActors = [
  {uid:'GOV-1001',name:'政府用户 A',role:'政府用户',org:'政务数据使用单位',ip:'192.0.2.18'},
  {uid:'ENT-2001',name:'企业用户 A',role:'企业用户',org:'企业数据使用单位',ip:'198.51.100.26'},
  {uid:'GOV-1002',name:'政府用户 B',role:'政府用户',org:'文旅数据使用单位',ip:'192.0.2.32'},
  {uid:'ENT-2002',name:'企业用户 B',role:'企业用户',org:'旅游运营单位',ip:'203.0.113.42'}
];
const auditPageSize=10;
let auditSeeded=false, auditPage=1, auditFilters={key:'',mode:'',status:'',riskType:'',judgment:'',day:'2026-11-02'};
const auditWindows=new Map();
function auditEvaluate(uid,now=Date.now(),reason='') {
  const state=auditWindows.get(uid)||{times:[],until:0};
  state.times=state.times.filter(t=>now-t<60000);state.times.push(now);
  let why=state.until>now?'高频访问阻断期':state.times.length>=50?'高频访问':reason==='permission'?'越权访问':reason==='token'?'令牌重放':'';
  if(why==='高频访问')state.until=now+60000;
  auditWindows.set(uid,state);
  return {why,frequency:state.times.length,until:state.until};
}
function auditMakeRecord(actor,mode,at,index,why='',frequency=1){
  const ts=new Date(at),stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(ts);
  return {id:'TR-'+ts.getTime()+'-'+index,at:ts.toISOString(),time:stamp,...actor,user:actor.name+' / '+actor.uid,target:products[0],productId:'691500000736550152L500039D0G2KDI',mode,source:'区域目录节点',destination:mode==='跨域调用'?'外域目录节点':'本地目录节点',count:why?0:1,status:why?'已阻断':'成功',http:why?(why.includes('高频')?429:403):200,why,frequency,token:'jti-masked-'+index,duration:why?8:mode==='跨域调用'?186:42,policy:'RATE-USER-60S-50 / v1',filter:{productName:products[0],provider:'中国移动通信集团重庆有限公司',securityLevel:'公开'},resultSummary:why?'策略拒绝，未执行目录查询':'返回公开目录元数据 1 条；不含产品数据文件',demo:true};
}
function auditSeed(){
  if(auditSeeded)return;auditSeeded=true;
  // A complete >=50 burst: same authenticated enterprise identity across both call modes.
  const burst=Date.parse('2026-11-02T10:24:00+08:00');
  for(let i=0;i<62;i++)catalogLogs.push(auditMakeRecord(auditActors[1],i%2?'跨域调用':'本地查询',burst+i*650,'B'+i,i>=49?(i===49?'高频访问':'高频访问阻断期'):'',i+1));
  for(let i=0;i<96;i++)catalogLogs.push(auditMakeRecord(auditActors[i%4],i%3===0?'跨域调用':'本地查询',Date.parse('2026-11-02T08:00:00+08:00')+i*75000,'N'+i));
  for(let i=0;i<3;i++)catalogLogs.push(auditMakeRecord(auditActors[3],'跨域调用',Date.parse('2026-11-02T10:29:00+08:00')+i*12000,'P'+i,'越权访问',i+1));
  catalogLogs.sort((a,b)=>b.at.localeCompare(a.at));
  for(const actor of [auditActors[1],auditActors[3]]){const records=catalogLogs.filter(r=>r.uid===actor.uid&&r.why);catalogAlerts.push({id:records[0].id,uid:actor.uid,why:actor.uid==='ENT-2001'?'高频访问':'越权访问',time:records[records.length-1].time,state:'待研判',evidenceIds:records.map(r=>r.id),note:''});}
}
let auditRangeDays=1, auditBucket=null, auditEditing=false, auditRefreshAt=Date.now(), auditDetail=null;
function auditRiskType(r){return r.why?.startsWith('高频')?'高频访问':r.why||'';}
function auditJudgment(r){const e=auditEventFor(r);return e?.state==='待研判'?'待研判':e?.state?.startsWith('已关闭')?'已关闭':'';}
function auditDateRange(){
 const day=auditFilters.day||new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const end=Date.parse(day+'T00:00:00+08:00')+86400000;
 return {start:end-auditRangeDays*86400000,end};
}
function auditDateLabel(at){return new Date(at+8*3600000).toISOString().slice(0,16).replace('T',' ');}
function auditBaseLogs(){
  return catalogLogs.filter(r=>!!r.why&&(Date.parse(r.at)>=auditDateRange().start&&Date.parse(r.at)<auditDateRange().end)&&(!auditFilters.key||(r.user+r.org+r.ip+r.id+r.target).toLowerCase().includes(auditFilters.key.toLowerCase()))&&(!auditFilters.mode||r.mode===auditFilters.mode)&&(!auditFilters.status||r.status===auditFilters.status)&&(!auditFilters.riskType||auditRiskType(r)===auditFilters.riskType)&&(!auditFilters.judgment||auditJudgment(r)===auditFilters.judgment)&&(!auditFilters.pending||auditEventFor(r)?.state==='待研判'));
}
function auditEventFor(r){return catalogAlerts.find(a=>(a.evidenceIds||[a.id]).includes(r.id));}
function auditSelected(){return auditBaseLogs().filter(r=>(!auditBucket||(Date.parse(r.at)>=auditBucket.start&&Date.parse(r.at)<auditBucket.end))&&(!auditFilters.riskType||auditRiskType(r)===auditFilters.riskType)&&(!auditFilters.judgment||auditJudgment(r)===auditFilters.judgment)&&(!auditFilters.pending||auditEventFor(r)?.state==='待研判'));}
function auditApply(){if(!$('#logday').value){toast('请选择查询截止日期');return}auditFilters={key:$('#logkey').value.trim(),mode:$('#logmode').value,status:$('#logstatus').value,riskType:$('#logrisk').value,judgment:$('#logjudgment').value,day:$('#logday').value,pending:auditFilters.pending&&$('#logjudgment').value==='待研判'};auditBucket=null;auditPage=1;auditRefreshAt=Date.now();catalogAudit();}
function auditReset(){auditRangeDays=1;auditFilters={key:'',mode:'',status:'',riskType:'',judgment:'',day:'2026-11-02',pending:false};auditBucket=null;auditPage=1;auditRefreshAt=Date.now();catalogAudit();}
function auditRefresh(){auditRefreshAt=Date.now();catalogAudit();}
function auditTogglePending(){auditFilters.pending=!auditFilters.pending;auditFilters.judgment=auditFilters.pending?'待研判':'';auditPage=1;catalogAudit();}
function auditSelectUser(uid){auditFilters.key=uid;auditBucket=null;auditPage=1;catalogTab='logs';catalogRender();}
function auditChooseBucket(start,end){auditBucket=auditBucket?.start===start?null:{start,end};auditPage=1;catalogAudit();}
function auditClock(at){return new Date(at).toLocaleTimeString('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function auditPeriod(){return auditBucket?auditDateLabel(auditBucket.start)+'—'+auditDateLabel(auditBucket.end):'';}
function auditVisibleEvents(logs){const ids=new Set(logs.map(r=>r.id));return catalogAlerts.filter(a=>(a.evidenceIds||[a.id]).some(id=>ids.has(id)));}
function catalogAudit(){
  auditSeed();
  const logs=auditSelected(),bad=logs.filter(r=>r.why),users=new Set(logs.map(r=>r.uid)),cross=logs.filter(r=>r.mode==='跨域调用'),events=auditVisibleEvents(logs),pending=events.filter(a=>a.state==='待研判');
  auditPage=Math.min(auditPage,Math.max(1,Math.ceil(logs.length/auditPageSize)));
  const opts=(values,current)=>'<option value="">全部</option>'+values.map(v=>`<option ${current===v?'selected':''}>${v}</option>`).join('');
  $('#catbody').innerHTML=`<div class="audit-heading unified-heading"><h1>查询安全管控</h1><div class="audit-refresh-tools" ${req('catalog.audit','catalog.audit.refresh')}><span>统计更新：${auditClock(auditRefreshAt)}</span><span class="auto-refresh-label">1 分钟自动刷新</span><button class="btn" onclick="auditRefresh()">↻ 刷新</button></div></div>
  <section class="audit-filters panel" data-req-module="catalog.audit.query" ${req('catalog.audit','catalog.audit.filters')}><label>查询截止日期<input type="date" required id="logday" value="${auditFilters.day}"></label><label class="wide">用户 / IP / 请求编号 / 产品<input id="logkey" value="${esc(auditFilters.key)}" placeholder="请输入关键词" onkeydown="if(event.key==='Enter')auditApply()"></label><label>调用方式<select id="logmode">${opts(['本地查询','跨域调用'],auditFilters.mode)}</select></label><label>返回状态<select id="logstatus">${opts(['成功','已阻断'],auditFilters.status)}</select></label><label ${req('catalog.audit','catalog.audit.riskType')}>风险类型<select id="logrisk">${opts(['高频访问','越权访问','令牌重放'],auditFilters.riskType)}</select></label><label ${req('catalog.audit','catalog.audit.judgment')}>研判状态<select id="logjudgment">${opts(['待研判','已关闭'],auditFilters.judgment)}</select></label><button class="btn primary" onclick="auditApply()">查询</button><button class="btn" onclick="auditReset()">重置</button></section>
  <div class="audit-stats" data-req-module="catalog.audit.statistics" ${req('catalog.audit','catalog.audit.statistics')}>${[['风险查询量',logs.length,'次','仅统计命中风险的查询请求','blue'],['活跃用户',users.size,'人','按认证用户 ID 去重','blue'],['跨域调用',cross.length,'次','占风险查询量 '+(logs.length?(cross.length/logs.length*100).toFixed(1):'0.0')+'%','blue'],['风险事件',events.length,'个','按关联事件编号去重','red']].map(([name,value,unit,note,color])=>`<article><span>${name}</span><strong class="${color}">${value.toLocaleString()}<small> ${unit}</small></strong><p>${note}</p></article>`).join('')}</div>
  <div class="audit-analysis unified-analysis"><section class="panel" data-req-module="catalog.audit.trend" ${req('catalog.audit','catalog.audit.trend')}><div class="audit-section-head"><h3>风险查询趋势 <small>单位：次</small></h3><div class="trend-controls"><span><i class="legend blue-bg"></i>成功 <i class="legend red-bg"></i>已阻断</span><select aria-label="统计时间范围" ${req('catalog.audit','catalog.audit.timeRange')} onchange="auditRangeDays=Number(this.value);auditBucket=null;auditPage=1;auditRefreshAt=Date.now();catalogAudit()">${[[1,'1天'],[7,'一周'],[30,'30天']].map(([days,label])=>`<option value="${days}" ${auditRangeDays===days?'selected':''}>${label}</option>`).join('')}</select></div></div>${auditTrend(auditBaseLogs())}<div class="audit-chart-caption"><span>${auditDateLabel(auditDateRange().start).slice(0,10)}—${auditFilters.day} · ${auditRangeDays===1?'按小时':'按天'}统计，点击时段联动风险与日志</span>${auditBucket?`<button class="link" onclick="auditBucket=null;auditPage=1;catalogAudit()">清除时段 ${auditPeriod()} ×</button>`:''}</div></section>
  <section class="panel audit-risk-panel" data-req-module="catalog.audit.events" ${req('catalog.alert','catalog.alert.events')}><div class="audit-section-head"><h3>关联风险事件 <span class="count-pill">${events.length}</span></h3><button class="link ${auditFilters.pending?'filter-active':''}" onclick="auditTogglePending()">${auditFilters.pending?'查看全部':'仅看待研判'}</button></div><div class="risk-panel-summary"><span class="risk-status-dot"></span><b>${pending.length} 个待研判</b><span>命中即阻断，保留请求证据</span></div><div class="risk-event-list">${events.map(a=>{const r=catalogLogs.find(r=>r.id===a.id);return `<button class="audit-event-row" onclick="auditOpenDetail('${a.id}','risk')"><span class="event-severity">!</span><span><b>${a.why}</b><small>${esc(r.name)} · ${r.uid}</small><small>${a.time} · ${a.evidenceIds?.length||1} 次阻断</small></span><span class="audit-badge ${a.state==='待研判'?'warning':'neutral'}">${a.state==='待研判'?'待研判':'已关闭'}</span><span>›</span></button>`}).join('')||'<div class="empty">当前条件下无风险事件</div>'}</div></section></div>
  <section class="panel audit-log-panel" data-req-module="catalog.audit.records" ${req('catalog.audit','catalog.audit.table')}><div class="audit-section-head"><h3>风险查询日志 <span class="count-pill">${logs.length}</span>${auditFilters.pending?'<small class="active-scope">仅待研判风险</small>':''}${auditBucket?`<small class="active-scope">${auditPeriod()}</small>`:''}</h3><button class="btn" onclick="downloadCatalogLogs()">导出日志</button></div><div class="audit-table-scroll"><table><thead><tr>${['查询时间 / 请求编号','用户身份 / 机构','来源 IP / 调用方式','查询对象','返回结果','风险 / 研判状态','操作'].map(n=>`<th>${n}</th>`).join('')}</tr></thead><tbody>${logs.slice((auditPage-1)*auditPageSize,auditPage*auditPageSize).map(r=>{const event=auditEventFor(r);return `<tr><td>${r.time}<small class="trace-id">${r.id}</small></td><td><button class="link user-profile-link" ${req('catalog.profile','catalog.profile.user')} onclick="auditOpenDetail('${r.id}','profile')">${esc(r.name)}</button> <span class="role-pill">${r.role}</span><small>${esc(r.org)} · ${r.uid}</small></td><td class="ip-cell">${r.ip}<small>${r.mode}</small></td><td>${esc(r.target)}<small>公开 · 目录元数据</small></td><td><span class="audit-badge ${r.why?'danger':'success'}">${r.status}</span><small>HTTP ${r.http} · ${r.count} 条 · ${r.duration} ms</small></td><td><span class="${r.why?'risk-text':'muted'}">${r.why||'正常访问'}</span>${event?`<small>${esc(event.state)}</small>`:''}${r.why.includes('高频')?`<small>60 秒内 ${r.frequency} 次</small>`:''}</td><td><button class="link" onclick="catalogTrace('${r.id}')">审计详情</button>${event?.state==='待研判'?`<button class="link row-risk-action" ${req('catalog.alert','catalog.alert.resolve')} onclick="auditOpenDetail('${r.id}','risk')">研判</button>`:''}</td></tr>`}).join('')||'<tr><td colspan="7" class="empty">暂无匹配日志，请调整查询条件。</td></tr>'}</tbody></table></div><div class="audit-pagination"><span>共 ${logs.length} 条 · 每页 ${auditPageSize} 条</span><div><button class="btn" ${auditPage===1?'disabled':''} onclick="auditPage--;catalogAudit()">上一页</button> ${auditPage} / ${Math.max(1,Math.ceil(logs.length/auditPageSize))} <button class="btn" ${auditPage*auditPageSize>=logs.length?'disabled':''} onclick="auditPage++;catalogAudit()">下一页</button></div></div></section>`;
}
function auditBuckets(logs){
 if(!logs.length)return [];
 const {start,end}=auditDateRange(),width=auditRangeDays===1?3600000:86400000;
 const buckets=Array.from({length:Math.round((end-start)/width)},(_,i)=>({at:start+i*width,end:start+(i+1)*width,good:0,bad:0}));
 for(const r of logs){const index=Math.floor((Date.parse(r.at)-start)/width);if(buckets[index])buckets[index][r.why?'bad':'good']++;}
 return buckets;
}
function auditTrend(logs){
 const buckets=auditBuckets(logs);if(!buckets.length)return '<div class="empty audit-chart-empty">暂无趋势数据</div>';
 const max=Math.max(1,...buckets.map(b=>b.good+b.bad)),step=Math.max(1,Math.ceil(buckets.length/8));
 return `<div class="audit-chart-scroll"><div class="audit-bars" style="min-width:${Math.max(350,buckets.length*22)}px"><span class="axis"><span>${max}</span><span>${Math.round(max/2)}</span><span>0</span></span>${buckets.map((b,i)=>{const label=auditRangeDays===1?auditClock(b.at).slice(0,5):auditDateLabel(b.at).slice(5,10),period=auditDateLabel(b.at)+'—'+auditDateLabel(b.end),selected=auditBucket?.start===b.at;return `<button class="bar-column ${selected?'bucket-selected':''}" aria-label="${period}，成功 ${b.good} 次，阻断 ${b.bad} 次，点击筛选" aria-pressed="${selected}" onclick="auditChooseBucket(${b.at},${b.end})"><span class="chart-tooltip">${period}<br>成功 ${b.good} 次 · 阻断 ${b.bad} 次</span><span class="bar-track"><span class="bar-stack" style="height:${(b.good+b.bad)/max*100}%"><span class="red-bg" style="flex:${b.bad}"></span><span class="blue-bg" style="flex:${b.good}"></span></span></span><small>${i%step===0||i===buckets.length-1?label:''}</small></button>`}).join('')}</div></div>`;
}
function catalogTrace(id){auditOpenDetail(id,'trace');}
function auditShowProfile(uid){const r=auditSelected().find(r=>r.uid===uid)||catalogLogs.find(r=>r.uid===uid);if(r)auditOpenDetail(r.id,'profile');}
function auditOpenDetail(id,tab='trace'){
  const r=catalogLogs.find(r=>r.id===id);if(!r){toast('未找到该请求记录');return}
  auditDetail={id,tab};
  $('#overlay').innerHTML=`<div class="audit-drawer-mask"><section class="auditbox audit-drawer" role="dialog" aria-modal="true" aria-labelledby="audit-drawer-title" data-audit-detail="${tab}" ${req(tab==='profile'?'catalog.profile':tab==='risk'?'catalog.alert':'catalog.audit','catalog.'+(tab==='risk'?'resolve':tab))}><div class="audit-drawer-heading"><div><h2 id="audit-drawer-title">审计详情</h2><p>${r.time} · ${r.id}</p></div><button class="close" aria-label="关闭审计详情" onclick="auditCloseDetail()">×</button></div><div class="audit-drawer-tabs" role="tablist" aria-label="审计详情分类">${[['trace','查询链路'],['risk','关联风险'],['profile','用户画像']].map(([key,name])=>`<button role="tab" aria-selected="${tab===key}" onclick="auditOpenDetail('${r.id}','${key}')">${name}</button>`).join('')}</div><div class="audit-drawer-content">${tab==='profile'?auditProfileContent(r):tab==='risk'?auditRiskContent(r):auditTraceContent(r)}</div><div class="audit-drawer-footer"><button class="btn" onclick="auditCloseDetail()">关闭</button></div></section></div>`;
  document.body.classList.add('audit-drawer-open');
}
function auditCloseDetail(){auditDetail=null;$('#overlay').innerHTML='';document.body.classList.remove('audit-drawer-open');}
function auditTraceContent(r){
  const blocked=!!r.why,tokenFail=r.why==='令牌重放',permissionFail=r.why==='越权访问';
  const stages=[['请求接入','已接收',r.source+' → '+r.destination],['身份认证与令牌校验',tokenFail?'拒绝':'通过',r.uid+' · '+r.role+'；令牌标识 '+r.token],['访问权限判定',tokenFail?'未执行':permissionFail?'拒绝':'通过',tokenFail?'上游拒绝，跳过':permissionFail?'资源授权范围不匹配':'公开目录元数据读取权限通过 / ABAC v1'],['行为与频率检测',tokenFail||permissionFail?'未执行':blocked?'已阻断':'通过',tokenFail||permissionFail?'权限或认证拒绝，跳过':'同一用户滚动 60 秒 '+r.frequency+' 次；阈值 ≥ 50 / RATE-USER-60S-50 v1'],['目录查询 / 跨域转发',blocked?'未执行':'已完成',blocked?'访问策略拒绝，未向目录节点发起查询':r.source+' → '+r.destination],['响应与审计记录','已记录','HTTP '+r.http+' · '+r.count+' 条 · '+r.duration+' ms；'+r.resultSummary]];
  return `<div class="trace-summary"><span>访问用户<b>${esc(r.name)} / ${r.uid}</b></span><span>来源 IP<b>${r.ip}</b></span><span>查询对象<b>${esc(r.target)}</b></span><span>调用方式<b>${r.mode}</b></span></div><h3 class="drawer-section-title">全链路轨迹</h3><ol class="trace audit-timeline">${stages.map(([name,status,note])=>`<li><b>${name}</b><span class="audit-badge ${status==='拒绝'||status==='已阻断'?'danger':status==='未执行'?'neutral':'success'}">${status}</span><p>${esc(note)}</p></li>`).join('')}</ol><details class="audit-parameters"><summary>查询参数与返回摘要</summary><pre>${esc(JSON.stringify({traceId:r.id,productId:r.productId,query:r.filter,response:{status:r.http,returnedCount:r.count,summary:r.resultSummary}},null,2))}</pre></details>`;
}
function auditRiskContent(r){
  const a=auditEventFor(r);if(!a)return '<div class="empty">本次查询未命中风险规则。</div>';
  const records=catalogLogs.filter(r=>(a.evidenceIds||[a.id]).includes(r.id)),i=catalogAlerts.indexOf(a);
  return `<div class="risk-detail-title"><h3>${a.why}</h3><span class="audit-badge ${a.state==='待研判'?'warning':'neutral'}">${esc(a.state)}</span></div><div class="trace-summary"><span>风险主体<b>${esc(r.name)} / ${r.uid}</b></span><span>首次触发<b>${a.time}</b></span><span>检测依据<b>${a.why.includes('高频')?'连续 60 秒达到 50 次':'查询对象不在授权范围'}</b></span><span>系统动作<b>自动阻断 · 返回 0 条</b></span></div><p class="drawer-rule-note">${a.why.includes('高频')?'本地查询与跨域调用按认证用户合并计数，第 50 次起阻断。':'访问控制策略拒绝请求，未执行下游查询。'}</p><h3 class="drawer-section-title">关联请求 <span class="count-pill">${records.length}</span></h3><div class="risk-evidence-list">${records.map(x=>`<button onclick="auditOpenDetail('${x.id}','trace')"><span>${x.time}<small>${x.id}</small></span><span class="audit-badge danger">HTTP ${x.http}</span><span>查看链路 ›</span></button>`).join('')}</div><h3 class="drawer-section-title">风险研判</h3>${a.state==='待研判'?`<form class="audit-resolution-form" ${req('catalog.alert','catalog.alert.resolutionForm')} onsubmit="event.preventDefault();auditResolve(${i})"><label>研判结论 <span class="required">*</span><select id="resolution"><option>确认风险</option><option>业务正常</option><option>规则误报</option></select></label><label>研判依据 <span class="required">*</span><textarea id="resolutionNote" required maxlength="500" placeholder="请填写研判依据，最多 500 字"></textarea></label><p>研判结论仅关闭本事件，不解除访问控制策略。</p><button class="btn primary" type="submit">保存研判</button></form>`:`<div class="resolution-result"><p>研判结论：${esc(a.state.replace('已关闭 / ',''))}</p><p>研判依据：${esc(a.note)}</p><p>处理人：${esc(a.resolvedBy||'安全分析员')}</p><p>处理时间：${a.resolvedAt||'—'}</p></div>`}`;
}
function auditResolve(i){
  const note=$('#resolutionNote')?.value.trim();if(!note){toast('请填写研判依据');return}if(note.length>500){toast('研判依据最多 500 字');return}
  const id=auditDetail.id;
  Object.assign(catalogAlerts[i],{state:'已关闭 / '+$('#resolution').value,note,resolvedAt:new Date().toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}),resolvedBy:'安全分析员'});
  const y=window.scrollY;catalogAudit();window.scrollTo(0,y);auditOpenDetail(id,'risk');toast('研判已保存');
}
function auditProfileContent(r){
  const logs=auditSelected().filter(x=>x.uid===r.uid),bad=logs.filter(x=>x.why),peak=Math.max(0,...logs.map(x=>x.frequency)),events=auditVisibleEvents(logs),pending=events.filter(a=>a.state==='待研判').length;
  return `<div class="audit-profile-head"><span class="avatar">${r.role==='政府用户'?'政':'企'}</span><div><h2>${esc(r.name)}</h2><p ${req('catalog.profile','catalog.profile.identity')}><span ${req('catalog.profile','catalog.profile.uid')}>${r.uid}</span> · <span ${req('catalog.profile','catalog.profile.role')}>${r.role}</span> · <span ${req('catalog.profile','catalog.profile.organization')}>${esc(r.org)}</span></p></div><span class="audit-badge ${bad.length?'danger':'success'}">${bad.length?'命中风险规则':'未命中风险规则'}</span></div><div class="audit-stats drawer-profile-stats">${[['查询总量',logs.length],['阻断请求',bad.length],['60S请求总数',peak],['来源 IP',new Set(logs.map(r=>r.ip)).size]].map(([name,value])=>`<article><span>${name}</span><strong>${value}</strong></article>`).join('')}</div><p class="drawer-rule-note">统计范围：当前查询条件${auditBucket?' · '+auditPeriod():''}；最近访问：${logs[0]?.time||'—'}</p><h3 class="drawer-section-title">风险标签与证据</h3><div class="profile-tags">${['高频访问','越权访问','令牌重放'].map(n=>`<span class="audit-badge ${bad.some(x=>x.why.includes(n))?'danger':'neutral'}">${n} ${bad.filter(x=>x.why.includes(n)).length} 次</span>`).join('')}</div><div class="profile-columns"><div><h3>访问特征</h3><p>本地查询：${logs.filter(x=>x.mode==='本地查询').length} 次</p><p>跨域调用：${logs.filter(x=>x.mode==='跨域调用').length} 次</p><p>异常率：${logs.length?(bad.length/logs.length*100).toFixed(1):'0.0'}%</p></div><div><h3>访问范围</h3><p>查询对象：${[...new Set(logs.map(x=>x.target))].map(esc).join('、')||'—'}</p><p>来源 IP：${[...new Set(logs.map(x=>x.ip))].join('、')||'—'}</p><p>待研判风险：${pending} 个</p></div></div><h3 class="drawer-section-title">关联风险事件</h3>${events.map(a=>`<button class="profile-risk-entry" onclick="auditOpenDetail('${a.id}','risk')"><span>${a.why} · ${a.time}</span><span>${a.state==='待研判'?'待研判':'已关闭'} ›</span></button>`).join('')||'<p class="muted">当前范围内无关联风险事件。</p>'}<p class="drawer-rule-note">风险标签依据规则命中记录生成，需结合业务背景进行研判。</p>`;
}
function downloadCatalogLogs(){const logs=auditSelected(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({dataSource:'prototype-fixtures',exportedAt:new Date().toISOString(),filters:{...auditFilters,rangeDays:auditRangeDays,dateRange:auditDateRange(),timeRange:auditBucket},logs,alerts:auditVisibleEvents(logs)},null,2)],{type:'application/json'}));a.download='查询安全管控.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('已导出当前查询范围的日志及风险记录');}
window.addEventListener('message',e=>{
 const origins=window.AIPrototypeInspectorConfig?.allowedParentOrigins||[];
 if(e.source===window.parent&&origins.includes(e.origin)&&e.data?.namespace==='ai-prototype-studio'&&e.data.version===1&&e.data.type==='SET_MODE')auditEditing=e.data.payload?.mode==='edit';
});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&auditDetail){event.preventDefault();auditCloseDetail();}});
setInterval(()=>{
 if(auditEditing||document.hidden||section!=='catalog'||catalogTab!=='logs'||auditDetail||document.activeElement?.matches('input:not([type=checkbox]),select,textarea'))return;
 const y=window.scrollY;auditRefresh();window.scrollTo(0,y);
},60000);


// Risk monitoring fixtures: login failures and large metadata exports.
const monitorRules=[
 {id:'LOGIN-FAIL-01',name:'频繁登录失败',type:'登录失败',window:'5分钟',threshold:5,unit:'次',action:'预警并人工核查',basis:'同一账号连续5分钟内登录失败次数达到5次触发预警；成功登录不计入。'},
 {id:'DATA-EXPORT-01',name:'大规模数据导出',type:'数据导出',window:'10分钟',threshold:1000,unit:'条',action:'预警并暂停后续导出',basis:'同一用户连续10分钟实际成功导出的目录元数据条数累计达到1,000条触发；失败任务不计入。'}
];
let monitorFilters={day:'2026-11-03',key:'',type:'',state:''},monitorPage=1,monitorDetail=null,monitorTab='log',monitorUpdated=Date.now();
const monitorLogs=[];
const monitorEvents=[];
function monitorSeed(){
 if(monitorLogs.length)return;
 const cases=[
  {rule:0,time:'11:32:18',count:1,observed:6,change:'11:28:00—11:32:18，同一账号连续6次登录失败；本次为第6次。',approval:'不适用',state:'待研判'},
  {rule:1,time:'11:25:06',count:600,observed:1200,change:'本次实际导出600条；窗口内前次导出600条',approval:'SP-20261103-206',state:'待研判'},
  {rule:0,time:'10:48:32',count:1,observed:8,change:'10:44:00—10:48:32，同一账号累计8次登录失败；本次为第8次。',approval:'不适用',state:'处理中'},
  {rule:1,time:'09:42:20',count:800,observed:1600,change:'本次实际导出800条；窗口内前次导出800条',approval:'SP-20261103-205',state:'已关闭'}
 ];
 cases.forEach((c,i)=>{
  const rule=monitorRules[c.rule],actor=auditActors[(i+1)%4],id='DR-20261103-00'+(i+1),log={id:'DL-RISK-00'+(i+1),time:'2026-11-03 '+c.time,uid:actor.uid,user:actor.name,org:actor.org,ip:actor.ip,type:rule.type,target:c.rule===0?'门户账号登录':products[i%products.length],catalogId:c.rule===0?'—':'CAT-'+(1001+i),count:c.count,result:c.rule===0?'失败':'成功',change:c.change,approval:c.approval,eventId:id};
  const history=[{time:log.time,action:'规则命中并生成预警',note:rule.basis},{time:log.time,action:'站内消息已送达',note:'接收人：安全管理人员'}];
  if(c.state!=='待研判')history.push({time:log.time,action:'确认风险，开始处置',note:'安全管理员：已核查风险证据并确认处置范围。'});
  if(c.state==='已关闭')history.push({time:'2026-11-03 10:05:00',action:'完成处置，等待验证',note:'安全管理员：已核查导出范围并完成异常导出排查。'},{time:'2026-11-03 10:10:00',action:'验证通过并关闭',note:'安全管理员：复核后续导出已恢复合规，未发现持续异常导出。'});
  monitorLogs.push(log);monitorEvents.push({id,logId:log.id,rule:rule.id,name:rule.name,observed:c.observed,state:c.state,owner:c.state==='待研判'?'未认领':'安全管理员',notification:'站内消息已送达',history});
 });
 monitorLogs.sort((a,b)=>b.time.localeCompare(a.time));
}
function monitorBase(){return monitorLogs.filter(r=>!!monitorEvent(r)&&(!monitorFilters.day||r.time.startsWith(monitorFilters.day))&&(!monitorFilters.key||(r.id+r.user+r.uid+r.org+r.ip+r.target+r.catalogId).toLowerCase().includes(monitorFilters.key.toLowerCase()))&&(!monitorFilters.type||monitorEvent(r)?.name===monitorFilters.type)&&(!monitorFilters.state||monitorEvent(r)?.state===monitorFilters.state));}
function monitorEvent(r){return monitorEvents.find(e=>e.id===r.eventId);}
function monitorSelected(){return monitorBase();}
function monitorVisibleEvents(logs){return monitorEvents.filter(e=>logs.some(r=>r.eventId===e.id));}
function monitorApply(){monitorFilters={day:$('#m-day').value,key:$('#m-key').value.trim(),type:$('#m-type').value,state:$('#m-state').value};monitorPage=1;monitorRender();}
function monitorReset(){monitorFilters={day:'2026-11-03',key:'',type:'',state:''};monitorPage=1;monitorRender();}
function monitorRender(){
 monitorSeed();monitorUpdated=Date.now();
 const logs=monitorSelected(),events=monitorVisibleEvents(logs);
 monitorPage=Math.min(monitorPage,Math.max(1,Math.ceil(logs.length/10)));
 const opts=(items,value)=>'<option value="">全部</option>'+items.map(v=>`<option ${v===value?'selected':''}>${v}</option>`).join('');
 const metrics=[
  ['待研判风险',events.filter(e=>e.state==='待研判').length,'待研判事件','review'],
  ['处理中风险',events.filter(e=>e.state==='处理中').length,'正在执行处置的事件','handling'],
  ['待验证风险',events.filter(e=>e.state==='待验证').length,'已处置，等待验证','verification'],
  ['已关闭风险',events.filter(e=>e.state==='已关闭').length,'含验证通过及研判排除','closed']
 ];
 $('#catbody').innerHTML=`<div class="audit-heading unified-heading"><div><h1>数据风险监测</h1><p class="monitor-subtitle">频繁登录失败与大规模数据导出的风险识别和处置</p></div><div class="monitor-tools"><span>更新于 ${auditClock(monitorUpdated)}</span><button class="btn" ${req('catalog.audit','catalog.monitor.refresh')} onclick="monitorRender()">↻ 刷新</button></div></div>
 <section class="panel monitor-filters" data-req-module="catalog.monitor.query" ${req('catalog.audit','catalog.monitor.filters')}><label>发现日期<input type="date" id="m-day" value="${monitorFilters.day}"></label><label class="wide">用户 / 对象 / 日志编号<input id="m-key" maxlength="100" placeholder="请输入关键词" value="${esc(monitorFilters.key)}" onkeydown="if(event.key==='Enter')monitorApply()"></label><label>风险类型<select id="m-type">${opts(monitorRules.map(r=>r.name),monitorFilters.type)}</select></label><label>处置状态<select id="m-state">${opts(['待研判','处理中','待验证','已关闭'],monitorFilters.state)}</select></label><button class="btn primary" onclick="monitorApply()">查询</button><button class="btn" onclick="monitorReset()">重置</button></section>
 <div class="audit-stats monitor-stats" data-req-module="catalog.monitor.statistics" ${req('catalog.audit','catalog.monitor.statistics')}>${metrics.map(([name,value,note,key])=>`<article ${req('catalog.audit','catalog.monitor.'+key)}><span>${name}</span><strong class="${key==='closed'?'blue':'red'}">${value}<small> 个</small></strong><p>${note}</p></article>`).join('')}</div>
 <section class="panel audit-log-panel" data-req-module="catalog.monitor.records" ${req('catalog.audit','catalog.monitor.table')}><div class="audit-section-head"><div><h3>数据风险监测情况 <span class="count-pill">${logs.length}</span></h3><p class="monitor-table-note">保留命中风险及处置后的记录 · 点击风险类型展开判定逻辑</p></div><button class="btn" ${req('catalog.audit','catalog.monitor.export')} onclick="monitorExport()">导出记录</button></div><div class="audit-table-scroll"><table><thead><tr>${['发现时间 / 日志编号','操作人 / 机构','操作对象','操作类型 / 结果','风险类型','处置状态','操作'].map(n=>`<th>${n}</th>`).join('')}</tr></thead><tbody>${logs.slice((monitorPage-1)*10,monitorPage*10).map(r=>{const e=monitorEvent(r),rule=monitorRules.find(x=>x.id===e.rule);return `<tr><td>${r.time}<small class="trace-id">${r.id}</small></td><td>${esc(r.user)}<small>${esc(r.org)} · ${r.uid}</small></td><td>${esc(r.target)}<small>${r.type==='登录失败'?'门户登录':r.catalogId+' · 目录元数据'}</small></td><td>${r.type}<small>${r.result} · ${r.count} ${r.type==='登录失败'?'次':'条'}</small></td><td class="monitor-type-cell" ${req('catalog.alert','catalog.monitor.type')}><details class="monitor-type-rule"><summary>${e.name}</summary><div><p>${rule.basis}</p><p>响应：${rule.action}。</p><p>本事件命中：${e.observed} ${rule.unit} / 阈值 ≥${rule.threshold} ${rule.unit}。</p></div></details><small>${e.id}</small></td><td><span class="audit-badge ${e.state==='已关闭'?'neutral':'warning'}">${e.state}</span><small>${esc(e.owner)}</small></td><td><button class="link" onclick="monitorOpen('${r.id}','log')">日志详情</button><button class="link row-risk-action" ${req('catalog.alert','catalog.monitor.handle')} onclick="monitorOpen('${r.id}','response')">${e.state==='已关闭'?'处置记录':'风险处置'}</button></td></tr>`}).join('')||'<tr><td colspan="7" class="empty">暂无匹配风险记录，请调整筛选条件。</td></tr>'}</tbody></table></div><div class="audit-pagination"><span>共 ${logs.length} 条 · 每页10条</span><div><button class="btn" ${monitorPage===1?'disabled':''} onclick="monitorPage--;monitorRender()">上一页</button> ${monitorPage} / ${Math.max(1,Math.ceil(logs.length/10))} <button class="btn" ${monitorPage*10>=logs.length?'disabled':''} onclick="monitorPage++;monitorRender()">下一页</button></div></div></section><p class="monitor-footnote">示例数据 · 统计按当前筛选范围内事件编号去重，每分钟刷新；处置后保留风险与处置记录。</p>`;
}
function monitorClose(){monitorDetail=null;$('#overlay').innerHTML='';document.body.classList.remove('audit-drawer-open');}
function monitorOpen(id,tab='log'){
 const r=monitorLogs.find(r=>r.id===id);if(!r)return;monitorDetail=id;monitorTab=tab;
 const e=monitorEvent(r),rule=e?monitorRules.find(x=>x.id===e.rule):null;
 let content='';
 if(tab==='log')content=`<div class="trace-summary"><span>操作人<b>${esc(r.user)} / ${r.uid}</b></span><span>所属机构<b>${esc(r.org)}</b></span><span>来源IP<b>${r.ip}</b></span><span>操作类型<b>${r.type} · ${r.result}</b></span><span>操作对象<b>${esc(r.target)}</b></span><span>操作规模<b>${r.count} ${r.type==='登录失败'?'次':'条'}</b></span></div><h3 class="drawer-section-title">操作记录</h3><div class="monitor-evidence">${r.type==='登录失败'?`<p>登录账号：${r.uid}</p>`:`<p>目录标识：${r.catalogId}</p><p>审批关联：${r.approval}</p>`}<p>操作摘要：${esc(r.change==='—'?'读取或导出目录元数据，不涉及实际业务数据文件。':r.change)}</p><p>执行时间：${r.time}</p></div>`;
 if(tab==='risk')content=e?`<div class="risk-detail-title"><h3>${e.name}</h3></div><div class="trace-summary"><span>事件编号<b>${e.id}</b></span><span>处置状态<b>${e.state}</b></span><span>命中值 / 阈值<b>${e.observed} / ≥${rule.threshold} ${rule.unit}</b></span><span>统计窗口<b>${rule.window}</b></span></div><h3 class="drawer-section-title">检测依据</h3><p class="drawer-rule-note">${rule.basis}</p><p>规则：${rule.id} / v1</p><p>系统响应：${rule.action}${rule.type==='数据导出'?'；已完成的导出无法由暂停操作撤回。':''}</p><h3 class="drawer-section-title">证据与通知</h3><button class="btn" onclick="monitorOpen('${id}','log')">查看触发日志 ${id}</button>${rule.type==='数据导出'?`<p class="drawer-rule-note">${esc(r.change)}；10分钟内累计${e.observed.toLocaleString()}条。</p>`:''}${rule.type==='登录失败'?`<p class="drawer-rule-note">${esc(r.change)}</p>`:''}<p>${e.notification} · 接收人：安全管理人员</p><p class="muted">发送结果与人工认领分别记录。</p>`:'<div class="empty">本次操作未命中风险规则。</div>';
 if(tab==='response')content=e?monitorResponse(e):'<div class="empty">本次操作无关联风险，无需处置。</div>';
 $('#overlay').innerHTML=`<div class="audit-drawer-mask"><section class="monitor-drawer audit-drawer" role="dialog" aria-modal="true" aria-labelledby="monitor-detail-title" data-req-surface="catalog.monitor.detail" data-req-title="数据操作审计详情" data-req-page="monitor" data-req-layer="dialog" ${req(tab==='log'?'catalog.audit':'catalog.alert','catalog.monitor.'+tab)}><div class="audit-drawer-heading"><div><h2 id="monitor-detail-title">数据操作审计详情</h2><p>${r.time} · ${r.id}</p></div><button class="close" aria-label="关闭详情" onclick="monitorClose()">×</button></div><div class="audit-drawer-tabs" role="tablist" aria-label="数据操作审计分类">${[['log','操作日志'],['risk','风险详情'],['response','风险处置']].map(([k,n])=>`<button role="tab" aria-selected="${tab===k}" ${req(k==='log'?'catalog.audit':'catalog.alert','catalog.monitor.tab.'+k)} onclick="monitorOpen('${id}','${k}')">${n}</button>`).join('')}</div><div class="audit-drawer-content">${content}</div><div class="audit-drawer-footer"><button class="btn" onclick="monitorClose()">关闭</button></div></section></div>`;
 document.body.classList.add('audit-drawer-open');
}
function monitorResponse(e){
 const actions=e.state==='待研判'?['确认风险并认领','业务正常，关闭','规则误报，关闭']:e.state==='处理中'?['完成处置，提交验证']:e.state==='待验证'?['验证通过，关闭事件','验证未通过，退回处理']:[];
 return `<div class="trace-summary"><span>当前状态<b>${e.state}</b></span><span>负责人<b>${esc(e.owner)}</b></span></div><h3 class="drawer-section-title">处置时间线</h3><ol class="trace audit-timeline">${e.history.map(h=>`<li><b>${esc(h.action)}</b><small>${h.time}</small><p>${esc(h.note)}</p></li>`).join('')}</ol>${actions.length?`<h3 class="drawer-section-title">${e.state==='待研判'?'风险研判':e.state==='处理中'?'应急处置':'恢复验证'}</h3><form class="audit-resolution-form" ${req('catalog.alert','catalog.monitor.responseForm')} onsubmit="event.preventDefault();monitorAdvance()"><label>处理结论 <span class="required">*</span><select id="m-action">${actions.map(a=>`<option>${a}</option>`).join('')}</select></label><label>${e.state==='待研判'?'研判依据':e.state==='处理中'?'处置措施与执行结果':'恢复验证依据'} <span class="required">*</span><textarea id="m-note" required maxlength="1000" placeholder="请填写核查证据、执行措施或验证结果，1～1,000字"></textarea></label><p class="drawer-rule-note">${e.state==='处理中'?'先完成实际业务处置，再记录执行结果；本原型不执行账号冻结、权限撤销或目录回滚。':e.state==='待验证'?'核查登录异常或导出限制的恢复情况。关闭事件不自动解除限制。':'业务正常或规则误报须填写依据；确认风险后进入处理中。'}</p><button type="submit" class="btn primary">保存${e.state==='待研判'?'研判':e.state==='处理中'?'处置':'验证'}结果</button></form>`:'<div class="resolution-result">本事件已关闭，保留完整处置记录。事件关闭不自动解除任何业务限制。</div>'}`;
}
function monitorAdvance(){
 if(auditEditing)return;
 const e=monitorEvent(monitorLogs.find(r=>r.id===monitorDetail));if(!e||e.state==='已关闭')return;
 const note=$('#m-note')?.value.trim(),action=$('#m-action')?.value;if(!note||note.length>1000){toast('请填写1～1,000字的处理依据');return}
 if(e.state==='待研判'){e.state=action==='确认风险并认领'?'处理中':'已关闭';}else if(e.state==='处理中')e.state='待验证';else e.state=action==='验证通过，关闭事件'?'已关闭':'处理中';
 e.owner='安全管理员';e.history.push({time:new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'}),action,note:'安全管理员：'+note});
 const id=monitorDetail;monitorRender();monitorOpen(id,'response');toast('处理结果已保存至本次演示会话');
}
function monitorExport(){
 const logs=monitorSelected(),events=monitorVisibleEvents(logs),a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({dataSource:'prototype-fixtures',scope:'频繁登录失败与大规模数据导出风险及处置记录',exportedAt:new Date().toISOString(),filters:monitorFilters,logs,events},null,2)],{type:'application/json'}));a.href=url;a.download='数据风险监测情况.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出当前范围日志、关联风险与处置记录');
}
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&monitorDetail){event.preventDefault();monitorClose();}});
setInterval(()=>{if(section==='catalog'&&catalogTab==='monitor'&&!auditEditing&&!document.hidden&&!monitorDetail&&!document.activeElement?.matches('input,select,textarea'))monitorRender();},60000);

function catalogDetail() {
  let entries = [
    ['产品名称', products[catalogSelected]],
    ['产品类型', catalogSelected === 3 ? 'API产品' : '数据报告'],
    ['覆盖时间范围', '2026-01-01至2026-10-02'],
    ['行业分类', '信息传输、软件和信息技术服务业'],
    ['地域分类', '-'],
    ['是否涉及个人信息', '否'],
    ['产品简介', productIntro],
    ['交付方式', '文件传输'],
    ['使用限制', '仅限授权用户使用，严禁转售、泄露或用于身份识别，违者承担法律责任'],
    ['授权使用', '是'],
    ['数据主体', '企业数据'],
    ['数据规模', '10 MB'],
    ['更新频率', '5 其他'],
    ['产品唯一标识', '691500000736550152L500039D0G2KDI'],
    ['数据资源标识码', '[]'],
    ['其他', '-'],
    ['提供方名称', '中国移动通信集团重庆有限公司'],
    ['提供主体类型', '法人'],
    ['主体信息 JSON 字串', '-'],
    ['身份标识', '91500000736550152L'],
    ['提供方简介', '重庆移动公司成立于2002年，提供通信与数智服务，支持数据流通和公共服务场景。'],
    ['法人经办人姓名', '-'],
    ['法人经办人电话', '-'],
    ['法人经办人身份证', '-'],
    ['授权委托书', '-'],
    ['授权委托书名称', '-'],
    ['数据样例', '-'],
    ['数据样例（文件形式）名称', '-'],
    ['合法合规声明', '重庆移动数据产品合法合规声明.pdf'],
    ['合法合规声明（文件形式）名称', '重庆移动数据产品合法合规声明.pdf'],
    ['数据来源声明', '重庆移动数据产品说明.pdf'],
    ['数据来源声明（文件形式）名称', '重庆移动数据产品说明.pdf'],
    ['安全分级分类', '-'],
    ['安全分级分类（文件形式）名称', '-'],
    ['数据质量、产品价值评估报告', '-'],
    ['数据质量、产品价值评估报告（文件形式）名称', '-']
  ];
  $('#catbody').innerHTML =
    `<section class="panel" ${req('catalog.detail')}><h2 class="cat-title">基本信息</h2><div class="cat-detail">${entries.map(([k, v]) => `<div><span>${k}</span> ${esc(v)}</div>`).join('')}</div><p style="text-align:center"><button class="btn" onclick="catalogTab='list';catalogRender()">返回</button></p></section>`;
}

if (['catalog','audit','monitor'].includes(new URLSearchParams(location.search).get('view'))) { catalogOpen(); if(new URLSearchParams(location.search).get('view')==='audit'){catalogTab='logs';catalogRender();} if(new URLSearchParams(location.search).get('view')==='monitor'){catalogTab='monitor';catalogRender();} }

// Business surfaces describe the current view to the independent Studio Inspector.
// This projection adds semantic anchors only; it does not change navigation or form state.
(function () {
  let queued = false;
  const attribute = (el, name, value) => {
    if (el && el.getAttribute(name) !== value) el.setAttribute(name, value);
  };
  const anchor = (el, id, elementId = id) => {
    attribute(el, 'data-req-id', id);
    attribute(el, 'data-req-element', elementId);
  };
  const surface = (el, pageId, surfaceId, title, dialog = false) => {
    attribute(el, 'data-req-page', pageId);
    attribute(el, 'data-req-surface', surfaceId);
    attribute(el, 'data-req-title', title);
    if (dialog) attribute(el, 'data-req-layer', 'dialog');
  };
  function sync() {
    queued = false;
    if(section==='identity'){surface($('#main'),identityPage(),identityPage().replaceAll('-','.'),(identityQueue==='pending'?'待我审批':'我已审批')+' · '+identityKinds[identityKind]);const auditDialog=$('#overlay .identity-audit-dialog');if(auditDialog)surface(auditDialog,identityPage(),auditDialog.dataset.reqSurface,auditDialog.dataset.reqTitle,true);return;}
    if(section==='intelligent'){surface($('#main'),'intelligent-'+aiTab,'intelligent.'+aiTab,aiPages[aiKeys.indexOf(aiTab)]);const modal=$('#overlay .ai-modal');if(modal)surface(modal,'intelligent-'+aiTab,'intelligent.'+aiTab+'.dialog',modal.getAttribute('aria-label'),true);return;}
    const main = $('#main'),
      catalog = section === 'catalog',
      identifier = section === 'identifier';
    const titles = {
      monitor: '数据风险监测',
      list: '数据目录',
      detail: '数据目录详情',
      logs: '查询安全管控',
      alerts: '风险识别与预警',
      profile: '风险行为画像'
    };
    surface(
      main,
      identifier ? 'identifier' : catalog ? 'catalog' : 'home',
      identifier ? 'identifier.manage' : catalog ? 'catalog.' + catalogTab : section === 'launch' ? 'portal' : 'registration.list',
      identifier ? '标识管理' : catalog ? titles[catalogTab] : section === 'launch' ? '快捷入口' : '接入登记审核'
    );
    document
      .querySelectorAll('header,#sidebar,.systemtabs,.cat-toolbar')
      .forEach((el) => attribute(el, 'data-req-context-ignore', ''));
    if (!catalog && !identifier) anchor($('.registration-page'), 'node.review');
    if (identifier) anchor($('.identifier-page'), 'identifier.manage');
    if (catalog && catalogTab === 'list') anchor($('.cat-results'), 'catalog.browse');
    document
      .querySelectorAll('.querygrid>label')
      .forEach((el, i) =>
        anchor(
          el,
          'node.query',
          'node.query.' + ['name', 'identifier', 'state', 'credit', 'organization', 'legalId'][i]
        )
      );
    document
      .querySelectorAll('.cat-filters>label')
      .forEach((el, i) =>
        anchor(
          el,
          'catalog.query',
          'catalog.query.' +
            ['productType', 'delivery', 'name', 'identifier', 'provider', 'securityLevel'][i]
        )
      );
    anchor($('#logkey'), 'catalog.audit', 'catalog.audit.keyword');
    anchor($('#logstatus'), 'catalog.audit', 'catalog.audit.status');
    const modal = $('#overlay .modal');
    if (modal) {
      surface(modal, 'home', 'registration.create', '新增接入注册', true);
      anchor(modal, 'node.create');
      anchor(modal.querySelector('.notice'), 'node.machineAudit', 'node.machineAudit.notice');
      ['core', 'license', 'identity', 'promise'].forEach((key) =>
        anchor($('#file-' + key)?.previousElementSibling, 'node.material', 'node.material.' + key)
      );
      anchor($('#file-core')?.closest('.field'), 'node.material', 'node.material.coreGroup');
      anchor(
        $('#file-license')?.closest('.field'),
        'node.material',
        'node.material.registrationDocuments'
      );
    }
    const audit = $('#audit');
    if (audit) {
      const state = audit.querySelector('.riskdialog')
        ? 'risk'
        : audit.querySelector('.loader')
          ? 'loading'
          : audit.querySelector('.success')
            ? 'pass'
            : 'error';
      surface(
        audit,
        state === 'risk' ? 'risk' : state === 'loading' ? 'loading' : 'home',
        'registration.audit.' + state,
        {
          risk: '敏感词审核未通过',
          loading: '敏感词审核中',
          pass: '提交审核成功',
          error: '机器审核暂不可用'
        }[state],
        true
      );
    }
    const dialog = $('#overlay .auditbox');
    if (dialog) {
      const type = catalog
        ? dialog.dataset.auditDetail ? ({trace:'trace',risk:'resolve',profile:'profile'}[dialog.dataset.auditDetail]) : dialog.querySelector('.trace')
          ? 'trace'
          : dialog.querySelector('#resolution')
            ? 'resolve'
            : 'blocked'
        : 'detail';
      surface(
        dialog,
        catalog ? 'catalog' : 'home',
        catalog ? 'catalog.' + type : 'registration.detail',
        {
          trace: '查询全链路详情',
          resolve: '关联风险与研判',
          profile: '用户画像',
          blocked: '查询安全阻断',
          detail: '接入登记详情'
        }[type],
        true
      );
      anchor(
        dialog,
        catalog
          ? type === 'trace'
            ? 'catalog.audit'
            : type === 'profile' ? 'catalog.profile' : type === 'resolve'
              ? 'catalog.alert'
              : 'catalog.query'
          : 'node.review',
        catalog ? 'catalog.' + type : 'node.review.detail'
      );
    }
    document.querySelectorAll(catalogTab==='monitor'?'#unused-monitor-selector':'#catbody>.audit-stats article').forEach((el,i)=>anchor(el,'catalog.audit','catalog.audit.'+['total','users','cross','blocked'][i]));
    ['logday','logkey','logmode','logstatus'].forEach((id,i)=>anchor(document.getElementById(id)?.closest('label'),'catalog.audit','catalog.audit.'+['date','keyword','mode','status'][i]));
    anchor(document.querySelector(catalogTab==='monitor'?'#unused-monitor-selector':'.audit-refresh-tools>button'),'catalog.audit','catalog.audit.refreshButton');
    anchor(document.querySelector(catalogTab==='monitor'?'#unused-monitor-selector':'.audit-refresh-tools>.auto-refresh-label'),'catalog.audit','catalog.audit.autoRefresh');
    const profileRoot=document.querySelector('[data-audit-detail="profile"]');
    if(profileRoot){
      const bind=(selector,key)=>anchor(profileRoot.querySelector(selector),'catalog.profile','catalog.profile.'+key);
      bind('.audit-profile-head .avatar','avatar');bind('.audit-profile-head h2','name');bind('.audit-profile-head>.audit-badge','riskStatus');
      profileRoot.querySelectorAll('.drawer-profile-stats article').forEach((el,i)=>anchor(el,'catalog.profile','catalog.profile.'+['total','blocked','peak','ipCount'][i]));
      profileRoot.querySelectorAll('.profile-tags>.audit-badge').forEach((el,i)=>anchor(el,'catalog.profile','catalog.profile.'+['frequencyRisk','permissionRisk','replayRisk'][i]));
      profileRoot.querySelectorAll('.profile-columns>div:first-child>p').forEach((el,i)=>anchor(el,'catalog.profile','catalog.profile.'+['localCount','crossCount','abnormalRate'][i]));
      profileRoot.querySelectorAll('.profile-columns>div:nth-child(2)>p').forEach((el,i)=>anchor(el,'catalog.profile','catalog.profile.'+['targets','ips','pending'][i]));
      bind('.drawer-rule-note','scope');bind('.audit-drawer-heading .close','close');
      profileRoot.querySelectorAll('.audit-drawer-tabs button').forEach((el,i)=>anchor(el,'catalog.profile','catalog.profile.'+['traceTab','riskTab','profileTab'][i]));
      profileRoot.querySelectorAll('.profile-risk-entry').forEach(el=>anchor(el,'catalog.profile','catalog.profile.event'));
    }
    document.querySelectorAll('.riskdialog .risktable thead th').forEach((el,i)=>anchor(el,'node.machineAudit','node.machineAudit.'+['sequence','riskType','hitLocation','hitContent','suggestion'][i]));
    document.querySelectorAll('.riskdialog .risktable tbody tr').forEach(row=>[...row.children].forEach((el,i)=>anchor(el,'node.machineAudit','node.machineAudit.'+['sequence','riskType','hitLocation','hitContent','suggestion'][i])));
    window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
  }
  new MutationObserver(() => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(sync);
    }
  }).observe(document.body, { subtree: true, childList: true });
  sync();
})();

// Reuse the existing six-system launchpad; retain the portal account when switching back.
document.addEventListener('change', event => {
  if (event.target.id !== 'management-system-switch' || event.target.value !== 'portal') return;
  const params = new URLSearchParams(location.search);
  const stored = sessionStorage.getItem('cq-portal-user');
  const account = params.get('portalUser') || stored || 'enterprise';
  const user = ['personal', 'enterprise', 'authentication', 'frozen'].includes(account) ? account : 'enterprise';
  const documentName = params.get('portalDocument') === 'portal.html' ? 'portal.html' : 'portal-standalone.html';
  const target = new URL('./' + documentName, location.href);
  const previousView = params.get('portalView');
  const view = ['home', 'workbench', 'auth-entry', 'auth-types', 'auth-personal', 'auth-enterprise'].includes(previousView) ? previousView : 'home';
  target.searchParams.set('user', user);
  target.searchParams.set('view', view);
  location.href = target.href;
});
