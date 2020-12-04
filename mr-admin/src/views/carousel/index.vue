<template>
  <div class='container'>
    <div class="top_bar">
      <div class="tool_bar">
        <el-button type="primary" size="mini" @click="add()">新增</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" size="mini" style="" :header-cell-style="{'background-color': '#fff'}" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="carouselId" label="ID"></el-table-column>
        <el-table-column align="center" prop="carouselUrl" label="轮播图" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.carouselUrl">
              <el-image
                style="width: 100%;padding: 2px"
                :src="scope.row.carouselUrl"
                :preview-src-list="[scope.row.carouselUrl]"
                >
              </el-image>
            </template>
            <template v-else>
              无
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="redirectUrl" label="跳转地址"></el-table-column>
        <el-table-column align="center" prop="carouselRank" label="展示顺序" width="100"></el-table-column>
        <el-table-column align="center" prop="isShow" label="是否展示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              :active-value="true"
              :inactive-value="false"
              @change="isShowChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="编辑时间"></el-table-column>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="DialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false">
      <!-- 弹框- 新增、编辑 -->
      <template v-if="!isDel">
        <el-form ref="carouselForm" :model="carouselForm" :rules="carouselFormRules" label-width="180px">
          <el-form-item label="轮播图跳转url" prop="redirectUrl">
            <el-input v-model="carouselForm.redirectUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="展示顺序" prop="carouselRank">
            <el-input-number v-model="carouselForm.carouselRank" size="mini"  label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="是否展示" prop="isShow">
            <el-switch
              v-model="carouselForm.isShow"
              :active-value="true"
              :inactive-value="false">
            </el-switch>
          </el-form-item>
          <el-form-item label="轮播图" prop="carouselUrl">
            <el-upload
              action="/api/pic/singleImage"
              list-type="picture-card"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :headers="headers"
              :file-list="fileList"
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
  </div>
</template>

<script>
import * as api from '@/api/carousel'
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
      curId: null, // 当前Id
      tableData: [],
      carouselForm: {
        redirectUrl: '',
        carouselRank: '',
        isShow: false
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      carouselFormRules: {
        redirectUrl: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        carouselRank: [
          { required: true, message: '必填项', trigger: 'blur'},
        ],
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    isShowChange (data) {
      const { carouselId, isShow } = data
      api.updateCarousel({ carouselId, isShow }).then(res => {
        this.$message.closeAll()
        if (res.code === 200) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
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
        this.carouselForm.carouselUrl = response.data
      } else {
        this.$message.error(response.message)
      }
    },
    // 移除图片
    handleRemove(file, fileList) {
      this.carouselForm.carouselUrl = ''
      this.fileList = []
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    add () {
      this.isAdd = true
      this.isEdit = false
      this.isDel = false
      this.saveBtnLoading = false
      this.dialogTitle = '新增轮播图'
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.carouselForm.resetFields()
        this.carouselForm = {
          carouselRank:0,
          isShow: false
        }
        this.fileList = []
      })
    },
    edit (scope) {
      this.isAdd = false
      this.isEdit = true
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑轮播图 ID：${scope.row.carouselId || '-'}`
      // 根据CarouseId查询轮播图信息
      api.getCarouselInfoByCarouselId(scope.row.carouselId).then((res) => {
        if (res.code === 200) {
          this.DialogVisible = true
          this.$nextTick(() => {
            this.$refs.carouselForm.resetFields()
            this.carouselForm = {
              carouselId: res.data.carouselId,
              carouselUrl: res.data.carouselUrl,
              redirectUrl: res.data.redirectUrl,
              carouselRank: res.data.carouselRank,
              isShow: res.data.isShow
            }
            // 展示图片
            if (res.data.carouselUrl) {
              this.fileList = [{
                name: res.data.carouselUrl,
                url: res.data.carouselUrl
              }]
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
      this.curId = scope.row.carouselId
      this.dialogTitle = `删除轮播图 ID：${scope.row.carouselId || '-'}`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.carouselForm.validate((valid) => {
          if (valid) {
            // console.log('要提交的carouselForm：', this.carouselForm)
            if (this.isAdd) {
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
        this.page.currentPage = 1 // 查询第一页
        this.delData() // 发送删除数据请求
      }
    },
    getData () {
      api.getCarouselList({
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.map(item => {
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
      api.saveCarousel(this.carouselForm).then(res => {
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
      api.updateCarousel(this.carouselForm).then(res => {
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
      api.deleteCarouselByCarouselId(this.curId).then(res => {
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
    dateFormat (item, time) {
      return item[time] ? item[time].split('.')[0].replace('T', ' ') : item[time]
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
  margin-bottom: 12px;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
