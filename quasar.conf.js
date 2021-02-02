// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      "prototype",
      "lodash",
      "axios",
      "vue-mqtt",
      "vue2-google-maps",
      "vue-timers",
    ],
    css: ["app.styl"],
    extras: [
      ctx.theme.mat ? "roboto-font" : null,
      "material-icons", // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
        });
      },
    },
    devServer: {
      // https: true,
      port: 8080,
      open: false, // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        "QLayout",
        "QLayoutHeader",
        "QLayoutDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QCard",
        "QCardTitle",
        "QCardMain",
        "QCardMedia",
        "QCardSeparator",
        "QCardActions",
        "QBtnGroup",
        "QBtn",
        "QIcon",
        "QList",
        "QListHeader",
        "QCollapsible",
        "QItem",
        "QItemTile",
        "QItemMain",
        "QItemSide",
        "QItemSeparator",
        "QField",
        "QInput",
        "QTabs",
        "QTab",
        "QTabPane",
        "QScrollArea",
        "QWindowResizeObservable",
        "QResizeObservable",
        "QChip",
        "QAlert",
        "QModal",
        "QModalLayout",
        "QRange",
        "QToggle",
        "QSearch",
        "QUploader",
      ],
      directives: ["Ripple", "CloseOverlay"],
      // Quasar plugins
      plugins: ["Notify", "Dialog", "Loading", "AppFullscreen"],

      config: {
        notify: {
          type: "info",
        },
      },
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false,
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      workboxOptions: { skipWaiting: true, clientsClaim: true },
      manifest: {
        name: "GEN Tracker",
        short_name: "GEN-Tracker",
        description: "GEN motorcycle tracker",
        display: "standalone",
        orientation: "portrait",
        background_color: "#000000",
        theme_color: "#027be3",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      },
    },
  };
};
