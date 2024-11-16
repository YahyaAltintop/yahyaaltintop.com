<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    show: {
        type: Object,
        required: true
    },
});

const show = props.show;
</script>

<template>
    <span v-if="show" class="ban-spinner"></span>
</template>

<style scoped>
.ban-spinner {
    font-size: 50px;
    color: var(--color);
}

.ban-spinner:before {
    content: '';
    animation: 3s print linear alternate forwards;
}

.ban-spinner:after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translatey(-45%);
    animation: 1s blink steps(2) infinite;
}

@keyframes blink {
    0% {
        visibility: hidden;
    }

    100% {
        visibility: visible;
    }
}

@keyframes print {
    0% {
        content: 'H'
    }

    10% {
        content: 'Ho'
    }

    20% {
        content: 'Hoş'
    }

    30% {
        content: 'Hoşç'
    }

    40% {
        content: 'Hoşça'
    }

    50% {
        content: 'Hoşçak'
    }

    60% {
        content: 'Hoşçaka'
    }

    70% {
        content: 'Hoşçakal'
    }

    80% {
        content: 'Hoşçakalı'
    }

    85% {
        content: 'Hoşçakalın'
    }

    90% {
        content: 'Hoşçakalın.'
    }

    95% {
        content: 'Hoşçakalın..'
    }

    100% {
        content: 'Hoşçakalın...'
    }
}
</style>