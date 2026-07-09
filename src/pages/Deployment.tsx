import { motion } from 'framer-motion'
import {
  Cloud,
  Database,
  Server,
  Layers,
  ArrowRight,
  FileJson,
  ShieldAlert,
  Globe,
  Terminal,
  CheckCircle,
} from 'lucide-react'
import WobblyCard from '../components/WobblyCard.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
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

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red text-paper-light font-display flex items-center justify-center border-2 border-ink">
        {n}
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg">{title}</h3>
        <div className="font-body text-ink-soft text-sm">{children}</div>
      </div>
    </div>
  )
}

export default function Deployment() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 space-y-10"
    >
      <div className="space-y-2">
        <ScribbleTitle as="h1" className="text-4xl">部署</ScribbleTitle>
        <p className="font-body text-ink-soft">
          这个项目是怎么跑起来的，以及为什么它最终选择了数据库而不是本地 JSON 文件。
        </p>
      </div>

      <Section icon={Layers} title="项目架构">
        <p className="font-body text-ink-soft mb-4">
          整个站点分为三层：前端页面、Cloudflare Pages Functions、Supabase 数据库。浏览器不直接访问数据库，而是通过 API 路由间接读写数据。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 font-body text-sm my-6">
          <div className="flex flex-col items-center gap-2 p-3 bg-paper rounded-wobbly-sm border border-ink/20">
            <Globe className="w-6 h-6 text-red" />
            <span>浏览器</span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink/40 rotate-90 sm:rotate-0" />
          <div className="flex flex-col items-center gap-2 p-3 bg-paper rounded-wobbly-sm border border-ink/20">
            <Cloud className="w-6 h-6 text-blue-500" />
            <span>Cloudflare Pages</span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink/40 rotate-90 sm:rotate-0" />
          <div className="flex flex-col items-center gap-2 p-3 bg-paper rounded-wobbly-sm border border-ink/20">
            <Server className="w-6 h-6 text-green-600" />
            <span>Pages Functions</span>
          </div>
          <ArrowRight className="w-5 h-5 text-ink/40 rotate-90 sm:rotate-0" />
          <div className="flex flex-col items-center gap-2 p-3 bg-paper rounded-wobbly-sm border border-ink/20">
            <Database className="w-6 h-6 text-purple-600" />
            <span>Supabase</span>
          </div>
        </div>
        <ul className="space-y-2 font-body text-ink-soft">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            <strong>前端</strong>：React 18 + Vite + TypeScript + Tailwind CSS，构建后生成静态文件放到 Pages。
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            <strong>后端 API</strong>：Hono 框架运行在 Cloudflare Pages Functions 中，文件位于 <code className="bg-paper px-1 rounded border border-ink/20">functions/api/[[route]].ts</code>。
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green mt-1 flex-shrink-0" />
            <strong>数据库</strong>：Supabase PostgreSQL，通过 <code className="bg-paper px-1 rounded border border-ink/20">@supabase/supabase-js</code> 访问。
          </li>
        </ul>
      </Section>

      <Section icon={Cloud} title="如何部署到 Cloudflare">
        <div className="space-y-6">
          <Step n={1} title="安装依赖">
            项目使用 <code className="bg-paper px-1 rounded border border-ink/20">hono</code> 作为 Cloudflare Workers 兼容的 Web 框架，使用 <code className="bg-paper px-1 rounded border border-ink/20">wrangler</code> 作为部署 CLI。
            <CodeBlock>{`npm install hono
npm install -D wrangler`}</CodeBlock>
          </Step>

          <Step n={2} title="构建前端">
            Vite 会把 React 代码打包到 <code className="bg-paper px-1 rounded border border-ink/20">dist/</code> 目录。
            <CodeBlock>{`npm run build`}</CodeBlock>
          </Step>

          <Step n={3} title="部署到 Cloudflare Pages">
            使用 wrangler 把 dist 目录部署为 Pages 项目，同时 <code className="bg-paper px-1 rounded border border-ink/20">functions/</code> 目录会被自动打包为 Functions。
            <CodeBlock>{`npx wrangler pages deploy dist --project-name guangzhou-cafe-guide --branch main`}</CodeBlock>
          </Step>

          <Step n={4} title="设置环境变量">
            Supabase 的 URL 和 service role key 通过 wrangler 上传到 Cloudflare Secrets，不会暴露在代码里。
            <CodeBlock>{`npx wrangler pages secret put SUPABASE_URL --project-name guangzhou-cafe-guide
npx wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name guangzhou-cafe-guide`}</CodeBlock>
          </Step>

          <Step n={5} title="验证">
            部署完成后访问线上地址，测试 API 是否返回数据。
            <CodeBlock>{`curl https://<your-pages-url>/api/cafes`}</CodeBlock>
          </Step>
        </div>
      </Section>

      <Section icon={FileJson} title="为什么用 JSON 也能跑，却还要数据库？">
        <p className="font-body text-ink-soft mb-4">
          本地开发时，确实可以直接用 JSON 文件提供 API：Express 读取 <code className="bg-paper px-1 rounded border border-ink/20">cafes.json</code>，新增时写回文件即可。对于学生作业来说，这已经足够。
        </p>
        <p className="font-body text-ink-soft mb-4">
          但要把项目真正部署到 Cloudflare、Vercel、Netlify 等 Serverless 平台时，JSON 文件写入会失败，原因如下：
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <WobblyCard className="p-4" rotate={1}>
            <h3 className="font-display text-lg mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red" />
              文件系统只读
            </h3>
            <p className="text-sm text-ink-soft">
              Serverless 实例的运行包被视为只读产物，运行时不能修改。
            </p>
          </WobblyCard>
          <WobblyCard className="p-4" rotate={-1}>
            <h3 className="font-display text-lg mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-red" />
              无状态多实例
            </h3>
            <p className="text-sm text-ink-soft">
              平台可能同时启动多个实例，写在 A 实例本地文件的数据，B 实例看不到。
            </p>
          </WobblyCard>
          <WobblyCard className="p-4" rotate={-1}>
            <h3 className="font-display text-lg mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red" />
              生命周期短
            </h3>
            <p className="text-sm text-ink-soft">
              函数实例用完后会被销毁，即使允许写入，数据也留不住。
            </p>
          </WobblyCard>
          <WobblyCard className="p-4" rotate={1}>
            <h3 className="font-display text-lg mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-red" />
              数据库持久化
            </h3>
            <p className="text-sm text-ink-soft">
              PostgreSQL 等数据库独立于实例，所有请求读写同一份数据，真正持久化。
            </p>
          </WobblyCard>
        </div>
        <p className="font-body text-ink-soft">
          因此，广州咖啡手册选择了 <strong>Supabase PostgreSQL</strong> 作为数据持久层。学生作业仍然可以只用本地 JSON 文件，但广州咖啡手册本身要能上线，就必须使用数据库。
        </p>
      </Section>

      <Section icon={Database} title="数据现在存在哪里？">
        <p className="font-body text-ink-soft mb-4">
          咖啡馆和区域数据保存在 Supabase 的两张表中：
        </p>
        <CodeBlock>{`cafes        -- 咖啡馆详情（id, name, slug, district, address, hours, tags, rating ...）
districts    -- 广州街区（id, name, slug, description, position_x, position_y）`}</CodeBlock>
        <p className="font-body text-ink-soft mt-4">
          数据层通过 <code className="bg-paper px-1 rounded border border-ink/20">createDbClient(url, key)</code> 工厂函数创建，既可以在本地 Express 后端使用，也可以在 Cloudflare Pages Functions 中使用，保证了前后端逻辑一致。
        </p>
      </Section>
    </motion.div>
  )
}
