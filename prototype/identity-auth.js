/* 主体身份管理系统 · 身份登陆认证服务
   页面按需求只保留「内置认证方式清单」：查询条件 + 清单表格（含行内配置弹窗）。
   原需求：系统内置身份认证方式，支持认证方式的灵活配置与管理；系统管理员可预设
   启用/禁用规则、优先级排序规则及适用主体范围。内置三种：账号密码认证、
   手机验证码认证、CA数字证书认证。 */
const IAA_METHOD_SOURCE = ['本系统支持账号密码认证','本系统支持手机验证码认证','本系统支持CA数字证书认证'];
const IAA_REQ = 'identity.auth.service';
const IAA_DIALOG_REQ = 'identity.auth.service.dialog';
const IAA_PAGE_ID = 'identity-auth-service';

/* 内置认证方式：名称、需求出处、启用状态、优先级、适用主体范围、适用业务场景。
   主体类型沿用系统已有的个人/企业/经办人；场景枚举为原型落地补充，非原需求给定。 */
let iaaMethods = [
  {name:'账号密码认证', source:IAA_METHOD_SOURCE[0], enabled:'启用', priority:1, subjects:['个人','企业','经办人'], scenes:['通用登录','业务办理'], lockAttempts:5, lockUnit:'分钟', lockValue:30, updated:'2026-11-13 09:20:00', disabledReason:''},
  {name:'手机验证码认证', source:IAA_METHOD_SOURCE[1], enabled:'启用', priority:2, subjects:['个人','经办人'], scenes:['通用登录','业务办理'], lockAttempts:5, lockUnit:'分钟', lockValue:30, updated:'2026-11-13 09:20:00', disabledReason:''},
  {name:'CA数字证书认证', source:IAA_METHOD_SOURCE[2], enabled:'启用', priority:3, subjects:['企业','经办人'], scenes:['业务办理','高安全业务办理'], lockAttempts:null, lockUnit:null, lockValue:null, updated:'2026-11-13 09:20:00', disabledReason:''}
];
const IAA_LOCK_METHODS = ['账号密码认证','手机验证码认证'];
const IAA_LOCK_RANGES = { '分钟': {min:1, max:1440, def:30}, '小时': {min:1, max:24, def:1} };
const IAA_LOCK_ATTEMPTS = {min:1, max:10, def:5};
const iaaState = { dialogTarget:'' };
const iaaReq = (r, el) => req(r, el);
const iaaBadge = (s, cls) => `<span class="ai-badge ${cls || ''}">${esc(s)}</span>`;
const iaaNote = text => `<p class="iaa-note">${text}</p>`;
const iaaHead = (title, bodyId, ph) => `<div class="ai-list-head"><h3>${title}</h3><input class="iaa-search" placeholder="${ph || '输入关键字查询'}" oninput="iaaFilter(this,'${bodyId}')" aria-label="${title}关键字查询"></div>`;
const iaaTable = (heads, rows, bodyId) => `<div class="ai-table"><table><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody id="${bodyId}">${rows}</tbody></table></div>`;
const iaaRow = (cells, i) => `<tr><td>${i + 1}</td>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
const iaaFilter = (input, bodyId) => {
  const kw = input.value.trim();
  document.querySelectorAll('#' + bodyId + ' tr').forEach(tr => { tr.style.display = !kw || tr.textContent.includes(kw) ? '' : 'none'; });
};

/* —— 页面：仅内置认证方式清单 —— */
function iaaOpen() {
  section = 'identityAuth';
  $('#overlay').innerHTML = '';
  const u = new URL(location.href);
  u.searchParams.set('system', 'identity');
  u.searchParams.set('view', 'auth-service');
  ['kind','auditType','review','dialog'].forEach(k => u.searchParams.delete(k));
  history.replaceState(null, '', u);
  render();
}
function iaaRender() {
  document.querySelector('header b').textContent = '主体身份管理系统';
  $('#sidebar').innerHTML = identitySidebar('auth');
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="section='launch';history.replaceState(null,'','?system=management');render()">首页</span><span class="selected">● 身份登陆认证服务</span></div>` +
    `<div class="ai-page iaa-page" data-req-page="${IAA_PAGE_ID}" data-req-surface="${IAA_REQ}" data-req-title="身份登陆认证服务">` +
    `<div class="crumb">主体身份管理系统 / 身份登陆认证服务</div>` +
    iaaMethodsBlock() +
    `</div>`;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
