<template>
  <div class="login-container">
    <el-form @submit.prevent="onsubmit()" v-model="user" :rules="rules">
      <el-form-item prop="account">
        <el-input v-model="user.account" placeholder="input account">
          <template #prefix>
            <el-icon> <Avatar/> </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="user.pwd" type="password" placeholder="input password">
          <template #prefix>
            <el-icon> <Lock/> </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="imgcode">
        <el-input v-model="user.imgcode" placeholder="请输入验证码">
          <template #prefix>
            <el-icon> <Key/> </el-icon>
          </template>
        </el-input>
        <img class="imgcode" alt="验证码" @click="loadCaptcha"
             :src=captcha />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" class="login-btn">登录</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script lang="ts" setup>
import {getCaptcha, getLoginInfo} from '@/api/common'
// import {useStore} from '@/store'
import {onMounted, reactive, ref} from 'vue'
import type {ILoginInfo} from '@/api/types/common'
import {Avatar, Key, Lock} from '@element-plus/icons-vue';
// const store = useStore()
const user = reactive({
  account: 'admin',
  pwd: '123456',
  imgcode: ''
})
const captcha = ref('https://shop.fed.lagounews.com/api/admin/captcha_pro')
const loading = ref(false)
const rules = ref({
  account: [
    {
      required: true,
      message: 'please input account',
      trigger: 'change'
    }
  ],
  pwd: [
    {
      required: true,
      message: 'please input pwd',
      trigger: 'change'
    }
  ],
  imgcode: [
    {
      required: true,
      message: 'please input code',
      trigger: 'change'
    }
  ]
})
const onsubmit = function () {

}
const s = ref<ILoginInfo['slide']>([])

const loadCaptcha = () => {
  getCaptcha().then(([_err, imgData]) => {
    if (!_err) {
      const binaryData = [];
      binaryData.push(imgData);
      captcha.value = URL.createObjectURL(new Blob(binaryData))
    } else {
      console.log(_err)
    }
  })
}

onMounted(() => {
  getLoginInfo().then(([_err, data]) => {
    if (!_err) {
      console.log(data)
      s.value = data.slide
    }
  })
  loadCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 400px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;
  .el-form{
    padding: 30px;
    border-radius: 6px;
    background: #fff;
    min-width: 350px;
    .imgcode {
      height: 37px;
      position: absolute;
      right: 0;
    }
    .login-btn{
      width: 100%;
    }
  }
}
</style>
