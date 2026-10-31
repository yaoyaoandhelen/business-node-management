# 业务节点管理系统

独立业务项目，迁入来源为区域功能节点。原有业务页面、30条需求、模块目录、说明、截图与12个历史评审版本已保留。历史资料位于 inputs/；原目录未修改。

## 本机使用

在本目录运行：

```sh
node tooling/run.mjs project check --project project.config.yaml
node tooling/run.mjs studio dev --project project.config.yaml
```

统一本机入口：http://127.0.0.1:5204/ 。工作台、业务原型5205和JSON文件服务5206独立运行；团队评审需后续发布到本项目的GitHub Pages。

业务规则：data/requirements/business-node-management.json。继续设计时使用共享product-workflow Skill；字段在所属子模块字段表中维护。

## 迁入验证

9 项浏览器检查通过，覆盖默认完整页面、同 iframe 状态保留、提交/删除/键盘拦截、需求真实落盘、刷新恢复、集中字段说明、预览交互恢复及四个页面切换。静态评审包也已通过独立临时静态服务验证，无开发服务请求或脚本异常。

只读静态预览：http://127.0.0.1:5204/preview/ 。当前预览 ID：`p-8bc28a4f20a8c931000b4bb3`。原始需求为 revision 9；保存与恢复验证各产生一次修订，当前 revision 11，原业务规则和模块树经逐项比对保持一致。

## 当前状态

这是现有原型迁入，不代表生产业务已实现、产品已验收、评审已批准或禅道已交接。现有数据目录功能随原型完整保留。GitHub仓库和禅道产品/项目/执行/接收人均未选择；本机禅道认证复用已有MCP令牌引用，不复制凭据。正式冻结前仍需补齐验收场景并提交本业务项目源码。

复验记录保存在 .local/verification/；迁入清单见 inputs/import-manifest.json。
