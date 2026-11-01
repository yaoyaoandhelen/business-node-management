# 区域功能节点

当前设计包括系统入口、接入登记审核、数据目录与查询安全。

- `prototype/`：页面与模拟交互。
- `data/requirements/business-node-management.json`：现行功能、字段和页面说明。
- `project.config.yaml`：页面、构建与外部目标。

在本项目目录预览：

```sh
npm --prefix prototype run dev -- --host 127.0.0.1 --port 5205 --strictPort
```

构建、独立 Studio、GitHub 和禅道用法见[工具索引](../../TOOLS.md)。

当前为前端原型：业务数据、机器审核、文件处理与安全控制尚未接入真实后端。`inputs/` 是来源资料；已保存评审与设计版本保留，均不替代现行需求。
