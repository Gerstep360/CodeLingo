import java.util.*;

public class Examen1 {

    // =========================================================
    // AUXILIARES
    // =========================================================

    static int suma(LinkedList<Integer> L){
        int s=0;
        for(int x:L) s+=x;
        return s;
    }

    static int prod(LinkedList<Integer> L){
        int p=1;
        for(int x:L) p*=x;
        return p;
    }


    // =========================================================
    // 1. SUMANDOS
    // =========================================================

    static void sumandos(LinkedList<Integer> L,int n,int i){
        int s=suma(L);
        if(s>n)return;
        if(s==n){
            System.out.println(L);
            return;
        }
        for(int k=i;k<=n;k++){
            L.add(k);
            sumandos(L,n,k);
            L.removeLast();
        }
    }


    // =========================================================
    // 1. FACTORES
    // =========================================================

    static void factores(LinkedList<Integer> L,int n,int i){
        int p=prod(L);
        if(p>n)return;
        if(p==n){
            System.out.println(L);
            return;
        }
        for(int k=i;k<=n;k++){
            if(n%k==0){
                L.add(k);
                factores(L,n,k);
                L.removeLast();
            }
        }
    }


    // =========================================================
    // 2. MOCHILA
    // Muestra combinaciones cuya suma <= max
    // =========================================================

    static void mochila(LinkedList<Integer> L,LinkedList<Integer> A,int max,int i){
        int s=suma(L);
        if(s>max) return;
        if(!L.isEmpty()) System.out.println(L);
        for(int k=i;k<A.size();k++){
            L.add(A.get(k));
            mochila(L,A,max,k+1);
            L.removeLast();
        }
    }


    // =========================================================
    // MOCHILA EXACTA
    // =========================================================

    static void mochilaExacta(LinkedList<Integer> L,LinkedList<Integer> A,int max,int i){
        int s=suma(L);
        if(s>max)return;
        if(s==max){
            System.out.println(L);
            return;
        }
        for(int k=i;k<A.size();k++){
            L.add(A.get(k));
            mochilaExacta(L,A,max,k+1);
            L.removeLast();
        }
    }


    // =========================================================
    // 3. COMBINACION SIN REPETICION
    // =========================================================

    static void combiSR(LinkedList<Integer> L,LinkedList<Integer> A,int r,int i){
        if(L.size()==r){
            System.out.println(L);
            return;
        }
        for(int k=i;k<A.size();k++){
            L.add(A.get(k));
            combiSR(L,A,r,k+1);
            L.removeLast();
        }
    }


    // =========================================================
    // 3. COMBINACION CON REPETICION
    // =========================================================

    static void combiCR(LinkedList<Integer> L,LinkedList<Integer> A,int r,int i){
        if(L.size()==r){
            System.out.println(L);
            return;
        }
        for(int k=i;k<A.size();k++){
            L.add(A.get(k));
            combiCR(L,A,r,k);
            L.removeLast();
        }
    }


    // =========================================================
    // 3. PERMUTACION SIN REPETICION
    // =========================================================

    static void permutSR(LinkedList<Integer> L,LinkedList<Integer> A,int r){
        if(L.size()==r){
            System.out.println(L);
            return;
        }
        for(int k=0;k<A.size();k++){
            if(!L.contains(A.get(k))){
                L.add(A.get(k));
                permutSR(L,A,r);
                L.removeLast();
            }
        }
    }


    // =========================================================
    // 3. PERMUTACION CON REPETICION
    // =========================================================

    static void permutCR(LinkedList<Integer> L,LinkedList<Integer> A,int r){
        if(L.size()==r){
            System.out.println(L);
            return;
        }
        for(int k=0;k<A.size();k++){
            L.add(A.get(k));
            permutCR(L,A,r);
            L.removeLast();
        }
    }


    // =========================================================
    // 4. DETERMINANTE GENERICO
    // =========================================================

    static int det(int[][] M){
        if(M.length==1)
            return M[0][0];
        int s=0;
        for(int i=0;i<M.length;i++)
            s+=(i%2==0 ? 1:-1)
              *M[i][0]
              *det(menor(M,i,0));
        return s;
    }


    // =========================================================
    // MENOR DE UNA MATRIZ
    // Elimina fila fi y columna co
    // =========================================================

    static int[][] menor(int[][] M,int fi,int co){
        int n=M.length;
        int[][]R=new int[n-1][n-1];
        int a=0;
        for(int i=0;i<n;i++){
            if(i==fi)continue;
            int b=0;
            for(int j=0;j<n;j++){
                if(j==co)continue;
                R[a][b++]=M[i][j];
            }
            a++;
        }
        return R;
    }


    // =========================================================
    // 5. MOSTRAR UNA SUBMATRIZ
    // (i,j) inicio
    // (p,q) final
    // =========================================================

