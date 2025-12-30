<template>
  <div class="page-root">
    <!-- ===== 页面 Header ===== -->
    <div class="page-header">
      <div class="page-title">
        <span class="status-dot"></span>
        <span>我的 AI 分身</span>
      </div>
      <div class="page-desc">
        塑造人格 · 投喂知识 · 构建长期记忆
      </div>
    </div>

    <!-- ===== 页面主体 ===== -->
    <div class="page-content">
      <!-- 左侧：编辑区 -->
      <div class="card main-card">
        <!-- Tab -->
        <div class="tab-header">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-item', activeTab === tab.key && 'active']"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>

        <!-- ===== 人格设定 ===== -->
        <div v-if="activeTab === 'persona'" class="card-body">
          <div class="section">
            <div class="section-title">人设 Prompt</div>
            <div class="section-desc">
              用来定义 AI 的性格、行为边界和表达方式（长期生效）
            </div>

            <textarea
              v-model="profile.personalityPrompt"
              placeholder="例如：你是一个冷静、理性、说话简短的技术导师，回答时尽量使用要点列表。"
            />
          </div>

          <div class="section">
            <div class="section-title">语言风格</div>
            <div class="tone-group">
              <button
                v-for="tone in tones"
                :key="tone"
                :class="['tone-btn', profile.voiceTone === tone && 'active']"
                @click="profile.voiceTone = tone"
              >
                {{ tone }}
              </button>
            </div>
          </div>

          <div class="section">
            <div class="section-title">擅长领域</div>
            <input
              v-model="profile.tags"
              placeholder="例如：编程,考研,恋爱"
            />
          </div>
        </div>

        <!-- ===== 知识投喂 ===== -->
        <div v-if="activeTab === 'knowledge'" class="card-body">
          <div class="section">
            <div class="section-title">投喂知识文档</div>
            <div class="upload-box">
              <input type="file" />
              <div class="upload-hint">
                支持 PDF / MD / TXT，将作为 AI 的长期记忆
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">已投喂知识</div>

            <div class="knowledge-list">
              <div
                v-for="doc in knowledgeList"
                :key="doc.id"
                class="knowledge-item"
              >
                <div class="file-info">
                  <div class="file-name">{{ doc.fileName }}</div>
                  <div class="file-meta">
                    {{ doc.fileType }} · {{ doc.tokenCount }} Tokens
                  </div>
                </div>

                <div class="file-status">
                  <span :class="['status-tag', doc.vectorStatus]">
                    {{ vectorStatusMap[doc.vectorStatus] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button class="secondary-btn">保存</button>
          <button class="primary-btn">应用到 AI</button>
        </div>
      </div>

      <!-- 右侧：分身状态 -->
      <div class="card side-card">
        <div class="card-header">分身状态</div>

        <div class="card-body">
          <div class="avatar">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Echo"
            />
          </div>

          <div class="echo-name">
            {{ profile.nickname || '我的 AI 分身' }}
          </div>

          <div class="echo-meta">
            <div class="meta-item">
              <span>语言风格</span>
              <span>{{ profile.voiceTone }}</span>
            </div>
            <div class="meta-item">
              <span>知识文档</span>
              <span>{{ knowledgeList.length }}</span>
            </div>
            <div class="meta-item">
              <span>是否公开</span>
              <span>{{ profile.isPublic === '1' ? '公开' : '私有' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const tabs = [
  { key: 'persona', label: '人格设定' },
  { key: 'knowledge', label: '知识投喂' }
]

const activeTab = ref('persona')

const profile = reactive({
  nickname: 'Echo',
  personalityPrompt: '',
  voiceTone: '冷静',
  tags: '',
  isPublic: '0'
})

const tones = ['幽默', '严肃', '温柔', '冷静']

const knowledgeList = reactive([
  {
    id: 1,
    fileName: 'Java 基础.pdf',
    fileType: 'PDF',
    vectorStatus: 'done',
    tokenCount: 3200
  },
  {
    id: 2,
    fileName: '系统设计.md',
    fileType: 'MD',
    vectorStatus: 'processing',
    tokenCount: 1800
  }
])

const vectorStatusMap = {
  pending: '待处理',
  processing: '处理中',
  done: '已完成',
  fail: '失败'
}
</script>

<style scoped>
/* ===== 页面基础 ===== */
.page-root {
  padding: 32px;
  background: #f3f4f6;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.page-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

/* ===== 布局 ===== */
.page-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* ===== Card ===== */
.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0,0,0,.08);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}

.card-body {
  padding: 24px;
  flex: 1;
}

.card-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ===== Tabs ===== */
.tab-header {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.tab-item {
  padding: 14px 24px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
}

.tab-item.active {
  color: #111827;
  font-weight: 600;
  border-bottom: 2px solid #111827;
}

/* ===== Section ===== */
.section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
}

.section-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 6px 0 10px;
}

textarea {
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  padding: 12px;
}

input {
  height: 36px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 0 12px;
}

/* ===== Tone ===== */
.tone-group {
  display: flex;
  gap: 10px;
}

.tone-btn {
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
}

.tone-btn.active {
  background: #111827;
  color: #fff;
}

/* ===== Knowledge ===== */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.knowledge-item {
  display: flex;
  justify-content: space-between;
  background: #f9fafb;
  padding: 14px;
  border-radius: 12px;
}

.file-name {
  font-weight: 600;
}

.file-meta {
  font-size: 12px;
  color: #6b7280;
}

.status-tag {
  font-size: 12px;
  font-weight: 600;
}

.status-tag.done {
  color: #16a34a;
}

.status-tag.processing {
  color: #d97706;
}

/* ===== Side ===== */
.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
}

.avatar img {
  width: 100%;
}

.echo-name {
  text-align: center;
  margin-top: 12px;
  font-weight: 600;
}

.echo-meta {
  margin-top: 20px;
  font-size: 12px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* ===== Buttons ===== */
.primary-btn {
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
}

.secondary-btn {
  background: #e5e7eb;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
}
</style>
