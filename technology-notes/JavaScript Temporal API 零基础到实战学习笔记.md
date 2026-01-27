# JavaScript Temporal API 零基础到实战学习笔记

# JavaScript Temporal API 零基础到实战学习笔记

## 一、学习前提：为什么一定要学 Temporal？

在 Temporal 出现前，JavaScript 开发者长期被 `Date` API 折磨，其设计缺陷堪称「反人类」：

- 月份从 0 开始（1 月 = 0，12 月 = 11），新手必踩坑；

- 实例可变（`date.setDate(10)` 直接修改原对象，易引发副作用）；

- 时区处理混乱，仅支持本地时间和 UTC，无原生时区转换能力；

- 精度仅到毫秒，无法满足金融、科研等高精度场景；

- 仅支持公历，不兼容农历、伊斯兰历等特殊日历需求。

而 Temporal 作为 ECMAScript 官方推出的新一代时间 API（当前处于 Stage 3 提案，已在主流环境原生支持），完美解决了以上所有问题，是未来 JS 时间处理的「标准答案」。

## 二、核心认知：Temporal 的设计理念

1. **不可变性**：所有操作（加减、修改、转换）均返回新对象，原对象保持不变，从根源避免副作用；

2. **语义化拆分**：将时间按「使用场景」拆分为不同类型，拒绝混用（如「仅日期」和「带时区的完整时间」是两个独立对象）；

3. **符合直觉**：月份、星期均从 1 开始，数值逻辑与日常生活一致；

4. **全面兼容**：原生支持时区、多日历、高精度时间，无需依赖第三方库。

## 三、核心模块拆解（附场景化用法）

Temporal 的 API 设计非常模块化，核心可分为「获取当前时间」「时间对象」「工具方法」三类，下面结合实际场景讲解：

### 1. Temporal.Now：获取当前时间的「入口」

专门用于获取当前时间的不同形态，按需调用即可：

|方法|场景用途|示例输出|
|---|---|---|
|`Temporal.Now.instant()`|获取 UTC 高精度时间戳（纳秒级）|`2025-08-22T08:30:00.123456789Z`|
|`Temporal.Now.zonedDateTimeISO([时区])`|获取带时区的完整时间（最常用）|不传时区：`2025-08-22T16:30:00+08:00[Asia/Shanghai]`；传时区：`2025-08-22T04:30:00-04:00[America/New_York]`|
|`Temporal.Now.plainDateISO()`|仅获取当前日期（无时区、无时间）|`2025-08-22`|
|`Temporal.Now.plainTimeISO()`|仅获取当前时间（无日期、无时区）|`16:30:00.456`|
**场景示例**：获取当前北京时间的完整时间

```JavaScript

const currentBeijingTime = Temporal.Now.zonedDateTimeISO('Asia/Shanghai');
console.log(currentBeijingTime.toString()); 
// 输出：2025-08-22T16:35:22.789+08:00[Asia/Shanghai]
```

### 2. 核心时间对象：按「场景」选择使用

Temporal 最关键的设计是「类型分离」，不同场景对应不同对象，避免混淆：

#### （1）Temporal.PlainDate：仅处理日期（年/月/日）

- 适用场景：生日、节假日、会议日期等无需关注时间和时区的场景；

- 核心特点：无时间、无时区，仅表示「抽象日期」；

- 创建方式：

```JavaScript

// 方式1：通过对象创建（推荐，直观）
const birthday = Temporal.PlainDate.from({ year: 2000, month: 5, day: 20 });
// 方式2：通过 ISO 字符串创建
const holiday = Temporal.PlainDate.from('2025-10-01');
// 方式3：通过年月日参数创建
const meetingDate = new Temporal.PlainDate(2025, 9, 15);

console.log(birthday.month); // 5（月份从1开始，符合直觉）
```

#### （2）Temporal.PlainTime：仅处理时间（时/分/秒/纳秒）

- 适用场景：闹钟、上下班打卡时间（不依赖日期）；

- 示例：

```JavaScript

const alarmTime = Temporal.PlainTime.from({ hour: 7, minute: 30, second: 0 });
console.log(alarmTime.toString()); // 07:30:00
```

#### （3）Temporal.PlainDateTime：日期+时间（无时区）

- 适用场景：不需要考虑时区的抽象时间（如「2025年9月1日 14:00 开会」，不指定时区）；

