<template>
    <th>
        <a @click.prevent="onSort" href="javascript:void(0);" class="d-block mb-1">
            <bs-icon v-show="sortable" :icon="sortIconName"/> {{ text }}
        </a>
    </th>
</template>

<script>
import bsIcon from '../Icons/bsIcon.vue'

export default {
    name: 'DataHeaderCell',
    components: {
        bsIcon
    },
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
        }
    },
    computed: {
        sortIconName () {
            if (this.sort === this.dataField) {
                return (this.sortDirection === 'ASC') ? 'arrow-down' : 'arrow-up'
            }
            return 'arrows-expand'
        }
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
