"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { ToggleStatus } from "@/components/ui/toggle-status"

export type AdditionalCategoryColumn = {
  id: string
  name: string
  maxQtdItems: string
  qtdProducts: string
  qtdAdditionalItems: string
  status: boolean
  order: number
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ToggleStatus url={`/api/additionalItemCategory/${row.original.id}`} status={row.original.status}/>
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
