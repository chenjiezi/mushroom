<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar"></div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="addFisrtLevel()">新增一级菜单</el-button>
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
        <el-table-column align="center" fixed prop="menuId" label="ID">
        </el-table-column>
        <el-table-column align="center" prop="menuName" label="菜单名称">
        </el-table-column>
        <el-table-column align="center" prop="levelNumToText" label="菜单级别">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="编辑时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="scope.row.levelNum !== 3" @click="addSecondOrThirdLevel(scope)" type="text" size="small">新增</el-button>
            <el-button :disabled="editBtnLoading" @click="edit(scope)" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="DialogVisible" :close-on-click-modal="false">
      <!-- 弹框 新增/编辑 操作 -->
      <template v-if="!isDel">
        <!-- 操作 一级菜单 表单 -->
        <template v-if="isFirstLevel">
          <el-form ref="menuForm1" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <el-form-item label="一级菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 二级菜单 表单 -->
        <template v-if="isSecondLevel">
          <el-form ref="menuForm2" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <el-form-item label="一级菜单名称" prop="parentId">
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
            <el-form-item label="二级菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 三级菜单 表单 -->
        <template v-if="isThirdLevel">
          <el-form ref="menuForm3" :model="menuForm" :rules="menuFormRules" label-width="180px">
            <el-form-item label="一/二级菜单名称" prop="menuIdArr">
              <el-cascader
                v-model="menuForm.menuIdArr"
                :options="firstAndSecondList"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                :disabled="firstAndSecondDisabled"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="三级级菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off"></el-input>
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
    addFisrtLevel () { // 显示 一级 新增操作弹窗
      this.isTrue(['isAdd', 'isFirstLevel'])
      this.dialogTitle = '新增一级菜单'
      this.DialogVisible = true
      this.$nextTick(() => {
        // 重置表单
        this.$refs.menuForm1.resetFields();
        this.menuForm = {
          parentId: '0',
          levelNum: 1
        }
      })
    },
    addSecondOrThirdLevel ({row}) { // 显示 一/二级 新增操作弹窗
      if (row.levelNum === 2) {
        this.isTrue(['isAdd', 'isThirdLevel'])
        this.dialogTitle = '新增三级菜单'
        this.firstAndSecondDisabled = true
      } else if (row.levelNum === 1){
        this.isTrue(['isAdd', 'isSecondLevel'])
        this.dialogTitle = '新增二级菜单'
        this.firstDisabled = true
      }
      this.DialogVisible = true
      this.$nextTick(() => {
        // 重置表单
        this.$refs[`menuForm${row.levelNum + 1}`].resetFields();
        if (row.levelNum === 2) {
          this.menuForm = {
            menuIdArr: [row.parentId, row.menuId],
            levelNum: row.levelNum + 1
          }
        } else if (row.levelNum === 1) {
          this.menuForm = {
            parentId: row.menuId,
            levelNum: row.levelNum + 1
          }
        }
      })
    },
    edit ({row}) { // 显示 一/二/三级 编辑操作弹窗
      this.editBtnLoading = true
      if (row.levelNum === 3) {
        this.isTrue(['isEdit', 'isThirdLevel'])
        this.firstAndSecondDisabled = false
        this.dialogTitle = `编辑三级菜单：${row.menuName}`
      } else if (row.levelNum === 2) {
        this.isTrue(['isEdit', 'isSecondLevel'])
        this.firstDisabled = false
        this.dialogTitle = `编辑二级菜单：${row.menuName}`
      } else {
        this.isTrue(['isEdit', 'isFirstLevel'])
        this.dialogTitle = `编辑一级菜单：${row.menuName}`
      }
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs[`menuForm${row.levelNum}`].resetFields();
        if (row.levelNum === 3) {
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
            menuIdArr: [ppId, row.parentId]
          }
        } else if (row.levelNum === 2){
          this.menuForm = {
            menuId: row.menuId,
            menuName: row.menuName,
            parentId: row.parentId,
            levelNum: row.levelNum
          }
        } else {
          this.menuForm = {
            menuId: row.menuId,
            menuName: row.menuName,
            parentId: row.parentId,
            levelNum: row.levelNum
          }
        }
        this.editBtnLoading = false
      })
    },
    del ({row}) { // 显示 一/二/三级 删除操作弹窗
      if (row.levelNum === 3) {
        this.dialogTitle = `删除三级菜单：${row.menuName}`
      } else if (row.levelNum === 2){
        this.dialogTitle = `删除二级菜单：${row.menuName}`
      } else {
        this.dialogTitle = `删除一级菜单：${row.menuName}`
      }
      this.curId = row.menuId // 当前数据id
      this.isTrue(['isDel'])
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {

        this.$refs[`menuForm${this.menuForm.levelNum}`].validate((valid) => {
          if (valid) {
            if (this.menuForm.levelNum === 3) {
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
          item.levelNumToText = this.levelNumFormat(item.levelNum)
          item.createTime = this.dateFormat(item, 'createTime')
          item.updateTime = this.dateFormat(item, 'updateTime')
          if (item.children) {
            item.children.map(item1 => {
              item1.levelNumToText = this.levelNumFormat(item1.levelNum)
              item1.createTime = this.dateFormat(item1, 'createTime')
              item1.updateTime = this.dateFormat(item1, 'updateTime')
              if (item1.children) {
                item1.children.map(item2 => {
                  item2.levelNumToText = this.levelNumFormat(item2.levelNum)
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
      // TODO: 待优化
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
    levelNumFormat (levelNum) {
      const t = ['一', '二', '三', '四', '五']
      return t[levelNum - 1]
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
