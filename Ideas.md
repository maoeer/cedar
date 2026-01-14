待办:
1. 创建后端文件夹 cedar-back-end
2. 后端采用 LowDB
- 安装依赖
```bash
npm install lowdb nanoid
```

- 配置文件
```javascript
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')

// 1. 指定 JSON 文件存储路径（LowDB 会自动创建该文件，无需手动创建）
const dbPath = path.resolve(__dirname, './data/db.json')

// 2. 初始化 LowDB（仅需代码配置，无需连接外部服务）
const adapter = new JSONFile(dbPath) // 适配器：指定数据存储到 JSON 文件
const defaultData = { users: [] } // 初始数据结构（可选）
const db = new Low(adapter, defaultData)

// 3. 直接操作数据（无需启动任何数据库服务）
async function operateData() {
  await db.read() // 读取 JSON 文件数据（无文件则创建并写入默认数据）
  db.data.users.push({ username: '张三', age: 25 }) // 新增数据
  await db.write() // 保存数据到 JSON 文件
}
```