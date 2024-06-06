"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Categorias } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaArrowRightArrowLeft, FaBox, FaMoneyBills } from "react-icons/fa6";

// Interface extendida do schema de Categorias.
// Referente as informações da categoria, apresenta array de produtos para vizualizar produtos da categoria.
interface ListaCategorias extends Categorias {
  produtos?: string[];
}
// ColumnHelper para definição das colunas da tabela.
const columnHelper = createColumnHelper<ListaCategorias>();
const columns = [
  columnHelper.accessor("nome_categoria", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Categoria
        <FaArrowRightArrowLeft className="ml-2 h-4 w-4 rotate-90" />
      </Button>
    ),
    enableSorting: true,
    filterFn: (row: any, columnId: string, filterValue) => {
      return row
        .getValue(columnId)
        .toString()
        .toLowerCase()
        .startsWith(filterValue.toLowerCase());
    },
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  // Helper para mostrar os produtos cadastrados em cada categoria.
  columnHelper.accessor("produtos", {
    header: "Produtos",
    enableSorting: false,
    cell: (info) => {
      // Verifica se o valor da celular é um array com elementos.
      const value = info.getValue();
      // Retorna um dropdown menu contendo a lista de produtos em cada categoria.
      if (Array.isArray(value) && value?.length > 0) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost" })}
            >
              Abrir
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <DropdownMenuLabel className="text-center">
                Produtos
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {value.map((produto: any, index) => {
                return (
                  <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger>
                      <span>{produto.nome_produto}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="flex flex-col items-center justify-center">
                        <DropdownMenuItem>
                          <span className="flex items-center">
                            <FaMoneyBills className="mr-2" /> R$ {produto.preco}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="flex items-center">
                            <FaBox className="mr-2" />
                            Estoque: {produto.estoque}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      } else {
        return "Sem Produto Cadastrado";
      }
    },
  }),
];

// Componente contendo uma tabela com as categorias.
function page() {
  // UseState contendo os dados recebidos via Fetching.
  const [data, setData] = useState<ListaCategorias[]>([]);
  // UseState para apresentar tela de loading.
  const [loading, setLoading] = useState<boolean>(true);
  // UseStates para uso com Tanstack Table.
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Array contendo as colunas da tabela e seu método de filtering.

  // Inicialização da tabela com os modelos para sorting, filtering e paginação.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
  });

  //UseEffect para fetching da lista de categorias.
  useEffect(() => {
    const getCategorias = async () => {
      try {
        // Fetching da lista de categorias.
        const response = await fetch("/api/categorias", { method: "GET" });
        if (!response.ok) {
          throw new Error(
            `Não foi possível concluir a requisição. Status: ${response.status}`
          );
        }
        const jsonData = await response.json();
        setData(jsonData.result);
      } catch (e: any) {
        //No caso de erro, cria um toast para recarregar a pagina.
        toast(e.message, {
          description: "Um erro ocorreu. Tente recarregar a pagina",
          action: {
            label: "Recarregar",
            onClick: () => {
              const router = useRouter();
              router.refresh();
            },
          },
        });
      } finally {
        // Finaliza o loading.
        setLoading(false);
      }
    };
    getCategorias();
  }, []);
  return loading ? (
    <span>Carregando...</span>
  ) : (
    <div className="w-1/2 max-w-[600px] h-full min-h-[750px] flex flex-col justify-start max-[500px]:w-3/5">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar categorias..."
          value={
            (table.getColumn("nome_categoria")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("nome_categoria")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id == "produtos" ? "p-0" : ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} linha(s).
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
