import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Copy, Check, Zap, Award } from 'lucide-react';
import { DUO_RECOVERY_PHRASES, DUO_GOLDEN_TABLE } from '../../data/duoLessonsData';
import { DuoBacktrackIcon, DuoDiceIcon, DuoShuffleIcon, DuoMatrixIcon } from './DuoIcons';

const CHEAT_ICON_MAP = {
  backtrack: <DuoBacktrackIcon size={16} />,
  dice: <DuoDiceIcon size={16} />,
  shuffle: <DuoShuffleIcon size={16} />,
  matrix: <DuoMatrixIcon size={16} />
};

export function DuoCheatsheet() {
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1600);
  };

  const ALGO_SUMMARIES = [
    {
      id: 'sumandos',
      title: '1. SUMANDOS',
      goal: 'Sumas de n en orden no decreciente',
      keyLines: `int s = suma(L);
if (s > n) return;
if (s == n) { System.out.println(L); return; }
for (int k = i; k <= n; k++) {
    L.add(k);
    sumandos(L, n, k);  // k permite repetir
    L.removeLast();
}`,
      consultas: [
        { name: 'C1: r sumandos', code: 'if (s > n || L.size() > r) return;\nif (s == n) { if (L.size() == r) println(L); return; }' },
        { name: 'C2: contiene x', code: 'if (s == n) { if (L.contains(x)) println(L); return; }' },
        { name: 'C3: sin repetir', code: 'sumandos(L, n, k + 1);  // k+1 prohíbe repetir' }
      ]
    },
    {
      id: 'factores',
      title: '2. FACTORES',
      goal: 'Factorizaciones no decrecientes cuyo producto es n',
      keyLines: `int p = prod(L);
if (p > n) return;
if (p == n) { System.out.println(L); return; }
for (int k = i; k <= n; k++) {
    if (n % k == 0) {  // SOLO divisores
        L.add(k);
        factores(L, n, k);
        L.removeLast();
    }
}`,
      consultas: [
        { name: 'C1: r factores', code: 'if (p > n || L.size() > r) return;\nif (p == n) { if (L.size() == r) println(L); return; }' },
        { name: 'C2: contiene x', code: 'if (p == n) { if (L.contains(x)) println(L); return; }' },
        { name: 'C3: sin repetir', code: 'factores(L, n, k + 1);' }
      ]
    },
    {
      id: 'mochila',
      title: '3. MOCHILA & MOCHILA EXACTA',
      goal: 'Elegir elementos de A tal que suma <= max (o suma == max)',
      keyLines: `int s = suma(L);
if (s > max) return;
if (!L.isEmpty()) System.out.println(L);  // En exacta: if (s == max) { println(L); return; }
for (int k = i; k < A.size(); k++) {
    L.add(A.get(k));       // OJO: A.get(k)
    mochila(L, A, max, k + 1);
    L.removeLast();
}`,
      consultas: [
        { name: 'C1: suma exacta', code: 'if (s == max) { System.out.println(L); return; }' },
        { name: 'C2: exactamente r objetos', code: 'if (L.size() == r) { System.out.println(L); return; }' },
        { name: 'C3: contiene x', code: 'if (L.contains(x)) System.out.println(L);' }
      ]
    },
    {
      id: 'combinaciones',
      title: '4. COMBINACIONES (SR & CR)',
      goal: 'El orden NO importa ([1,2] == [2,1]). Tiene parámetro int i',
      keyLines: `// Combi SR (Sin Repetición):
if (L.size() == r) { System.out.println(L); return; }
for (int k = i; k < A.size(); k++) {
    L.add(A.get(k));
    combiSR(L, A, r, k + 1);  // k + 1 = siguiente objeto
    L.removeLast();
}

// Combi CR (Con Repetición):
// Igual pero llama con k en vez de k + 1:
combiCR(L, A, r, k);`,
      consultas: [
        { name: 'C1: suma == x', code: 'if (L.size() == r) { if (suma(L) == x) println(L); return; }' },
        { name: 'C2: contiene x', code: 'if (L.size() == r) { if (L.contains(x)) println(L); return; }' },
        { name: 'C3: solo pares', code: 'if (L.size() == r) { if (todosPares(L)) println(L); return; }' }
      ]
    },
    {
      id: 'permutaciones',
      title: '5. PERMUTACIONES (SR & CR)',
      goal: 'El orden SÍ importa ([1,2] != [2,1]). Empieza en k=0, NO tiene i',
      keyLines: `// Permut SR (Sin Repetición):
if (L.size() == r) { System.out.println(L); return; }
for (int k = 0; k < A.size(); k++) {
    if (!L.contains(A.get(k))) {  // Filtro para no duplicar
        L.add(A.get(k));
        permutSR(L, A, r);
        L.removeLast();
    }
}

// Permut CR (Con Repetición):
// Igual pero SIN el if (!L.contains(...)), libre para repetir`,
      consultas: [
        { name: 'C1: empieza con x', code: 'if (L.size() == r) { if (L.getFirst() == x) println(L); return; }' },
        { name: 'C2: termina con x', code: 'if (L.size() == r) { if (L.getLast() == x) println(L); return; }' },
        { name: 'C3: contiene x', code: 'if (L.size() == r) { if (L.contains(x)) println(L); return; }' }
      ]
    },
    {
      id: 'matrices',
      title: '6. DETERMINANTE Y SUBMATRICES',
      goal: 'Determinante 1x1 + menores y los 4 bucles (i, j, p, q)',
      keyLines: `// DETERMINANTE:
if (M.length == 1) return M[0][0];
int s = 0;
for (int i = 0; i < M.length; i++)
    s += (i % 2 == 0 ? 1 : -1) * M[i][0] * det(menor(M, i, 0));
return s;

// SUBMATRICES (4 bucles):
for (int i=0; i<M.length; i++)
for (int j=0; j<M[0].length; j++)
for (int p=i; p<M.length; p++)
for (int q=j; q<M[0].length; q++)
    mostrar(M, i, j, p, q);`,
      consultas: [
        { name: 'C1: cuadradas', code: 'if (p - i == q - j) mostrar(M, i, j, p, q);' },
        { name: 'C2: suma == x', code: 'if (sumaSub(M, i, j, p, q) == x) mostrar(M, i, j, p, q);' },
        { name: 'C3: contiene x', code: 'if (contiene(M, i, j, p, q, x)) mostrar(M, i, j, p, q);' }
      ]
    }
  ];

  return (
    <div className="duo-cheatsheet-container">
      {/* Header Banner */}
      <div className="cheatsheet-banner">
        <span className="banner-pill">GUÍA DE MEMORIZACIÓN INTENSIVA</span>
        <h2 className="banner-title">Mapa Mental de Vargas para el Examen</h2>
        <p className="banner-sub">
          El objetivo no es memorizar código como una foto, sino saber reconstruirlo al instante usando las 4 ideas clave.
        </p>
      </div>

      {/* The 4 Recovery Phrases */}
      <section className="cs-section">
        <h3 className="section-heading">
          <Zap size={20} color="var(--duo-orange)" fill="var(--duo-orange)" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span>Las 4 Frases para Recuperar Todo</span>
        </h3>
        <div className="phrases-grid">
          {DUO_RECOVERY_PHRASES.map((item) => (
            <div key={item.title} className="phrase-card">
              <div className="card-tag">
                <span className="card-tag-icon">{CHEAT_ICON_MAP[item.iconKey] || <Sparkles size={14} />}</span>
                <span>{item.title}</span>
              </div>
              <div className="card-highlight">{item.phrase}</div>
              <p className="card-explanation">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Golden Table */}
      <section className="cs-section">
        <h3 className="section-heading">
          <Award size={20} color="var(--duo-yellow)" fill="var(--duo-yellow)" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span>La Tabla de Oro: Combinaciones vs Permutaciones</span>
        </h3>
        <div className="golden-table-wrap">
          <table className="golden-table">
            <thead>
              <tr>
                <th>Algoritmo</th>
                <th>Inicio del for</th>
                <th>Llamada recursiva</th>
                <th>Filtro de repetición</th>
                <th>Propósito</th>
              </tr>
            </thead>
            <tbody>
              {DUO_GOLDEN_TABLE.map((row) => (
                <tr key={row.algo}>
                  <td className="cell-algo"><strong>{row.algo}</strong></td>
                  <td className="cell-mono">{row.start}</td>
                  <td className="cell-mono bold-call">{row.call}</td>
                  <td className="cell-mono">{row.filter}</td>
                  <td className="cell-desc">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Algorithm Summaries with Consultas */}
      <section className="cs-section">
        <h3 className="section-heading">📚 Los Algoritmos y sus Consultas de Examen</h3>
        <div className="algos-accordion">
          {ALGO_SUMMARIES.map((algo) => (
            <div key={algo.id} className="algo-accordion-item">
              <div className="item-header">
                <div>
                  <h4 className="item-title">{algo.title}</h4>
                  <span className="item-goal">{algo.goal}</span>
                </div>
                <button
                  type="button"
                  className="btn-copy-code"
                  onClick={() => handleCopy(algo.keyLines, algo.id)}
                  title="Copiar código mental"
                >
                  {copiedSection === algo.id ? <Check size={14} color="var(--duo-green)" /> : <Copy size={14} />}
                  <span>{copiedSection === algo.id ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              {/* Code Snippet */}
              <div className="item-code-box">
                <pre><code>{algo.keyLines}</code></pre>
              </div>

              {/* Consultas */}
              <div className="item-consultas-row">
                <span className="consultas-label">Variantes de Examen:</span>
                <div className="consultas-tags">
                  {algo.consultas.map((c) => (
                    <div key={c.name} className="consulta-tag" title={c.code}>
                      <span className="c-name">{c.name}:</span>
                      <code>{c.code.split('\n')[0]}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .duo-cheatsheet-container {
          max-width: 680px;
          margin: 0 auto;
          padding: 24px 16px 120px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .cheatsheet-banner {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 4px 0 var(--duo-swan);
        }

        .banner-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-blue);
          background: var(--duo-blue-soft);
          padding: 3px 10px;
          border-radius: 999px;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }

        .banner-title {
          font-size: 22px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.2;
        }

        .banner-sub {
          font-size: 14px;
          font-weight: 600;
          color: var(--duo-wolf);
          margin-top: 6px;
          line-height: 1.4;
        }

        .cs-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-heading {
          font-size: 18px;
          font-weight: 900;
          color: var(--duo-eel);
        }

        /* Phrases Grid */
        .phrases-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .phrase-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          padding: 16px;
          box-shadow: 0 3px 0 var(--duo-swan);
        }

        .card-tag {
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-wolf);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .card-highlight {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 900;
          color: var(--duo-blue);
          margin-bottom: 4px;
        }

        .card-explanation {
          font-size: 12px;
          color: var(--duo-wolf);
          line-height: 1.35;
        }

        /* Golden Table */
        .golden-table-wrap {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          overflow-x: auto;
          box-shadow: 0 3px 0 var(--duo-swan);
        }

        .golden-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .golden-table th {
          background: var(--duo-polar);
          padding: 10px 14px;
          text-align: left;
          font-weight: 800;
          color: var(--duo-wolf);
          border-bottom: 2px solid var(--duo-swan);
        }

        .golden-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--duo-swan);
        }

        .golden-table tr:last-child td {
          border-bottom: none;
        }

        .cell-algo {
          color: var(--duo-eel);
        }

        .cell-mono {
          font-family: var(--font-mono);
          font-size: 12px;
        }

        .bold-call {
          color: var(--duo-green);
          font-weight: 800;
        }

        .cell-desc {
          font-size: 12px;
          color: var(--duo-wolf);
        }

        /* Accordion Cards */
        .algos-accordion {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .algo-accordion-item {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .item-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .item-title {
          font-size: 16px;
          font-weight: 900;
          color: var(--duo-eel);
        }

        .item-goal {
          font-size: 12px;
          font-weight: 600;
          color: var(--duo-wolf);
        }

        .btn-copy-code {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-wolf);
          cursor: pointer;
        }

        .btn-copy-code:hover {
          background: var(--duo-blue-soft);
          color: var(--duo-blue);
        }

        .item-code-box {
          background: #1E293B;
          color: #F8FAFC;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.45;
          overflow-x: auto;
        }

        .item-consultas-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .consultas-label {
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-wolf);
          text-transform: uppercase;
        }

        .consultas-tags {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .consulta-tag {
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .c-name {
          font-weight: 800;
          color: var(--duo-blue);
        }

        .consulta-tag code {
          font-family: var(--font-mono);
          color: var(--duo-eel);
          font-size: 11px;
        }

        @media (max-width: 640px) {
          .duo-cheatsheet-container {
            padding: 16px 12px 100px;
            gap: 20px;
          }

          .cheatsheet-banner {
            padding: 16px;
          }

          .banner-title {
            font-size: 19px;
          }

          .phrases-grid {
            grid-template-columns: 1fr;
          }

          .algo-accordion-item {
            padding: 14px;
          }

          .item-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .btn-copy-code {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
