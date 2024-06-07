"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SiNextdotjs,
  SiPrisma,
  SiReact,
  SiReacthookform,
  SiZod,
  SiShadcnui,
  SiTailwindcss,
  SiReacttable,
} from "react-icons/si";
import Link from "next/link";
export default function Home() {
  return (
    <div className="h-[800px] flex flex-col items-start justify-start">
      <Tabs defaultValue="about" className="w-[400px]">
        <TabsList className="flex justify-around gap-6 w-[500px]">
          <TabsTrigger className="p-2 " value="about">
            Sobre
          </TabsTrigger>
          <TabsTrigger className="p-2" value="produtos">
            Produtos
          </TabsTrigger>
          <TabsTrigger className="p-2" value="categorias">
            Categorias
          </TabsTrigger>
          <TabsTrigger className="p-2" value="fornecedores">
            Fornecedores
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-[500px] b" value="about">
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
              <CardDescription className="flex flex-col items-center">
                <span className="py-2">
                  Este projeto consiste em um CRUD composto por telas de criação
                  e display de dados.
                </span>
                <span className="py-2">
                  Desenvolvido como aplicação de teste para vaga na empresa
                  ZazTech.
                </span>
                <Popover>
                  <PopoverTrigger
                    className={buttonVariants({ variant: "default" })}
                  >
                    Tecnologias Utilizadas
                  </PopoverTrigger>
                  <PopoverContent className="grid grid-cols-4 gap-4 w-fit">
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://react.dev/"
                        >
                          <SiReact className="text-6xl text-cyan-300" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        React foi utilizado para todo desenvolvimento do front
                        end e controle de estado.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://www.prisma.io/"
                        >
                          <SiPrisma className="text-6xl text-cyan-800" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Prisma foi a ORM escolhida para interagir com o banco de
                        dados.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://nextjs.org/"
                        >
                          <SiNextdotjs className="text-6xl rounded-full bg-white text-black" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        NextJS apresentou o papel de back-end para o projeto,
                        com sistema de rotas no File-System.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://ui.shadcn.com/"
                        >
                          <SiShadcnui className="text-6xl text-white" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Shadcnui traz componentes versáteis com um bom aspecto
                        visual.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://zod.dev/"
                        >
                          <SiZod className="text-6xl text-blue-900" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Zod foi utilizado para a validação de dados, tanto no
                        Client quanto no Server Side.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://react-hook-form.com/"
                        >
                          <SiReacthookform className="text-6xl text-white bg-pink-500 rounded-xl" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        React Hook Form adicionou um sistema de gerenciamento de
                        forms, sendo integrado diretamente ao Zod.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://tanstack.com/table/latest"
                        >
                          <SiReacttable className="text-6xl text-yellow-300 bg-red-600 rounded-full" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        React Table (Tanstack) trouxe tabelas com diversas
                        funcionalidades.
                      </HoverCardContent>
                    </HoverCard>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Link
                          className="cursor-pointer"
                          href="https://tailwindcss.com/"
                        >
                          <SiTailwindcss className="text-6xl text-cyan-300" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Tailwind CSS foi utilizado para toda estilização
                        adicional.
                      </HoverCardContent>
                    </HoverCard>
                  </PopoverContent>
                </Popover>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <span className="text-xl">Contato:</span>
              <div className="font-bold">Telefone: (48) 99154-6078</div>
              <div className="font-bold">Email: gustavofeijo.dev@gmail.com</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="w-[500px] b" value="produtos">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription className="flex flex-col items-center">
                <span className="py-2">
                  Você pode criar produtos e listar todos disponíveis, com
                  informações como estoque e preço, assim como suas respectivas
                  categorias e fornecedores.
                </span>
                <span className=" py-4 w-full flex items-center justify-center gap-8">
                  <Link
                    href="produto/criar"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Criar
                  </Link>
                  <Link
                    href="produto/lista"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Lista
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent className="w-[500px] b" value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription className="flex flex-col items-center">
                <span className="py-2">
                  Você pode criar e listar categorias, tendo acesso a todos
                  produtos que fazem parte delas, assim como informações sobre
                  os produtos.
                </span>
                <span className=" py-4 w-full flex items-center justify-center gap-8">
                  <Link
                    href="categoria/criar"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Criar
                  </Link>
                  <Link
                    href="categoria/lista"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Lista
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent className="w-[500px] b" value="fornecedores">
          <Card>
            <CardHeader>
              <CardTitle>Fornecedores</CardTitle>
              <CardDescription className="flex flex-col items-center">
                <span className="py-2">
                  Você pode criar e listar fornecedores, cadastrando sua empresa
                  e seu CNPJ (Opcional), selecionando os produtos que serão
                  fornecidos e listando suas categorias.
                </span>
                <span className=" py-4 w-full flex items-center justify-center gap-8">
                  <Link
                    href="fornecedor/criar"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Criar
                  </Link>
                  <Link
                    href="fornecedor/lista"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Lista
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
