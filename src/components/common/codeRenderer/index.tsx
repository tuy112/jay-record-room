'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'sql-formatter';

interface CodeRendererProps {
    content: string;
}

// 1. SQL 자동 정렬
function formatSQL(sql: string): string {
      try {
            return format(sql, {
                  language: 'plsql',
                  keywordCase: 'upper',
                  tabWidth: 4,
                  linesBetweenQueries: 2,
            });
      } catch {
            return sql;
      }
}

// 2. 코드 블록 자동 변환
function convertCodeBlocks(content: string): string {
      return content.replace(
            /```(sql)?\s*\n?([\s\S]*?)```/gi,
            (_, language, code) => {
                  const sql = code.trim();

                  // SQL 언어가 명시되었거나 SQL 구문으로 시작하는 경우
                  const isSQL =
                  language?.toLowerCase() === 'sql' ||
                  /^(SELECT|INSERT|UPDATE|DELETE|WITH|MERGE|CREATE|ALTER|DROP)\b/i.test(sql);

                  return `\n\`\`\`${isSQL ? 'sql' : ''}\n${
                  isSQL ? formatSQL(sql) : sql
                  }\n\`\`\`\n`;
            }
      );
}

export default function CodeRenderer({
      content,
}: CodeRendererProps) {
      const formattedContent = convertCodeBlocks(content);

      return (
            <div className="codeRenderer">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formattedContent}
                  </ReactMarkdown>
            </div>
      );
}