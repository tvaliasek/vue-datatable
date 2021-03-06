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
                <b-btn
                    variant="primary"
                    @click.prevent="detail = null"
                >
                    Close
                </b-btn>
            </div>
        </div>

        <data-table
            :auto-update="false"
            :header="header"
            :loading="loading"
            :data="dataset"
            :buttons="buttons"
            lang="en_US"
            :paging="true"
            @detail="onDetail"
        />
    </div>
</template>

<script>
import axios from 'axios'
const DATASET_URL = 'https://www.govtrack.us/api/v2/role?current=true&role_type=senator'

export default {
    name: 'App',
    data () {
        return {
            loading: true,
            dataset: [],
            detail: null
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
                    filterable: true
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
                    }
                }
            ]
        },
        buttons () {
            return [
                {
                    event: 'detail',
                    variant: 'primary',
                    text: 'Detail'
                }
            ]
        }
    },
    mounted () {
        this.loadDataset()
    },
    methods: {
        loadDataset () {
            this.loading = true
            this.dataset = []
            axios.get(DATASET_URL)
                .then((response) => {
                    this.dataset = [...response.data.objects]
                }).catch((error) => {
                    alert(error.message)
                }).finally(() => {
                    this.$nextTick(() => { this.loading = false })
                })
        },
        onDetail (rowData) {
            this.detail = rowData
        }
    }
}
</script>
