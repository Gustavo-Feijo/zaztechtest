import prisma from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

// Schema para validação do body.
const fornecedoresForm = z.object({
  nome_empresa: z.string().min(3),
  cnpj: z
    .string()
    .regex(/^\d{14}$/)
    .optional()
    .or(z.literal("")),
  produtos: z.array(z.string()).optional(),
});
// Rota GET.
export async function GET(request: NextRequest) {
  try {
    //Retorna os dados dos fornecedores com os produtos fornecidos inclusos.
    const data = await prisma.fornecedores.findMany({
      include: { produtos_fornecidos: true },
    });
    return NextResponse.json({ result: data });
  } catch (e) {
    return NextResponse.json(
      "INTERNAL_SERVER_ERROR: Não foi possível acessar os dados",
      { status: 500 }
    );
  }
}
// Rota POST.
export async function POST(request: NextRequest) {
  try {
    //Parse do Body e validação contra o schema criado.
    const body = await request.json();
    const parsedBody = await fornecedoresForm.parseAsync(body);
    // Criação do fornecedor no banco de dados.
    // Verificação da presença de CNPJ ou não.
    await prisma.fornecedores.create({
      data: {
        nome_empresa: parsedBody.nome_empresa,
        cnpj: parsedBody.cnpj?.length == 14 ? parsedBody.cnpj : null,
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
    if (e instanceof PrismaClientKnownRequestError) {
      console.log(e);
      if (e.code == "P2002") {
        return NextResponse.json("BAD_REQUEST: Fornecedor já cadastrado", {
          status: 400,
        });
      }
    }
    return NextResponse.json("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