    static void mostrar(int[][] M,int i,int j,int p,int q){
        for(int f=i;f<=p;f++){
            for(int c=j;c<=q;c++)
                System.out.print(M[f][c]+" ");

            System.out.println();
        }
        System.out.println();
    }


    // =========================================================
    // LISTA DE TODAS LAS SUBMATRICES
    // =========================================================

    static void subMatrices(int[][] M){
        for(int i=0;i<M.length;i++)
        for(int j=0;j<M[0].length;j++)
        for(int p=i;p<M.length;p++)
        for(int q=j;q<M[0].length;q++)
            mostrar(M,i,j,p,q);
    }


    // =========================================================
    // CONSULTA AUXILIAR 1:
    // SUMA DE UNA SUBMATRIZ
    // =========================================================

    static int sumaSub(int[][] M,int i,int j,int p,int q){
        int s=0;
        for(int f=i;f<=p;f++)
        for(int c=j;c<=q;c++)
            s+=M[f][c];
        return s;
    }


    // =========================================================
    // CONSULTA AUXILIAR 2:
    // CONTIENE X
    // =========================================================

    static boolean contiene(int[][] M,int i,int j,int p,int q,int x){
        for(int f=i;f<=p;f++)
        for(int c=j;c<=q;c++)
            if(M[f][c]==x)
                return true;
        return false;
    }


    // =========================================================
    // CONSULTA AUXILIAR 3:
    // ES CUADRADA
    // =========================================================

    static boolean cuadrada(int i,int j,int p,int q){
        return p-i==q-j;
    }


    // =========================================================
    // CONSULTAS
    //
    // op=1 -> cuadradas
    // op=2 -> suma igual a x
    // op=3 -> contienen x
    // =========================================================

    static void consulta(int[][]M,int op,int x){
        for(int i=0;i<M.length;i++)
        for(int j=0;j<M[0].length;j++)
        for(int p=i;p<M.length;p++)
        for(int q=j;q<M[0].length;q++){
            if(op==1 && cuadrada(i,j,p,q))
                mostrar(M,i,j,p,q);
            if(op==2 && sumaSub(M,i,j,p,q)==x)
                mostrar(M,i,j,p,q);
            if(op==3 && contiene(M,i,j,p,q,x))
                mostrar(M,i,j,p,q);
        }
    }


    // =========================================================
    // LAS 3 CONSULTAS COMO METODOS SEPARADOS
    // =========================================================

    static void consulta1(int[][] M){
        consulta(M,1,0);       // cuadradas
    }

    static void consulta2(int[][] M,int x){
        consulta(M,2,x);       // suma = x
    }

    static void consulta3(int[][] M,int x){
        consulta(M,3,x);       // contiene x
    }


    // =========================================================
    // MAIN
    // =========================================================

    public static void main(String[]args){
        LinkedList<Integer>L=new LinkedList<>();
        // -------------------------
        // SUMANDOS
        // -------------------------
        System.out.println("SUMANDOS");
        sumandos(L,5,1);
        // -------------------------
        // FACTORES
        // -------------------------
        L.clear();
        System.out.println("\nFACTORES");
        factores(L,12,2);
        // -------------------------
        // MOCHILA
        // -------------------------
        LinkedList<Integer>A=new LinkedList<>(Arrays.asList(2,4,6,8,9));
        L.clear();
        System.out.println("\nMOCHILA");
        mochila(L,A,12,0);
        // -------------------------
        // MOCHILA EXACTA
        // -------------------------
        L.clear();
        System.out.println("\nMOCHILA EXACTA");
        mochilaExacta(L,A,12,0);
        // -------------------------
        // COMBINACIONES
        // -------------------------
        LinkedList<Integer>B=new LinkedList<>(Arrays.asList(1,2,3,4));
        L.clear();
        System.out.println("\nCOMBINACION SR");
        combiSR(L,B,2,0);
        L.clear();
        System.out.println("\nCOMBINACION CR");
        combiCR(L,B,2,0);
        // -------------------------
        // PERMUTACIONES
        // -------------------------
        L.clear();
        System.out.println("\nPERMUTACION SR");
        permutSR(L,B,2);
        L.clear();
        System.out.println("\nPERMUTACION CR");
        permutCR(L,B,2);
        // -------------------------
        // DETERMINANTE
        // -------------------------
        int[][]M={
            {1,2,3},
            {0,4,5},
            {1,0,6}
        };
        System.out.println("\nDETERMINANTE");
        System.out.println(det(M));
        // -------------------------
        // SUBMATRICES
        // -------------------------
        int[][]S={
            {1,2,3},
            {4,5,6},
            {7,8,9}
        };
        // TODAS
        subMatrices(S);
        // -------------------------
        // CONSULTA 1
        // CUADRADAS
        // -------------------------
        consulta1(S);
        // -------------------------
        // CONSULTA 2
        // SUMA = 12
        // -------------------------
        consulta2(S,12);
        // -------------------------
        // CONSULTA 3
        // CONTIENEN 5
        // -------------------------
        consulta3(S,5);
    }
}