"use strict";

// 搜索按钮操作
$('#search-btn').click(function () {
  var productName = $('#search-ipt').val().trim()
  window.location.href = `search.html?productName=${productName}`
})

// 请求分类栏数据
_productApi.getCategoryList(function (res) {
  if (res.code === 200) {
    // 渲染分类栏模板
    $('#category-bar').append(render_category_bar_html_template(res.data))
  }
})

// 请求轮播图数据
_productApi.getCarouselList(function (res) {
  if (res.code === 200) {
    // 渲染轮播图模板
    $('#carousel-example').append(render_carousel_html_template(res.data))
    // 配置轮播图参数 TODO: 数据比逻辑晚到，为什么不会报错？
    $('#carousel-example').carousel({
      interval: 2800
    })
  }
})

// 请求最新商品数据
_productApi.getNewProduct(5, function (res) {
  if (res.code === 200) {
    // 渲染最新商品模板
    $('#new-product').append(render_new_product_html_template(res.data))
  }
})

// 请求分类商品模板
_productApi.getHomeCategory(5, function (res) {
  if (res.code === 200) {
    res.data.forEach(item => {
      // 渲染商品模板
      $('#home-category').append(render_product_list_html_template(item))
    })
  }
})

// 分类栏模板
function render_category_bar_html_template(data) {
  var categoryContent = ``
  var categoryItem = ``

  // 一级
  data.forEach(item => {
    var categoryHide = ``

    // 二级
    item.children.forEach(item2 => {
      if (item2.children) {
        var categoryHideItem = ``
  
        // 三级
        item2.children.forEach(item3 => {
          categoryHideItem += `<a target="_blank" href="search.html?categoryId=${item3.categoryId}">${item3.categoryName}</a>`
        })
  
        categoryHide = `
          <div class="category-hide-item">
            <div class="category">${item2.categoryName}</div>
            <div class="list">
              ${categoryHideItem}
            </div>
          </div>
        `
      }
    })

    categoryItem = `
      <div class="category-item">
        <a href="javaScript:void(0);" class="item">${item.categoryName}</a>
        ${categoryHide}
      </div>
    `
    categoryContent += categoryItem
  })

  return categoryContent
}

// 轮播图模板
function render_carousel_html_template (dataList) {
  var carouselExample = ''
  var carouselItem = ''
  dataList.forEach((item, index) => {
      if (index === 0) {
        carouselExample += `<li data-target="#carousel-example" class="active" data-slide-to="${index}"></li>`
        carouselItem += `
          <div class="item active" id="${item.carouselId}">
            <a href="${item.redirectUrl}">
              <img src="${item.carouselUrl}">
            </a>
          </div>
        `
      } else {
        carouselExample += `<li data-target="#carousel-example" data-slide-to="${index}"></li>`
        carouselItem += `
          <div class="item" id="${item.carouselId}">
            <a href="${item.redirectUrl}">
              <img src="${item.carouselUrl}">
            </a>
          </div>
        `
      }
  })
  return `
    <ol class="carousel-indicators">
      ${carouselExample}
    </ol>

    <div class="carousel-inner" role="listbox">
      ${carouselItem}
    </div>
  ` 
}

// 最新商品模板
function render_new_product_html_template (data) {
  var productList = ``
  data.forEach(item => {
    productList += `
      <a target="_blank" href="product-detail.html?productId=${item.productId}" class="product-card-warp">
        <div class="product-card">
          <img src="${item.productImg}" class="product-img" alt="">
          <p class="product-name" title="${item.productName}"><strong>${item.productName}</strong></p>
          <p class="price">${item.productPrice || '-'}元</p>
        </div>
      </a>
    `
  })
  return `
    <div class="container">
      <div class="title">
        <h3 class="types-title">
          <span>新品上线</span>
        </h3>
      </div>
      <div class="product-list">
        ${productList}
      </div>
    </div>
  `
}

// 商品模板
function render_product_list_html_template (data) {
  var productCardWarp = ``

  if (!data.productList) return false

  data.productList.forEach(item => {
    productCardWarp += `
      <a href="product-detail.html?productId=${item.productId}" class="product-card-warp">
        <div class="product-card">
          <img src="${item.productImg}" class="product-img">
          <p class="product-name"><strong>${item.productName}</strong></p>
          <p class="price">${item.productPrice}元</p>
        </div>
      </a>
    `
  })

  return `
    <div class="product">
      <div class="container">
        <div class="title">
          <h3 class="types-title">
            <span>${data.categoryName}</span>
          </h3>
        </div>
        <div class="product-list">
          ${productCardWarp}
        </div>
      </div>
    </div>
  `
}