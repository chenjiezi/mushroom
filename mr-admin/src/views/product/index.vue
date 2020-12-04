<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar">
        <el-form :inline="true" size="mini" :model="searchForm" ref="searchForm" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="productName">
            <el-input type="text" v-model="searchForm.productName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="cascaderCategoryId">
            <el-cascader
              ref="cascader"
              v-model="searchForm.cascaderCategoryId"
              :options="categoryList"
              :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }"
              placeholder="请选择"
              :show-all-levels="false"></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" size="mini"  style="" :header-cell-style="{'background-color': '#fff'}" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="productId" label="ID" ></el-table-column>
        <el-table-column align="center" prop="productImg" label="商品图片" width="90">
          <template slot-scope="scope">
            <template v-if="scope.row.productImg">
              <el-image
                style="width: 100%;padding: 2px"
                :src="scope.row.productImg"
                :preview-src-list="[scope.row.productImg]"
              >
              </el-image>
            </template>
            <template v-else>
              无
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productName" label="商品名称" width="200"></el-table-column>
        <el-table-column align="center" prop="productPrice" label="单价" width="100" ></el-table-column>
        <el-table-column align="center" prop="stockNum" label="库存" width="100"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="商品分类"  width="100"></el-table-column>
        <el-table-column align="center" prop="productStatusName" label="商品状态" width="250">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.productStatus"
              :active-value="true"
              :inactive-value="false"
              @change="productStatusChange(scope.row)"
              active-text="上架"
              inactive-text="下架">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="250"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="编辑时间" width="250"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="productDetailFunc(scope)" type="text" size="small">商品详情</el-button>
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
    <el-dialog
      :title="dialogTitle"
      @close="closeDialog"
      :visible.sync="DialogVisible"
      :close-on-click-modal="false">
      <!-- 弹框- 新增、编辑 -->
      <template v-if="!isDel">
        <el-form ref="productForm" :model="productForm" :rules="productFormRules" label-width="180px">
          <el-form-item label="商品名称" prop="productName">
            <el-input v-model="productForm.productName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品单价" prop="productPrice">
            <el-input-number size="small" v-model="productForm.productPrice"></el-input-number>
          </el-form-item>
          <el-form-item label="商品库存" prop="stockNum">
            <el-input-number size="small" v-model="productForm.stockNum" :precision="0"></el-input-number>
          </el-form-item>
          <el-form-item label="商品分类" prop="cascaderCategoryId">
            <el-cascader
              v-model="productForm.cascaderCategoryId"
              :options="categoryList"
              :props="{ value: 'categoryId', label: 'categoryName', children: 'children' }"
              placeholder="请选择商品分类"
              :show-all-levels="false"></el-cascader>
          </el-form-item>
          <el-form-item label="商品状态" prop="productStatus">
            <el-switch
              v-model="productForm.productStatus"
              :active-value="true"
              :inactive-value="false"
              active-text="上架"
              inactive-text="下架">
            </el-switch>
          </el-form-item>
          <el-form-item label="商品图片" prop="productImg">
            <el-upload
              action="/api/pic/singleImage"
              list-type="picture-card"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :file-list="fileList"
              :headers="headers"
              :disabled="this.fileList.length > 0"
              :auto-upload="true">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}" style="height: 100%;">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                  >
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
                <div slot="tip" class="el-upload__tip">只能上传一张图片，如需更改，删除已有图片再次添加!</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
      <!-- 弹框-删除 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该数据吗？</h1>
      </template>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()" :loading="saveBtnLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/product'
