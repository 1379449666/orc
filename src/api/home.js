import qs from 'qs'
// axios
// import request from '@/utils/request'
// home api

const api = {
  filter: 'filter/filter.php',
  filter_edit: 'filter/filter_edit.php'
}
// axios
import request from '@/utils/request'

export function filter(data) { return request({ url: api.filter, method: 'post', data: qs.stringify(data), hideloading: true }) }
export function filter_edit(data) { return request({ url: api.filter_edit, method: 'post', data: qs.stringify(data), hideloading: true, timeout: 60000 }) }
