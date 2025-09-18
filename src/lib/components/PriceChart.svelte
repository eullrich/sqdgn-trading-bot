<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import 'chartjs-adapter-date-fns';

	export let data: Array<{time: string; avg_price_change_5m: number; total_volume_5m: number; total_transactions: number; active_tokens: number}> = [];
	export let title: string = 'Price Trends';
	export let height: number = 300;
	export let showVolume: boolean = true;

	let chartContainer: HTMLCanvasElement;
	let chart: Chart | null = null;

	Chart.register(...registerables);

	onMount(() => {
		if (data.length > 0) {
			createChart();
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	$: if (chart && data) {
		updateChart();
	}

	function createChart() {
		const ctx = chartContainer.getContext('2d');
		if (!ctx) return;

		const datasets = [
			{
				label: 'Avg Price Change %',
				data: data.map(d => ({
					x: d.time,
					y: d.avg_price_change_5m
				})),
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				tension: 0.4,
				fill: true,
				yAxisID: 'y'
			}
		];

		if (showVolume) {
			datasets.push({
				label: 'Total Volume',
				data: data.map(d => ({
					x: d.time,
					y: d.total_volume_5m
				})),
				borderColor: 'rgb(16, 185, 129)',
				backgroundColor: 'rgba(16, 185, 129, 0.1)',
				tension: 0.4,
				fill: false,
				yAxisID: 'y1'
			});
		}

		chart = new Chart(ctx, {
			type: 'line',
			data: { datasets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false,
				},
				plugins: {
					title: {
						display: true,
						text: title
					},
					legend: {
						display: true,
						position: 'top'
					}
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'minute',
							displayFormats: {
								minute: 'HH:mm',
								hour: 'HH:mm'
							}
						},
						title: {
							display: true,
							text: 'Time'
						}
					},
					y: {
						type: 'linear',
						display: true,
						position: 'left',
						title: {
							display: true,
							text: 'Price Change %'
						},
						grid: {
							drawOnChartArea: true,
						},
					},
					...(showVolume && {
						y1: {
							type: 'linear',
							display: true,
							position: 'right',
							title: {
								display: true,
								text: 'Volume'
							},
							grid: {
								drawOnChartArea: false,
							},
						}
					})
				}
			}
		});
	}

	function updateChart() {
		if (!chart) return;

		const datasets = [
			{
				label: 'Avg Price Change %',
				data: data.map(d => ({
					x: d.time,
					y: d.avg_price_change_5m
				})),
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				tension: 0.4,
				fill: true,
				yAxisID: 'y'
			}
		];

		if (showVolume) {
			datasets.push({
				label: 'Total Volume',
				data: data.map(d => ({
					x: d.time,
					y: d.total_volume_5m
				})),
				borderColor: 'rgb(16, 185, 129)',
				backgroundColor: 'rgba(16, 185, 129, 0.1)',
				tension: 0.4,
				fill: false,
				yAxisID: 'y1'
			});
		}

		chart.data.datasets = datasets;
		chart.update();
	}
</script>

<div class="w-full" style="height: {height}px;">
	<canvas bind:this={chartContainer}></canvas>
</div>