import styles from './style.module.css';

interface ContentRendererProps {
      content: string;
}

type LineType = 'bullet' | 'callout' | 'paragraph';

interface ParsedLine {
      type: LineType;
      text: string;
}

const CALLOUT_KEYWORDS = /핵심|주의|암기|포인트|주목|단골|자주 출제/;

// 용어와 설명을 분리합니다.
const splitTerm = (line: string): [string, string] | null => {
      const idx = line.indexOf(' : ');
      if (idx === -1) return null;
      return [line.slice(0, idx).trim(), line.slice(idx + 3).trim()];
};

// 줄 유형을 판별합니다.
const classifyLine = (raw: string): ParsedLine => {
      const trimmed = raw.trim();
      const dashStripped = trimmed.startsWith('- ') ? trimmed.slice(2) : trimmed;
      if (trimmed.startsWith('- ') || splitTerm(dashStripped)) {
            return { type: 'bullet', text: dashStripped };
      }
      if (CALLOUT_KEYWORDS.test(trimmed)) {
            return { type: 'callout', text: trimmed };
      }
      return { type: 'paragraph', text: trimmed };
};

// 같은 유형의 줄을 묶습니다.
const groupLines = (lines: ParsedLine[]) => {
      const segments: ParsedLine[][] = [];
      lines.forEach((line) => {
            const last = segments[segments.length - 1];
            if (last && last[0].type === line.type) {
                  last.push(line);
            } else {
                  segments.push([line]);
            }
      });
      return segments;
};

// 일반 본문을 유형별로 표시합니다.
const renderText = (content: string, keyPrefix: string) => {
      const blocks = content
            .trim()
            .split(/\n\s*\n/)
            .map((block) => block.split('\n').map((line) => line.trim()).filter(Boolean))
            .filter((lines) => lines.length > 0);

      return blocks.map((lines, blockIndex) => {
            const segments = groupLines(lines.map(classifyLine));
            return (
                  <div key={`${keyPrefix}-${blockIndex}`} className={styles.block}>
                        {segments.map((segment, segmentIndex) => {
                              const type = segment[0].type;
                              if (type === 'bullet') {
                                    return (
                                          <ul key={segmentIndex} className={styles.bulletList}>
                                                {segment.map((line, index) => {
                                                      const term = splitTerm(line.text);
                                                      return (
                                                            <li key={index} className={styles.bulletItem}>
                                                                  {term ? (
                                                                        <>
                                                                              <strong className={styles.term}>{term[0]}</strong>
                                                                              <span className={styles.desc}> : {term[1]}</span>
                                                                        </>
                                                                  ) : line.text}
                                                            </li>
                                                      );
                                                })}
                                          </ul>
                                    );
                              }
                              if (type === 'callout') {
                                    return (
                                          <div key={segmentIndex} className={styles.callout}>
                                                {segment.map((line, index) => (
                                                      <p key={index} className={styles.calloutText}>{line.text}</p>
                                                ))}
                                          </div>
                                    );
                              }
                              return (
                                    <div key={segmentIndex} className={styles.paragraphGroup}>
                                          {segment.map((line, index) => (
                                                <p key={index} className={styles.paragraph}>{line.text}</p>
                                          ))}
                                    </div>
                              );
                        })}
                  </div>
            );
      });
};

export default function ContentRenderer({ content }: ContentRendererProps) {
      const parts: { type: 'text' | 'code'; content: string }[] = [];
      const codePattern = /```(?:sql|text|log)?\s*\n([\s\S]*?)```/gi;
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = codePattern.exec(content)) !== null) {
            if (match.index > lastIndex) {
                  parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
            }
            parts.push({ type: 'code', content: match[1].trim() });
            lastIndex = codePattern.lastIndex;
      }

      if (lastIndex < content.length) {
            parts.push({ type: 'text', content: content.slice(lastIndex) });
      }
      
      return (
            <div className={styles.contentRenderer}>
                  {parts.map((part, index) =>
                        part.type === 'code' ? (
                              <pre key={index} className={styles.codeBlock}>
                                    <code>{part.content}</code>
                              </pre>
                        ) : (
                              renderText(part.content, `text-${index}`)
                        )
                  )}
            </div>
      );
}