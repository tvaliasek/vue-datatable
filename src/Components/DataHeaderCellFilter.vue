<template>
    <b-form-input
        size="sm"
        v-model="localFilterValue"
        :placeholder="i18n.search"
    />
</template>

<script>
export default {
    name: 'DataHeaderCellFilter',
    props: {
        i18n: {
            type: Object,
            required: true
        },
        dataField: {
            type: String,
            required: true
        },
        filter: {
            type: Object,
            required: false
        }
    },
    data () {
        return {
            tm: null,
            localFilterValue: ((this.filter.hasOwnProperty(this.dataField)) ? (this.filter[this.dataField] || '') : '')
        }
    },
    computed: {
        filterValue: {
            get () {
                if (this.filter.hasOwnProperty(this.dataField)) {
                    return this.filter[this.dataField] || ''
                }
                return ''
            },
            set (value) {
                const filter = JSON.parse(JSON.stringify(this.filter))
                filter[this.dataField] = `${value}`
                this.$emit('filter', filter)
            }
        }
    },
    watch: {
        localFilterValue (newValue) {
            const value = `${newValue}`
            window.clearTimeout(this.tm)
            window.setTimeout(() => {
                this.filterValue = value
            }, 500)
        }
    },
    beforeUnmount () {
        window.clearTimeout(this.tm)
    }
}
</script>
