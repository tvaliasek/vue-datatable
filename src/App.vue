<template>
    <div class="container py-5">
        <h1>DataTable usage example</h1>
        <hr/>

        <div
            v-if="detail !== null"
            class="card mb-5"
        >
            <div class="card-body">
                <h4 class="card-title">Detail of {{detail.person.name}}</h4>
                <pre class="p-4 bg-light font-weight-bold">{{JSON.stringify(detail, null, 4)}}</pre>
            </div>
            <div class="card-footer">
                <b-button
                    variant="primary"
                    @click.prevent="detail = null"
                >
                    Close
                </b-button>
            </div>
        </div>
        <p>Selected rows: {{selected.length}}</p>
        <data-table
            :auto-update="true"
            :auto-update-limit="5"
            :header="header"
            :loading="loading"
            :data="dataset"
            :buttons="buttons"
            lang="en_US"
            :paging="true"
            @detail="onDetail"
            :actions-on-left="false"
            :selectable-rows="true"
            :selectable-rows-checkboxes="true"
            :selectable-rows-track-by="'person.pvsid'"
            :selectable-rows-class="'bg-primary text-white font-weight-bold'"
            v-model="selected"
            :exportable="true"
            @export="onExport"
            :state-saving="true"
            :state-saving-unique-key="'table'"
            @refresh="onRefresh"
            :row-class="(row) => (row.party === 'Democrat') ? 'border-primary' : null"
        />
    </div>
</template>

<script>
import axios from 'axios'
import CustomButton from './CustomButton.vue'
import CustomCell from './CustomCell.vue'
const DATASET_URL = 'https://www.govtrack.us/api/v2/role?current=true&role_type=senator'

export default {
    name: 'App',
    data () {
        return {
            loading: true,
            dataset: [],
            detail: null,
            selected: [],
            dataset2: [],
            selected2: []
        }
    },
    computed: {
        header () {
            return [
                {
                    text: 'Name',
                    data: 'person.name',
                    sortable: true,
                    filterable: true,
                    cellClassnames: ['font-weight-bold']
                },
                {
                    text: 'Party',
                    data: 'party',
                    sortable: true,
                    filterable: true,
                    customComponent () {
                        return CustomCell
                    }
                },
                {
                    text: 'Start date',
                    data: 'startdate',
                    sortable: true,
                    filterable: true,
                    format: (value) => {
                        return (new Date(value)).toLocaleDateString()
                    }
                },
                {
                    text: 'End date',
                    data: 'enddate',
                    sortable: true,
                    filterable: true,
                    format (value) {
                        return (new Date(value)).toLocaleDateString()
                    }
                },
                {
                    text: 'Congress numbers',
                    data: 'congress_numbers',
                    sortable: true,
                    filterable: true,
                    format (value) {
                        return (Array.isArray(value) ? value.join(', ') : `${value}`)
                    },
                    aggregateText: 'Total: ',
                    aggregate (accumulator, currentValue, index, array) {
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        return accumulator + (Array.isArray(currentValue.congress_numbers) ? currentValue.congress_numbers.length : 0)
                    },
                    aggregateInitialValue: 0
                }
            ]
        },
        buttons () {
            return [
                {
                    event: 'detail',
                    variant: 'primary',
                    text: 'Detail'
                },
                {
                    event: 'confirm',
                    variant: 'danger',
                    text: 'Delete',
                    confirm: true,
                    confirmText: 'Are you sure?'
                },
                {
                    customComponent () {
                        return CustomButton
                    }
                },
                {
                    text: 'linkHref',
                    href: '/test',
                    variant: 'info',
                    confirm: true,
                    confirmText: 'Are you sure?'
                },
                {
                    text: 'linkCallback',
                    hrefCallback (row) {
                        return '/test/foo'
                    },
                    variant: 'primary'
                }
            ]
        }
    },
    mounted () {
        this.loadDataset()
    },
    methods: {
        onRefresh () {
            console.log('Refreshing...')
        },
        loadDataset () {
            this.loading = true
            this.dataset = []
            axios.get(DATASET_URL)
                .then((response) => {
                    this.dataset = [...response.data.objects]
                    this.dataset2 = [...response.data.objects]
                }).catch((error) => {
                    alert(error.message)
                }).finally(() => {
                    this.$nextTick(() => { this.loading = false })
                })
        },
        onDetail (rowData) {
            this.detail = rowData
        },
        onExport (data) {
            console.log(data)
        }
    }
}
</script>
