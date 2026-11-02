# 区域功能节点

- 页面：`prototype/`；需求唯一来源：`data/requirements/business-node-management.json`。
- 修改需求条目或页面说明时，使用现有文件服务接口并携带当前 revision；发生版本冲突时重新读取、合并后保存，不用脚本直接覆盖需求 JSON。
- 只读取目标页面和 reqId，保留已有规则、绑定及 revision；配置按需读 `project.config.yaml`。
- 共用根目录的[工具说明](../../TOOLS.md)，业务目标只取本项目配置；Web 原型默认使用独立 Studio。
- 仅打开原型时，按 `.local/project.local.yaml` 的已登记入口直接打开并复用运行服务；入口失败才检查对应端口，不扫描历史目录、不构建、不重启健康服务。
- 局部问题先按页面、元素或 reqId 定位后直接修改：业务页面查 `prototype/`，需求文案查唯一需求 JSON，工作台布局与连线查共享 Studio 的 `apps/studio/src/`；定位明确后不重复分析其他层，只核验受影响内容。
- 不再生成迁移说明、阶段状态、任务流水或重复分析；历史快照不修改。
