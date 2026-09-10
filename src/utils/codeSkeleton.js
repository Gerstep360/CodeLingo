// Utility to generate clean exercise skeletons for practice and exams

export function generateExamSkeleton(rawCode) {
  if (!rawCode) return '';
  const lines = rawCode.replace(/\r\n/g, '\n').split('\n');
  const skeletonLines = [];
  let inMethod = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Preserve comments, empty lines, imports, and class declaration
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.length === 0 ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('public class ') ||
      trimmed.startsWith('class ')
    ) {
      skeletonLines.push(line);
      continue;
    }

    // Method signature detection
    const isMethodStart =
      (line.includes('static ') || line.includes('public static ')) &&
      line.includes('(') &&
      line.includes('{');

    if (isMethodStart) {
      skeletonLines.push(line);
      skeletonLines.push('        // Escribe tu código aquí');
      skeletonLines.push('    }');
      skeletonLines.push('');
      inMethod = true;
      braceDepth = 1;
      continue;
    }

    // If we are skipping the original method body lines
    if (inMethod) {
      for (const char of line) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;
      }
      if (braceDepth <= 0) {
        inMethod = false;
      }
      continue;
    }

    // Class closing brace at bottom
    if (trimmed === '}' && i === lines.length - 1) {
      skeletonLines.push('}');
      continue;
    }
  }

  return skeletonLines.join('\n');
}
