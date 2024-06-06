import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const fornecedoresForm = z.object({
  nome_empresa: z.string().min(5),
  cnpj: z.string().regex(/^\d{14}$/),
  produtos: z.array(z.string()).optional(),
});
export async function GET(request: NextRequest) {
  try {
    const data = await prisma.fornecedores.findMany({
      include: { produtos_fornecidos: true },
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedBody = await fornecedoresForm.parseAsync(body);
    await prisma.fornecedores.create({
      data: {
        nome_empresa: parsedBody.nome_empresa,
        cnpj: parsedBody.cnpj,
        produtos_fornecidos: {
          connect: parsedBody.produtos?.map((produtoId) => ({ id: produtoId })),
        },
      },
    });
    return NextResponse.json("Fornecedor cadastrado com sucesso", {
      status: 200,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json("BAD_REQUEST: Dados invalidos", {
        status: 400,
      });
    }
    return NextResponse.json("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
