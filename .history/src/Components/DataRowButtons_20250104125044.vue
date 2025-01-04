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
                    v-if="(!button.customComponent && !button?.href && typeof button.hrefCallback !== 'function')"
                    :class="[
                        'btn btn-sm',
                        `btn-${button.variant ?? 'primary'}`,
                        {
                            'btn-disabled': disableButtons || runningActions.includes(button.event)
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
                    v-if="(!button.customComponent && (button?.href || typeof button.hrefCallback === 'function'))"
                    :class="[
                        'btn btn-sm',
                        `btn-${button.variant ?? 'primary'}`,
                        {
                            'btn-disabled': disableButtons || runningActions.includes(button.event)
                        }
                    ]"
                    :href="(typeof button.hrefCallback === 'function') ? button.hrefCallback(row) : button.href"
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
                    v-if="['string' | 'function'].includes(typeof button.customComponent)"
                    :is="typeof button.customComponent === 'string' ? button.customComponent : button.customComponent()"
                    :row="row"
                    @action="onAction"
                />
            </template>
        </div>
        <div class="d-flex flex-wrap justify-content-center align-items-center align-content-center gap-2" v-else>
            <p class="mb-0 w-100">{{confirm.confirmText}}</p>
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
    </td>
</template>

<script setup lang="ts">
import type { ActionButtonDefinition, ProcessedRowData } from '../interfaces'
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
    actionsOnLeft?: boolean
    row: ProcessedRowData
    buttons: ActionButtonDefinition[]
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

const confirm = ref<ActionButtonDefinition | null>(null)

const buttonsList = computed(() => {
    return props.buttons.filter((item) => {
        return (typeof item.visibleIf === 'function') ? item.visibleIf(props.row) : true
    })
})

function onConfirm (): void {
    if (confirm.value === null) {
        return
    }
    emitButtonAction(confirm.value)
    onCancel()
}

function onCancel (): void {
    confirm.value = null
}

function onButtonClick (button: ActionButtonDefinition): void {
    if (button?.confirm === true) {
        confirm.value = button
    } else {
        emitButtonAction(button)
    }
}

function onAction (data: { event: string, row: Record<string, any> }): void {
    $emit('action', data)
}

function emitButtonAction (button: ActionButtonDefinition): void {
    if (typeof button.event === 'string') {
        $emit('action', {
            eventId: `${button.event}-${(new Date()).valueOf()}`,
            event: button.event,
            row: props.row.row
        })
    }

    if (typeof button?.href === 'string') {
        window.location = button.href
    }

    if (typeof button?.hrefCallback === 'function') {
        const href = button.hrefCallback(props.row)
        if (typeof href === 'string') {
            window.location = href
        }
    }
}
</script>
