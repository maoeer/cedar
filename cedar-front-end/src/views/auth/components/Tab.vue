<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Tab 数据源
const tabs = ref([
  { label: '登录', value: 0, path: '/auth/login' },
  { label: '注册', value: 1, path: '/auth/register' }
]);
// 当前激活 Tab 下标
const activeIndex = ref(0);
// tabBg 的ref
const tabBgRef = ref(null);
const tabWrapperRef = ref(null);
const router = useRouter();
const route = useRoute();

// 监听 activeIndex 变化，更新背景位置
const updateTabBg = () => {
  if (!tabBgRef.value || !tabWrapperRef.value) return;

  // 根据当前 activeIndex 获取激活的 tab 元素
  const activeTab = tabWrapperRef.value.querySelectorAll('.tab')[activeIndex.value];
  if (!activeTab) return;
  tabBgRef.value.style.width = `${activeTab.offsetWidth}px`;
  tabBgRef.value.style.left = `${activeTab.offsetLeft}px`;
};

onMounted(() => {
  // 同步路由对应的 Tab 下标
  const currentTab = tabs.value.find(tab => tab.path === route.path);
  if (currentTab) activeIndex.value = currentTab.value;

  // 首次挂载执行背景更新
  updateTabBg();
});

// 监听 activeIndex 变化，更新背景位置
watch(activeIndex, updateTabBg);

// 监听路由变化，避免手动修改 URL 出现问题
watch(
  () => route.path,
  (newPath) => {
    const currentTab = tabs.value.find(tab => tab.path === newPath);
    if (currentTab) activeIndex.value = currentTab.value;
  }
);

// 切换标签函数
const switchTab = (targetIndex, toPath) => {
  if (activeIndex.value === targetIndex || route.path === toPath) return;
  activeIndex.value = targetIndex;

  // 路由切换
  router.push({ path: toPath });
};
</script>

<template>
  <div class="tab-wrapper" ref="tabWrapperRef">
    <div 
      v-for="(tab, index) in tabs"
      class="tab"
      :key="tab.value"
      :class="{ active: activeIndex === index }"
      @click="switchTab(index, tab.path)"
    >{{ tab.label }}</div>

    <div class="tab-bg" ref="tabBgRef"></div>
  </div>
</template>

<style scoped lang="scss">
.tab-wrapper {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;

  .tab {
    flex: 1;
    text-align: center;
    padding: 12px;
    font-weight: 600;
    color: #8d99ae;
    border-radius: 8px;
    z-index: 1;
    cursor: pointer;

    &.active {
      color: $primary-color;
    }
  }

  .tab-bg {
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 6px;
    border-radius: 8px;
    background-color: #ebf0ff;
    transition: all 0.3s ease;
  }
}
</style>
