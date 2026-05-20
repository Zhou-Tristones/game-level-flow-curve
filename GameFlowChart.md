游戏情绪流设计器 (Game Flow Designer) 技术设计文档
1. 技术栈要求 (Tech Stack)
框架: React (Vite 驱动)
类型系统: TypeScript (确保数据结构严谨)
样式: Tailwind CSS (用于快速布局和响应式设计)
图表库: Recharts (必须支持 ResponsiveContainer, AreaChart, ReferenceArea)
图标: Lucide React
状态管理: React Hooks (useState, useMemo)
2. 核心数据模型 (Data Models)
TypeScript
type TrendType = '上升' | '下降' | '平坦'
;

interface
 GameEvent {
  id: string
;
  name: 
string;      // 事件名称
  duration: 
number;  // 持续时间（分钟）
  value: 
number;     // 情绪目标值 (0-100)
  trend: TrendType;  
// 走向曲线类型
}

interface
 ChartInstance {
  id: string
;
  title: 
string;     // 图表标题（如：第一关）
  yAxisName: 
string; // Y轴定义（如：紧张感、刺激感）
  events: GameEvent[];
}
3. 功能需求详细说明 (Functional Requirements)
3.1 状态管理
系统最多支持 3个ChartInstance。
每个图表的总 duration 累加上限为 30分钟。
全局状态应包含一个 charts 数组。
3.2 曲线逻辑 (Drawing Logic)
坐标计算: 图表的数据点需要根据 GameEvent 数组动态计算。
时间轴: X轴起始为 0。每个事件的 X 轴结束点 = 前一个事件的结束点 + 当前事件 duration。
数值衔接:
第 N 个事件的起始值 = 第 N-1 个事件的结束值。
平坦: 当前事件结束值 = 起始值。
上升: 当前事件结束值 = 用户输入的情绪值（需大于起始值，若小于则视为平滑上升）。
下降: 当前事件结束值 = 用户输入的情绪值（需小于起始值）。
插值: 为了让曲线好看，每个事件区间生成 2 个点（起点和终点），Recharts 使用 type="monotone" 进行平滑插值。
3.3 UI 布局规范
顶部栏: 显示“添加图表”按钮（当数量 < 3 时可用）。
网格布局: 使用 grid-cols-1 或 grid-cols-3 展示图表卡片。
图表展示:
渲染一个 AreaChart。
区间标注: 使用 ReferenceArea 在背景上为每个事件填充不同的淡色色块，并在顶部显示 name。
交互: 点击整个图表区域，下方滑动展开该图表的“数据编辑面板”。
编辑面板 (Data Table):
包含输入框：修改图表标题、修改 Y 轴名称。
表格列：序号、事件名、持续时间、情绪目标值、趋势选择（下拉框）、操作（删除）。
底部有“添加事件行”按钮。
4. 交互逻辑 (Logic Flow)
初始化: 默认生成一个含 3 个基础事件的图表。
实时同步: 用户在表格中修改任何数值，左/上方的图表必须实时重新渲染。
校验:
如果总时长超过 30，输入框显示红色警告。
情绪值限制在 0-100。
5. 视觉要求
使用 暗色模式 为底色（bg-slate-950）。
曲线颜色：#8b5cf6 (Purple 500)。
填充颜色：线性渐变。
事件区间文本：小字号、高透明度白色，居中显示在区间顶部。
