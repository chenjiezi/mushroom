<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar"></div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="addFisrtLevel('M')">新增目录</el-button>
        <el-button type="primary" style="margin-left:12px;" size="mini" @click="addFisrtLevel('C')">新增菜单</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        :data="tableData"
        border size="mini"
        default-expand-all
        row-key="menuId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column align="center" prop="icon" label="icon"></el-table-column>
        <el-table-column align="center" prop="path" label="路由地址"></el-table-column>
        <el-table-column align="center" prop="component" label="组件路径"></el-table-column>
        <el-table-column align="center" prop="perms" label="权限标识"></el-table-column>
        <el-table-column align="center" prop="menuTypeToText" label="菜单类别"></el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="scope.row.menuType !== 'F'" @click="addSecondOrThirdLevel(scope)" type="text" size="small">新增</el-button>
            <el-button :disabled="editBtnLoading" @click="edit(scope)" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="DialogVisible" :close-on-click-modal="false">
      <!-- 弹框 新增/编辑 操作 -->
      <template v-if="!isDel">
        <!-- 操作 目录 表单 -->
        <template v-if="isFirstLevel">
          <el-form ref="menuForm1" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <el-form-item label="目录名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="icon" prop="icon">
              <el-input v-model="menuForm.icon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="menuForm.remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 菜单 表单 -->
        <template v-if="isSecondLevel">
          <el-form ref="menuForm2" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <!-- 菜单的 parentId 为0,则菜单为一级 -->
            <el-form-item label="目录名称" prop="parentId" v-if="menuForm.parentId != 0">
              <el-select v-model="menuForm.parentId" :disabled="firstDisabled" placeholder="请选择">
                <el-option
                  v-for="item in firstList"
                  :key="item.menuId"
                  :label="item.menuName"
                  :value="item.menuId"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menuForm.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="menuForm.component" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="menuForm.perms" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示状态" prop="visible">
              <el-switch
                v-model="menuForm.visible"
                :active-value="false"
                :inactive-value="true"
                active-text="显示"
                inactive-text="隐藏">
              </el-switch>
            </el-form-item>
            <el-form-item label="icon" prop="icon">
              <el-input v-model="menuForm.icon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="menuForm.remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 按钮 表单 -->
        <template v-if="isThirdLevel">
          <el-form ref="menuForm3" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <el-form-item label="目录/菜单名称" prop="menuIdArr" v-if="menuForm.levelNum === 3">
              <el-cascader
                v-model="menuForm.menuIdArr"
                :options="firstAndSecondList"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                :disabled="firstAndSecondDisabled"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="目录名称" prop="parentId" v-else>
              <el-select v-model="menuForm.parentId" :disabled="firstAndSecondDisabled" placeholder="请选择">
                <el-option
                  v-for="item in firstList"
                  :key="item.menuId"
                  :label="item.menuName"
                  :value="item.menuId"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="按钮名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="perms">
              <el-input v-model="menuForm.perms" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="icon" prop="icon">
              <el-input v-model="menuForm.icon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="menuForm.remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
      </template>
      <!-- 弹框 删除 操作 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该数据吗？</h1>
      </template>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveBtnLoading" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from './api'

