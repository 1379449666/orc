<!-- home -->
<template>
  <div class="_content">
    <van-row  justify="center" type="flex" align="center" class="_top_text" v-if="!isEdit">
      <van-col>请在下面文本框内填入文案</van-col>
      <van-col>填入完毕后请点击提交审核</van-col>
      <van-col @click="linkDownload('https://e.qq.com/ads/helpcenter/detail?cid=508&pid=2023')">更多素材审核功能推荐使用</van-col>
      <van-col  class="text_external_link" @click="linkDownload('https://e.qq.com/ads/helpcenter/detail?cid=508&pid=2023')">腾讯广告平台内置预审工具</van-col>
    </van-row>
    <van-row  justify="center" type="flex" align="center" class="_top_text" v-else>
      <van-col><span class="color_red">红色字体</span>高亮的是违规内容</van-col>
      <van-col>还请进行替换、修改或删除</van-col>
      <van-col>无红色表示未出现已知违规</van-col>
    </van-row>
    <div class="_max_width">
      <van-row justify="space-between" type="flex" :style="{opacity:isEdit?0:1}" class="_text_length">
      <van-col class="color_red" @click="showList=true;">违规关键字编辑</van-col>
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
        @focus="onfocus"
        @blur="onblur"
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
    <van-action-sheet v-model="showList" title="违规关键字" class="_popup">
      <div v-if="isAdd">
        <van-contact-card type="add" @click="onAdd" add-text="添加违规关键字"/>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="_tags"><van-tag v-for="(item, index) in tagArray" :key="index" size="large" type="primary" @close="close(item, index)" closeable>{{item}}</van-tag></div>
          <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
        </van-list>
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
    <div class="text_right prompt">当前词库包含 {{count}} 个敏感词</div>
    <van-image width="25%" :style="{opacity: isFocus ? 0 : 1}" fit="scale-down" :src="require('../../assets/image/WechatIMG50.png')"/>
  </div>
</template>

<script>
// 请求接口
// eslint-disable-next-line no-unused-vars
import { filter, filter_edit } from '@/api/home.js'
import { mapGetters } from 'vuex'
import { Dialog, Toast } from 'vant'
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
      isAdd: true,
      loading: false,
      finished: false,
      isFocus: false,
      limit: 30,
      act: 1,
      text_keywords: '',
      offset: 0,
      count: 0
    }
  },
  computed: {
    ...mapGetters(['userName'])
  },
  mounted() {
    this.getConut()
  },
  methods: {
    onfocus() {
      this.isFocus = true
    },
    onblur() {
      this.isFocus = false
    },
    getConut() {
      this.act = 1
      this.offset = 0
      this.filter_edit()
    },
    // 请求数据案例
    initData() { // 请求接口数据，仅作为展示，需要配置src->config下环境文件
      Toast.loading({ message: '查询中...', forbidClick: true, duration: 0 })
      filter({ text: this.message })
        .then(res => {
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

    sub() { // 提交查询
      if (this.message.length === 0) return this.$toast('请输入广告文案')
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        this.initData()
        this.arrays.length = 0
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

    close(keywords, index) { // 点击关闭tag标签
      Dialog.confirm({
        title: '确认删除'
      })
        .then(() => {
          console.log(keywords, index)
          this.tagArray.splice(index, 1)
          this.act = 3
          this.text_keywords = keywords
          this.offset -= 1
          this.filter_edit()
        })
        .catch()
    },

    filter_edit() {
      var params = {
        act: this.act, // 1.查看列表；2.新增；3.删除
        keywords: this.text_keywords, // 关键词
        offset: this.offset, // 分页起始位置
        limit: this.limit // 每次获取条数
      }
      filter_edit(params).then(res => {
        this.loading = false
        if (params.act === 3) {
          return false
        } else if (params.act === 2) {
          this.isAdd = true
          this.keywords = ''
        }
        // eslint-disable-next-line no-return-assign
        if (res.result.list.length === 0) return this.finished = true
        if (this.offset === 0) {
          this.tagArray.length = 0
          this.tagArray = res.result.list
        } else {
          this.tagArray = [...this.tagArray, ...res.result.list]
        }
        this.offset = res.result.offset
        this.count = res.result.count
      })
    },
    Addtag() { // 添加关键字
      if (this.keywords === '') return this.$toast('请输入违规关键字')
      this.act = 2
      this.offset = 0
      this.text_keywords = this.keywords
      this.filter_edit()
    },
    linkDownload(url) {
      window.open(url, '_blank')
    },
    onLoad() {
      this.act = 1
      this.filter_edit()
    }
  }
}
</script>
<style lang="scss">
._content{
  padding: 0 15px;
  height: 100%;
  background-color: #fff;
  font-size: 16px;
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
      font-size: 16px;
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
      font-size: 16px;
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
  font-size: 16px;
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
.van-image {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}
.prompt.text_right {
  color: #C2C2C2;
  max-width: 450px;
  margin:0 auto;
  margin-top: 15px;
}
.text_external_link.van-col {
  color: rgb(52, 120, 246)!important;
  text-decoration: underline;
}
</style>
