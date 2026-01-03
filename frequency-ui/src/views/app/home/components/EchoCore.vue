<template>
  <div v-if="visible" class="ec-modal" role="dialog" aria-modal="true">
    <div class="ec-backdrop" @click="close" />

    <div class="ec-shell">
      <header class="ec-header">
        <div class="ec-brand">
          <span class="ec-dot" />
          <span class="ec-brand-text">ECHOCORE READY</span>
        </div>

        <button class="ec-close" type="button" @click="close" aria-label="Close">
          <span>CLOSE</span>
          <span class="ec-x">×</span>
        </button>
      </header>

      <div class="ec-card">
        <div class="ec-card-top">
          <div class="ec-title">
            <span class="ec-green" />
            <div>
              <div class="ec-h1">我的 AI 分身</div>
              <div class="ec-sub">塑造人格 · 投喂知识 · 构建长期记忆</div>
            </div>
          </div>
        </div>

        <div class="ec-card-body">
          <div class="ec-grid">
            <!-- Left -->
            <section class="ec-left">
              <div class="ec-tabs">
                <button class="ec-tab" :class="{ active: tab === 'persona' }" type="button" @click="tab = 'persona'">
                  人格设定
                </button>
                <button
                  class="ec-tab"
                  :class="{ active: tab === 'knowledge' }"
                  type="button"
                  @click="tab = 'knowledge'"
                >
                  知识投喂
                </button>
              </div>

              <!-- Only vertical scroll -->
              <div class="ec-left-scroll">
                <div v-if="tab === 'persona'" class="ec-pane">
                  <div class="ec-section">
                    <div class="ec-section-title">人设 Prompt</div>
                    <div class="ec-section-desc">用来定义 AI 的性格、行为边界和表达方式（长期生效）</div>

                    <textarea
                      v-model="form.personaPrompt"
                      class="ec-textarea"
                      placeholder="例如：你是一个冷静、理性、说话简短的技术导师，回答时尽量使用要点列表。"
                    />
                  </div>

                  <div class="ec-section">
                    <div class="ec-section-title">语言风格</div>
                    <div class="ec-chip-row">
                      <button
                        v-for="s in styles"
                        :key="s"
                        type="button"
                        class="ec-chip"
                        :class="{ active: form.speechStyle === s }"
                        @click="form.speechStyle = s"
                      >
                        {{ s }}
                      </button>
                    </div>
                  </div>

                  <div class="ec-section">
                    <div class="ec-section-title">擅长领域</div>
                    <input v-model="form.expertise" class="ec-input" placeholder="例如：编程, 考研, 恋爱" />
                  </div>
                </div>

                <div v-else class="ec-pane">
                  <div class="ec-section">
                    <div class="ec-section-title">上传知识文档</div>
                    <div class="ec-section-desc">支持多文件上传，上传后可删除。</div>

                    <div class="ec-upload">
                      <input ref="fileInput" class="ec-file" type="file" multiple @change="onPickFiles" />
                      <button class="ec-btn ec-btn-ghost" type="button" @click="triggerPick">选择文件</button>
                      <div class="ec-upload-hint">已选择 <b>{{ files.length }}</b> 个文件</div>
                    </div>

                    <div v-if="files.length" class="ec-filelist">
                      <div v-for="(f, idx) in files" :key="f.key" class="ec-fileitem">
                        <div class="ec-filemeta">
                          <div class="ec-filename" :title="f.file.name">{{ f.file.name }}</div>
                          <div class="ec-filesize">{{ formatSize(f.file.size) }}</div>
                        </div>

                        <button class="ec-icon-btn" type="button" @click="removeFile(idx)">删除</button>
                      </div>
                    </div>
                  </div>

                  <div class="ec-tip">你可以先“保存”作为草稿，再“应用到 AI”立即生效。</div>
                </div>
              </div>
            </section>

            <!-- Right -->
            <aside class="ec-right">
              <div class="ec-right-card">
                <div class="ec-right-title">分身状态</div>

                <div class="ec-avatar">
                  <div class="ec-avatar-circle">
                    <span class="ec-robot">🤖</span>
                  </div>
                  <div class="ec-name">{{ form.name }}</div>
                </div>

                <div class="ec-stat">
                  <span class="ec-stat-label">语言风格</span>
                  <span class="ec-stat-val">{{ form.speechStyle }}</span>
                </div>
                <div class="ec-stat">
                  <span class="ec-stat-label">知识文档</span>
                  <span class="ec-stat-val">{{ files.length }}</span>
                </div>
                <div class="ec-stat">
                  <span class="ec-stat-label">是否公开</span>
                  <span class="ec-stat-val">{{ form.visibility }}</span>
                </div>

                <div class="ec-tip compact">你可以先“保存”作为草稿，再“应用到 AI”立即生效。</div>
              </div>
            </aside>
          </div>
        </div>

        <!-- Footer occupies space (no clipping) -->
        <footer class="ec-footer">
          <button class="ec-btn ec-btn-ghost" type="button" @click="onSave">保存</button>
          <button class="ec-btn ec-btn-primary" type="button" @click="onApply">应用到AI</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type FileItem = { key: string; file: File };

