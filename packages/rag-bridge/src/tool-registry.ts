import { registerTool } from "@claude-code-best/agent-tools";
import { z } from "zod";
import { parseFigmaDesignJson, buildRagContext } from "./index.ts";

registerTool({
  name: "figma_to_rag_context",
  description: "读取Figma图层JSON，生成向量知识库上下文并注入会话",
  inputSchema: z.object({
    figmaJson: z.string().describe("Figma MCP返回的设计结构化JSON"),
    projectId: z.string().describe("当前项目ID"),
  }),
  async handler({ figmaJson, projectId }) {
    // 1.解析Figma数据
    const designText = parseFigmaDesignJson(figmaJson);
    // 2.拉取向量代码片段
    const fullContext = await buildRagContext(designText, projectId);

    return {
      success: true,
      contextText: fullContext,
      tip: "已将设计稿+匹配代码注入当前会话",
    };
  },
});
