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

export function currentWeek (year: number, month: number, day: number) {
  const currentDate = new Date(formateDate(year, month, day));
  const timesStamp = currentDate.getTime();
  const currenDay = currentDate.getDay();
  const dates = [];
  for(var i = -1; i < 6; i++) {
    // .toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '')
    dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).getDate());
  }
  return dates
}

export {defaultYear, defaultMonth, defaultDay};

// const minYear = 1890;//最小年限
// const maxYear = 2100;//最大年限
// /**
//  * 1890 - 2100 年的农历数据
//  * 数据格式：[0,2,9,21936]
//  * [闰月所在月，0为没有闰月; *正月初一对应公历月; *正月初一对应公历日; *农历每月的天数的数组（需转换为二进制,得到每月大小，0=小月(29日),1=大月(30日)）;]
// */
// const lunarInfo = [[2,1,21,22184],[0,2,9,21936],[6,1,30,9656],[0,2,17,9584],[0,2,6,21168],[5,1,26,43344],[0,2,13,59728],[0,2,2,27296],[3,1,22,44368],[0,2,10,43856],[8,1,30,19304],[0,2,19,19168],[0,2,8,42352],[5,1,29,21096],[0,2,16,53856],[0,2,4,55632],[4,1,25,27304],[0,2,13,22176],[0,2,2,39632],[2,1,22,19176],[0,2,10,19168],[6,1,30,42200],[0,2,18,42192],[0,2,6,53840],[5,1,26,54568],[0,2,14,46400],[0,2,3,54944],[2,1,23,38608],[0,2,11,38320],[7,2,1,18872],[0,2,20,18800],[0,2,8,42160],[5,1,28,45656],[0,2,16,27216],[0,2,5,27968],[4,1,24,44456],[0,2,13,11104],[0,2,2,38256],[2,1,23,18808],[0,2,10,18800],[6,1,30,25776],[0,2,17,54432],[0,2,6,59984],[5,1,26,27976],[0,2,14,23248],[0,2,4,11104],[3,1,24,37744],[0,2,11,37600],[7,1,31,51560],[0,2,19,51536],[0,2,8,54432],[6,1,27,55888],[0,2,15,46416],[0,2,5,22176],[4,1,25,43736],[0,2,13,9680],[0,2,2,37584],[2,1,22,51544],[0,2,10,43344],[7,1,29,46248],[0,2,17,27808],[0,2,6,46416],[5,1,27,21928],[0,2,14,19872],[0,2,3,42416],[3,1,24,21176],[0,2,12,21168],[8,1,31,43344],[0,2,18,59728],[0,2,8,27296],[6,1,28,44368],[0,2,15,43856],[0,2,5,19296],[4,1,25,42352],[0,2,13,42352],[0,2,2,21088],[3,1,21,59696],[0,2,9,55632],[7,1,30,23208],[0,2,17,22176],[0,2,6,38608],[5,1,27,19176],[0,2,15,19152],[0,2,3,42192],[4,1,23,53864],[0,2,11,53840],[8,1,31,54568],[0,2,18,46400],[0,2,7,46752],[6,1,28,38608],[0,2,16,38320],[0,2,5,18864],[4,1,25,42168],[0,2,13,42160],[10,2,2,45656],[0,2,20,27216],[0,2,9,27968],[6,1,29,44448],[0,2,17,43872],[0,2,6,38256],[5,1,27,18808],[0,2,15,18800],[0,2,4,25776],[3,1,23,27216],[0,2,10,59984],[8,1,31,27432],[0,2,19,23232],[0,2,7,43872],[5,1,28,37736],[0,2,16,37600],[0,2,5,51552],[4,1,24,54440],[0,2,12,54432],[0,2,1,55888],[2,1,22,23208],[0,2,9,22176],[7,1,29,43736],[0,2,18,9680],[0,2,7,37584],[5,1,26,51544],[0,2,14,43344],[0,2,3,46240],[4,1,23,46416],[0,2,10,44368],[9,1,31,21928],[0,2,19,19360],[0,2,8,42416],[6,1,28,21176],[0,2,16,21168],[0,2,5,43312],[4,1,25,29864],[0,2,12,27296],[0,2,1,44368],[2,1,22,19880],[0,2,10,19296],[6,1,29,42352],[0,2,17,42208],[0,2,6,53856],[5,1,26,59696],[0,2,13,54576],[0,2,3,23200],[3,1,23,27472],[0,2,11,38608],[11,1,31,19176],[0,2,19,19152],[0,2,8,42192],[6,1,28,53848],[0,2,15,53840],[0,2,4,54560],[5,1,24,55968],[0,2,12,46496],[0,2,1,22224],[2,1,22,19160],[0,2,10,18864],[7,1,30,42168],[0,2,17,42160],[0,2,6,43600],[5,1,26,46376],[0,2,14,27936],[0,2,2,44448],[3,1,23,21936],[0,2,11,37744],[8,2,1,18808],[0,2,19,18800],[0,2,8,25776],[6,1,28,27216],[0,2,15,59984],[0,2,4,27424],[4,1,24,43872],[0,2,12,43744],[0,2,2,37600],[3,1,21,51568],[0,2,9,51552],[7,1,29,54440],[0,2,17,54432],[0,2,5,55888],[5,1,26,23208],[0,2,14,22176],[0,2,3,42704],[4,1,23,21224],[0,2,11,21200],[8,1,31,43352],[0,2,19,43344],[0,2,7,46240],[6,1,27,46416],[0,2,15,44368],[0,2,5,21920],[4,1,24,42448],[0,2,12,42416],[0,2,2,21168],[3,1,22,43320],[0,2,9,26928],[7,1,29,29336],[0,2,17,27296],[0,2,6,44368],[5,1,26,19880],[0,2,14,19296],[0,2,3,42352],[4,1,24,21104],[0,2,10,53856],[8,1,30,59696],[0,2,18,54560],[0,2,7,55968],[6,1,27,27472],[0,2,15,22224],[0,2,5,19168],[4,1,25,42216],[0,2,12,42192],[0,2,1,53584],[2,1,21,55592],[0,2,9,54560]];
	
// /**
//  * 判断农历年闰月数
//  * @param {Number} year 农历年
//  * return 闰月数 （月份从1开始）
//  */
// function getLunarLeapYear(year: number){
//   var yearData = lunarInfo[year - minYear];
//   return yearData[0];
// };
// /**
//  * 获取农历年份一年的每月的天数及一年的总天数
//  * @param {Number} year 农历年
//  */
// function getLunaYearDays(year: number) {
//   const yearData: number[] = lunarInfo[year - minYear];
//   const leapMonth: number = yearData[0];
//   const monthData: string = yearData[3].toString(2); // 转为2进制
//   const monthDataArr: string[] = monthData.split('');

//   //还原数据至16位,少于16位的在前面插入0（二进制存储时前面的0被忽略）
//   for (let i = 0; i < 16 - monthDataArr.length; i++) {
//     monthDataArr.unshift('0');
//   }

//   let len: number = leapMonth ? 13 : 12; // 本年有几个月
//   let yearDays: number = 0;
//   let monthDays: number[] = [];

//   for (let i = 0; i < len; i++) {
//   }
// }

// console.log('dfdf', getLunarLeapYear(2020));