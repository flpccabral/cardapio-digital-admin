"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type AdditionalItemColumn = {
  id: string
  name: string
  price: string
  status: boolean
  qtdAdditionalItemCategory: string
}

export const columns: ColumnDef<AdditionalItemColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "qtdAdditionalItemCategory",
    header: "Qtd de categorias",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
