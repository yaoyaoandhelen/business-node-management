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
let sqModalStack = [];
const icons = [
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h13l7 7v21H7z"/><path d="M20 3v8h7M11 17h12M11 22h12M11 27h8"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h26v22H4zM4 14h26M4 21h26M12 7v22M22 7v22"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7h18M12 17h18M12 27h18"/><circle cx="5" cy="7" r="1"/><circle cx="5" cy="17" r="1"/><circle cx="5" cy="27" r="1"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="26" height="26" rx="2"/><path d="m9 16 6 7L26 11"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6 19 3v28L4 28zM21 7h9v21h-9M23 11h5M23 15h5M23 19h5M23 23h5"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 21 9-9M10 17l-3 3a6 6 0 0 0 9 9l5-5M24 17l3-3a6 6 0 0 0-9-9l-5 5"/></svg>',
  '<svg viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="26" height="9" rx="2"/><rect x="4" y="21" width="26" height="9" rx="2"/><circle cx="9" cy="8.5" r="1"/><circle cx="9" cy="25.5" r="1"/><path d="M13 8.5h9M13 25.5h9M17 13v8"/></svg>'
];
icons.push(icons[4]);
const names = [
  '标识管理系统',
  '连接器管理系统',
  '主体身份管理系统',
  '业务节点管理系统',
  '区域目录管理系统',
  '存证服务',
  '基础设施管理系统',
  '数据登记管理系统'
];
const colors = [
  ['#7599dc', '#294e9b'],
  ['#9c79df', '#532ca0'],
  ['#6ed8c7', '#229a8b'],
  ['#d8b16e', '#a4742c'],
  ['#df7777', '#a92c30'],
  ['#79a3df', '#2d5c9e'],
  ['#9aa8c7', '#44598a'],
  ['#68c9b4', '#237f77']
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
      `<div class="launch" ${req('portal.system.switch','management.system.launchpad')}><div class="hero"><span class="eyebrow">• LAUNCHPAD</span><h1>快捷入口</h1><p>选择业务子系统，快速开始工作</p></div><div class="cards">${names.map((n, i) => n === '基础设施管理系统' ? '' : `<article class="card ${selectedSystem === i ? 'selected' : ''}" tabindex="0" ${selectedSystem === i ? 'aria-current="true"' : ''} onfocusin="selectSystem(${i})" onkeydown="if(event.target===this && (event.key==='Enter' || event.key===' ')){event.preventDefault();this.click()}" ${req(i === 3 ? 'node.enter' : i === 4 ? 'catalog.browse' : i === 6 ? 'infrastructure.enter' : i === 7 ? 'registration.enter' : 'system.' + i)} onclick="selectSystem(${i});${i === 0 ? 'identifierOpen()' : i === 3 ? "section='home';render()" : i === 4 ? 'catalogOpen()' : i === 6 ? 'infraOpen()' : i === 7 ? 'registrationOpen()' : "toast('当前服务暂不可用，请稍后重试')"}"><span class="num">0${i + 1}</span><div class="icon" style="--light:${colors[i][0]};--dark:${colors[i][1]}">${icons[i]}</div><h2>${n}</h2><p>业务子系统</p><button class="enter">立即进入</button><span class="arrow">→</span></article>`).join('')}</div></div>`;
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
    : ['接入登记审核', '全域目录信息互通'];
  const activeIndex = portal ? 0 : section === 'dirsync' ? 1 : 0;
  $('#sidebar').innerHTML = menu
    .map(
      (n, i) =>
        `<div class="nav ${i === activeIndex ? 'active' : ''} ${!portal && i === 0 ? 'subnav' : ''}" ${!portal && i === 0 ? req('node.review') : !portal && i === 1 ? req('dirsync.menu', 'directorySync.menu.interop') : ''} onclick="${portal ? 'navigate(' + i + ')' : i === 0 ? "section='review';render()" : "dsOpen()"}"><span>${['◉', '✉', '▧', '▤', '', '▦', '▧', '▣'][i % 8]}</span>${n}${!portal && i === 3 ? '<em>⌄</em>' : ''}</div>`
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
    `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 接入登记审核 ×</span></div><div class="registration-page"><div class="inner-page-heading"><div><h1>接入登记审核</h1><p>管理业务节点接入登记与审核进度</p></div></div><section class="panel querypanel" ${req('node.query')}><div class="query-panel-heading">筛选条件</div><div class="querygrid">${['业务节点登记名称', '业务节点标识', '状态', '统一社会信用代码', '所属法人或组织名称', '所属法人身份标识'].map((n, i) => `<label><span>${n}</span>${i === 2 ? '<select id="state"><option>请选择</option><option>待人工审核</option></select>' : `<input id="${i === 0 ? 'search' : 'filter-' + i}" placeholder="请输入">`}</label>`).join('')}</div><div class="queryactions"><button class="btn primary" onclick="drawRows()">⌕ 查询</button><button class="btn" onclick="document.querySelectorAll('.querygrid input').forEach(e=>e.value='');$('#state').selectedIndex=0;drawRows()">↻ 重置</button></div></section><section class="panel listpanel" ${req('registration.table', 'registration.table.list')}><div class="list-section-heading"><h2>接入登记列表</h2></div><div class="listtools"><button class="btn" ${req('node.create')} onclick="openForm()">＋ 新增</button><button class="btn" onclick="toast('批量导入服务暂不可用，请稍后重试')">↥ 批量导入</button><button class="btn" onclick="toast('标识样式设置暂不可用，请稍后重试')">⚑ 调整标识样式</button><span style="margin-left:auto;color:#98a5b6">↻　⊞</span></div><table><thead><tr>${['业务节点登记名称', '业务节点标识', '所属法人或其他组织名称', '所属法人身份标识', '统一社会信用代码', '操作'].map((n) => '<th>' + n + '</th>').join('')}</tr></thead><tbody id="rows"></tbody></table><div class="pagination" id="pagination"></div></section></div>`;
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
function registrationOpen() {
  document.querySelector('#audit')?.remove();
  $('#overlay').innerHTML = '';
  section = 'catalog';
  catalogTab = 'monitor';
  catalogRender();
}
function catalogRender() {
  if (typeof sqModalCloseAll === 'function') sqModalCloseAll();
  const registration = catalogTab === 'monitor';
  const systemName = registration ? '数据登记管理系统' : '区域目录管理系统';
  document.querySelector('header b').textContent = systemName;
  if (['alerts','profile'].includes(catalogTab)) catalogTab='logs';
  $('#sidebar').innerHTML = registration
    ? `<div class="nav active" ${req('registration.enter','registration.monitor.menu')} onclick="registrationOpen()">◈　数据风险监测</div><button class="identity-menu nav" aria-expanded="true" ${req('registration.audit','registrationAudit.nav.group')} onclick="raOpen('pending')"><span>▣</span>审核管理<em>⌄</em></button><button class="identity-menu nav identity-sub" ${req('registration.audit','registrationAudit.nav.pending')} onclick="raOpen('pending')">待我审批</button><button class="identity-menu nav identity-sub" ${req('registration.audit','registrationAudit.nav.completed')} onclick="raOpen('completed')">我已审批</button><button class="identity-menu nav identity-return" onclick="raBack()"><span>⇤</span>返回快捷入口</button>`
    : `<div class="nav ${['list','detail'].includes(catalogTab)?'active':''}" onclick="catalogTab='list';catalogRender()">▦　数据目录</div><div class="nav ${catalogTab==='logs'?'active':''}" onclick="catalogTab='logs';catalogRender()">▤　查询安全管控</div><div class="nav ${['riskLog','syncQuality'].includes(catalogTab)?'active':''}" ${req('regionCatalog.analysisLog','regionCatalog.analysisLog.menu')} onclick="catalogTab='riskLog';catalogRender()">▧　目录同步<em>⌄</em></div><div class="nav" style="padding-left:28px;font-size:13px;${catalogTab==='riskLog'?'background:rgba(41,78,155,.12);':''}" ${req('regionCatalog.analysisLog','regionCatalog.analysisLog.menu.sub')} onclick="catalogTab='riskLog';catalogRender()">›　冲突检测与处理</div><div class="nav" style="padding-left:28px;font-size:13px;${catalogTab==='syncQuality'?'background:rgba(41,78,155,.12);':''}" ${req('regionCatalog.syncQuality','regionCatalog.syncQuality.menu.sub')} onclick="catalogTab='syncQuality';catalogRender()">›　同步管理</div>`;
  $('#main').innerHTML = `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● ${systemName}</span></div><div class="catalog ${['logs','monitor'].includes(catalogTab)?'unified-audit':''}"><div class="cat-toolbar"><span>${systemName} / ${catalogTab==='detail'?'数据目录详情':catalogTab==='logs'?'查询安全管控':catalogTab==='monitor'?'数据风险监测':catalogTab==='riskLog'?'目录同步 / 冲突检测与处理 · 分析日志':catalogTab==='syncQuality'?'目录同步 / 同步管理':'数据目录'}</span></div><div id="catbody"></div></div>`;
  if (catalogTab === 'list') catalogList();
  if (catalogTab === 'detail') catalogDetail();
  if (catalogTab === 'logs') catalogAudit();
  if (catalogTab === 'monitor') monitorRender();
  if (catalogTab === 'riskLog') analysisLogRender();
  if (catalogTab === 'syncQuality') syncQualityRender();
}
function catalogList() {
  $('#catbody').innerHTML =
    `<section class="panel"><div class="cat-filters" ${req('catalog.query')} >${['产品类型', '交互方式', '产品名称', '产品唯一标识', '提供方名称', '敏感等级'].map((n, i) => `<label>${n}${[0, 1, 5].includes(i) ? `<select id="cq${i}"><option value="">请选择</option>${(i === 0 ? ['数据报告', 'API产品'] : i === 1 ? ['文件传输'] : ['公开', '内部', '机密']).map((x) => `<option>${x}</option>`).join('')}</select>` : `<input id="cq${i}" placeholder="请输入">`}</label>`).join('')}<div ${req('catalog.query','catalog.query.actions')}><button class="btn primary" onclick="catalogQuery()">⌕ 查询</button> <button class="btn" onclick="document.querySelectorAll('.cat-filters input,.cat-filters select').forEach(e=>e.value='');catalogResults()">↻ 重置</button></div></div></section><section class="panel cat-results"><aside ${req('catalog.browse','catalog.list.industry')}><input placeholder="请输入行业分类" oninput="document.querySelectorAll('.industry').forEach(e=>e.hidden=!e.textContent.includes(this.value))">${industries.map((n) => `<div class="industry" onclick="this.parentNode.querySelectorAll('.industry').forEach(e=>e.classList.remove('chosen'));this.classList.add('chosen');catalogQuery()">${n}</div>`).join('')}</aside><div id="cat-results" ${req('catalog.browse','catalog.list.table')}></div></section>`;
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
    let event=catalogAlerts.find(a=>a.uid==='GOV-1001'&&a.why===(why.includes('高频')?'高频异常访问':why)&&a.state==='待研判'); if(event)event.evidenceIds.push(id);else catalogAlerts.unshift({id,uid:'GOV-1001',why:why.includes('高频')?'高频异常访问':why,time:record.time,state:'待研判',evidenceIds:[id]});
    $('#overlay').innerHTML =
      `<div class="veil"><div class="auditbox"><div class="auditmark" style="color:#d45353">!</div><h2>查询已被安全策略阻断</h2><p>${why.includes('高频') ? '最近连续 60 秒查询 ' + queryTimes.length + ' 次，已达到 50 次风险阈值。请在冷却期结束后重试。' : '查询已命中风险规则，请稍后重试。'}</p><p>请求编号：${id}<br>已记录审计轨迹并生成风险预警，本次未执行数据查询。</p><button class="btn primary" onclick="$('#overlay').innerHTML=''">我知道了</button></div></div>`;
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
  let why=state.until>now?'高频异常访问阻断期':state.times.length>=50?'高频异常访问':'';
  if(why)state.until=now+60000;
  auditWindows.set(uid,state);
  return {why,frequency:state.times.length,until:state.until};
}
function auditMakeRecord(actor,mode,at,index,why='',frequency=1){
  const ts=new Date(at),stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(ts);
  return {id:'TR-'+ts.getTime()+'-'+index,at:ts.toISOString(),time:stamp,...actor,user:actor.name+' / '+actor.uid,target:products[0],productId:'691500000736550152L500039D0G2KDI',mode,source:'区域目录节点',destination:mode==='跨域调用'?'外域目录节点':'本地目录节点',count:why?0:1,status:why?'已阻断':'成功',http:why?429:200,why,frequency,token:'jti-masked-'+index,duration:why?8:mode==='跨域调用'?186:42,policy:'RATE-USER-60S-50 / v1',filter:{productName:products[0],provider:'中国移动通信集团重庆有限公司',securityLevel:'公开'},resultSummary:why?'策略拒绝，未执行目录查询':'返回公开目录元数据 1 条；不含产品数据文件',demo:true};
}
function auditSeed(){
  if(auditSeeded)return;auditSeeded=true;
  // A complete >=50 burst: same authenticated enterprise identity across both call modes.
  const burst=Date.parse('2026-11-02T10:24:00+08:00');
  for(let i=0;i<62;i++)catalogLogs.push(auditMakeRecord(auditActors[1],i%2?'跨域调用':'本地查询',burst+i*650,'B'+i,i>=49?(i===49?'高频异常访问':'高频异常访问阻断期'):'',i+1));
  for(let i=0;i<96;i++)catalogLogs.push(auditMakeRecord(auditActors[i%4],i%3===0?'跨域调用':'本地查询',Date.parse('2026-11-02T08:00:00+08:00')+i*75000,'N'+i));
  catalogLogs.sort((a,b)=>b.at.localeCompare(a.at));
  for(const actor of [auditActors[1]]){const records=catalogLogs.filter(r=>r.uid===actor.uid&&r.why);catalogAlerts.push({id:records[0].id,uid:actor.uid,why:'高频异常访问',time:records[records.length-1].time,state:'待研判',evidenceIds:records.map(r=>r.id),note:''});}
}
let auditRangeDays=1, auditBucket=null, auditEditing=false, auditRefreshAt=Date.now(), auditDetail=null;
function auditRiskType(r){return r.why?.startsWith('高频')?'高频异常访问':r.why||'';}
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
  <section class="audit-filters panel" data-req-module="catalog.audit.query" ${req('catalog.audit','catalog.audit.filters')}><label>查询截止日期<input type="date" required id="logday" value="${auditFilters.day}"></label><label class="wide">用户 / IP / 请求编号 / 产品<input id="logkey" value="${esc(auditFilters.key)}" placeholder="请输入关键词" onkeydown="if(event.key==='Enter')auditApply()"></label><label>调用方式<select id="logmode">${opts(['本地查询','跨域调用'],auditFilters.mode)}</select></label><label>返回状态<select id="logstatus">${opts(['成功','已阻断'],auditFilters.status)}</select></label><label ${req('catalog.audit','catalog.audit.riskType')}>风险类型<select id="logrisk">${opts(['高频异常访问'],auditFilters.riskType)}</select></label><label ${req('catalog.audit','catalog.audit.judgment')}>研判状态<select id="logjudgment">${opts(['待研判','已关闭'],auditFilters.judgment)}</select></label><button class="btn primary" onclick="auditApply()">查询</button><button class="btn" onclick="auditReset()">重置</button></section>
  <div class="audit-stats" data-req-module="catalog.audit.statistics" ${req('catalog.audit','catalog.audit.statistics')}>${[['风险查询量',logs.length,'次','仅统计命中风险的查询请求','blue'],['活跃用户',users.size,'人','按认证用户 ID 去重','blue'],['跨域调用',cross.length,'次','占风险查询量 '+(logs.length?(cross.length/logs.length*100).toFixed(1):'0.0')+'%','blue'],['风险事件',events.length,'个','按关联事件编号去重','red']].map(([name,value,unit,note,color])=>`<article><span>${name}</span><strong class="${color}">${value.toLocaleString()}<small> ${unit}</small></strong><p>${note}</p></article>`).join('')}</div>
  
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
  const blocked=!!r.why;
  const stages=[['请求接入','已接收',r.source+' → '+r.destination],['身份认证与令牌校验','通过',r.uid+' · '+r.role+'；令牌标识 '+r.token],['访问权限判定','通过','公开目录元数据读取权限通过 / ABAC v1'],['行为与频率检测',blocked?'已阻断':'通过','同一用户滚动 60 秒 '+r.frequency+' 次；阈值 ≥ 50 / RATE-USER-60S-50 v1'],['目录查询 / 跨域转发',blocked?'未执行':'已完成',blocked?'访问策略拒绝，未向目录节点发起查询':r.source+' → '+r.destination],['响应与审计记录','已记录','HTTP '+r.http+' · '+r.count+' 条 · '+r.duration+' ms；'+r.resultSummary]];
  return `<div class="trace-summary"><span>访问用户<b>${esc(r.name)} / ${r.uid}</b></span><span>来源 IP<b>${r.ip}</b></span><span>查询对象<b>${esc(r.target)}</b></span><span>调用方式<b>${r.mode}</b></span></div><h3 class="drawer-section-title">全链路轨迹</h3><ol class="trace audit-timeline">${stages.map(([name,status,note])=>`<li><b>${name}</b><span class="audit-badge ${status==='拒绝'||status==='已阻断'?'danger':status==='未执行'?'neutral':'success'}">${status}</span><p>${esc(note)}</p></li>`).join('')}</ol><details class="audit-parameters"><summary>查询参数与返回摘要</summary><pre>${esc(JSON.stringify({traceId:r.id,productId:r.productId,query:r.filter,response:{status:r.http,returnedCount:r.count,summary:r.resultSummary}},null,2))}</pre></details>`;
}
function auditRiskContent(r){
  const a=auditEventFor(r);if(!a)return '<div class="empty">本次查询未命中风险规则。</div>';
  const records=catalogLogs.filter(r=>(a.evidenceIds||[a.id]).includes(r.id)),i=catalogAlerts.indexOf(a);
  return `<div class="risk-detail-title"><h3>${a.why}</h3><span class="audit-badge ${a.state==='待研判'?'warning':'neutral'}">${esc(a.state)}</span></div><div class="trace-summary"><span>风险主体<b>${esc(r.name)} / ${r.uid}</b></span><span>首次触发<b>${a.time}</b></span><span>检测依据<b>连续 60 秒达到 50 次</b></span><span>系统动作<b>自动阻断 · 返回 0 条</b></span></div><p class="drawer-rule-note">本地查询与跨域调用按认证用户合并计数，第 50 次起阻断。</p><h3 class="drawer-section-title">关联请求 <span class="count-pill">${records.length}</span></h3><div class="risk-evidence-list">${records.map(x=>`<button onclick="auditOpenDetail('${x.id}','trace')"><span>${x.time}<small>${x.id}</small></span><span class="audit-badge danger">HTTP ${x.http}</span><span>查看链路 ›</span></button>`).join('')}</div><h3 class="drawer-section-title">风险研判</h3>${a.state==='待研判'?`<form class="audit-resolution-form" ${req('catalog.alert','catalog.alert.resolutionForm')} onsubmit="event.preventDefault();auditResolve(${i})"><label>研判结论 <span class="required">*</span><select id="resolution"><option>确认风险</option><option>业务正常</option><option>规则误报</option></select></label><label>研判依据 <span class="required">*</span><textarea id="resolutionNote" required maxlength="500" placeholder="请填写研判依据，最多 500 字"></textarea></label><p>研判结论仅关闭本事件，不解除访问控制策略。</p><button class="btn primary" type="submit">保存研判</button></form>`:`<div class="resolution-result"><p>研判结论：${esc(a.state.replace('已关闭 / ',''))}</p><p>研判依据：${esc(a.note)}</p><p>处理人：${esc(a.resolvedBy||'安全分析员')}</p><p>处理时间：${a.resolvedAt||'—'}</p></div>`}`;
}
function auditResolve(i){
  const note=$('#resolutionNote')?.value.trim();if(!note){toast('请填写研判依据');return}if(note.length>500){toast('研判依据最多 500 字');return}
  const id=auditDetail.id;
  Object.assign(catalogAlerts[i],{state:'已关闭 / '+$('#resolution').value,note,resolvedAt:new Date().toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}),resolvedBy:'安全分析员'});
  const y=window.scrollY;catalogAudit();window.scrollTo(0,y);auditOpenDetail(id,'risk');toast('研判已保存');
}
function auditProfileContent(r){
  const logs=auditSelected().filter(x=>x.uid===r.uid),bad=logs.filter(x=>x.why),peak=Math.max(0,...logs.map(x=>x.frequency)),events=auditVisibleEvents(logs),pending=events.filter(a=>a.state==='待研判').length;
  return `<div class="audit-profile-head"><span class="avatar">${r.role==='政府用户'?'政':'企'}</span><div><h2>${esc(r.name)}</h2><p ${req('catalog.profile','catalog.profile.identity')}><span ${req('catalog.profile','catalog.profile.uid')}>${r.uid}</span> · <span ${req('catalog.profile','catalog.profile.role')}>${r.role}</span> · <span ${req('catalog.profile','catalog.profile.organization')}>${esc(r.org)}</span></p></div><span class="audit-badge ${bad.length?'danger':'success'}">${bad.length?'命中风险规则':'未命中风险规则'}</span></div><div class="audit-stats drawer-profile-stats">${[['查询总量',logs.length],['阻断请求',bad.length],['60S请求总数',peak],['来源 IP',new Set(logs.map(r=>r.ip)).size]].map(([name,value])=>`<article><span>${name}</span><strong>${value}</strong></article>`).join('')}</div><p class="drawer-rule-note">统计范围：当前查询条件${auditBucket?' · '+auditPeriod():''}；最近访问：${logs[0]?.time||'—'}</p><h3 class="drawer-section-title">风险标签与证据</h3><div class="profile-tags">${['高频异常访问'].map(n=>`<span class="audit-badge ${bad.some(x=>x.why.includes(n))?'danger':'neutral'}">${n} ${bad.filter(x=>x.why.includes(n)).length} 次</span>`).join('')}</div><div class="profile-columns"><div><h3>访问特征</h3><p>本地查询：${logs.filter(x=>x.mode==='本地查询').length} 次</p><p>跨域调用：${logs.filter(x=>x.mode==='跨域调用').length} 次</p><p>异常率：${logs.length?(bad.length/logs.length*100).toFixed(1):'0.0'}%</p></div><div><h3>访问范围</h3><p>查询对象：${[...new Set(logs.map(x=>x.target))].map(esc).join('、')||'—'}</p><p>来源 IP：${[...new Set(logs.map(x=>x.ip))].join('、')||'—'}</p><p>待研判风险：${pending} 个</p></div></div><h3 class="drawer-section-title">关联风险事件</h3>${events.map(a=>`<button class="profile-risk-entry" onclick="auditOpenDetail('${a.id}','risk')"><span>${a.why} · ${a.time}</span><span>${a.state==='待研判'?'待研判':'已关闭'} ›</span></button>`).join('')||'<p class="muted">当前范围内无关联风险事件。</p>'}<p class="drawer-rule-note">风险标签依据规则命中记录生成，需结合业务背景进行研判。</p>`;
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
  const entryKey = (key) =>
    ['提供方名称', '提供主体类型', '主体信息 JSON 字串', '身份标识', '提供方简介', '法人经办人姓名', '法人经办人电话', '法人经办人身份证', '授权委托书', '授权委托书名称', '数据样例', '数据样例（文件形式）名称'].includes(key)
      ? 'catalog.detail.provider'
      : ['合法合规声明', '合法合规声明（文件形式）名称', '数据来源声明', '数据来源声明（文件形式）名称', '安全分级分类', '安全分级分类（文件形式）名称', '数据质量、产品价值评估报告', '数据质量、产品价值评估报告（文件形式）名称'].includes(key)
        ? 'catalog.detail.material'
        : 'catalog.detail.basic';
  $('#catbody').innerHTML =
    `<section class="panel" ${req('catalog.detail')}><h2 class="cat-title">基本信息</h2><div class="cat-detail">${entries.map(([k, v]) => `<div ${req('catalog.detail', entryKey(k))}><span>${k}</span> ${esc(v)}</div>`).join('')}</div><p style="text-align:center"><button class="btn" ${req('catalog.detail','catalog.detail.return')} onclick="catalogTab='list';catalogRender()">返回</button></p></section>`;
}

