<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">MAGI System</h1>
      
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        <!-- 聊天历史 -->
        <div class="h-[600px] overflow-y-auto p-4 space-y-4">
          <div v-for="(message, index) in chatHistory" :key="index"
               :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[70%] rounded-lg p-3',
              message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            ]">
              {{ message.content }}
            </div>
          </div>
        </div>
        
        <!-- 输入框 -->
        <div class="border-t p-4">
          <div class="flex space-x-2">
            <input v-model="userInput"
                   @keyup.enter="sendMessage"
                   class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="输入您的问题..."/>
            <button @click="sendMessage"
                    class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const chatHistory = ref<ChatMessage[]>([])
const userInput = ref('')

const sendMessage = async () => {
  if (!userInput.value.trim()) return
  
  // 添加用户消息
  chatHistory.value.push({
    role: 'user',
    content: userInput.value
  })
  
  // TODO: 这里添加与AI接口的集成
  // 模拟AI响应
  setTimeout(() => {
    chatHistory.value.push({
      role: 'assistant',
      content: '这是一个模拟的AI响应。'
    })
  }, 1000)
  
  userInput.value = ''
}
</script> 