function iaaMethodRows() {
  return iaaMethods.slice().sort((a, b) => a.priority - b.priority).map((m, i) => iaaRow([
    `<b>${esc(m.name)}</b>`, esc(m.source), iaaBadge(m.enabled, m.enabled === '启用' ? 'green' : 'red'),
    String(m.priority), m.subjects.map(esc).join('、'), m.scenes.map(esc).join('、'),
    esc(m.updated), `<button class="btn" ${iaaReq(IAA_REQ, 'identity.auth.service.methods.config')} onclick="iaaConfigDialog('${m.name}')">配置</button>`
  ], i)).join('');
}
function iaaMethodsBlock() {
  return `<section class="iaa-sec" ${iaaReq(IAA_REQ, 'identity.auth.service.methods')}>` +
    iaaHead('内置认证方式清单', 'iaa-methods-body', '输入关键字查询认证方式清单') +
    iaaTable(['序号','认证方式名称','需求出处','启用状态','优先级','适用主体范围','适用业务场景','最近更新时间','操作'], iaaMethodRows(), 'iaa-methods-body') +
    iaaNote('清单仅包含原需求给定的三种内置认证方式，不支持新增或删除；行内「配置」可调整启用状态、优先级，以及账号密码认证 / 手机验证码认证的连续错误次数与账号自动锁定时长（分钟 / 小时可选）；适用主体范围与适用业务场景列为静态展示，不在弹窗中修改。') + `</section>`;
}

