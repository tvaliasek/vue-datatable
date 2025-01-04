<template>
    <td :class="{ 'text-end': !actionsOnLeft, 'whitespace-nowrap __datatable-actions': true }">
        <div v-if="confirm === null">
            <template
                v-for="(button, index) in buttonsList"
                :key="`button-${index}${button.event}`"
            >
                <BButton
                    v-if="button.customComponent === undefined"
                    :size="'sm'"
                    :class="'me-1'"
                    :variant="button.variant"
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
                </BButton>
                <component
                    v-else
                    :is="typeof button.customComponent === 'string' ? button.customComponent : button.customComponent()"
                    :row="row"
                    @action="onAction"
                />
            </template>
        </div>
        <div class="whitespace-nowrap text-center" v-else>
            <p class="mb-0">{{confirm.confirmText}}</p>
            <p class="whitespace-nowrap mb-0">
                <BButton
                    size="sm"
                    variant="primary"
                    @click.prevent="onConfirm"
                    class="me-1"
                >
                    {{i18n.buttonConfirmOk}}
                </BButton>
                <BButton
                    size="sm"
                    variant="danger"
                    class="me-1"
                    @click.prevent="onCancel"
                >
                    {{i18n.buttonConfirmCancel}}
                </BButton>
            </p>
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
    $emit('action', {
        eventId: `${button.event}-${(new Date()).valueOf()}`,
        event: button.event,
        row: props.row.row
    })
}
</script>
