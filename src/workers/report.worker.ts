// import { Worker } from 'bullmq'

// const worker = new Worker(
//   'reportQueue',
//   async job => {

//     if (job.name === 'generateReport') {

//       console.log('Generating report for', job.data.reportId)

//       // your heavy logic here
//       // generate Excel
//       // generate PDF

//     }

//   },
//   {
//     connection: {
//       host: 'localhost',
//       port: 6379
//     }
//   }
// )