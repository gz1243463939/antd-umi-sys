import { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from "lodash";
import chartConfig from '../config';
import { showLoading, dataSerialize, rowsToColumns } from '../_';

class Radar extends Component {
    constructor(props) {
        super(props);
        const { handleClick = () => { } } = props;
        this.state = {
            onEvents: {
                click: (params) => {
                    handleClick(params);
                }
            }
        };
    }
    render() {
        const {
            data = {},
            title,
            style,
            colIndex = 0
        } = this.props;
        const { onEvents } = this.state;
        const { columns = [] } = data;
        const res = dataSerialize(data);
        const { axisData, seriesData } = res;
        const _seriesData = rowsToColumns(seriesData);
        const legendData = axisData;
        const indicator = _.remove(columns.map((item, i) => {
            if (i !== colIndex) {
                const { name, max } = item;
                return {
                    name,
                    max
                };
            }
        }), (v) => {
            return v !== undefined;
        });
        const option = {
            title: {
                text: title
            },
            tooltip: {},
            legend: {
                left: 10,
                orient: 'vertical',
                data: legendData
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator
            },
            series: [{
                name: '预算 vs 开销（Budget vs spending）',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: legendData.map((item, i) => {
                    return {
                        name: item,
                        value: _seriesData[i]
                    };
                })
            }]
        };
        return (
            <ReactEcharts
                option={option}
                {...chartConfig}
                style={style}
                onEvents={onEvents}
                showLoading={showLoading(data)}
            />
        );
    }
}

export default Radar;
