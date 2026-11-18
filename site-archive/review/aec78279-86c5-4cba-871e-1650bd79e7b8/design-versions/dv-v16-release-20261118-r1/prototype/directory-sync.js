// 业务节点管理系统 · 全域目录信息互通（左侧二级菜单）。数据为原型演示数据。
// "更多 → 共享链接"打开业务节点目录同步共享详情：已同步节点展示同步成功版，同步失败节点展示同步失败版。
const dsServiceTypes = ['数据流通服务', '技术支撑服务', '安全审核服务'];
// 状态口径：目录上报状态（已上报 / 上报失败 / 待上报）由同步结果驱动，同步失败不再显示为已上报；
// 同步进度条仅作界面展示，状态只有「100%（同步完成）」与「同步失败」两种，无中间进度数值；
// mode 为最近一次同步的触发方式（自动 / 手动）。
const dsNodes = [
  { name: '重庆移动测试', ident: '491500000836550152B5000TJ6L1FX2B', service: '数据流通服务', org: '重庆移动测试', status: '已上报', mode: '自动', time: '2026-11-06 16:54:06' },
  { name: '回归defa6662', ident: '4915001000RGM16RFG95000GVF3OAZZP', service: '数据流通服务', org: '李二家企业集团', status: '已上报', mode: '自动', time: '2026-10-29 11:29:46' },
  { name: 'ceshitongbubiao', ident: '4xp9a507oq86l81vjyx5000EH03IIHB', service: '技术支撑服务', org: '李一', status: '已上报', mode: '自动', time: '2026-10-27 15:33:07' },
  { name: '测试直同步步表-1', ident: '4xp9a507oq86l81wjyx5000NVSM4LLWUJ', service: '安全审核服务', org: '李一', status: '已上报', mode: '手动', time: '2026-10-27 15:12:02' },
  { name: '重庆可信空间-测试', ident: '491500109MA5UEJA80K50000WXXTNCS9Z', service: '数据流通服务', org: '重庆远景', status: '已上报', mode: '自动', time: '2026-10-16 16:21:55' },
  { name: '1012节点测试', ident: '491370782MAC5R7KD3JSU50009ZANDSC4Q', service: '数据流通服务', org: '惠医云（重庆）数智科技有限公司', status: '上报失败', mode: '自动', time: '2026-10-12 15:55:06' },
  { name: '测试上传导入', ident: '491500100D7EGMN05RG5000FSDKN1IXI', service: '技术支撑服务', org: '测试企业QQ', status: '已上报', mode: '自动', time: '2026-09-28 17:32:34' },
  { name: '奶牛-业务节点', ident: '4915001002UP6K1KNG5500011GEAG6XR', service: '安全审核服务', org: '李八的不知道起名公司', status: '已上报', mode: '手动', time: '2026-09-24 16:40:17' },
  { name: '回归流程-123-123', ident: '4915001000RGM16RFG95000B7OU7PE1K', service: '数据流通服务', org: '李二家企业集团', status: '待上报', mode: '—', time: '2026-10-29 10:52:48' }
];
let dsSection = 'list',
  dsShareIdx = -1,
  dsMenuIdx = -1,
  dsAutoSync = true;
const dsReq = (id, el) => req(id, el || id);

