"use strict";

//获取远端模块，方便进行对话框
var { remote } = require('electron');

//用来进行echarts初始化的对象，由于最终有两块需要初始化的图形区域，因此构造两个初始化对象
var chart_object = {};
var chart_object2 = {};

//同理
var option2 = {};
const option = {
    title: {
        text: '关键路径'
    },

    series: [
        {
            type: 'graph',
            layout: 'none',
            force: {
                //斥力大小，决定了边的长度
                repulsion: 750,
                layoutAnimation: false
            },

            symbolSize: 40,

            draggable: false,
            itemStyle: {
                color: '#C23531',
            },
            label: {
                normal: {
                    show: true,
                    //决定了图节点上的内容如何显示
                    formatter: function (x) { return x.data.value; },
                    fontSize: 16,
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 7],
            edgeLabel: {
                normal: {
                    show: true,
                    //决定了边上的内容如何显示
                    formatter: function (x) { return x.data.weight; },
                    textStyle: {
                        fontSize: 16
                    }
                }
            },
            lineStyle: {
                normal: {
                    opacity: 1,
                    width: 2,
                    curveness: 0,
                    color: 'grey'
                }
            },
            data: [],
            links: []

        },
    ]
};

function show_graph(option, chart_object, element_name = "draw_area", width = 0.99, height = 0.8) {

    //获取绘制对象
    const container = document.getElementById(element_name);
    container.style.width = window.innerWidth * width + 'px';
    container.style.height = window.innerHeight * height + 'px';
    if (chart_object != null && chart_object != "" && chart_object != undefined && Object.keys(chart_object).length != 0) {
        chart_object.dispose();
    }
    chart_object = echarts.init(container, 'light');
    chart_object.clear();
    chart_object.setOption(option);
    return chart_object;
}

//从输入框中获取信息，并且生成返回一个邻接表对象
function read_data() {

    //创建邻接表对象
    let adjacency_list = {};
    adjacency_list.node_num = Number(document.getElementById("input_node_num").value);
    adjacency_list.list = {};
    //先读取节点名称
    let node_info = document.getElementById("input_node_info").value.split(" ");
    for (let i = 0; i < adjacency_list.node_num; i++) {
        //处理掉结尾的\r
        if (node_info[i][node_info[i].length - 1] == '\r') {
            node_info[i] = node_info[i].substr(0, node_info[i].length - 1);
        }
        adjacency_list.list[node_info[i]] = [];
    }
    //给图加边
    adjacency_list.edge_num = Number(document.getElementById("input_edge_num").value);
    let edge_data = document.getElementById("input_edge_info").value.split("\n");
    for (let i = 0; i < adjacency_list.edge_num; i++) {
        let edge_info = edge_data[i].split(" ");
        adjacency_list.list[edge_info[0]].push([edge_info[1], Number(edge_info[2])]);
    }
    //返回邻接表对象
    return adjacency_list;
}

//判断数据类型，便于实现后面的深拷贝操作
function getClass(o) { //判断数据类型
    return Object.prototype.toString.call(o).slice(8, -1);
}

//进行对对象的深拷贝，返回拷贝得到的对象
function deepCopy(obj) {
    var result, oClass = getClass(obj);

    if (oClass == "Object") result = {}; //判断传入的如果是对象，继续遍历
    else if (oClass == "Array") result = []; //判断传入的如果是数组，继续遍历
    else return obj; //如果是基本数据类型就直接返回

    for (var i in obj) {
        var copy = obj[i];

        if (getClass(copy) == "Object") result[i] = deepCopy(copy); //递归方法 ，如果对象继续变量obj[i],下一级还是对象，就obj[i][i]
        else if (getClass(copy) == "Array") result[i] = deepCopy(copy); //递归方法 ，如果对象继续数组obj[i],下一级还是数组，就obj[i][i]
        else result[i] = copy; //基本数据类型则赋值给属性
    }

    return result;
}

//进行复位操作
function reset() {
    //改变图形的显示情况
    document.getElementById("input_area").style.display = "inline";
    document.getElementById("draw_area").style.display = "none";
    document.getElementById("draw_area2").style.display = "none";

    document.getElementById("input2").style.display = "inline";
    document.getElementById("input3").style.display = "inline";
    document.getElementById("input4").style.display = "inline";
    document.getElementById("input1").style.display = "none";
}