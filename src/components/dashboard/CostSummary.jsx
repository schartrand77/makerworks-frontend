// src/components/dashboard/CostSummary.jsx
export default function CostSummary({ userId }) {
  // TODO: fetch actual data
  const summary = {
    totalSpent: '$172.34',
    filamentUsed: '1.45 kg',
    jobsThisMonth: 5,
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">This Month</h2>
      <p className="text-sm text-gray-400">Filament used: {summary.filamentUsed}</p>
      <p className="text-sm text-gray-400">Jobs submitted: {summary.jobsThisMonth}</p>
      <p className="text-sm font-medium mt-4">Total Spent: <span className="text-xl">{summary.totalSpent}</span></p>
    </div>
  )
}