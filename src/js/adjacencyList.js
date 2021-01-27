"use strict";

//进行邻接矩阵的显示
function show_adjacency_list() {
    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "none";
    
    document.getElementById("input2").style.display = "none";
    document.getElementById("input1").style.display = "inline";
    document.getElementById("input3").style.display = "inline";
    document.getElementById("input4").style.display = "inline";

    //对配置项进行一些初始化操作
    option.title.text = "邻接链表";
    option.series[0].layout = "none";
    option.series[0].data = [];
    option.series[0].links = [];
    option.series[0].label.normal.fontSize=16;

    //获取邻接表对象
    let adjacency_list = read_data();

    //对一些变量进行初始化
    let node_cnt = 0;
    let y_node_cnt = 0;
    let edge_cnt = 0;
    let gap_x = 50;
    let gap_y = 30;

    //遍历邻接表中的点和边，并将其加入配置项中
    for (let i in adjacency_list.list) {
        option.series[0].data[node_cnt] = { value: String(i), x: gap_x, y: gap_y * (y_node_cnt + 1) };
        node_cnt++;

        for (let j = 0; j < adjacency_list.list[i].length; j++) {
            option.series[0].data[node_cnt] = { value: adjacency_list.list[i][j][0], x: gap_x * (j + 2), y: gap_y * (y_node_cnt + 1), symbol: 'rect' };
            option.series[0].links[edge_cnt] = { source: node_cnt - 1, target: node_cnt, weight: adjacency_list.list[i][j][1] };
            node_cnt++;
            edge_cnt++;
        }
        y_node_cnt++;

    }

    //进行图像的显示
    chart_object=show_graph(option,chart_object);
}