if (new URLSearchParams(location.search).get('system') === 'registration') registrationOpen();
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
    if(section==='nodeAudit'){surface($('#main'),naPageId(),naSurface(),naTitle());const naDialog=$('#overlay .node-audit-dialog');if(naDialog)surface(naDialog,naPageId(),naDialog.dataset.reqSurface,naDialog.dataset.reqTitle,true);return;}
    if(section==='registrationAudit'){surface($('#main'),raPageId(),raSurface(),raTitle());const raDialog=$('#overlay .registration-audit-dialog');if(raDialog)surface(raDialog,raDialog.dataset.reqPage,raDialog.dataset.reqSurface,raDialog.dataset.reqTitle,true);return;}
    if(section==='identityAuth'){surface($('#main'),'identity-auth-service','identity.auth.service','身份登陆认证服务');const iaaDialog=$('#overlay .iaa-modal');if(iaaDialog)surface(iaaDialog,'identity-auth-service',iaaDialog.dataset.reqSurface,iaaDialog.getAttribute('aria-label')||'操作详情',true);return;}
    if(section==='identity'){surface($('#main'),identityPage(),identityPage().replaceAll('-','.'),(identityQueue==='pending'?'待我审批':'我已审批')+' · '+identityKinds[identityKind]);const auditDialog=$('#overlay .identity-audit-dialog');if(auditDialog)surface(auditDialog,identityPage(),auditDialog.dataset.reqSurface,auditDialog.dataset.reqTitle,true);return;}
    const main = $('#main'),
      catalog = section === 'catalog',
      identifier = section === 'identifier';
    const titles = {
      monitor: '数据风险监测',
      list: '数据目录',
      detail: '数据目录详情',
      logs: '查询安全管控',
      alerts: '风险识别与预警',
      profile: '风险行为画像',
      riskLog: '冲突检测与处理 · 风险日志',
      syncQuality: '同步管理'
    };
    surface(
      main,
      identifier ? 'identifier' : catalog ? (catalogTab === 'monitor' ? 'monitor' : 'catalog') : 'home',
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

const SIM_RESOURCES = [
  {name:'景区客流统计数据集',id:'SJZY-20261110-001',summary:'汇总景区入园客流、客源地与到访时段的明细数据。',items:'客流人数 / 客源地 / 到访时段',industry:'文化、体育和娱乐业',provider:'中国移动通信集团重庆有限公司',coverage:'重庆市 / 2026-01 至 2026-10'},
  {name:'春节返乡流动数据集',id:'SJZY-20261110-002',summary:'记录春节前后人口流动的出发地、目的地与迁徙时间。',items:'出发地 / 目的地 / 迁徙日期',industry:'交通运输、仓储和邮政业',provider:'中国移动通信集团重庆有限公司',coverage:'全国 / 2026-01 至 2026-02'},
  {name:'投资用户行为数据集',id:'SJZY-20261110-003',summary:'归集投资用户在理财场景下的浏览、申购与持仓行为。',items:'用户编号 / 行为类型 / 行为时间',industry:'金融业',provider:'中国移动通信集团重庆有限公司',coverage:'重庆市 / 2026-03 至 2026-09'},
  {name:'金融风控样本数据集',id:'SJZY-20261110-004',summary:'整理授信审批与风险评分建模使用的样本特征。',items:'样本编号 / 特征项 / 风险标签',industry:'金融业',provider:'中国移动通信集团重庆有限公司',coverage:'全国 / 2026-01 至 2026-10'},
  {name:'商圈客群到访数据集',id:'SJZY-20261110-005',summary:'统计商圈到访客群的时段分布与消费偏好。',items:'商圈编号 / 到访时段 / 消费偏好',industry:'批发和零售业',provider:'中国移动通信集团重庆有限公司',coverage:'重庆市 / 2026-05 至 2026-10'}
];
const SIM_RES_FIELD_LABELS = ['资源名称','资源摘要','信息项列表','行业分类','来源主体','覆盖范围与质量'];
const SIM_RES_FIELD_WEIGHTS = [30,25,20,10,10,5];
const SIM_RES_SCORE_BASE = [
  [98.5,97.1,88.3,89.8,83.9,81.0],
  [81.2,79.9,97.5,84.9,82.4,83.7]
];
const SIM_RES_PEER_DEFS = [
  [['景区入园客流明细数据集','SJZY-20261111-001'],['游客到访特征数据资源','SJZY-20261111-002']],
  [['春运人口迁徙明细数据集','SJZY-20261111-003'],['返乡流动轨迹数据资源','SJZY-20261111-004']],
  [['理财用户行为明细数据集','SJZY-20261111-005'],['投资客群持仓数据资源','SJZY-20261111-006']],
  [['信贷风控特征明细数据集','SJZY-20261111-007'],['授信评分样本数据资源','SJZY-20261111-008']],
  [['商圈到访客流明细数据集','SJZY-20261111-009'],['商业客群偏好数据资源','SJZY-20261111-010']]
];
const SIM_FIELD_LABELS = ['产品名称','产品简介','适用场景','分类与产品类型','主体与加工方式','地域与时间范围','使用限制','提供方'];
const SIM_FIELD_WEIGHTS = [25,20,15,12,8,8,7,5];
const SIM_SCORE_BASE = [
  [98.5,97.1,88.3,89.8,83.9,81.0,78.1,75.2],
  [81.2,79.9,97.5,84.9,82.4,83.7,78.7,76.2]
];
const SIM_PEER_DEFS = [
  [['景区客流特征分析数据产品','SJCP-20261110-001','产品名称 / 产品简介'],['游客画像与到访分析数据集','SJCP-20261110-002','适用场景 / 产品简介']],
  [['春运人口流动分析数据产品','SJCP-20261110-003','产品名称 / 适用场景'],['返乡人群迁徙洞察数据集','SJCP-20261110-004','产品简介 / 分类与产品类型']],
  [['投资客群画像分析数据产品','SJCP-20261110-005','产品名称 / 产品简介'],['理财用户行为洞察数据集','SJCP-20261110-006','适用场景 / 使用限制']],
  [['金融风险评估模型数据产品','SJCP-20261110-007','产品名称 / 分类与产品类型'],['信贷风控评分数据集','SJCP-20261110-008','产品简介 / 主体与加工方式']],
  [['商圈客流洞察数据产品','SJCP-20261110-009','产品名称 / 适用场景'],['商业客群画像数据集','SJCP-20261110-010','产品简介 / 地域与时间范围']]
];
function simOwnId(i){return '691500000736550152L5000'+i+'9D0G2KDI'}
function simPeers(i){
  return SIM_PEER_DEFS[i].map((p,k)=>{
    const scores=SIM_SCORE_BASE[k].map((v,j)=>+(v-(i%3)*0.6-k*0.3).toFixed(1));
    const score=+(scores.reduce((sum,v,j)=>sum+v*SIM_FIELD_WEIGHTS[j],0)/100).toFixed(1);
    return {own:products[i],ownId:simOwnId(i),peer:p[0],peerId:p[1],hit:p[2],scores:scores,score:score,top:Math.max.apply(null,scores),domain:'全域',type:'数据产品',labels:SIM_FIELD_LABELS,weights:SIM_FIELD_WEIGHTS};
  }).filter(p=>p.score>=80);
}
function simResPeers(i){
  return SIM_RES_PEER_DEFS[i].map((p,k)=>{
    const scores=SIM_RES_SCORE_BASE[k].map((v,j)=>+(v-(i%3)*0.6-k*0.3).toFixed(1));
    const score=+(scores.reduce((sum,v,j)=>sum+v*SIM_RES_FIELD_WEIGHTS[j],0)/100).toFixed(1);
    const order=scores.map((v,j)=>j).sort((a,b)=>scores[b]-scores[a]);
    return {own:SIM_RESOURCES[i].name,ownId:SIM_RESOURCES[i].id,peer:p[0],peerId:p[1],hit:SIM_RES_FIELD_LABELS[order[0]]+' / '+SIM_RES_FIELD_LABELS[order[1]],scores:scores,score:score,top:Math.max.apply(null,scores),domain:'全域',type:'数据资源',labels:SIM_RES_FIELD_LABELS,weights:SIM_RES_FIELD_WEIGHTS};
  }).filter(p=>p.score>=80);
}
function simNow(){const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())}
let simAnalysisSeq=0;
const rcAnalysisRows=[];
[[0,'2026-11-17 09:12:41'],[2,'2026-11-17 09:48:05'],[4,'2026-11-17 10:26:33']].forEach(g=>{
  simPeers(g[0]).forEach(h=>{
    rcAnalysisRows.push({id:'FX-20261117-'+String(++simAnalysisSeq).padStart(3,'0'),at:g[1],type:'数据产品',own:h.own,ownId:h.ownId,peer:h.peer,peerId:h.peerId,score:h.score,top:h.top,hit:h.hit,domain:h.domain});
  });
});

