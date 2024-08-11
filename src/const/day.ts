import dayjs from 'dayjs'
var buddhistEra = require('dayjs/plugin/buddhistEra')
var customParseFormat = require('dayjs/plugin/customParseFormat')
import 'dayjs/locale/th'
dayjs.locale('th')
dayjs.extend(buddhistEra)
dayjs.extend(customParseFormat)

export const buddhistDay = dayjs