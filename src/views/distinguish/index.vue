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
      <van-col class="color_red" @click="showList=true;filter_edit({act: 1})">违规关键字编辑</van-col>
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
        maxlength="80"
        ref="field"
        v-if="!isEdit"
      />
      <div v-else class="result">
        <span v-for="(item, index) in arrays" :key="index" :class="item.color">{{item.text}}</span>
      </div>
      <van-row justify="space-between" type="flex" class="_button">
        <van-col><van-button color="#C2C2C2" @click="_onClear">清空</van-button></van-col>
        <van-col v-if="isEdit"><van-button color="#3478F6" v-clipboard:copy="message" v-clipboard:success="copyCode" v-clipboard:error="copyCodeError">复制</van-button></van-col>
        <van-col v-else><van-button color="#3478F6" @click="readText">粘贴</van-button></van-col>
        <van-col><van-button color="#4BAF00" @click="sub">{{!isEdit ? '提交' : '修改'}}</van-button></van-col>
      </van-row>
    </div>
    <!-- <van-popup
      v-model="showList"
      round
      closeable
      position="bottom"
      class="_popup"
    >
      dajkdajk
    </van-popup> -->
    <van-action-sheet v-model="showList" title="违规关键字" class="_popup">
      <div v-if="isAdd">
        <van-contact-card type="add" @click="onAdd" add-text="添加违规关键字"/>
        <div class="_tags"><van-tag v-for="(item, index) in tagArray" :key="index" size="large" type="primary" @close="close(item)" closeable>{{item}}</van-tag></div>
      </div>
      <van-field
        class="_input addinput"
        ref="keywords"
        v-else
        v-model="keywords"
        rows="1"
        autosize
        label="违规关键字"
        type="textarea"
        placeholder="请输入"
      >
        <template #button>
          <van-button size="small" type="primary" style="margin-right:5px" @click="isAdd=true" color="#e3e3e3">取消</van-button>
          <van-button size="small" type="primary" @click="Addtag">添加</van-button>
        </template>
      </van-field>
    </van-action-sheet>
  </div>
</template>

<script>
// 请求接口
// eslint-disable-next-line no-unused-vars
import { filter, filter_edit } from '@/api/home.js'
import { mapGetters } from 'vuex'
import { Dialog } from 'vant'
// eslint-disable-next-line no-unused-vars
import { setClipboardData, getClipboardData } from 'uni-clipboard'
export default {
  data() {
    return {
      message: '',
      keywords: '',
      isEdit: false,
      showList: false,
      arrays: [],
      tagArray: [],
      show: true,
      isAdd: true
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  mounted() {
  },
  methods: {
    // 请求数据案例
    initData() { // 请求接口数据，仅作为展示，需要配置src->config下环境文件
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
    _onClear() { // 清空
      this.message = ''
      this.isEdit = false
      setTimeout(() => {
        this.$refs.field.focus()
      }, 0)
    },

    copyCode() { // 复制
      this.$toast('复制成功')
    },

    copyCodeError() { // 复制失败
      this.$toast('复制失败')
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
    sub() { // 提交
      if (this.message.length === 0) return this.$toast('请输入广告文案')
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        this.initData()
      } else {
        setTimeout(() => {
          this.$refs.field.focus()
        }, 0)
      }
    },
    onAdd() { // 显示添加关键字
      this.isAdd = false
      setTimeout(() => {
        this.$refs.keywords.focus()
      }, 0)
    },
    close(keywords) { // 点击关闭tag标签
      Dialog.confirm({
        title: '确认删除'
      })
        .then(() => { this.filter_edit({ act: 3, keywords }) })
        .catch()
    },
    filter_edit(params) {
      filter_edit(params).then(res => {
        if (params.act === 2) {
          this.isAdd = !this.isAdd
          this.keywords = ''
        }
        this.tagArray = []
        this.tagArray = res.result.list
      })
    },
    Addtag() { // 添加关键字
      if (this.keywords === '') return this.$toast('请输入违规关键字')
      var params = {
        act: 2,
        keywords: this.keywords
      }
      this.filter_edit(params)
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
.color_red, .red{
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
._popup{
  height: 90%;
  padding-top: 4px;
  max-width: 450px;
  right:0;
  margin:0 auto;
}
._tags {
  padding: 16px;
  span {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.addinput._input {
  border: 0;
  background-color: #f7f8fa;
  height: auto;
  .van-field__control {
    font-size: 14px;
  }
  .van-field__label span{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
