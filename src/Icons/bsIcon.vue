<template>
    <component :is="component" />
</template>

<script>
import bsIconArrowDown from './bsIconArrowDown.vue'
import bsIconArrowsExpand from './bsIconArrowsExpand.vue'
import bsIconArrowRepeat from './bsIconArrowRepeat.vue'
import bsIconArrowUp from './bsIconArrowUp.vue'
import bsIconPause from './bsIconPause.vue'

export default {
    name: 'bsIcon',
    props: {
        icon: {
            type: String,
            required: true
        }
    },
    components: {
        bsIconArrowDown,
        bsIconArrowsExpand,
        bsIconArrowRepeat,
        bsIconArrowUp,
        bsIconPause
    },
    computed: {
        component () {
            switch (`${this.icon}`.toLowerCase()) {
                case 'arrow-down':
                    return bsIconArrowDown
                case 'arrows-expand':
                    return bsIconArrowsExpand
                case 'arrow-repeat':
                    return bsIconArrowRepeat
                case 'arrow-up':
                    return bsIconArrowUp
                case 'pause':
                    return bsIconPause
            }
            return null
        }
    }
}
</script>