export default {
  data () {
    return {
      curId: null, // 当前数据id
      dialogTitle: '弹窗',
      DialogVisible: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      isFirstLevel: false,
      isSecondLevel: false,
      isThirdLevel: false,
      editBtnLoading: false,
      saveBtnLoading: false,
      firstDisabled: false,
      firstAndSecondDisabled: false,
      tableData: [],
      menuForm: {
        menuName: '',
        parentId: '',
        menuIdArr: []
      },
      menuFormRules: {
        menuName: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        parentId: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        path: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        component: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        perms: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        menuIdArr: [
          { required: true, message: '必填项', trigger: 'blur'}
        ]
      },
      firstList: [],
      firstAndSecondList: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addFisrtLevel (menuType) { // 显示 目录 新增操作弹窗
      if (menuType === 'M') {
        this.isTrue(['isAdd', 'isFirstLevel'])
      } else if (menuType === 'C') {
        this.isTrue(['isAdd', 'isSecondLevel'])
      }
      this.dialogTitle = menuType === 'M' ? '新增目录' : '新增菜单'
      this.DialogVisible = true
      this.$nextTick(() => {
        // 重置表单
        if (menuType === 'M') {
          this.$refs.menuForm1.resetFields();
        } else if (menuType === 'C') {
          this.$refs.menuForm2.resetFields();
        }
        this.menuForm = {
          parentId: '0',
          menuType: menuType,
          levelNum: 1,
          visible: true
        }
      })
    },
    addSecondOrThirdLevel ({row}) { // 显示 按钮/菜单 新增操作弹窗
      if (row.menuType === 'C') {
        this.isTrue(['isAdd', 'isThirdLevel'])
        this.dialogTitle = '新增按钮'
        this.firstAndSecondDisabled = true
      } else if (row.menuType === 'M'){
        this.isTrue(['isAdd', 'isSecondLevel'])
        this.dialogTitle = '新增菜单'
        this.firstDisabled = true
      }
      this.DialogVisible = true
      this.$nextTick(() => {
        // 重置表单
        if (row.menuType === 'C') {
          this.$refs.menuForm3.resetFields();
          this.menuForm = {
            menuType: 'F',
            levelNum: row.levelNum + 1
          }
          row.parentId == 0
          ? this.menuForm.parentId = row.menuId
          : this.menuForm.menuIdArr = [row.parentId, row.menuId]
        } else if (row.menuType === 'M'){
          this.$refs.menuForm2.resetFields();
          this.menuForm = {
            parentId: row.menuId,
            menuType: 'C',
            visible: true,
            levelNum: row.levelNum + 1
          }
        }
      })
    },
    edit ({row}) { // 显示 一/二/三级 编辑操作弹窗
      this.editBtnLoading = true
      if (row.menuType === 'F') {
        this.isTrue(['isEdit', 'isThirdLevel'])
        this.firstAndSecondDisabled = false
        this.dialogTitle = `编辑按钮 [${row.menuName}]`
      } else if (row.menuType === 'C') {
        this.isTrue(['isEdit', 'isSecondLevel'])
        this.firstDisabled = false
        this.dialogTitle = `编辑菜单 [${row.menuName}]`
      } else {
        this.isTrue(['isEdit', 'isFirstLevel'])
        this.dialogTitle = `编辑目录 [${row.menuName}]`
      }
      this.DialogVisible = true
      this.$nextTick(() => {
        if (row.menuType === 'F') {
          this.$refs.menuForm3.resetFields();
          // 通过 三级的pId 获取 三级的pId的pId（下拉框需要到）
          let ppId = ''
          this.firstAndSecondList.forEach(item => {
            if (item.children) {
              item.children.forEach(item2 => {
                if (item2.menuId === row.parentId) {
                  ppId = item2.parentId
                }
              })
            }
          })
          this.menuForm = {
            menuId: row.menuId,
            menuName: row.menuName,
            parentId: row.parentId,
            levelNum: row.levelNum,
            perms: row.perms,
            icon: row.icon,
            path: row.path,
            menuType: row.menuType,
            remark: row.remark,
            menuIdArr: [ppId, row.parentId]
          }
        } else if (row.menuType === 'C'){
          this.$refs.menuForm2.resetFields();
          this.menuForm = {
            parentId: row.parentId,
            menuId: row.menuId,
            menuName: row.menuName,
            path: row.path,
            component: row.component,
            perms: row.perms,
            icon: row.icon,
            visible: row.visible,
            remark: row.remark,
            levelNum: row.levelNum,
            menuType: row.menuType
          }
        } else {
          this.$refs.menuForm1.resetFields();
          this.menuForm = {
            menuId: row.menuId,
            menuName: row.menuName,
            perms: row.perms,
            icon: row.icon,
            path: row.path,
            remark: row.remark,
            parentId: row.parentId,
            levelNum: row.levelNum,
            menuType: row.menuType
          }
        }
        this.editBtnLoading = false
      })
    },
    del ({row}) { // 显示 一/二/三级 删除操作弹窗
      if (row.menuType === 'F') {
        this.dialogTitle = `删除按钮 [${row.menuName}]`
      } else if (row.menuType === 'C'){
        this.dialogTitle = `删除菜单 [${row.menuName}]`
      } else {
        this.dialogTitle = `删除目录 [${row.menuName}]`
      }
      this.curId = row.menuId // 当前数据id
      this.isTrue(['isDel'])
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        let menuFormNum = 3
        if (this.menuForm.menuType === 'M') {
          menuFormNum = 1
        } else if (this.menuForm.menuType === 'C') {
          menuFormNum = 2
        }
        this.$refs[`menuForm${menuFormNum}`].validate((valid) => {
          if (valid) {
            if (this.menuForm.menuType === 'F' && this.menuForm.levelNum === 3) {
              this.menuForm.parentId = this.menuForm.menuIdArr[1]
            }
            if (this.isAdd) {
              this.saveData() // 发送新增数据请求 post
            } else {
              this.editData() // 发送编辑数据请求 put
            }
          } else {
            this.saveBtnLoading = false
            return false
          }
        })
      } else {
        this.delData() // 发送删除数据请求 delete
      }
    },
    getData () {
      api.getMenulist().then(res => {
        this.tableData = res.data.map(item => {
          item.menuTypeToText = this.menuTypeFormat(item.menuType)
          item.createTime = this.dateFormat(item, 'createTime')
          item.updateTime = this.dateFormat(item, 'updateTime')
          if (item.children) {
            item.children.map(item1 => {
              item1.menuTypeToText = this.menuTypeFormat(item1.menuType)
              item1.createTime = this.dateFormat(item1, 'createTime')
              item1.updateTime = this.dateFormat(item1, 'updateTime')
              if (item1.children) {
                item1.children.map(item2 => {
                  item2.menuTypeToText = this.menuTypeFormat(item2.menuType)
                  item2.createTime = this.dateFormat(item2, 'createTime')
                  item2.updateTime = this.dateFormat(item2, 'updateTime')
                  return item2 
                })
              }
              return item1
            })
          }
          return item
        })
        // 下拉框数据
        this.firstList = JSON.parse(JSON.stringify(res.data))

        let temp = JSON.parse(JSON.stringify(res.data))
        this.firstAndSecondList = temp.map(item => {
          if(item.children) {
            item.children.map(item1 => {
              if (item1.children) delete item1.children
              return item1
            })
          }
          return item
        })
      })
    },
    saveData () {
      api.saveMenu(this.menuForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.DialogVisible = false
        this.saveBtnLoading = false
      })
    },
    editData () {
      api.updateMenu(this.menuForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.DialogVisible = false
        this.saveBtnLoading = false
      })
    },
    delData () {
      api.deleteMenuBymenuId(this.curId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.getData()
        this.DialogVisible = false
        this.saveBtnLoading = false
      })
    },
    isTrue (arr) {
      const t = [
        'isAdd',
        'isEdit',
        'isDel',
        'isFirstLevel',
        'isSecondLevel',
        'isThirdLevel'
        ]
      for (let key of t) {
        this[key] = false
      }
      for (let key of arr) {
        this[key] = true
      }
    },
    dateFormat (item, time) {
      return item[time] ? item[time].split('.')[0].replace('T', ' ') : item[time]
    },
    menuTypeFormat (menuType) {
      const t = {
        'M': '目录',
        'C': '菜单',
        'F': '按钮'
      }
      return t[menuType]
    }
  }
}
</script>
<style lang='scss' scoped>
.container {
  padding: 12px;
}
.top_bar {
  display: flex;
}
.tool_bar {
  margin-bottom: 10px;
}
</style>
