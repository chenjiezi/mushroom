<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar">
        <el-form :inline="true" size="mini" :model="searchForm" ref="searchForm" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input type="text" v-model="searchForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="add()">新增角色</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" border size="mini" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="roleId" label="ID" width="50"></el-table-column>
        <el-table-column align="center" prop="roleName" label="角色名称" width="100"></el-table-column>
        <el-table-column align="center" prop="roleKey" label="roleKey"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
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
        <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="180px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="roleKey" prop="roleKey">
            <el-input v-model="roleForm.roleKey " autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="roleForm.remark" autocomplete="off"></el-input>
          </el-form-item>
          <!-- TODO: menuIds转换 -->
          <!-- <el-form-item label="菜单"" prop="menuIds">
            <el-input v-model="roleForm.menuIds" autocomplete="off"></el-input>
          </el-form-item> -->
        </el-form>
      </template>
      <!-- 弹框-删除 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该角色吗？</h1>
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
      roleForm: {
        roleName: '',
        password: '',
        remark: '',
        menuIds: ''
      },
      searchForm: {
        roleName: ''
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      roleFormRules: {
        roleName: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        roleIds: [
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
      this.dialogTitle = '新增角色'
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.roleForm.resetFields()
        this.roleForm = {}
      })
    },
    edit (scope) {
      this.isAdd = false
      this.isEdit = true
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑角色 名称：${scope.row.roleName || '-'}`
      // 根据roleId查询用户信息
      api.getRoleInfoByRoleId(scope.row.roleId).then((res) => {
        if (res.code === 200) {
          this.DialogVisible = true
          this.$nextTick(() => {
            this.$refs.roleForm.resetFields()
            this.roleForm = {
              roleId: res.data.roleId,
              roleName: res.data.roleName,
              roleKey: res.data.roleKey,
              remark: res.data.remark
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
      this.curId = scope.row.roleId
      this.dialogTitle = `删除角色 名称：${scope.row.roleName || '-'}`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            console.log('要提交的roleForm：', this.roleForm)
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
      api.getRoleList({
        ...this.searchForm,
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.resultList.map(item => {
            item.createTime = this.dateFormat(item, 'createTime')
            item.updateTime = this.dateFormat(item, 'updateTime')
            // TODO:
            return item
          })
          this.page.total = res.data.total
          this.page.currentPage = res.data.currentPage
          this.page.pageSize = res.data.pageSize
        }
      })
    },
    saveData () {
      api.saveRole(this.roleForm).then(res => {
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
      api.updateRole(this.roleForm).then(res => {
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
      api.deleteRoleByRoleId(this.curId).then(res => {
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
