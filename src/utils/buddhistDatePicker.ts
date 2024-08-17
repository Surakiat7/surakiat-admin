import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import { noteOnce } from 'rc-util/lib/warning';

import buddistEra from 'dayjs/plugin/buddhistEra';
import localeData from 'dayjs/plugin/localeData';

import th from 'dayjs/locale/th';

dayjs.locale(
  {
    ...th,
    formats: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'DD/MM/BBBB',
      LL: 'D MMMM BBBB',
      LLL: 'D MMMM BBBB เวลา H:mm',
      LLLL: 'วันddddที่ D MMMM BBBB เวลา H:mm',
    },
  },
);

// Dayjs.extend(buddistEra);
// console.log(dayjsGenerateConfig);
dayjs.extend(buddistEra);
dayjs.extend(localeData);

const parseLocale = (locale: string) => {
  // const mapLocale = localeMap[locale];
  // return mapLocale || locale.split('_')[0];
  return 'th';
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(
    false,
    'Not match any format. Please help to fire a issue about this.'
  );
};

const config = {
  ...dayjsGenerateConfig,
  getFixedDate: (string: any) => dayjs(string, ['BBBB-M-DD', 'BBBB-MM-DD']),
  setYear: (date: any, year: any) => {
    return date.year(year - 543);
  },
  getYear: (date: any) => Number(date.format('BBBB')),
  locale: {
    getWeekFirstDay: (locale: any) =>
      dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeekFirstDate: (locale: any, date: any) =>
      date.locale(parseLocale(locale)).weekday(0),
    getWeek: (locale: any, date: any) => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale: any) =>
      dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: (locale: any) =>
      dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale: any, date: any, format: any) => {
      const convertFormat = format.replace('YYYY', 'BBBB');
      return date.locale(parseLocale(locale)).format(convertFormat);
    },
    parse: (locale: any, text: any, formats: any) => {
      const localeStr = parseLocale(locale);
      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes('wo') || format.includes('Wo')) {
          // parse Wo
          const year = formatText.split('-')[0];
          const weekStr = formatText.split('-')[1];
          const firstWeek = dayjs(year, 'BBBB')
            .startOf('year')
            .locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, 'week');
            if (nextWeek.format('Wo') === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }
        const date = dayjs(formatText, format, true).locale(localeStr);
        if (date.isValid()) {
          return date;
        }
      }

      if (text) {
        parseNoMatchNotice();
      }
      return null;
    },
  },
};

const BuddhistDatePicker = generatePicker<Dayjs>(config);

export default BuddhistDatePicker;
