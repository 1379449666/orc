<!-- home -->
<template>
  <div class="_content">
    <van-row  justify="center" type="flex" align="center" class="_top_text" v-if="!isEdit">
      <van-col>请在下面文本框内填入文案</van-col>
      <van-col>填入完毕后请点击提交审核</van-col>
    </van-row>
    <van-row  justify="center" type="flex" align="center" class="_top_text" v-else>
      <van-col><span class="color_red">红色字体</span>高亮的是违规内容</van-col>
      <van-col>还请进行替换、修改或删除</van-col>
      <van-col>无红色表示未出现已知违规</van-col>
    </van-row>
    <div class="_max_width">
      <van-row justify="space-between" type="flex" :style="{opacity:isEdit?0:1}" class="_text_length">
      <van-col class="text_right" @click="showList=true">违规关键字编辑</van-col>
      <van-col class="text_right">已输入{{message.length}}/80 个字</van-col>
      </van-row>
      <van-field
        v-model="message"
        class="_input"
        rows="2"
        autosize
        type="textarea"
        placeholder="请输入广告文案"
        show-word-limit
        @input="onChang"
        maxlength="80"
        ref="field"
        v-if="!isEdit"
      />
      <div v-else class="result">
        <span v-for="(item, index) in arrays" :key="index">{{item.text}}</span>
      </div>
      <van-row justify="space-between" type="flex" class="_button">
        <van-col><van-button color="#C2C2C2" @click="_onClear">清空</van-button></van-col>
        <van-col v-if="isEdit"><van-button color="#3478F6" v-clipboard:copy="message" v-clipboard:success="copyCode" v-clipboard:error="copyCodeError">复制</van-button></van-col>
        <van-col v-else><van-button color="#3478F6" @click="readText">粘贴</van-button></van-col>
        <van-col><van-button color="#4BAF00" @click="sub">{{!isEdit ? '提交' : '修改'}}</van-button></van-col>
      </van-row>
    </div>
    <van-popup
      v-model="showList"
      round
      position="bottom"
      style="height: 90%; padding-top: 4px;"
    />
  </div>
</template>

<script>
// 请求接口
// eslint-disable-next-line no-unused-vars
import { filter, filter_edit } from '@/api/home.js'
import { mapGetters } from 'vuex'
// eslint-disable-next-line no-unused-vars
import { setClipboardData, getClipboardData } from 'uni-clipboard'
export default {
  data() {
    return {
      message: '',
      isEdit: false,
      showList: false,
      arrays: [
        { text: '这是一段文字', color: '#000' },
        { text: '这是别的', color: '#fff' },
        { text: '这是一段文字', color: '#000' },
        { text: '这是一段文字', color: '#000' }
      ]
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  mounted() {
    console.log(this)
  },
  methods: {
    // 请求数据案例
    initData() {
      // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      filter({ text: this.message })
        .then(res => {
          this.arrays.length = 0
          this.arrays = res.result.text
        })
        .catch(() => { })
    },
    // Action 通过 store.dispatch 方法触发
    // doDispatch() {
    //   this.$store.dispatch('setUserName', '真乖，赶紧关注公众号，组织都在等你~')
    // }
    onChang(e) {
    },
    _onClear() { // 清空
      this.message = ''
      this.isEdit = false
      setTimeout(() => {
        this.$refs.field.focus()
      }, 0)
    },

    copyCode() { // 复制
      this.$toast('复制成功')
      console.log('sdada')
    },

    copyCodeError() { // 复制失败
      this.$toast('复制失败')
      console.log('sdad11111a')
    },
    readText(evt) { // 读取剪切板内容
      navigator.clipboard.readText()
        .then(clipText => {
          if (clipText.length === 0) return this.$toast('请先剪切！')
          this.$toast('粘贴成功')
          this.message = clipText
        })
        .catch(v => {
          this.$toast('读取剪切板内容失败')
        })
    },
    sub() {
      if (this.message.length === 0) return this.$toast('请输入广告文案')
      this.isEdit = !this.isEdit
      if (this.isEdit) this.initData()
    }
  }
}
</script>
<style lang="scss">
._content{
  padding: 0 15px;
  height: 100%;
  background-color: #fff;
  font-size: 18px;
  .text_right{
    text-align: right;
    color: #8B8B8B;
  }
  ._top_text{
    height: 145px;
    flex-direction: column;
    div{
      text-align: center;
      color: #C2C2C2;
    }
  }
  ._input{
    max-width: 450px;
    width: 100%;
    margin: 15px 0;
    height: 160px;
    border: 1px solid #9F9F9F;
    border-radius: 2px;
    .van-field__control{
      color: #646464;
      font-size: 18px;
    }
    .van-field__word-limit{
      display: none;
    }
  }
  ._button{
    max-width: 450px;
    width: 100%;
    height: 40px;
    .van-button{
      height: 100%;
      font-size: 18px;
      width: 105px;
    }
  }
}
.color_red{
  color: #C80000;
}
.result {
  width: 100%;
  max-width: 450px;
  height: 160px;
  margin: 15px 0;
  padding: 10px 16px;
  color: #646464;
  font-size: 18px;
}
._text_length {
  max-width: 450px;
  width: 100%;
}
._max_width{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
