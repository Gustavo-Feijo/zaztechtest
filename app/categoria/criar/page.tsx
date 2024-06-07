"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Schema para validação dos inputs.
const formSchema = z.object({
  nome_categoria: z
    .string()
    .min(3, { message: "A categoria deve ter ao menos 3 caracteres." }),
});

// Componente referente ao formulário de criação de categorias.
function Criar() {
  //React-Hook-Form para o formulário.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_categoria: "",
    },
  });

  // Função para realizar o cadastro de uma nova categoria.
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const result = await fetch("/api/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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
        className="flex flex-col w-96 h-96 p-12 items-center justify-around border rounded-lg shadow shadow-slate-600"
      >
        <FormField
          control={form.control}
          name="nome_categoria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insira o nome da categoria"
                  className="w-80"
                  {...field}
                />
              </FormControl>
              <FormDescription>Nome da nova categoria.</FormDescription>{" "}
              <div className="h-8">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" variant="default">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}

export default Criar;
