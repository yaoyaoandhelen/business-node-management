# 业务节点管理系统

先运行 `node tooling/run.mjs workflow status --project project.config.yaml` 与 `node tooling/run.mjs project check --project project.config.yaml`。

- 本项目 projectId 固定为 business-node-management，与源 regional-node 项目隔离。
- 当前功能规则唯一编辑源为 data/requirements/business-node-management.json；OpenSpec 是受控投影。
- inputs/ 为原始迁入资料和历史评审备份，不在其中维护第二份需求正文。
- 使用共享 product-workflow、html-product-design、github-pages-review、zentao-handoff Skills。
- 复用独立共享 Studio；保留语义需求 ID、精确来源校验、文件持久化及同 iframe 状态。
- 字段集中到所属子模块字段表；统计包含口径、范围和刷新时机。
- GitHub 与禅道业务目标属于本项目，未指定时不得自动选择。认证仅复用本机令牌引用。
- 历史评审不是本项目的批准或交接证据；只按实际结果记录上线、批准、接收与实现。完整产品验收暂保留。