const props = defineProps<{
  /** 设为可选，避免某处以 {} 使用组件时 TS 报错 */
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "save", payload: any): void;
  (e: "apply", payload: any): void;
}>();

/** 默认值兜底：即使外部没传 modelValue，也不会 TS/运行时报错 */
const visible = computed(() => props.modelValue ?? false);

const tab = ref<"persona" | "knowledge">("persona");
const styles = ["幽默", "严肃", "温柔", "冷静"] as const;

const form = ref({
  name: "Echo",
  personaPrompt: "",
  speechStyle: "冷静",
  expertise: "",
  visibility: "私有",
});

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<FileItem[]>([]);

function close() {
  emit("update:modelValue", false);
}

function onSave() {
  emit("save", { ...form.value, files: files.value.map((x) => x.file) });
}

function onApply() {
  emit("apply", { ...form.value, files: files.value.map((x) => x.file) });
}

function triggerPick() {
  fileInput.value?.click();
}

function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement;
  const picked = Array.from(input.files || []);
  if (!picked.length) return;

  const existing = new Set(files.value.map((x) => x.key));
  for (const f of picked) {
    const key = `${f.name}-${f.size}-${f.lastModified}`;
    if (!existing.has(key)) {
      files.value.push({ key, file: f });
      existing.add(key);
    }
  }
  input.value = "";
}

function removeFile(idx: number) {
  files.value.splice(idx, 1);
}

function formatSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"] as const;
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) tab.value = "persona";
  }
);
</script>

<style scoped>
.ec-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}
.ec-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}
.ec-shell {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ec-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.88);
}
.ec-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.06em;
}
.ec-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #55d57a;
  box-shadow: 0 0 0 4px rgba(85, 213, 122, 0.12);
}
.ec-brand-text {
  font-weight: 600;
  font-size: 14px;
}
.ec-close {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}
.ec-x {
  font-size: 18px;
  line-height: 1;
}

