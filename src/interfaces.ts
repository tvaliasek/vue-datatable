import type { Component } from 'vue'

type IsGenericRecord<T> = string extends keyof T ? true : false

/**
 * Produces a union of all dot-notation key paths for a given type T.
 * Falls back to `string` when T is a generic Record<string, any>.
 */
export type DotPaths<T extends Record<string, any>>
    = IsGenericRecord<T> extends true
        ? string
        : {
                [K in keyof T & string]: T[K] extends Array<any>
                    ? K
                    : T[K] extends Record<string, any>
                        ? K | `${K}.${DotPaths<T[K]>}`
                        : K
            }[keyof T & string]

export type SortDirection = 'ASC' | 'DESC' | null

export interface ColumnDefinition<
    T extends Record<string, any> = Record<string, any>
> {
    text: string
    data: DotPaths<T>
    sortable?: boolean
    filterable?: boolean
    filterCaseSensitive?: boolean
    format?: (value: any, row: ProcessedRowData<T>) => any
    sortFn?: (a: any, b: any) => number
    filterFn?: (cellValue: any, filterValue: string, rowData: ProcessedRowData<T>) => boolean
    customComponent?: () => Component
    cellStyle?: string | ((index: string, content: any, row: ProcessedRowData<T>) => string | Record<string, string>)
    cellClassnames?: string[]
    aggregate?: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => unknown
    aggregateInitialValue?: any
    aggregateText?: string
    clickToSelect?: boolean
}

export interface DisplayConfig<
    T extends Record<string, any> = Record<string, any>
> {
    currentPage: number
    currentPageLimit: number
    filter: Partial<Record<DotPaths<T>, string>>
    sortBy: DotPaths<T> | null
    sortDirection: SortDirection
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
