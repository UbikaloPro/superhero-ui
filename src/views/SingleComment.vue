<template>
  <Page back>
    <div class="comment__page">
      <div
        v-if="comment"
        class="tipped__url"
      >
        <TipComment :comment="comment" />
      </div>
      <div class="comment__section">
        <p class="latest__comments">
          {{ $t('views.TipCommentsView.LatestReplies') }}
        </p>
        <SendComment
          :tip-id="tipId"
          :parent-id="id"
        />
      </div>
      <div
        v-if="comment"
        class="comments__section"
      >
        <Loading
          v-if="showLoading"
          class="loading-position-absolute"
        />
        <div
          v-if="comment.children.length === 0 && !showLoading"
          class="no-results text-center w-100"
          :class="[error ? 'error' : '']"
        >
          {{ $t('views.SingleCommentView.NoResultsMsg') }}
        </div>

        <TipComment
          v-for="nestedComment in comment.children"
          :key="nestedComment.id"
          :comment="nestedComment"
        />
      </div>
    </div>
  </Page>
</template>

<script>
import Backend from '../utils/backend';
import TipComment from '../components/tipRecords/TipComment.vue';
import Page from '../components/layout/Page.vue';
import Loading from '../components/Loading.vue';
import { EventBus } from '../utils/eventBus';
import SendComment from '../components/SendComment.vue';

export default {
  components: {
    Page,
    Loading,
    TipComment,
    SendComment,
  },
  props: {
    id: { type: [String, Number], required: true },
    tipId: { type: [String, Number], required: true },
  },
  data() {
    return {
      showLoading: true,
      error: false,
      comment: null,
    };
  },
  created() {
    this.loadComment();

    EventBus.$on('reloadData', () => {
      this.reloadData();
    });

    this.interval = setInterval(() => this.reloadData(), 120 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async reloadData() {
      this.comment = await Backend.getCommentById(this.id);
    },
    async loadComment() {
      this.showLoading = true;
      await this.reloadData();
      this.showLoading = false;
    },
  },
};
</script>

<style lang="scss">
.comment__page .tipped__url {
  .tip__record.row {
    background-color: $light_color;
    border-radius: 0;
  }

  .comment .tip__body .tip__note {
    overflow: visible;
    display: block;
  }
}
</style>
