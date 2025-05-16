import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getColor } from '../../utils/colors';
import { chunkArray } from '../../utils/array';
import LegendSegment from './LegendSegment';

const PieChartMotos = ({data}) => {

  const ddata = Object.entries(data).flatMap(([category, entries]) =>
    Object.entries(entries).map(([bike, value]) => (
      {
      name: bike,
      value,
      brand: bike.split(" ")[0].toLowerCase(),
    }))
);

  return (
    <div className='flex flex-col items-center md:flex-row'>
      <div className='w-full sm:w-2/3 md:w-1/3'>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ddata}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
            >
              {ddata.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.brand)} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='flex flex-col sm:flex-row sm:gap-x-8 sm:flex-wrap'>
        {chunkArray(ddata, 10).map((entry, index) => (
            <LegendSegment key={index} data={entry}/>
        ))}
      </div>
    </div>
  )
};

export default PieChartMotos;