.ec-card {
  width: min(1200px, calc(100vw - 64px));
  height: min(820px, calc(100vh - 120px));
  margin: 0 auto 24px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ec-card-top {
  padding: 26px 28px 12px;
}
.ec-title {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.ec-green {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #55d57a;
  margin-top: 10px;
}
.ec-h1 {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}
.ec-sub {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.55);
  font-size: 14px;
}

.ec-card-body {
  flex: 1;
  min-height: 0;
  padding: 10px 22px 0;
}
.ec-grid {
  height: 100%;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 18px;
  min-width: 0;
}
.ec-left,
.ec-right {
  min-width: 0;
}

.ec-left {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ec-tabs {
  padding: 16px 16px 10px;
  display: flex;
  gap: 10px;
}
.ec-tab {
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(15, 23, 42, 0.78);
  cursor: pointer;
  font-weight: 600;
}
.ec-tab.active {
  background: #0b1220;
  color: rgba(255, 255, 255, 0.92);
  border-color: transparent;
}

/* ✅ only vertical scroll + subtle scrollbar */
.ec-left-scroll {
  flex: 1;
  min-height: 0;
  padding: 10px 16px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;

  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.22) transparent;
}
.ec-left-scroll::-webkit-scrollbar {
  width: 10px;
}
.ec-left-scroll::-webkit-scrollbar:horizontal {
  height: 0px;
}
.ec-left-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.ec-left-scroll::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.18);
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: content-box;
}
.ec-left-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 23, 42, 0.28);
  border: 3px solid transparent;
  background-clip: content-box;
}

.ec-pane {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}
.ec-section-title {
  font-weight: 800;
  color: #0f172a;
  font-size: 16px;
}
.ec-section-desc {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.55);
  font-size: 13px;
}

.ec-textarea {
  margin-top: 12px;
  width: 100%;
  min-height: 170px;
  resize: vertical;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.95);
  padding: 14px;
  outline: none;
  color: #0f172a;
  line-height: 1.5;
}

.ec-input {
  margin-top: 12px;
  width: 100%;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.95);
  padding: 0 14px;
  outline: none;
  color: #0f172a;
}

.ec-chip-row {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.ec-chip {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(15, 23, 42, 0.75);
  cursor: pointer;
  font-weight: 600;
}
.ec-chip.active {
  background: #0b1220;
  color: rgba(255, 255, 255, 0.92);
  border-color: transparent;
}

.ec-upload {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ec-file {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.ec-upload-hint {
  color: rgba(15, 23, 42, 0.55);
  font-size: 13px;
}

.ec-filelist {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ec-fileitem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
  min-width: 0;
}
.ec-filename {
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 520px;
}
.ec-filesize {
  margin-top: 2px;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
}
.ec-icon-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(15, 23, 42, 0.03);
  cursor: pointer;
  color: rgba(15, 23, 42, 0.78);
  font-weight: 700;
}

.ec-tip {
  margin-top: 6px;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(99, 102, 241, 0.18);
  background: rgba(99, 102, 241, 0.06);
  color: rgba(15, 23, 42, 0.72);
  font-size: 13px;
}
.ec-tip.compact {
  margin-top: 14px;
}

.ec-right {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(15, 23, 42, 0.08);
  overflow: hidden;
}
.ec-right-card {
  height: 100%;
  padding: 18px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.ec-right-title {
  font-weight: 900;
  color: #0f172a;
  font-size: 16px;
}
.ec-avatar {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.ec-avatar-circle {
  width: 92px;
  height: 92px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
}
.ec-robot {
  font-size: 34px;
}
.ec-name {
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
}
.ec-stat {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.9);
}
.ec-stat-label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 700;
  font-size: 13px;
}
.ec-stat-val {
  color: rgba(15, 23, 42, 0.92);
  font-weight: 900;
}

.ec-footer {
  padding: 16px 22px 18px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.94);
  flex: 0 0 auto;
}

.ec-btn {
  height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 900;
}
.ec-btn-ghost {
  background: rgba(15, 23, 42, 0.04);
  border-color: rgba(15, 23, 42, 0.10);
  color: rgba(15, 23, 42, 0.85);
}
.ec-btn-primary {
  background: #0b1220;
  color: rgba(255, 255, 255, 0.92);
}

@media (max-width: 980px) {
  .ec-card {
    width: calc(100vw - 28px);
    height: calc(100vh - 110px);
  }
  .ec-grid {
    grid-template-columns: 1fr;
  }
  .ec-right {
    display: none;
  }
}
</style>
