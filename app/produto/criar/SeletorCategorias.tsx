"use client";
import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Categorias } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

// Interface para lidar com a seleção das categorias.
interface SelectCategorias extends Categorias {
  select: boolean;
}
// ColumnHelper para a definição do funcionamento da tabela.
const columnHelper = createColumnHelper<SelectCategorias[]>();
const columns = [
  columnHelper.accessor("select", {
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar categoria."
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("nome_categoria", {
    header: ({ column }) => (
      <Button
        type="button"
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
    cell: ({ row }) => <div>{row.getValue("nome_categoria")}</div>,
  }),
  columnHelper.accessor("id", {}),
];

// Componente contendo uma tabela de categorias, sendo possível realizar a seleção das mesmas.
function SeletorCategoria({
  categoriaSelecionada,
}: {
  categoriaSelecionada: (categorias: Categorias[]) => void;
}) {
  // useStates para o funcionamento da tabela.
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // useState contendo os dados recebidos da API e useState para loading.
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Instancia da tabela.
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 4 },
      columnVisibility: { id: false },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
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

  // useEffect para fazer o update da seleção de categorias.
  // Necessário visto que a implementação no onChange das checkbox apresenta certo delay na atualização dos estados.
  useEffect(() => {
    // Utiliza o modelo de seleção para iterar através de cada Row selecionada.
    // Cria objetos contendo id e nome da categoria selecionada a variavel.
    // Altera os dados do formulário através da função passada como prop.
    const categoriasSel: Categorias[] = table
      .getSelectedRowModel()
      .flatRows.map((row) => ({
        id: row.getValue("id") ?? "",
        nome_categoria: row.getValue("nome_categoria") ?? "",
      }));
    categoriaSelecionada(categoriasSel);
  }, [table.getSelectedRowModel()]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-around">
      <div className="flex items-center py-4 w-2/3">
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
      <div className="rounded-md border h-[410px] w-2/3">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  {loading ? "LOADING..." : "No Results"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} categoria(s) selecionadas.
        </div>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            type="button"
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
  );
}
export default SeletorCategoria;
