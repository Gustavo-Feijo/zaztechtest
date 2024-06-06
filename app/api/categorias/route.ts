import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

// Schema com zod para verificação do body.
const categoriasForm = z.object({
  nome_categoria: z.string().min(3),
});
// Rota GET.
export async function GET(request: NextRequest) {
  try {
    // Query para buscar todas categorias do banco de dados, incluindo os produtos nas quais elas estão presentes.
    const data = await prisma.categorias.findMany({
      include: { produtos: true },
    });

    return NextResponse.json({ result: data });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        "INTERNAL_SERVER_ERROR: Não foi possível acessar os dados.",
        { status: 500 }
      );
    }
  }
}
// Rota POST.
export async function POST(request: NextRequest) {
  try {
    // Parse do Body para JSON e verificação do mesmo contra o schema criado.
    const body = await request.json();
    const parsedBody = await categoriasForm.parseAsync(body);

    await prisma.categorias.create({
      data: {
        nome_categoria: parsedBody.nome_categoria,
      },
    });
    return NextResponse.json("Categoria cadastrada com sucesso", {
      status: 200,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json("BAD_REQUEST: Dados invalidos", {
        status: 400,
      });
    }
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == "P2002") {
        return NextResponse.json("BAD_REQUEST: Categoria já cadastrada.", {
          status: 500,
        });
      }
    }
    return NextResponse.json("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
