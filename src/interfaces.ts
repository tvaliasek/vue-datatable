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

export interface DisplayConfig {
    currentPage: number
    currentPageLimit: number
    filter: Record<string, any>
    sortBy: string | null
    sortDirection: null | 'ASC' | 'DESC'
}

/**
 * A subset of vue-router's RouteLocationRaw that allows returning a named or
 * path-based route definition from hrefCallback without requiring vue-router to
 * be listed as a hard dependency of this library.
 */
export interface RouterRouteDefinition {
    name?: string | symbol
    path?: string
    params?: Record<string, string | string[]>
    query?: Record<string, string | string[] | null | undefined>
    hash?: string
}

export interface ActionButtonDefinition<TRowData extends Record<string, any> = Record<string, any>> {
    text?: string
    event?: string
    variant?: string
    confirm?: boolean
    confirmText?: string
    customComponent?: string | (() => Component)
    visibleIf?: (row: ProcessedRowData<TRowData>) => boolean
    customTextComponent?: string | CallableFunction
    customTextComponentProps?: Record<string, any>
    href?: string
    /**
     * Return a plain string for a direct href navigation, or a
     * RouterRouteDefinition object to resolve & navigate via Vue Router.
     * When a RouterRouteDefinition is returned, Vue Router must be installed
     * in the host application or an error will be thrown at runtime.
     */
    hrefCallback?: (row: ProcessedRowData<TRowData>) => string | RouterRouteDefinition | undefined
}

export interface ProcessedCell {
    index: string
    content: any
    customComponent?: string | Component | boolean
    cellStyle?: string | Record<string, string>
    cellClassnames?: string[]
    clickToSelect?: boolean
}

export interface ProcessedRowData<TRow extends Record<string, any> = Record<string, any>> {
    row: TRow
    isSelected: boolean
    cells: ProcessedCell[]
}

type BaseButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
type OutlineButtonVariant = `outline-${BaseButtonVariant}`

export type ButtonVariant = BaseButtonVariant | OutlineButtonVariant