const SIM_DEMO_FILE='2026年11月目录上报模板-数据资源.xlsx';
let simTimer=null, simUploadFile='', simBlocked=false, simUpType='数据资源', simUpMode='整体上传';
function simClose(){if(simTimer){clearTimeout(simTimer);simTimer=null}$('#overlay').innerHTML=''}
function simPickFile(name){
  simUploadFile=name||'';simBlocked=false;
  const t=$('#simDropText');
  if(t)t.innerHTML=simUploadFile?'已选择：<b>'+esc(simUploadFile)+'</b><div style="font-size:12px;color:#8a97a8;margin-top:6px">点击重新选择</div>':'将 Excel 模板文件拖到此处，或 <span style="color:#294e9b">点击选择</span>';
  const start=$('#simStartBtn');if(start){start.disabled=false;start.style.opacity='';start.style.cursor=''}
  const btn=$('#simAnalyzeBtn');if(btn)btn.disabled=false;
  const r=$('#simResult');if(r){r.innerHTML='';r.style.display='none'}
}
function simDropFile(e){e.preventDefault();const f=e.dataTransfer&&e.dataTransfer.files[0];if(f)simPickFile(f.name)}
function simUpModeSet(mode){
  simUpMode=mode;
  const a=$('#simTabWhole'),b=$('#simTabResume');
  if(a)a.className=mode==='整体上传'?'sim-tab active':'sim-tab';
  if(b)b.className=mode==='断点续传'?'sim-tab active':'sim-tab';
  const m=$('#simUpMode');if(m)m.textContent=mode;
}
function simUpTypeChange(v){simUpType=v;simPickFile(simUploadFile)}
function sqUploadTaskOpen(){
  simUploadFile='';simBlocked=false;simUpType='数据资源';simUpMode='整体上传';
  $('#overlay').innerHTML='<div class="veil" style="display:flex;align-items:center;justify-content:center;z-index:80">'
    +'<style>@keyframes simspin{to{transform:rotate(360deg)}}'
    +'.sim-tab{border:0;background:none;padding:12px 2px 10px;font-size:14px;color:#5c6b82;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}'
    +'.sim-tab.active{color:#294e9b;font-weight:600;border-bottom-color:#294e9b}'
    +'.sim-drop:hover{border-color:#294e9b;background:#fafcff}</style>'
    +'<section class="dialog" role="dialog" aria-modal="true" aria-labelledby="sim-title" data-req-page="regionCatalog-syncQuality" data-req-surface="regionCatalog.uploadTask.dialog" data-req-layer="dialog" data-req-title="上传上报模板（创建上报任务）" style="width:min(700px,94vw);max-height:88vh;display:flex;flex-direction:column;background:#fff;border-radius:8px;box-shadow:0 18px 60px rgba(0,0,0,.22)">'
    +'<div class="dialog-head" style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px 10px"><h2 id="sim-title" style="font-size:16px;margin:0;font-weight:500;color:#2c3a4e">上传上报模板（创建上报任务）</h2><button class="close" onclick="simClose()" aria-label="关闭" style="border:0;background:none;font-size:20px;color:#9aa6b6;cursor:pointer">×</button></div>'
    +'<div style="flex:1;overflow:auto;padding:0 22px">'
    +'<div style="display:flex;gap:26px;border-bottom:1px solid #e7ecf4" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.tabs')+'><button id="simTabWhole" class="sim-tab active" onclick="simUpModeSet(\'整体上传\')">整体上传</button><button id="simTabResume" class="sim-tab" onclick="simUpModeSet(\'断点续传\')">断点续传</button></div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px 24px;padding:22px 0" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.file')+'>'
    +'<div style="display:flex;align-items:center;gap:12px;justify-content:flex-end"><label style="font-size:13px;font-weight:600;color:#3c4d65;white-space:nowrap">目录类型</label><select id="simUpType" onchange="simUpTypeChange(this.value)" style="flex:1;max-width:220px;padding:8px 10px;border:1px solid #dce3ee;border-radius:4px;font-size:13px;color:#5c6b82;background:#fff"><option>数据资源</option><option>数据产品</option></select></div>'
    +'<div style="display:flex;align-items:center;gap:12px;justify-content:flex-end"><label style="font-size:13px;font-weight:600;color:#3c4d65;white-space:nowrap">上传方式</label><span id="simUpMode" style="flex:1;max-width:220px;padding:8px 10px;border:1px solid #dce3ee;border-radius:4px;font-size:13px;color:#3c4d65;background:#fff">整体上传</span></div>'
    +'<div style="grid-column:1/-1;display:grid;grid-template-columns:90px 1fr;gap:12px;align-items:start">'
    +'<label style="font-size:13px;font-weight:600;color:#3c4d65;padding-top:14px;text-align:right">选择文件</label>'
    +'<label id="simDrop" class="sim-drop" style="border:1px dashed #cfd9e8;border-radius:6px;padding:24px 16px;text-align:center;cursor:pointer;display:block" ondragover="event.preventDefault()" ondrop="simDropFile(event)">'
    +'<input type="file" hidden accept=".xlsx,.xls,.csv" onchange="simPickFile(this.files[0]&&this.files[0].name)">'
    +'<div style="font-size:36px;color:#c9d3e2;line-height:1;position:relative">☁<span style="position:absolute;left:50%;top:14px;transform:translateX(-50%);font-size:17px;color:#fff;font-weight:700">↑</span></div>'
    +'<div id="simDropText" style="font-size:13px;color:#65748a;margin-top:12px">将 Excel 模板文件拖到此处，或 <span style="color:#294e9b">点击选择</span></div>'
    +'</label></div></div>'
    +'<div style="background:#eaf8ee;border-radius:6px;padding:10px 14px;font-size:12px;color:#3f7a52;display:flex;gap:8px;align-items:center" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.hint')+'><span>ⓘ</span><span>适合中小文件。大文件或网络不稳请使用「断点续传」。</span></div>'
    +'<div id="simResult" style="display:none;margin-top:14px;max-height:360px;overflow:auto" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.result')+'></div>'
    +'</div>'
    +'<footer class="dialog-footer" style="padding:14px 22px;border-top:1px solid rgba(0,0,0,.06);text-align:right" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.actions')+'>'
    +'<button class="btn" onclick="simClose()">取消</button> '
    +'<button id="simAnalyzeBtn" class="btn" onclick="simUploadAnalyze()">相似度分析</button> '
    +'<button id="simStartBtn" class="btn primary" style="background:#294e9b;border-color:#294e9b" onclick="simUploadStart()">开始上传</button>'
    +'</footer></section></div>';
}
function simUploadAnalyze(){
  if(!simUploadFile)simPickFile(SIM_DEMO_FILE);
  const btn=$('#simAnalyzeBtn');if(btn)btn.disabled=true;
  const r=$('#simResult');r.style.display='block';
  const spin='<div style="width:32px;height:32px;border:3px solid #dce5f2;border-top-color:#294e9b;border-radius:50%;animation:simspin .8s linear infinite;margin:0 auto 12px"></div>';
  const load=(txt)=>'<div style="padding:34px 0;text-align:center" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.loading')+'>'+spin+'<div style="font-size:13px;color:#65748a">'+txt+'</div></div>';
  r.innerHTML=load('正在上传并解析目录文件…');
  simTimer=setTimeout(function(){
    r.innerHTML=load('正在进行全域目录相似度匹配…');
    simTimer=setTimeout(function(){simTimer=null;simUploadResult();if(btn)btn.disabled=false},1300);
  },700);
}
function simUploadResult(){
  const isRes=simUpType==='数据资源';
  const idx=[0,1],hits=[];
  idx.forEach(function(i){(isRes?simResPeers(i):simPeers(i)).forEach(function(h){hits.push(h)})});
  const at=simNow();
  hits.forEach(h=>{rcAnalysisRows.unshift({id:'FX-20261117-'+String(++simAnalysisSeq).padStart(3,'0'),at:at,type:h.type,own:h.own,ownId:h.ownId,peer:h.peer,peerId:h.peerId,score:h.score,top:h.top,hit:h.hit,domain:h.domain})});
  const cell='border-bottom:1px solid rgba(0,0,0,.08);padding:8px 6px;text-align:left;white-space:nowrap';
  const rowsHtml=hits.map((h,i)=>'<tr><td style="'+cell+'">'+(i+1)+'</td><td style="'+cell+'">'+esc(h.own)+'</td><td style="'+cell+'">'+esc(h.ownId)+'</td><td style="'+cell+'">'+esc(h.peer)+'</td><td style="'+cell+'">'+esc(h.peerId)+'</td><td style="'+cell+'"><b style="color:#a92c30">'+h.score.toFixed(1)+'%</b></td><td style="'+cell+'">'+esc(h.hit)+'</td><td style="'+cell+'">'+esc(h.domain)+'</td></tr>').join('');
  const scoresHtml=hits.map(h=>'<div style="margin-bottom:10px"><div style="font-size:12px;margin-bottom:4px">「'+esc(h.peer)+'」 → <b style="color:#a92c30">'+h.score.toFixed(1)+'%</b></div><div style="display:flex;flex-wrap:wrap;gap:6px">'+h.scores.map((v,j)=>'<span style="border:1px solid rgba(0,0,0,.12);border-radius:6px;padding:4px 8px;font-size:12px">'+h.labels[j]+' <b>'+v.toFixed(1)+'%</b> × '+h.weights[j]+'%</span>').join('')+'</div></div>').join('');
  simBlocked=hits.length>0;
  const start=$('#simStartBtn');
  if(start){start.disabled=simBlocked;start.style.opacity=simBlocked?'0.45':'';start.style.cursor=simBlocked?'not-allowed':''}
  const alert=simBlocked
    ? '<div class="notice" style="border-left:3px solid #a92c30;background:#fff5f5;margin-bottom:12px" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.alert')+'>检测到与全域目录库存在相似目录，暂不可发起开始上传。</div>'
    : '<div class="notice" style="margin-bottom:12px" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.alert')+'>未检测到相似目录，可发起开始上传。</div>';
  $('#simResult').innerHTML=alert
    +'<div class="notice" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.summary')+'>上传文件「'+esc(simUploadFile)+'」（'+esc(simUpType)+'）解析出 <b>'+idx.length+'</b> 条文件目录，命中 <b>'+hits.length+'</b> 条相似目录（来源：全域目录库）。</div>'
    +(hits.length
      ? '<div style="margin-top:12px" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.hits')+'><div style="font-size:13px;font-weight:500;margin-bottom:6px">相似目录清单</div><div style="overflow-x:auto"><table style="width:100%;min-width:760px;border-collapse:collapse;font-size:12px"><thead><tr><th style="'+cell+'">序号</th><th style="'+cell+'">目标目录</th><th style="'+cell+'">目标目录标识</th><th style="'+cell+'">相似目录</th><th style="'+cell+'">相似目录标识</th><th style="'+cell+'">综合相似度</th><th style="'+cell+'">命中字段</th><th style="'+cell+'">来源域</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div></div>'
        +'<div style="margin-top:14px" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.scores')+'><div style="font-size:13px;font-weight:500;margin-bottom:6px">字段级相似度得分</div>'+scoresHtml+'</div>'
      : '<div class="empty" style="margin-top:16px">暂无相似目录</div>')
    +'<div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(0,0,0,.06);text-align:right" '+req('regionCatalog.uploadTask','regionCatalog.uploadTask.dialog.logLink')+'><button class="link" onclick="simGoLog()" style="font-size:13px">查看分析日志 →</button></div>';
  toast(simBlocked?'相似度分析命中，已生成 '+hits.length+' 条分析日志':'相似度分析完成，未命中相似目录');
}
function simGoLog(){simClose();section='catalog';catalogTab='riskLog';catalogRender()}
function simUploadStart(){
  if(!simUploadFile){toast('请先选择上传文件');return}
  if(simBlocked){toast('检测到相似目录，暂不可发起开始上传');return}
  simClose();toast('已发起上传任务');
}

