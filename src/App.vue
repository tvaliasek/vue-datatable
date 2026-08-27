<template>
    <div class="container py-5">
        <h1>DataTable usage example</h1>
        <hr />

        <div
            v-if="detail !== null"
            class="card mb-5"
        >
            <div class="card-body">
                <h4 class="card-title">
                    Detail of {{ detail.person.name }}
                </h4>
                <pre class="p-4 bg-light font-weight-bold">{{ JSON.stringify(detail, null, 4) }}</pre>
            </div>
            <div class="card-footer">
                <button
                    class="btn btn-primary"
                    @click.prevent="detail = null"
                >
                    Close
                </button>
            </div>
        </div>
        <p>Selected rows: {{ selected.length }}</p>
        <div class="mb-3 d-flex gap-2">
            <button
                class="btn btn-warning btn-sm"
                @click.prevent="dataset = dataset.slice(0, 3)"
            >
                shrink to 3 rows
            </button>
            <button
                class="btn btn-danger btn-sm"
                @click.prevent="dataset = []"
            >
                shrink to 0 rows
            </button>
            <button
                class="btn btn-secondary btn-sm"
                @click.prevent="loadDataset()"
            >
                reload (sets loading + empties data)
            </button>
        </div>
        <DataTable
            v-model="selected"
            :auto-update="true"
            :auto-update-limit="5"
            :header="header"
            :loading="loading"
            :data="dataset"
            :buttons="buttons"
            lang="en_US"
            :paging="true"
            :actions-on-left="false"
            :selectable-rows="true"
            :selectable-rows-checkboxes="true"
            :selectable-rows-track-by="'person.pvsid'"
            :selectable-rows-class="'bg-primary text-white font-weight-bold'"
            :exportable="true"
            :state-saving="true"
            :state-saving-unique-key="'table'"
            :row-class="(row) => (row.party === 'Democrat') ? 'border-primary' : null"
            :initial-display-config="initialDisplayConfig"
            @detail="onDetail"
            @export="onExport"
            @refresh="onRefresh"
        />
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import CustomButton from './CustomButton.vue'
import CustomCell from './CustomCell.vue'
import { computed, nextTick, onMounted, ref } from 'vue'
import DataTable from './DataTable.vue'
import { type ActionButtonDefinition, type ColumnDefinition, type DisplayConfig } from './interfaces'
const DATASET_URL = 'https://www.govtrack.us/api/v2/role?current=true&role_type=senator'

type Senator = {
    person: {
        name: string
    }
    party: string
    startdate: string
    enddate: string
    congress_numbers: number[] | string
}

const initialDisplayConfig: Partial<DisplayConfig<Senator>> = {
    sortBy: 'person.name',
    sortDirection: 'DESC'
}

const loading = ref(true)
const dataset = ref<Senator[]>([])
const detail = ref<Senator | null>(null)
const selected = ref<Senator[]>([])
const dataset2 = ref<Senator[]>([])

const header = computed<ColumnDefinition<Senator>[]>(() => {
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
            customComponent() {
                return CustomCell
            }
        },
        {
            text: 'Start date',
            data: 'startdate',
            sortable: true,
            filterable: true,
            format: (value: string) => {
                return (new Date(value)).toLocaleDateString()
            }
        },
        {
            text: 'End date',
            data: 'enddate',
            sortable: true,
            filterable: true,
            format(value: string) {
                return (new Date(value)).toLocaleDateString()
            }
        },
        {
            text: 'Congress numbers',
            data: 'congress_numbers',
            sortable: true,
            filterable: true,
            format(value: string[] | string) {
                return (Array.isArray(value) ? value.join(', ') : `${value}`)
            },
            aggregateText: 'Total: ',
            aggregate(accumulator: number, currentValue: Senator, index: number, array: Senator[]) {
                void index
                void array

                return accumulator + (Array.isArray(currentValue.congress_numbers) ? currentValue.congress_numbers.length : 0)
            },
            aggregateInitialValue: 0
        }
    ]
})

const buttons = computed<ActionButtonDefinition<Senator>[]>(() => {
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
            customComponent() {
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
            hrefCallback(row: { row: Senator }) {
                void row
                return '/test/foo'
            },
            variant: 'primary'
        }
    ]
})

onMounted(() => {
    loadDataset()
})
function onRefresh(): void {
    console.log('Refreshing...')
}

function loadDataset(): void {
    loading.value = true
    dataset.value = []
    axios.get(DATASET_URL)
        .then((response) => {
            dataset.value = [...response.data.objects]
            dataset2.value = [...response.data.objects]
        }).catch((error) => {
            alert(error.message)
        }).finally(() => {
            void nextTick(() => {
                loading.value = false
            })
        })
}

function onDetail(rowData: Senator): void {
    detail.value = rowData
}

function onExport(data: Senator[]): void {
    console.log(data)
}
</script>
