<template>
  <div class="RangeDate" @click.stop>
    <div class="RangeDate-inputs">
      <template v-if="!single">
        <input type="text"
              :name="inputNames.from"
              :class="statusFrom==='start'?'active': ''" 
              readonly 
              v-model="formmatedRange[0]"
              :placeholder="placeholders.from"
              @click="setStatusFrom('start'); openDates()"/>
        <input type="text" 
                :name="inputNames.to"
                :class="statusFrom==='end'?'active': ''"
                readonly
                v-model="formmatedRange[1]"
                :placeholder="placeholders.to"
                @click="setStatusFrom('end'); openDates()"/>
      </template>
      <template v-else>
           <input type="text"
              :name="inputNames.single"
              readonly 
              v-model="singleFormated"
              :placeholder="placeholders.from"
              @click="openDates()"/>
      </template>
         
    </div>
    <div class="RangeDate-holder" >
      <div class="RangeDate-conteiner" :class="showDates?'active':''">
        <header class="RangeDate-head">
          <div class="RangeDate_arr RangeDate_arr--left" @click="takePrevMonth()">
            <svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512"
              xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor">
              <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/>
            </svg>
          </div>
          <div class="RangeDate_title">{{currentDate.month}} {{currentDate.year}}</div>
          <div class="RangeDate_arr RangeDate_arr--right" @click="takeNextMonth()">
            <svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512"
              xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor">
              <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "/>
            </svg>
          </div>
        </header>
        <div class="RangeDate_weekdays">
          <div class="RangeDate_weekday" v-for="(day, i) in weekdays" :key="'weekday'+ i">
            {{day}}
          </div>
        </div>
        <div class="RangeDate_days">
          <day v-for="(day, i) in currentMonth" :key="'day'+i" :day="{day:day.date, disabled:day.disabled, inRange:day.inRange, today:day.today}">
          </day>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Day from './Day'
