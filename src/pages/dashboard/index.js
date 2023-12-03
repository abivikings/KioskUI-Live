// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
            <br></br>
            <AnalyticsOrderVisits />
          </Grid>
          <Grid item xs={12} md={6}>
            <ApexDonutChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsEarningReports />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}
AnalyticsDashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default AnalyticsDashboard
