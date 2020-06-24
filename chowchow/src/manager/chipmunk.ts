import createChipmunk, {cleanConfig} from 'chipmunk'
import {includes} from 'lodash'

const chipmunk = createChipmunk({
  endpoints: {
    um: `https://um.api.mediapeers.us/v20140601`,
    am: `https://am.api.mediapeers.us/v20140601`,
    pm: `https://pm.api.mediapeers.us/v20140601`,
    mc: `https://mc.api.mediapeers.us/v20140601`,
    sm: `https://sm.api.mediapeers.us/v20140601`,
    tuco: `https://tuco.api.mediapeers.mobi`,
  },
  headers: {
    'Affiliation-Id': `mpx`,
  },
  cache: {
    enabled: true,
    default: `runtime`,
  },
  errorInterceptor: (err) => {
    console.log(`intercepted an error. what now?`)
    return false
  },
  verbose: true
})

export const updateConfigFromDomain = (domain: string) => {
  if (includes(domain, 'mediapeers.mobi')) {
    chipmunk.updateConfig({
      endpoints: {
        um: `https://um.api.mediapeers.mobi/v20140601`,
        am: `https://am.api.mediapeers.mobi/v20140601`,
        pm: `https://pm.api.mediapeers.mobi/v20140601`,
        mc: `https://mc.api.mediapeers.mobi/v20140601`,
        sm: `https://sm.api.mediapeers.mobi/v20140601`,
      }
    })
  }
  else if (includes(domain, 'mediapeers.us')) {
    chipmunk.updateConfig({
      endpoints: {
        um: `https://um.api.mediapeers.us/v20140601`,
        am: `https://am.api.mediapeers.us/v20140601`,
        pm: `https://pm.api.mediapeers.us/v20140601`,
        mc: `https://mc.api.mediapeers.us/v20140601`,
        sm: `https://sm.api.mediapeers.us/v20140601`,
      }
    })
  }
  else if (includes(domain, 'mediapeers.biz')) {
    chipmunk.updateConfig({
      endpoints: {
        um: `https://um.api.mediapeers.biz/v20140601`,
        am: `https://am.api.mediapeers.biz/v20140601`,
        pm: `https://pm.api.mediapeers.biz/v20140601`,
        mc: `https://mc.api.mediapeers.biz/v20140601`,
        sm: `https://sm.api.mediapeers.biz/v20140601`,
      }
    })
  }

  chipmunk.cache.clear()
}

export const tuco = (task, opts?) => {
  return chipmunk.action('tuco.request', 'task', {
    raw: true,
    body: {
      task,
      opts,
      config: cleanConfig(chipmunk.currentConfig()),
    },
  })
}

export default chipmunk
