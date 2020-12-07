<template>
  <div class="login-container">
    <el-col :md="18" class="brand-info">
      <h2 class="brand-info-text">蘑菇街运营管理后台</h2>
      <p class="brand-info-intro">
        本系统 基于vue、element-ui构建开发，Springboot及其相关技术栈开发。
        <br>
        后台管理系统包含角色管理，菜单管理，管理员管理，数据面板、轮播图管理、商品管理、订单管理、会员管理、分类管理等模块。
      </p>
    </el-col>
    <el-col :md="6" class="form">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" size="mini" auto-complete="on"
               label-position="left">

        <div class="title-container">
          <h3 class="title">管理员登录</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">Login
        </el-button>

        <div class="tips">
          <!-- <span style="margin-right:20px;">username: admin</span>
          <span> password: any</span> -->
        </div>

      </el-form>
    </el-col>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('用户名必须为5个字符'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不少于六位!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            if (res.code === 200) {
              this.$router.push({path: this.redirect || '/'})
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
            this.loading = false
          }).catch((err) => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #ffffff;
$light_gray: #454545;
$cursor: #454545;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(189, 53, 53, 0.1);
    background: $bg;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #ffffff;
$dark_gray: #a4a4a4;
$light_gray: #303133;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('~@/assets/img/bg.png') center center no-repeat;
  background-size: cover;
  //background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 180px 60px 0 60px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .brand-info {
    padding: 220px 100px 0 90px;
    color: #fff;

    .brand-info-text {
      margin: 0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform: uppercase
    }

    .brand-info-intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
  }

  .form {
    height: 100vh;
    background: #ffffff;
  }

  .title-container {
    position: relative;

    .title {
      text-align: left;
      font-size: 16px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

@media screen and (max-width: 1500px) {
  .brand-info {
    display: none;
  }

  .form {
    width: 100%;
    background: #00000082 !important;
  }

  .login-form .title-container .title {
    color: white !important;
  }
}

.el-button {
  background: #25CCF7;
  border: none;
}

</style>
