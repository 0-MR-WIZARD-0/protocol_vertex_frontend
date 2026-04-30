// 'use client';

// import { useEffect, useState } from 'react';
// import { api } from '../../shared/api/axios';
// import { AnalyticsCharts } from '../../features/analytics/ui/Charts';

// export default function AnalyticsPage() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     api
//       .get('/analytics/daily?year=2026&month=4')
//       .then((res) => setData(res.data));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-xl mb-4">Аналитика</h1>
//       <AnalyticsCharts data={data} />
//     </div>
//   );
// }

