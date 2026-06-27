// 解析Figma设计JSON + 生成RAG上下文
export function parseFigmaDesignJson(rawFigmaJson: string): string {
  const data = JSON.parse(rawFigmaJson);
  let chunks = [];

  // 提取页面节点、图层、样式Token
  if (data.document?.children) {
    for (const node of data.document.children) {
      chunks.push(`【Figma页面】${node.name}`);
      if (node.children) {
        for (const layer of node.children) {
          chunks.push(`图层：${layer.name}，布局：${layer.layoutMode || "无"}`);
          // 提取尺寸、颜色、圆角
          if (layer.fills?.length) {
            chunks.push(`填充色：${JSON.stringify(layer.fills[0])}`);
          }
        }
      }
    }
  }

  return chunks.join("\n");
}

// 调用向量服务
export async function buildRagContext(
  figmaText: string,
  projectId: string
): Promise<string> {
  try {
    const res = await fetch("http://127.0.0.1:9001/vector/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: figmaText,
        projectId,
        topK: 3,
      }),
    });
    const result = await res.json();
    // 拼接设计稿+业务代码上下文
    return `
===== Figma设计信息 =====
${figmaText}

===== 匹配的项目代码 =====
${result.context}
    `;
  } catch (err) {
    console.warn("向量服务异常，仅使用Figma原文");
    return figmaText;
  }
}
