<template>
    <div ref="alertEl" v-if="showAlert" class="illegal-action-alert alert alert-danger" role="alert">
        <span class="alert-icon material-symbols-rounded">warning</span>
        <div class="alert-text">{{ alertText }}</div>
        <button class="alert-close-button btn-close" aria-label="close" @click="hideAlert"></button>
    </div>
</template>

<script>
import { nextTick } from "vue";
import Events from "@/assets/javascript/events";
import PauseableTimeout from "@/assets/javascript/pauseable-timeout";

export default {
    name: "Alerts",

    data() {
        return {
            showAlert: false,
            alertText: "",
            alertTimer: null,
            alertAnimation: null
        };
    },

    props: {
        studySetup: Boolean
    },

    methods: {
        async showIllegalActionAlert() {
            if (this.showAlert) {
                this.resetTimer();
                return;
            }

            this.alertText = "This action cannot be currently performed.";
            if (this.studySetup) {
                this.alertText = "This action cannot be performed in this part of the study.";
            }

            this.showAlert = true;
            await nextTick();

            this.$refs.alertEl.addEventListener("mouseenter", () => this.alertTimer?.pause());
            this.$refs.alertEl.addEventListener("mouseleave", () => this.alertTimer?.resume());
            this.alertTimer = new PauseableTimeout(this.hideAlert, 4 * 1000);

            this.alertAnimation = this.$refs.alertEl.animate([
                {}, {backgroundColor: "#E9818A", borderColor: "#E9818A", offset: 0.2}, {}
            ], {
                easing: "ease",
                duration: 400
            });
            this.alertAnimation.cancel();
        },

        resetTimer() {
            this.alertTimer.clearTimeout();
            this.alertTimer = new PauseableTimeout(this.hideAlert, 4 * 1000);
            this.alertAnimation.cancel();
            this.alertAnimation.play();
        },

        hideAlert() {
            if (!this.showAlert) {
                return;
            }

            this.$refs.alertEl.style.opacity = "0";
            this.alertTimer.clearTimeout();
            this.alertTimer = null;
            this.alertAnimation = null;

            setTimeout(() => {
                this.showAlert = false;
                this.alertText = "";
            }, 200);
        }
    },

    mounted() {
        this.$eventBus.$on(Events.ILLEGAL_ACTION, this.showIllegalActionAlert);
    },

    beforeUnmount() {
        this.$eventBus.$off(Events.ILLEGAL_ACTION, this.showIllegalActionAlert);
    }
};
</script>

<style scoped>
.illegal-action-alert {
    font-size: 1.05rem;
    font-weight: 500;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);

    display: flex;
    flex-direction: row;

    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;

    transition: opacity 0.18s;
}

.alert-icon {
    margin-right: 0.6rem;
    font-size: 1.5em;
}

.alert-close-button {
    margin-left: 2.5rem;
}
</style>
