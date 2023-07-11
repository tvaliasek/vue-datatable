<template>
    <div class="container">
        <BiTag />
        <DataTable
            :data="data"
            :header="header"
            :buttons="buttons"
            @tag="onTag"
        />
    </div>
</template>

<script lang="ts" setup>
import TagButton from './Components/TagButton.vue'

defineEmits(['tag'])

const data = [
    {
        person: {
            name: 'John Doe'
        }
    },
    {
        person: {
            name: 'Jane Doe'
        }
    }
]
const header = [
    {
        text: 'Name',
        data: 'person.name',
        sortable: true,
        filterable: true,
        cellClassnames: ['font-weight-bold']
    }
]
const buttons = [
    {
        customComponent: () => TagButton
    }
]

const onTag = (): void => {
    console.log('tag')
}
</script>
