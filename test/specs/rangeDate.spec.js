import rangeDate from 'src/components/rangeDate.vue'
import { createVM } from '../helpers/utils.js'
const options = {
  startDay: '22.11.2017'
}
//:passedFromTo="{from: '2017-11-10', to: '2017-11-20'}"
describe('rangeDate.vue', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `<range-date :startDay="'2017-11-10'" :today="'2017-11-16'" :inputNames="{from:'from', to:'to'}" ></range-date>`, { components: { rangeDate }})
  })
})
