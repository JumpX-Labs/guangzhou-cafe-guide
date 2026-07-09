import { motion } from 'framer-motion'
import { FileJson, Globe, Server } from 'lucide-react'
import WobblyCard from '../components/WobblyCard.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'

interface EndpointProps {
  method: string
  path: string
  description: string
  request?: string
  response?: string
}

const methodColors: Record<string, string> = {
  GET: 'bg-green text-paper border-green',
  POST: 'bg-ink text-paper border-ink',
  PUT: 'bg-brown text-paper border-brown',
  DELETE: 'bg-red text-paper border-red',
}

function Endpoint({ method, path, description, request, response }: EndpointProps) {
  return (
    <WobblyCard className="p-5" rotate={-0.3}>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className={`px-3 py-1 font-hand text-sm border-2 rounded-wobbly-sm ${methodColors[method]}`}>
          {method}
        </span>
        <code className="font-mono text-sm text-ink bg-paper px-2 py-1 rounded border border-ink/20">
          {path}
        </code>
      </div>
      <p className="font-body text-ink-soft mb-3">{description}</p>

      {request && (
        <div className="mb-3">
          <p className="text-xs font-hand text-ink/70 mb-1">请求体</p>
          <pre className="bg-paper p-3 rounded-wobbly-sm text-xs font-mono overflow-x-auto border border-ink/20">
            {request}
          </pre>
        </div>
      )}

      {response && (
        <div>
          <p className="text-xs font-hand text-ink/70 mb-1">响应示例</p>
          <pre className="bg-paper p-3 rounded-wobbly-sm text-xs font-mono overflow-x-auto border border-ink/20">
            {response}
          </pre>
        </div>
      )}
    </WobblyCard>
  )
}

