<template>
    <tr :class="{ 'highlight-row': true, '__data-row-selected': row.selected }">
        <component
            v-for="(item, index) in row.cells"
            :key="`rw-${index}`"
            :is="(item.customComponent) ? item.customComponent : 'td'"
            :row="(item.customComponent) ? row.row : undefined"
            :style="(item.cellStyle) ? item.cellStyle : undefined"
            :class="(Array.isArray(item.cellClassnames)) ? item.cellClassnames.join(' ') : undefined"
            @action="onAction"
        >
            {{ item.content }}
        </component>
        <td v-if="actions" class="text-right whitespace-nowrap __datatable-actions">
            <div v-if="confirm === null">
                <b-btn
                    v-for="button in buttons"
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
    </tr>
</template>

<script>
export default {
    name: 'DataRow',
    data () {
        return {
            confirm: null
        }
    },
    props: {
        header: {
            type: Array,
            required: true
        },
        row: {
            type: Object,
            required: true
        },
        actions: {
            type: Boolean,
            required: false,
            default: true
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
        filter: {
            type: Object,
            required: false
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
                event: button.event,
                row: this.row.row
            })
        },
        onAction (data) {
            this.$emit('action', data)
        }
    }
}
</script>

<style lang="scss" scoped>
.highlight-row {
    &:hover, &:focus {
        td, th {
            color: black;
            background-color: rgba(255,127,39, .4)
        }
    }
}

.__data-row-selected {
    td, th {
        color: black !important;
        background-color: rgb(58, 216, 255) !important;
    }
}

.whitespace-nowrap {
    white-space: nowrap;
}
</style>
