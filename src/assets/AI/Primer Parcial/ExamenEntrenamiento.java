import java.util.*;

public class ExamenEntrenamiento {

    // =========================================================
    // AUXILIARES
    // =========================================================

    static int suma(LinkedList<Integer> L) {
        int s = 0;
        for (int x : L) s += x;
        return s;
    }

    static int prod(LinkedList<Integer> L) {
        int p = 1;
        for (int x : L) p *= x;
        return p;
    }

    static boolean todosPares(LinkedList<Integer> L) {
        for (int x : L)
            if (x % 2 != 0) return false;
        return true;
    }

    // =========================================================
    // 1. SUMANDOS - BASE
    // Genera formas no decrecientes de sumar n.
    // Ejemplo: n=5 -> [1,1,1,1,1], [1,1,1,2], ..., [5]
    // =========================================================

    static void sumandos(LinkedList<Integer> L, int n, int i) {
        int s = suma(L);

        if (s > n) return;

        if (s == n) {
            System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            L.add(k);              // elegir
            sumandos(L, n, k);     // repetir k permitido
            L.removeLast();        // deshacer
        }
    }

    // CONSULTA 1: sumandos de n usando exactamente r números.
    static void sumandosC1(LinkedList<Integer> L, int n, int r, int i) {
        int s = suma(L);

        if (s > n || L.size() > r) return;

        if (s == n) {
            if (L.size() == r) System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            L.add(k);
            sumandosC1(L, n, r, k);
            L.removeLast();
        }
    }

