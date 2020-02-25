import React from 'react';
import './App.css';
import { IWeek } from './Calendar.type';

function WeekContainer() {
  const weekDatas: IWeek[] = [
    { text: 'SUN', value: 0 },
    { text: 'MON', value: 1 },
    { text: 'TUE', value: 2 },
    { text: 'WED', value: 3 },
    { text: 'THU', value: 4 },
    { text: 'FRI', value: 5 },
    { text: 'SAT', value: 6 }
  ];

  const weekList = weekDatas.map((week: IWeek) => <li className="biu-calendar__week_item" key={week.value}>{week.text}</li>);

  return (
    <ul className="biu-calendar__week">
      {weekList}
    </ul>
  )
}

function formateWithZero (num: number) {
  return num < 10 ? `0${num}` : num;
}

function formateDate (year: number, month: number, day: number) {
  return `${year}-${formateWithZero(month)}-${formateWithZero(day)}`;
}

function getCurrentCalendar(year: number, month: number, day: number) {
  let dayDate = [];
  const totalDays = 42;
  const currentDate = new Date(formateDate(year, month, day));
  // setDate(0):设置为上个月最后一天
  // const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  const lastDay = new Date(currentDate.setDate(0));
  // 获取当前月份的总天数
  const allDayNums = lastDay.getDate();
  // 获取当前月份第一天的日期
  const firstDate = new Date(lastDay.getFullYear(), lastDay.getMonth(), 1);
  // const firstDay = firstDate.getDay();
  for (let i = 1; i <= allDayNums; i++) {
    const dateString = formateDate(year, month, i);
    const dayObject = {
      value: dateString,
      week: new Date(dateString).getDay(),
      other: false,
      day: i,
      isToday: dateString === formateDate(year, month, day) ? true : false
    }
    dayDate.push(dayObject);
  }
  // 判断是否需要上个月数据
  if (dayDate[0].week && dayDate.length < totalDays) {
    const previousMonthDate = [];
    const previousMonthLastDay = new Date(firstDate.getTime() - 1000 * 60 * 60 * 24).getDate();
    const previousYear = month === 1 ? year - 1 : year;
    const previousMonth = month === 1 ? 12 : month - 1;
    for (let i = dayDate[0].week - 1; i >= 0; i--) {
      const dateString = formateDate(previousYear, previousMonth, previousMonthLastDay - i);
      const previousDayObject = {
        value: dateString,
        week: new Date(dateString).getDay(),
        other: true,
        day: previousMonthLastDay - i,
        isToday: false
      }
      previousMonthDate.push(previousDayObject);
    }
    dayDate = previousMonthDate.concat(dayDate);
  }
  // 判断是否需要下个月数据
  if (dayDate.length < totalDays) {
    const nextMonthDate = [];
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextMonthDateLength = totalDays - dayDate.length;

    for (let i = 1; i <= nextMonthDateLength; i++) {
      const dateString = formateDate(nextYear, nextMonth, i);
      const nextDayObject = {
        value: dateString,
        week: new Date(dateString).getDay(),
        other: true,
        day: i,
        isToday: false
      };
      nextMonthDate.push(nextDayObject);
    }
    dayDate = dayDate.concat(nextMonthDate);
  }

  return dayDate;
}

function getCurrentDate () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {year, month, day};
}

function DayContainer() {
  const {year, month, day} = getCurrentDate();
  const days = getCurrentCalendar(year, month, day);
  // const days = [30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2];
  const dayList = days.map((day, index) => {
    if (day.other) {
      return (<div className="biu-calendar__day is-disabled" key={index}>{day.day}</div>);
    } else {
      return (day.isToday ? <div className="biu-calendar__day active" key={index}>{day.day}</div> : <div className="biu-calendar__day" key={index}>{day.day}</div>);
    }
  });

  return (
    <div className="biu-calendar__day_container">{dayList}</div>
  )
}

function CalendarHeader () {
  const {year, month} = getCurrentDate();
  return (
    <div className="biu-calendar__header">
      {`${year}年${month}月`}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <div id="biu-calendar">
        <CalendarHeader />
        <WeekContainer />
        <DayContainer />
      </div>
    </div>
  );
}

export default App;