- 示例：

```JavaScript

const meeting = Temporal.PlainDateTime.from({
  year: 2025,
  month: 9,
  day: 1,
  hour: 14,
  minute: 30
});
console.log(meeting.toString()); // 2025-09-01T14:30:00
```

#### （4）Temporal.ZonedDateTime：日期+时间+时区（最常用）

- 适用场景：实际业务中的时间记录（如订单创建时间、用户登录时间），需要明确时区；

- 核心特点：带有时区信息，支持时区转换；

- 示例：

```JavaScript

// 创建北京时区的时间
const orderCreateTime = Temporal.ZonedDateTime.from({
  year: 2025,
  month: 8,
  day: 22,
  hour: 10,
  minute: 15,
  timeZone: 'Asia/Shanghai'
});

// 转换为纽约时区
const nycTime = orderCreateTime.withTimeZone('America/New_York');
console.log(nycTime.toString()); // 2025-08-21T22:15:00-04:00[America/New_York]
```

#### （5）Temporal.Instant：UTC 高精度时间戳

- 适用场景：跨时区时间对比、时间戳存储（比 `Date` 的毫秒级精度更高，支持纳秒）；

- 与 `Date` 的兼容：

```JavaScript

// 创建 Instant
const instant = Temporal.Instant.from('2025-08-22T08:30:00.123456789Z');

// 转换为 Date 对象（兼容旧代码）
const date = new Date(instant.epochMilliseconds);

// 从 Date 转换为 Instant
const instantFromDate = Temporal.Instant.fromEpochMilliseconds(date.getTime());
```

### 3. 常用工具方法：时间计算、比较、格式化

Temporal 的方法设计语义清晰，无需记忆复杂参数，核心常用操作如下：

#### （1）时间计算：add() / subtract()

所有时间对象都支持 `add`（加）和 `subtract`（减），参数为「时间周期对象」，返回新对象（不可变）：

```JavaScript

const today = Temporal.PlainDate.from('2025-08-22');

// 加 3 天
const threeDaysLater = today.add({ days: 3 });
console.log(threeDaysLater.toString()); // 2025-08-25

// 减 1 个月
const lastMonth = today.subtract({ months: 1 });
console.log(lastMonth.toString()); // 2025-07-22

// 复杂计算：加 2 周 3 小时
const plainDateTime = Temporal.PlainDateTime.from('2025-08-22T10:00:00');
const newTime = plainDateTime.add({ weeks: 2, hours: 3 });
console.log(newTime.toString()); // 2025-09-05T13:00:00
```

#### （2）时间比较：equals() / 比较运算符

- `equals()`：判断两个时间是否完全相等；

- 支持 `>`, `<`, `>=`, `<=` 运算符，语义直观：

```JavaScript

const date1 = Temporal.PlainDate.from('2025-08-22');
const date2 = Temporal.PlainDate.from('2025-08-25');

console.log(date1.equals(date2)); // false
console.log(date1 < date2); // true
console.log(date1 >= date2); // false
```

#### （3）时间差计算：since() / until()

- `since( earlierTime)`：计算当前时间比 `earlierTime` 晚多久；

- `until( laterTime)`：计算当前时间到 `laterTime` 还有多久；

- 返回 `Temporal.Duration` 对象，包含天、时、分、秒等信息：

```JavaScript

const start = Temporal.PlainDate.from('2025-08-01');
const end = Temporal.PlainDate.from('2025-08-22');

const diff = end.since(start);
console.log(diff.days); // 21（相差21天）
console.log(diff.toString()); // P21D（ISO 8601 时长格式，P=周期，D=天）

// 带时区的时间差
const startTime = Temporal.ZonedDateTime.from('2025-08-22T00:00:00+08:00[Asia/Shanghai]');
const endTime = Temporal.ZonedDateTime.from('2025-08-22T12:00:00-04:00[America/New_York]');
const timeDiff = endTime.since(startTime);
console.log(timeDiff.hours); // 4（跨时区自动计算）
```

#### （4）格式化：配合 Intl.DateTimeFormat

Temporal 本身不提供格式化方法，需搭配原生 `Intl.DateTimeFormat`（国际化、灵活度高）：

