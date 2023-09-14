<script>
import { h } from "vue";
export default {
  props: {
    component: String,
  },
  render() {
    // return h(this.component);
    return this.component;
  },
};
</script>
