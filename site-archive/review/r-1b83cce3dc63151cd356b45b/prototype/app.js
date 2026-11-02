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
      `<div class="launch"><div class="hero"><span class="eyebrow">• LAUNCHPAD</span><h1>快捷入口</h1><p>选择业务子系统，快速开始工作</p></div><div class="cards">${names.map((n, i) => `<article class="card ${selectedSystem === i ? 'selected' : ''}" tabindex="0" ${selectedSystem === i ? 'aria-current="true"' : ''} onfocusin="selectSystem(${i})" onkeydown="if(event.target===this && (event.key==='Enter' || event.key===' ')){event.preventDefault();this.click()}" ${req(i === 3 ? 'node.enter' : i === 4 ? 'catalog.browse' : 'system.' + i)} onclick="selectSystem(${i});${i === 3 ? "section='home';render()" : i === 4 ? 'catalogOpen()' : "toast('当前服务暂不可用，请稍后重试')"}"><span class="num">0${i + 1}</span><div class="icon" style="--light:${colors[i][0]};--dark:${colors[i][1]}">${icons[i]}</div><h2>${n}</h2><p>业务子系统</p><button class="enter">立即进入</button><span class="arrow">→</span></article>`).join('')}</div></div>`;
    return;
  }
  if (section === 'home') {
    $('#main').innerHTML =
      `<div class="workspace"><div class="crumb">业务节点管理系统 / 系统首页</div><div class="pageheading"><div><h1>业务节点管理系统</h1><span class="muted">统一管理业务节点接入，保障服务合规运行</span></div><span class="muted"></span></div><div class="summary panel" ${req('node.statistics')}><article>接入登记总数<strong>${rows.length}</strong><span class="muted">登记记录</span></article><article>待人工审核<strong>${rows.length}</strong><span class="muted">机器审核通过后进入</span></article><article>已完成审核<strong>0</strong><span class="muted">人工审核完成的登记</span></article></div><div class="panel"><h3>快捷操作</h3><p class="muted">发起业务节点接入登记，完成材料填报与审核</p><button class="btn primary" ${req('node.review')} onclick="section='review';render()">接入登记审核 →</button></div><div class="panel"><h3>接入审核流程</h3><div class="auditsteps">① 填写登记与上传材料　 →　 ② 机器内容审核　 →　 ③ 提交成功　 →　 ④ 人工审核</div><p class="muted">内容安全检查覆盖登记文本及上传材料。模型异常时保留草稿，禁止直接进入人工审核。</p></div></div>`;
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
    `<div class="veil"><section class="modal"><div class="modalhead">新增接入注册<button class="close" onclick="closeForm()">×</button></div><div class="modalbody"><div class="notice">ⓘ 点击提交审核后，系统先对填写的文字进行敏感词审核，通过后进入人工审核。</div><form id="registration" onsubmit="submitRegistration(event)"><div class="formgrid">${fields.map(field).join('')}<div class="field full" ${req('node.field.description')}><label class="required">业务简介</label><textarea name="description" required placeholder="请输入业务功能简介"></textarea></div><div class="field full" ${req('node.material')}><label class="required">核心业务证明材料</label><div class="content">${upload('上传证明材料', 'core')}</div></div><div class="field full" ${req('node.material', 'node.material.filename')}><label>证明材料文件名</label><input name="filename" placeholder="请输入业务功能证明材料文件名"></div><div class="field full" ${req('node.material')}><label>登记材料</label><div class="content" style="display:flex;justify-content:space-between"><div>${upload('上传营业执照', 'license')}</div><div>${upload('上传法人身份证', 'identity')}</div><div>${upload('上传服务承诺书', 'promise')}</div></div></div><div class="field full" ${req('node.templates')} style="align-items:flex-start"><label style="padding-top:15px">登记材料模板</label><div class="content"><div class="templates">${['营业执照模板', '身份证模板', '服务承诺书模板'].map((n, i) => `<div class="template"><h3><span>${['▤', '♙', '♧'][i]}</span>${n}<a href="./template-${i}.txt" download>↓ 下载模板</a></h3><p>${['请下载营业执照模板，按格式准备企业营业执照副本扫描件或复印件，确保统一社会信用代码、企业名称、法定代表人等信息清晰可辨。', '请下载身份证模板，按格式准备法定代表人身份证正反面扫描件或照片，确保姓名、身份证号码、有效期等关键信息完整清晰。', '请下载服务承诺书模板，按照模板填写并加盖企业公章后上传，承诺书内容应包含服务内容、服务期限、责任义务等相关条款。'][i]}</p></div>`).join('')}</div><div class="tip">🟠 请下载模板后按要求填写，填写完成后将扫描件或照片上传至对应登记材料区域。模板仅供参考。</div></div></div><div class="field full" ${req('node.field.remark')}><label>备注</label><textarea name="remark" placeholder="请输入备注说明"></textarea></div><div class="field full" ${req('node.endpoint')} style="align-items:flex-start"><label class="required" style="padding-top:12px">业务节点地址</label><div class="content"><div id="addresses"></div><button type="button" class="link" onclick="addAddress()">＋ 添加地址</button></div></div></div></form></div><div class="modalfoot"><button class="btn" onclick="closeForm()">取消</button><button type="button" class="btn riskpreview" ${req('node.machineAudit', 'node.machineAudit.preview')} onclick="previewCurrentRisk()">测试机机器审核不通过页面</button><button class="btn" onclick="saveDraft()">保存草稿</button><button class="btn primary" form="registration" type="submit" ${req('node.submit')}>提交审核</button></div></section></div>`;
  addAddress();
  const draft = sessionStorage.getItem('node-draft');
  if (draft) {
    const d = JSON.parse(draft);
    for (const [k, v] of Object.entries(d)) {
      const el = $(`[name="${k}"]`);
      if (el) el.value = v;
    }
  }
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
function saveDraft() {
  sessionStorage.setItem(
    'node-draft',
    JSON.stringify(Object.fromEntries(new FormData($('#registration'))))
  );
  toast('草稿已保存，重新打开时请补充上传证明材料。');
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
    sessionStorage.removeItem('node-draft');
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
  section = 'review';
  nav();
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 接入登记审核 ×</span></div><div class="registration-page"><section class="panel querypanel" ${req('node.query')}><div class="querygrid">${['业务节点登记名称', '业务节点标识', '状态', '统一社会信用代码', '所属法人或组织名称', '所属法人身份标识'].map((n, i) => `<label>${n}${i === 2 ? '<select id="state"><option>请选择</option><option>待人工审核</option></select>' : `<input id="${i === 0 ? 'search' : 'filter-' + i}" placeholder="请输入">`}</label>`).join('')}</div><div class="queryactions"><button class="btn primary" onclick="drawRows()">⌕ 查询</button><button class="btn" onclick="document.querySelectorAll('.querygrid input').forEach(e=>e.value='');$('#state').selectedIndex=0;drawRows()">↻ 重置</button></div></section><section class="panel listpanel"><div class="listtools"><button class="btn" ${req('node.create')} onclick="openForm()">＋ 新增</button><button class="btn" onclick="toast('批量导入服务暂不可用，请稍后重试')">↥ 批量导入</button><button class="btn" onclick="toast('标识样式设置暂不可用，请稍后重试')">⚑ 调整标识样式</button><span style="margin-left:auto;color:#98a5b6">↻　⊞</span></div><table><thead><tr>${['业务节点登记名称', '业务节点标识', '所属法人或其他组织名称', '所属法人身份标识', '统一社会信用代码', '操作'].map((n) => '<th>' + n + '</th>').join('')}</tr></thead><tbody id="rows"></tbody></table><div class="pagination" id="pagination"></div></section></div>`;
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
  showAudit('risk', { preview: true });
}
function previewRisk() {
  openForm();
  fillDemo();
  $('[name=description]').value = '提供区域数据交换服务，登记内容包含需复核的风险表述。';
  auditScenario = 'risk';
  pending = Object.fromEntries(new FormData($('#registration')));
  showAudit('risk');
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
if (new URLSearchParams(location.search).get('view')) section = 'review';
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
  $('#sidebar').innerHTML =
    `<div class="nav ${['list','detail'].includes(catalogTab)?'active':''}" onclick="catalogTab='list';catalogRender()">▦　数据目录</div><div class="nav ${catalogTab==='logs'?'active':''}" onclick="catalogTab='logs';catalogRender()">▤　查询审计</div><div class="nav ${catalogTab==='alerts'?'active':''}" onclick="catalogTab='alerts';catalogRender()">♧　风险事件</div><div class="nav ${catalogTab==='profile'?'active':''}" onclick="catalogTab='profile';catalogRender()">◎　用户风险画像</div>`;
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="section='launch';render()">首页</span><span class="selected">● 数据目录</span></div><div class="catalog"><div class="cat-toolbar"><span>${catalogTab === 'detail' ? '数据目录 / 数据目录详情' : catalogTab === 'logs' ? '查询安全 / 查询日志' : catalogTab === 'alerts' ? '查询安全 / 风险预警' : catalogTab === 'profile' ? '查询安全 / 风险行为画像' : '数据目录'}</span><div><button class="btn" onclick="catalogTab='list';catalogRender()">数据目录</button> <button class="btn" ${req('catalog.audit')} onclick="catalogTab='logs';catalogRender()">查询日志</button> <button class="btn" ${req('catalog.alert')} onclick="catalogTab='alerts';catalogRender()">风险预警 ${catalogAlerts.length ? '(' + catalogAlerts.length + ')' : ''}</button> <button class="btn" ${req('catalog.profile')} onclick="catalogTab='profile';catalogRender()">风险画像</button></div></div><div id="catbody"></div></div>`;
  if (catalogTab === 'list') catalogList();
  if (catalogTab === 'detail') catalogDetail();
  if (catalogTab === 'logs') catalogAudit();
  if (catalogTab === 'alerts') catalogWarnings();
  if (catalogTab === 'profile') catalogProfile();
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
  record.id=id;record.count=count;record.target=$('#cq2')?.value||'全部数据目录';record.resultSummary=why?'策略拒绝，未执行目录查询':'返回公开目录元数据 '+count+' 条';catalogLogs.unshift(record);
  if (why) {
    let event=catalogAlerts.find(a=>a.uid==='GOV-1001'&&a.why===(why.includes('高频')?'高频访问':why)&&a.state==='待研判'); if(event)event.evidenceIds.push(id);else catalogAlerts.unshift({id,uid:'GOV-1001',why:why.includes('高频')?'高频访问':why,time:record.time,state:'待研判',evidenceIds:[id]});
    $('#overlay').innerHTML =
      `<div class="veil"><div class="auditbox"><div class="auditmark" style="color:#d45353">!</div><h2>查询已被安全策略阻断</h2><p>${why.includes('高频') ? '最近连续 60 秒查询 ' + queryTimes.length + ' 次，超过 50 次阈值。请在冷却期结束后重试。' : why === '越权访问' ? '当前身份无权查询该资源，请联系管理员核实权限。' : '一次性令牌已使用，请重新认证后再查询。'}</p><p>请求编号：${id}<br>已记录审计轨迹并生成风险预警，本次未执行数据查询。</p><button class="btn primary" onclick="$('#overlay').innerHTML=''">我知道了</button></div></div>`;
  } else toast('查询完成，返回 ' + count + ' 条目录，已记录审计日志');
}
// All records below are labelled prototype fixtures, never production audit evidence.
const auditActors = [
  {uid:'GOV-1001',name:'政府用户 A',role:'政府用户',org:'示例政务部门',ip:'192.0.2.18'},
  {uid:'ENT-2001',name:'企业用户 A',role:'企业用户',org:'示例数据服务企业',ip:'198.51.100.26'},
  {uid:'GOV-1002',name:'政府用户 B',role:'政府用户',org:'示例文旅部门',ip:'192.0.2.32'},
  {uid:'ENT-2002',name:'企业用户 B',role:'企业用户',org:'示例旅游运营企业',ip:'203.0.113.42'}
];
let auditSeeded=false, auditPage=1, auditProfileUid='ENT-2001', auditFilters={key:'',role:'',mode:'',status:'',day:'2026-11-02'};
const auditWindows=new Map();
function auditEvaluate(uid,now=Date.now(),reason='') {
  const state=auditWindows.get(uid)||{times:[],until:0};
  state.times=state.times.filter(t=>now-t<60000);state.times.push(now);
  let why=state.until>now?'高频访问阻断期':state.times.length>50?'高频访问':reason==='permission'?'越权访问':reason==='token'?'令牌重放':'';
  if(why==='高频访问')state.until=now+60000;
  auditWindows.set(uid,state);
  return {why,frequency:state.times.length,until:state.until};
}
function auditMakeRecord(actor,mode,at,index,why='',frequency=1){
  const ts=new Date(at),stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(ts);
  return {id:'TR-'+ts.getTime()+'-'+index,at:ts.toISOString(),time:stamp,...actor,user:actor.name+' / '+actor.uid,target:products[0],productId:'691500000736550152L500039D0G2KDI',mode,source:'区域目录节点',destination:mode==='跨域调用'?'外域目录节点（示例）':'本地目录节点',count:why?0:1,status:why?'已阻断':'成功',http:why?(why.includes('高频')?429:403):200,why,frequency,token:'jti-masked-'+index,duration:why?8:mode==='跨域调用'?186:42,policy:'RATE-USER-60S-50 / v1',filter:{productName:products[0],provider:'中国移动通信集团重庆有限公司',securityLevel:'公开'},resultSummary:why?'策略拒绝，未执行目录查询':'返回公开目录元数据 1 条；不含产品数据文件',demo:true};
}
function auditSeed(){
  if(auditSeeded)return;auditSeeded=true;
  // A complete >50 burst: same authenticated enterprise identity across both call modes.
  const burst=Date.parse('2026-11-02T10:24:00+08:00');
  for(let i=0;i<62;i++)catalogLogs.push(auditMakeRecord(auditActors[1],i%2?'跨域调用':'本地查询',burst+i*650,'B'+i,i>=50?(i===50?'高频访问':'高频访问阻断期'):'',i+1));
  for(let i=0;i<96;i++)catalogLogs.push(auditMakeRecord(auditActors[i%4],i%3===0?'跨域调用':'本地查询',Date.parse('2026-11-02T08:00:00+08:00')+i*75000,'N'+i));
  for(let i=0;i<3;i++)catalogLogs.push(auditMakeRecord(auditActors[3],'跨域调用',Date.parse('2026-11-02T10:29:00+08:00')+i*12000,'P'+i,'越权访问',i+1));
  catalogLogs.sort((a,b)=>b.at.localeCompare(a.at));
  for(const actor of [auditActors[1],auditActors[3]]){const records=catalogLogs.filter(r=>r.uid===actor.uid&&r.why);catalogAlerts.push({id:records[0].id,uid:actor.uid,why:actor.uid==='ENT-2001'?'高频访问':'越权访问',time:records[records.length-1].time,state:'待研判',evidenceIds:records.map(r=>r.id),note:''});}
}
function auditSelected(){return catalogLogs.filter(r=>(!auditFilters.day||r.time.startsWith(auditFilters.day))&&(!auditFilters.key||(r.user+r.org+r.ip+r.id+r.target).toLowerCase().includes(auditFilters.key.toLowerCase()))&&(!auditFilters.role||r.role===auditFilters.role)&&(!auditFilters.mode||r.mode===auditFilters.mode)&&(!auditFilters.status||r.status===auditFilters.status));}
function auditApply(){auditFilters={key:$('#logkey').value.trim(),role:$('#logrole').value,mode:$('#logmode').value,status:$('#logstatus').value,day:$('#logday').value};auditPage=1;catalogAudit();}
function auditSelectUser(uid){auditFilters.key=uid;auditPage=1;catalogTab='logs';catalogRender();}
function catalogAudit(){
  auditSeed();const logs=auditSelected(),bad=logs.filter(r=>r.why),users=new Set(logs.map(r=>r.uid)),cross=logs.filter(r=>r.mode==='跨域调用');
  const opts=(values,current)=>'<option value="">全部</option>'+values.map(v=>`<option ${current===v?'selected':''}>${v}</option>`).join('');
  $('#catbody').innerHTML=`<div class="audit-heading"><div><h1>查询审计</h1><p>追踪每一次数据访问，识别异常行为与跨域风险</p></div><div><span class="demo-label">演示数据</span> <button class="btn" ${req('catalog.query','catalog.query.demo')} onclick="auditSimulate()">演示高频阻断</button></div></div>
  <div class="audit-notice" ${req('catalog.alert','catalog.alert.banner')}><span class="notice-icon">!</span><div><b>${catalogAlerts.filter(a=>a.state==='待研判').length} 个风险事件待研判</b><span>单用户滚动 60 秒 &gt; 50 次触发阻断；跨本地查询与跨域调用合并计数。阻断返回 HTTP 429。</span></div><button class="link" onclick="catalogTab='alerts';catalogRender()">查看风险事件 →</button></div>
  <section class="audit-filters panel" ${req('catalog.audit','catalog.audit.filters')}><label>查询日期<input type="date" id="logday" value="${auditFilters.day}"></label><label class="wide">用户 / IP / Trace ID / 产品<input id="logkey" value="${esc(auditFilters.key)}" placeholder="输入关键词检索"></label><label>用户类型<select id="logrole">${opts(['政府用户','企业用户'],auditFilters.role)}</select></label><label>调用方式<select id="logmode">${opts(['本地查询','跨域调用'],auditFilters.mode)}</select></label><label>返回状态<select id="logstatus">${opts(['成功','已阻断'],auditFilters.status)}</select></label><button class="btn primary" onclick="auditApply()">查询</button><button class="btn" onclick="auditFilters={key:'',role:'',mode:'',status:'',day:'2026-11-02'};auditPage=1;catalogAudit()">重置</button></section>
  <div class="audit-stats" ${req('catalog.audit','catalog.audit.statistics')}>${[['查询总量',logs.length,'含成功与阻断请求','blue'],['活跃用户',users.size,'按认证用户 ID 去重','blue'],['跨域调用',cross.length,'跨域占比 '+(logs.length?(cross.length/logs.length*100).toFixed(1):'0.0')+'%','blue'],['已阻断请求',bad.length,'阻断率 '+(logs.length?(bad.length/logs.length*100).toFixed(1):'0.0')+'%','red']].map(([name,value,note,color])=>`<article><span>${name}</span><strong class="${color}">${value.toLocaleString()}<small> ${name==='活跃用户'?'人':'次'}</small></strong><p>${note}</p></article>`).join('')}</div>
  <div class="audit-analysis"><section class="panel" ${req('catalog.audit','catalog.audit.trend')}><div class="audit-section-head"><h3>查询访问趋势</h3><span><i class="legend blue-bg"></i>成功 <i class="legend red-bg"></i>已阻断</span></div>${auditTrend(logs)}<p class="audit-caption">30 分钟聚合 · 单位：次 · 与当前筛选联动</p></section><section class="panel" ${req('catalog.profile','catalog.profile.ranking')}><div class="audit-section-head"><h3>风险用户分布</h3><span>按阻断次数排序</span></div>${auditRanking(logs)}<p class="audit-caption">规则命中为待研判风险线索，需人工复核</p></section></div>
  <section class="panel audit-log-panel" ${req('catalog.audit','catalog.audit.table')}><div class="audit-section-head"><h3>查询日志明细 <span class="count-pill">${logs.length}</span></h3><button class="btn" onclick="downloadCatalogLogs()">↓ 导出筛选日志</button></div><div class="audit-table-scroll"><table><thead><tr>${['查询时间 / Trace ID','用户身份 / 机构','来源 IP / 调用方式','查询对象','返回结果','风险识别','操作'].map(n=>`<th>${n}</th>`).join('')}</tr></thead><tbody>${logs.slice((auditPage-1)*8,auditPage*8).map(r=>`<tr><td>${r.time}<small class="trace-id">${r.id}</small></td><td><b>${esc(r.name)}</b> <span class="role-pill">${r.role}</span><small>${esc(r.org)} · ${r.uid}</small></td><td class="ip-cell">${r.ip}<small>${r.mode}</small></td><td>${esc(r.target)}<small>公开 · 目录元数据</small></td><td><span class="audit-badge ${r.why?'danger':'success'}">${r.status}</span><small>HTTP ${r.http} · ${r.count} 条 · ${r.duration} ms</small></td><td><span class="${r.why?'risk-text':'muted'}">${r.why||'正常访问'}</span>${r.why.includes('高频')?`<small>滚动 60 秒 ${r.frequency} 次</small>`:''}</td><td><button class="link" onclick="catalogTrace('${r.id}')">链路详情</button><br><button class="link" onclick="auditShowProfile('${r.uid}')">用户画像</button></td></tr>`).join('')||'<tr><td colspan="7" class="empty">暂无匹配日志，请调整筛选条件。</td></tr>'}</tbody></table></div><div class="audit-pagination"><span>共 ${logs.length} 条 · 每页 8 条</span><div><button class="btn" ${auditPage===1?'disabled':''} onclick="auditPage--;catalogAudit()">上一页</button> ${auditPage} / ${Math.max(1,Math.ceil(logs.length/8))} <button class="btn" ${auditPage*8>=logs.length?'disabled':''} onclick="auditPage++;catalogAudit()">下一页</button></div></div></section><p class="audit-caption">统计范围：当前筛选的查询请求；查询、筛选或手动刷新后重新计算。示例固定日期 2026-11-02，无生产数据接入。</p>`;
}
function auditTrend(logs){
  if(!logs.length)return '<div class="empty">暂无趋势数据</div>';
  const first=Math.floor(Math.min(...logs.map(r=>Date.parse(r.at)))/1800000)*1800000,last=Math.floor(Math.max(...logs.map(r=>Date.parse(r.at)))/1800000)*1800000;
  const length=Math.min(48,Math.round((last-first)/1800000)+1),buckets=Array.from({length},(_,i)=>({at:first+i*1800000,good:0,bad:0}));
  logs.forEach(r=>{const b=buckets[Math.floor((Date.parse(r.at)-first)/1800000)];if(b)b[r.why?'bad':'good']++});
  const max=Math.max(1,...buckets.map(b=>b.good+b.bad));
  return `<div class="audit-bars"><span class="axis">${max}<br><br>${Math.round(max/2)}<br><br>0</span>${buckets.map(b=>{const label=new Date(b.at).toLocaleTimeString('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'});return `<div class="bar-column" title="${label} 成功 ${b.good} 次，阻断 ${b.bad} 次"><div class="bar-track"><div class="bar-stack" style="height:${(b.good+b.bad)/max*100}%"><div class="red-bg" style="flex:${b.bad}"></div><div class="blue-bg" style="flex:${b.good}"></div></div></div><small>${label}</small></div>`}).join('')}</div>`;
}
function auditRanking(logs){
 const ranking=auditActors.map(a=>({...a,count:logs.filter(r=>r.uid===a.uid&&r.why).length})).filter(a=>a.count).sort((a,b)=>b.count-a.count);
 return ranking.map((a,i)=>`<button class="risk-user" onclick="auditShowProfile('${a.uid}')"><span class="rank">0${i+1}</span><span><b>${a.name}</b><small>${a.uid} · ${a.role}</small></span><span class="risk-meter"><i style="width:${a.count/ranking[0].count*100}%"></i></span><strong>${a.count}<small> 次</small></strong><span>›</span></button>`).join('')||'<div class="empty">当前范围内无异常访问</div>';
}
function auditShowProfile(uid){auditProfileUid=uid;$('#overlay').innerHTML='';catalogTab='profile';catalogRender();}
function catalogTrace(id){
 const r=catalogLogs.find(x=>x.id===id);if(!r){toast('未找到该请求');return}
 const blocked=!!r.why,tokenFail=r.why==='令牌重放',permissionFail=r.why==='越权访问';
 const stages=[['请求接入','已接收','Trace ID '+r.id+'；'+r.source+' → '+r.destination],['身份认证与令牌校验',tokenFail?'拒绝':'通过',r.uid+' · '+r.role+'；令牌仅记录脱敏标识 '+r.token],['访问权限判定',tokenFail?'未执行':permissionFail?'拒绝':'通过',tokenFail?'上游拒绝，跳过':permissionFail?'资源授权范围不匹配':'公开目录元数据读取权限通过 / ABAC v1'],['行为与频率检测',tokenFail||permissionFail?'未执行':blocked?'已阻断':'通过',tokenFail||permissionFail?'权限或认证拒绝，跳过':'同一用户滚动 60 秒 '+r.frequency+' 次；阈值 > 50 / RATE-USER-60S-50 v1'],['目录查询 / 跨域转发',blocked?'未执行':'已完成',blocked?'网关拒绝，未向目录节点发起查询':r.source+' → '+r.destination],['响应与审计记录','已记录','HTTP '+r.http+' · '+r.count+' 条 · '+r.duration+' ms；'+r.resultSummary]];
 $('#overlay').innerHTML=`<div class="veil"><div class="auditbox audit-detail"><h2>查询全链路详情<button class="close" aria-label="关闭详情" onclick="$('#overlay').innerHTML=''">×</button></h2><p class="muted">${r.time} · <span class="demo-label">演示轨迹</span></p><div class="trace-summary"><span>用户<b>${r.name} / ${r.uid}</b></span><span>来源 IP<b>${r.ip}</b></span><span>查询对象<b>${esc(r.target)}</b></span><span>调用方式<b>${r.mode}</b></span></div><details><summary>查询参数与响应摘要（脱敏）</summary><pre>${esc(JSON.stringify({traceId:r.id,productId:r.productId,query:r.filter,response:{status:r.http,returnedCount:r.count,summary:r.resultSummary}},null,2))}</pre></details><ol class="trace audit-timeline">${stages.map(([name,status,note])=>`<li><b>${name}</b><span class="audit-badge ${status==='拒绝'||status==='已阻断'?'danger':status==='未执行'?'neutral':'success'}">${status}</span><p>${esc(note)}</p></li>`).join('')}</ol><p class="audit-caption">返回结果仅保留条数、资源范围及脱敏摘要。原型不提供真实日志归档与防篡改能力。</p><button class="btn primary" onclick="auditShowProfile('${r.uid}')">查看该用户风险画像</button></div></div>`;
}
function catalogWarnings(){
 auditSeed();$('#catbody').innerHTML=`<div class="audit-heading"><div><h1>风险事件</h1><p>自动阻断与人工研判分离，保留处置依据及关联证据</p></div><span class="demo-label">演示数据</span></div><section class="panel" ${req('catalog.alert')}><div class="audit-notice"><span class="notice-icon">!</span><div><b>高频规则：同一认证用户滚动 60 秒超过 50 次</b><span>第 51 次起阻断；本地与跨域合并计数。演示冷却 60 秒，生产冷却时长待安全策略确认。风险事件按同用户、同规则聚合。</span></div></div><table><thead><tr><th>首次触发 / 事件</th><th>风险主体</th><th>检测依据</th><th>系统动作</th><th>研判状态</th><th>操作</th></tr></thead><tbody>${catalogAlerts.map((a,i)=>{const r=catalogLogs.find(r=>r.id===a.id);return `<tr><td>${a.time}<small>${a.why}</small></td><td>${r.name} · ${r.uid}<small>${r.role} / ${r.ip}</small></td><td>${a.why.includes('高频')?'60 秒内第 51 次命中阈值':'资源不在授权范围'}<small>关联 ${a.evidenceIds?.length||1} 次阻断请求</small></td><td><span class="audit-badge danger">自动阻断</span><small>未执行数据查询</small></td><td>${esc(a.state)}${a.note?`<small>依据：${esc(a.note)}</small><small>${a.resolvedAt||''}</small>`:''}</td><td><button class="link" onclick="catalogTrace('${a.id}')">证据链</button> <button class="link" onclick="auditShowProfile('${a.uid}')">画像</button> <button class="link" ${a.state!=='待研判'?'disabled':''} onclick="catalogResolve(${i})">研判</button></td></tr>`}).join('')||'<tr><td colspan="6" class="empty">暂无风险事件</td></tr>'}</tbody></table></section>`;
}
function catalogResolve(i){
 $('#overlay').innerHTML=`<div class="veil"><div class="auditbox"><h2>风险研判<button class="close" onclick="$('#overlay').innerHTML=''">×</button></h2><p>事件对象：${catalogAlerts[i].uid} · ${catalogAlerts[i].why}</p><label>研判结论 <select id="resolution"><option>确认风险</option><option>业务正常</option><option>规则误报</option></select></label><p><textarea maxlength="500" id="resolutionNote" placeholder="填写研判依据（必填，最多 500 字）"></textarea></p><p class="muted">保存研判仅关闭本事件，不解除访问控制策略。</p><button class="btn primary" onclick="auditResolve(${i})">保存研判</button> <button class="btn" onclick="$('#overlay').innerHTML=''">取消</button></div></div>`;
}
function auditResolve(i){const note=$('#resolutionNote').value.trim();if(!note){toast('请填写研判依据');return}Object.assign(catalogAlerts[i],{state:'已关闭 / '+$('#resolution').value,note,resolvedAt:new Date().toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}),resolvedBy:'安全分析员（演示）'});$('#overlay').innerHTML='';catalogRender();toast('研判已记录（本次演示会话）');}
function catalogProfile(){
 auditSeed();const actor=auditActors.find(a=>a.uid===auditProfileUid)||auditActors[0],logs=catalogLogs.filter(r=>r.uid===actor.uid),bad=logs.filter(r=>r.why),peak=Math.max(0,...logs.map(r=>r.frequency));
 $('#catbody').innerHTML=`<div class="audit-heading"><div><h1>用户风险画像</h1><p>依据访问证据生成行为标签，供安全团队复核</p></div><select aria-label="选择画像用户" onchange="auditProfileUid=this.value;catalogProfile()">${auditActors.map(a=>`<option value="${a.uid}" ${a.uid===actor.uid?'selected':''}>${a.name} / ${a.uid}</option>`).join('')}</select></div><section class="panel" ${req('catalog.profile')}><div class="audit-profile-head"><span class="avatar">${actor.role==='政府用户'?'政':'企'}</span><div><h2>${actor.name} <span class="audit-badge ${bad.length?'danger':'success'}">${bad.length?'命中风险规则 · 待复核':'未命中风险规则'}</span></h2><p>${actor.uid} · ${actor.role} · ${actor.org}</p></div><span class="demo-label">演示画像</span></div><div class="audit-stats">${[['累计查询',logs.length+' 次'],['阻断请求',bad.length+' 次'],['60 秒峰值',peak+' 次'],['来源 IP',new Set(logs.map(r=>r.ip)).size+' 个']].map(([name,value])=>`<article><span>${name}</span><strong>${value}</strong></article>`).join('')}</div><div class="profile-columns"><div><h3>行为标签与判断依据</h3>${['高频访问','越权访问','令牌重放'].map(n=>`<p><span class="audit-badge ${bad.some(r=>r.why.includes(n))?'danger':'neutral'}">${n}</span>　命中 ${bad.filter(r=>r.why.includes(n)).length} 次</p>`).join('')}<p>异常率：${logs.length?(bad.length/logs.length*100).toFixed(1):'0.0'}%（阻断请求 / 总请求）</p></div><div><h3>访问范围</h3><p>本地查询 ${logs.filter(r=>r.mode==='本地查询').length} 次 · 跨域调用 ${logs.filter(r=>r.mode==='跨域调用').length} 次</p><p>查询对象：景区游客大数据报告</p><p>来源 IP：${[...new Set(logs.map(r=>r.ip))].join('、')||'无'}</p><p>最近访问：${logs[0]?.time||'无'}</p></div></div><p class="audit-caption">范围：该用户当前演示会话内全部记录（不继承日志筛选）；每次打开重新计算。标签为规则命中事实，不代表恶意行为结论。</p><button class="btn primary" onclick="auditFilters={key:'${actor.uid}',role:'',mode:'',status:'',day:''};auditPage=1;catalogTab='logs';catalogRender()">查看关联日志</button></section>`;
}
function downloadCatalogLogs(){const logs=auditSelected(),ids=new Set(logs.map(r=>r.id)),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({demo:true,exportedAt:new Date().toISOString(),filters:auditFilters,logs,alerts:catalogAlerts.filter(a=>(a.evidenceIds||[a.id]).some(id=>ids.has(id)))},null,2)],{type:'application/json'}));a.download='查询审计日志-演示.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('已导出当前筛选范围的日志与关联预警');}
function auditSimulate(){
 auditSeed();const uid='ENT-2002';auditWindows.delete(uid);let result;
 for(let i=0;i<51;i++){result=auditEvaluate(uid);const record=auditMakeRecord(auditActors[3],i%2?'跨域调用':'本地查询',Date.now(),'SIM'+catalogLogs.length,result.why,result.frequency);catalogLogs.unshift(record);if(result.why)catalogAlerts.unshift({id:record.id,uid,why:result.why,time:record.time,state:'待研判',evidenceIds:[record.id],note:''});}
 auditFilters={key:uid,role:'',mode:'',status:'',day:''};auditPage=1;catalogAudit();
 const record=catalogLogs[0];$('#overlay').innerHTML=`<div class="veil"><div class="auditbox"><h2>第 51 次查询已实时阻断</h2><p>企业用户 B / ENT-2002 在滚动 60 秒内发起 51 次查询。前 50 次允许，第 51 次返回 HTTP 429，返回 0 条，未执行目录查询。</p><p>已生成 51 条演示日志和 1 个风险事件。冷却截止：${new Date(result.until).toLocaleTimeString('zh-CN',{timeZone:'Asia/Shanghai'})}。</p><p class="muted">这是浏览器内规则演示；生产系统需由网关或后端实施阻断。</p><button class="btn primary" onclick="catalogTrace('${record.id}')">查看阻断轨迹</button> <button class="btn" onclick="$('#overlay').innerHTML=''">查看日志</button></div></div>`;
}

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

if (['catalog','audit'].includes(new URLSearchParams(location.search).get('view'))) { catalogOpen(); if(new URLSearchParams(location.search).get('view')==='audit'){catalogTab='logs';catalogRender();} }

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
    const main = $('#main'),
      catalog = section === 'catalog';
    const titles = {
      list: '数据目录',
      detail: '数据目录详情',
      logs: '查询日志',
      alerts: '风险识别与预警',
      profile: '风险行为画像'
    };
    surface(
      main,
      catalog ? 'catalog' : 'home',
      catalog ? 'catalog.' + catalogTab : section === 'launch' ? 'portal' : 'registration.list',
      catalog ? titles[catalogTab] : section === 'launch' ? '快捷入口' : '接入登记审核'
    );
    document
      .querySelectorAll('header,#sidebar,.systemtabs,.cat-toolbar')
      .forEach((el) => attribute(el, 'data-req-context-ignore', ''));
    if (!catalog) anchor($('.registration-page'), 'node.review');
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
        ? dialog.querySelector('.trace')
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
          resolve: '风险研判',
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
            : type === 'resolve'
              ? 'catalog.alert'
              : 'catalog.query'
          : 'node.review',
        catalog ? 'catalog.' + type : 'node.review.detail'
      );
    }
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
