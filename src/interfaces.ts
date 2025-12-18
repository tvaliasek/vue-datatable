import type { Component } from 'vue'

export interface ColumnDefinition<T extends Record<string, any> | undefined = undefined> {
    text: string
    data: T extends undefined ? string : keyof T
    sortable?: boolean
    filterable?: boolean
    format?: (value: any, row: Record<string, any>) => any
    sortFn?: (a: any, b: any) => number
    filterFn?: (cellValue: any, filterValue: string, rowData: ProcessedRowData) => boolean
    customComponent?: () => Component
    cellStyle?: string | ((index: string, content: any, row: Record<string, any>) => string | Record<string, string>)
    cellClassnames?: string[]
    aggregate?: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => unknown
    aggregateInitialValue?: any
    aggregateText?: string
    clickToSelect?: boolean
}

export interface ActionButtonDefinition {
    text?: string
    event?: string
    variant?: string
    confirm?: boolean
    confirmText?: string
    customComponent?: string | (() => Component)
    visibleIf?: (row: ProcessedRowData) => boolean
    customTextComponent?: string | CallableFunction
    customTextComponentProps?: Record<string, any>
    href?: string
    hrefCallback?: (row: ProcessedRowData) => string | undefined
}

export interface ProcessedCell {
    index: string
    content: any
    customComponent?: string | Component | boolean
    cellStyle?: string | Record<string, string>
    cellClassnames?: string[]
    clickToSelect?: boolean
}

export interface ProcessedRowData {
    row: Record<string, any>
    isSelected: boolean
    cells: ProcessedCell[]
}

type BaseButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
type OutlineButtonVariant = `outline-${BaseButtonVariant}`

export type ButtonVariant = BaseButtonVariant | OutlineButtonVariant
