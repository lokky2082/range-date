<template>
  <div class="RangeDate_day" :class="dayClasses" @click="passDate(day)">
      <div class="RangeDate_day-hover">
      </div>
      <span class="RangeDate_day-date">{{dayNum}}</span>
  </div>
</template>
<script>
  import { format } from 'date-fns'
  const ruLocale = require('date-fns/locale/ru')
  export default {
    name: 'day',
    props: {
      day: {
        type: Object,
        default () {
        }
      }
    },
    data () {
      return {
      }
    },
    computed: {
      dayNum () {
          return format(this.day.day, 'D')
      },
      dayClasses () {
          let classArr = [];
           if(this.day.disabled) {
             classArr.push('disabled')
           }
           if (this.day.inRange) {
             classArr.push('inRange')
           }
           if (this.day.today) {
             classArr.push('today')
           }
          return classArr.join(' ')
      }
    },
    methods: {
      passDate (day) {
        this.$parent.$emit('change-range', day)
      }
    }
  }
</script>
<style>
  .RangeDate_day {
      width: calc(100% / 7);
      height:50px;
      border-bottom: 1px solid #ccc;
      padding: 10px;
      box-sizing: border-box;
      font-size:1em;
      cursor:pointer;
      transition: background 0.7s ease;
      position: relative;
  &.disabled {
     color:#ccc;
     cursor:default;
   }
  &:hover {
     background: #eaeaea;
     transition: background 0.3s ease;
   }
  &.inRange {
     color:#ffff
   }

  }
  .RangeDate_day-hover {
    width:100%;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background:#ff7300;
    transform: scaleX(0);
    transition:all 0.7s ease;
    transform-origin: 0 50%;
  }
  .inRange .RangeDate_day-hover {
    transform: scaleX(1);
  }
  .RangeDate_day-date {
    position: relative;
    z-index: 10;
  }
  .RangeDate_day.today .RangeDate_day-date{
    border-bottom: 1px solid red;
  }
</style>
