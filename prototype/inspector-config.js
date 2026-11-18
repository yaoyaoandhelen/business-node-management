// 允许的父窗口来源：原型自身源 + 需求说明工作室（5174）
// 说明：当前工作稿的原型由 5205 提供、工作室在 5174，属跨源 iframe，必须在此声明父窗口 origin，
// 否则 inspector 会丢弃 INIT 握手，导致「需求交互说明」连不上（历史版本快照同源所以不受影响）。
(function () {
  var origins = [window.location.origin, 'http://127.0.0.1:5174', 'http://localhost:5174'];
  var meta = document.querySelector('meta[name="studio-origin"]');
  if (meta && meta.content) origins.push(meta.content);
  window.AIPrototypeInspectorConfig = { allowedParentOrigins: origins };
})();
