import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadComponentDocuments } from "./";

// 1. 实例化服务
const server = new Server(
  {
    name: "ai4code-component-rag",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. 工具列表：注册 tools/list
server.setRequestHandler(
  z.object({
    method: z.literal("tools/list"),
  }),
  async () => {
    return {
      tools: [
        {
          name: "search_ai4code_component",
          description: "查询AI4Code组件库文档，生成组件代码必须使用该文档",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "组件名称、API、属性关键词",
              },
            },
            required: ["query"],
          },
        },
      ],
    };
  }
);

// 3. 工具执行：注册 tools/call
server.setRequestHandler(
  z.object({
    method: z.literal("tools/call"),
    params: z.object({
      name: z.string(),
      arguments: z.object({
        query: z.string(),
      }),
    }),
  }),
  async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "search_ai4code_component") {
      const docs = await loadComponentDocuments();
      const matched = docs
        .filter((item) => {
          const metaStr = JSON.stringify(item.metadata);
          return item.pageContent.includes(args.query) || metaStr.includes(args.query);
        })
        .slice(0, 4);

      return {
        content: matched.map((d) => ({
          type: "text",
          text: `【组件元信息】${JSON.stringify(d.metadata)}\n【文档内容】\n${d.pageContent}`,
        })),
      };
    }

    throw new Error(`未知工具：${name}`);
  }
);

// 4. 绑定stdio传输
const transport = new StdioServerTransport();
await server.connect(transport);