    // CONSULTA 2: sumandos de n que contienen x.
    static void sumandosC2(LinkedList<Integer> L, int n, int x, int i) {
        int s = suma(L);

        if (s > n) return;

        if (s == n) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            L.add(k);
            sumandosC2(L, n, x, k);
            L.removeLast();
        }
    }

    // CONSULTA 3: sumandos de n SIN repetir números.
    // Cambio clave respecto al base: llamada con k+1.
    static void sumandosC3(LinkedList<Integer> L, int n, int i) {
        int s = suma(L);

        if (s > n) return;

        if (s == n) {
            System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            L.add(k);
            sumandosC3(L, n, k + 1);
            L.removeLast();
        }
    }


    // =========================================================
    // 2. FACTORES - BASE
    // Genera factorizaciones no decrecientes cuyo producto es n.
    // IMPORTANTE: iniciar i=2 para evitar repetir 1 infinitamente.
    // =========================================================

    static void factores(LinkedList<Integer> L, int n, int i) {
        int p = prod(L);

        if (p > n) return;

        if (p == n) {
            System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            if (n % k == 0) {
                L.add(k);
                factores(L, n, k);
                L.removeLast();
            }
        }
    }

    // CONSULTA 1: factorizaciones de n con exactamente r factores.
    static void factoresC1(LinkedList<Integer> L, int n, int r, int i) {
        int p = prod(L);

        if (p > n || L.size() > r) return;

        if (p == n) {
            if (L.size() == r) System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            if (n % k == 0) {
                L.add(k);
                factoresC1(L, n, r, k);
                L.removeLast();
            }
        }
    }

    // CONSULTA 2: factorizaciones de n que contienen x.
    static void factoresC2(LinkedList<Integer> L, int n, int x, int i) {
        int p = prod(L);

        if (p > n) return;

        if (p == n) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            if (n % k == 0) {
                L.add(k);
                factoresC2(L, n, x, k);
                L.removeLast();
            }
        }
    }

    // CONSULTA 3: factorizaciones SIN repetir factores.
    static void factoresC3(LinkedList<Integer> L, int n, int i) {
        int p = prod(L);

        if (p > n) return;

        if (p == n) {
            System.out.println(L);
            return;
        }

        for (int k = i; k <= n; k++) {
            if (n % k == 0) {
                L.add(k);
                factoresC3(L, n, k + 1);
                L.removeLast();
            }
        }
    }


    // =========================================================
    // 3. MOCHILA - BASE
    // Aporta elementos de A una sola vez.
    // Muestra combinaciones no vacías cuya suma <= max.
    // =========================================================

    static void mochila(LinkedList<Integer> L,
                        LinkedList<Integer> A,
                        int max,
                        int i) {

        int s = suma(L);

        if (s > max) return;

        if (!L.isEmpty()) System.out.println(L);

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochila(L, A, max, k + 1);  // k+1 = no repetir posición
            L.removeLast();
        }
    }

    // CONSULTA 1: mochila con suma EXACTA x.
    static void mochilaC1(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int x,
                          int i) {

        int s = suma(L);

        if (s > x) return;

        if (s == x) {
            System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaC1(L, A, x, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 2: combinaciones de exactamente r elementos con suma <= max.
    static void mochilaC2(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int max,
                          int r,
                          int i) {

        int s = suma(L);

        if (s > max || L.size() > r) return;

        if (L.size() == r) {
            System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaC2(L, A, max, r, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 3: combinaciones con suma <= max que contienen x.
    static void mochilaC3(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int max,
                          int x,
                          int i) {

        int s = suma(L);

        if (s > max) return;

        if (!L.isEmpty() && L.contains(x))
            System.out.println(L);

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaC3(L, A, max, x, k + 1);
            L.removeLast();
        }
    }


    // =========================================================
    // 4. MOCHILA EXACTA - BASE
    // Igual que mochila, pero SOLO imprime si suma == max.
    // =========================================================

    static void mochilaExacta(LinkedList<Integer> L,
                              LinkedList<Integer> A,
                              int max,
                              int i) {

        int s = suma(L);

        if (s > max) return;

        if (s == max) {
            System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaExacta(L, A, max, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 1: suma exacta y exactamente r elementos.
    static void mochilaExactaC1(LinkedList<Integer> L,
                                LinkedList<Integer> A,
                                int max,
                                int r,
                                int i) {

        int s = suma(L);

        if (s > max || L.size() > r) return;

        if (s == max) {
            if (L.size() == r) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaExactaC1(L, A, max, r, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 2: suma exacta y debe contener x.
    static void mochilaExactaC2(LinkedList<Integer> L,
                                LinkedList<Integer> A,
                                int max,
                                int x,
                                int i) {

        int s = suma(L);

        if (s > max) return;

        if (s == max) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaExactaC2(L, A, max, x, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 3: suma exacta y NO debe contener x.
    static void mochilaExactaC3(LinkedList<Integer> L,
                                LinkedList<Integer> A,
                                int max,
                                int x,
                                int i) {

        int s = suma(L);

        if (s > max) return;

        if (s == max) {
            if (!L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            mochilaExactaC3(L, A, max, x, k + 1);
            L.removeLast();
        }
    }


    // =========================================================
    // 5. COMBINACION SIN REPETICION - BASE
    // Regla de oro: COMBI SR -> k+1
    // =========================================================

    static void combiSR(LinkedList<Integer> L,
                        LinkedList<Integer> A,
                        int r,
                        int i) {

        if (L.size() == r) {
            System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiSR(L, A, r, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 1: combinaciones SR de r elementos cuya suma sea x.
    static void combiSRC1(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int x,
                          int i) {

        if (L.size() == r) {
            if (suma(L) == x) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiSRC1(L, A, r, x, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 2: combinaciones SR que contienen x.
    static void combiSRC2(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int x,
                          int i) {

        if (L.size() == r) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiSRC2(L, A, r, x, k + 1);
            L.removeLast();
        }
    }

    // CONSULTA 3: combinaciones SR formadas solo por pares.
    static void combiSRC3(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int i) {

        if (L.size() == r) {
            if (todosPares(L)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiSRC3(L, A, r, k + 1);
            L.removeLast();
        }
    }


    // =========================================================
    // 6. COMBINACION CON REPETICION - BASE
    // Regla de oro: COMBI CR -> k
    // =========================================================

    static void combiCR(LinkedList<Integer> L,
                        LinkedList<Integer> A,
                        int r,
                        int i) {

        if (L.size() == r) {
            System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiCR(L, A, r, k);       // k = se puede repetir
            L.removeLast();
        }
    }

    // CONSULTA 1: combinaciones CR cuya suma sea x.
    static void combiCRC1(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int x,
                          int i) {

        if (L.size() == r) {
            if (suma(L) == x) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiCRC1(L, A, r, x, k);
            L.removeLast();
        }
    }

    // CONSULTA 2: combinaciones CR que contienen x.
    static void combiCRC2(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int x,
                          int i) {

        if (L.size() == r) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiCRC2(L, A, r, x, k);
            L.removeLast();
        }
    }

    // CONSULTA 3: combinaciones CR formadas solo por pares.
    static void combiCRC3(LinkedList<Integer> L,
                          LinkedList<Integer> A,
                          int r,
                          int i) {

        if (L.size() == r) {
            if (todosPares(L)) System.out.println(L);
            return;
        }

        for (int k = i; k < A.size(); k++) {
            L.add(A.get(k));
            combiCRC3(L, A, r, k);
            L.removeLast();
        }
    }


    // =========================================================
    // 7. PERMUTACION SIN REPETICION - BASE
    // No usa i. Siempre mira A desde 0.
    // Para no repetir: !L.contains(A.get(k))
    // =========================================================

    static void permutSR(LinkedList<Integer> L,
                         LinkedList<Integer> A,
                         int r) {

        if (L.size() == r) {
            System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            if (!L.contains(A.get(k))) {
                L.add(A.get(k));
                permutSR(L, A, r);
                L.removeLast();
            }
        }
    }

    // CONSULTA 1: permutaciones SR que empiezan con x.
    static void permutSRC1(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (!L.isEmpty() && L.getFirst() == x)
                System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            if (!L.contains(A.get(k))) {
                L.add(A.get(k));
                permutSRC1(L, A, r, x);
                L.removeLast();
            }
        }
    }

    // CONSULTA 2: permutaciones SR que terminan con x.
    static void permutSRC2(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (!L.isEmpty() && L.getLast() == x)
                System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            if (!L.contains(A.get(k))) {
                L.add(A.get(k));
                permutSRC2(L, A, r, x);
                L.removeLast();
            }
        }
    }

    // CONSULTA 3: permutaciones SR que contienen x.
    static void permutSRC3(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            if (!L.contains(A.get(k))) {
                L.add(A.get(k));
                permutSRC3(L, A, r, x);
                L.removeLast();
            }
        }
    }


    // =========================================================
    // 8. PERMUTACION CON REPETICION - BASE
    // No usa i y NO usa contains.
    // =========================================================

    static void permutCR(LinkedList<Integer> L,
                         LinkedList<Integer> A,
                         int r) {

        if (L.size() == r) {
            System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            L.add(A.get(k));
            permutCR(L, A, r);
            L.removeLast();
        }
    }

    // CONSULTA 1: permutaciones CR que empiezan con x.
    static void permutCRC1(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (!L.isEmpty() && L.getFirst() == x)
                System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            L.add(A.get(k));
            permutCRC1(L, A, r, x);
            L.removeLast();
        }
    }

    // CONSULTA 2: permutaciones CR que terminan con x.
    static void permutCRC2(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (!L.isEmpty() && L.getLast() == x)
                System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            L.add(A.get(k));
            permutCRC2(L, A, r, x);
            L.removeLast();
        }
    }

    // CONSULTA 3: permutaciones CR que contienen x.
    static void permutCRC3(LinkedList<Integer> L,
                           LinkedList<Integer> A,
                           int r,
                           int x) {

        if (L.size() == r) {
            if (L.contains(x)) System.out.println(L);
            return;
        }

        for (int k = 0; k < A.size(); k++) {
            L.add(A.get(k));
            permutCRC3(L, A, r, x);
            L.removeLast();
        }
    }


    // =========================================================
    // 9. DETERMINANTE GENERICO - BASE
    // Expansión por la primera columna.
    // =========================================================

    static int det(int[][] M) {
        if (M.length == 1)
            return M[0][0];

        int s = 0;

        for (int i = 0; i < M.length; i++)
            s += (i % 2 == 0 ? 1 : -1)
               * M[i][0]
               * det(menor(M, i, 0));

        return s;
    }

    static int[][] menor(int[][] M, int fi, int co) {
        int n = M.length;
        int[][] R = new int[n - 1][n - 1];

        int a = 0;

        for (int i = 0; i < n; i++) {
            if (i == fi) continue;

            int b = 0;

            for (int j = 0; j < n; j++) {
                if (j == co) continue;

                R[a][b++] = M[i][j];
            }

            a++;
        }

        return R;
    }

    // CONSULTA 1: ¿el determinante es igual a x?
    static boolean detC1(int[][] M, int x) {
        return det(M) == x;
    }

    // CONSULTA 2: ¿el determinante es positivo?
    static boolean detC2(int[][] M) {
        return det(M) > 0;
    }

    // CONSULTA 3: determinante del menor al quitar fila fi y columna co.
    static int detC3(int[][] M, int fi, int co) {
        return det(menor(M, fi, co));
    }


    // =========================================================
    // 10. SUBMATRICES - BASE
    // Una submatriz queda definida por:
    // inicio (i,j) y final (p,q)
    // =========================================================

    static void mostrar(int[][] M, int i, int j, int p, int q) {
        for (int f = i; f <= p; f++) {
            for (int c = j; c <= q; c++)
                System.out.print(M[f][c] + " ");

            System.out.println();
        }

        System.out.println();
    }

    static void subMatrices(int[][] M) {
        for (int i = 0; i < M.length; i++)
            for (int j = 0; j < M[0].length; j++)
                for (int p = i; p < M.length; p++)
                    for (int q = j; q < M[0].length; q++)
                        mostrar(M, i, j, p, q);
    }

    static int sumaSub(int[][] M, int i, int j, int p, int q) {
        int s = 0;

        for (int f = i; f <= p; f++)
            for (int c = j; c <= q; c++)
                s += M[f][c];

        return s;
    }

    static boolean contiene(int[][] M,
                            int i, int j,
                            int p, int q,
                            int x) {

        for (int f = i; f <= p; f++)
            for (int c = j; c <= q; c++)
                if (M[f][c] == x)
                    return true;

        return false;
    }

    static boolean cuadrada(int i, int j, int p, int q) {
        return p - i == q - j;
    }

    // CONSULTA 1: mostrar solo submatrices cuadradas.
    static void subMatricesC1(int[][] M) {
        for (int i = 0; i < M.length; i++)
            for (int j = 0; j < M[0].length; j++)
                for (int p = i; p < M.length; p++)
                    for (int q = j; q < M[0].length; q++)
                        if (cuadrada(i, j, p, q))
                            mostrar(M, i, j, p, q);
    }

    // CONSULTA 2: mostrar submatrices cuya suma sea x.
    static void subMatricesC2(int[][] M, int x) {
        for (int i = 0; i < M.length; i++)
            for (int j = 0; j < M[0].length; j++)
                for (int p = i; p < M.length; p++)
                    for (int q = j; q < M[0].length; q++)
                        if (sumaSub(M, i, j, p, q) == x)
                            mostrar(M, i, j, p, q);
    }

    // CONSULTA 3: mostrar submatrices que contienen x.
    static void subMatricesC3(int[][] M, int x) {
        for (int i = 0; i < M.length; i++)
            for (int j = 0; j < M[0].length; j++)
                for (int p = i; p < M.length; p++)
                    for (int q = j; q < M[0].length; q++)
                        if (contiene(M, i, j, p, q, x))
                            mostrar(M, i, j, p, q);
    }


    // =========================================================
    // MAIN DE PRUEBA
    // Cambia la llamada según lo que quieras practicar.
    // =========================================================

    public static void main(String[] args) {

        LinkedList<Integer> L = new LinkedList<>();
        LinkedList<Integer> A =
                new LinkedList<>(Arrays.asList(1, 2, 3, 4));

        // EJEMPLO RÁPIDO:
        System.out.println("COMBI SR - BASE");
        combiSR(L, A, 2, 0);

        L.clear();
        System.out.println("\nCOMBI SR - C1: suma = 5");
        combiSRC1(L, A, 2, 5, 0);

        /*
        // Descomenta SOLO lo que estés practicando.

        // SUMANDOS
        L.clear();
        sumandos(L, 5, 1);
        L.clear();
        sumandosC1(L, 5, 2, 1);
        L.clear();
        sumandosC2(L, 5, 2, 1);
        L.clear();
        sumandosC3(L, 5, 1);

        // FACTORES
        L.clear();
        factores(L, 12, 2);
        L.clear();
        factoresC1(L, 12, 2, 2);
        L.clear();
        factoresC2(L, 12, 3, 2);
        L.clear();
        factoresC3(L, 12, 2);

        // MOCHILA
        LinkedList<Integer> B =
                new LinkedList<>(Arrays.asList(2, 4, 6, 8, 9));

        L.clear();
        mochila(L, B, 12, 0);
        L.clear();
        mochilaC1(L, B, 12, 0);
        L.clear();
        mochilaC2(L, B, 12, 2, 0);
        L.clear();
        mochilaC3(L, B, 12, 4, 0);

        // MOCHILA EXACTA
        L.clear();
        mochilaExacta(L, B, 12, 0);
        L.clear();
        mochilaExactaC1(L, B, 12, 2, 0);
        L.clear();
        mochilaExactaC2(L, B, 12, 4, 0);
        L.clear();
        mochilaExactaC3(L, B, 12, 9, 0);

        // COMBINACIONES
        L.clear();
        combiSR(L, A, 2, 0);
        L.clear();
        combiCR(L, A, 2, 0);

        // PERMUTACIONES
        L.clear();
        permutSR(L, A, 2);
        L.clear();
        permutCR(L, A, 2);

        // DETERMINANTE
        int[][] M = {
            {1, 2, 3},
            {0, 4, 5},
            {1, 0, 6}
        };

        System.out.println(det(M));
        System.out.println(detC1(M, 22));
        System.out.println(detC2(M));
        System.out.println(detC3(M, 0, 0));

        // SUBMATRICES
        int[][] S = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        subMatricesC1(S);
        subMatricesC2(S, 12);
        subMatricesC3(S, 5);
        */
    }
}
