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

export async function loadComponentDocuments(): Promise<DocumentItem[]> {
  const result: DocumentItem[] = [];
  for (const item of metaList) {
    const filePath = path.join(DOC_DIR, item.fileName);
    const content = await fs.readFile(filePath, "utf-8");
    result.push({ pageContent: content.trim(), metadata: item.metadata });
  }
  return result;
}

// 自动写入 claude-code-best 的 skill 知识库
async function writeToSkill() {
  const docs = await loadComponentDocuments();
  let skillContent = `# AI4Code 组件库知识库\n编写代码必须严格遵循下方组件文档，禁止自定义属性\n\n`;

  docs.forEach(doc => {
    skillContent += `
---
### 元数据
${JSON.stringify(doc.metadata, null, 2)}
### 组件文档
${doc.pageContent}
`;
  });

  // 写入 best 仓库 skill 目录
  const targetPath = path.join(
    __dirname,
    "../../../.claude/skills/ai4code-component/SKILL.md"
  );

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, skillContent, "utf-8");
  console.log("✅ 组件知识库已同步到 skill",targetPath);
}

await writeToSkill();