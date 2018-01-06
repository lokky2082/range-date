import rangeDate from 'src/components/rangeDate.vue'
import { createVM } from '../helpers/utils.js'
/* const options = {
  startDay: '22.11.2017'
} */
// :passedFromTo="{from: '2017-11-10', to: '2017-11-20'}"
describe('rangeDate.vue', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `<range-date 
                                  :startDay="'2017-11-10'" 
                                  :today="'2017-11-16'" 
                                  :inputNames="{from:'from', to:'to'}" 
                                  :placeholders="{from:'c', to:'по'}"
                                  @date-was-changed="ChangedDate" >
                                  </range-date>`,
      { components: { rangeDate },
        methods: {
          ChangedDate (dates) {
            console.log('date-was-changed')
            console.log(dates)
          }
        }
      })
    console.log(vm.components)
  })
})
