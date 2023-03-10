-- CreateTable
CREATE TABLE "restaurantes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "restaurantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" TEXT NOT NULL,
    "preco" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "RestauranteId" INTEGER NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "valor_total" TEXT NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "cidade_cliente" TEXT NOT NULL,
    "endereco_cliente" TEXT NOT NULL,
    "telefone_cliente" TEXT NOT NULL,
    "RestauranteId" INTEGER NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PedidoToProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurantes_email_key" ON "restaurantes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurantes_telefone_key" ON "restaurantes"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "_PedidoToProduto_AB_unique" ON "_PedidoToProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_PedidoToProduto_B_index" ON "_PedidoToProduto"("B");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_RestauranteId_fkey" FOREIGN KEY ("RestauranteId") REFERENCES "restaurantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_RestauranteId_fkey" FOREIGN KEY ("RestauranteId") REFERENCES "restaurantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoToProduto" ADD CONSTRAINT "_PedidoToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidoToProduto" ADD CONSTRAINT "_PedidoToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
