# 正式评审前待补齐

本轮（revision 13）已按现有业务规则为 16 条功能补齐验收场景，其中「风险行为画像」补充正常与空样本两条；`requirements validate` 通过，正式完整性校验无缺口，预览包 `p-7f21e3ca53a5903ea1e7741e` 已与当前需求对齐。

以下内容仍不能据文件存在推定完成：

- 验收场景依据现有规则和界面推导，需业务方确认口径；确认前不构成批准或产品验收。
- 对照现有界面合并原需求中的历次修订文字，明确唯一现行规则；尤其复核敏感词审核弹窗与返回修改行为。
- 选择本业务项目自己的GitHub仓库与Pages路径。
- 确定禅道产品、项目、执行和接收人，正式同步前登记写工具映射。
- 正式冻结前将本业务项目的需求和原型提交到独立Git仓库；当前仅为本地预览。

当前状态：

- 需求：revision 13，30 条；3 个模块、9 个子模块。
- 校验：`node tooling/run.mjs requirements validate --project project.config.yaml` 通过，`formalIssues` 为空。
- 预览：`previewMatchesCurrent: true`，静态评审包为只读模式，编辑需使用 Studio 开发服务。
