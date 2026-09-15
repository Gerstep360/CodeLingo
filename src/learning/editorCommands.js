const INDENT = '    ';
export function editCode(value = '', start = 0, end = 0, key, shift = false) {
  const str = String(value || '');
  const s = Math.max(0, Math.min(str.length, start));
  const e = Math.max(s, Math.min(str.length, end));

  if (key === 'Tab') {
    const lineStart = str.lastIndexOf('\n', s - 1) + 1;
    if (!shift && s === e) return { value: str.slice(0, s) + INDENT + str.slice(e), start: s + 4, end: s + 4 };
    const blockEnd = e > s && str[e - 1] === '\n' ? e - 1 : e;
    const block = str.slice(lineStart, blockEnd);
    let removedFirst = 0, delta = 0;
    const edited = block.split('\n').map((line, i) => {
      if (!shift) { delta += 4; return INDENT + line; }
      const match = line.match(/^ */);
      const count = line.startsWith('\t') ? 1 : Math.min(4, match ? match[0].length : 0);
      if (!i) removedFirst = count;
      delta -= count;
      return line.slice(count);
    }).join('\n');
    return {
      value: str.slice(0, lineStart) + edited + str.slice(blockEnd),
      start: shift ? Math.max(lineStart, s - removedFirst) : s + 4,
      end: Math.max(lineStart, e + delta)
    };
  }

  if (key === 'Enter') {
    const prefix = str.slice(0, s);
    const lastNl = prefix.lastIndexOf('\n');
    const indentMatch = prefix.slice(lastNl + 1).match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : '';
    const opens = prefix.trimEnd().endsWith('{');
    const closes = str.slice(e).trimStart().startsWith('}');
    const insertion = '\n' + indent + (opens ? INDENT : '') + (opens && closes ? '\n' + indent : '');
    const cursor = s + 1 + indent.length + (opens ? 4 : 0);
    return { value: prefix + insertion + str.slice(e), start: cursor, end: cursor };
  }

  const pairs = { '(': ')', '[': ']', '{': '}' };
  if (pairs[key]) return { value: str.slice(0, s) + key + str.slice(s, e) + pairs[key] + str.slice(e), start: s + 1, end: s + 1 };
  if (')]'.includes(key) && s === e && str[s] === key) return { value: str, start: s + 1, end: s + 1 };
  return null;
}

