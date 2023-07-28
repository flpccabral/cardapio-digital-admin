"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type AdditionalCategoryColumn = {
  id: string
  name: string
  maxQtdItems: string
  qtdProducts: string
  qtdAdditionalItems: string
}

export const columns: ColumnDef<AdditionalCategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "maxQtdItems",
    header: "Até qts itens",
  },
  {
    accessorKey: "qtdProducts",
    header: "Qtd de produtos",
  },
  {
    accessorKey: "qtdAdditionalItems",
    header: "Qtd de itens adiconais",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
