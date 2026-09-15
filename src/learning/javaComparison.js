export function sanitizeCode(code = '') {
  return String(code)
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/≠/g, '!=');
}

export function extractMethodNames(code = '') {
  const names = [];
  const methodRegex = /(?:public|protected|private)?\s*(?:static\s+)?(?:[\w<>\[\]]+)\s+([a-zA-Z0-9_$]+)\s*\(/g;
  let match;
  while ((match = methodRegex.exec(code)) !== null) {
    const name = match[1];
    if (!['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
      names.push(name);
    }
  }
  return names;
}

export function normalizeMethodNames(actualCode = '', targetCode = '') {
  if (!actualCode || !targetCode) return actualCode;
  const targetMethods = extractMethodNames(targetCode);
  const actualMethods = extractMethodNames(actualCode);

  let normalized = actualCode;
  for (const targetName of targetMethods) {
    const matchActual = actualMethods.find(m => m.toLowerCase() === targetName.toLowerCase());
    if (matchActual) {
      const regex = new RegExp('\\b' + targetName + '\\b', 'gi');
      normalized = normalized.replace(regex, targetName);
    }
  }
  return normalized;
}

export function codeTokens(code='') {
  const clean = sanitizeCode(code);
  return (clean.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|>>>=|>>=|<<=|>>>|>>|<<|==|!=|<=|>=|\+\+|--|&&|\|\||\+=|-=|\*=|\/=|\S/g)||[]).filter(token=>!token.startsWith('//')&&!token.startsWith('/*'));
}

export function normalizeTokens(tokens) {
  const res = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === ';' && res[res.length - 1] === ';') continue;
    // Normalize optional public modifier in class or method signatures
    if (t === 'public' && (tokens[i + 1] === 'static' || tokens[i + 1] === 'class' || tokens[i + 1] === 'void')) continue;
    res.push(t);
  }
  return res;
}

function canonical(tokens) {
  // Normalize single-statement braces only in control bodies, preserving branch structure.
  let i = 0;
  const readUntil = close => {
    const result = [];
    while (i < tokens.length && tokens[i] !== close) result.push(statement());
    if (close && i < tokens.length) i++;
    return result;
  };
  const body = () => {
    if (tokens[i] === '{') { i++; const items = readUntil('}'); return items; }
    return [statement()];
  };
  const statement = () => {
    const head = [];
    if (tokens[i] === 'if' || tokens[i] === 'for' || tokens[i] === 'while') {
      head.push(tokens[i++]);
      let depth = 0;
      do {
        const t = tokens[i++];
        head.push(t);
        if (t === '(') depth++;
        if (t === ')') depth--;
      } while (i < tokens.length && depth > 0);
      const result = [head, body()];
      if (tokens[i] === 'else') { i++; result.push('else', body()); }
      return result;
    }
    while (i < tokens.length) {
      const t = tokens[i++];
      if (t === '{') return [head, readUntil('}')];
      if (t === ';' || t === '}') { head.push(t); return head; }
      head.push(t);
    }
    return head;
  };
  return readUntil(null);
}

export function sameCode(actual, expected) {
  if (!expected?.trim() || !actual?.trim()) return false;
  const normalizedActual = normalizeMethodNames(sanitizeCode(actual), sanitizeCode(expected));
  const actualNorm = normalizeTokens(codeTokens(normalizedActual));
  const expectedNorm = normalizeTokens(codeTokens(expected));
  return JSON.stringify(canonical(actualNorm)) === JSON.stringify(canonical(expectedNorm));
}

function codeTokensWithLines(code = '') {
  const clean = sanitizeCode(code);
  const lines = clean.split('\n');
  const tokens = [];
  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;
    const matches = lineText.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|>>>=|>>=|<<=|>>>|>>|<<|==|!=|<=|>=|\+\+|--|&&|\|\||\+=|-=|\*=|\/=|\S/g) || [];
    for (const text of matches) {
      if (!text.startsWith('//') && !text.startsWith('/*')) {
        tokens.push({ text, line: lineNum });
      }
    }
  });
  return tokens;
}

function normalizeTokensWithLines(tokens) {
  const res = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.text === ';' && res.length && res[res.length - 1].text === ';') continue;
    if (t.text === 'public' && tokens[i + 1] && (tokens[i + 1].text === 'static' || tokens[i + 1].text === 'class' || tokens[i + 1].text === 'void')) continue;
    res.push(t);
  }
  return res;
}

