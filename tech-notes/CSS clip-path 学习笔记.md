# CSS clip-path 学习笔记

## 一、clip-path 核心定义

clip-path 是 CSS 中用于**裁剪元素可视区域**的属性，它可以指定一个形状（或路径），只有元素位于该形状/路径内部的部分会显示，外部部分会被隐藏（并非删除，不影响元素布局和交互，仅视觉隐藏）。

核心作用：实现不规则元素形状、图片裁剪、自定义按钮/卡片样式，替代传统的图片裁剪或定位嵌套方案，代码更简洁、可维护性更强。

补充：clip-path 是 CSS3 新增属性，替代了旧版 clip 属性（旧版仅支持矩形，功能有限，已逐渐废弃）。

## 二、基本语法

clip-path 的语法核心是“指定裁剪路径/形状”，属性值分为三大类：基本形状、自定义路径、关键字，通用语法如下：
```css
clip-path: <clip-source> | <basic-shape> | <geometry-box> | none;
```

```css

/* 基本语法 */
element {
  clip-path: 取值类型(参数); /* 核心写法 */
  /* 可选：配合 transition 实现裁剪动画 */
  transition: clip-path 0.3s ease;
}

```

关键说明：裁剪的基准是元素的**盒模型**（默认基于 border-box，可通过 clip-path 的 geometry-box 参数修改，如 content-box、padding-box）。

## 三、三大类取值详解（重点）

### （一）关键字取值（最简单，无需参数）

仅 2 个常用关键字，用于快速裁剪，适合基础场景：

1. **none**：默认值，不裁剪元素，元素完整显示。

2. **inset(0)**：等价于 clip-path: inset(0 0 0 0)，裁剪后元素完全隐藏（四个方向缩进0，可视区域为0）。

```css

/* 示例：默认不裁剪 / 完全隐藏 */
.box1 { clip-path: none; } /* 完整显示 */
.box2 { clip-path: inset(0); } /* 完全隐藏 */

```

### （二）基本形状取值（最常用，需掌握）

指定预设的基本形状，搭配参数调整尺寸和位置，常用 4 种形状，覆盖 80% 日常场景：

#### 1. inset()：矩形裁剪（内凹裁剪）

作用：从元素的四个方向向内缩进，形成矩形可视区域，支持圆角（可选）。

语法：clip-path: inset(上 右 下 左 round 圆角值);（上下左右顺序遵循“顺时针”，可简写）

参数说明：

- 上/右/下/左：缩进距离（支持 px、%、em 等单位，% 相对于元素自身宽高）；

- round 圆角值（可选）：给裁剪后的矩形添加圆角，格式同 border-radius（如 10px、10px 20px）。

```css

/* 示例1：普通矩形裁剪（上10px、右20px、下10px、左20px） */
.box {
  width: 200px;
  height: 200px;
  background: #f00;
  clip-path: inset(10px 20px 10px 20px);
}

/* 示例2：带圆角的矩形裁剪 */
.box {
  clip-path: inset(10% 5% round 15px); /* 上下缩进10%、左右缩进5%，圆角15px */
}

```

#### 2. circle()：圆形裁剪

作用：裁剪出圆形可视区域，需指定半径和圆心位置（可选）。

语法：clip-path: circle(半径 at 圆心坐标);（圆心坐标可选，默认在元素中心）

参数说明：

- 半径：支持 px、%、em，也可写关键字（closest-side：取元素宽高最小值的一半；farthest-side：取元素宽高最大值的一半）；

- 圆心坐标：格式为“x y”（如 50% 50%，默认值，即元素中心），支持 px、%，x 轴从左到右、y 轴从上到下。

```css

/* 示例1：默认圆心（中心），半径50px */
.box { clip-path: circle(50px); }

/* 示例2：圆心在(30% 70%)，半径取元素最小边的一半 */
.box { clip-path: circle(closest-side at 30% 70%); }

/* 示例3：圆形图片裁剪（常用场景） */
img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  clip-path: circle(50%); /* 完美圆形（半径50%，等价于 closest-side） */
}

```

#### 3. ellipse()：椭圆形裁剪

作用：裁剪出椭圆形可视区域，需指定x轴半径、y轴半径和圆心位置（可选），可理解为“拉伸的圆形”。

语法：clip-path: ellipse(x轴半径 y轴半径 at 圆心坐标);（圆心默认元素中心）

