<template>
    <div class="container">
        <div class="header">
            <div class="title">编辑商品详情: {{productId}} </div>
            <el-button @click="$router.go(-1)" size="small">返回</el-button>
        </div>
        <div class="main">

        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            productId: this.$route.params.id
        }
    },
    created () {
    }
}
</script>

<style lang="scss" scoped>
.container {
    padding: 12px;
}
.header {
    display: flex;
    justify-content: space-between;
    height: 35px;
    line-height: 35px;
    margin-bottom: 12px;
}
.main {
    border: 1px solid #ccc;
}
</style>