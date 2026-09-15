import java.util.*;

public class ExamenVargas {

    // =====================================================
    // AUXILIARES
    // =====================================================

    static int suma(LinkedList<Integer>L){
        int s=0;
        for(int x:L)s+=x;
        return s;
    }

    static int prod(LinkedList<Integer>L){
        int p=1;
        for(int x:L)p*=x;
        return p;
    }

    static boolean primo(int n){
        for(int i=2;i<n;i++)
            if(n%i==0)return false;
        return n>1;
    }


    // =====================================================
    // SUMANDOS BASE
    // =====================================================

    static void sumandos(LinkedList<Integer>L,int n,int i){
        int s=suma(L);

        if(s>=n){
            if(s==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++){
            L.add(k);
            sumandos(L,n,k);
            L.removeLast();
        }
    }


    // SUMANDOS DIFERENTES
    static void sumDif(LinkedList<Integer>L,int n,int i){
        int s=suma(L);

        if(s>=n){
            if(s==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++){
            L.add(k);
            sumDif(L,n,k+1);
            L.removeLast();
        }
    }


    // SUMANDOS PARES
    static void sumPar(LinkedList<Integer>L,int n,int i){
        int s=suma(L);

        if(s>=n){
            if(s==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++)
            if(k%2==0){
                L.add(k);
                sumPar(L,n,k+1);
                L.removeLast();
            }
    }


    // SUMANDOS ENTRE A Y B
    // i se llama inicialmente con A
    static void sumRango(LinkedList<Integer>L,int n,int i,int b){
        int s=suma(L);

        if(s>=n){
            if(s==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=b;k++){
            L.add(k);
            sumRango(L,n,k,b);
            L.removeLast();
        }
    }


    // =====================================================
    // FACTORES BASE
    // =====================================================

    static void factores(LinkedList<Integer>L,int n,int i){
        int p=prod(L);

        if(p>=n){
            if(p==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++)
            if(n%(p*k)==0){
                L.add(k);
                factores(L,n,k);
                L.removeLast();
            }
    }


    // FACTORES DIFERENTES
    static void facDif(LinkedList<Integer>L,int n,int i){
        int p=prod(L);

        if(p>=n){
            if(p==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++)
            if(n%(p*k)==0){
                L.add(k);
                facDif(L,n,k+1);
                L.removeLast();
            }
    }


    // FACTORES PRIMOS
    static void facPrimos(LinkedList<Integer>L,int n,int i){
        int p=prod(L);

        if(p>=n){
            if(p==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=n;k++)
            if(primo(k) && n%(p*k)==0){
                L.add(k);
                facPrimos(L,n,k);
                L.removeLast();
            }
    }


    // FACTORES ENTRE A Y B
    static void facRango(LinkedList<Integer>L,int n,int i,int b){
        int p=prod(L);

        if(p>=n){
            if(p==n)System.out.println(L);
            return;
        }

        for(int k=i;k<=b;k++)
            if(n%(p*k)==0){
                L.add(k);
                facRango(L,n,k,b);
                L.removeLast();
            }
    }


    // =====================================================
    // MOCHILA
    // =====================================================

    static class Objeto{
        int peso,tam;
        String color;

        Objeto(int p,String c,int t){
            peso=p;
            color=c;
            tam=t;
        }

        public String toString(){
            return "("+peso+","+color+","+tam+")";
        }
    }


    static int peso(LinkedList<Objeto>L){
        int s=0;
        for(Objeto x:L)s+=x.peso;
        return s;
    }


    // MOCHILA BASE
    static void mochila(LinkedList<Objeto>L1,
                        LinkedList<Objeto>L2,
                        int max,int i){

        if(peso(L1)>max)return;

        if(!L1.isEmpty())
            System.out.println(L1);

        for(int k=i;k<L2.size();k++){
            L1.add(L2.get(k));
            mochila(L1,L2,max,k+1);
            L1.removeLast();
        }
    }


    // MOCHILA POR COLOR
    static void mochColor(LinkedList<Objeto>L1,
                          LinkedList<Objeto>L2,
                          int max,String c,int i){

        if(peso(L1)>max)return;

        if(!L1.isEmpty())
            System.out.println(L1);

        for(int k=i;k<L2.size();k++){

            Objeto x=L2.get(k);

            if(x.color.equals(c)){
                L1.add(x);
                mochColor(L1,L2,max,c,k+1);
                L1.removeLast();
            }
        }
    }


    // MOCHILA POR TAMAÑO
    static void mochTam(LinkedList<Objeto>L1,
                        LinkedList<Objeto>L2,
                        int max,int tam,int i){

        if(peso(L1)>max)return;

        if(!L1.isEmpty())
            System.out.println(L1);

        for(int k=i;k<L2.size();k++){

            Objeto x=L2.get(k);

            if(x.tam<=tam){
                L1.add(x);
                mochTam(L1,L2,max,tam,k+1);
                L1.removeLast();
            }
        }
    }


    // MOCHILA POR RANGO DE PESO
    static void mochPeso(LinkedList<Objeto>L1,
                         LinkedList<Objeto>L2,
                         int max,int a,int b,int i){

        if(peso(L1)>max)return;

        if(!L1.isEmpty())
            System.out.println(L1);

        for(int k=i;k<L2.size();k++){

            Objeto x=L2.get(k);

            if(x.peso>=a && x.peso<=b){
                L1.add(x);
                mochPeso(L1,L2,max,a,b,k+1);
                L1.removeLast();
            }
        }
    }


    // =====================================================
    // COMBINACIONES
    // =====================================================

    // COMBINACION SIN REPETICION
    static void combiSR(LinkedList<Integer>L1,
                        LinkedList<Integer>L2,
                        int r,int i){

        if(L1.size()==r){
            System.out.println(L1);
            return;
        }

        for(int k=i;k<L2.size();k++){
            L1.add(L2.get(k));
            combiSR(L1,L2,r,k+1);
            L1.removeLast();
        }
    }


    // COMBINACION CON REPETICION
    static void combiCR(LinkedList<Integer>L1,
                        LinkedList<Integer>L2,
                        int r,int i){

        if(L1.size()==r){
            System.out.println(L1);
            return;
        }

        for(int k=i;k<L2.size();k++){
            L1.add(L2.get(k));
            combiCR(L1,L2,r,k);
            L1.removeLast();
        }
    }


    // =====================================================
    // PERMUTACIONES
    // =====================================================

    // PERMUTACION SIN REPETICION
    static void permutSR(LinkedList<Integer>L1,
                         LinkedList<Integer>L2,
                         int r){

        if(L1.size()==r){
            System.out.println(L1);
            return;
        }

        for(int k=0;k<L2.size();k++)
            if(!L1.contains(L2.get(k))){
                L1.add(L2.get(k));
                permutSR(L1,L2,r);
                L1.removeLast();
            }
    }


    // PERMUTACION CON REPETICION
    static void permutCR(LinkedList<Integer>L1,
                         LinkedList<Integer>L2,
                         int r){

        if(L1.size()==r){
            System.out.println(L1);
            return;
        }

        for(int k=0;k<L2.size();k++){
            L1.add(L2.get(k));
            permutCR(L1,L2,r);
            L1.removeLast();
        }
    }


    // =====================================================
    // MATRIZ
    // DETERMINANTES + SUBMATRICES
    // =====================================================

    static class Matriz{

        int[][] e;

        Matriz(int f,int c){
            e=new int[f][c];
        }

        Matriz(int[][] e){
            this.e=e;
        }

        int fil(){
            return e.length;
        }

        int col(){
            return e[0].length;
        }

        int get(int i,int j){
            return e[i][j];
        }

        public String toString(){

            String s="";

            for(int[] f:e){
                for(int x:f)
                    s+=x+" ";

                s+="\n";
            }

            return s;
        }
    }


    // =====================================================
    // DETERMINANTE
    // =====================================================

    static int signo(int i,int j){
        return (i+j)%2==0 ? 1:-1;
    }


    static Matriz menor(Matriz M,int fi,int co){

        int n=M.fil(),a=0;

        int[][] R=new int[n-1][n-1];

        for(int i=0;i<n;i++)

            if(i!=fi){

                int b=0;

                for(int j=0;j<n;j++)

                    if(j!=co)
                        R[a][b++]=M.get(i,j);

                a++;
            }

        return new Matriz(R);
    }


    // DETERMINANTE BASE
    static int det(Matriz M){

        if(M.fil()==1)
            return M.get(0,0);

        int s=0;

        for(int i=0;i<M.fil();i++)

            s += signo(i,0)
               * M.get(i,0)
               * det(menor(M,i,0));

        return s;
    }


    // COFACTOR
    static int cofactor(Matriz M,int i,int j){

        return signo(i,j)
             * det(menor(M,i,j));
    }


    // DETERMINANTE POR COLUMNA
    static int detCol(Matriz M,int j){

        if(M.fil()==1)
            return M.get(0,0);

        int s=0;

        for(int i=0;i<M.fil();i++)

            s += signo(i,j)
               * M.get(i,j)
               * det(menor(M,i,j));

        return s;
    }


    // DETERMINANTE POR FILA
    static int detFila(Matriz M,int i){

        if(M.fil()==1)
            return M.get(0,0);

        int s=0;

        for(int j=0;j<M.col();j++)

            s += signo(i,j)
               * M.get(i,j)
               * det(menor(M,i,j));

        return s;
    }


    // =====================================================
    // SUBMATRICES
    // =====================================================

    static Matriz subMatriz(Matriz M,
                            int i,int j,
                            int a,int b){

        Matriz R=
            new Matriz(a-i+1,b-j+1);

        for(int f=i,x=0;f<=a;f++,x++)

            for(int c=j,y=0;c<=b;c++,y++)

                R.e[x][y]=M.e[f][c];

        return R;
    }


    // GENERAR LISTA DE SUBMATRICES
    static void subMatrices(Matriz M,
                            LinkedList<Matriz>L){

        L.clear();

        for(int i=0;i<M.fil();i++)
        for(int j=0;j<M.col();j++)
        for(int a=i;a<M.fil();a++)
        for(int b=j;b<M.col();b++)

            L.add(subMatriz(M,i,j,a,b));
    }


    // SUBMATRICES CUADRADAS
    static void cuadradas(LinkedList<Matriz>L){

        for(Matriz M:L)
            if(M.fil()==M.col())
                System.out.println(M);
    }


    // SUBMATRICES FILA
    static void filas(LinkedList<Matriz>L){

        for(Matriz M:L)
            if(M.fil()==1)
                System.out.println(M);
    }


    // SUBMATRICES COLUMNA
    static void columnas(LinkedList<Matriz>L){

        for(Matriz M:L)
            if(M.col()==1)
                System.out.println(M);
    }


    // =====================================================
    // MAIN DE PRUEBA MINIMO
    // =====================================================

    public static void main(String[] args){

        LinkedList<Integer> L=new LinkedList<>();

        LinkedList<Integer> A=
            new LinkedList<>(
                Arrays.asList(1,2,3,4)
            );


        // Ejemplo combinacion
        combiSR(L,A,2,0);


        Matriz M=new Matriz(
            new int[][]{
                {1,2,3},
                {0,4,5},
                {1,0,6}
            }
        );


        System.out.println(
            "Det = "+det(M)
        );


        LinkedList<Matriz> S=
            new LinkedList<>();

        subMatrices(M,S);

        cuadradas(S);
    }
}