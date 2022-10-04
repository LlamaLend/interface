import * as React from 'react'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, MarkLineComponent } from 'echarts/components'

echarts.use([CanvasRenderer, LineChart, TooltipComponent, GridComponent, MarkLineComponent])

export interface IPoolUtilisationChartProps {
	minInterest: number
	maxInterest: number
}

const isDark = true
const xAxisData = new Array(101).fill('x').map((_, index) => index)

export default function PoolUtilisationChart({ minInterest, maxInterest }: IPoolUtilisationChartProps) {
	const id = React.useId()

	const series = React.useMemo(() => {
		const chartColor = '#14b8a6'

		const x_interval = 1
		const y_interval = (maxInterest - minInterest) / 100

		const series = [
			{
				name: 'Interest',
				type: 'line',
				emphasis: {
					focus: 'series',
					shadowBlur: 10
				},
				symbol: 'none',
				itemStyle: {
					color: chartColor
				},
				data: xAxisData.map((index) => [0 + x_interval * index, minInterest + y_interval * index])
			}
		]

		return series
	}, [minInterest, maxInterest])

	const createInstance = React.useCallback(() => {
		const element = document.getElementById(id)
		if (element) {
			const instance = echarts.getInstanceByDom(element)

			return instance || echarts.init(element)
		}
	}, [id])

	React.useEffect(() => {
		// create instance
		const chartInstance = createInstance()

		if (!chartInstance) return

		chartInstance.setOption({
			tooltip: {
				trigger: 'axis',
				formatter: function (params: any) {
					const chartdate =
						'<li style="list-style:none">' +
						'<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0062ff;"></span>' +
						'Pool Utilisation' +
						'&nbsp;&nbsp;' +
						`${params[0].value[0]}%`

					const interest = params.reduce((prev: string, curr: any) => {
						return (prev +=
							'<li style="list-style:none">' +
							curr.marker +
							curr.seriesName +
							'&nbsp;&nbsp;' +
							(curr.value[1] ? curr.value[1]?.toFixed(2) : curr.value[1]) +
							'%' +
							'</li>')
					}, '')

					return chartdate + interest
				}
			},
			grid: {
				left: 20,
				containLabel: true,
				bottom: 26,
				top: 6,
				right: 13
			},
			xAxis: {
				name: 'Pool Utilisation',
				type: 'category',
				boundaryGap: false,
				nameTextStyle: {
					fontFamily: 'sans-serif',
					fontSize: 14,
					fontWeight: 400
				},
				nameLocation: 'middle',
				nameGap: 34,
				axisLine: {
					lineStyle: {
						color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
						opacity: 0.2
					}
				},
				axisLabel: {
					formatter: '{value} %',
					hideOverlap: true
				},
				data: xAxisData
			},
			yAxis: {
				name: 'Interest',
				type: 'value',
				axisLine: {
					lineStyle: {
						color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)',
						opacity: 0.1
					}
				},
				axisLabel: {
					formatter: '{value} %'
				},
				boundaryGap: false,
				nameTextStyle: {
					fontFamily: 'sans-serif',
					fontSize: 14,
					fontWeight: 400,
					color: isDark ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
				},
				nameLocation: 'middle',
				nameGap: 44,
				splitLine: {
					lineStyle: {
						color: '#a1a1aa',
						opacity: 0.1
					}
				}
			},
			series,
			animation: false
		})

		function resize() {
			chartInstance?.resize()
		}

		window.addEventListener('resize', resize)

		return () => {
			window.removeEventListener('resize', resize)
			chartInstance.dispose()
		}
	}, [id, series, createInstance, maxInterest, minInterest])

	return <div id={id} style={{ height: '360px', margin: 'auto 0' }}></div>
}
