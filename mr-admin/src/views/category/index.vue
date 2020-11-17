<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar"></div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="addOneLevel('oneLevelForm')">新增一级分类</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        :data="tableData"
        border size="mini"
        style=""
        :header-cell-style="{'background-color': '#fff'}"
        default-expand-all
        row-key="categoryId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :cell-style="{padding: '2px 0'}">
        <el-table-column fixed prop="categoryId" label="categoryId">
        </el-table-column>
        <el-table-column prop="categoryName" label="categoryName">
        </el-table-column>
        <el-table-column prop="levelNum" label="levelNum">
        </el-table-column>
        <el-table-column prop="createTime" label="createTime">
        </el-table-column>
        <el-table-column prop="updateTime" label="updateTime">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <!-- TODO: 判断一级二级三级， -->
            <el-button v-if="scope.row.parentId == 0" @click="addSecondLevel(scope)" type="text" size="small">新增</el-button>
            <el-button @click="edit(scope)" type="text" size="small">编辑</el-button>
            <el-button @click="del(scope)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹框 一级新增 -->
    <el-dialog title="新增一级商品分类" :visible.sync="oneLevelDialogVisible">
      <el-form ref="oneLevelForm" :model="oneLevelForm" :rules="oneLevelFormRule" label-width="180px">
        <el-form-item label="一级商品分类名称" prop="categoryName">
          <el-input v-model="oneLevelForm.categoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类优先级" prop="levelNum">
          <el-input v-model="oneLevelForm.levelNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="resetForm('oneLevelForm')">取 消</el-button>
        <el-button type="primary" @click="oneLevelDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 二级新增/编辑 -->
    <el-dialog title="新增二级商品分类" :visible.sync="add2DialogVisible">
      <el-form :model="addForm" label-width="180px">
        <el-form-item label="一级商品分类名称">
          <el-select v-model="addForm.region" placeholder="请选择商品分类优先级">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级商品分类名称">
          <el-input v-model="addForm.namesa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类优先级">
          <el-input v-model="addForm.asa" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="add2DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add2DialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 删除 -->
    <el-dialog title="删除商品分类" :visible.sync="delDialogVisible">
      <h1>确定删除商品分类名称为“”？</h1>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="oneLevelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="oneLevelDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from './api'

export default {
  data () {
    return {
      tableData: [],
      oneLevelDialogVisible: false,
      add2DialogVisible: false,
      editDialogVisible: false,
      delDialogVisible: false,
      oneLevelForm: {
        categoryName: '',
        levelNum: ''
      },
      oneLevelFormRule: {
        categoryName: [
          { required: true, message: '必填项', trigger: 'change'}
        ]
      },
      addForm: {},
    }
  },
  created () {
    this.$axios({
      url: '/category/list',
      method: 'get',
    }).then(res => {
      this.tableData = res.data
      console.log('res：', res)
    })
  },
  methods: {
    // 新增一级
    addOneLevel (formName) {
      this.oneLevelDialogVisible = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      })
    },
    // 新增二级
    addSecondLevel () {
      this.add2DialogVisible = true
    },
    edit (scope) {
      console.log(scope)
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
