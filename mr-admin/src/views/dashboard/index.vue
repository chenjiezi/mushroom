<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <!--<el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="user" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户数量</div>
            <count-to :start-val="0" :end-val="userData.userCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>-->
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">商品数量</div>
            <count-to :start-val="0" :end-val="productData.productCount" :duration="3000" class="card-panel-num"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">下架商品</div>
            <count-to :start-val="0" :end-val="productData.offShelf" :duration="3000" class="card-panel-num"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">上架商品</div>
            <count-to :start-val="0" :end-val="productData.onShelf" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数量</div>
            <count-to :start-val="0" :end-val="orderData.orderCount" :duration="3600" class="card-panel-num"/>
          </div>

          <div class="card-panel-description">
            <div class="card-panel-text">已提交订单</div>
            <count-to :start-val="0" :end-val="orderData.isSubmitOrderCount" :duration="3600" class="card-panel-num"/>
          </div>

          <div class="card-panel-description">
            <div class="card-panel-text">未提交订单</div>
            <count-to :start-val="0" :end-val="orderData.noSubmitOrderCount" :duration="3600" class="card-panel-num"/>
          </div>

          <div class="card-panel-description">
            <div class="card-panel-text">已支付</div>
            <count-to :start-val="0" :end-val="orderData.paySuccessCount" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <div ref="categoryData"></div>
    <div class="chart-wrapper">
      <PieChart/>
    </div>
    <div class="chart-wrapper">
      <CategoryBar/>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/dashboard'

import CountTo from 'vue-count-to'
import PieChart from './components/PieChart'
import CategoryBar from './components/CategoryBar'


export default {
  name: 'Dashboard',
  data() {
    return {
      orderData: {},
      userData: {},
      productData: {},
    }
  },
  components: {
    CountTo,
    PieChart,
    CategoryBar
  },
  mounted() {
    this.getUserData();
    this.getProductData();
    this.getOrderData();
  },
  methods: {
    // api.getCategorylist().then(res => {});
    getUserData() {
      api.getUserData().then(res => {
        this.userData = res.data;
      })
    },

    getProductData() {
      api.getProductData().then(res => {
        this.productData = res.data;
      })
    },

    getOrderData() {
      api.getOrderData().then(res => {
        this.orderData = res.data;
      })
    }
  },

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {

  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }


}

.chart-wrapper {
  background: #ffffff;
  padding: 16px 16px 0;
  border-radius: 4px;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  margin-bottom: 32px;
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-radius: 4px;
    //border: 1px solid #dcdde1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px 10px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shoppingCard {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shoppingCard {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {

      .card-panel-text {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
