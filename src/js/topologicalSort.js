"use strict";

//进行完整的拓扑排序
function show_topological_sort() {
    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "block";

    document.getElementById("input3").style.display = "none";
    document.getElementById("input1").style.display = "inline";
    document.getElementById("input2").style.display = "inline";
    document.getElementById("input4").style.display = "inline";

    //对配置项进行一些初始化操作
    option.title.text = "拓扑排序过程";
    option.series[0].layout = "force";
    option.series[0].data = [];
    option.series[0].links = [];
    option.series[0].label.normal.fontSize = 11;

    //获取邻接矩阵
    var adjacency_list = read_data();

    let node_cnt = 0;
    let edge_cnt = 0;
    var degree_node = {};

    //每个节点的入度初始化为0
    for (let i in adjacency_list.list) {
        degree_node[i] = 0;
    }
    //统计每个节点的入度，并且将节点和边的信息加入到配置项中
    for (let i in adjacency_list.list) {
        option.series[0].data[node_cnt] = { id: String(i), value: String(i) };
        for (let j = 0; j < adjacency_list.list[i].length; j++) {
            degree_node[adjacency_list.list[i][j][0]]++;
            option.series[0].links[edge_cnt] = { source: String(i), target: adjacency_list.list[i][j][0], weight: adjacency_list.list[i][j][1] };
            edge_cnt++
        }
        node_cnt++;
    }

    //将入度信息加入到配置项中
    for (let i in option.series[0].data) {
        option.series[0].data[i].value += "\n入度:" + String(degree_node[option.series[0].data[i].id]);

        if (degree_node[option.series[0].data[i].id] == 0) {
            option.series[0].data[i].itemStyle = {};
            option.series[0].data[i].itemStyle.color = "blue";
        }
    }

    //深拷贝一个入度对象，先进行一轮不显示的拓扑排序，判断是否能进行拓扑排序
    let cnt = Object.keys(degree_node).length;
    let temp_obj = deepCopy(degree_node);
    let node_stack1 = [];
    let node_stack2 = [];
    for (let i in degree_node) {
        if (degree_node[i] == 0) {
            node_stack1.push(i);
            node_stack2.push(i);
        }
    }

    for (let i = 0; i < cnt; i++) {
        if (do_sort(temp_obj, adjacency_list, node_stack1, 0) == -1) {
            reset();
            return;
        }
    }

    //如果可以进行拓扑排序，进行显示
    document.getElementById("click_area").style.display = "none";
    document.getElementById("draw_area2").style.display = "inline";
    option2 = deepCopy(option);
    option2.series[0].data = [];
    option2.series[0].links = [];
    option2.series[0].layout = "none";
    option2.title.text = "拓扑排序结果";
    chart_object2 = show_graph(option2, chart_object2, "draw_area2", 0.99, 0.15);
    chart_object = show_graph(option, chart_object, "draw_area", 0.99, 0.7);

    //异步操作，显示动画
    for (let i = 0; i < cnt; i++) {
        setTimeout(function () { do_sort(degree_node, adjacency_list, node_stack2, 1) }, Number(document.getElementById("delay_sort").value) * (i + 1));
    }
}

//根据节点的度信息进行一轮拓扑排序
function do_sort(degree_node, adjacency_list, node_stack, show) {

    if (node_stack.length == 0) {
        remote.dialog.showErrorBox('输入有误', '不存在拓扑排序，请重新输入');
        return -1;
    }
    let i = node_stack.pop();

    for (let j in adjacency_list.list[i]) {
        degree_node[adjacency_list.list[i][j][0]]--;
        if (degree_node[adjacency_list.list[i][j][0]] == 0) {
            node_stack.push(adjacency_list.list[i][j][0]);
        }
    }
    delete degree_node[i];
    if (show) {
        if (option2.series[0].data.length == 0) {
            option2.series[0].data.push({ value: String(i), y: 700, x: 50 });
        }
        else {
            option2.series[0].data.push({ value: String(i), y: 700, x: 50 * (option2.series[0].data.length + 1) });
        }
        let temp_data = [];
        for (let k in option.series[0].data) {
            if (option.series[0].data[k].id != i) {
                let temp_obj = { id: String(option.series[0].data[k].id), value: String(option.series[0].data[k].id) + "\n入度:" + degree_node[option.series[0].data[k].id] };
                if (degree_node[option.series[0].data[k].id] == 0) {
                    temp_obj.itemStyle = {};
                    temp_obj.itemStyle.color = "blue";
                }
                //itemStyle
                temp_data.push(temp_obj);
            }
        }
        option.series[0].data = temp_data;
        temp_data = [];
        for (let k in option.series[0].links) {
            if (option.series[0].links[k].source != i) {
                temp_data.push(option.series[0].links[k]);
            }
        }
        option.series[0].links = temp_data;
        chart_object2.clear();
        chart_object.clear();
        chart_object.setOption(option);
        chart_object2.setOption(option2);
        if (Object.keys(degree_node).length == 0) {
            document.getElementById("click_area").style.display = "block";
        }
    }


    return 0;
}
