import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

// Schema para validação do body.
const produtosPost = z.object({
  nome_produto: z.string().min(5),
  preco: z.number(),
  estoque: z.number(),
  categorias: z
    .array(z.object({ id: z.string(), nome_categoria: z.string() }))
    .min(1),
});
// Rota GET.
export async function GET(request: NextRequest) {
  try {
    // Query para receber todos produtos cadastrados, incluindo suas categorias e fornecedores.
    const data = await prisma.produtos.findMany({
      include: { categorias: true, fornecedores: true },
    });
    return NextResponse.json({ result: data });
  } catch (e) {
    return NextResponse.json(
      "INTERNAL_SERVER_ERROR: Não foi possível acessar os dados.",
      { status: 500 }
    );
  }
}
// Rota POST.
export async function POST(request: NextRequest) {
  try {
    // Parse do Body para JSON, verificação contra o schema criado.
    const body = await request.json();
    const parsedBody = await produtosPost.parseAsync(body);

    // Query para criar um produto no banco de dados, com as respectivas categorias inclusas.
    await prisma.produtos.create({
      data: {
        nome_produto: parsedBody.nome_produto,
        preco: parsedBody.preco,
        estoque: parsedBody.estoque,
        categorias: {
          connect: parsedBody.categorias.map((categoria) => ({
            id: categoria.id,
          })),
        },
      },
    });
    return NextResponse.json("Produto cadastrado com sucesso", { status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json("BAD_REQUEST: Dados invalidos", {
        status: 400,
      });
    }
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == "P2002") {
        return NextResponse.json("BAD_REQUEST: Produto já cadastrado.", {
          status: 500,
        });
      }
    }
    return NextResponse.json("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
