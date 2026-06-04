import { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import RevenueChart from '@/components/charts/RevenueChart'
import OrdersChart from '@/components/charts/OrdersChart'
import CustomerSegmentationChart from '@/components/charts/CustomerSegmentationChart'
import ProductPerformanceChart from '@/components/charts/ProductPerformanceChart'
import { getAnalyticsData, getMLInsights } from '@/services/analyticsService'
import { classifyCustomers, segmentCustomers, getCustomerSegments } from '@/services/mlService'
import type { AnalyticsData, MLInsight, ClassificationResult, ClusterResult } from '@/types'

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [insights, setInsights] = useState<MLInsight[]>([])
  const [classifications, setClassifications] = useState<ClassificationResult[]>([])
  const [clusters, setClusters] = useState<ClusterResult[]>([])
  const [loading, setLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [segmentData, setSegmentData] = useState<{ name: string; value: number; color: string }[]>([])

  async function loadData() {
    setLoading(true)
    try {
      const [analyticsData, mlInsights, classData, clusterData, segments] = await Promise.all([
        getAnalyticsData(),
        getMLInsights(),
        classifyCustomers(),
        segmentCustomers(),
        getCustomerSegments(),
      ])
      setAnalytics(analyticsData)
      setInsights(mlInsights)
      setClassifications(classData)
      setClusters(clusterData)
      setSegmentData(segments)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRetrain = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
    loadData()
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Advanced Analytics & ML"
        subtitle="Predictive intelligence and deep neural insights for enterprise growth."
        actions={
          <>
            <button className="px-4 py-2 bg-surface-secondary text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-all">
              Generate Report
            </button>
            <button
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-all"
              onClick={handleRetrain}
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Retrain Models
            </button>
          </>
        }
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-system-background rounded-xl inner-stroke soft-shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-ink-primary">Revenue Trend</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">Monthly revenue ({analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth}% growth)</p>
            </div>
          </div>
          <RevenueChart data={analytics.revenue} />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-system-background rounded-xl inner-stroke soft-shadow p-6 ml-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-headline-md text-headline-md text-ink-primary">AI Recommender</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="font-label-md text-label-md text-primary font-bold">Inventory Alert</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Product demand trending higher than average. Restock recommended.</p>
              </div>
              <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                <p className="font-label-md text-label-md text-success font-bold">Churn Prediction</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{classifications.filter(c => c.classification === 'Occasional Buyer').length} customers show decreasing activity.</p>
              </div>
              <div className="p-4 bg-tertiary/5 rounded-lg border-l-4 border-tertiary">
                <p className="font-label-md text-label-md text-tertiary font-bold">Market Anomaly</p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Significant demand shift detected. Analyzing local trends...</p>
              </div>
            </div>
            <button className="w-full mt-6 text-center font-label-md text-label-md text-primary hover:underline">View All Insights</button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 bg-system-background rounded-xl inner-stroke soft-shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-ink-primary">Orders Trend</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">Monthly order volume</p>
            </div>
          </div>
          <OrdersChart data={analytics.orders} />
        </div>
        <div className="col-span-12 lg:col-span-6 bg-system-background rounded-xl inner-stroke soft-shadow p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-ink-primary">Propensity to Purchase</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">Cross-segment customer conversion probability heatmap.</p>
            </div>
            <div className="text-right">
              <span className="font-headline-md text-headline-md text-success font-bold">{analytics.propensityScore}%</span>
              <p className="font-label-sm text-label-sm text-outline uppercase">Overall Confidence</p>
            </div>
          </div>
          <CustomerSegmentationChart data={segmentData} />
        </div>
        <div className="col-span-12 bg-system-background rounded-xl inner-stroke soft-shadow p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline-lg text-headline-lg text-ink-primary">Product Performance</h3>
              <p className="text-on-surface-variant font-label-md text-label-md mt-1">Revenue by product</p>
            </div>
          </div>
          <ProductPerformanceChart data={analytics.productPerformance} />
        </div>
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-system-background rounded-xl inner-stroke soft-shadow p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[32px]">people</span>
            </div>
            <h4 className="font-headline-md text-headline-md text-ink-primary">Customer Classification</h4>
            <div className="mt-4 w-full space-y-2">
              {['Frequent Buyer', 'Occasional Buyer', 'New Customer'].map(label => (
                <div key={label} className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="font-semibold">{classifications.filter(c => c.classification === label).length}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-system-background rounded-xl inner-stroke soft-shadow p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-4">
              <span className="material-symbols-outlined text-[32px]">layers</span>
            </div>
            <h4 className="font-headline-md text-headline-md text-ink-primary">Customer Clusters</h4>
            <div className="mt-4 w-full space-y-2">
              {['High Value Buyers', 'Medium Value Buyers', 'New Buyers'].map(label => (
                <div key={label} className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">{label}</span>
                  <span className="font-semibold">{clusters.filter(c => c.label === label).length}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-system-background rounded-xl inner-stroke soft-shadow p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
              <span className="material-symbols-outlined text-[32px]">insights</span>
            </div>
            <h4 className="font-headline-md text-headline-md text-ink-primary">Pattern Recognition</h4>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2">Novel purchasing correlation found across segments.</p>
            <div className="mt-auto pt-6">
              <button className="px-6 py-2 border border-outline-variant text-ink-primary rounded-lg font-label-md text-label-md hover:bg-surface-secondary transition-all">View Correlation</button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-10 right-10 glass px-6 py-4 rounded-xl soft-shadow z-[100] flex items-center gap-3 transition-all duration-500 ${
          toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <span className="material-symbols-outlined text-success">check_circle</span>
        <span className="font-label-md text-label-md">Models updated successfully.</span>
      </div>
    </>
  )
}
