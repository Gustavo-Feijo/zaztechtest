"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThemeChanger } from "./ThemeChanger";
import { FaHouse } from "react-icons/fa6";

// Component referente a NavBar, contendo os links de navegação através do site.
function TopBar() {
  // Lista de componentes para serem criados na NavBar.
  const componentes = [
    {
      nome: "Produtos",
      descricao: "Crie novos produtos de diferentes categorias.",
      novo: { link: "/produto/criar", botao: "Novo Produto" },
      lista: { link: "/produto/lista", botao: "Lista de produtos" },
    },
    {
      nome: "Categorias",
      descricao: "Crie novas categorias para atribuir a seus produtos.",
      novo: { link: "/categoria/criar", botao: "Nova Categoria" },
      lista: { link: "/categoria/lista", botao: "Lista de categorias" },
    },
    {
      nome: "Fornecedores",
      descricao: "Cadastre novos fornecedores para seus produtos.",
      novo: { link: "/fornecedor/criar", botao: "Novo Fornecedor" },
      lista: { link: "/fornecedor/lista", botao: "Lista de Fornecedores" },
    },
  ];
  return (
    <nav className="h-20 w-full flex items-center justify-center border-b-2 relative">
      <ThemeChanger className="absolute right-10  max-[550px]:top-20" />
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-10 text-xl max-[550px]:top-20"
        )}
        href="/"
      >
        <FaHouse />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex gap-3">
          {componentes.map((componente, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger>{componente.nome}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink asChild>
                  <ul className="w-[400px] h-60 p-10 flex gap-4">
                    <li className="w-1/2 h-auto flex-shrink-0 rounded-lg shadow flex items-center shadow-gray-800 text-center">
                      <p className="text-sm leading-tight text-muted-foreground">
                        {" "}
                        {componente.descricao}
                      </p>
                    </li>
                    <li className="flex flex-col items-center justify-between py-10 gap-3 w-1/2 min-w-[50%] flex-1">
                      <Link
                        className={cn(
                          "w-full",
                          buttonVariants({ variant: "default" })
                        )}
                        href={componente.novo.link}
                      >
                        {componente.novo.botao}
                      </Link>
                      <Link
                        className={cn(
                          "w-full",
                          buttonVariants({ variant: "default" })
                        )}
                        href={componente.lista.link}
                      >
                        {componente.lista.botao}
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default TopBar;
