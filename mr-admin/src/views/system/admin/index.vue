<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar">
        <el-form :inline="true" size="mini" :model="searchForm" ref="searchForm" class="demo-ruleForm">
          <el-form-item label="搜索" prop="keyWord">
            <el-input type="text" v-model="searchForm.keyWord" autocomplete="off" placeholder="账号/昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="add()">新增管理员</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" border size="mini" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="adminId" label="ID" width="50"></el-table-column>
        <el-table-column align="center" prop="roleIdsTotext" label="角色" width="100"></el-table-column>
        <el-table-column align="center" prop="adminName" label="账号"></el-table-column>
        <!-- <el-table-column align="center" prop="password" label="密码" width="140"></el-table-column> -->
        <el-table-column align="center" prop="nickName" label="昵称"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="edit(scope)" :disabled="editBtnloading" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small">删除</el-button>
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
        <el-form ref="adminForm" :model="adminForm" :rules="adminFormRules" label-width="180px">
          <el-form-item label="账号" prop="adminName">
            <el-input v-model="adminForm.adminName" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="密码" prop="password">
            <el-input v-model="adminForm.password" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="adminForm.roleIds" multiple placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="adminForm.nickName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adminForm.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <!-- 弹框-删除 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该管理员吗？</h1>
      </template>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()" :loading="saveBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from './api'
import * as roleApi from '../role/api'

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
      adminForm: {
        adminName: '',
        password: '',
        roleIds: '',
        nickName: '',
        email: ''
      },
      searchForm: {
        keyWord: ''
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      adminFormRules: {
        adminName: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '必填项', trigger: 'blur'}
        ]
      }
    }
  },
  async created () {
    await this.getRoleList()
    await this.getData()
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
      this.dialogTitle = '新增管理员'
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.adminForm.resetFields()
        this.adminForm = {}
      })
    },
    edit (scope) {
      this.isAdd = false
      this.isEdit = true
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑管理员 账号：${scope.row.adminName || '-'}`
      // 根据adminId查询用户信息
      api.getAdminInfoByAdminId(scope.row.adminId).then((res) => {
        if (res.code === 200) {
          this.DialogVisible = true
          this.$nextTick(() => {
            this.$refs.adminForm.resetFields()
            this.adminForm = {
              adminId: res.data.adminId,
              adminName: res.data.adminName,
              password: res.data.password,
              roleIds: res.data.roleIds,
              nickName: res.data.nickName,
              email: res.data.email
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
      this.curId = scope.row.adminId
      this.dialogTitle = `删除管理员 账号：${scope.row.adminName || '-'}`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.adminForm.validate((valid) => {
          if (valid) {
            console.log('要提交的adminForm：', this.adminForm)
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
      api.getAdminList({
        ...this.searchForm,
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.resultList.map(item => {
            if (item.roleIds && item.roleIds.length > 0) {
              item.roleIds.forEach(itemRoleId => {
                this.roleList.forEach(roleItem => {
                  if (itemRoleId === roleItem.roleId) {
                    item.roleIdsTotext = ` ${roleItem.roleName}`
                  }
                })
              })
            }
            item.roleIdsTotext = item.roleIdsTotext ? item.roleIdsTotext : '-'
            item.password = item.password ? item.password : '-'
            return item
          })
          this.page.total = res.data.total
          this.page.currentPage = res.data.currentPage
          this.page.pageSize = res.data.pageSize
        }
      })
    },
    saveData () {
      api.saveAdmin(this.adminForm).then(res => {
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
      api.updateAdmin(this.adminForm).then(res => {
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
      api.deleteAdminByAdminId(this.curId).then(res => {
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
    },
    getRoleList () {
      roleApi.getRoleList({pageSize: 999}).then(res => {
        if (res.code === 200) {
          this.roleList = res.data.resultList
        }
      })
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