```JavaScript

const zonedTime = Temporal.Now.zonedDateTimeISO('Asia/Shanghai');

// 格式化为中文年月日时分秒
const formatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
console.log(formatter.format(zonedTime)); // 2025年8月22日 16:45:30

// 格式化为英文短格式
const enFormatter = new Intl.DateTimeFormat('en-US', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: 'h12',
  minute: '2-digit'
});
console.log(enFormatter.format(zonedTime)); // 08/22/25, 4:45 PM
```

## 四、实战场景：Temporal 解决实际问题

### 场景 1：计算两个日期之间的工作日（排除周末）

```JavaScript

function countWeekdays(startDateStr, endDateStr) {
  let start = Temporal.PlainDate.from(startDateStr);
  const end = Temporal.PlainDate.from(endDateStr);
  let count = 0;

  while (start <= end) {
    const dayOfWeek = start.dayOfWeek; // 1=周一，7=周日
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // 排除周六（6）、周日（7）
      count++;
    }
    start = start.add({ days: 1 }); // 不可变，必须重新赋值
  }
  return count;
}

console.log(countWeekdays('2025-08-22', '2025-08-30')); // 6（22-30共9天，排除23、24、30三天周末）
```

### 场景 2：跨时区时间转换与格式化

需求：将纽约时间 2025-09-01 09:00 转换为北京、伦敦时间，并格式化显示

```JavaScript

// 创建纽约时间
const nycTime = Temporal.ZonedDateTime.from({
  year: 2025,
  month: 9,
  day: 1,
  hour: 9,
  minute: 0,
  timeZone: 'America/New_York'
});

// 转换为北京、伦敦时间
const beijingTime = nycTime.withTimeZone('Asia/Shanghai');
const londonTime = nycTime.withTimeZone('Europe/London');

// 格式化函数
const formatTime = (zonedTime) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'long'
  }).format(zonedTime);
};

console.log(formatTime(beijingTime)); // 2025-09-01 21:00 中国标准时间
console.log(formatTime(londonTime)); // 2025-09-01 14:00 英国夏令时间
```

### 场景 3：高精度时间戳记录（如接口请求耗时）

```JavaScript

// 记录开始时间（纳秒级精度）
const startInstant = Temporal.Now.instant();

// 模拟接口请求
await new Promise(resolve => setTimeout(resolve, 123));

// 记录结束时间
const endInstant = Temporal.Now.instant();

// 计算耗时（转为毫秒，保留3位小数）
const duration = endInstant.since(startInstant);
const cost = duration.total('milliseconds').toFixed(3);
console.log(`接口请求耗时：${cost}ms`); // 输出：接口请求耗时：123.456ms
```

## 五、兼容性与使用建议

### 1. 原生支持情况（2025年最新）

|环境|支持版本|
|---|---|
|Chrome / Edge|110+|
|Firefox|124+|
|Safari|16.4+|
|Node.js|20+|
|移动端|安卓 Chrome 110+、iOS Safari 16.4+|
### 2. 兼容旧环境的方案

如果需要支持低版本浏览器/Node.js，需引入 polyfill：

```Bash

# 安装 polyfill
npm install @js-temporal/polyfill
```

```JavaScript

// 入口文件引入（仅旧环境需要，现代环境可省略）
import '@js-temporal/polyfill';
```

### 3. 生产环境使用建议

- 新项目（仅支持现代环境）：直接使用 Temporal，无需依赖第三方库；

- 老项目迁移：先保留 `Date` 代码，新功能用 Temporal，逐步替换；

- 过渡方案：如果需要兼容低版本，可先用 `date-fns`/`luxon`，待环境支持后迁移到 Temporal。

## 六、易错点总结（避坑指南）

1. **时区名称必须用 IANA 标准**：如 `Asia/Shanghai`（正确），不能用 `GMT+8`（错误）；

2. **不可变对象的赋值问题**：所有操作返回新对象，必须重新赋值才能生效（如 `date = date.add({ days: 1 })`，而非 `date.add({ days: 1 })`）；

3. **PlainDateTime 无时区**：不要用它存储实际业务时间，否则会出现时区混乱，优先用 `ZonedDateTime`；

4. **字符串解析仅支持 ISO 格式**：如 `2025-08-22`（正确），`2025/08/22`（错误），非 ISO 格式需手动处理；

5. **dayOfWeek 从 1 开始**：1=周一，7=周日，与 `Date.getDay()`（0=周日）不同，需注意区分。
> （注：文档部分内容可能由 AI 生成）