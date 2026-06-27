// 引用你组件库的文档读取函数
import { loadComponentDocuments } from "ai4code-rag";

// 对外导出，给 ingestion 脚本合并文档
export async function getCustomComponentDocs() {
  return await loadComponentDocuments();
}