export default function ApiDocs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="space-y-2">
        <ScribbleTitle as="h1" className="text-4xl">API 文档</ScribbleTitle>
        <p className="font-body text-ink-soft">
          广州咖啡馆探店手册开放 API，支持咖啡馆数据的读取与编辑。
        </p>
      </div>

      <WobblyCard className="p-5 bg-paper-light" rotate={0.5}>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-red" />
          <h2 className="font-display text-xl">Base URL</h2>
        </div>
        <div className="space-y-2 font-mono text-sm">
          <p className="bg-paper p-2 rounded-wobbly-sm border border-ink/20">
            开发环境：<span className="text-red">http://localhost:3001/api</span>
          </p>
          <p className="bg-paper p-2 rounded-wobbly-sm border border-ink/20">
            生产环境（经前端代理）：<span className="text-red">/api</span>
          </p>
        </div>
      </WobblyCard>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-green" />
          <h2 className="font-display text-2xl">咖啡馆接口</h2>
        </div>

        <Endpoint
          method="GET"
          path="/api/cafes"
          description="获取所有咖啡馆列表，返回 CafeInput 数组。"
          response={`[
  {
    "id": "miaoqian",
    "name": "庙前咖啡",
    "slug": "miaoqian-cafe",
    "district": "dongshankou",
    ...
  }
]`}
        />

        <Endpoint
          method="GET"
          path="/api/cafes/:slug"
          description="根据 slug 获取单个咖啡馆详情。"
          response={`{
  "id": "miaoqian",
  "name": "庙前咖啡",
  "slug": "miaoqian-cafe",
  "district": "dongshankou",
  "address": "越秀区庙前直街 16 号",
  "hours": "10:00 - 22:00",
  "tags": ["老洋房", "手冲", "安静"],
  "rating": 4.7,
  "priceRange": "¥35-55",
  "signatureDrinks": ["东山口手冲", "焦糖玛奇朵", "冷萃咖啡"],
  "tips": ["周末下午人较多，建议上午去"],
  "vibe": "适合一个人发呆或带本书坐一下午",
  "description": "藏在东山口红砖老洋房里的社区咖啡馆...",
  "imagePrompt": "Cozy specialty coffee shop...",
  "recommendation": "想感受东山口文艺气息，从这里开始。"
}`}
        />

        <Endpoint
          method="POST"
          path="/api/cafes"
          description="新增一家咖啡馆。name 和 slug 为必填字段，slug 不能重复。"
          request={`{
  "id": "xiguan-2026",
  "name": "西关咖啡",
  "slug": "xiguan-cafe",
  "district": "beijinglu",
  "address": "荔湾区恩宁路 88 号",
  "hours": "09:00 - 21:00",
  "tags": ["西关", "骑楼", "手冲"],
  "rating": 4.6,
  "priceRange": "¥30-55",
  "signatureDrinks": ["西关手冲", "荔枝气泡美式"],
  "tips": ["骑楼街景位很舒服"],
  "vibe": "适合感受老西关烟火气",
  "description": "藏在恩宁路骑楼里的社区咖啡馆...",
  "imagePrompt": "Cozy coffee shop in Guangzhou Xiguan...",
  "recommendation": "想一次过体验西关和咖啡，来这里坐窗边。"
}`}
          response={`{
  "id": "xiguan-2026",
  "name": "西关咖啡",
  ...
}`}
        />

        <Endpoint
          method="PUT"
          path="/api/cafes/:id"
          description="根据 id 更新咖啡馆全部字段。"
          request={`{
  "name": "西关咖啡（更新后）",
  "slug": "xiguan-cafe",
  "district": "beijinglu",
  ...
}`}
          response={`{
  "id": "xiguan-2026",
  "name": "西关咖啡（更新后）",
  ...
}`}
        />

        <Endpoint
          method="DELETE"
          path="/api/cafes/:id"
          description="根据 id 删除咖啡馆。成功返回 204 No Content。"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileJson className="w-5 h-5 text-brown" />
          <h2 className="font-display text-2xl">街区与数据接口</h2>
        </div>

        <Endpoint
          method="GET"
          path="/api/districts"
          description="获取所有街区信息。"
          response={`[
  {
    "id": "dongshankou",
    "name": "东山口",
    "slug": "dongshankou",
    "description": "红砖洋房与咖啡香交织的老城文艺地带",
    "position": { "x": 68, "y": 42 }
  }
]`}
        />

        <Endpoint
          method="POST"
          path="/api/reset"
          description="将咖啡馆数据重置为默认种子数据（api/data/seed.json）。返回重置后的咖啡馆列表。"
          response={`[
  { "id": "miaoqian", "name": "庙前咖啡", ... }
]`}
        />
      </div>

      <WobblyCard className="p-5" rotate={-0.5}>
        <h2 className="font-display text-xl mb-3">数据模型</h2>
        <p className="font-body text-ink-soft mb-3">
          所有咖啡馆接口返回的数据结构基于 CafeInput，字段如下：
        </p>
        <pre className="bg-paper p-3 rounded-wobbly-sm text-xs font-mono overflow-x-auto border border-ink/20">
{`interface CafeInput {
  id: string
  name: string
  slug: string
  district: string
  address: string
  hours: string
  tags: string[]
  rating: number
  priceRange: string
  signatureDrinks: string[]
  tips: string[]
  vibe: string
  description: string
  imagePrompt: string
  recommendation: string
}`}
        </pre>
      </WobblyCard>

      <WobblyCard className="p-5" rotate={0.5}>
        <h2 className="font-display text-xl mb-3">状态码</h2>
        <ul className="space-y-2 font-body text-ink-soft text-sm">
          <li><strong className="text-ink">200</strong> 请求成功</li>
          <li><strong className="text-ink">201</strong> 创建成功</li>
          <li><strong className="text-ink">204</strong> 删除成功，无返回体</li>
          <li><strong className="text-ink">400</strong> 请求参数错误</li>
          <li><strong className="text-ink">404</strong> 资源不存在</li>
          <li><strong className="text-ink">409</strong> slug 已存在</li>
          <li><strong className="text-ink">500</strong> 服务器内部错误</li>
        </ul>
      </WobblyCard>
    </motion.div>
  )
}
