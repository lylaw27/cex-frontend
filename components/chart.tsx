"use client"
import dynamic from 'next/dynamic'
import {ApexOptions} from "apexcharts";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PriceChart({candles}:{candles: ApexOptions}){

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={candles} series={candles.series} type="candlestick" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
}