import { motion } from 'framer-motion'
import { BookOpen, Target, Code, Lightbulb, CheckCircle } from 'lucide-react'
import WobblyCard from '../components/WobblyCard.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-red" />
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      <WobblyCard className="p-5" rotate={-0.3}>
        {children}
      </WobblyCard>
    </section>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-paper p-3 rounded-wobbly-sm text-xs font-mono overflow-x-auto border border-ink/20 whitespace-pre-wrap">
      {children}
    </pre>
  )
}

export default function Assignment() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="space-y-2">
        <ScribbleTitle as="h1" className="text-4xl">课程作业</ScribbleTitle>
        <p className="font-body text-ink-soft">
          通过本作业，掌握 HTTP API 的增、查操作，并使用 AI 辅助完成数据整理与可视化。
        </p>
      </div>

      <Section icon={Target} title="作业目标">
        <ul className="space-y-2 font-body text-ink-soft">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            使用真实 API 对线上数据进行增、查操作
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            理解前端数据来自后端 API，而非写死在代码里
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            使用 AI 辅助完成 API 调用与数据处理
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            将主题数据转换成 JSON，构建一个类似咖啡馆手册的 API 站点
          </li>
        </ul>
      </Section>

      <Section icon={Code} title="任务一：新增一家咖啡馆">
        <p className="font-body text-ink-soft mb-4">
          调用 <code className="bg-paper px-1.5 py-0.5 rounded border border-ink/20 text-sm">POST /api/cafes</code> 新增一家咖啡馆，名称里必须带上你的姓名。
        </p>
        <div className="space-y-2 mb-4">
          <p className="font-hand text-lg text-red">示例：</p>
          <ul className="font-body text-ink-soft list-disc list-inside">
            <li>花园咖啡（张三）</li>
            <li>东山口小馆（李四）</li>
            <li>西关旧时光（王五）</li>
          </ul>
        </div>
        <CodeBlock>{`curl -X POST http://localhost:3001/api/cafes \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "zhangsan-garden-2026",
    "name": "花园咖啡（张三）",
    "slug": "zhangsan-garden-cafe",
    "district": "dongshankou",
    "address": "越秀区某某路 1 号",
    "hours": "10:00 - 22:00",
    "tags": ["社区", "安静", "手冲"],
    "rating": 4.5,
    "priceRange": "¥30-50",
    "signatureDrinks": ["招牌拿铁"],
    "tips": ["周末人多，建议上午去"],
    "vibe": "适合一个人发呆或看书",
    "description": "藏在东山口老小区里的安静咖啡馆。",
    "imagePrompt": "A cozy coffee shop in Guangzhou old neighborhood, morning light, wooden furniture",
    "recommendation": "来这里晒太阳、看书。"
  }'`}</CodeBlock>
        <p className="font-body text-ink-soft mt-4">
          调用成功后，刷新 <a href="/explore" className="text-red hover:underline">/explore</a> 页面，找到你新增的咖啡馆并截图。
        </p>
      </Section>

      <Section icon={BookOpen} title="任务二：获取所有咖啡馆并做分析">
        <p className="font-body text-ink-soft mb-4">
          调用 <code className="bg-paper px-1.5 py-0.5 rounded border border-ink/20 text-sm">GET /api/cafes</code> 获取全部数据，然后完成以下任一任务：
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <WobblyCard className="p-4" rotate={1}>
            <h3 className="font-display text-lg mb-2">A. 数据分析</h3>
            <p className="text-sm text-ink-soft">
              统计总数、街区分布、评分最高、价格最低等。
            </p>
          </WobblyCard>
          <WobblyCard className="p-4" rotate={-1}>
            <h3 className="font-display text-lg mb-2">B. 数据可视化</h3>
            <p className="text-sm text-ink-soft">
              用 Excel、Python、ECharts 等制作图表。
            </p>
          </WobblyCard>
          <WobblyCard className="p-4" rotate={1}>
            <h3 className="font-display text-lg mb-2">C. 推荐清单</h3>
            <p className="text-sm text-ink-soft">
              生成本周推荐、评分最高、人均最低清单。
            </p>
          </WobblyCard>
        </div>
        <p className="font-body text-ink-soft mt-4">
          可以让 AI 辅助完成，例如：
        </p>
        <ul className="font-body text-ink-soft list-disc list-inside">
          <li>“帮我把这段 JSON 整理成按街区统计的表格”</li>
          <li>“生成一个 ECharts 柱状图代码”</li>
          <li>“根据评分和价格写一份推荐清单”</li>
        </ul>
      </Section>

      <Section icon={Lightbulb} title="任务三：构建你自己的主题 API 站点">
        <p className="font-body text-ink-soft mb-4">
          从以下 5 个主题中选择一个，构建一个类似当前咖啡馆手册的 API 站点：
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {['演员资料站', '咖啡馆探店手册', '读书笔记库', '线上课程资源库', 'AI 工具推荐库'].map((theme, i) => (
            <WobblyCard key={theme} className="p-3 text-center" rotate={i % 2 === 0 ? -1 : 1}>
              <span className="font-display text-lg">{theme}</span>
            </WobblyCard>
          ))}
        </div>
        <div className="mt-4 space-y-2 font-body text-ink-soft">
          <p>要求：</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>把主题数据整理成 JSON 格式（至少 8 条记录）</li>
            <li>构建 API，至少包含 3 个端点（例如 GET /api/items、GET /api/items/:id、POST /api/items）</li>
            <li>必须有独立的 API 使用文档页，说明每个端点的请求/响应格式</li>
            <li>前端包含首页、列表页、详情页、管理页</li>
            <li>使用 AI 辅助完成数据生成、界面设计、代码编写、API 调试</li>
            <li>本地能运行前后端，并可以通过 API 请求完成数据操作</li>
            <li>提交时附上本地 API 调用截图（curl、Postman、浏览器控制台均可）</li>
          </ol>
        </div>
      </Section>

      <Section icon={CheckCircle} title="评分标准">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body text-ink-soft">
            <thead>
              <tr className="border-b-2 border-ink/20">
                <th className="text-left py-2 px-2">项目</th>
                <th className="text-left py-2 px-2">分值</th>
                <th className="text-left py-2 px-2">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink/10">
                <td className="py-2 px-2">任务一</td>
                <td className="py-2 px-2">10</td>
                <td className="py-2 px-2">成功新增带自己姓名的咖啡馆</td>
              </tr>
              <tr className="border-b border-ink/10">
                <td className="py-2 px-2">任务二</td>
                <td className="py-2 px-2">10</td>
                <td className="py-2 px-2">正确调用 GET API，完成分析/可视化/推荐</td>
              </tr>
              <tr className="border-b border-ink/10">
                <td className="py-2 px-2">任务三</td>
                <td className="py-2 px-2">70</td>
                <td className="py-2 px-2">独立完成主题 API 站点（至少 3 个端点 + API 文档）</td>
              </tr>
              <tr>
                <td className="py-2 px-2">提交到微信群</td>
                <td className="py-2 px-2">10</td>
                <td className="py-2 px-2">将项目链接或本地 API 调用截图发到课程微信群</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </motion.div>
  )
}
