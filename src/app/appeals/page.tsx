// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useState } from 'react';
// import { api } from '../../shared/api/axios';

// export default function AppealsPage() {
//   const [appeals, setAppeals] = useState<any[]>([]);
//   const [message, setMessage] = useState('');
//   const [goalLogId, setGoalLogId] = useState('');

//   const load = async () => {
//     const res = await api.get('/appeals/my');
//     setAppeals(res.data);
//   };

//   const send = async () => {
//     await api.post('/appeals', {
//       goalLogId,
//       message,
//     });

//     setMessage('');
//     load();
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-xl mb-4">Обжалования</h1>

//       <div className="bg-white p-4 rounded shadow mb-6">
//         <input
//           placeholder="ID лога"
//           className="border p-2 w-full mb-2"
//           onChange={(e) => setGoalLogId(e.target.value)}
//         />

//         <textarea
//           placeholder="Сообщение"
//           className="border p-2 w-full mb-2"
//           onChange={(e) => setMessage(e.target.value)}
//         />

//         <button
//           onClick={send}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Отправить
//         </button>
//       </div>

//       {appeals.map((a) => (
//         <div key={a.id} className="border p-2 mb-2">
//           {a.message} — {a.status}
//         </div>
//       ))}
//     </div>
//   );
// }