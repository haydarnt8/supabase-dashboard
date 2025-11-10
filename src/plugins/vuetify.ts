import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { ar } from 'vuetify/locale'

export default createVuetify({
  defaults: {
    IconBtn: {
      icon: true,
      color: 'default',
      variant: 'text',
    },
    VAlert: {
      density: 'comfortable',
      VBtn: {
        color: undefined,
      },
    },
    VAvatar: {
      // ℹ️ Remove after next release
      variant: 'flat',
    },
    VBadge: {
      // set v-badge default color to primary
      color: 'primary',
    },
    VBtn: {
      // set v-btn default color to primary
      color: 'primary',
    },
    VChip: {
      label: true,
    },
    VDataTable: {
      VPagination: {
        showFirstLastPage: true,
        firstIcon: 'tabler-chevrons-left',
        lastIcon: 'tabler-chevrons-right',
      },
    },
    VDataTableServer: {
      VPagination: {
        showFirstLastPage: true,
        firstIcon: 'tabler-chevrons-left',
        lastIcon: 'tabler-chevrons-right',
      },
    },
    VExpansionPanel: {
      expandIcon: 'tabler-chevron-right',
      collapseIcon: 'tabler-chevron-right',
    },
    VExpansionPanelTitle: {
      expandIcon: 'tabler-chevron-right',
      collapseIcon: 'tabler-chevron-right',
    },
    VList: {
      color: 'primary',
      density: 'compact',
      VCheckboxBtn: {
        density: 'compact',
      },
      VListItem: {
        ripple: false,
        VAvatar: {
          size: 40,
        },
      },
    },
    VMenu: {
      offset: '2px',
    },
    VPagination: {
      density: 'comfortable',
      variant: 'tonal',
    },
    VTabs: {
      // set v-tabs default color to primary
      color: 'primary',
      density: 'comfortable',
      VSlideGroup: {
        showArrows: true,
      },
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top',
    },
    VCheckboxBtn: {
      color: 'primary',
    },
    VCheckbox: {
      // set v-checkbox default color to primary
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VRadioGroup: {
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VRadio: {
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
      VChip: {
        label: true,
      },
    },
    VRangeSlider: {
      // set v-range-slider default color to primary
      color: 'primary',
      trackSize: 6,
      thumbSize: 22,
      density: 'comfortable',
      thumbLabel: true,
      hideDetails: 'auto',
    },
    VRating: {
      // set v-rating default color to primary
      color: 'warning',
    },
    VProgressLinear: {
      height: 6,
      roundedBar: true,
      rounded: true,
      bgColor: 'rgba(var(--v-track-bg))',
    },
    VSlider: {
      // set v-range-slider default color to primary
      color: 'primary',
      thumbLabel: true,
      hideDetails: 'auto',
      thumbSize: 22,
      trackSize: 6,
      elevation: 4,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      variant: 'outlined',
      color: 'primary',
      density: 'comfortable',
      hideDetails: 'auto',
      menuProps: {
        contentClass: 'app-autocomplete__content v-autocomplete__content',
      },
      VChip: {
        label: true,
      },
    },
    VCombobox: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
      VChip: {
        label: true,
      },
    },
    VFileInput: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VSnackbar: {
      VBtn: {
        density: 'comfortable',
      },
    },
    VSwitch: {
      // set v-switch default color to primary
      inset: true,
      color: 'primary',
      hideDetails: 'auto',
      ripple: false,
    },
    VNavigationDrawer: {
      touchless: true,
    },

  },
  locale: {
    locale: 'ar',
    messages: { ar }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0A1628',
          surface: '#132337',
          'surface-bright': '#1E3A52',
          'surface-light': '#2A4A64',
          'surface-variant': '#1E3A52',
          'on-surface-variant': '#E1E7EF',
          primary: '#0EA5E9',
          'primary-darken-1': '#0284C7',
          secondary: '#14B8A6',
          'secondary-darken-1': '#0D9488',
          accent: '#3B82F6',
          error: '#EF4444',
          info: '#06B6D4',
          success: '#10B981',
          warning: '#F59E0B',
          'on-background': '#F8FAFC',
          'on-surface': '#F1F5F9',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        }
      },
      light: {
        dark: false,
        colors: {
          background: '#F8FAFC',
          surface: '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-light': '#F1F5F9',
          'surface-variant': '#F8FAFC',
          'on-surface-variant': '#64748B',
          primary: '#0EA5E9',
          'primary-darken-1': '#0284C7',
          secondary: '#14B8A6',
          'secondary-darken-1': '#0D9488',
          accent: '#3B82F6',
          error: '#EF4444',
          info: '#06B6D4',
          success: '#10B981',
          warning: '#F59E0B',
          'on-background': '#0F172A',
          'on-surface': '#1E293B',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
        }
      }
    }
  }
})
