import rangeDate from 'src/components/rangeDate.vue'
import { createVM } from '../helpers/utils.js'
/* const options = {
  startDay: '22.11.2017'
} */
/* :single="true" для одной даты
   :passedFromTo="{from: '2017-11-10', to: '2017-11-20', single: '2018-01-10'}"
   :inputNames="{from:'from', to:'to', single: 'from'}"
   :startDay="'2017-11-10'"
   :today="'2017-11-16'"
   :singleDate= "'2018-01-10'" */
describe('rangeDate.vue', function () {
  it('should render correct contents', function () {
    const vm = createVM(this, `   {{range}}
                                 <range-date
                                  v-model="range"
                                 >
                                  </range-date>`,
      { components: { rangeDate },
        data () {
          return {
            range: []
          }
        },
        created () {
          this.setDate()
          setTimeout(() => {
            this.range = []
            console.log(this.range)
          }, 2000)
        },
        methods: {
          ChangedDate (dates) {
            console.log('newRange', this.range)
            console.log('date-was-changed')
            console.log(dates)
          },
          setDate () {
            fetch('http://estroy.phoenix-cg.ru/api/tenders/').then((response) => {
              return response.data
            }).then((res) => {
              this.range.push('2018-01-18')
            })
          }
        }
      })
    console.log(vm.components)
  })
})
