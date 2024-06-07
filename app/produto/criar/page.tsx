"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import SeletorCategoria from "./SeletorCategorias";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Categorias } from "@prisma/client";
//Schema com Zod para validação do forms.
const formSchema = z.object({
  // String referente ao nome do produto cadastrado.
  nome_produto: z
    .string()
    .min(3, { message: "O produto deve ter ao menos 3 caracteres." }),
  // Number com o valor do estoque.
  estoque: z.number({ message: "Deve ser inserido um numero." }).refine(
    (num) => {
      return num % 1 == 0;
    },
    { message: "Deve ser inserido um numero inteiro." }
  ),
  preco: z.number({ message: "Deve ser inserido um numero" }),
  // Array de objetos, cada objeto sendo referente à uma categoria.
  // Id é utilizado para a inserção dos dados, nome_categoria para display.
  categorias: z
    .array(
      z.object({
        id: z.string(),
        nome_categoria: z.string(),
      })
    )
    .min(1, { message: "Ao menos uma categoria deve ser selecionada." }),
});

// Função responsável pelo envio dos dados para o servidor.
const onSubmit = async (formData: z.infer<typeof formSchema>) => {
  console.log(formData);
  const result = await fetch("/api/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
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

// Component referente ao formulário de envio.
function Criar() {
  // Hook para criação do formulário baseado no schema criado.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_produto: "",
      estoque: 0,
      preco: 0,
    },
  });

  // Função para alterar a lista de categorias armazenada nos dados do formulário.
  // Passada como props para a tabela de seleção.
  const categoriaSelecionada = (categorias: Categorias[]) => {
    form.setValue("categorias", categorias);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  w-[800px] h-[500px] p-12 items-center justify-around border rounded-lg shadow shadow-slate-600 max-[600px]:flex-col max-[600px]:h-fit"
      >
        <div className="flex flex-col items-center">
          <FormField
            control={form.control}
            name="nome_produto"
            render={({ field }) => (
              <FormItem className="w-4/5">
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Insira o nome do produto"
                    className="flex-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Nome do novo produto.</FormDescription>{" "}
                <div className="h-8">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-around">
            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Insira o preço..."
                      className="w-full"
                      type="number"
                      step="0.01"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value.length > 0)
                          field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Preço do produto.</FormDescription>{" "}
                  <div className="h-8">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estoque"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>Estoque</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Insira o estoque..."
                      className="w-full"
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => {
                        if (e.target.value.length > 0)
                          field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Estoque do produto.</FormDescription>{" "}
                  <div className="h-8">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4">
            <FormField
              control={form.control}
              name="categorias"
              render={() => (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Categorias
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 max-h-96 overflow-scroll ">
                    <DropdownMenuLabel>Selecionadas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {form.getValues("categorias") &&
                      form.getValues("categorias").map((categoria, index) => (
                        <DropdownMenuItem
                          className="p-4 justify-between"
                          key={index}
                        >
                          {categoria.nome_categoria}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </div>
          <Button type="submit" variant="default">
            Cadastrar
          </Button>
        </div>
        <FormField
          control={form.control}
          name="categorias"
          render={() => (
            <FormItem className="h-full">
              <FormControl>
                <SeletorCategoria categoriaSelecionada={categoriaSelecionada} />
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
