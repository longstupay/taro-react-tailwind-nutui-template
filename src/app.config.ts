export default defineAppConfig({
  pages: ['pages/landing/index'],
  subPackages: [
    {
      root: 'pages/vendor',
      pages: [
        'dashboard/index',
        'create-activity/index',
        'verification/index'
      ]
    },
    {
      root: 'pages/consumer',
      pages: [
        'shop/index',
        'profile/index'
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'StallMate',
    navigationBarTextStyle: 'black'
  }
});
