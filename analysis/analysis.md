# 业务节点管理系统 · 迁入记录

从区域功能节点现有原型迁入，保留业务节点接入登记、敏感词审核及现有数据目录/查询安全功能。此轮仅建立独立业务项目与工作流接入，不重新定义业务范围。

详细规则唯一来源：data/requirements/business-node-management.json。原始 schema v1、revision 9 的30条需求及模块树保存在 inputs/source-requirements/；迁入后采用schema v2，保留reqId、bindings、原有规则与扩展内容。根据原规则和现有界面补齐字段/统计结构描述，没有新增字段导航。

旧版快照保存在 inputs/legacy-reviews/，保留原regional-node身份，属于历史参考，不导入为本项目正式批准基线。源latest-review指向其他项目，未用于选择本项目版本。

当前原型使用内存模拟交互；机器模型、OCR、真实上传、后端鉴权/共享限流/审计持久化均未实现。源说明见 inputs/original-project/。

功能验收场景已依据现有规则补齐，待业务方确认口径；历史文字与当前界面的差异仍需核对。GitHub仓库、禅道产品/项目/执行及接收人留到实际交付阶段确定。
