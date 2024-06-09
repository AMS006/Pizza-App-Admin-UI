// SalesChart.js
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // This is needed to register the Chart.js components
import { getSalesReport } from '../../http/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const SalesChart = () => {

    const { data: salesReport } = useQuery({
        queryKey: ['salesReport'],
        queryFn: getSalesReport,

    })

    const data = useMemo(() => {
        if (salesReport && salesReport?.data?.length > 0) {
            return {
                labels: salesReport?.data?.map((report: ReportType) => report.date),
                datasets: [
                    {
                        label: 'Sales',
                        data: salesReport?.data?.map((report: ReportType) => report.totalSales),
                        fill: true,
                        backgroundColor: 'transparent',
                        borderColor: '#f97316',
                        tension: 0.4, // This adds the smoothing effect
                    },
                ],
            };
        }
        return {
            labels: [],
            datasets: [
                {
                    label: 'Sales',
                    data: [],
                    fill: true,
                    backgroundColor: 'transparent',
                    borderColor: '#f97316',
                    tension: 0.4, // This adds the smoothing effect
                },
            ],
        };

    }, [salesReport])

    // const data = {
    //     labels: ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan',],
    //     datasets: [
    //         {
    //             label: 'Sales',
    //             data: [10000, 12000, 18000, 25000, 20000, 30000,],
    //             fill: true,
    //             backgroundColor: 'transparent',
    //             borderColor: '#f97316',
    //             tension: 0.4, // This adds the smoothing effect
    //         },
    //     ],
    // };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: { toLocaleString: () => string; }) {
                        return '₹' + value.toLocaleString();
                    },
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default SalesChart;
