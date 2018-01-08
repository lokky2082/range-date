import rangeDate from 'src/components/rangeDate.vue'
import { createVM } from '../helpers/utils.js'
/* const options = {
  startDay: '22.11.2017'
} */
/* :single="true"
   :passedFromTo="{from: '2017-11-10', to: '2017-11-20', single: '2018-01-10'}"
   :inputNames="{from:'from', to:'to', single: 'from'}"
   :startDay="'2017-11-10'"
   :today="'2017-11-16'"
   :singleDate= "'2018-01-10'" */
describe('rangeDate.vue', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `<range-date 
                                  :single="true"
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
