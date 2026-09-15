import { getAllAlgorithms } from '../content/contentLoader';

// El taller Java incluye algoritmos principales, ejercicios Y metodos auxiliares (shared)
export const DEFAULT_SNIPPETS = getAllAlgorithms()
  .filter(algorithm => algorithm.code?.target)
  .map(algorithm => ({
    id: algorithm.id,
    title: algorithm.className + ' \u00b7 ' + algorithm.title,
    fileName: (algorithm.code.signature?.match(/(?:void|int|boolean|Matriz|static)\s+(?:\w+\s+)?(\w+)\s*\(/)?.[1] || algorithm.id) + '.java',
    category: algorithm.isShared ? (algorithm.className + ' · Auxiliares') : algorithm.className,
    description: algorithm.logic?.idea || algorithm.purpose || '',
    language: 'java',
    code: algorithm.code.target,
    isShared: algorithm.isShared || false
  }));
