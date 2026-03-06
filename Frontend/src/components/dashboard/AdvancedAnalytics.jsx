import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function AdvancedAnalytics({ interviews }) {
  const [analytics, setAnalytics] = useState({
    trend: [],
    scoreDistribution: { excellent: 0, good: 0, fair: 0, needsWork: 0 },
    averagesByRole: {},
    improvementRate: 0,
  });

  useEffect(() => {
    if (interviews.length === 0) return;

    const completed = interviews.filter(i => i.status === 'completed');
    if (completed.length === 0) return;

    const scores = completed.map(i => i.overall_score || 0).sort((a, b) => a - b);
    const trend = scores.slice(-5);

    const distribution = {
      excellent: scores.filter(s => s >= 90).length,
      good: scores.filter(s => s >= 80 && s < 90).length,
      fair: scores.filter(s => s >= 70 && s < 80).length,
      needsWork: scores.filter(s => s < 70).length,
    };

    const byRole = {};
    completed.forEach(interview => {
      if (!byRole[interview.job_role]) {
        byRole[interview.job_role] = [];
      }
      byRole[interview.job_role].push(interview.overall_score || 0);
    });

    const avgByRole = {};
    Object.entries(byRole).forEach(([role, scores]) => {
      avgByRole[role] = {
        average: Math.round(scores.reduce((a, b) => a + b) / scores.length),
        count: scores.length,
      };
    });

    const improvementRate = completed.length > 1
      ? Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100)
      : 0;

    setAnalytics({
      trend,
      scoreDistribution: distribution,
      averagesByRole: avgByRole,
      improvementRate,
    });
  }, [interviews]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Excellent</p>
              <p className="text-3xl font-bold text-green-400">{analytics.scoreDistribution.excellent}</p>
            </div>
            <Target className="text-green-400" size={24} />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Good (80+)</p>
              <p className="text-3xl font-bold text-blue-400">{analytics.scoreDistribution.good}</p>
            </div>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Fair (70+)</p>
              <p className="text-3xl font-bold text-yellow-400">{analytics.scoreDistribution.fair}</p>
            </div>
            <Target className="text-yellow-400" size={24} />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Improvement</p>
              <p className={`text-3xl font-bold ${analytics.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analytics.improvementRate >= 0 ? '+' : ''}{analytics.improvementRate}%
              </p>
            </div>
            {analytics.improvementRate >= 0 ? (
              <TrendingUp className="text-green-400" size={24} />
            ) : (
              <TrendingDown className="text-red-400" size={24} />
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Score Trend</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {analytics.trend.length === 0 ? (
              <p className="text-white/60">No data available</p>
            ) : (
              analytics.trend.map((score, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t"
                    style={{ height: `${Math.max(20, (score / 100) * 100)}%` }}
                  ></div>
                  <p className="text-white/60 text-xs mt-2">{score}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Performance by Role</h3>
          <div className="space-y-4">
            {Object.entries(analytics.averagesByRole).length === 0 ? (
              <p className="text-white/60">No role data available</p>
            ) : (
              Object.entries(analytics.averagesByRole).map(([role, data]) => (
                <div key={role}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white text-sm font-medium">{role}</span>
                    <span className="text-white/60 text-xs">{data.count} interviews</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${data.average}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-white font-semibold text-sm mt-1">{data.average}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
