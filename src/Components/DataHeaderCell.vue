<template>
    <th>
        <a @click.prevent="onSort" href="javascript:void(0);" class="d-block mb-1">
            <b-icon v-show="sortable" :icon="sortIconName"/> {{ text }}
        </a>
        <b-form-input
            size="sm"
            v-if="filterable"
            v-model="localFilterValue"
            :placeholder="i18n.search"
        />
    </th>
</template>

<script>
export default {
    name: 'DataHeaderCell',
    props: {
        i18n: {
            type: Object,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        dataField: {
            type: String,
            required: true
        },
        sort: {
            type: String,
            required: false
        },
        sortable: {
            type: Boolean,
            required: false,
            default: false
        },
        sortDirection: {
            type: String,
            required: false
        },
        filter: {
            type: Object,
            required: false
        },
        filterable: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data () {
        return {
            tm: null,
            localFilterValue: ((this.filter.hasOwnProperty(this.dataField)) ? (this.filter[this.dataField] || '') : '')
        }
    },
    computed: {
        sortIconName () {
            if (this.sort === this.dataField) {
                return (this.sortDirection === 'ASC') ? 'arrow-down' : 'arrow-up'
            }
            return 'arrows-expand'
        },
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
    beforeDestroy () {
        window.clearTimeout(this.tm)
    },
    methods: {
        onSort () {
            if (this.sortable === true) {
                this.$emit('sort', `${this.dataField}`)
            }
        }
    }
}
</script>
