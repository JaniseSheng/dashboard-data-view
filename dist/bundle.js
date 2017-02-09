(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//const apiUl = 'https://cfapi.csvfx.com//QM/GetDataTrendsAPI?quesID=';
var apiUl = 'https://cfapi.cform.io//QM/GetDataTrendsAPI?quesID=';

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function dataRequest(id) {
    $.ajax({
        url: '' + apiUl + id, type: "GET", timeout: '3000',
        success: function success(src) {
            console.log(src);
            viewData(src.Result);
        },
        error: function error(e) {
            alertMessage('摄像头调用失败,请手动输出校验码!', 'ic-exclamation-point-1');
        }
    });
}

function viewData(result) {
    var progress = result.ProgressWidth || '0.00%';
    var rewardProgress = result.RedProgressWidth || '00.00%';
    var isReward = result.IsShowRedProgress;
    var table = result.TableHtml || "";

    //合计进度
    $('#total-progress h2').text(progress);
    $('#total-progress .progress-bar-main').css('width', progress);
    //红包进度
    if (isReward) {
        $('#reward-progress h2').text(rewardProgress);
        $('#reward-progress .progress-bar-main').css('width', rewardProgress);
    } else {
        $('#reward-progress').remove();
    }

    if (!!table) {
        $('#div-quota-grid').html(table);
    }

    var xAxis = result.LableList;
    var dataList = result.ValueList;

    if (dataList.length < 1) {
        return $('#main-chart').remove();
    };
    //E-chart
    var myChart = echarts.init(document.getElementById('main-chart'));
    // 指定图表的配置项和数据

    var tmpdataZoom = { start: 0, end: dataList.length < 8 ? 100 : 20 };

    var option = {
        color: ['#2ecc71'],
        tooltip: {},

        title: {
            text: '统计销量',
            textStyle: {
                color: '#5940AA',
                fontStyle: 'normal',
                fontWeight: 'bolder',
                fontFamily: 'sans-serif',
                fontSize: 18
            }
        },

        grid: {
            left: 48,
            top: 60,
            right: 24,
            bottom: 60
        },

        xAxis: {
            data: xAxis,
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                    ///x轴线颜色
                    color: '#5940AA'
                }
            }
        },

        dataZoom: _extends({
            type: 'slider'
        }, tmpdataZoom, {
            backgroundColor: 'rgba(89, 64, 170, 0.45)',
            dataBackground: {
                lineStyle: {
                    opacity: 0
                },
                areaStyle: {
                    opacity: 0
                }
            },
            fillerColor: 'rgba(89, 64, 170, .6)',
            handleStyle: {
                color: 'rgba(89, 64, 170, 1)',
                borderColor: 'rgba(89, 64, 170, 1)',
                borderWidth: 0,
                borderType: 'solid'
            }
        }),

        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
                onZero: true,

                ///y轴线颜色
                lineStyle: {
                    color: '#5940AA'
                }
            }
        },
        series: [{
            name: '统计销量',
            type: 'bar',
            barWidth: '40',
            barMaxWidth: '40',
            itemStyle: {
                normal: {
                    ///柱形图填充色
                    color: 'rgba(46, 204, 113, 0.5)'
                }
            },
            data: dataList
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option, {
        width: 'auto'
    });
}

$(document).ready(function () {
    var queryId = getQueryString('id');
    dataRequest(queryId);
});

},{}]},{},[1]);
