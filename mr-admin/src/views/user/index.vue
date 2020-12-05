<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar">
        <el-form :inline="true" size="mini" :model="searchForm" ref="searchForm" class="demo-ruleForm" v-hasPermi="['user:list']">
          <el-form-item label="搜索" prop="keyWord">
            <el-input type="text" v-model="searchForm.keyWord" autocomplete="off" placeholder="账号/昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" size="mini" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="userId" label="ID" width="100"></el-table-column>
        <el-table-column align="center" prop="loginName" label="账号"></el-table-column>
        <el-table-column align="center" prop="nickName" label="昵称" width="100"></el-table-column>
        <el-table-column align="center" prop="address" label="地址"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="140"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" width="140"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="edit(scope)" :disabled="editBtnloading" type="text" size="small"  v-hasPermi="['user:info']">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small"  v-hasPermi="['user:delete']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="changePage"
        @size-change="changeSize"
        :total="page.total"
        :current-page="page.currentPage"
        :pageSize="page.pageSize"
        layout="sizes, prev, pager, next, total"
        :pageSizes="[10, 15, 20, 30, 50]"
        background
        >
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="DialogVisible" :close-on-click-modal="false">
      <!-- 弹框- 新增、编辑 -->
      <template v-if="!isDel">
        <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="180px">
          <el-form-item label="账号" prop="loginName">
            <el-input v-model="userForm.loginName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="userForm.nickName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="userForm.address" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <!-- 弹框-删除 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该用户吗？</h1>
      </template>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()" :loading="saveBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/member'

export default {
  data () {
    return {
      dialogTitle: '弹窗',
      DialogVisible: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      editBtnloading: false,
      saveBtnLoading: false,
      curId: null, // 当前Id
      tableData: [],
      categoryList: [],
      userForm: {
        loginName: '',
        nickName: '',
        address: ''
      },
      searchForm: {
        keyWord: ''
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      userFormRules: {
        loginName: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        nickName: [
          { required: true, message: '必填项', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    submitForm () {
      this.page.currentPage = 1
      this.getData()
    },
    resetForm () {
      this.$refs.searchForm.resetFields()
      this.page.currentPage = 1
      this.searchForm = {}
      this.getData()
    },
    add () {
      this.isAdd = true
      this.isEdit = false
      this.isDel = false
      this.saveBtnLoading = false
      this.dialogTitle = '新增用户'
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.resetFields()
        this.userForm = {}
      })
    },
    edit (scope) {
      this.isAdd = false
      this.isEdit = true
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑用户 账号：${scope.row.loginName || '-'}`
      // 根据userId查询用户信息
      api.getUserInfoByUserId(scope.row.userId).then((res) => {
        if (res.code === 200) {
          this.DialogVisible = true
          this.$nextTick(() => {
            this.$refs.userForm.resetFields()
            this.userForm = {
              userId: res.data.userId,
              loginName: res.data.loginName,
              nickName: res.data.nickName,
              address: res.data.address
            }
          })
        }
      }).finally(() => {
        this.editBtnloading = false
      })
    },
    del (scope) {
      this.isAdd = false
      this.isEdit = false
      this.isDel = true
      this.saveBtnLoading = false
      this.curId = scope.row.userId
      this.dialogTitle = `删除用户 账号：${scope.row.loginName || '-'}`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            console.log('要提交的userForm：', this.userForm)
            if (this.isAdd) {
              this.$refs.searchForm.resetFields() // 重置查询条件
              this.page.currentPage = 1 // 查询第一页
              this.saveData() // 发送新增数据请求
            } else if (this.isEdit) {
              this.editData() // 发送编辑数据请求
            }
          } else {
            this.saveBtnLoading = false
            return false;
          }
        });
      } else {
        this.$refs.searchForm.resetFields() // 重置查询条件
        this.page.currentPage = 1 // 查询第一页
        this.delData() // 发送删除数据请求
      }
    },
    getData () {
      api.getUserList({
        ...this.searchForm,
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.resultList.map(item => {
            item.createTime = this.dateFormat(item, 'createTime')
            item.updateTime = this.dateFormat(item, 'updateTime')
            return item
          })
          this.page.total = res.data.total
          this.page.currentPage = res.data.currentPage
          this.page.pageSize = res.data.pageSize
        }
      })
    },
    saveData () {
      api.saveUser(this.userForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    editData () {
      api.updateUser(this.userForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    delData () {
      api.deleteUserByUserId(this.curId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    changePage (currentPage) {
      this.page.currentPage = currentPage
      this.getData()
    },
    changeSize (pageSize) {
      this.page.pageSize = pageSize
      this.getData()
    },
    dateFormat (item, time) {
      return item[time] ? item[time].split('.')[0].replace('T', ' ') : item[time]
    }
  }
}
</script>
<style lang='scss' scoped>
.container {
  padding: 12px;
}
.container .main {
  margin-bottom: 10px;
}
.top_bar {
  display: flex;
  justify-content: space-between;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
