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
import { Categorias, Fornecedores, Produtos } from "@prisma/client";
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

// Interface extendida do schema de Produtos.
// Apresenta arrays para representar categorias e fornecedores.
interface ListaProdutos extends Produtos {
  categorias?: Categorias[];
  fornecedores?: Fornecedores[];
}
// ColumnHelper para definição das colunas da tabela.
const columnHelper = createColumnHelper<ListaProdutos>();
const columns = [
  //Helper para o nome do produto.
  columnHelper.accessor("nome_produto", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Produto
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
  //Helper para o preço do produto.
  columnHelper.accessor("preco", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Preço
        <FaArrowRightArrowLeft className="ml-2 h-4 w-4 rotate-90" />
      </Button>
    ),
    enableSorting: true,
    cell: (info) => (
      <div className="flex items-center gap-2">
        <FaMoneyBills />
        R$ {info.getValue()}
      </div>
    ),
  }),
  //Helper para o estoque do produto.
  columnHelper.accessor("estoque", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Estoque
        <FaArrowRightArrowLeft className="ml-2 h-4 w-4 rotate-90" />
      </Button>
    ),
    cell: (info) => (
      <div className="flex items-center gap-2">
        <FaBox />
        {info.getValue()}
      </div>
    ),
  }),
  //Helper para a lista de categorias do produto.
  columnHelper.accessor("categorias", {
    header: "Categorias",
    enableSorting: false,
    cell: (info) => {
      const value = info.getValue();
      if (Array.isArray(value) && value.length > 0) {
        if (value.length == 1) {
          return (
            <div className={buttonVariants({ variant: "ghost" })}>
              {value[0].nome_categoria}
            </div>
          );
        } else
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}
              >
                Lista
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4">
                <DropdownMenuLabel className="text-center">
                  Categorias
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {value.map((categoria: Categorias, index) => {
                  return (
                    <DropdownMenuItem key={index}>
                      <span>{categoria.nome_categoria}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
      }
    },
  }),
  //Helper para submenu de fornecedores..
  columnHelper.accessor("fornecedores", {
    header: "Fornecedores",
    enableSorting: false,
    cell: (info) => {
      const value = info.getValue();
      if (Array.isArray(value) && value.length > 0) {
        if (value.length == 1) {
          return (
            <div className={buttonVariants({ variant: "ghost" })}>
              {value[0].nome_empresa}
            </div>
          );
        } else
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}
              >
                Lista
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4">
                <DropdownMenuLabel className="text-center">
                  Fornecedores
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {value.map((fornecedor: Fornecedores, index) => {
                  return (
                    <DropdownMenuSub key={index}>
                      <DropdownMenuSubTrigger>
                        <span>{fornecedor.nome_empresa}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="flex flex-col items-center justify-center">
                          <DropdownMenuItem>
                            <span className="flex items-center">
                              CNPJ:{" "}
                              {fornecedor.cnpj
                                ? fornecedor.cnpj.replace(
                                    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                                    "$1.$2.$3/$4-$5"
                                  )
                                : "Não inserido"}
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
        return <div>Sem Fornecedor</div>;
      }
    },
  }),
];

// Componente contendo uma tabela com as os produtos e suas categorias/fornecedores.
function page() {
  // UseState contendo os dados recebidos via Fetching.
  const [data, setData] = useState<ListaProdutos[]>([]);
  // UseState para apresentar tela de loading.
  const [loading, setLoading] = useState<boolean>(true);
  // UseStates para uso com Tanstack Table.
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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

  //UseEffect para fetching da lista de produtos.
  useEffect(() => {
    const getProdutos = async () => {
      try {
        // Fetching da lista de produtos.
        const response = await fetch("/api/produtos", { method: "GET" });
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
    getProdutos();
  }, []);
  return loading ? (
    <span>Carregando...</span>
  ) : (
    <div className="w-700 max-w-[1000px] h-full min-h-[750px] flex flex-col justify-start max-[700px]:w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filtrar produtos..."
          value={
            (table.getColumn("nome_produto")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nome_produto")?.setFilterValue(event.target.value)
          }
          className="max-w-72"
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
