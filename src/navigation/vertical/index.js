const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'clarity:dashboard-line',
      action: 'read',
      subject: 'dashboard'
    },
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: 'read',
      subject: 'home-page'
    },
    {
      title: 'User',
      path: '/users',
      icon: 'tabler:user',
    },
    {
      title: 'Weekly Duch',
      path: '/weekly-duch',
      icon: 'tabler:text-wrap-disabled',
      action: 'read',
      subject: 'weekly-duch',
    },
    {
      title: 'Setup',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Master Data',
          icon: 'tabler:layout-grid',
          path: '/masterdata',
        },
        {
          title: 'Section',
          icon: 'tabler:layout-grid',
          path: '/section',
        }
      ]
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      icon: 'tabler:shield',
      title: 'Access Control'
    },
  ]
}

export default navigation