// 全域目录信息互通：已并入「业务节点管理系统」左侧菜单，不再单列快捷入口子系统卡片。
const dsOriginalRender = render;
render = function () {
  if (section === 'dirsync') {
    dsRender();
    return;
  }
  dsOriginalRender();
};
document.addEventListener(
  'click',
  (e) => {
    if (!e.target.closest('.ds-more')) {
      dsMenuIdx = -1;
      document.querySelectorAll('.ds-more.open').forEach((m) => m.classList.remove('open'));
    }
  },
  true
);
function dsOpen() {
  document.querySelector('#audit')?.remove();
  $('#overlay').innerHTML = '';
  section = 'dirsync';
  dsSection = 'list';
  dsShareIdx = -1;
  dsRender();
}
function dsBack() {
  section = 'launch';
  render();
}
function dsRender() {
  nav();
  if (dsSection === 'share' && dsShareIdx > -1) {
    dsRenderShare();
    return;
  }
  dsRenderList();
}
function dsRenderList() {
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="dsBack()">首页</span><span class="selected">● 全域目录信息互通</span></div>` +
    `<div class="workspace" data-req-surface="directorySync.list" data-req-page="directory-sync-list" data-req-title="全域目录信息互通"><section class="panel" style="margin-top:16px">` +
    `<div class="filters" ${dsReq('dirsync.query', 'directorySync.list.query')}>` +
    `<label>节点名称</label><input id="dsName" maxlength="50" placeholder="请输入节点名称">` +
    `<label>上报状态</label><select id="dsStatus"><option>全部</option><option>已上报</option><option>上报失败</option><option>待上报</option></select>` +
    `<label>服务类型</label><select id="dsService"><option>全部</option>${dsServiceTypes.map((s) => `<option>${s}</option>`).join('')}</select>` +
    `<button class="btn primary" onclick="dsQuery()">⌕ 查询</button>` +
    `<button class="btn" onclick="dsReset()">↻ 重置</button></div>` +
    `<div class="ds-batchbar" ${dsReq('dirsync.batch', 'directorySync.list.batch')}>` +
    `<span class="ds-auto-group" ${dsReq('dirsync.autosync', 'directorySync.list.auto')}>` +
    `<label class="ds-switch"><input type="checkbox" id="dsAuto" ${dsAutoSync ? 'checked' : ''} onchange="dsToggleAuto(this.checked)"><span>自动同步</span></label>` +
    `<span class="ds-switch-note">开启后节点登记信息 / 目录信息发生变更即时自动同步至全域目录；关闭后仅保留手动上报</span>` +
    `<span class="ds-switch-state ${dsAutoSync ? 'on' : 'off'}">${dsAutoSync ? '● 已开启 · 变更触发' : '○ 已关闭'}</span></span>` +
    `<button class="btn primary" style="margin-left:auto" onclick="dsBatchReport()">⇪ 一键上报</button></div>` +
    `<div style="overflow-x:auto"><table ${dsReq('dirsync.table', 'directorySync.list.table')}><thead><tr><th>序号</th><th>节点名称</th><th>节点标识</th><th>服务类型</th><th>所属组织</th><th>目录上报状态</th><th>最后上报时间</th><th>操作</th></tr></thead><tbody id="dsRows"></tbody></table></div>` +
    `<div class="pagination" id="dsPager"></div></section></div>`;
  dsDraw();
}
function dsStatusTag(s) {
  return s === '已上报'
    ? '<span class="status ok">已上报</span>'
    : s === '上报失败'
      ? '<span class="status fail">上报失败</span>'
      : '<span class="status">待上报</span>';
}
function dsDraw() {
  const name = $('#dsName').value.trim(),
    st = $('#dsStatus').value,
    sv = $('#dsService').value;
  const found = dsNodes.filter(
    (r) => (!name || r.name.toLowerCase().includes(name.toLowerCase())) && (st === '全部' || r.status === st) && (sv === '全部' || r.service === sv)
  );
  $('#dsRows').innerHTML = found.length
    ? found
        .map((r) => {
          const i = dsNodes.indexOf(r);
          return (
            `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td style="word-break:break-all">${esc(r.ident)}</td><td>${esc(r.service)}</td><td>${esc(r.org)}</td><td>${dsStatusTag(r.status)}</td><td>${esc(r.time)}</td>` +
            `<td style="white-space:nowrap"><button class="link" ${dsReq('dirsync.table', 'directorySync.list.actions')} onclick="dsReport(${i})">⇪ 上报</button>` +
            `<span class="ds-more ${dsMenuIdx === i ? 'open' : ''}"><button class="link" onclick="dsToggleMenu(${i})">更多 ⌄</button>` +
            `<div class="ds-menu"><button class="link" ${dsReq('dirsync.share', 'directorySync.list.actions')} onclick="dsShare(${i})">🔗 共享链接</button></div></span></td></tr>`
          );
        })
        .join('')
    : '<tr><td colspan="8" class="empty">▤<br><br>暂无符合条件的节点目录</td></tr>';
  $('#dsPager').innerHTML = `共 ${found.length} 条　　每页 10 条　　〈 <b>1</b> 〉`;
}
function dsQuery() {
  dsMenuIdx = -1;
  dsDraw();
  toast('查询完成');
}
function dsReset() {
  $('#dsName').value = '';
  $('#dsStatus').selectedIndex = 0;
  $('#dsService').selectedIndex = 0;
  dsMenuIdx = -1;
  dsDraw();
}
function dsToggleMenu(i) {
  dsMenuIdx = dsMenuIdx === i ? -1 : i;
  dsDraw();
}
function dsToggleAuto(v) {
  dsAutoSync = v;
  const el = document.querySelector('.ds-switch-state');
  if (el) {
    el.textContent = v ? '● 已开启 · 变更触发' : '○ 已关闭';
    el.className = 'ds-switch-state ' + (v ? 'on' : 'off');
  }
  toast(v ? '自动同步已开启：节点登记信息 / 目录信息变更后即时同步至全域目录' : '自动同步已关闭：仅保留手动上报，变更后需人工发起同步');
}
function dsReport(i) {
  const r = dsNodes[i];
  if (r.status === '已上报') {
    toast('该节点目录已同步至全域目录，无需重复上报');
    return;
  }
  dsMenuIdx = -1;
  if (r.ident === '491370782MAC5R7KD3JSU50009ZANDSC4Q') {
    // 手动重试仍失败：上报状态保持「上报失败」
    r.status = '上报失败';
    r.mode = '手动';
    r.time = '2026-11-09 15:40:12';
    dsDraw();
    toast(`节点「${r.name}」上报失败：全域节点接收确认超时（SYNC-TIMEOUT-021）`);
    return;
  }
  r.status = '已上报';
  r.mode = '手动';
  r.time = '2026-11-09 15:40:12';
  dsDraw();
  toast(`节点「${r.name}」手动上报完成：同步成功，已编入全域目录`);
}
function dsBatchReport() {
  const pending = dsNodes.filter((r) => r.status !== '已上报');
  if (!pending.length) {
    toast('所有节点目录均已上报并同步成功');
    return;
  }
  let ok = 0,
    fail = 0;
  pending.forEach((r) => {
    if (r.ident === '491370782MAC5R7KD3JSU50009ZANDSC4Q') {
      r.status = '上报失败';
      r.mode = '手动';
      r.time = '2026-11-09 15:40:12';
      fail++;
      return;
    }
    r.status = '已上报';
    r.mode = '手动';
    r.time = '2026-11-09 15:40:12';
    ok++;
  });
  dsMenuIdx = -1;
  dsDraw();
  toast(`一键上报完成：成功 ${ok} 条、失败 ${fail} 条${fail ? '（失败原因：全域节点接收确认超时）' : ''}`);
}
function dsShare(i) {
  dsMenuIdx = -1;
  const r = dsNodes[i];
  if (r.status === '待上报') {
    toast('该节点尚未上报，暂无可查看的共享链接；请先点击「上报」');
    return;
  }
  dsShareIdx = i;
  dsSection = 'share';
  dsRender();
}

// —— 共享链接详情（同步成功 / 同步失败两种状态） ——
function dsShareData(r) {
  const fail = r.status === '上报失败';
  return {
    fail,
    mode: r.mode,
    name: r.name,
    ident: r.ident,
    org: r.org,
    service: r.service,
    time: fail ? '2026-11-06 15:45:00' : r.time,
    version: '1.1',
    intro: '测试环境数据流通验证节点',
    dataTypes: '企业基本信息、经营数据',
    applyTime: r.time
  };
}
function dsDescGrid(d) {
  const chgNote = d.fail ? '本次同步内容（1.0 → 1.1 · 未生效）' : '本次变更（1.0 → 1.1）';
  const chgLabel = d.fail ? '本次同步内容' : '本次变更';
  const items = [
    ['业务节点登记名称', esc(d.name), false],
    ['业务节点版本', `1.1<span class="ds-chg-tag">${chgNote}</span>`, true],
    ['节点标识', `<span class="mono">${esc(d.ident)}</span>`, false, true],
    ['服务类型', esc(d.service), false],
    ['业务节点物理地址', '-', false],
    ['业务功能介绍', `${esc(d.intro)}<span class="ds-chg-tag">${chgLabel}</span>`, true, true],
    ['流通数据类型', `${esc(d.dataTypes)}<span class="ds-chg-tag">${chgLabel}（原为空）</span>`, true, true],
    ['统一社会信用代码', `<span class="mono">${esc(d.ident)}</span>`, false, true],
    ['所属法人或其他组织名称', esc(d.org), false],
    ['运营机构名称', '-', false],
    ['所属法人身份标识', `<span class="mono">${esc(d.ident)}</span>`, false, true],
    ['申请时间', esc(d.applyTime), false],
    ['法人姓名', '李明明', false],
    ['法人联系方式', '198****3627', false],
    ['备注', '-', false],
    ['法人身份证号', '<span class="mono">371481********3618（脱敏）</span>', false, true]
  ];
  return `<div class="ds-desc-grid">${items.map(([l, v, c, f]) => `<div class="ds-desc-item ${c ? 'changed' : ''} ${f ? 'full' : ''}"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('')}</div>`;
}
function dsShareRecords(d) {
  if (d.fail)
    return [
      ['fail current', '<b>信息更新同步</b>　<span class="ds-current-badge">本次</span>', '<span>自动触发（登记信息变更）</span><span>·</span><span>2026-11-06 15:45:00</span><span class="ds-tag red">✗ 同步失败（全域节点接收确认超时）</span>', '同步内容：业务节点版本 1.0→1.1、业务功能介绍、流通数据类型'],
      ['fail', '<b>第 2 次自动重试</b>', '<span>2026-11-06 15:58:12</span><span class="ds-tag red">✗ 重试失败（同一错误）</span>', ''],
      ['fail', '<b>第 1 次自动重试</b>', '<span>2026-11-06 15:52:05</span><span class="ds-tag red">✗ 重试失败（同一错误）</span>', ''],
      ['gray', '<b>第 3 次自动重试（待执行）</b>', '<span>预计 2026-11-06 16:05:00 自动执行</span><span class="ds-tag gold">重试上限 5 次</span>', '超限仍失败将标记异常节点并生成补正通知书自动推送'],
      ['ok', '<b>信息更新同步</b>', '<span>2026-10-12 15:55:06</span><span class="ds-tag green">✓ 同步成功</span>', '同步内容：业务节点版本 1.0'],
      ['ok', '<b>首次注册同步</b>', '<span>审核发布后发起</span><span>·</span><span>2026-09-30 10:12:00</span><span class="ds-tag green">✓ 同步成功</span>', '同步内容：节点目录首次编入全域目录'],
      ['gray', '<b>注销同步</b>', '<span>—</span><span class="ds-tag gray">○ 未执行</span>', '节点正常运行中；注销后将同步注销状态并终止共享']
    ];
  return [
    ['ok current', '<b>信息更新同步</b>　<span class="ds-current-badge">本次</span>', `<span>${d.mode === '手动' ? '手动发起（人工上报）' : '自动触发（登记信息变更）'}</span><span>·</span><span>${esc(d.time)}</span><span class="ds-tag green">✓ 同步成功</span>`, '同步内容：业务节点版本 1.0→1.1、业务功能介绍、流通数据类型'],
    ['ok', '<b>信息更新同步</b>', '<span>手动发起（人工补同步）</span><span>·</span><span>2026-10-15 10:22:41</span><span class="ds-tag green">✓ 同步成功</span>', '同步内容：业务节点版本 1.0'],
    ['fail', '<b>信息更新同步</b>', '<span>手动发起</span><span>·</span><span>2026-10-15 10:19:07</span><span class="ds-tag red">✗ 同步失败（传输超时）</span><span class="ds-tag gold">自动重试 1 次后成功</span>', ''],
    ['ok', '<b>首次注册同步</b>', '<span>审核发布后发起</span><span>·</span><span>2026-09-28 17:07:38</span><span class="ds-tag green">✓ 同步成功</span>', '同步内容：节点目录首次编入全域目录'],
    ['gray', '<b>注销同步</b>', '<span>—</span><span class="ds-tag gray">○ 未执行</span>', '节点正常运行中；注销后将同步注销状态并终止共享']
  ];
}
function dsRenderShare() {
  const r = dsNodes[dsShareIdx],
    d = dsShareData(r),
    v = d.fail ? 'fail' : 'success';
  const monitor = d.fail
    ? `<div class="ds-monitor-item fail"><div class="m-icon">📤</div><div><div class="m-label">目录上报状态</div><div class="m-value fail">上报失败</div></div></div>` +
      `<div class="ds-monitor-item fail"><div class="m-icon">🔄</div><div><div class="m-label">全域同步状态</div><div class="m-value fail">同步失败</div></div></div>` +
      `<div class="ds-monitor-item"><div class="m-icon">🔗</div><div><div class="m-label">关联系统更新</div><div class="m-value muted">缺省预留 · 暂未启用</div></div></div>`
    : `<div class="ds-monitor-item ok"><div class="m-icon">📤</div><div><div class="m-label">目录上报状态</div><div class="m-value ok">已上报</div></div></div>` +
      `<div class="ds-monitor-item blue"><div class="m-icon">🔄</div><div><div class="m-label">全域同步状态</div><div class="m-value blue">已同步</div></div></div>` +
      `<div class="ds-monitor-item"><div class="m-icon">🔗</div><div><div class="m-label">关联系统更新</div><div class="m-value muted">缺省预留 · 暂未启用</div></div></div>`;
  const progress = d.fail
    ? `<div class="ds-progress-block"><div class="row"><span>本节点目录同步至全域功能节点进度</span><b class="fail">同步失败</b></div><div class="ds-progress"><span class="stuck" style="width:100%"></span></div></div>` +
      `<div class="ds-progress-block"><div class="row"><span>与全域功能节点目录一致性比对</span><b class="fail">同步失败</b></div><div class="ds-progress"><span class="stuck" style="width:100%"></span></div></div>`
    : `<div class="ds-progress-block"><div class="row"><span>本节点目录同步至全域功能节点进度</span><b>100%</b></div><div class="ds-progress"><span class="full" style="width:100%"></span></div></div>` +
      `<div class="ds-progress-block"><div class="row"><span>与全域功能节点目录一致性比对</span><b class="ok">100%</b></div><div class="ds-progress"><span class="full" style="width:100%"></span></div></div>`;
  const flow = d.fail
    ? `<div class="ds-flow-step ok"><div class="f-dot">1</div><div class="f-title">自动同步触发</div><div class="f-desc">登记信息变更后自动触发<br>2026-11-06 15:44:32</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">2</div><div class="f-title">生成共享地址</div><div class="f-desc">生成共享链接与访问令牌<br>有效期：30 天</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">3</div><div class="f-title">加密传输</div><div class="f-desc">目录变更内容加密推送<br>2026-11-06 15:44:50</div></div>` +
      `<div class="ds-flow-step fail"><div class="f-dot">✗</div><div class="f-title">全域节点接收</div><div class="f-desc">接收确认超时<br>2026-11-06 15:45:00</div></div>` +
      `<div class="ds-flow-step gray"><div class="f-dot">5</div><div class="f-title">编入全域目录</div><div class="f-desc">待同步成功后执行<br>未执行</div></div>`
    : `<div class="ds-flow-step ok"><div class="f-dot">1</div><div class="f-title">${d.mode === '手动' ? '手动发起同步' : '自动同步触发'}</div><div class="f-desc">${d.mode === '手动' ? '人工点击「上报」发起' : '登记信息变更后自动触发'}<br>${esc(d.time)}</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">2</div><div class="f-title">生成共享地址</div><div class="f-desc">生成共享链接与访问令牌<br>有效期：30 天</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">3</div><div class="f-title">加密传输</div><div class="f-desc">目录变更内容加密推送<br>${esc(d.time)}</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">4</div><div class="f-title">全域节点接收</div><div class="f-desc">全域功能节点确认接收<br>${esc(d.time)}</div></div>` +
      `<div class="ds-flow-step ok"><div class="f-dot">5</div><div class="f-title">编入全域目录</div><div class="f-desc">变更内容编入全域目录<br>${esc(d.time)}</div></div>`;
  const result = d.fail
    ? `<div class="ds-result-banner"><span class="r-icon">❌</span><span>同步结果：<b>同步失败</b>　｜　失败环节：全域功能节点接收确认超时（错误码 SYNC-TIMEOUT-021）　｜　本次同步内容尚未在全域生效</span></div>` +
      `<div class="ds-retry-card" ${dsReq('dirsync.share', 'directorySync.share.retry')}><div class="r-head">⏱ 异常处理与自动重试</div><div class="r-row">已自动重试 <b>2 次</b>（第 1 次 15:52:05、第 2 次 15:58:12，均为同一错误），第 <b>3 次</b>自动重试将于 <b>2026-11-06 16:05:00</b> 执行　｜　重试上限：<b>5 次</b><br>若重试次数超限仍失败，该节点将被标记为<b>异常节点</b>，系统自动生成<b>异常节点补正通知书</b>并<b>自动推送</b>至节点责任单位，通知书中将载明失败原因与补正要求</div></div>`
    : `<div class="ds-result-banner"><span class="r-icon">✅</span><span>同步结果：<b>同步成功</b>　｜　全域功能节点已确认接收并编入全域目录　｜　同步耗时 28 秒　｜　无异常、无重试</span></div>`;
  const lifecycle = d.fail
    ? `<div class="ds-lc-step"><div class="lc-title">① 首次注册同步</div><div class="lc-desc">节点审核通过后，将节点目录信息首次同步至全域功能节点 · ✓ 已完成</div></div>` +
      `<div class="ds-lc-step error"><div class="lc-title">② 信息更新同步</div><div class="lc-desc">节点登记信息或目录信息变更后自动触发同步，支持手动补同步 · 本次执行失败，自动重试中</div></div>` +
      `<div class="ds-lc-step"><div class="lc-title">③ 注销同步</div><div class="lc-desc">节点注销后，同步注销状态至全域功能节点并移除共享 · 节点正常运行中</div></div>`
    : `<div class="ds-lc-step"><div class="lc-title">① 首次注册同步</div><div class="lc-desc">节点审核通过后，将节点目录信息首次同步至全域功能节点 · ✓ 已完成</div></div>` +
      `<div class="ds-lc-step active"><div class="lc-title">② 信息更新同步</div><div class="lc-desc">节点登记信息或目录信息变更后自动触发同步，支持手动补同步 · 本次执行</div></div>` +
      `<div class="ds-lc-step"><div class="lc-title">③ 注销同步</div><div class="lc-desc">节点注销后，同步注销状态至全域功能节点并移除共享 · 节点正常运行中</div></div>`;
  const records = dsShareRecords(d)
    .map(
      ([cls, title, meta, note]) =>
        `<li class="${cls}"><div class="t-title">${title}</div><div class="t-meta">${meta}</div>${note ? `<div class="t-meta">${note}</div>` : ''}</li>`
    )
    .join('');
  $('#main').innerHTML =
    `<div class="systemtabs"><span onclick="dsBack()">首页</span><span class="selected">● 全域目录信息互通</span></div>` +
    `<div class="ds-share ${v}" data-req-surface="directorySync.share" data-req-page="directory-sync-share" data-req-title="共享链接详情">` +
    `<div class="crumb" style="padding:14px 0 0">业务节点管理系统 / 全域目录信息互通 / 共享链接详情　<button class="link" onclick="dsSection='list';dsShareIdx=-1;dsRender()">⇤ 返回列表</button></div>` +
    `<div class="ds-banner" ${dsReq('dirsync.share', 'directorySync.share.banner')} style="margin-top:12px">` +
    `<div class="banner-top"><div class="title-area"><div class="icon-box">🔗</div><div><h1>业务节点目录同步 · 共享详情</h1><div class="sub">节点标识：${esc(d.ident)} ｜ 登记名称：${esc(d.name)} ｜ 同步类型：信息更新同步</div></div></div>` +
    `<div class="ds-secure-tags"><span class="ds-secure-tag">🔒 加密传输</span><span class="ds-secure-tag">👁 只读共享</span><span class="ds-secure-tag ${d.fail ? 'strong' : ''}">${d.fail ? '✗ 同步失败 · 自动重试中' : '✓ 审核已发布'}</span></div></div>` +
    `<div class="meta-area">链接生成时间：${d.fail ? '2026-11-06 15:45:00' : esc(d.time)}<span class="meta-sep">｜</span>共享有效期：30 天（至 2026-12-06）</div></div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>目录信息上报与同步状态监控</h2></div><div class="ds-card-body" ${dsReq('dirsync.share', 'directorySync.share.monitor')}><div class="ds-monitor-grid">${monitor}</div>${progress}</div></div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>本次同步流程</h2></div><div class="ds-card-body" ${dsReq('dirsync.share', 'directorySync.share.flow')}><div class="ds-flow">${flow}</div>${result}</div></div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>节点目录同步概览</h2><span class="ds-tag ${d.fail ? 'red' : 'green'}">${d.fail ? '✗ 本次同步失败 · 自动重试中' : '✓ 审核已发布'}</span></div><div class="ds-card-body" ${dsReq('dirsync.share', 'directorySync.share.lifecycle')}><div class="ds-life-cycle">${lifecycle}</div>` +
    `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span style="font-size:13px;color:rgba(0,0,0,.65);">共享有效期设置：</span><span class="ds-tag blue" style="font-size:13px;">7 天</span><span class="ds-tag green" style="font-size:13px;font-weight:600;">✓ 30 天（当前设置）</span><span class="ds-tag blue" style="font-size:13px;">永久</span><span style="font-size:12px;color:rgba(0,0,0,.45);margin-left:8px;">有效期至 2026-12-06</span></div></div></div>` +
    `<div class="ds-two-col"><div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>业务节点基本信息</h2><span><span class="ds-tag gold">■ 黄底 = ${d.fail ? '本次同步内容（同步失败 · 待重新同步生效）' : '本次同步变更内容'}</span></span></div><div class="ds-card-body" style="padding:6px 8px" ${dsReq('dirsync.share', 'directorySync.share.info')}>${dsDescGrid(d)}</div></div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>节点材料清单</h2><span class="ds-tag green">已上传</span></div><div class="ds-card-body" ${dsReq('dirsync.share', 'directorySync.share.materials')}><div class="ds-mat-item"><div class="ds-mat-thumb">🌿</div><div style="flex:1;min-width:0;"><div class="ds-mat-name">jcss/2026/09/07/17887486531961749433018212398.png</div><div style="font-size:12px;color:rgba(0,0,0,.45);margin-top:3px;">接入材料 · 随节点目录一并共享</div></div><button class="ds-btn-sm" onclick="toast('原型演示：材料预览')">👁 预览</button><button class="ds-btn-sm" onclick="toast('原型演示：材料下载')">⬇ 下载</button></div></div></div>` +
    `</div>` +
    `<div class="ds-card"><div class="ds-card-head"><h2>同步记录（全部历史）</h2><span style="font-size:12px;color:rgba(0,0,0,.45);">共 ${d.fail ? 9 : 6} 条</span></div><div class="ds-card-body" ${dsReq('dirsync.share', 'directorySync.share.records')}><ul class="ds-timeline">${records}</ul></div></div>` +
    `</div>` +
    `<div class="ds-footer-note">本页面为业务节点目录同步共享只读视图 · 共享链接针对单个业务节点目录生成，支持变更自动同步（首次注册 / 信息更新 / 注销）与手动补同步<br>目录上报状态由同步结果驱动：同步失败显示「上报失败」，不显示为已上报 · 同步进度条仅作界面展示，状态仅区分「100%（同步完成）」与「同步失败」，无中间进度数值 · ${d.fail ? '同步失败自动重试，重试超限将标记异常节点并自动生成、推送补正通知书 · ' : ''}共享有效期支持 7 天 / 30 天 / 永久设置 · 全程加密传输 · 本次同步内容黄底标注，同步记录全量留痕</div></div>`;
}
// 原型评审深链：view=dirsync 直接进入全域目录信息互通，view=dirsync-share（可带 &node=序号）直达共享链接详情
(function () {
  const q = new URLSearchParams(location.search);
  const v = q.get('view');
  if (v !== 'dirsync' && v !== 'dirsync-share') return;
  dsOpen();
  if (v === 'dirsync-share') {
    const n = Number(q.get('node') || 0);
    dsShare(Number.isInteger(n) && n >= 0 && n < dsNodes.length ? n : 0);
  }
})();
