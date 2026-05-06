import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const cardClass =
  'rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]';

const PremiumConversionChart = ({ data = [], subtitle = '' }) => {
  return (
    <section className={cardClass}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Premium conversion</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="h-[320px] w-full">
        <BarChart
          data={data}
          responsive
          style={{ width: '100%', height: '100%' }}
          margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={48} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
            }}
          />
          <Legend />
          <Bar dataKey="free" stackId="conversion" fill="#cbd5e1" radius={[0, 0, 12, 12]} name="Free" />
          <Bar dataKey="premium" stackId="conversion" fill="#2563eb" radius={[12, 12, 0, 0]} name="Premium" />
        </BarChart>
      </div>
    </section>
  );
};

export default PremiumConversionChart;
