-- CreateTable
CREATE TABLE "Categorias" (
    "id" TEXT NOT NULL,
    "nome_categoria" TEXT NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id" TEXT NOT NULL,
    "nome_produto" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedores" (
    "id" TEXT NOT NULL,
    "nome_empresa" TEXT NOT NULL,
    "cnpj" TEXT,

    CONSTRAINT "Fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriasToProdutos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FornecedoresToProdutos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriasToProdutos_AB_unique" ON "_CategoriasToProdutos"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriasToProdutos_B_index" ON "_CategoriasToProdutos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FornecedoresToProdutos_AB_unique" ON "_FornecedoresToProdutos"("A", "B");

-- CreateIndex
CREATE INDEX "_FornecedoresToProdutos_B_index" ON "_FornecedoresToProdutos"("B");

-- AddForeignKey
ALTER TABLE "_CategoriasToProdutos" ADD CONSTRAINT "_CategoriasToProdutos_A_fkey" FOREIGN KEY ("A") REFERENCES "Categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriasToProdutos" ADD CONSTRAINT "_CategoriasToProdutos_B_fkey" FOREIGN KEY ("B") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FornecedoresToProdutos" ADD CONSTRAINT "_FornecedoresToProdutos_A_fkey" FOREIGN KEY ("A") REFERENCES "Fornecedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FornecedoresToProdutos" ADD CONSTRAINT "_FornecedoresToProdutos_B_fkey" FOREIGN KEY ("B") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
