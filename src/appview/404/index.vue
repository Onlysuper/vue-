<template>
        <div class="notfound-container">
                <p class="txt">ERROR!</p>
                <h2>404</h2>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXsAAAEHCAMAAAB4ABaDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkYyRjlBQUQ5QThGMTFFN0JCMzU5NjNBQ0ZBNzE2QTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkYyRjlBQUU5QThGMTFFN0JCMzU5NjNBQ0ZBNzE2QTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RjJGOUFBQjlBOEYxMUU3QkIzNTk2M0FDRkE3MTZBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RjJGOUFBQzlBOEYxMUU3QkIzNTk2M0FDRkE3MTZBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq4gEnAAAAMAUExURfSJmefn53qC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" alt="">
                <p class="tip">出错啦！你访问的页面不存在...</p>
                <button v-if="isClose" type="button" @click="close">关闭</button>
                <button v-else type="button" @click="$router.back()">返回</button>
        </div>
</template>
<script>
export default {
        data() {
                return {
                        isClose: false
                }
        },
        created() {
                if (history.length <= 1) {
                        this.isClose = true;
                }
        },
        methods: {
                close() {
                        // 关闭微信浏览器窗口方法
                        WeixinJSBridge.invoke('closeWindow');
                }
        }
}
</script>
<style lang="less" scoped>
.notfound-container {
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        color: #d5d5d5;
        padding: 50px;
        box-sizing: border-box;

        .txt {
                font-size: 20px;
                transform: translateX(3px);
        }

        h2 {
                font-size: 36px;
                font-weight: 500;
        }

        img {
                width: 100%;
                display: block;
                margin: 0 auto;
                margin: 30px 0;
        }

        .tip {
                font-size: 16px;
                color: #aaa;
                margin: 30px 0;
        }

        button {
                background: #00b07e;
                width: 80%;
                height: 34px;
                border-radius: 5px;
                color: #fff;
                font-size: 18px;
                margin-top: 10px;
        }
}
</style>