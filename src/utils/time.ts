let dates = getCurrentDate();
let defaultYear = dates.year;
let defaultMonth = dates.month;
let defaultDay = dates.day;

function formateWithZero (num: number) {
  return num < 10 ? `0${num}` : num;
}

function formateDate (year: number, month: number, day: number) {
  return `${year}-${formateWithZero(month)}-${formateWithZero(day)}`;
}


export function getCurrentCalendar(year: number, month: number, day: number) {
  let dayDate = [];
  const totalDays = 42;
  const currentDate = new Date(formateDate(year, month, day));
  // setDate(0):设置为上个月最后一天
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const last = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
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
      isToday: dateString === formateDate(defaultYear, defaultMonth, defaultDay) ? true : false
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

export function getCurrentDate () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {year, month, day};
}

export function previousMonth (year: number, month: number) {
  if (month === 1) {
    month = 12;
    year = year - 1;
  } else {
    month = month - 1;
  }
  return {year, month};
}

export function nextMonth (year: number, month: number) {
  if (month === 12) {
    month = 1;
    year = year + 1;
  } else {
    month = month + 1;
  }
  return {year, month};
}

export {defaultYear, defaultMonth, defaultDay};