```css

/* 示例1：x轴半径80px、y轴半径50px，默认圆心 */
.box { clip-path: ellipse(80px 50px); }

/* 示例2：圆心在(200px 100px)，x轴取最大边一半、y轴取最小边一半 */
.box { clip-path: ellipse(farthest-side closest-side at 200px 100px); }

```

#### 4. polygon()：多边形裁剪（最灵活）

作用：通过指定多个坐标点，裁剪出任意多边形（三角形、菱形、五边形等），坐标点按“顺时针/逆时针”顺序排列，闭合形成形状。

语法：clip-path: polygon(x1 y1, x2 y2, x3 y3, ..., xn yn);（每个坐标点代表多边形的一个顶点，至少3个点）

关键：坐标点 (x,y) 以元素左上角为原点（0 0），x 轴向右、y 轴向下，支持 px、%。

```css

/* 示例1：三角形（最常用，3个顶点） */
.triangle {
  width: 200px;
  height: 200px;
  background: #00f;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%); /* 上顶点、左下顶点、右下顶点 */
}

/* 示例2：菱形（4个顶点） */
.diamond {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

/* 示例3：五边形（5个顶点） */
.pentagon {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

```

### （三）自定义路径取值（path()，高级用法）

当基本形状无法满足需求时，使用 path() 函数自定义裁剪路径，支持 SVG 路径语法（如 M、L、C、Z 等指令），可绘制任意复杂形状（心形、五角星、不规则曲线等）。

语法：clip-path: path("SVG路径指令");（路径指令需用引号包裹，结尾用 Z 闭合路径）

```css

/* 示例1：自定义心形裁剪 */
.heart {
  width: 200px;
  height: 200px;
  background: #f00;
  clip-path: path("M100,20 C140,0 200,40 200,100 C200,160 100,200 100,200 C100,200 0,160 0,100 C0,40 60,0 100,20 Z");
}

/* 示例2：简单曲线形状 */
.custom-shape {
  clip-path: path("M0,50 C50,0 150,100 200,50 L200,150 C150,100 50,200 0,150 Z");
}

```

## 四、常用场景总结

1. **图片裁剪**：圆形头像、椭圆形海报、多边形图文展示（替代 border-radius 无法实现的不规则形状）；

2. **按钮/卡片样式**：多边形按钮、带内凹效果的卡片（用 inset() 实现内凹，配合 background 增强视觉）；

3. **动画效果**：配合 transition 或 animation，实现“裁剪形状切换”（如圆形→方形、静态形状→动态路径）；

4. **布局装饰**：自定义导航栏边角、不规则色块装饰（无需额外嵌套元素，纯 CSS 实现）。

```css

/* 示例：裁剪动画（圆形→菱形） */
.box {
  width: 200px;
  height: 200px;
  background: #0f0;
  clip-path: circle(50%);
  transition: clip-path 0.5s ease;
}
.box:hover {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* 切换为菱形 */
}
```

## 五、注意事项（避坑重点）

- **兼容性**：现代浏览器（Chrome、Firefox、Edge、Safari 10.1+）均支持，IE 完全不支持；如需兼容旧浏览器，需搭配降级方案（如图片裁剪用 PNG 透明图）。

- **交互区域**：裁剪后的元素，**隐藏部分仍可触发交互**（如点击、hover）；若需隐藏交互，需配合 pointer-events: none（但会取消整个元素交互，需灵活使用）。

- **定位影响**：clip-path 不影响元素的文档流，裁剪后的元素占位大小不变（仅视觉隐藏），无需担心布局错乱。

- **背景裁剪**：clip-path 裁剪的是整个元素（包括背景、内容、边框），若需单独裁剪背景，需配合 background-clip 属性。

- **路径闭合**：使用 polygon() 或 path() 时，务必保证坐标点/路径闭合（polygon 自动闭合，path 需用 Z 指令闭合），否则裁剪会出现异常。

## 六、总结

clip-path 是 CSS 中非常实用的“视觉裁剪工具”，核心优势是**简洁、灵活、可动画**，无需额外元素即可实现不规则形状。

日常使用优先级：基本形状（inset/circle/ellipse/polygon）→ 自定义路径（path()）；配合 transition/animation 可实现更丰富的视觉效果，是前端样式优化的常用工具。
> （注：文档部分内容可能由 AI 生成）