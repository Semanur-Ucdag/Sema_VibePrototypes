export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'secondary',
      neutral: 'neutral'
    },
    navigationMenu: {
      slots: {
        root: 'relative flex gap-2.5 [&>div]:min-w-0 border-r border-none',
        link: 'group relative w-full flex items-center gap-2.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2'
      },
      variants: {
        orientation: {
          horizontal: {
            item: 'py-3',
            link: 'px-3.5 py-2.5 before:inset-x-px before:inset-y-0'
          },
          vertical: {
            link: 'flex-row px-3.5 py-2.5 before:inset-y-px before:inset-x-0'
          }
        },
        active: {
          true: {
            childLink: 'before:bg-primary/10 text-highlighted',
            childLinkIcon: 'text-default'
          }
        }
      },
      compoundVariants: [
        {
          disabled: false,
          variant: 'pill',
          highlight: true,
          orientation: 'horizontal',
          class: {
            link: 'data-[state=open]:before:bg-primary/10'
          }
        },
        {
          disabled: false,
          variant: 'pill',
          highlight: false,
          active: false,
          orientation: 'horizontal',
          class: {
            link: 'data-[state=open]:before:bg-primary/10'
          }
        },
        {
          variant: 'pill',
          active: true,
          highlight: false,
          class: {
            link: 'before:bg-primary/10'
          }
        }
      ]
    },
    dashboardSidebar: {
      slots: {
        root: 'bg-white'
      }
    },
    dashboardNavbar: {
      slots: {
        root: 'border-b border-none'
      }
    }
  }
})
