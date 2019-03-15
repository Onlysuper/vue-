

export default (function ($) {

        /**
         * 图片预加载
         * @param {*jQuery数组对象} src 
         * @param {*配置加载进度} options 
         */
        function Preload(src, options) {

                this.arrItem = typeof src === "string" ? [src] : src;
                this.options = options ? options : {};
                if (src instanceof Array) {
                        if (src.length === 0) this.options.all && this.options.all();
                }
                this.loadr();
        }
        Preload.prototype.loadr = function () {
                var arrItem = this.arrItem;
                var options = this.options;
                var count = 0;
                var len = arrItem.length;
                $.each(arrItem, function (index, item) {
                        var oImg = new Image();
                        var src = item;
                        $(oImg).on("load error", function () {
                                options.load && options.load(count);
                                if (count == len - 1) {
                                        options.all && options.all();
                                }
                                count++;
                        })
                        oImg.src = src;
                })
        }



        /**
         * 弹窗基础类
         * 
         * @param {any} options 
         */
        function Dialog(options) {
                this.options = {
                        // content: "提示信息",
                        // reBtn: {
                        //           text: "取消", cb: null
                        // },
                        // okBtn: {
                        //           text: "确认", cb: null
                        // }
                }

                Object.assign(this.options, {}, options);

                this.$body = $("body");
                //遮罩层
                this.mask = $('<div class="modal-mask"></div>').css({
                        position: "fixed",
                        left: "0",
                        top: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.4)"
                });
                //弹框层
                this.modal = $('<div class="modal-mask"></div>').css({
                        background: " #FFF",
                        borderRadius: "15px",
                        overflow: "hidden",
                });
                //标题层
                this.title = $('<div></div>').css({
                        lineHeight: "40px",
                        textAlign: "center",
                        fontSize: "15px"
                });
                //内容层
                this.content = $('<div class="confirm-content"></div>').css({
                        flex: 1,
                        width: "100%",
                        borderBottom: "1px solid #e0e0e0",
                        fontSize: "15px",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                });

                //按钮层
                this.btns = $('<div class="confirm-btns"></div>').css({
                        display: "flex"
                });

                //按钮
                var btnStyle = {
                        flex: 1,
                        textAlign: "center",
                        lineHeight: "40px",
                        fontSize: "17px"
                }

                //取消Btn
                this.reBtn = $('<div class="btn"></div>').css(btnStyle).css({
                        borderRight: "1px solid #e0e0e0"
                });

                //确认Btn
                this.okBtn = $('<div class="btn"></div>').css(btnStyle).css({
                        color: "#e60012"
                });
        }

        Dialog.prototype._createHTML = function (type) {
                //处理取消Btn
                if (this.options.reBtn) {
                        this.reBtn.html(this.options.reBtn.text)
                                .on("touchstart", function (e) {
                                        $(this).css({ backgroundColor: "rgba(245,245,245,1)" })
                                })
                                .on("touchend", function (e) {
                                        $(this).css({ backgroundColor: "rgba(255,255,255,1)" })
                                })
                                .on("click", function () {
                                        this.options.reBtn.cb && this.options.reBtn.cb();
                                        this._close();
                                }.bind(this));
                        this.btns.append(this.reBtn);
                }
                //处理确认Btn
                if (this.options.okBtn) {
                        this.okBtn.html(this.options.okBtn.text)
                                .on("touchstart", function (e) {
                                        $(this).css({ backgroundColor: "rgba(245,245,245,1)" })
                                })
                                .on("touchend", function (e) {
                                        $(this).css({ backgroundColor: "rgba(255,255,255,1)" })
                                })
                                .on("click", function () {
                                        this.options.okBtn.cb && this.options.okBtn.cb();
                                        this._close();
                                }.bind(this));
                        this.btns.append(this.okBtn);
                }

                //处理title
                if (this.options.title) {
                        this.modal.append(this.title.html(this.options.title));
                }

                this.modal.append(this.content.html(this.options.content)).append(this.btns).css({
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        margin: "auto",

                        width: "300px",
                        height: "135px",

                        display: "flex",
                        flexDirection: "column"
                });

                this.mask.append(this.modal);
                this.$body.append(this.mask);
        };

        Dialog.prototype._close = function () {
                this.mask.remove();
        };


        /**
         * 选择列表类
         * 继承弹框类
         * @param {选项列表} options 
         */
        function Select(options) {
                Dialog.call(this);
                this.options = {

                }
                Object.assign(this.options, {}, options);
        }

        for (var key in Dialog.prototype) {
                Select.prototype[key] = Dialog.prototype[key];
        }
        Select.prototype._createOption = function () {
                var $this = this;
                var arrow = $("<i></i>").css({
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderTop: "1px solid #ccc",
                        borderLeft: "1px solid #ccc",
                        transform: "rotate(135deg)",
                        WebKitTransform: "rotate(135deg)",
                        verticalAlign: "middle"
                });
                var span = $("<span><span>").css({
                        float: "left"
                });
                var option = $('<div class="option"></div>').css({
                        width: "100%",
                        lineHeight: "50px",
                        fontSize: "15px",
                        padding: "0 25px",
                        borderTop: "1px solid #e5e5e5",
                        boxSizing: "border-box",
                        textAlign: "right"
                }).append(span).append(arrow);

                //如果有传参 changeEnd 则执行
                if (this.options.changeEnd) {
                        option
                                .on("touchstart", function (e) {
                                        $(this).css({ backgroundColor: "rgba(245,245,245,1)" })
                                })
                                .on("touchend", function (e) {
                                        $(this).css({ backgroundColor: "rgba(255,255,255,1)" })
                                })
                                .on("click", function () {
                                        $this.options.changeEnd.call(this);
                                        $this.mask.remove();
                                });
                }
                return option;
        }
        Select.prototype._createHTML = function () {

                console.log(this.options)
                //处理title
                if (this.options.title) {
                        this.modal.append(this.title.html(this.options.title).css({
                                color: "#e60022",
                                fontSize: "17px",
                                lineHeight: "60px"
                        }));
                }
                //处理内容
                for (var i = 0; i < this.options.content.length; i++) {
                        console.log(this.options.content[i].entName)
                        var option = this._createOption();
                        option.find("span").html(this.options.content[i].entName);
                        this.content.append(option);
                }

                this.content.css({
                        flexDirection: "column",
                        maxHeight: "250px",
                        overflow: "scroll",
                        display: "block"
                });

                this.modal.append(this.content).css({
                        width: "80%",
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        margin: "auto",
                        transform: "translateY(-50%)",
                        WebKitTransform: "translateY(-50%)"
                });
                this.mask.append(this.modal);
                this.$body.append(this.mask);

        }

        // $.dialog.scanAlert({
        //           success: true,
        //           title: "恭喜你！<br/>信息推送成功",
        //           info: "开票信息已推送至开票系统",
        //           okBtn: { text: "ok", cb: function () { } }
        // });
        function ScanAlert(options) {
                Dialog.call(this);
                this.options = {}
                Object.assign(this.options, {}, options);
        }
        for (var key in Dialog.prototype) {
                ScanAlert.prototype[key] = Dialog.prototype[key];
        }
        ScanAlert.prototype._createHTML = function () {
                var $this = this;
                var base64 = this.options.success
                        ? "data:image/png;base64,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"
                        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQoAAAClCAMAAACTKEN0AAADAFBMVEUAAAC4uLgAAAAAAAAAAAAAAAAAAAAAAABPT08AAAAAAAAAAAACAQEAAAAAAAAAAAD/2AEAAADsklkAAAAAAAAAAAAAAAC3uroAAAAAAAD+iBP+iBMAAABFRUUAAAD+iBMAAAAAAAAAAAACAQAAAAAAAAD+iBP+iBP+iBMAAAAAAAAAAAD+iBMAAAAAAAAAAAAAAAAAAAAAAAAAAAD+iBPdl7MAAACysbEDAgIAAAAKBwcAAAACAQAAAAAAAAAAAAD+iBP9hxIAAAD+iBMAAAAAAAD+iBP+iBPon+ICAQBJSUn+iBMAAADpmuP+iBP+iBMAAAD+iBP+iBMCAQEAAADpmuMAAAAAAADKjZbpmuMAAAAAAAD////+iBP+iBNqY2MBAAD+iBPpmuNxcXGopaXIpqb+iBMAAADSmZn+iBPB///hsN4zJycAAACxja69srLCra3+iBPpmuPPnZ3+iBP+iBPB///B///B//8jGxtBOTl2bGy2trbKnJz+iBP+iBPUmJj+iBPVlpb+iBO+jqWxja6xja4OCgrB//83Ly/B///+iBNQQ0PB///hsN5ENDSBdnaTkZH+iBPhsN6xja7hsN7/2AHB///B///+iBPhsN6xja7/2AHhsN6xja4jFQ5LMSj/2AH+iBPVlZX/2AH/2AHhsN7/2AFuVlb+iBM5HgSXUQtJPgAbFRUcFhYQDAy4uLi4uLjB///B//+Dg4P/2AHpmuPXtgFwYGD+iBM1HAQsHh5pV1fLbQ//2AHMoKBfRUX/2AFHMDD/2AH+iBP+iBP+iBPpmuP///8AAAC4uLiHh4cODg4iIiJ4eHj9/f2Tk5P+iBMDAwNWVlbpmuPhsN6xja4cHBwXFxfB///5+fn09PQuLi5qampFRUVBQUEnJycUFBTn5+d9fX1KSko9PT0GBgbs7Ozi4uLd3d29vb2wsLCCgoJaWlrw8PDNzc3CwsKenp6FhYVgYGDW1tZkZGQyMjKqqqqWlpZzc3NOTk7IyMijo6OOjo41NTW3t7dfzfATAAAAyHRSTlMAq4d43P1jiNNmq1UGTJm1zIEB+rAN16sQ8O8aAtcY5cR9WgqQRBfypD8h4uHTpnFsJBzucQbyraEyCPbnzpWNi21IQzq+SxMR8NW9urSqhy4N/ezKqionIh63X/r3x8aE6+HEr6B6dWMh+u7PyMKqnZSAeXZnTywO3NfErIhfV0s3MigT9ePj3tzY2M/MxsG6uLWzqaaklpKAc25pYl9fWUxKRDoiGhANB/zu5+bjz8rDwb29u7m3rq6pop6alZCJcnBfODIwLV7uFqsAAAwTSURBVHja7NtNjAthHMfxf3WK7Xa22emLtpbtK9oubZVmq2uXasla8Z4lNt6C9RKCeCdegoMIByecCDcOEi4IIRLiFy8JDlKJt4S44EbiZmaHbtGymM7Ldj/3zXS/8zxP53naUhnoISEvaZmkKRIZ0jA9pJQIkHbpgYd3JfEWvBRLmiVpiibAUk1aJV2KN0AHAxg6SKMkTcEOtQOGKGmTtClo6HgAetIkiVOQww1gCWmRdCmeiI9YviwAP0faI12KD2IKGmcGUFNHmiN9CjIZAYwykdaUIQXVNQKwlm7BnWlr2zuL1Ea6FJ+AKhJxzQCm+aiEWVvql24eRmojXYrn+RS8AQDcNipu2Jh614zBpCI+1p9lUuVJQR4Alta4gMn6Wd8PKTbXuyaoKEWsxglBmVJQxIACzpqYWkeFzW8BpE3xBYhQAQ9+YPHbVJkiyYBnH8DOq5UsxcOfn7i9FiCcdDjmsQPs4DEzVZgikACQDRJPL3EKzuFwjA6F5iWTyYDHAsTTJAhmCw52Zk1scJ1Ux5tpIAU4vUSSpzDgV1kSeZ1A6vRgwZ2T9a6Ntwd3GaZoklAcCLeT1Cneo6ga+qY9DCSuT+BtbBu+cNHGGRMEnXtJOZwbCMdI8hT30OX+/ftPHzx49fnz55cvXrwC+nXfgjBwbrhg4ezZC4e7hgvq20g5HYAlQ9KnePbu3cciefpRXuYxcL6hoaHeNXv28PoGkYIpTIzw8qRPkVc6BV0FmiZumdh5xbWwrXPLRMGeM6SYamCOTaEUtjnAqSlTDnTyy+aBWVMEszhSjBWoJYVSUC1g/fZcofx2zJQA5imWIgYkTDRFHSmSQJgUS0FhIKmWp00vYFUwhRHwyrUzXb10Iv1OBGhRMEULEJFrVEx+NOJPRzX9FExRC3hKnWJVWIquy3OTi55tVmKK4vpS5PWlKIsx03mLHjVMF4yp6BRLHxVYWtEpVk/idT5qmyRYXdEpNLpWbN+6dTsJFEhRq2yKWvrBtkO53KFtxJMtBdfORpqNZrfB4DYXsAP3H5TNa4AxFxAvb2yOsO11JLqYO3o0d4l4cqXI6N1QE7fHRl3W5LZvz62hMljtGkO/Cq1kwEs1MT+Lo8xamV80pQBMG0pdDueOH88dJrlkzADi7saVXvZn1f3L7NslT926ee3yrmWCXYuPrL3QWEeirWtyuTVbSSbpMGCZFh1NCuP2bVo/SKcbxFu+Yt98IpoprJsnTmwjmQTjQNjjIxUYu2oD30In5NDt3l/Hzg2SnEIMYFfNV6/PCi3EGCtOW8CESD4mK9AUJNXYL7QQY+yKA1YTyaYaSKnqa9dn1+u+t1icAqpJLuPsQDOpyipdvsVawD6OZJIG5jhIVcZuyLdYHgfSJBMj0EIqUzAsdgJGkse4VqCdVGbs+nyLY4BTphkyE2gi1bnRPSzmADNJFl7ASqqzSpe3A/CSLCKAn1Rnvy5vJxAhWehV+TuVg7q8qYCH5CAeoKkOV5Ci9LCtiBSk637gtFo7qKhKS6HTUSl9KfIqLsUxlp1HRSmXwhe0kTTq0lajo6cphpTcLSqXYh0SzVLcH1uUARDpaYqBJV+gciniAAwL0hz9l5jfCZ4lo+UU6ZEQ2KM2+ldceoEBvNaWEGk5BXEBqwE8pz/2jzPDLsas8hFpOwUv1NIKnsEc4P5xZhiswp/2ghREvir7P8wTLmAumBm9JEX3v+Vsif1tvio+X29KUWSw93xS9boUf7EEOowFS22vTEFUF01AkP3j0ZBgrr9jpqkXpjAl+ze7ExC10m9lLPguNbcmmvH1mhS2YKRxvAV5rVmWfm+0d8C0Ocgz2EetDDhUmcLT449BxqU9RsaAvLB5SXWMemY067Ey6BZutKkvhdftrqIeyRbcWaM+PZT+liMQaRxpgSiqvhQ9J26jxjdG/2uz7stU1axLwRLUcgrW7O+fNJEUTO2jVbhWqFRfir4UX9u779AmojiA4w81lA5HE0crMVjrqpqoxThqq7hQREG0aq0TUVRcoH8pKooLUVRcf7hAcIKKguMPQRAF36/GXONKaNIZG9u0drvnuyTkYpqau7y7mDP5/pGj5SDNh9x7d6+XNkYRYRSayZP/+T2KEUKxTNwF5ZT5Y2ZlJsmTQsTfg8xblZ8NbCpt3wx19FJkxWvBt+y0lOikUMcPBv9S07LkRcFdjlE0Jgc8zdHmaLPBU/cMWVEszM0dhuhSp6mATZXQR4PYNB1HpwKbIlkpIwr6unUGtpHtNL7fXJUNbF27RRGFJgfYdBr/aXWcAkhaTdRQDOoApNRE1LqMbCB1yIwSCo1LIifwalZmrttCJhSaWbM0FCeXWiDNaGtAyMoHkjYlwiny8uhPvNWdgZSQ9LfPmpDy1ZFMsWfDmzcb9tCeYqUBBPnsSlI+kNpFMsWJN6QTtBRzAGB9evBDaGQkU+xlKfbSUuQADA420mQOBtBGMsU+lmIfLcVwXcK84NOtLmF+JFOcYSnOyOFmRckp0PkNG87L4r5NuV2kIxSj8Baj8Baj8BajoIia4vLlGIWracdfvz4+LUZBOvmadFI6io4JrevdQdp6JwRoaVCKtSzFWuko2kOE1CtSKRwGfjkMQnOETHGapTgtKUXXRL90ACWFvDK+KC4U2FfuCbl0fCjQucOHzyFJKdoF2MOOeWU3MFhgPwK90PaE4p+fV7RBYcS8KvuKhfbs/6SwvnDGKNwVOpgYhbsyG45RuKo3GGMU7oqf18QoXFnLDRWyoejfX0qKxtLS0gpZUCgnDDGZhkxQSkbRYv5Ra3bKgEI50ORqoDIYRU4nv3J5jhVVZXanuZYRSME9IVeupBQ7CMOAAeRhh/DLMb6T6bufH6rIQSKQIlCSUiwhb4hr18hbY4l0FNha8tVqNzsjnGKxyTQVoakm0+K/UsyKb11X3hS46H1lXYGllhFEkR8foDvSUfQ0mdYgtNtk6hmAQrx/c8t8sVVUlJa8oxg2JV/xPkYOjV27yGFyTEoKUtPzasZubohgikmzTa5mT5KYAjea6zE5SCKXAo2Y7ZIYgaSmwDUWJ/5lo6NQtk2xabkeUfZk4MGDA3ch6Slwg6XGaKSj0LdNMfPVAiRN7QHiRKaoLq+3faOjyPvjLyC1Dw9FPMBocSmKPn6usjB0FDs5igMA8eGh6AfQW1yKDy9xYTPlDLKZo7gJ0C88FBoFqNLFpPheVodLPtFRKFd6JUapQKFB7vTTSPdePWU3eiR+WoBEESlayluw1WClovAdKpYCdEeelr/iWo7ELxlghlo0CmtZI5lOSzAVhXK7V2LbFoBk7zw6l7T81Ux2swmJ3yAVQIZoFO/ZUaK5kI4ib6OX4iiAahCSdqzgGs3dkE5N8dlGDg3GUk1FoedGihX72QkubBSZqQC6JFEo6stbyOM3G6ah0G/u4R0z1wGkZoaPAg1TAaRliUBR99w1c9iNNBT61dzscQRANQyFkQLpFADjuqlpKZiXxa6trSF0CqV+s3fEXLEOQKFDXNw1iGSpZxALbUa6mo7ix88idlNVzgil4CDyVvbwQIw6up9IkMktvKl1KgCYkZiSnpXUqjSeFN88o+XnZiyIIi7JXdbVq3nbR3lasXQLAKh0ahT2hqYqAECxfnTfZP+m8KN4Z67Brt5+EkbRO5ltWdyDI4emu9t64Ibrp0kdisLflUf3r6tUCggYLwrm7RfsymqoE0YROIVqrC4TUXSrwDdEKuBd43uzw/EiQLwomiqLPCs3pVggxYvWORzm940FfiFSsFfk3QHdpqAgfa8tbn7pn40PRYOlCrv7UCiQouylf83Ftd8LSFQUIXa3i7uLoc4gFeYC7I4xVwuiiLQ7aLt4uhAiBVNq91m4kTXFKQ/FpRAp7CWM73KenCkuuCUeotAofpVXYK6a5+9kTIHOshKnroRI0VD2tQpzfXnLyJgCXXp89qIy5GuQoqbyZ0XcV5VNcqagXa+ofmtr8JlPnFFMgfEn8wfvGOG0VEUzBa4rtjQyZLuIRM49Fy2KXgqM639WtmCMSMrO4xH6PykYnhVajFbEltIhETE8apIbReUzvhltBg1iGzNnOJ/9S+RGISjkLj4H+CQvCoWwkCcdKHglI4qMOGEhT+ld43g1EUnRb+MDIBQWmGUsAAAAAElFTkSuQmCC";


                var $modal = $("<div></div>").css({
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        width: "235px",
                        margin: "0 auto",
                        padding: "0 20px",
                        background: "#fff",
                        borderRadius: "10px",
                        transform: "translateX(-50%) translateY(-50%)",
                        WebkitTransform: "translateX(-50%) translateY(-50%)"
                });

                var $title = $("<div>" + this.options.title + "</div>").css({
                        padding: " 37px 0",
                        textAlign: "center",
                        color: "#e60012",
                        fontSize: "15px"
                });

                var $panelBody = $("<div></div>").css({
                        textAlign: "center"
                });
                var img = $("<img src=" + base64 + ">").css({
                        width: "133px",
                        height: "82px"
                });
                var p = $("<p>" + this.options.info + "</p>").css({
                        fontSize: "15px",
                        color: "#333",
                        marginTop: "30px",
                });
                $panelBody.append(img).append(p);

                var $panelButton = $("<button>" + this.options.okBtn.text + "</button>").css({
                        width: "100%",
                        margin: "30px 0",
                        borderRadius: "40px",
                        background: "#ff6363",
                        color: "#FFF",
                        fontSize: "15px",
                        textAlign: "center",
                        lineHeight: "40px"
                })
                        .on("touchstart", function (e) {
                                $(this).css({ opacity: "0.8" })
                        })
                        .on("touchend", function (e) {
                                $(this).css({ opacity: "1" })
                        })
                        .on("click", function () {
                                $this.options.okBtn.cb && $this.options.okBtn.cb.call(this);
                                $this.mask.remove();
                        });

                $modal.append($title).append($panelBody).append($panelButton);

                this.mask.append($modal);
                $("body").append(this.mask);
        }


        $.extend({
                preLoad: function (imgs, options) {
                        new Preload(imgs, options)
                },
                dialog: {
                        alert: function (options) {
                                var alert = new Dialog(options);
                                alert._createHTML();
                        },
                        select: function (options) {
                                var select = new Select(options);
                                select._createHTML();
                        },
                        scanAlert: function (options) {
                                var scanAlert = new ScanAlert(options);
                                scanAlert._createHTML();
                        }
                }
        })


        /**
         * 设置盒子的高为全屏高度，最小高度为480
         */
        $.fn.setHeightToWindow = function (minH) {
                var $this = this,
                        minH = minH || 480;
                $this.css({ height: window.innerHeight, minHeight: minH })
                $(window).on("resize", function () {
                        setTimeout(function () {
                                $this.css({ height: window.innerHeight })
                        }, 300)
                })
        }


        return $;
}(jQuery))