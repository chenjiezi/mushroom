<template>
  <div class='container'>
    <div class="top_bar">
      <div class="search_bar">
        <el-form :inline="true" size="small" :model="searchForm" ref="searchForm" class="demo-ruleForm">
          <el-form-item label="下单时间范围" prop="dateTimeRange">
            <el-date-picker
              v-model="searchForm.dateTimeRange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" border size="mini" :cell-style="{padding: '2px 0'}">
        <el-table-column align="center" prop="orderNo" label="订单号" width="180"></el-table-column>
        <el-table-column align="center" prop="payStatusText" label="订单状态" width="80"></el-table-column>
        <el-table-column align="center" prop="orderStatusText" label="购买状态" width="80"></el-table-column>
        <el-table-column align="center" prop="totalPrice" label="订单总价(元)" width="100"></el-table-column>
        <el-table-column align="center" prop="payTime" label="下单时间"></el-table-column>
        <el-table-column align="center" prop="userName" label="用户昵称"></el-table-column>
        <el-table-column align="center" prop="userPhone" label="用户手机号" width="140"></el-table-column>
        <el-table-column align="center" prop="userAddress" label="送货地址"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="info(scope)" :disabled="editBtnloading" type="text" size="small">订单详情</el-button>
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
      <!-- 弹框- 订单详情/编辑 -->
      <template v-if="!isDel">
        <!-- 编辑 -->
        <template v-if="isEdit">
          <el-form ref="orderForm" :model="orderForm" :rules="orderFormRules" label-width="100px">
          <el-form-item label="订单总价" prop="totalPrice">
            <el-input v-model="orderForm.totalPrice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="orderForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号" prop="userPhone">
            <el-input v-model="orderForm.userPhone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="送货地址" prop="userAddress">
            <el-input v-model="orderForm.userAddress" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        </template>
        <!-- 订单详情 -->
        <template v-else>
          <el-table :data="orderItems" border size="mini" :cell-style="{padding: '2px 0'}">
            <el-table-column align="center" prop="productName" label="商品名称"></el-table-column>
            <el-table-column align="center" prop="productImg" label="商品图片">
              <template slot-scope="scope">
                <template v-if="scope.row.productImg">
                  <el-image 
                    style="width: 30px; height: 30px"
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
            <el-table-column align="center" prop="productPrice" label="单价"></el-table-column>
            <el-table-column align="center" prop="productCount" label="数量"></el-table-column>
          </el-table>
        </template>
      </template>
      <!-- 弹框-删除 -->
      <template v-else>
        <h1 style="text-align:center;">确定删除该订单吗？</h1>
      </template>
      <div v-if="!isInfo" slot="footer" class="dialog-footer" style="display:flex;justify-content:center;">
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
      isInfo: false,
      isEdit: false,
      isDel: false,
      editBtnloading: false,
      saveBtnLoading: false,
      curId: null, // 当前Id
      tableData: [],
      categoryList: [],
      orderForm: {
        totalPrice: '',
        userName: '',
        userPhone: '',
        userAddress: ''
      },
      orderItems: [],
      searchForm: {
        dateTimeRange: []
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 10
      },
      orderFormRules: {
        totalPrice: [
          { required: true, message: '必填项', trigger: 'blur'}
        ],
        userName: [
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
      if (!this.searchForm.dateTimeRange || this.searchForm.dateTimeRange.length <= 0) {
        this.$message.closeAll()
        this.$message.warning('请选择日期!')
        return false
      }
      this.page.currentPage = 1
      this.searchForm.startTime = this.searchForm.dateTimeRange[0]
      this.searchForm.endTime = this.searchForm.dateTimeRange[1]
      this.getData()
    },
    resetForm () {
      this.$refs.searchForm.resetFields()
      this.page.currentPage = 1
      this.searchForm = {}
      this.getData()
    },
    // 查看订单详情
    info (scope) {
      this.isInfo = true
      this.isEdit = false
      this.isDel = false
      this.editBtnloading = true
      this.dialogTitle = `订单详情 [订单号：${scope.row.orderNo || '-'}]`
      api.getOrderInfoByOrderId(scope.row.orderId).then(res => {
        if (res.code === 200) {
          if (res.data.orderItems && res.data.orderItems.length > 0) {
            this.DialogVisible = true
            this.orderItems = res.data.orderItems
          } else {
            this.$message.info('无订单详情')
          }
        } else {
          this.$message.error('获取数据失败！')
        }
      }).finally(() => {
        this.editBtnloading = false
      })
    },
    edit (scope) {
      this.isEdit = true
      this.isInfo = false
      this.isDel = false
      this.editBtnloading = true
      this.saveBtnLoading = false
      this.dialogTitle = `编辑订单 [订单号：${scope.row.orderNo || '-'}]`
      this.DialogVisible = true
      this.$nextTick(() => {
        this.$refs.orderForm.resetFields()
        this.orderForm = {
          orderId: scope.row.orderId,
          totalPrice: scope.row.totalPrice,
          userName: scope.row.userName,
          userPhone: scope.row.userPhone,
          userAddress: scope.row.userAddress
        }
      })
      this.editBtnloading = false
    },
    del (scope) {
      this.isEdit = false
      this.isInfo = false
      this.isDel = true
      this.saveBtnLoading = false
      this.curId = scope.row.orderId
      this.dialogTitle = `删除订单 [订单号：${scope.row.orderNo || '-'}]`
      this.DialogVisible = true
    },
    save () {
      this.saveBtnLoading = true
      if (!this.isDel) {
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            console.log('要提交的orderForm：', this.orderForm)
            this.editData() // 发送编辑数据请求
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
      api.getOrderList({
        ...this.searchForm,
        ...this.page
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.resultList.map(item => {
            if (item.payStatus == 1) {
              item.payStatusText = '已支付'
            } else if (item.payStatus == 0) {
              item.payStatusText = '未支付'
            } else {
              item.payStatusText = '-'
            }
            if (item.orderStatus == 1) {
              item.orderStatusText = '已提交'
            } else if (item.orderStatus == 0) {
              item.orderStatusText = '未提交'
            } else {
              item.orderStatusText = '-'
            }
            
            item.payTime = this.dateFormat(item, 'payTime')
            return item
          })
          this.page.total = res.data.total
          this.page.currentPage = res.data.currentPage
          this.page.pageSize = res.data.pageSize
        }
      })
    },
    editData () {
      api.updateOrder(this.orderForm).then(res => {
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
      api.deleteOrderByOrderId(this.curId).then(res => {
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
      return item[time] ? item[time].replace('T', ' ') : item[time]
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
