import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { metaList } from "./components/meta";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOC_DIR = path.join(__dirname, "components");

export type DocumentItem = {
  pageContent: string;
  metadata: Record<string, string>;
};

/**
 * 精简代码：移除注释、多余空行，减少token占用
 */
function slimSourceCode(code: string): string {
  // 移除单行注释
  code = code.replace(/\/\/.*/g, "");
  // 移除多行注释
  code = code.replace(/\/\*[\s\S]*?\*\//g, "");
  // 压缩连续空行
  code = code.replace(/\n\s*\n+/g, "\n");
  return code.trim();
}

/**
 * 单段最大字符限制，防止单个组件内容过长
 */
const MAX_SINGLE_CONTENT = 3500;

export async function loadComponentDocuments(): Promise<DocumentItem[]> {
  const result: DocumentItem[] = [];
  for (const item of metaList) {
    const filePath = path.join(DOC_DIR, item.fileName);
    let content = await fs.readFile(filePath, "utf-8");

    // 【RAG层优化1：精简代码】
    content = slimSourceCode(content);

    // 【RAG层优化2：超长自动截断】
    if (content.length > MAX_SINGLE_CONTENT) {
      content = content.slice(0, MAX_SINGLE_CONTENT) + "\n// ...内容已截断";
    }

    result.push({ pageContent: content, metadata: item.metadata });
  }
  return result;
}

// 自动写入 claude-code-best 的 skill 知识库
async function writeToSkill() {
  const docs = await loadComponentDocuments();
  let skillContent = `# AI4Code 组件库知识库
编写代码必须严格遵循下方组件文档，禁止自定义属性
> 所有源码已自动精简压缩，去除注释以节省上下文token

`;

  docs.forEach((doc) => {
    skillContent += `
---
### 元数据
${JSON.stringify(doc.metadata, null, 2)}
### 组件文档
${doc.pageContent}
`;
  });

  // 【可选总长度硬封顶，整份SKILL不超限】
  const MAX_TOTAL = 120000;
  if (skillContent.length > MAX_TOTAL) {
    skillContent =
      skillContent.slice(0, MAX_TOTAL) +
      "\n\n// 知识库内容已截断，仅保留高优先级组件";
  }

  const targetPath = path.join(
    __dirname,
    "../../../.claude/skills/ai4code-component/SKILL.md"
  );

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, skillContent, "utf-8");
  console.log("✅ 组件知识库已同步到 skill", targetPath);
  console.log(`📦 最终文档字符数：${skillContent.length}`);
}

await writeToSkill();
