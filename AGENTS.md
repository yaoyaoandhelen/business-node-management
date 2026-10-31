# 业务节点管理系统

项目内接手只运行一次 `node tooling/run.mjs workflow context --project project.config.yaml --intent prototype`，再读 `requiredReads`。工具未恢复时按项目 README 恢复，不预读整套手册。

- projectId 固定为 `business-node-management`，与源 regional-node 项目隔离。
- 功能规则只编辑 `data/requirements/business-node-management.json`；OpenSpec 是受控投影。
- `inputs/` 仅保存迁入资料与历史评审，不维护第二份需求正文，也不作为本项目批准或交接证据。
- 原型复用独立 Studio，保留语义 reqId、精确来源、文件持久化、同 iframe 状态和编辑拦截。
- 字段集中在所属子模块；统计包含口径、范围和刷新时机。
- GitHub 与禅道目标必须属于本项目，未指定不得自动选择；认证仅复用本机安全引用。
- 上线、批准、接收、实现分别记录，完整产品验收预留。详细规范按需读取锁定工具文档。
