"use strict";
function show_critical_path() {
    //改变图形的显示情况
    document.getElementById("input_area").style.display = "none";
    document.getElementById("draw_area").style.display = "inline";
    document.getElementById("draw_area2").style.display = "none";

    document.getElementById("input2").style.display = "inline";
    document.getElementById("input1").style.display = "inline";
    document.getElementById("input3").style.display = "inline";
    document.getElementById("input4").style.display = "none";

    option.title.text = "关键路径\n\n蓝色路径为关键路径";
    option.series[0].layout = "force";
    option.series[0].data = [];
    option.series[0].links = [];
    option.series[0].label.normal.fontSize = 12;
    option.series[0].force.repulsion = 1500;
    option.series[0].edgeLabel.normal.textStyle.fontSize = 12;
    let adjacency_list = read_data();
    let node_cnt = 0;
    let edge_cnt = 0;
    let degree_node = {};
    let node_stack = [];
    let ve = {};
    let vl = {};
    for (let i in adjacency_list.list) {
        degree_node[i] = 0;
        ve[i] = 0;
        vl[i] = 0;
    }
    for (let i in adjacency_list.list) {
        option.series[0].data[node_cnt] = { id: String(i), value: String(i) };
        for (let j = 0; j < adjacency_list.list[i].length; j++) {
            degree_node[adjacency_list.list[i][j][0]]++;
            option.series[0].links[edge_cnt] = { source: String(i), target: adjacency_list.list[i][j][0], weight: adjacency_list.list[i][j][1] };
            edge_cnt++
        }
        node_cnt++;
    }
    let cnt = Object.keys(degree_node).length;
    let temp_obj = deepCopy(degree_node);
    let node_sort_stack = [];
    let node_sort_stack2 = [];

    for (let i in degree_node) {
        if (degree_node[i] == 0) {
            node_sort_stack.push(i);
            node_sort_stack2.push(i);
        }
    }

    for (let i = 0; i < cnt; i++) {
        if (do_sort(temp_obj, adjacency_list, node_sort_stack, 0) == -1) {
            reset();
            return;
        }
    }
    //进行拓扑排序并且计算ve
    for (let i = 0; i < cnt; i++) {
        let j = node_sort_stack2.pop();

        node_stack.push(j);
        delete degree_node[j];
        for (let k in adjacency_list.list[j]) {
            degree_node[adjacency_list.list[j][k][0]]--;
            if(degree_node[adjacency_list.list[j][k][0]]==0)
            {
                node_sort_stack2.push(adjacency_list.list[j][k][0]);
            }
            ve[adjacency_list.list[j][k][0]] = Math.max(ve[adjacency_list.list[j][k][0]], ve[j] + adjacency_list.list[j][k][1]);
        }
    }

    let node_num_map={}
    for(let i in option.series[0].data)
    {
        node_num_map[option.series[0].data[i].id]=i
    }
    option.series[0].data[node_num_map[node_stack[0]]].fixed = true;
    option.series[0].data[node_num_map[node_stack[0]]].x = 50;
    option.series[0].data[node_num_map[node_stack[0]]].y = 250;

    option.series[0].data[node_num_map[node_stack[node_stack.length - 1]]].fixed = true;
    option.series[0].data[node_num_map[node_stack[node_stack.length - 1]]].x = 700;
    option.series[0].data[node_num_map[node_stack[node_stack.length - 1]]].y = 250;

    for (let i in adjacency_list.list) {
        vl[i] = ve[node_stack[node_stack.length - 1]];
    }

    while (node_stack.length > 0) {
        let now_node = node_stack.pop();
        for (let i in adjacency_list.list[now_node]) {
            vl[now_node] = Math.min(vl[now_node], vl[adjacency_list.list[now_node][i][0]] - adjacency_list.list[now_node][i][1]);

        }
    }

    node_cnt = 0;
    edge_cnt = 0;
    for (let i in adjacency_list.list) {
        option.series[0].data[node_cnt].value += "\nve:" + ve[i] + "\nvl:" + vl[i];
        node_cnt++;
        for (let j = 0; j < adjacency_list.list[i].length; j++) {
            option.series[0].links[edge_cnt].weight = "边权:" + String(option.series[0].links[edge_cnt].weight);
            option.series[0].links[edge_cnt].weight += "\nE=" + String(ve[i]) + "\nL=" + String(vl[adjacency_list.list[i][j][0]] - adjacency_list.list[i][j][1]) + "\nL-E=" + String(vl[adjacency_list.list[i][j][0]] - adjacency_list.list[i][j][1] - ve[i]);
            if (vl[adjacency_list.list[i][j][0]] - adjacency_list.list[i][j][1] - ve[i] == 0) {
                option.series[0].links[edge_cnt].lineStyle = {};
                option.series[0].links[edge_cnt].lineStyle.normal = {};
                option.series[0].links[edge_cnt].lineStyle.normal.color = "blue";
                option.series[0].data[node_num_map[i]].itemStyle = {};
                option.series[0].data[node_num_map[i]].itemStyle.color = "blue";
                option.series[0].data[node_num_map[adjacency_list.list[i][j][0]]].itemStyle = {};
                option.series[0].data[node_num_map[adjacency_list.list[i][j][0]]].itemStyle.color = "blue";
            }
            edge_cnt++;
        }
    }

    chart_object = show_graph(option, chart_object, "draw_area", 0.99, 0.9);
    option.series[0].label.normal.fontSize = 16;

    option.series[0].force.repulsion = 750;
    option.series[0].edgeLabel.normal.textStyle.fontSize = 16;
}