/* —— 弹窗：认证方式配置（独立 surface，内部按语义块拆分） —— */
function iaaClose() {
  $('#overlay').innerHTML = '';
  iaaState.dialogTarget = '';
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
function iaaDialogShell(title, surfaceId, body, foot) {
  $('#overlay').innerHTML = `<div class="veil"><section class="modal ai-modal iaa-modal" role="dialog" aria-modal="true" tabindex="-1" aria-label="${title}" data-req-page="${IAA_PAGE_ID}" data-req-surface="${surfaceId}" data-req-layer="dialog" data-req-title="${title}"><div class="modalhead">${title}<button class="close" onclick="iaaClose()">×</button></div><div class="modalbody">${body}</div><div class="modalfoot">${foot}</div></section></div>`;
  window.dispatchEvent(new CustomEvent('ai-prototype:context-changed'));
}
const iaaBlock = (reqId, el, title, body) => `<div class="iaa-block" ${iaaReq(reqId, el)}><h3>${title}</h3>${body}</div>`;
const iaaKv = pairs => `<div class="iaa-kv">${pairs.map(([k, v]) => `<div>${k}：<b>${esc(v)}</b></div>`).join('')}</div>`;
function iaaLockFields(m) {
  if (!IAA_LOCK_METHODS.includes(m.name)) {
    return `<div class="iaa-form-row"><label>账号自动锁定时长<input aria-label="账号自动锁定时长" value="不适用" disabled></label></div>` +
      `<p class="iaa-hint">${esc(m.name)}不涉及账号密码或短信验证码的错误次数锁定，无需配置此项；该模块仅对账号密码认证与手机验证码认证生效。</p>`;
  }
  const unit = m.lockUnit === '小时' ? '小时' : '分钟';
  const r = IAA_LOCK_RANGES[unit];
  const val = m.lockValue == null ? r.def : m.lockValue;
  const attempts = m.lockAttempts == null ? IAA_LOCK_ATTEMPTS.def : m.lockAttempts;
  const errWord = m.name === '账号密码认证' ? '密码' : '验证码';
  const opt = (u) => `<option ${unit === u ? 'selected' : ''}>${u}</option>`;
  return `<div class="iaa-form-row"><label>连续错误次数<input id="iaa-d-lock-attempts" aria-label="连续错误次数" type="number" min="${IAA_LOCK_ATTEMPTS.min}" max="${IAA_LOCK_ATTEMPTS.max}" step="1" value="${attempts}"></label>` +
    `<label>锁定时长单位<select id="iaa-d-lock-unit" aria-label="账号自动锁定时长单位" onchange="iaaLockUnitChange()">${opt('分钟')}${opt('小时')}</select></label>` +
    `<label>锁定时长<input id="iaa-d-lock-value" aria-label="账号自动锁定时长" type="number" min="${r.min}" max="${r.max}" step="1" value="${val}"></label></div>` +
    `<p class="iaa-hint">${errWord}连续输错达到次数上限即自动锁定，次数取 ${IAA_LOCK_ATTEMPTS.min}–${IAA_LOCK_ATTEMPTS.max} 的整数（默认 ${IAA_LOCK_ATTEMPTS.def} 次）；锁定时长以分钟为单位取 ${IAA_LOCK_RANGES['分钟'].min}–${IAA_LOCK_RANGES['分钟'].max} 的整数（默认 ${IAA_LOCK_RANGES['分钟'].def} 分钟），以小时为单位取 ${IAA_LOCK_RANGES['小时'].min}–${IAA_LOCK_RANGES['小时'].max} 的整数（默认 ${IAA_LOCK_RANGES['小时'].def} 小时），切换单位后时长输入框取值与范围随之更新；仅账号密码认证与手机验证码认证可配置。原需求未给出触发条件、次数阈值、单位与范围，本项为原型落地补充，不产生真实锁定策略或登录态。</p>`;
}
function iaaLockUnitChange() {
  const r = IAA_LOCK_RANGES[document.getElementById('iaa-d-lock-unit').value];
  const el = document.getElementById('iaa-d-lock-value');
  if (el) { el.min = r.min; el.max = r.max; el.value = r.def; }
}
function iaaConfigDialog(name) {
  const m = iaaMethods.find(x => x.name === name); if (!m) return;
  iaaState.dialogTarget = name;
  const body =
    iaaBlock(IAA_DIALOG_REQ, 'identity.auth.service.dialog.basic', '基本信息', iaaKv([
      ['认证方式名称', m.name], ['认证方式类型', '系统内置'], ['需求出处', m.source], ['最近更新时间', m.updated]
    ])) +
    iaaBlock(IAA_DIALOG_REQ, 'identity.auth.service.dialog.enable', '启用/禁用规则',
      `<div class="iaa-form-row"><label>启用状态<select id="iaa-d-enabled" aria-label="启用状态"><option ${m.enabled === '启用' ? 'selected' : ''}>启用</option><option ${m.enabled === '禁用' ? 'selected' : ''}>禁用</option></select></label></div>` +
      `<div class="iaa-form-row"><label>禁用说明<input id="iaa-d-reason" aria-label="禁用说明" maxlength="100" placeholder="仅启用状态为禁用时必填，最多100字" value="${esc(m.disabledReason)}"></label></div>` +
      `<p class="iaa-hint">状态为禁用时，该方式不在清单中作为已启用方式展示。</p>`) +
    iaaBlock(IAA_DIALOG_REQ, 'identity.auth.service.dialog.priority', '优先级排序规则',
      `<div class="iaa-form-row"><label>优先级<input id="iaa-d-priority" aria-label="优先级" type="number" min="1" max="${iaaMethods.length}" step="1" value="${m.priority}"></label></div>` +
      `<p class="iaa-hint">取 1 至 ${iaaMethods.length} 的整数，数值越小越优先；不得与其他内置方式的优先级重复。</p>`) +
    iaaBlock(IAA_DIALOG_REQ, 'identity.auth.service.dialog.lock', '账号自动锁定时长配置', iaaLockFields(m));
  const foot = `<div ${iaaReq(IAA_DIALOG_REQ, 'identity.auth.service.dialog.actions')}><button class="btn" onclick="iaaClose()">取消</button> <button class="btn primary" onclick="iaaConfigSave()">保存配置</button></div>`;
  iaaDialogShell('认证方式配置 · ' + m.name, IAA_DIALOG_REQ, body, foot);
}
function iaaConfigSave() {
  const m = iaaMethods.find(x => x.name === iaaState.dialogTarget); if (!m) return;
  const enabled = document.getElementById('iaa-d-enabled').value;
  const priority = Number(document.getElementById('iaa-d-priority').value);
  const reason = document.getElementById('iaa-d-reason').value.trim();
  let lockAttempts = m.lockAttempts, lockUnit = m.lockUnit, lockValue = m.lockValue;
  if (enabled === '禁用' && !reason) { toast('禁用时须填写禁用说明'); return; }
  if (!Number.isInteger(priority) || priority < 1 || priority > iaaMethods.length) { toast('优先级须为 1–' + iaaMethods.length + ' 的整数'); return; }
  if (iaaMethods.some(x => x.name !== m.name && x.priority === priority)) { toast('优先级不可与其他内置认证方式重复'); return; }
  if (IAA_LOCK_METHODS.includes(m.name)) {
    const aRaw = String(document.getElementById('iaa-d-lock-attempts').value).trim();
    const a = Number(aRaw);
    if (!/^\d+$/.test(aRaw) || !Number.isInteger(a) || a < IAA_LOCK_ATTEMPTS.min || a > IAA_LOCK_ATTEMPTS.max) { toast('连续错误次数须为 ' + IAA_LOCK_ATTEMPTS.min + '–' + IAA_LOCK_ATTEMPTS.max + ' 的整数'); return; }
    const unit = document.getElementById('iaa-d-lock-unit').value;
    const raw = String(document.getElementById('iaa-d-lock-value').value).trim();
    const n = Number(raw);
    const r = IAA_LOCK_RANGES[unit];
    if (!/^\d+$/.test(raw) || !Number.isInteger(n) || n < r.min || n > r.max) { toast('账号自动锁定时长须为 ' + r.min + '–' + r.max + ' 的整数' + unit); return; }
    lockAttempts = a; lockUnit = unit; lockValue = n;
  }
  Object.assign(m, { enabled, priority, lockAttempts, lockUnit, lockValue, disabledReason: enabled === '禁用' ? reason : '',
    updated: new Date().toLocaleString('sv-SE', { timeZone:'Asia/Shanghai' }).replace('T', ' ') });
  iaaClose(); iaaRender(); toast('认证方式配置已保存');
}

/* —— 挂载：render 包装 + URL 分派（含配置弹窗直达） —— */
const iaaPreviousRender = render;
render = function () {
  if (section === 'identityAuth') { iaaRender(); return; }
  iaaPreviousRender();
};
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get('system') === 'identity' && q.get('view') === 'auth-service') {
    iaaOpen();
    if (q.get('dialog') === 'config') iaaConfigDialog(iaaMethods[0].name);
  }
})();
