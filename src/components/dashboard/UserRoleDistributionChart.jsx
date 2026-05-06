import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const UserRoleDistributionChart = ({ data = [] }) => {
  return (
    <section className={cardClass}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">User role distribution</h2>
        <p className="mt-1 text-sm text-slate-500">
          Breakdown of the current audience mix across the platform ecosystem.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div className="h-[280px] w-full">
          <PieChart responsive style={{ width: '100%', height: '100%' }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={104}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
              }}
            />
          </PieChart>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.name} className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                </div>
                <p className="text-sm font-semibold text-slate-950">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRoleDistributionChart;
