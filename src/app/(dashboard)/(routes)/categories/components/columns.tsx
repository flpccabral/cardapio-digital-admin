"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  createdAt: string
  qtdProducts: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "createdAt",
    header: "Criado",
  },
  {
    accessorKey: "qtdProducts",
    header: "Qtd de Produtos",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