function analysisLogRender(){
  $('#catbody').innerHTML =
    '<div class="workspace" data-req-surface="regionCatalog.analysisLog" data-req-page="regionCatalog-analysisLog" data-req-title="区域目录管理系统 · 目录同步 / 冲突检测与处理 · 分析日志">' +
    '<section class="panel"><div class="cat-filters" '+req('regionCatalog.analysisLog','regionCatalog.analysisLog.query')+'>' +
    '<label>分析编号</label><input id="rcq0" placeholder="请输入分析编号">' +
    '<label>目录类型</label><select id="rcq1"><option value="">全部</option><option>数据资源</option><option>数据产品</option></select>' +
    '<label>目录名称或标识</label><input id="rcq2" placeholder="请输入目录名称或标识">' +
    '<label>相似度下限</label><input id="rcq3" type="number" min="0" max="100" step="0.1" placeholder="80">' +
    '<label>分析时间</label><input id="rcq4" type="date">' +
    '<label>来源域</label><select id="rcq5"><option value="">全部</option><option>全域</option><option>区域</option></select>' +
    '<div '+req('regionCatalog.analysisLog','regionCatalog.analysisLog.actions')+'><button class="btn primary" onclick="analysisLogQuery()">⌕ 查询</button> <button class="btn" onclick="analysisLogReset()">↻ 重置</button></div></div></section>' +
    '<section class="panel" style="margin-top:12px"><table style="width:100%" '+req('regionCatalog.analysisLog','regionCatalog.analysisLog.table')+'><thead><tr><th>序号</th><th>分析编号</th><th>分析时间</th><th>目录类型</th><th>目标目录</th><th>目标目录标识</th><th>相似目录</th><th>相似目录标识</th><th>综合相似度</th><th>最高字段得分</th><th>命中字段</th><th>来源域</th></tr></thead><tbody id="rcAnalysisRows"></tbody></table><div class="muted" style="margin-top:10px;font-size:12px">共 <span id="rcAnalysisCount">0</span> 条</div></section></div>';
  rcAnalysisDraw();
}
function rcAnalysisDraw(){
  const id=($('#rcq0')?.value||'').trim(),type=$('#rcq1')?.value||'',name=($('#rcq2')?.value||'').trim(),
    min=Number($('#rcq3')?.value||0),date=$('#rcq4')?.value||'',domain=$('#rcq5')?.value||'';
  const found=rcAnalysisRows.filter(r=>
    (!id||r.id.includes(id))&&(!type||r.type===type)&&
    (!name||[r.own,r.ownId,r.peer,r.peerId].some(v=>v.includes(name)))&&
    r.score>=min&&(!date||r.at.slice(0,10)===date)&&(!domain||r.domain===domain));
  $('#rcAnalysisRows').innerHTML=found.length?found.map((r,i)=>
    '<tr style="cursor:pointer" onclick="analysisLogDetail(\''+esc(r.id)+'\')"><td>'+(i+1)+'</td><td><span class="link">'+esc(r.id)+'</span></td><td>'+esc(r.at)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.own)+'</td><td>'+esc(r.ownId)+'</td><td>'+esc(r.peer)+'</td><td>'+esc(r.peerId)+'</td><td><b style="color:#a92c30">'+r.score.toFixed(1)+'%</b></td><td>'+r.top.toFixed(1)+'%</td><td>'+esc(r.hit)+'</td><td>'+esc(r.domain)+'</td></tr>').join('')
    :'<tr><td colspan="12" class="empty">▤<br><br>暂无符合条件的分析日志</td></tr>';
  $('#rcAnalysisCount').textContent=found.length;
}
function analysisLogDetail(id){
  const r=rcAnalysisRows.find(x=>x.id===id);if(!r)return;
  const rows=[['分析编号',r.id],['分析时间',r.at],['目录类型',r.type],['目标目录',r.own],['目标目录标识',r.ownId],['相似目录',r.peer],['相似目录标识',r.peerId],['综合相似度',r.score.toFixed(1)+'%'],['最高字段得分',r.top.toFixed(1)+'%'],['命中字段',r.hit],['来源域',r.domain]];
  const cell='padding:9px 12px;border-bottom:1px solid rgba(0,0,0,.07);font-size:13px';
  $('#overlay').innerHTML='<div class="veil" style="display:flex;align-items:center;justify-content:center;z-index:80">'
    +'<section class="dialog" role="dialog" aria-modal="true" aria-labelledby="alog-title" data-req-page="regionCatalog-analysisLog" data-req-surface="regionCatalog.analysisLog.dialog" data-req-layer="dialog" data-req-title="分析日志详情" style="width:min(620px,92vw);background:#fff;border-radius:12px;box-shadow:0 18px 60px rgba(0,0,0,.22)">'
    +'<div class="dialog-head" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid rgba(0,0,0,.08)"><h2 id="alog-title" style="font-size:16px;margin:0">分析日志详情</h2><button class="close" onclick="simClose()" aria-label="关闭" style="border:0;background:none;font-size:20px;cursor:pointer">×</button></div>'
    +'<div style="padding:16px 18px" '+req('regionCatalog.analysisLog','regionCatalog.analysisLog.dialog.detail')+'><div style="display:grid;grid-template-columns:132px 1fr;border:1px solid rgba(0,0,0,.08);border-radius:8px;overflow:hidden">'
    +rows.map(x=>'<div style="'+cell+';background:#f7f9fc;color:#65748a">'+x[0]+'</div><div style="'+cell+'">'+esc(x[1])+'</div>').join('')
    +'</div></div>'
    +'<footer class="dialog-footer" style="padding:12px 18px;border-top:1px solid rgba(0,0,0,.08);text-align:right" '+req('regionCatalog.analysisLog','regionCatalog.analysisLog.dialog.actions')+'><button class="btn" onclick="simClose()">关闭</button></footer>'
    +'</section></div>';
}
function analysisLogQuery(){rcAnalysisDraw();toast('查询完成')}
function analysisLogReset(){['rcq0','rcq2','rcq3','rcq4'].forEach(k=>$('#'+k).value='');['rcq1','rcq5'].forEach(k=>$('#'+k).selectedIndex=0);rcAnalysisDraw()}
const SQ_NODE_DEFS = [
  ['N0', '区域目录归集'],
  ['N1', '目录标准化封装'],
  ['N2', '区域节点上报队列'],
  ['N3', '接入链路传输'],
  ['N4', '全域节点接收'],
  ['N5', '全域节点回执确认']
];
const SQ_STATE = {
  NORMAL: { label: '正常', cls: 'normal', rank: 0 },
  UNKNOWN: { label: '未知', cls: 'unknown', rank: 1 },
  DELAYED: { label: '延迟', cls: 'delayed', rank: 2 },
  ABNORMAL: { label: '异常', cls: 'abnormal', rank: 3 }
};
const SQ_LEVELS = [
  { key: 'L1', label: '一级 · 黄色', cls: 'lv1', multiple: 1 },
  { key: 'L2', label: '二级 · 橙色', cls: 'lv2', multiple: 2 },
  { key: 'L3', label: '三级 · 红色', cls: 'lv3', multiple: 4 }
];
const SQ_TASKS = [
  {
    view: 'TASK',
    taskId: 'CAT-REPORT-20261116-0003',
    taskStatus: '同步完成',
    overallPercentage: 100,
    snapshotTime: '2026-11-16 09:42:18',
    configIntervalSeconds: 300,
    records: 1280,
    durationSeconds: 240,
    successBatches: 128,
    totalBatches: 128,
    states: [
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'DELAYED', progress: 80, stagnant: 420, detail: '等待下一批' },
      { status: 'UNKNOWN', progress: null, detail: '全域节点回执待确认' }
    ],
    checksum: { send: 'e10adc3949ba59abbe56e057f20f883e', recv: 'e10adc3949ba59abbe56e057f20f883e' }
  },
  {
    view: 'TASK',
    taskId: 'CAT-REPORT-20261116-0002',
    taskStatus: '同步完成',
    overallPercentage: 100,
    snapshotTime: '2026-11-16 08:15:06',
    configIntervalSeconds: 300,
    records: 1180,
    durationSeconds: 236,
    successBatches: 126,
    totalBatches: 128,
    states: [
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'DELAYED', progress: 62, stagnant: 780, detail: '批次传输停滞' },
      { status: 'ABNORMAL', progress: null, detail: '全域节点离线' },
      { status: 'DELAYED', progress: 55, stagnant: 610, detail: '等待回执窗口' }
    ],
    checksum: { send: '7d5a3c91e0b8426fa18c34d2e97b05f1c', recv: '7d5a3c91e0b8426fa18c34d2e97b05f1c' }
  },
  {
    view: 'TASK',
    taskId: 'CAT-REPORT-20261115-0001',
    taskStatus: '同步完成',
    overallPercentage: 100,
    snapshotTime: '2026-11-15 22:03:41',
    configIntervalSeconds: 300,
    records: 1350,
    durationSeconds: 270,
    successBatches: 124,
    totalBatches: 128,
    states: [
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'NORMAL', progress: 100, detail: '已完成' },
      { status: 'DELAYED', progress: 71, stagnant: 1320, detail: '链路超时未推进' },
      { status: 'DELAYED', progress: 64, stagnant: 1250, detail: '等待全域节点回执' },
      { status: 'UNKNOWN', progress: null, detail: '全域节点回执待确认' }
    ],
    checksum: { send: 'c4f90b2a61d83e5709af2bc46d18e3c05', recv: 'c4f90b2a61d83e5709af2bc46d18e3c05' }
  }
];

