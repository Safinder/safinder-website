function StatCard({ title, value, change, icon, isAlert = false }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
        {change && (
           <p className={`text-xs mt-2 font-medium ${isAlert ? 'text-red-600' : 'text-slate-400'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;