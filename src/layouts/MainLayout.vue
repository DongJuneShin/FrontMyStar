<template>
  <div class="d-flex vh-100">
    <!-- 왼쪽 수직 메뉴바 -->
    <aside class="p-3 bg-white border-end" style="width: 220px;">
      <img class="myPuppy img-fluid mb-3" src="/assets/image/loginPuppy2.png" alt="강아지사진" />

      <div class="accordion" id="menuAccordion">
        <div v-for="mn in menuTree" :key="mn.menuId" class="accordion-item">
          <!-- 하위 메뉴가 있는 경우 -->
          <template v-if="mn.children.length > 0">
            <h2 class="accordion-header" :id="`heading-${mn.menuId}`">
              <button
                  class="accordion-button p-2"
                  type="button"
                  :class="{ collapsed: !isOpen(mn.menuId) }"
                  @click="toggleMenu(mn.menuId)"
                  :aria-expanded="isOpen(mn.menuId)"
                  :aria-controls="`collapse-${mn.menuId}`"
              >
                {{ mn.menuName }}
              </button>
            </h2>

            <div
                :id="`collapse-${mn.menuId}`"
                class="accordion-collapse collapse"
                :class="{ show: isOpen(mn.menuId) }"
                :aria-labelledby="`heading-${mn.menuId}`"
            >
              <div class="accordion-body p-0">
                <ul class="nav flex-column ms-2">
                  <li
                      v-for="child in mn.children"
                      :key="child.menuId"
                      class="nav-item"
                  >
                    <router-link
                        :to="child.menuUrl"
                        class="nav-link text-secondary px-2 py-1"
                        active-class="fw-bold text-primary"
                    >
                      {{ child.menuName }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <!-- 하위 메뉴가 없는 경우 -->
          <template v-else>
            <h2 class="accordion-header">
              <router-link
                  :to="mn.menuUrl"
                  class="d-block w-100 px-4 py-2 text-start text-decoration-none text-dark border-0 bg-white"
                  active-class="fw-bold text-primary"
                  style="font-size: 1rem;"
              >
                {{ mn.menuName }}
              </router-link>
            </h2>
          </template>
        </div>
      </div>
    </aside>

    <!-- 오른쪽 콘텐츠 영역 -->
    <main class="flex-grow-1 bg-light p-4 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const rawMenu = ref([]);
    const menuTree = ref([]);
    const openMenus = ref([]);

    const toggleMenu = (menuId) => {
      if (openMenus.value.includes(menuId)) {
        openMenus.value = openMenus.value.filter((id) => id !== menuId);
      } else {
        openMenus.value.push(menuId);
      }
    };

    const isOpen = (menuId) => openMenus.value.includes(menuId);

    const buildMenuTree = (flatMenuList) => {
      const map = {};
      const roots = [];

      flatMenuList.forEach(item => {
        item.children = [];
        map[item.menuId] = item;
      });

      flatMenuList.forEach(item => {
        if (item.parentId) {
          map[item.parentId]?.children.push(item);
        } else {
          roots.push(item);
        }
      });

      return roots;
    };

    onMounted(async () => {
      try {
        const response = await axios.get("http://localhost:8081/common/selectMenus", {
          withCredentials: true,
        });

        if (response.data["successAt"] === "200") {
          rawMenu.value = response.data["menus"];
          menuTree.value = buildMenuTree(rawMenu.value);
        } else {
          alert(response.data["message"]);
        }
      } catch (e) {
        console.log("메뉴 불러오는 중 에러:", e.message);
      }
    });

    return {
      menuTree,
      toggleMenu,
      isOpen,
    };
  },
};
</script>

<style scoped>
/* 스타일 커스터마이징 */
.nav-link {
  cursor: pointer;
}
.nav-link:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}
</style>