const SQ_FLOW = ['下载模板', '上传前预览', '预校验', '上传建任务', '进度 / 完整性', '上报任务列表'];
const SQ_CAT_TYPES = ['数据产品', '数据资源', '业务节点'];
const SQ_UPLOAD_STATUS = ['部分失败', '失败', '断点续传', '已完成'];
const SQ_UPLOAD_MODES = ['整体上传', '断点续传'];
const SQ_UPLOADS = [
  { no: 'UPL5acd0ffb047a1', type: '数据产品', file: 'catalog_report_upload_20261116_001.xlsx', size: '12.4 KB', mode: '整体上传', uploader: 'yangyan', status: '部分失败', total: 15, ok: 9, fail: 6, start: '2026-11-16 09:46:00', end: '2026-11-16 09:47:02', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPL5cc0f8fe2d4b7', type: '数据产品', file: 'catalog_report_upload_20261116_002.xlsx', size: '12.4 KB', mode: '整体上传', uploader: 'yangyan', status: '部分失败', total: 15, ok: 9, fail: 6, start: '2026-11-16 09:36:38', end: '2026-11-16 09:37:52', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPL35844ad8cbb02', type: '数据产品', file: 'catalog_report_upload_20261116_003.xlsx', size: '12.4 KB', mode: '整体上传', uploader: 'yangyan', status: '失败', total: 15, ok: 0, fail: 15, start: '2026-11-16 09:30:37', end: '2026-11-16 09:31:38', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPL1e8ccd45305c9', type: '数据资源', file: 'catalog_report_upload_20261116_004.xlsx', size: '12.4 KB', mode: '整体上传', uploader: 'yangyan', status: '失败', total: 0, ok: 0, fail: 0, start: '2026-11-16 10:29:59', end: '2026-11-16 10:29:59', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPLcbcaae0601338', type: '数据资源', file: '资源配置导入模板（数据资源）.xlsx', size: '5.0 KB', mode: '整体上传', uploader: 'yangyan', status: '失败', total: 0, ok: 0, fail: 0, start: '2026-11-13 17:27:57', end: '2026-11-13 17:28:04', taskId: 'CAT-REPORT-20261115-0001' },
  { no: 'UPLca9254ae66a12b', type: '数据资源', file: '资源配置导入模板（数据资源）.xlsx', size: '5.0 KB', mode: '整体上传', uploader: 'yangyan', status: '失败', total: 0, ok: 0, fail: 0, start: '2026-11-13 17:01:28', end: '2026-11-13 17:01:29', taskId: 'CAT-REPORT-20261115-0001' },
  { no: 'UPL0090b5aad64d41', type: '业务节点', file: '上报业务节点模板（区域节点）.xlsx', size: '10.2 KB', mode: '断点续传', uploader: 'yangyan', status: '失败', total: 2, ok: 0, fail: 2, start: '2026-10-23 15:04:20', end: '2026-10-23 15:04:23', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPL4e41b43bc3e56', type: '业务节点', file: '上报业务节点模板（区域节点）.xlsx', size: '10.2 KB', mode: '整体上传', uploader: 'yangyan', status: '失败', total: 1, ok: 0, fail: 1, start: '2026-09-28 14:25:55', end: '2026-09-28 14:25:57', taskId: 'CAT-REPORT-20261116-0002' },
  { no: 'UPL7c63338687f40', type: '业务节点', file: '上报模板_3.xlsx', size: '9.4 KB', mode: '整体上传', uploader: '1762325', status: '已完成', total: 1, ok: 1, fail: 0, start: '2026-09-24 14:24:57', end: '2026-09-24 14:26:46', taskId: 'CAT-REPORT-20261116-0003' },
  { no: 'UPLneed8d0da7e6', type: '业务节点', file: '上报模板_3.xlsx', size: '9.4 KB', mode: '整体上传', uploader: 'yangyan', status: '已完成', total: 1, ok: 1, fail: 0, start: '2026-11-04 11:56:36', end: '2026-11-04 11:58:54', taskId: 'CAT-REPORT-20261116-0003' }
];
let sqSelUploadNo = SQ_UPLOADS[0].no;
let sqSelTaskId = SQ_UPLOADS[0].taskId;
let sqSelNodeCode = '';

function sqUploadProgress(u) { return u.total ? Math.round((u.ok / u.total) * 100) : 0; }
function sqCurrentTask() { return SQ_TASKS.find((t) => t.taskId === sqSelTaskId) || SQ_TASKS[0]; }
function sqUploadFilter() {
  const typ = $('#sqUpType') ? $('#sqUpType').value : '';
  const st = $('#sqUpStatus') ? $('#sqUpStatus').value : '';
  const md = $('#sqUpMode') ? $('#sqUpMode').value : '';
  const from = $('#sqUpFrom') ? $('#sqUpFrom').value : '';
  const to = $('#sqUpTo') ? $('#sqUpTo').value : '';
  return SQ_UPLOADS.filter((u) =>
    (!typ || u.type === typ) && (!st || u.status === st) && (!md || u.mode === md) &&
    (!from || u.start.slice(0, 10) >= from) && (!to || u.start.slice(0, 10) <= to)
  );
}
function sqNodes(t) {
  return SQ_NODE_DEFS.map((d, i) => {
    const s = t.states[i];
    return {
      code: d[0], name: d[1], orderNo: i + 1,
      progress: s.progress === null ? null : s.progress,
      status: s.status,
      stagnantSeconds: s.status === 'DELAYED' ? s.stagnant : null,
      effectiveThresholdSeconds: t.configIntervalSeconds,
      lastProgressTime: s.lastProgressTime || t.snapshotTime,
      detail: s.detail
    };
  });
}
function sqEdges(t) {
  const ns = sqNodes(t);
  return ns.slice(0, -1).map((n, i) => ({
    fromNode: n.code, toNode: ns[i + 1].code,
    status: SQ_STATE[ns[i + 1].status].rank >= SQ_STATE[n.status].rank ? ns[i + 1].status : n.status
  }));
}
function sqLevel(n, t) {
  if (n.status === 'ABNORMAL') return SQ_LEVELS[2];
  if (n.status !== 'DELAYED') return null;
  const base = n.effectiveThresholdSeconds || t.configIntervalSeconds;
  const s = n.stagnantSeconds || 0;
  let hit = null;
  SQ_LEVELS.forEach((l) => { if (s >= l.multiple * base) hit = l; });
  return hit;
}
function sqTaskWarnings(t) {
  return sqNodes(t).map((n) => ({ node: n, level: sqLevel(n, t) })).filter((x) => x.level);
}
function sqChecksums() {
  const seq = {};
  return SQ_TASKS.map((t) => {
    const day = t.snapshotTime.slice(0, 10).replace(/-/g, '');
    seq[day] = (seq[day] || 0) + 1;
    return {
      id: 'JY-' + day + '-' + String(seq[day]).padStart(3, '0'),
      taskId: t.taskId, object: '目录批次文件',
      send: t.checksum.send, recv: t.checksum.recv,
      same: t.checksum.send === t.checksum.recv,
      date: t.snapshotTime.slice(0, 10), time: t.snapshotTime
    };
  });
}
function sqMetrics(t) {
  const delayed = sqNodes(t).filter((n) => n.status === 'DELAYED');
  return {
    status: t.taskStatus,
    overall: t.overallPercentage,
    success: ((t.successBatches / t.totalBatches) * 100).toFixed(1),
    avg: delayed.length ? Math.round(delayed.reduce((a, n) => a + n.stagnantSeconds, 0) / delayed.length) : 0,
    throughput: ((t.records / t.durationSeconds) * 60).toFixed(1)
  };
}
function sqFill(tbodyId, countId, rows, colspan, rowFn) {
  const el = document.getElementById(tbodyId);
  if (!el) return;
  el.innerHTML = rows.length ? rows.map(rowFn).join('') :
    '<tr><td colspan="' + colspan + '" class="empty">暂无符合条件的记录</td></tr>';
  const c = document.getElementById(countId);
  if (c) c.textContent = rows.length;
}
function sqTool(name) { if (name === '上传建任务') { sqUploadTaskOpen(); return; } toast(name); }
function sqExport() { toast('导出完成'); }
function sqListQuery() { sqUploadListDraw(); toast('查询完成'); }
function sqListReset() {
  ['sqUpFrom', 'sqUpTo'].forEach((k) => { const e = $('#' + k); if (e) e.value = ''; });
  ['sqUpType', 'sqUpStatus', 'sqUpMode'].forEach((k) => { const e = $('#' + k); if (e) e.selectedIndex = 0; });
  sqUploadListDraw();
}
function sqUploadListDraw() {
  const rows = sqUploadFilter();
  sqFill('sqUpRows', 'sqUpCount', rows, 13, (u, i) => {
    const p = sqUploadProgress(u);
    const cls = u.status === '已完成' ? 'is-ok' : u.status === '断点续传' ? 'is-lv1' : 'is-lv3';
    return '<tr class="' + (u.no === sqSelUploadNo ? 'is-selected' : '') + '" onclick="sqPickUpload(\'' + u.no + '\',\'\')">' +
      '<td>' + (i + 1) + '</td><td class="sq-mono">' + esc(u.no) + '</td><td>' + esc(u.type) + '</td>' +
      '<td>' + esc(u.file) + '</td><td>' + esc(u.size) + '</td><td>' + esc(u.mode) + '</td><td>' + esc(u.uploader) + '</td>' +
      '<td><span class="sq-pill ' + cls + '">' + esc(u.status) + '</span></td>' +
      '<td><div class="sq-progress"><div class="sq-progress-bar"><span style="width:' + p + '%"></span></div><b>' + p + '%</b></div></td>' +
      '<td>' + u.total + ' / ' + u.ok + ' / ' + u.fail + '</td><td>' + esc(u.start) + '</td><td>' + esc(u.end) + '</td>' +
      '<td class="sq-ops">' +
      '<button class="sq-link" onclick="event.stopPropagation();sqOpenL1(\'detail\',\'' + u.no + '\')">详情</button>' +
      '</td></tr>';
  });
}
function sqPickUpload(no, anchor) {
  const u = SQ_UPLOADS.find((x) => x.no === no);
  if (!u) return;
  sqSelUploadNo = u.no;
  sqSelTaskId = u.taskId;
  sqSelNodeCode = '';
  sqUploadListDraw();
  sqQualityDraw();
  if (anchor) {
    const el = document.getElementById(anchor);
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function sqPickNode(code) {
  sqSelNodeCode = code;
  sqQualityDraw();
}
function sqQualityDraw() {
  const task = sqCurrentTask();
  const m = sqMetrics(task);
  const selUp = SQ_UPLOADS.find((x) => x.no === sqSelUploadNo);
  $('#sqContext').innerHTML =
    '<span>当前上报任务 <b>' + esc(selUp ? selUp.no : task.taskId) + '</b></span>' +
    '<span>目录类型 <b>' + esc(selUp ? selUp.type : '—') + '</b></span>' +
    '<span>关联同步快照 <b>' + esc(task.taskId) + '</b></span>' +
    '<span>快照时间 <b>' + esc(task.snapshotTime) + '</b></span>';
  $('#sqStats').innerHTML = [
    ['同步成功率', m.success + '%', '', false],
    ['平均延迟', String(m.avg), '秒', false],
    ['吞吐量', m.throughput, '条/分钟', false]
  ].map((x) => '<article class="sq-stat"><div class="sq-stat-label">' + x[0] +
    '</div><div class="sq-stat-value' + (x[3] ? ' is-text' : '') + '">' + x[1] +
    (x[2] ? '<span class="sq-stat-unit">' + x[2] + '</span>' : '') + '</div></article>').join('');
  sqTopoDraw(task);
  sqWarnDraw(task);
  sqFill('sqCheckRows', 'sqCheckCount',
    sqChecksums().filter((c) => c.taskId === task.taskId), 9,
    (c, i) => '<tr><td>' + (i + 1) + '</td><td class="sq-mono">' + esc(c.id) + '</td><td class="sq-mono">' + esc(c.taskId) + '</td><td>' + esc(c.object) + '</td><td class="sq-mono">' + esc(c.send) + '</td><td class="sq-mono">' + esc(c.recv) + '</td><td><span class="sq-pill ' + (c.same ? 'is-ok' : 'is-lv3') + '">' + (c.same ? '一致' : '不一致') + '</span></td><td>' + esc(c.time) + '</td><td>' + sqDlgLink('报告明细', 'checksum', c.id) + '</td></tr>');
}
function sqTopoDraw(task) {
  const nodes = sqNodes(task), edges = sqEdges(task);
  const levels = {};
  nodes.forEach((n) => { const l = sqLevel(n, task); if (l) levels[n.code] = l; });
  if (!sqSelNodeCode) {
    const rank = { L1: 1, L2: 2, L3: 3 };
    const first = nodes.filter((n) => levels[n.code]).sort((a, b) =>
      rank[levels[b.code].key] - rank[levels[a.code].key] || a.orderNo - b.orderNo)[0];
    sqSelNodeCode = first ? first.code : nodes[0].code;
  }
  $('#sqTopo').innerHTML = nodes.map((n, i) => {
    const meta = SQ_STATE[n.status], lv = levels[n.code];
    const card = '<div class="sq-node is-' + meta.cls + (lv ? ' is-' + lv.cls : '') +
      (sqSelNodeCode === n.code ? ' is-picked' : '') + 
      '" onclick="sqPickNode(\'' + n.code + '\')">' +
      '<div class="sq-node-head"><span class="sq-node-code">' + n.code + '</span><span class="sq-node-badges">' +
      '<span class="sq-pill is-' + meta.cls + '">' + meta.label + '</span>' +
      (lv ? '<span class="sq-pill is-' + lv.cls + '">' + lv.label + '</span>' : '') + '</span></div>' +
      '<div class="sq-node-name">' + esc(n.name) + '</div>' +
      '<div class="sq-node-meta">链路顺序 <b>' + n.orderNo + '</b></div>' +
      '<div class="sq-bar"><span style="width:' + (n.progress === null ? 0 : n.progress) + '%"></span></div>' +
      '<div class="sq-node-meta">阶段进度 <b>' + (n.progress === null ? '—' : n.progress + '%') + '</b>' +
      (n.status === 'DELAYED' ? '<br>停滞 <b>' + n.stagnantSeconds + ' 秒</b> · 生效阈值 <b>' + n.effectiveThresholdSeconds + ' 秒</b>' : '') +
      '<br>最后推进 <b>' + esc(n.lastProgressTime) + '</b><br>' + esc(n.detail) +
      '<div class="sq-node-ops"><button class="sq-link" onclick="event.stopPropagation();sqDlgOpen(\'node\',\'' + n.code + '\')">节点详情 ›</button></div></div></div>';
    return card + (i < edges.length ? '<div class="sq-edge is-' + SQ_STATE[edges[i].status].cls + '" title="' + edges[i].fromNode + ' → ' + edges[i].toNode + '"></div>' : '');
  }).join('');
}
function sqWarnDraw(task) {
  const nodes = sqNodes(task);
  const all = sqTaskWarnings(task);
  const rank = { L1: 1, L2: 2, L3: 3 };
  const shown = all.slice()
    .sort((a, b) => rank[b.level.key] - rank[a.level.key] || a.node.orderNo - b.node.orderNo);
  if (!sqSelNodeCode || !nodes.some((n) => n.code === sqSelNodeCode)) {
    const first = shown.length ? shown[0].node : null;
    sqSelNodeCode = first ? first.code : nodes[0].code;
  }
  const counts = { L1: 0, L2: 0, L3: 0 };
  shown.forEach((w) => { counts[w.level.key] += 1; });
  const summary = SQ_LEVELS.map((l) => '<span class="sq-warn-total is-' + l.cls + '">' + l.label + ' <b>' + counts[l.key] + '</b></span>').join('');
  const picked = nodes.find((n) => n.code === sqSelNodeCode) || nodes[0];
  const plv = sqLevel(picked, task);
  const fields = [
    ['节点编码', picked.code], ['节点名称', picked.name], ['链路顺序', String(picked.orderNo)],
    ['节点状态', SQ_STATE[picked.status].label], ['阶段进度', picked.progress === null ? '—' : picked.progress + '%'],
    ['停滞秒数', picked.stagnantSeconds === null ? '—' : picked.stagnantSeconds + ' 秒'],
    ['生效阈值', picked.effectiveThresholdSeconds + ' 秒'],
    ['触发时间', task.snapshotTime], ['状态说明', picked.detail]
  ];
  const detail = '<div class="sq-warn-detail"><div class="sq-warn-detail-head"><b>' + esc(picked.code + ' · ' + picked.name) + '</b><span>' +
    (plv ? '<span class="sq-pill is-' + plv.cls + '">' + plv.label + '</span>' : '<span class="sq-pill is-ok">当前无预警</span>') +
    ' <button class="sq-link" onclick="sqDlgOpen(\'node\',\'' + picked.code + '\')">节点详情 ›</button></span></div>' +
    '<div class="sq-warn-fields">' + fields.map((f) => '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>').join('') + '</div></div>';
  const chips = shown.length
    ? shown.map((w) => '<button class="sq-warn-chip is-' + w.level.cls + (w.node.code === sqSelNodeCode ? ' is-picked' : '') + '" onclick="sqPickNode(\'' + w.node.code + '\')">' +
      esc(w.node.code + ' · ' + w.node.name) + '<span>' + w.level.label + '</span></button>').join('')
    : '<span class="sq-warn-none">当前无预警节点</span>';
  $('#sqWarnBody').innerHTML = '<div class="sq-warn-summary">' + summary + '</div>' +
    '<div class="sq-warn-grid">' + detail + '<div class="sq-warn-list"><div class="sq-warn-list-title">预警节点</div>' + chips + '</div></div>';
}
const SQDLG = {
  detail: 'regionCatalog.syncQuality.dialog.detail',
  node: 'regionCatalog.syncQuality.dialog.node',
  checksum: 'regionCatalog.syncQuality.dialog.checksum'
};
const SQ_MODAL_Z = 1200;
const SQ_MODAL_MAX = 2;

function sqUpload() { return SQ_UPLOADS.find((u) => u.no === sqSelUploadNo) || SQ_UPLOADS[0]; }
function sqDlgKv(pairs) {
  return '<dl class="sq-dlg-kv">' + pairs.map((p) =>
    '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(String(p[1])) + '</dd></div>').join('') + '</dl>';
}
function sqDlgBlock(surface, suffix, title, body) {
  return '<section class="sq-dlg-block" ' + req(surface, surface + '.' + suffix) +
    '><h4>' + esc(title) + '</h4>' + body + '</section>';
}
function sqDlgLink(label, kind, arg) {
  return '<button class="sq-link" onclick="sqDlgOpen(\'' + kind + '\'' +
    (arg ? ',\'' + arg + '\'' : '') + ')">' + esc(label) + '</button>';
}

const SQ_DLG_SPEC = {
  detail: () => {
    const u = sqUpload(), t = sqCurrentTask(), m = sqMetrics(t), s = SQDLG.detail;
    return {
      title: '上报任务详情 · ' + u.no, short: '任务详情', surface: s,
      html: sqDlgBlock(s, 'info', '基本信息', sqDlgKv([
        ['任务ID', u.no], ['目录类型', u.type], ['文件名', u.file], ['大小', u.size],
        ['上传方式', u.mode], ['上传人', u.uploader], ['上报状态', u.status],
        ['开始时间', u.start], ['结束时间', u.end]
      ])) + sqDlgBlock(s, 'batches', '上报批次统计', sqDlgKv([
        ['总批次', u.total], ['成功批次', u.ok], ['失败批次', u.fail],
        ['整体进度', sqUploadProgress(u) + '%']
      ])) + sqDlgBlock(s, 'snapshot', '关联同步快照', sqDlgKv([
        ['快照任务ID', t.taskId], ['快照时间', t.snapshotTime], ['任务状态', t.taskStatus],
        ['目录记录数', t.records], ['同步成功率', m.success + '%']
      ]))
    };
  },
  node: (arg) => {
    const t = sqCurrentTask(), nodes = sqNodes(t), edges = sqEdges(t);
    const code = arg || sqSelNodeCode || nodes[0].code;
    const n = nodes.find((x) => x.code === code) || nodes[0];
    const i = nodes.indexOf(n), lv = sqLevel(n, t), s = SQDLG.node;
    const up = i > 0 ? edges[i - 1] : null, down = i < edges.length ? edges[i] : null;
    return {
      title: '节点详情 · ' + n.code + ' ' + n.name, short: '节点 ' + n.code, surface: s,
      html: sqDlgBlock(s, 'info', '节点基本信息', sqDlgKv([
        ['节点编码', n.code], ['节点名称', n.name], ['链路顺序', n.orderNo],
        ['节点状态', SQ_STATE[n.status].label], ['阶段进度', n.progress === null ? '—' : n.progress + '%'],
        ['停滞秒数', n.stagnantSeconds === null ? '—' : n.stagnantSeconds + ' 秒'],
        ['生效阈值', n.effectiveThresholdSeconds + ' 秒'], ['最后推进', n.lastProgressTime],
        ['状态说明', n.detail]
      ])) + sqDlgBlock(s, 'link', '链路位置', sqDlgKv([
        ['上游节点', up ? up.fromNode : '—'], ['入边状态', up ? SQ_STATE[up.status].label : '—'],
        ['下游节点', down ? down.toNode : '—'], ['出边状态', down ? SQ_STATE[down.status].label : '—'],
        ['快照任务', t.taskId], ['快照时间', t.snapshotTime]
      ])) + sqDlgBlock(s, 'warning', '预警信息', sqDlgKv([
        ['预警级别', lv ? lv.label : '当前无预警'], ['节点状态', SQ_STATE[n.status].label],
        ['停滞秒数', n.stagnantSeconds === null ? '—' : n.stagnantSeconds + ' 秒'],
        ['生效阈值', n.effectiveThresholdSeconds + ' 秒'], ['触发时间', t.snapshotTime],
        ['状态说明', n.detail]
      ]))
    };
  },
  checksum: (arg) => {
    const t = sqCurrentTask(), list = sqChecksums().filter((c) => c.taskId === t.taskId);
    const c = list.find((x) => x.id === arg) || list[0] || sqChecksums().find((x) => x.taskId === t.taskId);
    const s = SQDLG.checksum;
    return {
      title: '校验报告明细 · ' + (c ? c.id : '—'), short: '报告明细', surface: s,
      html: sqDlgBlock(s, 'info', '报告基本信息', sqDlgKv([
        ['报告编号', c ? c.id : '—'], ['上报任务', c ? c.taskId : '—'],
        ['校验对象', c ? c.object : '—'], ['生成时间', c ? c.time : '—'],
        ['一致性', c ? (c.same ? '一致' : '不一致') : '—']
      ])) + sqDlgBlock(s, 'md5', 'MD5 对照', sqDlgKv([
        ['发送端 MD5', c ? c.send : '—'], ['接收端 MD5', c ? c.recv : '—'],
        ['比对结果', c ? (c.same ? '一致' : '不一致') : '—']
      ]))
    };
  }
};

function sqModalRootEl() {
  let root = document.getElementById('sqModalRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'sqModalRoot';
    document.body.appendChild(root);
  }
  return root;
}
function sqModalRender() {
  const root = sqModalRootEl(), top = sqModalStack.length - 1;
  root.innerHTML = sqModalStack.map((m, i) => {
    const isTop = i === top, shift = (top - i) * 18;
    const crumbs = ['<button class="sq-dlg-crumb" onclick="sqModalCloseAll()">同步管理</button>'];
    sqModalStack.slice(0, i + 1).forEach((x, j) => {
      crumbs.push(j === i
        ? '<span class="sq-dlg-crumb is-current">' + esc(x.short) + '</span>'
        : '<button class="sq-dlg-crumb" onclick="sqModalTruncate(' + j + ')">' + esc(x.short) + '</button>');
    });
    return '<div class="sq-dlg-veil' + (isTop ? ' is-top' : ' is-under') +
      '" style="z-index:' + (SQ_MODAL_Z + (i + 1) * 20) + ';--sq-shift:' + shift + 'px" ' +
      'onclick="sqModalVeilClick(event,' + i + ')">' +
      '<section class="sq-dlg sq-dlg-lv' + (i + 1) + '" role="dialog" aria-modal="' +
      (isTop ? 'true' : 'false') + '" tabindex="-1"' + (isTop ? '' : ' aria-hidden="true" inert') +
      ' data-req-page="regionCatalog-syncQuality" data-req-surface="' + m.surface +
      '" data-req-layer="dialog" data-req-title="' + esc(m.title) + '" data-sq-level="' + (i + 1) + '">' +
      '<header class="sq-dlg-head" ' + req(m.surface, m.surface + '.head') + '>' +
      '<div class="sq-dlg-head-main"><div class="sq-dlg-path">' +
      crumbs.join('<span class="sq-dlg-crumb-sep">›</span>') + '</div><h3>' + esc(m.title) + '</h3></div>' +
      '<div class="sq-dlg-head-tools"><span class="sq-dlg-level">第 ' + (i + 1) + ' 层</span>' +
      (i > 0 ? '<button class="sq-dlg-btn" onclick="sqModalPop()">← 返回上级</button>' : '') +
      '<button class="sq-dlg-close" aria-label="关闭当前层" onclick="sqModalPop()">×</button></div></header>' +
      '<div class="sq-dlg-body">' + m.html + '</div>' +
      '<footer class="sq-dlg-foot" ' + req(m.surface, m.surface + '.actions') + '>' +
      '<button class="btn" onclick="sqModalCloseAll()">关闭全部</button>' +
      '<button class="btn primary" onclick="sqModalPop()">' + (i > 0 ? '返回上级' : '关闭') +
      '</button></footer></section></div>';
  }).join('');
  document.body.classList.toggle('sq-dlg-open', sqModalStack.length > 0);
  const focusTarget = root.querySelector('.sq-dlg-veil.is-top .sq-dlg');
  if (focusTarget) { try { focusTarget.focus(); } catch (e) {} }
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
function sqModalPop() {
  if (!sqModalStack.length) return;
  sqModalStack.pop();
  sqModalRender();
}
function sqModalTruncate(index) {
  while (sqModalStack.length > index + 1) sqModalStack.pop();
  sqModalRender();
}
function sqModalCloseAll() {
  if (!sqModalStack.length && !document.getElementById('sqModalRoot')) return;
  sqModalStack = [];
  sqModalRender();
}
function sqModalVeilClick(e, i) {
  if (e.target === e.currentTarget && i === sqModalStack.length - 1) sqModalPop();
}
function sqDlgOpen(kind, arg) {
  if (!SQ_DLG_SPEC[kind] || sqModalStack.length >= SQ_MODAL_MAX) return;
  const spec = SQ_DLG_SPEC[kind](arg);
  sqModalStack.push({ key: kind, title: spec.title, short: spec.short, surface: spec.surface, html: spec.html });
  sqModalRender();
}
function sqOpenL1(kind, no) {
  if (no) sqPickUpload(no, '');
  sqModalCloseAll();
  sqDlgOpen(kind);
}
(function () {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sqModalStack.length) { e.preventDefault(); sqModalPop(); }
  });
  const d = new URLSearchParams(location.search).get('dialog');
  if (d && SQ_DLG_SPEC[d]) {
    let opened = false;
    const auto = function () { if (opened) return; opened = true; sqDlgOpen(d); };
    window.addEventListener('load', function () { setTimeout(auto, 350); });
    setTimeout(auto, 600);
  }
})();


function syncQualityRender() {
  const opt = (arr) => arr.map((x) => '<option value="' + x + '">' + x + '</option>').join('');
  const tools = ['模板下载', '上传建任务', '上传前预览', '预校验', '上报频率', '网络状态']
    .map((x) => '<button class="btn" onclick="sqTool(\'' + x + '\')">' + x + '</button>').join('');
  $('#catbody').innerHTML =
    '<div class="sq-page" data-req-surface="regionCatalog.syncQuality" data-req-page="regionCatalog-syncQuality" data-req-title="区域目录管理系统 · 目录同步 / 同步管理">' +
    '<section class="sq-panel sq-query-panel"><h3 class="sq-panel-title sq-query-title">查询条件</h3>' +
    '<div class="sq-query-grid" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.query') + '>' +
    '<label class="sq-field"><span>目录类型</span><select id="sqUpType"><option value="">全部</option>' + opt(SQ_CAT_TYPES) + '</select></label>' +
    '<label class="sq-field"><span>上报状态</span><select id="sqUpStatus"><option value="">全部</option>' + opt(SQ_UPLOAD_STATUS) + '</select></label>' +
    '<label class="sq-field"><span>上传方式</span><select id="sqUpMode"><option value="">全部</option>' + opt(SQ_UPLOAD_MODES) + '</select></label>' +
    '<label class="sq-field"><span>上报时间</span><span class="sq-date-range"><input type="date" id="sqUpFrom"><span>至</span><input type="date" id="sqUpTo"></span></label>' +
    '<div class="sq-actions sq-query-actions" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.actions') + '>' +
    '<button class="btn primary" onclick="sqListQuery()">查询</button> <button class="btn" onclick="sqListReset()">重置</button> <button class="btn" onclick="sqExport()">导出</button></div>' +
    '</div></section>' +
    '<section class="sq-panel" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.table') + '>' +
    '<h3 class="sq-panel-title">上报任务列表</h3>' +
    '<div class="sq-toolbar" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.toolbar') + '>' + tools + '</div>' +
    '<div class="sq-table-wrap"><table class="sq-table sq-up-table" style="width:100%"><thead><tr><th>序号</th><th>任务ID</th><th>目录类型</th><th>文件名</th><th>大小</th><th>上传方式</th><th>上传人</th><th>状态</th><th>整体进度</th><th>总/成功/失败</th><th>开始时间</th><th>结束时间</th><th>操作</th></tr></thead><tbody id="sqUpRows"></tbody></table></div>' +
    '<div class="sq-count">共 <span id="sqUpCount">0</span> 条</div></section>' +
    '<div class="sq-section-label">同步质量保证</div>' +
    '<div class="sq-context" id="sqContext" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.context') + '></div>' +
    '<section class="sq-stats" id="sqStats" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.stats') + '></section>' +
    '<section class="sq-panel" id="sqTopoPanel" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.topology') + '>' +
    '<h3 class="sq-panel-title">全链路监控拓扑</h3><div class="sq-topo" id="sqTopo"></div></section>' +
    '<section class="sq-panel" id="sqWarnPanel" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.warningInfo') + '>' +
    '<h3 class="sq-panel-title">预警信息</h3><div id="sqWarnBody"></div></section>' +
    '<section class="sq-panel" id="sqCheckPanel" ' + req('regionCatalog.syncQuality', 'regionCatalog.syncQuality.checksum') + '>' +
    '<h3 class="sq-panel-title">完整性校验报告</h3><div class="sq-table-wrap"><table class="sq-table" style="width:100%"><thead><tr><th>序号</th><th>报告编号</th><th>上报任务</th><th>校验对象</th><th>发送端 MD5</th><th>接收端 MD5</th><th>一致性</th><th>生成时间</th><th>操作</th></tr></thead><tbody id="sqCheckRows"></tbody></table></div>' +
    '<div class="sq-count">共 <span id="sqCheckCount">0</span> 条</div></section></div>';
  sqUploadListDraw(); sqQualityDraw();
}

(function () {
  const p = new URLSearchParams(location.search);
  if (p.get('view') === 'regionCatalog') {
    section = 'catalog';
    catalogTab = 'riskLog';
    catalogRender();
  }
  if (p.get('view') === 'syncQuality' || p.get('view') === 'syncManage') {
    section = 'catalog';
    catalogTab = 'syncQuality';
    catalogRender();
  }
})();
