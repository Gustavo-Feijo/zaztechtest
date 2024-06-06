import { PrismaClient, Produtos } from "@prisma/client";

const prisma = new PrismaClient();

// Dados que serão utilizados no seeding.
// Categorias de peças de computadores. AMD e Kingston inseridas para ilustrar multiplas categorias.
const categorias = [
  "Processador",
  "Placa de vídeo",
  "Memória Ram",
  "Armazenamento",
  "AMD",
  "Kingston",
];
//Lista de produtos a serem inseridos.
const produtos = [
  {
    nome_produto: "Ryzen 5 5500",
    preco: 600,
    categoria: ["Processador", "AMD"],
  },
  {
    nome_produto: "RTX 4060",
    preco: 2000,
    categoria: ["Placa de vídeo"],
  },
  {
    nome_produto: "Kingston Fury 8GB",
    preco: 150,
    categoria: ["Memória Ram", "Kingston"],
  },
  {
    nome_produto: "SSD 120GB Kingston",
    preco: 80,
    categoria: ["Armazenamento", "Kingston"],
  },
];
//Lista de fornecedores. CNPJ gerado aleatoriamente.
const fornecedores = [
  {
    nome_empresa: "Kabum",
    produtos: ["Ryzen 5 5500", "RTX 4060", "Kingston Fury 8GB"],
    cnpj: "69128630000142",
  },
  {
    nome_empresa: "Pichau",
    produtos: ["SSD 120GB Kingston", "Kingston Fury 8GB"],
    cnpj: "77944413000159",
  },
  {
    nome_empresa: "Terabyteshop",
    produtos: ["Kingston Fury 8GB", "RTX 4060"],
    cnpj: "28653659000166",
  },
];

// Função assincrona para o seeding do banco de dados.
async function main() {
  // Cria todas as categorias e armazena suas informações.
  const dadosCategorias = await prisma.categorias.createManyAndReturn({
    data: categorias.map((categoria) => ({ nome_categoria: categoria })),
    select: { id: true, nome_categoria: true },
  });

  // Percorre cada produto alterando o nome da categoria para o respectivo id da categoria.
  // Necessário apenas para o seeding, visto que não temos acesso direto ao id.
  produtos.forEach((produto) => {
    produto.categoria = produto.categoria.map((categoriaProduto) => {
      return (
        dadosCategorias.find(
          (categoria) => categoria.nome_categoria == categoriaProduto
        )?.id || " "
      );
    });
  });

  // Cria uma promise pra cada produto inserido previamente.
  // Insere cada produto no banco de dados e cria a conexão com cada id dentro do array de categorias.
  const dadosProdutos = await Promise.all(
    produtos.map((produto) =>
      prisma.produtos.create({
        data: {
          nome_produto: produto.nome_produto,
          preco: produto.preco,
          categorias: {
            connect: produto.categoria.map((categoriaId) => ({
              id: categoriaId,
            })),
          },
        },
      })
    )
  );

  // Percorre cada fornecedor e trocaos produtos da lista por seus respectivos IDs retornados.
  fornecedores.forEach((fornecedor) => {
    fornecedor.produtos = fornecedor.produtos.map((fornecedorProduto) => {
      return (
        dadosProdutos.find(
          (produto) => produto.nome_produto == fornecedorProduto
        )?.id || " "
      );
    });
  });

  const dadosFornecedores = await Promise.all(
    fornecedores.map((fornecedor) =>
      prisma.fornecedores.create({
        data: {
          nome_empresa: fornecedor.nome_empresa,
          cnpj: fornecedor.cnpj,
          produtos_fornecidos: {
            connect: fornecedor.produtos.map((produtoId) => ({
              id: produtoId,
            })),
          },
        },
      })
    )
  );
  console.log("Dados inseridos com sucesso.");
}
main()
  .then(async () => {
    const data = await prisma.produtos.findFirst({
      include: { categorias: true, fornecedores: true },
    });
    console.log(data);
    console.log(
      "Acima a seleção do primeiro produto do banco de dados, com categorias e fornecedores inclusos."
    );
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
