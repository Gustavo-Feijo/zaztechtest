"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SeletorProdutos, { SelectProdutos } from "./SeletorProdutos";

// Schema para validação dos inputs.
const formSchema = z.object({
  nome_empresa: z
    .string()
    .min(3, { message: "A empresa deve ter ao menos 3 caracteres." }),
  cnpj: z
    .string()
    .optional()
    .refine(
      (val) => val == undefined || val.length == 0 || /^[0-9]{14}$/.test(val),
      {
        message: "CNPJ deve conter 14 caracteres e apenas números.",
      }
    ),
  produtos: z
    .array(
      z.object({
        id: z.string(),
        nome_produto: z.string(),
        categorias: z.array(
          z.object({ id: z.string(), nome_categoria: z.string() })
        ),
        select: z.boolean(),
      })
    )
    .min(0),
});

// Componente referente ao formulário de criação de fornecedores.
function Criar() {
  //React-Hook-Form para o formulário.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_empresa: "",
      cnpj: "",
      produtos: [{}],
    },
  });

  // Função para alterar a lista de produtos armazenada nos dados do formulário.
  // Passada como props para a tabela de seleção.
  const produtoSelecionado = (produtos: SelectProdutos[]) => {
    form.setValue("produtos", produtos);
  };

  // Função para realizar o cadastro de um novo fornecedor.
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    //Remove os campos desnecessários para a api.
    const newForm = {
      nome_empresa: formData.nome_empresa,
      cnpj: formData.cnpj,
      produtos: formData.produtos.map((produto) => produto.id),
    };
    const result = await fetch("/api/fornecedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newForm),
    });
    // Criação de toasts para informar se a operação foi bem sucedida.
    if (result.status == 200) {
      const jsonRes = await result.json();
      toast(jsonRes, {
        description: new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        action: { label: "Okay", onClick: () => {} },
      });
    } else {
      const jsonErr = await result.json();
      toast(jsonErr, {
        description: "Um erro ocorreu.",
        action: { label: "Okay", onClick: () => {} },
      });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  w-[1000px] h-[600px] p-12 items-center justify-around border rounded-lg shadow shadow-slate-600 max-[600px]:flex-col max-[600px]:h-fit"
      >
        <div className="flex flex-col items-center">
          <FormField
            control={form.control}
            name="nome_empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o nome da empresa"
                    className="w-80"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Nome do novo fornecedor.</FormDescription>{" "}
                <div className="h-8">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o cnpj da empresa"
                    className="w-80"
                    {...field}
                  />
                </FormControl>
                <FormDescription>CNPJ da empresa.</FormDescription>{" "}
                <div className="h-8">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="mb-4">
            <FormField
              control={form.control}
              name="produtos"
              render={() => (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Produtos
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 max-h-96 overflow-scroll ">
                    <DropdownMenuLabel>Selecionadas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {form.getValues("produtos") !== undefined &&
                      form.getValues("produtos").map((produto, index) => (
                        <DropdownMenuItem
                          className="p-4 justify-between"
                          key={index}
                        >
                          {produto.nome_produto}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </div>
          <Button type="submit" variant="default">
            Cadastrar
          </Button>{" "}
        </div>

        <FormField
          control={form.control}
          name="produtos"
          render={() => (
            <FormItem className="h-full">
              <FormControl>
                <SeletorProdutos produtoSelecionado={produtoSelecionado} />
              </FormControl>
              <div className="h-8">
                <FormMessage className="text-center" />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default Criar;
