<template>
    <td class="whitespace-nowrap __datatable-actions">
        <div
            v-if="confirm === null"
            class="d-flex gap-1 align-items-center align-content-center"
            :class="props.actionsOnLeft ? 'justify-content-start' : 'justify-content-end'"
        >
            <template
                v-for="(button, index) in buttonsList"
                :key="`button-${index}${button?.event ?? ''}`"
            >
                <button
                    v-if="(!button?.customComponent && !button?.href && !button?.hrefCallback)"
                    :class="[
                        'btn btn-sm',
                        `btn-${button.variant ?? 'primary'}`,
                        {
                            'btn-disabled': disableButtons || runningActions.includes(String(button.event))
                        }
                    ]"
                    @click.prevent="onButtonClick(button)"
                    :disabled="disableButtons"
                >
                    <template v-if="button.customTextComponent">
                        <component
                            :is="(typeof button.customTextComponent === 'function') ? button.customTextComponent() : button.customTextComponent"
                            v-bind="button.customTextComponentProps ?? {}"
                        />
                    </template>
                    <template v-if="button.text">{{ button.text }}</template>
                </button>
                <a
                    v-if="(!button?.customComponent && (button?.href || button?.hrefCallback))"
                    :class="[
                        'btn btn-sm',
                        `btn-${button.variant ?? 'primary'}`,
                        {
                            'btn-disabled': disableButtons || runningActions.includes(String(button.event))
                        }
                    ]"
                    :href="resolveButtonHref(button)"
                    @click.prevent="onButtonClick(button)"
                >
                    <template v-if="button.customTextComponent">
                        <component
                            :is="(typeof button.customTextComponent === 'function') ? button.customTextComponent() : button.customTextComponent"
                            v-bind="button.customTextComponentProps ?? {}"
                        />
                    </template>
                    <template v-if="button.text">{{ button.text }}</template>
                </a>
                <component
                    v-if="button?.customComponent"
                    :is="typeof button.customComponent === 'string' ? button.customComponent : button.customComponent()"
                    :row="row"
                    @action="onAction"
                />
            </template>
        </div>
        <div class="d-flex flex-wrap flex-direction-column justify-content-center align-items-center align-content-center gap-2" v-else>
            <p class="mb-0 w-100 text-center">{{confirm.confirmText}}</p>
            <div class="d-flex justify-content-center align-content-center align-items-center flex-wrap gap-2">
                <button
                    class="btn btn-sm btn-primary"
                    @click.prevent="onConfirm"
                >
                    {{i18n.buttonConfirmOk}}
                </button>
                <button
                    class="btn btn-sm btn-danger"
                    @click.prevent="onCancel"
                >
                    {{i18n.buttonConfirmCancel}}
                </button>
            </div>
        </div>
    </td>
</template>

<script setup lang="ts" generic="TRowData extends Record<string, any> = Record<string, any>">
import type { ActionButtonDefinition, ProcessedRowData, RouterRouteDefinition } from '../interfaces'
import { ref, computed, getCurrentInstance } from 'vue'

/** Minimal interface covering the vue-router methods we need. */
interface VueRouter {
    push: (location: RouterRouteDefinition) => Promise<unknown>
    resolve: (location: RouterRouteDefinition) => { href: string }
}

// Detect Vue Router at setup time without requiring it as a hard dependency.
const router: VueRouter | null
    = (getCurrentInstance()?.appContext?.config?.globalProperties?.$router as VueRouter | undefined) ?? null

function isRouteDefinition(value: unknown): value is RouterRouteDefinition {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const props = withDefaults(defineProps<{
    actionsOnLeft?: boolean
    row: ProcessedRowData<TRowData>
    buttons: ActionButtonDefinition<TRowData>[]
    i18n: Record<string, string>
    disableButtons: boolean
    runningActions: string[]
}>(), {
    actionsOnLeft: false,
    buttons: () => [],
    disableButtons: false,
    runningActions: () => []
})

const $emit = defineEmits(['action'])

const confirm = ref<ActionButtonDefinition<TRowData> | null>(null)

const buttonsList = computed(() => {
    return props.buttons.filter((item) => {
        return (typeof item.visibleIf === 'function') ? item.visibleIf(props.row) : true
    })
})

function onConfirm(): void {
    if (confirm.value === null) {
        return
    }
    emitButtonAction(confirm.value)
    onCancel()
}

function onCancel(): void {
    confirm.value = null
}

function onButtonClick(button: ActionButtonDefinition<TRowData>): void {
    if (button?.confirm === true) {
        confirm.value = button
    } else {
        emitButtonAction(button)
    }
}

function onAction(data: { event: string, row: Record<string, any> }): void {
    $emit('action', data)
}

/**
 * Resolves the href string to set on the <a> element.
 * If hrefCallback returns a route definition object, the route is resolved via
 * Vue Router so that the browser can still display (and copy) the full URL.
 * Throws if the router is unavailable and a route definition is returned.
 */
function resolveButtonHref(button: ActionButtonDefinition<TRowData>): string | undefined {
    if (typeof button.hrefCallback === 'function') {
        const result = button.hrefCallback(props.row)
        if (result === undefined) {
            return undefined
        }
        if (typeof result === 'string') {
            return result
        }
        // Route definition object
        if (router === null) {
            throw new Error(
                '[vue-datatable] hrefCallback returned a route definition object but '
                + 'Vue Router is not installed or not available in this application.'
            )
        }
        return router.resolve(result).href
    }
    return button.href
}

function emitButtonAction(button: ActionButtonDefinition<TRowData>): void {
    if (typeof button.event === 'string') {
        $emit('action', {
            eventId: `${button.event}-${(new Date()).valueOf()}`,
            event: button.event,
            row: props.row.row
        })
    }

    if (typeof button?.href === 'string') {
        window.location.href = button.href
    }

    if (typeof button?.hrefCallback === 'function') {
        const result = button.hrefCallback(props.row)
        if (result === undefined) {
            return
        }
        if (typeof result === 'string') {
            window.location.href = result
        } else if (isRouteDefinition(result)) {
            // Route definition – use router.push so the page is not reloaded.
            if (router === null) {
                throw new Error(
                    '[vue-datatable] hrefCallback returned a route definition object but '
                    + 'Vue Router is not installed or not available in this application.'
                )
            }
            router.push(result)
        }
    }
}
</script>
