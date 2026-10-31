# 业务节点管理系统

独立业务项目，迁入来源为区域功能节点。原页面、30 条需求、模块目录和历史资料保留在 `inputs/`；历史评审不属于本项目批准基线。

## 本机使用

首次恢复或迁出后，在本目录运行：

```sh
node tooling/restore.mjs
npm ci --prefix .local/workflow-kit --omit=dev
node tooling/run.mjs workflow context --project project.config.yaml --intent prototype
```

需要原型时再运行 `node tooling/run.mjs studio dev --project project.config.yaml`，统一入口以该次输出为准，不假设旧服务或端口仍有效。

功能规则只编辑 `data/requirements/business-node-management.json`。当前是原型迁入与本地预览，不代表生产实现、正式批准、禅道交接或产品验收；GitHub 和禅道目标尚未选定。

迁入清单见 `inputs/import-manifest.json`，实际验证记录保存在 `.local/verification/`。按需命令见锁定版本的[使用手册](.local/workflow-kit/docs/user-guide.md)。
