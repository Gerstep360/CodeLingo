import { getAllAlgorithms } from '../content/contentLoader';
export const DEFAULT_SNIPPETS = getAllAlgorithms().filter(algorithm => algorithm.code?.target).map(algorithm => ({
  id: algorithm.id,
  title: algorithm.className + ' · ' + algorithm.title,
  fileName: (algorithm.code.signature?.match(/(?:void|int|boolean|Matriz)\s+(\w+)/)?.[1] || algorithm.id) + '.java',
  category: algorithm.className,
  description: algorithm.logic?.idea || '',
  language: 'java',
  code: algorithm.code.target
}));