import { format, lastDayOfMonth, startOfMonth, getISODay, subDays, addDays, isWithinRange, isAfter, isBefore } from 'date-fns'
import setHours from 'date-fns/set_hours'
const ruLocale = require('date-fns/locale/ru')
export default {
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    startDay: {
      type: String,
      default () {
        return format(new Date(), 'YYYY-MM-DD')
      }
    },
    today: {
      type: String,
      default () {
        return format(new Date(), 'YYYY-MM-DD')
      }
    },
    inputNames: {
      type: Object,
      default () {
        return {
          from: 'from',
          to: 'to'
        }
      }
    },
    passedFromTo: {
      type: Object,
      default () {
        return {
          from: '',
          to: ''
        }
      }
    },
    placeholders: {
      type: Object,
      default () {
        return {
          from: '',
          to: ''
        }
      }
    },
    singleDate: {
      type: String
    },
    single: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  components: {
    Day
  },
  data () {
    return {
      date: false,
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      cellsLength: 42,
      selectedRange: [],
      formmatedRange: [],
      statusFrom: '',
      showDates: false,
      singleFormated: '',
      selected: null
    }
  },
  created () {
    this.$on('change-range', function (day) {
      this.changeRange(day)
    })
    document.addEventListener('click', () => {
      this.simpleClose()
    })
    this.setData()
  },
  destroyed () {
    document.removeEventListener('click', () => {
      this.simpleClose()
    })
  },
  watch: {
    value: function () {
      this.setData()
    }
  },
  computed: {
    dateComp () {
      if (this.date) {
        return this.date
      } else {
        let returnedDay = new Date()
        if (this.startDay !== '') {
          returnedDay = this.startDay
        }
        return returnedDay
      }
    },
    currentDate () {
      return { month: format(this.dateComp, 'MMMM', { locale: ruLocale }), year: format(this.dateComp, 'YYYY') }
    },
    startMonthDay () {
      return startOfMonth(this.dateComp)
    },
    lastMonthDay () {
      return lastDayOfMonth(this.dateComp)
    },
    currentMonth () {
      const month = []
      const startDayWeek = getISODay(this.startMonthDay)
      const endDayNumber = Number(format(this.lastMonthDay, 'DD'))
      const prevMonthFirstDay = subDays(this.startMonthDay, startDayWeek - 1)
      for (let i = 0; i < startDayWeek - 1; i++) {
        this.collectDays(month, prevMonthFirstDay, i, true)
      }
      for (let i = 0; i < endDayNumber; i++) {
        this.collectDays(month, this.startMonthDay, i, false)
      }
      if (month.length < this.cellsLength) {
        const lengthDiff = this.cellsLength - month.length
        for (let i = 1; i <= lengthDiff; i++) {
          this.collectDays(month, this.lastMonthDay, i, true)
        }
      }
      this.setRangeOption(month)
      this.setToday(month, new Date(this.today))
      return month
    }
  },
  methods: {
    collectDays (arr, day, i, disabled) {
      const date = addDays(new Date(day), i)
      let inRange = false
      const today = false
      if (this.selectedRange.length > 0) {
        inRange = isWithinRange(day, this.selectedRange[0].day, this.selectedRange[1].day)
      } else if (this.selected !== null) {
        inRange = isWithinRange(day, this.selected, this.selected)
      }
      arr.push({ date: date, disabled: disabled, inRange: inRange, today: today })
    },
    takeNextMonth () {
      this.date = addDays(this.lastMonthDay, 1)
    },
    takePrevMonth () {
      this.date = subDays(this.startMonthDay, 1)
    },
    setRangeOption (monthArr) {
      if (!this.single) {
        monthArr.forEach((day) => {
          if (isWithinRange(day.date, this.selectedRange[0], this.selectedRange[1])) {
            day.inRange = true
          } else {
            day.inRange = false
          }
        })
      } else {
        monthArr.forEach((day) => {
          if (isWithinRange(day.date, this.selected, this.selected)) {
            day.inRange = true
          } else {
            day.inRange = false
          }
        })
      }
    },
    setToday (monthArr, setedToday) {
      monthArr.forEach((day) => {
        const today = format(setedToday, 'YYYY-MM-DD')
        const sinDay = format(new Date(day.date), 'YYYY-MM-DD')
        if (today === sinDay) {
          day.today = true
        } else {
          day.today = false
        }
      })
    },
    changeRange (data) {
      if (!this.single) {
        this.notSingleChange(data)
      } else {
        this.singleChange(data)
      }
    },
    notSingleChange (data) {
      if (this.selectedRange.length > 0) {
        const [first, second] = this.selectedRange
        if (isAfter(data.day, second)) {
          this.$set(this.selectedRange, 1, data.day)
          this.$set(this.formmatedRange, 1, format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
        } else if (isBefore(data.day, second) && isAfter(data.day, first) && this.statusFrom === 'end') {
          this.$set(this.selectedRange, 1, data.day)
          this.$set(this.formmatedRange, 1, format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
        } else if (isBefore(data.day, second) && isAfter(data.day, first) && this.statusFrom === 'start') {
          this.$set(this.selectedRange, 0, data.day)
          this.$set(this.formmatedRange, 0, format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
        } else if (isBefore(data.day, first)) {
          this.$set(this.selectedRange, 0, data.day)
          this.$set(this.formmatedRange, 0, format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
        }
      } else {
        this.selectedRange.push(data.day)
        this.selectedRange.push(data.day)
        this.formmatedRange.push(format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
        this.formmatedRange.push(format(data.day, 'DD MMMM YYYY', { locale: ruLocale }))
      }
      this.setRangeOption(this.currentMonth)
      if (this.selectedRange.length > 0 && this.selectedRange[0] !== this.selectedRange[1]) {
        setTimeout(() => {
          this.closeDates()
        }, 500)
      }
    },
    singleChange (data) {
      this.selected = data.day
      this.singleFormated = format(setHours(data.day, 0), 'DD.MM.YYYY')
      this.setRangeOption(this.currentMonth)
      setTimeout(() => {
        this.closeDates()
      }, 500)
    },
    setStatusFrom (data) {
      this.statusFrom = data
    },
    setFromTo (from, to) {
      from = setHours(new Date(from), 0)
      to = setHours(new Date(to), 0)
      if (isAfter(new Date(to), new Date(from))) {
        this.$set(this.selectedRange, 0, new Date(from))
        this.$set(this.selectedRange, 1, new Date(to))
        this.$set(this.formmatedRange, 0, format(new Date(from), 'DD MMMM YYYY', { locale: ruLocale }))
        this.$set(this.formmatedRange, 1, format(new Date(to), 'DD MMMM YYYY', { locale: ruLocale }))
      } else {
        this.$set(this.selectedRange, 1, new Date(from))
        this.$set(this.selectedRange, 0, new Date(to))
        this.$set(this.formmatedRange, 1, format(new Date(from), 'DD MMMM YYYY', { locale: ruLocale }))
        this.$set(this.formmatedRange, 0, format(new Date(to), 'DD MMMM YYYY', { locale: ruLocale }))
      }
    },
    openDates () {
      this.showDates = true
    },
    closeDates () {
      if (this.single) {
        this.closeDatesSingle()
      } else {
        this.closeDatesRange()
      }
    },
    closeDatesRange () {
      this.showDates = false
      this.statusFrom = ''
      // this.value[0] = format(this.selectedRange[0], 'YYYY-MM-DD')
      // this.value[1] = format(this.selectedRange[1], 'YYYY-MM-DD')
      this.$set(this.value, 0, format(this.selectedRange[0], 'YYYY-MM-DD'))
      this.$set(this.value, 1, format(this.selectedRange[1], 'YYYY-MM-DD'))
      this.$emit('date-was-changed', [this.selectedRange[0], this.selectedRange[1]])
      this.$emit('input', this.value)
    },
    closeDatesSingle () {
      this.showDates = false
      this.statusFrom = ''
      this.$set(this.value, 0, format(this.selected, 'YYYY-MM-DD'))
      this.$emit('date-was-changed', this.selected)
      this.$emit('input', this.value)
    },
    simpleClose () {
      this.showDates = false
      this.statusFrom = ''
    },
    setData () {
      if (this.value.length === 0) {
        this.selectedRange = []
        this.formmatedRange = []
      }
      if (!this.single && (this.passedFromTo.from !== '') && (this.passedFromTo.to !== '')) {
        const { from, to } = this.passedFromTo
        this.setFromTo(from, to)
      } else if (!this.single && (this.value.length > 0)) {
        const from = this.value[0]
        const to = this.value[1] || this.value[0]
        // const [from, to] = this.value
        this.setFromTo(from, to)
      }
      if (this.single && this.singleDate) {
        this.singleFormated = format(setHours(new Date(this.singleDate), 0), 'DD.MM.YYYY')
        this.selected = setHours(new Date(this.singleDate), 0)
      }
      if (this.single && (this.value.length > 0) && !this.singleDate) {
        this.singleFormated = format(setHours(new Date(this.value[0]), 0), 'DD.MM.YYYY')
        this.selected = setHours(new Date(this.value[0]), 0)
      }
    }
  }
}
</script>

<style >
  .RangeDate {
    position:relative;
    * {
      box-sizing: border-box;
    }
  }
  .RangeDate-inputs input {
    height: 2.2rem;
    background-color: #fff;
    width: 100%;
    font-size: .9rem;
    padding-left: .3em;
    outline: none;
    cursor: pointer;
    margin-right:20px;
    &:last-child {
       margin-right:0;
    }
    &.active {
      border:1px solid #ff7300;
    }
  }
  .RangeDate-inputs {
    display: flex;
    justify-content: space-between;
  }
  .RangeDate-holder {
    position: relative;
  }
  .RangeDate-conteiner {
    border:#ccc;
    position: absolute;
    top:0;
    left:0;
    max-height: 0;
    overflow:hidden;
    transition: max-height 1s ease;
    background: #f6f8f9;
    z-index: 100;
    &.active {
       max-height: 500px;
    }
  }
  .RangeDate-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;
    padding: 20px 0;
  }
  .RangeDate_arr {
     width: 30px;
     height:30px;
     cursor:pointer;
     &--left {
       transform: rotate(-180deg);
     }
  }
  .RangeDate_weekdays {
    display: flex;
    box-sizing: border-box;
  }
  .RangeDate_weekday {
    width: calc(100% / 7);
    text-align: center;
    box-sizing: border-box;
  }
  .RangeDate_days {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    position:relative;
  }
</style>
