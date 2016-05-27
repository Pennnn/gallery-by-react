require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');

function genImageUrl(imageDataArr) {
    for (let i = 0, j = imageDataArr.length; i < j; i++) {
        var singleImageData = imageDataArr[i];
        singleImageData.imageUrl = require('../images/' + singleImageData.filename);
        imageDataArr[i] = singleImageData;
    }
    return imageDataArr;
}
imageDatas = genImageUrl(imageDatas);

/*获取low - high之间的随机值*/
function getRangeRandom(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*
 *获取正负30Deg的一个随机值
 */
function get30DegRandom() {
    return (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 30);
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
        //when using es6 class, instead of using 'getInitialState' method by moving it using value to be assigned to
        //'this.state' instance variable in constructor
        this.state = {
            imgsArrangeArr: [
                /*{
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0 //旋转角度,
                    isInverse: false //是否反面,
                    isCenter: false //是否居中
                 */
            ]
        }
    }
    //组件加载之后,为每张图片设置位置
    componentDidMount() {
        var stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);
        //拿到imageFigure的大小
        var imgFigureDom = ReactDOM.findDOMNode(this.refs['imgFigure0']),
            imgW = imgFigureDom.scrollWidth,
            imgH = imgFigureDom.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        //计算中心图片的位置点
        this.constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };
        //计算左侧右侧图片位置的取值范围
        this.constant.hPosRange.leftSecX[0] = -halfImgW;
        this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.constant.hPosRange.rightSecX[1]  = stageW - halfImgW;
        this.constant.hPosRange.y[0] = -halfImgH;
        this.constant.hPosRange.y[1] = stageH - halfImgH;
        //计算上侧区域的图片位置排布
        this.constant.vPosRange.topY[0] = -halfImgH;
        this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.constant.vPosRange.x[0] = halfStageW - imgW;
        this.constant.vPosRange.x[0] = halfStageW;

        this.rearrange(0);
    }
    render() {
        //初始化图片
        let imgFigures = [];
        imageDatas.forEach(function(value, index) {
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} key={index} arrange={this.state.imgsArrangeArr[index]}
            inverse={this.inverse(index)} center={this.center(index)}/>);
        }.bind(this));
        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav classname="controller-nav">
                </nav>
            </section>
        );
    }

    /*
    * 重新布局所有图片
    * @param centerIndex 中心图片的索引
     */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            constant = this.constant,
            centerPos = constant.centerPos,
            hPosRange = constant.hPosRange,
            vPosRange = constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSex = hPosRange.rightSecX,
            vPosRangeX = vPosRange.x,
            vPosRangeTopY = vPosRange.topY,

            imgsArrangTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
            topImgSpliceindex,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //居中选中图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            isCenter: true
        }

        //取出上侧图片信息
        topImgSpliceindex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangTopArr = imgsArrangeArr.splice(topImgSpliceindex, topImgNum);

        //布局上侧图片
        imgsArrangTopArr.forEach(function(value, index) {
            imgsArrangTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        })

        //布局左右两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            }else {
                hPosRangeLORX = hPosRangeRightSex;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        }

        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceindex, 0, imgsArrangTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        console.log(imgsArrangeArr);

        this.setState({ imgsArrangeArr: imgsArrangeArr});

    }

    /*
     * 翻转图片
     * @param index 输入当前执行inverse操作的图片index
     * @return {Function} 这是闭包函数, 返回一个执行的函数
     */
    inverse(index) {
        return function() {
            console.log('reverse' + index);
            let imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    /*
     * 利用rearrange函数居中图片
     * @param index 输入当前执行居中的图片index
     * @return {Function} 这是闭包函数, 返回一个执行的函数
     */
    center(index) {
        return function() {
            console.log('center' + index);
            this.rearrange(index);
        }.bind(this)
    }
}


AppComponent.defaultProps = {
};

class ImgFigure extends React.Component {
    render() {
        let styleObj = {};

        //如果props指定了属性,则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //设置旋转角度
        if (this.props.arrange.rotate) {
            (['msTransform', 'msTransform', 'WebkitTransform', '']).forEach(function(value) {
                styleObj[value + 'transform'] = 'rotate( ' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if (this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }

        //设置翻转
        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        return (
            <figure className={imgFigureClassName} style = {styleObj} onClick={this.handleClick.bind(this)}>
                <img className="img-item"
                     src={this.props.data.imageUrl}
                     alt = {this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick.bind(this)}>
                        <p>
                            {this.props.data.des}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
    /*
     * imgFigure的点击处理函数
     */
    handleClick(e) {
        console.log('click');
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }
}

export default AppComponent;

