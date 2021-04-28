<template>
    <td :class="{ 'text-right': !actionsOnLeft, 'whitespace-nowrap __datatable-actions': true }">
        <div v-if="confirm === null">
            <b-btn
                v-for="button in buttonsList"
                :key="`button-${button.event}`"
                size="sm"
                class="ml-1"
                :variant="button.variant"
                @click.prevent="onButtonClick(button)"
                :disabled="disableButtons"
            >
                {{ button.text }}
            </b-btn>
        </div>
        <div class="whitespace-nowrap text-center" v-else>
            <p class="mb-0">{{confirm.confirmText}}</p>
            <p class="whitespace-nowrap mb-0">
                <b-btn
                    size="sm"
                    variant="primary"
                    @click.prevent="onConfirm"
                    class="ml-1"
                >
                    {{i18n.buttonConfirmOk}}
                </b-btn>
                <b-btn
                    size="sm"
                    variant="danger"
                    class="ml-1"
                    @click.prevent="onCancel"
                >
                    {{i18n.buttonConfirmCancel}}
                </b-btn>
            </p>
        </div>
    </td>
</template>

<script>
export default {
    name: 'DataRowButtons',
    props: {
        actionsOnLeft: {
            type: Boolean,
            required: false,
            default: false
        },
        row: {
            type: Object,
            required: true
        },
        buttons: {
            type: Array,
            required: false,
            default () {
                return []
            }
        },
        i18n: {
            type: Object,
            required: true
        },
        disableButtons: {
            type: Boolean,
            required: false,
            default: false
        },
        runningActions: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data () {
        return {
            confirm: null,
            eventIds: []
        }
    },
    computed: {
        buttonsList () {
            return this.buttons.filter((item) => {
                return (typeof item.visibleIf === 'function') ? item.visibleIf(this.row) : true
            }).map((item) => {
                /*
                const newItem = {
                    ...item,
                    disabled: this.disableButtons === true,
                    actionRunning: false
                }
                if (item.watchProcessing) {
                    @todo
                }

                watchProcessing: true,
                disableOnProcessing: true,
                visibleIf (row) {
                    return !row.active
                }
                */

                return item
            })
        }
    },
    methods: {
        onConfirm () {
            this.emitButtonAction(this.confirm)
            this.onCancel()
        },
        onCancel () {
            this.confirm = null
        },
        onButtonClick (button) {
            if (button.confirm) {
                this.confirm = button
            } else {
                this.emitButtonAction(button)
            }
        },
        emitButtonAction (button) {
            this.$emit('action', {
                eventId: `${button.event}-${(new Date()).valueOf()}`,
                event: button.event,
                row: this.row.row
            })
        }
    }
}
</script>
