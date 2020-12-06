"use strict";

// 搜索
$('#search-btn').click(function () {
  var searchContent = $('#search-ipt').val().trim()
  window.location.href = `search.html?search=${searchContent}`
})

// 渲染分类栏模板
$('#category-bar').append(render_category_bar_html_template())

// 渲染轮播图模板
$('#carousel-example').append(render_carousel_html_template())
// 配置轮播图参数 TODO: 数据比逻辑晚到，为什么不会报错？
$('#carousel-example').carousel({
  interval: 1800
})

// 渲染最新商品模板
$('#new-product').append(render_new_product_html_template())

// 渲染商品模板
$('#product-list').append(render_product_list_html_template())

// 分类栏模板
function render_category_bar_html_template() {
  return `
    <a href="#" class="item">女装 男装 穿搭</a>
    <a href="#" class="item">家具 家饰 家纺</a>
    <a href="#" class="item">运动 户外 乐器</a>
    <a href="#" class="item">游戏 动漫 影视</a>
    <a href="#" class="item">美妆 清洁 宠物</a>
    <a href="#" class="item">工具 装修 建材</a>
    <a href="#" class="item">鞋靴 箱包 配件</a>
    <a href="#" class="item">sada</a>
    <a href="#" class="item">玩具 孕产 用品</a>
  `
}

// 轮播图模板
function render_carousel_html_template () {
  return `
    <ol class="carousel-indicators">
      <li data-target="#carousel-example" data-slide-to="0" class="active"></li>
      <li data-target="#carousel-example" data-slide-to="1"></li>
      <li data-target="#carousel-example" data-slide-to="2"></li>
    </ol>

    <div class="carousel-inner" role="listbox">
      <div class="item active">
        <a href="product-detail.html">
          <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d01b4f4d20d1c909454b296f34143004.jpg"></a>
      </div>
      <div class="item">
        <a href="product-detail.html">
          <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/64485128ae7c0bfd980c694f092fe25f.jpg">
        </a>
      </div>
      <div class="item">
        <a href="product-detail.html">
          <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/d00e132d1b4fd7a796b35bcfe54bc2c8.jpg">
        </a>
      </div>
    </div>
  ` 
}

// 最新商品模板
function render_new_product_html_template () {
  return `
    <div class="container">
      <div class="title">
        <h3 class="types-title">
          <span>新品上线</span>
        </h3>
      </div>
      <div class="product-list">
        <div class="product-card-warp">
          <div class="product-card">
            <img src="//cdn.cnbj1.fds.api.mi-img.com/mi-mall/bb93febdb5b56fd328d27c54513163b8.png" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>
        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/4e75e528fb468aee107f551179aa0799.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>

        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/13f10e47913f9dc82e6c6a6199f413cd.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>

        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c892a7640f58032489cbff8a948b50f9.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>
      </div>
    </div>
  `
}

// 商品模板
function render_product_list_html_template () {
  return `
  <div class="product">
    <div class="container">
      <div class="title">
        <h3 class="types-title">
          <span>女装 男装 穿搭</span>
        </h3>
      </div>
      <div class="product-list">
        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/ef4c68fed730ec26bf2fa0ff620975c5.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>
        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/ef6b4e9b9151849b3b1fb1dbf069c6ed.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>

        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/b8c63a2024528fe5410ebe669b7d2407.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>

        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj0.fds.api.mi-img.com/b2c-mimall-media/321610e787393c42e5cb2e5730a7681d.jpg"
              alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>
        <div class="product-card-warp">
          <div class="product-card">
            <img src="https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/1f32af53d1ad60f4980146f6a2b81019.jpg" alt="">
            <p class="product-name"><strong>小米有线耳机（K歌版） 白色</strong></p>
            <p class="price">149元</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}