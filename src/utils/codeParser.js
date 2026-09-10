// Utility to analyze code structure, comments, and class boilerplate (e.g. public class ... { and closing })

export function parseCodeComments(rawCode) {
  const normalized = (rawCode || '').replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  // isNonTypeableChar: true if character should NOT be typed by user (comments, class wrapper)
  const isNonTypeableChar = new Array(normalized.length).fill(false);
  const isCommentChar = new Array(normalized.length).fill(false);
  const isBoilerplateChar = new Array(normalized.length).fill(false);

  const lineInfoList = [];
  let globalIndex = 0;
  let inBlockComment = false;

  // First pass: line-by-line comments
  const lineStartIndices = [];
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];
    const lineStartGlobal = globalIndex;
    lineStartIndices.push(lineStartGlobal);
    const lineLength = lineText.length;
    let isFullComment = false;
    const trimmed = lineText.trim();

    if (inBlockComment) {
      const endBlockIdx = lineText.indexOf('*/');
      if (endBlockIdx !== -1) {
        for (let c = 0; c <= endBlockIdx + 1; c++) {
          isCommentChar[lineStartGlobal + c] = true;
          isNonTypeableChar[lineStartGlobal + c] = true;
        }
        inBlockComment = false;
      } else {
        for (let c = 0; c < lineLength; c++) {
          isCommentChar[lineStartGlobal + c] = true;
          isNonTypeableChar[lineStartGlobal + c] = true;
        }
        isFullComment = true;
      }
    }

    if (!inBlockComment) {
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        isFullComment = true;
        for (let c = 0; c < lineLength; c++) {
          isCommentChar[lineStartGlobal + c] = true;
          isNonTypeableChar[lineStartGlobal + c] = true;
        }
        if (trimmed.startsWith('/*') && !trimmed.includes('*/')) {
          inBlockComment = true;
        }
      } else {
        // Look for inline comment // or /*
        let inString = false;
        let stringChar = '';

        for (let c = 0; c < lineLength; c++) {
          const ch = lineText[c];
          if (!inString && (ch === '"' || ch === "'")) {
            inString = true;
            stringChar = ch;
          } else if (inString && ch === stringChar && lineText[c - 1] !== '\\') {
            inString = false;
          } else if (!inString && ch === '/' && c + 1 < lineLength) {
            if (lineText[c + 1] === '/') {
              for (let k = c; k < lineLength; k++) {
                isCommentChar[lineStartGlobal + k] = true;
                isNonTypeableChar[lineStartGlobal + k] = true;
              }
              break;
            } else if (lineText[c + 1] === '*') {
              const closeBlock = lineText.indexOf('*/', c + 2);
              if (closeBlock !== -1) {
                for (let k = c; k <= closeBlock + 1; k++) {
                  isCommentChar[lineStartGlobal + k] = true;
                  isNonTypeableChar[lineStartGlobal + k] = true;
                }
                c = closeBlock + 1;
              } else {
                for (let k = c; k < lineLength; k++) {
                  isCommentChar[lineStartGlobal + k] = true;
                  isNonTypeableChar[lineStartGlobal + k] = true;
                }
                inBlockComment = true;
                break;
              }
            }
          }
        }
      }
    }

    lineInfoList.push({
      lineIdx,
      lineText,
      lineStartGlobal,
      lineLength,
      isFullComment,
      isClassHeader: false,
      isClassFooter: false,
      isEmpty: trimmed.length === 0
    });

    globalIndex += lineLength;
    if (lineIdx < lines.length - 1) {
      if (isFullComment) {
        isCommentChar[globalIndex] = true;
        isNonTypeableChar[globalIndex] = true;
      }
      globalIndex++; // \n
    }
  }

  // Second pass: Detect class declaration and its matching closing brace
  // Regex for class declaration (e.g. "public class Examen1 {", "class Solucion {")
  const classDeclRegex = /^\s*(public\s+|protected\s+|private\s+)?(final\s+|abstract\s+)?class\s+\w+/;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];
    if (classDeclRegex.test(lineText)) {
      const lineStart = lineStartIndices[lineIdx];
      const lineLen = lineText.length;

      // Mark the class declaration line and its newline as non-typeable boilerplate
      lineInfoList[lineIdx].isClassHeader = true;
      for (let c = 0; c < lineLen; c++) {
        isBoilerplateChar[lineStart + c] = true;
        isNonTypeableChar[lineStart + c] = true;
      }
      // Include newline
      if (lineStart + lineLen < normalized.length) {
        isBoilerplateChar[lineStart + lineLen] = true;
        isNonTypeableChar[lineStart + lineLen] = true;
      }

      // Find matching closing brace '}' for this class
      let depth = 0;
      let startedBraces = false;

      for (let scanIdx = lineIdx; scanIdx < lines.length; scanIdx++) {
        const scanText = lines[scanIdx];
        const scanStart = lineStartIndices[scanIdx];

        for (let c = 0; c < scanText.length; c++) {
          const charGlobal = scanStart + c;
          if (isCommentChar[charGlobal]) continue;

          const ch = scanText[c];
          if (ch === '{') {
            depth++;
            startedBraces = true;
          } else if (ch === '}') {
            depth--;
            if (startedBraces && depth === 0) {
              // Found the class closing brace!
              lineInfoList[scanIdx].isClassFooter = true;
              isBoilerplateChar[charGlobal] = true;
              isNonTypeableChar[charGlobal] = true;
              // If there are trailing spaces or newline on this line, mark as well
              for (let k = c + 1; k < scanText.length; k++) {
                isBoilerplateChar[scanStart + k] = true;
                isNonTypeableChar[scanStart + k] = true;
              }
              if (scanStart + scanText.length < normalized.length) {
                isBoilerplateChar[scanStart + scanText.length] = true;
                isNonTypeableChar[scanStart + scanText.length] = true;
              }
              break;
            }
          }
        }
        if (startedBraces && depth === 0) break;
      }
      break; // Usually 1 main class per file
    }
  }

  // Helper to find the next typeable character index starting from `fromIndex`
  const getNextTypeableIndex = (fromIndex) => {
    let idx = fromIndex;
    while (idx < normalized.length) {
      if (!isNonTypeableChar[idx]) {
        return idx;
      }
      idx++;
    }
    return normalized.length;
  };

  return {
    normalized,
    lines,
    lineInfoList,
    isCommentChar,
    isBoilerplateChar,
    isNonTypeableChar,
    getNextTypeableIndex
  };
}
