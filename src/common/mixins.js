
/**
 * 处理滚动条位置，使用请在组件注入在mixin中 FullPage组件专用
 */
export const scrollBehavior = {
        activated() {
                let y = (this.$store.state.scrollTop[this.$route.name] || 0);
                this.$nextTick(() => {
                        setTimeout(() => {
                                this.$refs.MypLoadmoreApi.$refs.loadmore.scrollTo(0, y, false)
                        }, 10)
                })
        },
        beforeRouteLeave(to, from, next) {
                this.$store.commit("SAVE_SCROLLTOP", {
                        name: this.$route.name,
                        scrollTopVal: this.$refs.MypLoadmoreApi.$refs.loadmore.getPosition().top
                });
                next();
        }
}

/**
 * 处理滚动条位置，使用请在组件注入在mixin中
 */
export const saveScrollPosition = {
        activated() {
                this._setScrollTop(
                        this.$store.state.scrollTop[this.$route.path]
                );
        },
        beforeRouteLeave(to, from, next) {
                this.$store.commit("SAVE_SCROLLTOP", {
                        name: this.$route.path,
                        scrollTopVal: this._getScrollTop()
                });
                next();
        },
        methods: {
                _getScrollTop() {
                        return this.$refs.wrapper.scrollTop;
                },
                _setScrollTop(scrollTopVal) {
                        this.$refs.wrapper.scrollTop = scrollTopVal;
                }
        }
}

/**
 * 滚动条滚动定位
 */
export const listScrollFixedBanner = {
        methods: {
                mixinsInitScrollBanner(el, offsetTop) {
                        this.bannerBars = el.getElementsByClassName("date-banner");
                        // if (this.bannerBars.length == 0) {
                        //   console.error("没有找到要定位的banner元素,需要为banner元素添加class=date-banner");
                        //   return;
                        // }
                        this.wrapper = this.$refs.wrapper;
                        this._offsetTop = offsetTop || 0;
                        this.wrapper.addEventListener("scroll", this._handleScroll);
                        this._handleScroll();
                },
                _handleScroll() {
                        // this._scroll = document.documentElement.scrollTop || document.body.scrollTop;
                        this._scroll = this.wrapper.scrollTop;
                        for (let i = 0; i < this.bannerBars.length; i++) {
                                let bannerBar = this.bannerBars[i];
                                //判断滚动位置是否到达了当前元素
                                if (this._scroll + this._offsetTop >= bannerBar.offsetTop) {
                                        bannerBar.className = "date-banner scroll-fixed";
                                } else if (this._scroll <= bannerBar.offsetTop) {
                                        bannerBar.className = "date-banner scroll-no-fixed";
                                }
                        }
                }
        },
        beforeDestroy() {
                // window.removeEventListener("scroll", this._handleScroll);
        }
}
