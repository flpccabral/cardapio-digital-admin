"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/ui/toggle-status"

export type CategoryColumn = {
  id: string
  name: string
  createdAt: string
  qtdProducts: string
  status: boolean;
  order: number;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Criado",
  // },
  {
    accessorKey: "qtdProducts",
    header: "Qtd de Produtos",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus url={`/api/category/${row.original.id}`} status={row.original.status}/>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