function canonicalTree(tokens) {
  let i = 0;
  const readUntil = close => {
    const result = [];
    while (i < tokens.length && tokens[i].text !== close) {
      result.push(statement());
    }
    if (close && i < tokens.length) i++;
    return result;
  };
  const body = () => {
    if (i < tokens.length && tokens[i].text === '{') {
      i++;
      const items = readUntil('}');
      return items;
    }
    return [statement()];
  };
  const statement = () => {
    const head = [];
    if (i < tokens.length && (tokens[i].text === 'if' || tokens[i].text === 'for' || tokens[i].text === 'while')) {
      const startLine = tokens[i].line;
      head.push(tokens[i++]);
      let depth = 0;
      do {
        if (i >= tokens.length) break;
        const t = tokens[i++];
        head.push(t);
        if (t.text === '(') depth++;
        if (t.text === ')') depth--;
      } while (i < tokens.length && depth > 0);
      const result = { type: 'control', head, body: body(), startLine };
      if (i < tokens.length && tokens[i].text === 'else') {
        i++;
        result.elseBody = body();
      }
      return result;
    }
    const simple = [];
    const startLine = i < tokens.length ? tokens[i].line : 1;
    while (i < tokens.length) {
      const t = tokens[i++];
      if (t.text === '{') {
        return { type: 'block', head: simple, body: readUntil('}'), startLine };
      }
      if (t.text === ';' || t.text === '}') {
        simple.push(t);
        return { type: 'simple', tokens: simple, startLine };
      }
      simple.push(t);
    }
    return { type: 'simple', tokens: simple, startLine };
  };
  return readUntil(null);
}

function formatTokensText(arr = []) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    const text = arr[i].text;
    if (i > 0) {
      const prev = arr[i - 1].text;
      if (
        text === ';' || text === ',' || text === ')' || text === ']' || text === '}' ||
        prev === '(' || prev === '[' || prev === '{' || text === '.' || prev === '.'
      ) {
        // no space
      } else {
        str += ' ';
      }
    }
    str += text;
  }
  return str;
}

function tokensStr(arr = []) {
  return arr.map(t => t.text).join(' ');
}

function compareCanonical(actualNodes, targetNodes) {
  let aI = 0, tI = 0;
  while (aI < actualNodes.length && tI < targetNodes.length) {
    const a = actualNodes[aI];
    const t = targetNodes[tI];

    if (a.type !== t.type) {
      const aText = formatTokensText(a.head || a.tokens);
      const tText = formatTokensText(t.head || t.tokens);
      return {
        line: a.startLine,
        found: aText,
        expected: tText,
        message: `Revisa "${aText}". Se esperaba "${tText}".`
      };
    }

    if (a.type === 'control') {
      const aHead = tokensStr(a.head);
      const tHead = tokensStr(t.head);
      if (aHead !== tHead) {
        return {
          line: a.startLine,
          found: formatTokensText(a.head),
          expected: formatTokensText(t.head),
          message: `Revisa "${formatTokensText(a.head)}". Se esperaba "${formatTokensText(t.head)}".`
        };
      }
      const bodyDiff = compareCanonical(a.body, t.body);
      if (bodyDiff) return bodyDiff;

      if (a.elseBody || t.elseBody) {
        const elseDiff = compareCanonical(a.elseBody || [], t.elseBody || []);
        if (elseDiff) return elseDiff;
      }
      aI++; tI++;
      continue;
    }

    if (a.type === 'block') {
      const aHead = tokensStr(a.head);
      const tHead = tokensStr(t.head);
      if (aHead !== tHead) {
        return {
          line: a.startLine,
          found: formatTokensText(a.head),
          expected: formatTokensText(t.head),
          message: `Revisa "${formatTokensText(a.head)}". Se esperaba "${formatTokensText(t.head)}".`
        };
      }
      const bodyDiff = compareCanonical(a.body, t.body);
      if (bodyDiff) return bodyDiff;
      aI++; tI++;
      continue;
    }

    // simple statement
    const aToks = tokensStr(a.tokens);
    const tToks = tokensStr(t.tokens);
    if (aToks !== tToks) {
      return {
        line: a.startLine,
        found: formatTokensText(a.tokens),
        expected: formatTokensText(t.tokens),
        message: `Revisa "${formatTokensText(a.tokens)}". Se esperaba "${formatTokensText(t.tokens)}".`
      };
    }

    aI++; tI++;
  }

  if (aI < actualNodes.length) {
    const a = actualNodes[aI];
    return {
      line: a.startLine,
      found: formatTokensText(a.head || a.tokens),
      expected: '',
      message: `Código adicional inesperado "${formatTokensText(a.head || a.tokens)}".`
    };
  }

  if (tI < targetNodes.length) {
    const t = targetNodes[tI];
    return {
      line: actualNodes[actualNodes.length - 1]?.startLine || 1,
      found: '',
      expected: formatTokensText(t.head || t.tokens),
      message: `Falta completar código después de esta línea. Se esperaba: "${formatTokensText(t.head || t.tokens)}".`
    };
  }

  return null;
}

export function findCodeMismatch(actualCode = '', targetCode = '') {
  if (sameCode(actualCode, targetCode)) return null;
  const normalizedActual = normalizeMethodNames(sanitizeCode(actualCode), sanitizeCode(targetCode));
  const actualTokens = normalizeTokensWithLines(codeTokensWithLines(normalizedActual));
  const targetTokens = normalizeTokensWithLines(codeTokensWithLines(targetCode));
  const actualTree = canonicalTree(actualTokens);
  const targetTree = canonicalTree(targetTokens);
  return compareCanonical(actualTree, targetTree) || {
    line: 1,
    found: '',
    expected: '',
    message: 'Revisa la sintaxis, operadores o estructura de bloques del código.'
  };
}