import * as categoryApi from '@/api/category'
import { getToken } from '@/utils/auth'
export default {
  data () {
    return {
      headers: {Authorization: `Bearer ${getToken()}`},
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      dialogTitle: '弹窗',
      DialogVisible: false,
      isAdd: false,
      isEdit: false,
      isDel: false,
      editBtnloading: false,
      saveBtnLoading: false,
      curProductId: null, // 当前商品信息Id
      tableData: [],
      categoryList: [],
      productForm: {
        productName: '',
        productPrice: '',
        stockNum: 0,
        cascaderCategoryId: [],
        categoryId: '',
        productStatus: 0,
      },
      searchForm: {
        productName: '',
        cascaderCategoryId: [],
        categoryId: ''
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      productFormRules: {
        productName: [
          { required: true, message: '商品名称为必填项', trigger: 'blur'}
        ],
        productPrice: [
          { required: true, message: '商品单价为必填项', trigger: 'blur'},
          // { type: 'number', message: '商品单价为数值类型', trigger: 'blur'}
        ],
        stockNum: [
          { required: true, message: '商品库存为必填项', trigger: 'blur'},
          // { type: 'number', message: '商品库存为数值类型', trigger: 'blur'}
        ],
      }
    }
  },
  async created () {
    await this.getCategorylist() // 商品分类数据
    await this.getData() // 商品数据
  },
  methods: {
    productStatusChange (data) {
      const { productId, productStatus } = data
      api.updateProduct({ productId, productStatus }).then(res => {
        this.$message.closeAll()
        if (res.code === 200) {
          this.$message.success(res.message)
        }
      }).finally(() => {
        this.getData()
      })
    },
    // Dialog 关闭的回调
    closeDialog () {
      // 问题：打开过有商品图片的编辑弹窗，关闭后再次打开没有商品图片的编辑弹窗时，有去除上一张商品图片预览的动画。
      // 解决方法：在关闭编辑弹窗时，就将图片预览去除。
      this.fileList = []
    },
    // 上传图片
    handleSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.$message.success(response.message)
        this.productForm.productImg = response.data
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.productForm.productImg = ''
      this.fileList = []
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 重定向到商品详情编辑页面
    productDetailFunc (scope) {
      this.$router.push({
        path: `/product/productDetail/${scope.row.productId}`,
        query: {productInfo: scope.row}
      })
    },
    submitForm () {
      this.searchForm.categoryId = this.searchForm.cascaderCategoryId[2]
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
      this.dialogTitle = '新增商品'
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.productForm.resetFields()
        this.productForm = {}
        this.fileList = []
      })
    },
    edit (scope) {
      this.isAdd = false
      this.isEdit = true
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑商品：${scope.row.productName || '-'}`
      // 根据productId查询商品信息
      api.getProductInfoByProductId(scope.row.productId).then((res) => {
        if (res.code === 200) {
          this.DialogVisible = true
          this.$nextTick(() => {
            this.$refs.productForm.resetFields()
            this.productForm = {
              productId: res.data.productId,
              productName: res.data.productName,
              productPrice: res.data.productPrice,
              stockNum: res.data.stockNum,
              productStatus: res.data.productStatus,
              productImg: res.data.productImg,
              categoryId: res.data.categoryId,
              // cascaderCategoryId 用于显示
              cascaderCategoryId: this.getCascaderCategoryId(res.data.categoryId)
            }
            // 展示图片
            if (res.data.productImg) {
              this.fileList = [{
                name: res.data.productImg,
                url: res.data.productImg
              }]
            }
          })
        }
      }).finally(() => {
        this.editBtnloading = false
      })
    },
    getCascaderCategoryId (idx) {
      /**
       * 联动下拉框需要一二三级分类商品的id的数组
       * 通过 三级商品分类categoryId 去找他的一级二级的 categoryId
       */
      let temp = []
      this.categoryList.forEach(item1 => {
        if (item1.children) {
          item1.children.forEach(item2 => {
            if (item2.children) {
              item2.children.forEach(item3 => {
                if (idx === item3.categoryId) {
                  temp = [item2.parentId, item3.parentId, item3.categoryId]
                }
              })
            }
          })
        }
      })
      return temp
    },
    del (scope) {
      this.isAdd = false
      this.isEdit = false
      this.isDel = true
      this.saveBtnLoading = false
      this.curProductId = scope.row.productId
      this.dialogTitle = `删除商品：${scope.row.productName || '-'}`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.productForm.validate((valid) => {
          if (valid) {
            this.productForm.categoryId = this.productForm.cascaderCategoryId[2]

            console.log('要提交的productForm：', this.productForm)
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
      api.getProductList({
        ...this.searchForm,
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          // 根据 categoryId 获取 categoryName
          res.data.resultList.map(item => {
            let isFirst = false
            this.categoryList.forEach(item1 => {
              if (item1.children) {
                item1.children.forEach(item2 => {
                  if (item2.children) {
                    item2.children.forEach(item3 => {
                      if (!isFirst) {
                        if (item.categoryId === item3.categoryId) {
                          item.categoryName = item3.categoryName
                          isFirst = true
                        } else {
                          item.categoryName = '-'
                        }
                      }
                    })
                  }
                })
              }
            })
            item.productStatusName = item.productStatus == 1 ? '售卖中' : '已下架'
            item.createTime = item.createTime ? item.createTime.split('.')[0].replace('T', ' ') : item.createTime
            item.updateTime = item.updateTime ? item.updateTime.split('.')[0].replace('T', ' ') : item.updateTime
            return item
          })
          this.tableData = res.data.resultList
          this.page.total = res.data.total
          this.page.currentPage = res.data.currentPage
          this.page.pageSize = res.data.pageSize
        }
      })
    },
    saveData () {
      api.saveProduct(this.productForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        }
        /*else {
          this.$message.error(res.message)
        }*/
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    editData () {
      api.updateProduct(this.productForm).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        }
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    delData () {
      api.deleteProductInfoByProductId(this.curProductId).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
        }
      }).finally(() => {
        this.getData()
        this.saveBtnLoading = false
        this.DialogVisible = false
      })
    },
    getCategorylist () {
      categoryApi.getCategorylist().then(res => {
        if (res.code === 200) {
          this.categoryList = res.data
        }
      })
    },
    changePage (currentPage) {
      this.page.currentPage = currentPage
      this.getData()
    },
    changeSize (pageSize) {
      this.page.pageSize = pageSize
      this.getData()
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
