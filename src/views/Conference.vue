<template>
  <Page class="league-page-container">
    <Loading v-if="loading" />
    <div
      v-show="!loading"
      ref="jitsi"
      class="jitsi-container"
    />
  </Page>
</template>
<script>
import BrowserWindowMessageConnection from '@aeternity/aepp-sdk/es/utils/aepp-wallet-communication/connection/browser-window-message';
import JitsiMeetExternalAPI from 'jitsi-iframe-api';
import Page from '../components/layout/Page.vue';
import { IS_MOBILE_DEVICE } from '../utils/util';
import Loading from '../components/Loading.vue';

export default {
  name: 'Conference',
  components: {
    Page,
    Loading,
  },
  props: {
    room: { type: String, default: '' },
  },
  data: () => ({
    loading: true,
  }),
  async mounted() {
    // eslint-disable-next-line no-new
    new JitsiMeetExternalAPI(process.env.VUE_APP_JITSI_URL, {
      parentNode: this.$refs.jitsi,
      width: '100%',
      height: '100%',
      roomName: this.room,
      configOverwrite: {
        disableDeepLinking: IS_MOBILE_DEVICE,
      },
      onload: () => {
        this.loading = false;
      },
    });

    const connection = await BrowserWindowMessageConnection({
      origin: `https://${process.env.VUE_APP_JITSI_URL}`,
    });

    connection.connect(({ room }) => {
      this.$router.push({ name: 'conference', params: { room } });
    });

    this.$once('hook:destroyed', () => {
      connection.disconnect();
    });
  },
};
</script>
<style lang="scss" scoped>
.league-page-container {
  padding-top: 1rem;
}

.jitsi-container,
.league-page-container {
  height: calc(100vh - 2em);
}
</style>
