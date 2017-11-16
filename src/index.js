import RangeDate from './components/rangeDate.vue'

function rangeDate (Vue) {
  Vue.component('range-date', RangeDate)
}

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(rangeDate)
}

export default rangeDate
const version = '__VERSION__'
// Export all components too
export {
  RangeDate,
  version
}
