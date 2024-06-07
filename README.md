# Zaztech Test

Este projeto é referente à um teste, cuja aplicação requerida é um CRUD utilizando React e back-end NodeJS(NextJS).

## Funcionalidades

1. Criação de categorias, produtos e fornecedores.
2. Listagem de categorias, produtos e fornecedores, apresentando também representações visuais de suas conexões e propriedades.
3. Rotas de API para as funções acima.

## Melhorias

Dentre algumas simples melhorias viáveis fora do escopo requerido:

* Implementação de server side rendering e pré-carregamento de dados em ClientComponents.
* Utilização de Server Actions nos formulários para retirar a necessidade de rotas de API.
* Implementação de lógica de update e delete.

## Setup inicial

O setup inicial do projeto consiste na configuração de um banco de dados Postgres e URL de conexão.
Para um setup em nuvem, um banco de dados Postgres Vercel ou NeonDB podem ser utilizados.
É necessário a criação de uma conta e database, logo em seguida tendo acesso à URL de conexão, que deve ser inserida em um .env.

Um .env na raiz do diretório é requerido para armazenar a url de conexão para o prisma.
No diretório está como credentials.env (Para deploy em nuvem), renomeie para .env.
O .env possui apenas isto como variável: DATABASE_URL={URL DE CONEXÃO}.

Em um setup local a instalação de um banco de dados Postgres é necessária, assim como a configuração dos usuários.
Não se faz necessária a criação do database, já sendo feito pelo PrismaDB.
A URL de conexão será, por exemplo, com um usuário: gustavo, senha:zaztech, database:zaztech:

* DATABASE_URL="postgresql://gustavo:zaztech@localhost:5432/zaztech?schema=public"

A URL acima apresenta localhost:5432, sendo host local e a porta padrão do postgres.

Após a inserção de uma URL de conexão, deve-se rodar os comandos:

* npx prisma generate: Apenas necessário caso vá realizar alterações no código, responsável por gerar o cliente do Prisma.
* npx prisma migrate dev: Para utilização durante desenvolvimento.
* npm run dev: Para iniciar servidor local de desenvolvimento.
* npm run prod: Para deploy. Consiste em: npx prisma generate, npx prisma migrate deploy e next build

## Estrutura

A estrutura do código é baseada no File System, pela forma como rotas são tratadas no NextJS.

Todas rotas estão dentro da pasta app/.
app/api apresenta 3 pastas, cada uma referente à um endpoint, recebendo tanto GET quanto POST requests.
app/ categoria,fornecedor e produto são as rotas referentes ao crud. Cada uma tendo endpoints /criar e /lista.

components/ Possui os componentes de Shadcnui, provedor de temas, NavBar e seletor de tema.

/prisma apresenta o Schema do bando de dados e um arquivo para seeding.
