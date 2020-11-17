<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar"></div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="addFisrtLevel()">新增一级商品分类</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        :data="tableData"
        border size="mini"
        default-expand-all
        row-key="categoryId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" fixed prop="categoryId" label="ID">
        </el-table-column>
        <el-table-column align="center" prop="categoryName" label="商品分类名称">
        </el-table-column>
        <el-table-column align="center" prop="levelNumToText" label="商品分类级别">
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="编辑时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="scope.row.levelNum !== 3" @click="add(scope)" type="text" size="small">新增</el-button>
            <el-button @click="edit(scope)" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="DialogVisible" :close-on-click-modal="false">
      <!-- 弹框 新增/编辑 操作 -->
      <template v-if="!isDel">
        <!-- 操作 一级商品分类 表单 -->
        <template v-if="isFirstLevel">
          <el-form ref="categoryForm1" :model="categoryForm" :rules="categoryFormRules" label-width="180px">
            <el-form-item label="一级商品分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 二级商品分类 表单 -->
        <template v-if="isSecondLevel">
          <el-form ref="categoryForm2" :model="categoryForm" :rules="categoryFormRules" label-width="180px">
            <el-form-item label="一级商品分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="二级商品分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 操作 三级商品分类 表单 -->
        <template v-if="isThirdLevel">
          <el-form ref="categoryForm3" :model="categoryForm" :rules="categoryFormRules" label-width="180px">
            <el-form-item label="一/二级商品分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="三级级商品分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'

export default {
  data () {
    return {
      dialogTitle: '弹窗',
      DialogVisible: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      isFirstLevel: false,
      isSecondLevel: false,
      isThirdLevel: false,
      tableData: [],
      categoryForm: {
        categoryName: '',
        levelNum: ''
      },
      categoryFormRules: {
        categoryName: [
          { required: true, message: '必填项', trigger: 'change'}
        ]
      },
      addForm: {},
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addFisrtLevel () { // 显示 一级 新增操作弹窗
    // TODO: dev
      this.isTrue([])
      this.DialogVisible = true
    },
    addSecondOrThirdLevel ({row}) { // 显示 二/三级 新增操作弹窗
      if (row.levelNum === 2) {
      this.isSecondLevel = true
      this.isSecondLevel = true
      this.isSecondLevel = true
      } else if (row.levelNum === 3){
      this.isThirdLevel = true
      this.isThirdLevel = true
      this.isThirdLevel = true
      }
      this.isAdd = true
      this.isEdit = false
      this.isDel = false
      this.DialogVisible = true
      console.log(row)
    },
    edit ({row}) { // 显示 一/二/三级 编辑操作弹窗
      console.log(row)
    },
    del ({row}) { // 显示 一/二/三级 删除操作弹窗
      console.log(row)
    },
    save () {

    },
    getData () {
      this.$axios({
        url: '/category/list',
        method: 'get',
      }).then(res => {
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
        console.log('res：', res)
      })
    },
    saveData () {},
    editData () {},
    isTrue (arr) { 
      // TODO: 待优化
      const t = ['isAdd' ,'isEdit' ,'isDel' ,'isFirstLevel' ,'isSecondLevel' ,'isThirdLevel']
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
      const t = ['一级', '二级', '三级']
      return t[levelNum - 1]
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
